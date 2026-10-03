// 悬浮拖拽排序 —— 核心逻辑（无 UI 依赖，纯逻辑 + 命令式 DOM 层）
//
// 入口：DocBar 拖拽手柄 onMouseDown 时调用 beginDragSort(editor, pluginId)。
// 流程：
//   1. 构建「块注册表」：遍历 Slate 树，记录所有带 id 的用户可见块的 path/type/rect/DOM。
//   2. 指针移动时，用 elementFromPoint 找到指针下「最深可用容器」，解析出落点
//      (容器 path + 子索引)，渲染插入指示线。
//   3. 松开后调用 Transforms.moveNodes 搬运节点；有序/无序列表编号由
//      withLilist 在根节点归一化时自动重排（moveNodes 会触发 root normalize）。
//
// 落点模型：拖拽块总是作为某容器的一个「兄弟项」插入 ——
//   - 悬停在顶级块上 → 在顶级重排；
//   - 悬停在提示块/分栏/引用块内部文本上 → 插入进该容器；
//   - 若容器不允许该类型（表格进提示块、分栏嵌表格、引用装非段落等），
//     自动上浮到它的父级（通常是顶级），从而“禁拖入”表现成立。
import { Editor, Node, Path, Element, Transforms } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType } from '@/enums';
import { getLilist, sortLilist } from '@/plugins/lilist/lilist-model';
import { sortInnerLilist } from '@/plugins/hint-block/hint-block-container';

/** 拖拽进行 / 结束时派发的全局事件，DocBar 据此隐藏自身 */
export const DRAG_SORT_EVENT = 'trae:drag-sort';

/** 结构内部块 / 不可作为拖拽源的类型（整块为单位被拖动的应是外层容器） */
const NON_SOURCE_TYPES: BlockElementType[] = [
  BlockElementType.TABLE_ROW,
  BlockElementType.TABLE_CELL,
  BlockElementType.CODE_LINE,
  BlockElementType.COLUMN,
  BlockElementType.HEADING_TITLE,
];

/** 可作为“把块拖进其中”的容器类型（顶级根容器不在此列，恒允许） */
const DROP_CONTAINER_TYPES: BlockElementType[] = [
  BlockElementType.HINT_BLOCK,
  BlockElementType.COLUMN,
  BlockElementType.BLOCKQUOTE,
  BlockElementType.TABLE_CELL,
];

/** 文本类插件：提示块只允许这类块进入（不含引用块） */
const TEXT_PLUGIN_TYPES: BlockElementType[] = [
  BlockElementType.PARAGRAPH,
  BlockElementType.HEADING,
  BlockElementType.TODO_LIST,
  BlockElementType.LIST_ITEM,
  BlockElementType.BULLETED_LIST,
  BlockElementType.NUMBERED_LIST,
];

/** 分栏内禁止嵌入的类型（分栏不能再嵌分栏，也不能嵌表格） */
const FORBIDDEN_IN_COLUMN: BlockElementType[] = [
  BlockElementType.TABLE,
  BlockElementType.COLUMN_GROUP,
  BlockElementType.COLUMN,
];

/** 表格单元格内禁止嵌入的类型（不可再嵌表格，也不可嵌分栏，防止结构破坏） */
const FORBIDDEN_IN_TABLE_CELL: BlockElementType[] = [
  BlockElementType.TABLE,
  BlockElementType.COLUMN_GROUP,
  BlockElementType.COLUMN,
];

/** 该类型是否可被拖拽（作为拖拽源） */
export const isDragSortableType = (type?: string | null): boolean =>
  !!type && !NON_SOURCE_TYPES.includes(type as BlockElementType);

/** 某类型能否作为某容器的子项；parentType 为空表示顶级根容器（恒真） */
export const isTypeAllowedIn = (
  parentType: BlockElementType | null,
  childType?: string,
): boolean => {
  if (!parentType) return true;
  if (parentType === BlockElementType.HINT_BLOCK) {
    return !!childType && TEXT_PLUGIN_TYPES.includes(childType as BlockElementType);
  }
  if (parentType === BlockElementType.COLUMN) {
    return !!childType && !FORBIDDEN_IN_COLUMN.includes(childType as BlockElementType);
  }
  if (parentType === BlockElementType.BLOCKQUOTE) {
    return childType === BlockElementType.PARAGRAPH;
  }
  if (parentType === BlockElementType.TABLE_CELL) {
    return !!childType && !FORBIDDEN_IN_TABLE_CELL.includes(childType as BlockElementType);
  }
  return false;
};

/** 判断拖拽块可否落入某容器（含环路防护：不能拖进自己或自己的后代） */
const canDropInto = (
  editor: Editor,
  draggedPath: Path,
  containerPath: Path,
  containerType: BlockElementType | null,
): boolean => {
  if (Path.equals(draggedPath, containerPath) || Path.isAncestor(draggedPath, containerPath)) {
    return false;
  }
  if (containerType == null) return true; // 顶级根容器
  if (!DROP_CONTAINER_TYPES.includes(containerType)) return false;
  const node = Node.get(editor, draggedPath) as any;
  return isTypeAllowedIn(containerType, node?.type);
};

interface RegNode {
  id: string;
  type: BlockElementType;
  path: Path;
  parentPath: Path;
  el: HTMLElement;
  rect: DOMRect;
}

/** 遍历 Slate 树，登记所有能渲染出 DOM 的用户可见块 */
const buildRegistry = (editor: Editor): RegNode[] => {
  const reg: RegNode[] = [];
  const iter = Editor.nodes(editor, {
    at: [],
    match: (n) => Element.isElement(n) && !!(n as any).id,
  }) as Iterable<[any, Path]>;
  for (const [node, path] of iter) {
    if (!Element.isElement(node) || !(node as any).id) continue;
    const isCell = (node as any).type === BlockElementType.TABLE_CELL;
    const selector = isCell
      ? `[data-table-cell-id="${(node as any).id}"]`
      : `[data-plugin-id="${(node as any).id}"]`;
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) continue;
    reg.push({
      id: (node as any).id,
      type: (node as any).type as BlockElementType,
      path,
      parentPath: path.slice(0, -1),
      el,
      rect: el.getBoundingClientRect(),
    });
  }
  return reg;
};

/** 计算在容器内应插入的子索引（按指针 Y 与子块中线的相对位置） */
const computeChildIndex = (
  editor: Editor,
  reg: RegNode[],
  containerPath: Path,
  y: number,
): number => {
  const children = reg
    .filter((r) => Path.equals(r.parentPath, containerPath))
    .sort((a, b) => a.rect.top - b.rect.top);

  for (const ch of children) {
    if (y < ch.rect.top + ch.rect.height / 2) {
      return ch.path[ch.path.length - 1];
    }
  }
  // 追加到末尾：索引 = 容器「元素类型子节点」数
  try {
    const [, cn] = Editor.node(editor, containerPath);
    return (cn as any).children.filter((c: any) => Element.isElement(c)).length;
  } catch {
    return children.length;
  }
};

interface DropTarget {
  containerPath: Path;
  index: number;
  containerType: BlockElementType | null;
  containerRect: DOMRect | null;
  lineRect: { top: number; left: number; width: number };
}

/** 解析指针 (x,y) 下的落点；无可用容器时回退到顶级追加 */
const resolveDrop = (
  editor: Editor,
  reg: RegNode[],
  draggedPath: Path,
  x: number,
  y: number,
): DropTarget => {
  // 收集「可用容器」：根 + 所有允许该块进入、且非自身后代的容器
  const candidates: RegNode[] = [];
  for (const r of reg) {
    if (!DROP_CONTAINER_TYPES.includes(r.type)) continue;
    if (!canDropInto(editor, draggedPath, r.path, r.type)) continue;
    if (r.rect.left <= x && x <= r.rect.right && r.rect.top <= y && y <= r.rect.bottom) {
      candidates.push(r);
    }
  }
  // 取路径最深的容器（即最内层命中）
  let container: RegNode | null = null;
  for (const c of candidates) {
    if (!container || c.path.length > container.path.length) container = c;
  }

  const containerPath = container ? container.path : [];
  const containerType = container ? container.type : null;
  const index = computeChildIndex(editor, reg, containerPath, y);

  // 计算插入指示线的位置
  const containerRect = container
    ? container.rect
    : (document.querySelector('[data-paper]')?.getBoundingClientRect() ?? null);
  const children = reg
    .filter((r) => Path.equals(r.parentPath, containerPath))
    .sort((a, b) => a.rect.top - b.rect.top);

  let lineTop: number;
  if (children.length) {
    const js = getInsertIndexAmong(children, y);
    if (js >= children.length) {
      lineTop = children[children.length - 1].rect.bottom;
    } else {
      lineTop = children[js].rect.top;
    }
  } else {
    lineTop = containerRect ? containerRect.top + 0 : y;
  }

  const left = containerRect ? containerRect.left : 40;
  const width = containerRect ? containerRect.width : 600;

  return {
    containerPath,
    index,
    containerType,
    containerRect,
    lineRect: { top: lineTop, left, width },
  };
};

/** 在已排序的 child 中按中线切分，返回应在其中插入的数组下标 */
const getInsertIndexAmong = (sorted: { rect: DOMRect }[], y: number): number => {
  let i = 0;
  for (; i < sorted.length; i++) {
    if (y < sorted[i].rect.top + sorted[i].rect.height / 2) break;
  }
  return i;
};

/** 按 id 在整棵树里重定位块路径（移动后原 path 已失效） */
const findNodePath = (editor: Editor, id: string): Path | null => {
  const iter = Editor.nodes(editor, {
    at: [],
    match: (n) => Element.isElement(n) && (n as any).id === id,
  }) as Iterable<[any, Path]>;
  for (const [, path] of iter) return path;
  return null;
};

/** 写回某个块的 lilist（在 attrs 上原地合并） */
const setNodeLilist = (editor: Editor, path: Path, lilist: any): void => {
  const node = Node.get(editor, path) as any;
  Transforms.setNodes(editor, { attrs: { ...(node?.attrs || {}), lilist } } as any, { at: path });
};

/** 移除某个块的 lilist（恢复为普通宿主块） */
const clearLilist = (editor: Editor, path: Path): void => {
  const node = Node.get(editor, path) as any;
  const attrs = { ...(node?.attrs || {}) };
  delete attrs.lilist;
  Transforms.setNodes(editor, { attrs } as any, { at: path });
};

/** 列表连通性：同列表类型 + 同宿主类型（H 标题 OL 不同 level 互相连通） */
const isLilistConnectable = (nodeA: any, nodeB: any, aLilist: any, bLilist: any): boolean => {
  if (!aLilist || !bLilist || aLilist.list_type !== bLilist.list_type) return false;
  const bothHeading =
    nodeA?.type === BlockElementType.HEADING && nodeB?.type === BlockElementType.HEADING;
  return bothHeading || nodeA?.type === nodeB?.type;
};

/**
 * 拖拽移动后的列表整编：
 *  - 落到顶级（与原先列表分离）：若前后相邻是兼容列表则加入（list_custom 置 false）；
 *    否则升级为独立新列表（新 uuid），原有列表组自动重排编号 —— 覆盖“加入/新建/自己更新”。
 *  - 落入容器：提示块保留内部列表编号（作用域在容器内）；其余容器（引用/分栏/表格单元格）
 *    视为纯文本容器，剥离列表属性，避免出现孤立的数字前缀。
 */
const reconcileLilistAfterMove = (editor: Editor, path: Path): void => {
  const node = Node.get(editor, path) as any;
  const lilist = getLilist(node);
  if (!lilist) return;

  if (path.length > 1) {
    const parentPath = path.slice(0, -1);
    const parentType = (Node.get(editor, parentPath) as any)?.type as BlockElementType;
    if (parentType === BlockElementType.HINT_BLOCK) {
      // 提示块内部有自己的列表编号作用域
      sortInnerLilist(editor, parentPath);
    } else {
      // 引用/分栏/表格单元格：改为纯文本（先清属性，再重排它离开的原组）
      const oldId = lilist.list_id;
      clearLilist(editor, path);
      sortLilist(editor, [oldId]);
    }
    return;
  }

  // 顶级：决定加入相邻列表还是独立成新列表
  const index = path[0];
  const children = (editor as any).children as any[];
  const prevNode = index > 0 ? children[index - 1] : null;
  const nextNode = index < children.length - 1 ? children[index + 1] : null;
  const prevLilist = getLilist(prevNode);
  const nextLilist = getLilist(nextNode);

  const oldId = lilist.list_id;
  const prevTarget =
    prevLilist && isLilistConnectable(node, prevNode, lilist, prevLilist) ? prevLilist : null;
  if (prevTarget) {
    setNodeLilist(editor, path, { ...lilist, list_id: prevTarget.list_id, list_custom: false });
    sortLilist(editor, [oldId, prevTarget.list_id]);
    return;
  }
  const nextTarget =
    nextLilist && isLilistConnectable(node, nextNode, lilist, nextLilist) ? nextLilist : null;
  if (nextTarget) {
    setNodeLilist(editor, path, { ...lilist, list_id: nextTarget.list_id, list_custom: false });
    sortLilist(editor, [oldId, nextTarget.list_id]);
    return;
  }
  // 与任何列表都不相邻：独立成新列表（新 uuid），原列表组重排编号
  const newId = uuidv4();
  setNodeLilist(editor, path, {
    ...lilist,
    list_id: newId,
    list_number: 1,
    list_custom: true,
  });
  sortLilist(editor, [oldId, newId]);
};

/** 执行落点移动；移动后整编列表编号，并把光标折叠到该块首 */
const applyMove = (editor: Editor, draggedPath: Path, target: DropTarget): Path | null => {
  const targetPath = target.containerPath.concat([target.index]);
  if (Path.equals(draggedPath, targetPath)) return null;
  if (Path.isAncestor(draggedPath, target.containerPath)) return null;
  const movedId = (Node.get(editor, draggedPath) as any)?.id;
  try {
    Transforms.moveNodes(editor, { at: draggedPath, to: Path.relative(targetPath, []) });
  } catch {
    return null;
  }
  // 移动后按 id 重定位最终路径：先整编列表，再折叠光标
  if (movedId) {
    try {
      const finalPath = findNodePath(editor, movedId);
      if (finalPath) {
        reconcileLilistAfterMove(editor, finalPath);
        Transforms.select(editor, Editor.start(editor, finalPath));
      }
    } catch {
      /* void 块点选失败可忽略 */
    }
  }
  return targetPath;
};

// ---------- 命令式拖拽层（幽灵 + 插入线 + 事件） ----------

interface Ghost {
  el: HTMLElement;
  line: HTMLElement;
}

const makeGhost = (type: BlockElementType, text: string): Ghost => {
  const ghost = document.createElement('div');
  ghost.style.cssText = `
    position: fixed; z-index: 99999; pointer-events: none;
    box-sizing: border-box; border-radius: 8px; min-width: 180px; max-width: 360px;
    background: var(--lw-paper, #fff);
    border: 1px solid rgba(24,144,255,0.5);
    box-shadow: 0 8px 24px rgba(0,0,0,0.14);
    padding: 8px 12px; font-size: 14px; color: #222; display: flex; align-items: center; gap: 8px;
    opacity: 0.95; contain: layout paint;
  `;
  const grip = document.createElement('span');
  grip.style.cssText =
    'width:14px;height:18px;flex:none;background:repeating-linear-gradient(#bbb 0 2px,transparent 2px 4px);border-radius:2px;';
  const label = document.createElement('span');
  label.style.cssText = 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
  label.textContent = text || blockTypeLabel(type);
  ghost.appendChild(grip);
  ghost.appendChild(label);

  const line = document.createElement('div');
  line.style.cssText = `
    position: fixed; height: 2px; z-index: 99998; pointer-events: none;
    background: #1890ff; border-radius: 1px;
  `;
  // 左侧指示点
  const dot = document.createElement('div');
  dot.style.cssText =
    'position:absolute;left:-4px;top:-3px;width:8px;height:8px;background:#1890ff;border-radius:50%;';
  line.appendChild(dot);

  document.body.appendChild(ghost);
  document.body.appendChild(line);
  return { el: ghost, line };
};

const blockLabelCache: Record<string, string> = {};
const blockTypeLabel = (type: BlockElementType): string => {
  if (blockLabelCache[type]) return blockLabelCache[type];
  const label = DOCBAR_ALIAS[type] || type;
  blockLabelCache[type] = label;
  return label;
};

// 简洁类型中文名（供幽灵卡片显示）
const DOCBAR_ALIAS: Record<string, string> = {
  paragraph: '段落',
  heading: '标题',
  blockquote: '引用',
  'hint-block': '提示块',
  'code-block': '代码块',
  table: '表格',
  'column-group': '分栏',
  'list-item': '列表项',
  'numbered-list': '有序列表',
  'bulleted-list': '无序列表',
  'todo-list': '待办',
  'image-block': '图片',
  drawio: '流程图',
  countdown: '倒计时',
  calendar: '日历',
  timeline: '时间轴',
  chart: '图表',
  divider: '分割线',
  'file-block': '文件',
  'video-block': '视频',
  embed: '嵌入',
  drawboard: '画板',
  'inline-formula': '公式',
};

const buildSourcePreview = (editor: Editor, path: Path): string => {
  let text = '';
  try {
    text = Node.string(Node.get(editor, path)).replace(/\s+/g, ' ').trim().slice(0, 24);
  } catch {
    text = '';
  }
  return text;
};

interface DragSortSession {
  editor: Editor;
  draggedPath: Path;
  reg: RegNode[];
  ghost: Ghost;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  scrollContainer: HTMLElement | null;
  refreshPending: boolean; // 矩形坐标需刷新（指针移动 / 容器滚动后）
  active: boolean; // 是否已越过移动阈值、真正进入拖拽
  valid: boolean;
}

let session: DragSortSession | null = null;
let rafId = 0;

/** 拖拽期间容器滚动步长（px/帧） */
const SCROLL_SPEED = 22;
/** 触发自动滚动的边缘带（px，靠近上/下边缘开始滚动） */
const SCROLL_ZONE = 48;

/** 找到承载文档的可滚动祖先（沿源块向上找；兜底到整页滚动元素） */
const findScrollContainer = (sourceEl: HTMLElement | null): HTMLElement | null => {
  let cursor = sourceEl ? sourceEl.parentElement : null;
  while (cursor) {
    const st = getComputedStyle(cursor);
    if (
      (st.overflowY === 'auto' || st.overflowY === 'scroll') &&
      cursor.scrollHeight > cursor.clientHeight + 1
    ) {
      return cursor;
    }
    cursor = cursor.parentElement;
  }
  return (document.scrollingElement as HTMLElement) || document.documentElement;
};

/** 重读所有登记块的视口矩形（容器滚动后坐标会变） */
const refreshRegistryRects = (s: DragSortSession): void => {
  for (const r of s.reg) r.rect = r.el.getBoundingClientRect();
};

/** 指针贴近容器上/下可见边缘时自动滚动，返回是否发生了滚动 */
const maybeAutoScroll = (s: DragSortSession): boolean => {
  const sc = s.scrollContainer;
  if (!sc) return false;
  // 用「可视区域」而非容器完整 rect 判断边缘：整页滚动时容器 rect 顶部可为负、底部可远大于视口，
  // 指针 clientY 被视口高度钳制，永远够不到底部 zone，导致向下滚动失效。
  // 这里把边界钳制到 [0, 视口高度]，即用户在日常视口中能到达的边缘。
  const cr = sc.getBoundingClientRect();
  const vTop = Math.max(cr.top, 0);
  const vBottom = Math.min(cr.bottom, window.innerHeight);
  const vHeight = vBottom - vTop;
  if (vHeight <= 0) return false;
  const zone = Math.min(SCROLL_ZONE, vHeight / 4);
  let dy = 0;
  if (s.lastY < vTop + zone) {
    dy = -((vTop + zone - s.lastY) / zone) * SCROLL_SPEED;
  } else if (s.lastY > vBottom - zone) {
    dy = ((s.lastY - (vBottom - zone)) / zone) * SCROLL_SPEED;
  }
  if (dy === 0) return false;
  const maxScroll = sc.scrollHeight - sc.clientHeight;
  const before = sc.scrollTop;
  sc.scrollTop = Math.max(0, Math.min(maxScroll, sc.scrollTop + dy));
  return sc.scrollTop !== before;
};

/** 恒定的动画帧循环：自动滚动 + 按需刷新坐标 + 刷新落点指示（拖拽期间持续运行） */
const dragLoop = () => {
  if (!session) {
    rafId = 0;
    return;
  }
  const s = session;
  if (s.active) {
    if (s.refreshPending) {
      refreshRegistryRects(s);
      s.refreshPending = false;
    }
    if (maybeAutoScroll(s)) {
      refreshRegistryRects(s);
    }
    updateDrag(s.lastX, s.lastY);
  }
  rafId = window.requestAnimationFrame(dragLoop);
};

const emitDragSort = (dragging: boolean) => {
  window.dispatchEvent(new CustomEvent(DRAG_SORT_EVENT, { detail: { dragging } }));
};

const cleanupSession = () => {
  if (!session) return;
  const { ghost } = session;
  ghost.el.remove();
  ghost.line.remove();
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
  if (rafId) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
  window.removeEventListener('mousemove', onPointerMove);
  window.removeEventListener('mouseup', onPointerUp);
  window.removeEventListener('keydown', onPointerKeydown);
  session = null;
  emitDragSort(false);
};

const THRESHOLD = 4;

const onPointerMove = (e: MouseEvent) => {
  if (!session) return;
  const s = session;
  s.lastX = e.clientX;
  s.lastY = e.clientY;
  s.refreshPending = true;
  if (!s.active) {
    if (Math.hypot(e.clientX - s.startX, e.clientY - s.startY) < THRESHOLD) return;
    s.active = true;
    emitDragSort(true);
    s.ghost.el.style.display = '';
    s.ghost.line.style.display = '';
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    s.refreshPending = true;
  }
  if (!rafId) rafId = window.requestAnimationFrame(dragLoop);
};

const updateDrag = (x: number, y: number) => {
  if (!session) return;
  const s = session;
  // 幽灵卡片右下偏移，避免盖住光标下的块
  s.ghost.el.style.left = `${x + 14}px`;
  s.ghost.el.style.top = `${y + 14}px`;

  const target = resolveDrop(s.editor, s.reg, s.draggedPath, x, y);
  // 始终有效（顶级兜底）；但若目标与当前位置相同，可视为无效暂停
  const same = Path.equals(s.draggedPath, target.containerPath.concat([target.index]));
  s.valid = !same;
  s.ghost.line.style.display = s.valid ? '' : 'none';
  s.ghost.line.style.top = `${target.lineRect.top}px`;
  s.ghost.line.style.left = `${target.lineRect.left}px`;
  s.ghost.line.style.width = `${Math.max(0, target.lineRect.width)}px`;
};

const onPointerUp = () => {
  if (!session) return;
  const s = session;
  const target = resolveDrop(s.editor, s.reg, s.draggedPath, s.lastX, s.lastY);
  if (s.active) {
    applyMove(s.editor, s.draggedPath, target);
  }
  cleanupSession();
};

const onPointerKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') cleanupSession();
};

/**
 * 从 DocBar 拖拽手柄按下时启动一次拖拽排序。
 * @param editor     slate 编辑器实例
 * @param pluginId   被拖拽块的 data-plugin-id
 * @param startX     按下时的视口 X（用于越过移动阈值启用拖拽）
 * @param startY     按下时的视口 Y
 */
export const beginDragSort = (editor: Editor, pluginId: string, startX: number, startY: number) => {
  if (session) cleanupSession();
  const draggedPath = findNodePath(editor, pluginId);
  if (!draggedPath) return;
  const node = Node.get(editor, draggedPath) as any;
  if (!Element.isElement(node)) return;
  if (!isDragSortableType(node?.type)) return;

  // 压下即通知 DocBar 隐藏（避免拖拽期间源块的选框还悬着），并清空选区
  emitDragSort(true);
  editor.deselect();

  const reg = buildRegistry(editor);
  const sourceEl = document.querySelector(`[data-plugin-id="${pluginId}"]`) as HTMLElement | null;
  const preview = buildSourcePreview(editor, draggedPath);
  const ghost = makeGhost(node.type as BlockElementType, preview);
  ghost.el.style.display = 'none';
  ghost.line.style.display = 'none';
  // 让幽灵卡片看起来像源块轮廓
  if (sourceEl) {
    const r = sourceEl.getBoundingClientRect();
    ghost.el.style.width = `${Math.min(Math.max(r.width, 180), 420)}px`;
  }

  session = {
    editor,
    draggedPath,
    reg,
    ghost,
    startX,
    startY,
    lastX: startX,
    lastY: startY,
    scrollContainer: findScrollContainer(sourceEl),
    refreshPending: true,
    active: false,
    valid: true,
  };

  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
  window.addEventListener('keydown', onPointerKeydown);

  // 预热注册表与滚动容器定位，并启动帧循环（未越过阈值前仅空转）
  window.requestAnimationFrame(() => {
    if (!session) return;
    session.reg = buildRegistry(editor);
    if (rafId) rafId = window.requestAnimationFrame(dragLoop);
  });
};
