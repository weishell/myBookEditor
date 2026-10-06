// 右键 / DocBar 拖拽按钮触发的上下文菜单
//
// 字体选择用 antd Popover 做二级菜单（右侧弹出），
// Popover 打开时同步 setHoveringMenu(true) 防止主菜单 200ms 后自动关闭。
// 非空文本块 hover 时显示浮动工具栏（DocBar）。
// 「在下方插入」对任意块类型均可用，点击切换到块类型选择面板。
// 空段落（DocBar 图标为「+」）例外：直接铺开块类型选择面板，选中即原地插入，
// 省去「在下方插入」这一步（便于直接放流程图 / 画板等插件）。

import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { Popover } from 'antd';
import { Editor, Element, Node, Range, Transforms } from 'slate';
import { copyBlockToClipboard } from '@/utils/clipboard';
import { useMenu } from '@/plugins/menu-context';
import { setBlockFont } from '@/plugins/font';
import { setBlockAlignment, getBlockAlign, type TextAlignValue } from '@/utils/alignment';
import { setBlockIndent, getIndent, MAX_INDENT, isIndentable } from '@/utils/indent';
import { BlockElementType, LilistType } from '@/enums';
import { BlockTypePicker, createBlockNode } from '@/plugins/block-picker';
import { openAndInsertImages } from '@/plugins/image/uploadImage';
import {
  ChartTypePicker,
  ChartConfigDialog,
  createChartElement,
  type ChartKind,
} from '@/plugins/chart';
import { EmbedSettings, createEmbedElement, type EmbedAttrs } from '@/plugins/embed';
import FontPicker from '@/components/FontPicker';
import { ColorPickerPanel } from '@/components/ColorPicker';
import { setColor, setBackgroundColor } from '@/plugins/marks';
import { useInlineComments } from '@/plugins/inline-comment';
import {
  convertDocBarBlock,
  type DocBarConvertTarget,
  CONVERTIBLE_BLOCK_TYPES,
} from '@/plugins/docbar/docbar-commands';
import { getLilist, sortLilist } from '@/plugins/lilist';
import { blockTypeIconComponent } from '@/components/FloatBar/blockTypeIcons';
import AlignIndentPanel from '@/components/AlignIndentPanel';
import styles from './ContextMenu.module.less';

export const ContextMenu = () => {
  // 注意：这里刻意不取 closeMenu —— 它是"延迟 200ms + 仅当鼠标不在菜单上才真关"的
  // 语义，用来做"鼠标移开自动关闭"。点击菜单项一律走 forceCloseMenu（见 closeAfterAction）。
  const { visible, position, forceCloseMenu, setHoveringMenu, targetId } = useMenu();
  const menuRef = useRef<HTMLDivElement>(null);
  const editor = useSlateStatic();
  // 行内评论：菜单里的「评论」= 先选中整块文字，再复用 FloatBar 同款的 createFromSelection。
  // 注意：本组件必须渲染在 InlineCommentProvider 内部（见 core/index.tsx）。
  const { createFromSelection } = useInlineComments();

  // DocBar 场景：按 element.id 直接遍历 Slate 文档树找路径
  const getTargetPath = (): number[] | undefined => {
    if (!targetId) return undefined;
    const entries = Array.from(Editor.nodes(editor, { at: [] }));
    for (const [node, path] of entries) {
      if (Element.isElement(node) && (node as any).id === targetId) {
        return path;
      }
    }
    return undefined;
  };

  // 取当前光标（选区）所在的块路径。「在下方插入」应锚定光标所在处，
  // 否则当光标在一个空行、而鼠标却悬停在它上方某块时，新块会错落到光标上方。
  const getCaretBlockPath = (): number[] | undefined => {
    const { selection } = editor;
    if (!selection) return undefined;
    try {
      const entry = Editor.above(editor, {
        at: selection,
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      });
      return entry?.[1];
    } catch {
      return undefined;
    }
  };

  // 判断某块是否为空行（只有一个空文本子节点）
  const isEmptyLine = (p: number[]): boolean => {
    try {
      const node = Node.get(editor, p) as any;
      if (!Element.isElement(node)) return false;
      const children = (node as any).children ?? [];
      if (children.length !== 1) return false;
      return !!(children[0] && children[0].text === '');
    } catch {
      return false;
    }
  };

  const targetPath = getTargetPath();
  const targetNode = targetPath ? (Node.get(editor, targetPath) as any) : null;

  // 空段落：DocBar 图标是「+」。此时不弹整个块操作菜单，而是直接把「插入块 / 插件」
  // 面板（BlockTypePicker，含流程图、画板等）铺开，选中即在空行原地插入。
  // 注意要排除挂了 lilist 的空列表项 —— 列表项的 DocBar 图标是列表图标而非「+」。
  const isTargetEmptyParagraph =
    !!targetNode &&
    !!targetPath &&
    targetNode.type === BlockElementType.PARAGRAPH &&
    !targetNode.attrs?.lilist &&
    isEmptyLine(targetPath);

  const [fontOpen, setFontOpen] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);
  const [indentOpen, setIndentOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  // 应用对齐/缩进后触发重渲染，让子面板读取到更新后的块 attrs（高亮/禁用态实时刷新）
  const [, setFormatTick] = useState(0);

  // 图表插入两步式：类型选择弹框 → 配置页弹框 → 确定插入
  const [chartFlow, setChartFlow] = useState<'pick' | 'config' | null>(null);
  const [chartChoice, setChartChoice] = useState<{ kind: ChartKind; variant: string } | null>(null);
  const [chartInsertPath, setChartInsertPath] = useState<number[] | undefined>();

  // 内嵌网页：DocBar 菜单按钮 → 弹框填网址 → 确定后插入（portal 渲染，主菜单关闭仍可见）
  const [embedInsertPath, setEmbedInsertPath] = useState<number[] | undefined>();

  const adjustPosition = useCallback(() => {
    if (!menuRef.current) return;
    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const maxHeight = windowHeight - 40;
    if (rect.height > maxHeight) {
      menu.style.maxHeight = `${maxHeight}px`;
      menu.style.overflowY = 'auto';
    } else {
      menu.style.maxHeight = 'none';
      menu.style.overflowY = 'visible';
    }
    if (rect.bottom > windowHeight) {
      const newTop = windowHeight - rect.height - 20;
      if (newTop >= 0) menu.style.top = `${newTop}px`;
    }
  }, []);

  useEffect(() => {
    if (visible) requestAnimationFrame(adjustPosition);
  }, [visible, position, adjustPosition]);

  // 菜单关闭时重置内部状态
  useEffect(() => {
    if (!visible) {
      setFontOpen(false);
      setInsertOpen(false);
      setIndentOpen(false);
      setColorOpen(false);
    }
  }, [visible]);

  // 菜单打开期间：滚轮不能穿透到页面。
  //
  // 背景：浮层（主菜单 + antd Popover 子面板）浮在页面之上，但 wheel 事件仍会
  // 冒泡到 document 触发页面滚动 —— 在菜单上滚一下鼠标、下面的文档跟着跑。
  //
  // 规则：
  //  - 事件发生在浮层内部且该浮层自身可滚动 → 放它内部滚（长菜单要能滚到底）；
  //    滚到顶/底边界后 preventDefault，避免"滚动链接"继续带动页面。
  //  - 其余情况（遮罩上、浮层不可滚动）→ 直接 preventDefault，页面不动。
  //
  // 注意必须 { passive: false }：现代浏览器在 document 上把 wheel 默认设为
  // passive，不显式声明的话 preventDefault 会被忽略并告警。
  useEffect(() => {
    if (!visible) return;

    const findScrollableLayer = (target: EventTarget | null): HTMLElement | null => {
      const el = target instanceof HTMLElement ? target : null;
      if (!el) return null;
      // antd Popover 是 portal 到 body 的，不在 menuRef 里，单独判断
      const popover = el.closest('.ant-popover') as HTMLElement | null;
      if (popover) return popover;
      const menu = menuRef.current;
      if (menu && menu.contains(el)) return menu;
      return null;
    };

    const handleWheel = (e: WheelEvent) => {
      const layer = findScrollableLayer(e.target);
      // 不在浮层内（例如在遮罩上滚）→ 直接吃掉，页面不动
      if (!layer) {
        e.preventDefault();
        return;
      }
      // 浮层可滚动时让它内部滚；到顶/底后再滚就要拦住，否则带动页面
      const canScroll = layer.scrollHeight > layer.clientHeight + 1;
      if (!canScroll) {
        e.preventDefault();
        return;
      }
      const atTop = layer.scrollTop <= 0;
      const atBottom = layer.scrollTop + layer.clientHeight >= layer.scrollHeight - 1;
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, [visible]);

  // 复制：选中块并写入系统剪贴板（不直接插入）。
  // 真正的"粘贴"由 editor.insertFragment 处理（解析 x-slate-fragment、逐层重生成 id）。
  const handleCopy = () => {
    const path = getTargetPath();
    if (!path) return;
    copyBlockToClipboard(editor, path);
  };

  /**
   * 删除指定路径的块。
   * 特例：被删的是有序列表（lilist.list_type === 'ol'）项时，删除后同 list_id
   * 后续项会因编号空缺而错位，必须用 sortLilist 触发一次组内重排。
   * 无序列表 / 普通段落删除后不涉及编号，无需重排。
   */
  const removeBlockAtPath = (path: number[]) => {
    const node = Node.get(editor, path) as any;
    const lilist = getLilist(node);
    const listId = lilist?.list_id;
    const isOrdered = lilist?.list_type === LilistType.OL;
    const deletedIndex = path[0];

    Editor.withoutNormalizing(editor, () => {
      Transforms.removeNodes(editor, { at: path });
      if (isOrdered && listId) {
        // children 数组中，被删位置之后的同 list_id 块要从 deletedIndex 重新编号
        sortLilist(editor, [listId], deletedIndex);
      }
    });
  };

  /** 把光标安置到被删块原本所处的位置（同下标的块，越界则取最后一个），避免删完丢失焦点 */
  const moveCaretToIndex = (index: number) => {
    try {
      const count = (editor.children || []).length;
      if (count === 0) return;
      const target = Math.min(Math.max(index, 0), count - 1);
      Transforms.select(editor, Editor.start(editor, [target]));
      ReactEditor.focus(editor);
    } catch {
      /* ignore */
    }
  };

  const handleDelete = () => {
    const path = getTargetPath();
    if (!path) return;
    removeBlockAtPath(path);
  };

  /**
   * 剪切 = 复制到剪贴板 + 删除该块。
   * 先 await 复制结果：只有写剪贴板成功才删除，避免"复制失败还把内容删没了"的数据丢失。
   * 复制成功后删除原块，并把光标放回原位（否则块被删后编辑区会丢失焦点）。
   */
  const handleCut = async () => {
    const path = getTargetPath();
    if (!path) return;
    const index = path[0];
    const ok = await copyBlockToClipboard(editor, path);
    if (!ok) {
      console.warn('[ContextMenu] 剪切：写入剪贴板失败，已保留原内容');
      return;
    }
    removeBlockAtPath(path);
    moveCaretToIndex(index);
  };

  /**
   * 点击菜单项后的收尾：立即关闭菜单 + 清 hovering 标记。
   *
   * 为什么不能直接 forceCloseMenu 了事：菜单被卸载后它的 onMouseLeave 不会再触发，
   * hoveringMenu 会残留 true，而 DocBar 的"鼠标离开后 200ms 自动关闭"逻辑依赖它，
   * 残留会让下次自动关闭失效。所以这里顺手置 false。
   */
  const closeAfterAction = () => {
    setHoveringMenu(false);
    forceCloseMenu();
  };

  const handleMenuClick = (action: string) => {
    // 注意：点击菜单项后一律用 closeAfterAction 而不是 closeMenu。
    // closeMenu 是"延迟 200ms + 仅当鼠标不在菜单上才真关"，而点击时鼠标必定在菜单上，
    // 结果就是点了不关、要再点别处才消失（用户反馈的 bug）。
    if (action === 'copy') {
      handleCopy();
      closeAfterAction();
      return;
    }
    if (action === 'cut') {
      // handleCut 内部先 await 写剪贴板成功、再删除原块（复制失败则保留内容）
      void handleCut();
      closeAfterAction();
      return;
    }
    if (action === 'delete') {
      handleDelete();
      closeAfterAction();
      return;
    }

    const convertActions = new Set<string>([
      'text',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'h7',
      'h8',
      'h9',
      'numbered-list',
      'bulleted-list',
      'checkbox',
      'quote',
      'hint',
      'code-block',
    ]);
    if (convertActions.has(action)) {
      const targetPath = getTargetPath();
      if (targetPath) {
        convertDocBarBlock(editor, action as DocBarConvertTarget, targetPath);
      }
      closeAfterAction();
      return;
    }

    console.warn(action);
    closeAfterAction();
  };

  // 类型转换按钮对"可转换块"启用；其余按钮按当前实现状态保持禁用。
  // 'delete' 也归入转换类条件：可转换块（PARAGRAPH/HEADING/BLOCKQUOTE/TODO_LIST/CODE_BLOCK）
  // 都可以被用户删除。
  const CONVERT_ACTIONS = [
    'text',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'h7',
    'h8',
    'h9',
    'numbered-list',
    'bulleted-list',
    'checkbox',
    'quote',
    'code-block',
  ];

  const isConvertibleBlock = !!targetNode && CONVERTIBLE_BLOCK_TYPES.includes(targetNode.type);

  const DISABLED_ACTIONS = [
    'code',
    // 不可删的块（结构性子块等）也不能剪切 —— 剪切 = 复制 + 删除
    ...(!isConvertibleBlock ? ['cut', 'delete', ...CONVERT_ACTIONS] : []),
  ];

  // 当前目标块的"激活态"判定：基于 hover 块的 type + attrs 独立判断，
  // 每个按钮各算各的，自然支持多 active 并存（典型场景：H3 段落挂有序列表
  // → H3 和「有序列表」两个按钮同时蓝底高亮；图2 红框标注）。
  const targetAttrs = targetNode?.attrs;
  const targetType = targetNode?.type;
  const targetLilist = targetAttrs?.lilist;
  const isConvertActive = (action: DocBarConvertTarget): boolean => {
    if (!targetNode) return false;
    switch (action) {
      case 'text':
        return targetType === BlockElementType.PARAGRAPH && !targetLilist;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'h7':
      case 'h8':
      case 'h9': {
        const level = Number(action.slice(1));
        return targetType === BlockElementType.HEADING && targetAttrs?.level === level;
      }
      case 'numbered-list':
        return !!targetLilist && targetLilist.list_type === LilistType.OL;
      case 'bulleted-list':
        return !!targetLilist && targetLilist.list_type === LilistType.UL;
      case 'checkbox':
        return targetType === BlockElementType.TODO_LIST;
      case 'quote':
        return targetType === BlockElementType.BLOCKQUOTE;
      case 'hint':
        return targetType === BlockElementType.HINT_BLOCK;
      case 'code-block':
        return targetType === BlockElementType.CODE_BLOCK;
      default:
        return false;
    }
  };

  // 字体选择回调：DocBar 场景只改当前 hover 的块
  const handleFontChange = (fontFamily: string) => {
    const targetPath = getTargetPath();
    setBlockFont(editor, fontFamily, targetPath);
    setFontOpen(false);
    closeAfterAction();
  };

  // 对齐/缩进：作用于当前 hover 的块，应用后保持子面板展开，便于连续调整
  const handleAlign = (align: TextAlignValue) => {
    const p = getTargetPath();
    if (p) setBlockAlignment(editor, align, p);
    setFormatTick((t) => t + 1);
  };
  const handleIndent = (delta: number) => {
    const p = getTargetPath();
    if (p) {
      const changed = setBlockIndent(editor, p, delta);
      // 有序列表缩进会改变分组层级 → 必须重排序号（与 FloatBar 的缩进保持一致）
      const listId = getLilist(Node.get(editor, p) as any)?.list_id;
      if (changed && listId) sortLilist(editor, [listId]);
    }
    setFormatTick((t) => t + 1);
  };

  // 颜色：菜单场景没有文字选区，按「整块文本」处理 ——
  // 临时把选区扩到整块 → 打 mark → 还原原选区，避免在正文里留下大段选中高亮。
  const applyColorToBlock = (mutate: () => void) => {
    const p = getTargetPath();
    if (!p) return;
    try {
      const range = Editor.range(editor, p);
      if (Range.isCollapsed(range)) return; // 空块没有可上色的文字，直接忽略
      const prev = editor.selection;
      Editor.withoutNormalizing(editor, () => {
        Transforms.select(editor, range);
        mutate();
      });
      if (prev) Transforms.select(editor, prev);
      else Transforms.collapse(editor, { edge: 'end' });
    } catch {
      /* 选区操作异常不影响已写入的 mark */
    }
  };

  const handleTextColorChange = (color: string | null) => {
    applyColorToBlock(() => setColor(editor, color));
  };
  const handleBackgroundColorChange = (color: string | null) => {
    applyColorToBlock(() => setBackgroundColor(editor, color));
  };

  // 评论：选中整块文字 → 交给行内评论（与 FloatBar 的评论按钮同一套逻辑）
  const handleComment = () => {
    const p = getTargetPath();
    closeAfterAction();
    if (!p) return;
    try {
      const range = Editor.range(editor, p);
      if (Range.isCollapsed(range)) return; // 空块无可评论内容
      Transforms.select(editor, range);
      ReactEditor.focus(editor);
    } catch {
      /* ignore */
    }
    createFromSelection();
  };

  // 子面板的当前值与可用态：文本类块才允许对齐/缩进
  const isTextFormatable = !!targetNode && isIndentable(targetNode.type);
  const currentAlign = getBlockAlign(targetNode);
  const currentIndent = getIndent(targetNode);

  // list-item 的父容器是列表：在父列表之后插入，避免破坏列表结构
  const getInsertPathAfter = (path: number[]): number[] => {
    const node = Node.get(editor, path) as any;
    if (node?.type === BlockElementType.LIST_ITEM) {
      for (let i = path.length - 2; i >= 0; i--) {
        const parent = Node.get(editor, path.slice(0, i + 1)) as any;
        if (
          parent?.type === BlockElementType.BULLETED_LIST ||
          parent?.type === BlockElementType.NUMBERED_LIST
        ) {
          const parentPath = path.slice(0, i + 1);
          return [...parentPath.slice(0, -1), parentPath[parentPath.length - 1] + 1];
        }
      }
    }
    return [...path.slice(0, -1), path[path.length - 1] + 1];
  };

  // 在目标块下方插入新块并聚焦
  const handleInsertBlock = (
    type: BlockElementType,
    options?: { level?: number; columns?: number },
  ) => {
    // 锚点选择：
    //  - 空段落（DocBar「+」直接插入）：原地顶替悬停的这个空行，不受别处光标干扰；
    //  - 其它块：光标若在空行则以该空行为锚，否则以悬停块为锚（保留「在下方插入」直觉），
    //    兜底光标块。
    let anchorPath: number[] | undefined;
    if (isTargetEmptyParagraph) {
      anchorPath = getTargetPath();
    } else {
      const caretPath = getCaretBlockPath();
      anchorPath = (caretPath && isEmptyLine(caretPath) ? caretPath : getTargetPath()) ?? caretPath;
    }
    if (!anchorPath) return;
    // 锚点若是空行 → 直接替换该空行（复杂插件原地顶替，不留空行）；否则插入到目标块下方。
    const isAnchorEmpty = isEmptyLine(anchorPath);
    const insertPath = isAnchorEmpty ? anchorPath : getInsertPathAfter(anchorPath);
    if (isAnchorEmpty) {
      Transforms.removeNodes(editor, { at: anchorPath });
    }
    // 图片走文件选择 + 本地预览 + 模拟进度（无后端，见 uploadImage.ts）
    if (type === BlockElementType.IMAGE_BLOCK) {
      setInsertOpen(false);
      closeAfterAction();
      void openAndInsertImages(editor, insertPath);
      return;
    }
    // 图表走两步式：先选类型，再进配置页，最后才插入
    if (type === BlockElementType.CHART) {
      setChartInsertPath(insertPath);
      setInsertOpen(false);
      closeAfterAction();
      setChartFlow('pick');
      return;
    }
    // 内嵌网页走弹框式：先填网址，确定后才真正插入
    if (type === BlockElementType.EMBED) {
      setEmbedInsertPath(insertPath);
      setInsertOpen(false);
      closeAfterAction();
      return;
    }
    Transforms.insertNodes(editor, createBlockNode(type, options), { at: insertPath });
    Transforms.select(editor, Editor.start(editor, insertPath));
    ReactEditor.focus(editor);
    setInsertOpen(false);
    closeAfterAction();
  };

  // 内嵌网页弹框确认：真正插入节点
  const handleEmbedConfirm = (attrs: EmbedAttrs) => {
    if (embedInsertPath) {
      Transforms.insertNodes(editor, createEmbedElement(attrs) as any, { at: embedInsertPath });
      try {
        ReactEditor.focus(editor);
      } catch {
        /* ignore */
      }
    }
    setEmbedInsertPath(undefined);
  };

  // 内嵌网页弹框走 portal，即使主菜单已 forceClose 也要能渲染
  const renderEmbedFlow = () => {
    if (!embedInsertPath) return null;
    return createPortal(
      <EmbedSettings
        initial={{ url: '', height: 400 }}
        onConfirm={handleEmbedConfirm}
        onCancel={() => setEmbedInsertPath(undefined)}
      />,
      document.body,
    );
  };

  const handleChartPick = (kind: ChartKind, variant: string) => {
    setChartChoice({ kind, variant });
    setChartFlow('config');
  };

  const handleChartConfirm = (attrs: Parameters<typeof createChartElement>[0]) => {
    if (chartInsertPath && chartChoice) {
      Transforms.insertNodes(editor, createChartElement({ ...attrs, ...chartChoice }) as any, {
        at: chartInsertPath,
      });
      try {
        ReactEditor.focus(editor);
      } catch {
        /* ignore */
      }
    }
    setChartFlow(null);
    setChartChoice(null);
  };

  // 图表两步式弹框走 portal，即使主菜单已 forceClose 也要能渲染
  const renderChartFlow = () => {
    if (!chartFlow) return null;
    if (chartFlow === 'pick') {
      return createPortal(
        <ChartTypePicker onPick={handleChartPick} onCancel={() => setChartFlow(null)} />,
        document.body,
      );
    }
    return createPortal(
      <ChartConfigDialog
        kind={chartChoice?.kind ?? 'bar'}
        variant={chartChoice?.variant ?? 'vertical'}
        initial={undefined}
        onConfirm={handleChartConfirm}
        onCancel={() => setChartFlow(null)}
      />,
      document.body,
    );
  };

  if (!visible) {
    return (
      <>
        {renderChartFlow()}
        {renderEmbedFlow()}
      </>
    );
  }

  // 「在下方插入」对所有块类型始终可用（图片/表格/图表/空行等都能往下插）
  const canInsertBelow = !!targetNode && Element.isElement(targetNode);

  // 空段落：DocBar 的「+」直接把「插入块 / 插件」面板铺开（含流程图、画板等），
  // 选中即在空行原地插入 —— 不再先弹整个块操作菜单、也不需要再点一次「在下方插入」。
  if (isTargetEmptyParagraph) {
    return (
      <>
        {renderChartFlow()}
        {renderEmbedFlow()}
        <div className={styles.overlay} onClick={forceCloseMenu} />
        <div
          ref={menuRef}
          className={styles.menu}
          style={{ left: position.x, top: position.y }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setHoveringMenu(true)}
          onMouseLeave={() => setHoveringMenu(false)}
        >
          <BlockTypePicker onSelect={handleInsertBlock} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.overlay} onClick={forceCloseMenu} />
      <div
        ref={menuRef}
        className={styles.menu}
        style={{ left: position.x, top: position.y }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setHoveringMenu(true)}
        onMouseLeave={() => setHoveringMenu(false)}
      >
        {renderEmbedFlow()}
        <div className={styles.toolbar}>
          <button
            onClick={() => handleMenuClick('text')}
            className={isConvertActive('text') ? styles.btnPrimary : styles.btnToolBold}
            disabled={DISABLED_ACTIONS.includes('text')}
          >
            T
          </button>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => handleMenuClick(`h${n}` as DocBarConvertTarget)}
              className={
                isConvertActive(`h${n}` as DocBarConvertTarget)
                  ? styles.btnPrimary
                  : styles.btnToolBold
              }
              disabled={DISABLED_ACTIONS.includes(`h${n}`)}
            >
              H{n}
            </button>
          ))}
        </div>
        <div className={styles.toolbar}>
          {[6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => handleMenuClick(`h${n}` as DocBarConvertTarget)}
              className={
                isConvertActive(`h${n}` as DocBarConvertTarget)
                  ? styles.btnPrimary
                  : styles.btnToolBold
              }
              disabled={DISABLED_ACTIONS.includes(`h${n}`)}
            >
              H{n}
            </button>
          ))}
          <button
            onClick={() => handleMenuClick('numbered-list')}
            className={isConvertActive('numbered-list') ? styles.btnPrimary : styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('numbered-list')}
            title="有序列表"
          >
            {(() => {
              const Cmp = blockTypeIconComponent('numbered');
              return Cmp ? <Cmp size={16} /> : null;
            })()}
          </button>
          <button
            onClick={() => handleMenuClick('bulleted-list')}
            className={isConvertActive('bulleted-list') ? styles.btnPrimary : styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('bulleted-list')}
            title="无序列表"
          >
            {(() => {
              const Cmp = blockTypeIconComponent('bulleted');
              return Cmp ? <Cmp size={16} /> : null;
            })()}
          </button>
        </div>
        <div className={styles.divider} />
        <div className={styles.toolbar}>
          <button
            onClick={() => handleMenuClick('checkbox')}
            className={isConvertActive('checkbox') ? styles.btnPrimary : styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('checkbox')}
            title="任务"
          >
            {(() => {
              const Cmp = blockTypeIconComponent('todo');
              return Cmp ? <Cmp size={16} /> : null;
            })()}
          </button>
          <button
            onClick={() => handleMenuClick('code-block')}
            className={isConvertActive('code-block') ? styles.btnPrimary : styles.btnToolMono}
            disabled={DISABLED_ACTIONS.includes('code-block')}
            title="代码块"
          >
            {(() => {
              const Cmp = blockTypeIconComponent('code-block');
              return Cmp ? <Cmp size={16} /> : null;
            })()}
          </button>
          <button
            onClick={() => handleMenuClick('quote')}
            className={isConvertActive('quote') ? styles.btnPrimary : styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('quote')}
            title="引用"
          >
            {(() => {
              const Cmp = blockTypeIconComponent('quote');
              return Cmp ? <Cmp size={16} /> : null;
            })()}
          </button>
          <button
            onClick={() => handleMenuClick('hint')}
            className={isConvertActive('hint') ? styles.btnPrimary : styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('hint')}
            title="提示块"
          >
            {(() => {
              const Cmp = blockTypeIconComponent('hint');
              return Cmp ? <Cmp size={16} /> : null;
            })()}
          </button>
        </div>
        <div className={styles.divider} />
        <Popover
          open={indentOpen}
          onOpenChange={(open) => {
            setIndentOpen(open);
            setHoveringMenu(open);
          }}
          overlayInnerStyle={{ padding: 0 }}
          content={
            <div
              className={styles.alignFlyout}
              onMouseEnter={() => setHoveringMenu(true)}
              onMouseLeave={() => setHoveringMenu(false)}
            >
              <AlignIndentPanel
                disabled={!isTextFormatable}
                align={currentAlign}
                indent={currentIndent}
                maxIndent={MAX_INDENT}
                onAlign={handleAlign}
                onIndentChange={handleIndent}
              />
            </div>
          }
          trigger="click"
          placement="right"
        >
          <button
            className={`${styles.btnAction} ${indentOpen ? styles.btnActionActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setIndentOpen(!indentOpen);
              setHoveringMenu(true);
            }}
          >
            <span className={styles.actionIcon}>☰</span>
            <span>缩进和对齐</span>
            <span className={styles.actionArrow}>{indentOpen ? '⌄' : '›'}</span>
          </button>
        </Popover>
        <Popover
          open={fontOpen}
          onOpenChange={(open) => {
            setFontOpen(open);
            setHoveringMenu(open);
          }}
          content={
            <div
              onMouseEnter={() => setHoveringMenu(true)}
              onMouseLeave={() => setHoveringMenu(false)}
            >
              <FontPicker onFontChange={handleFontChange} />
            </div>
          }
          trigger="click"
          placement="right"
        >
          <button
            className={`${styles.btnAction} ${fontOpen ? styles.btnActionActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setFontOpen(!fontOpen);
              setHoveringMenu(true);
            }}
          >
            <span className={styles.actionIcon}>Aa</span>
            <span>字体</span>
            <span className={styles.actionArrow}>{fontOpen ? '⌄' : '›'}</span>
          </button>
        </Popover>
        <Popover
          open={colorOpen}
          onOpenChange={(open) => {
            setColorOpen(open);
            setHoveringMenu(open);
          }}
          // 让 ColorPickerPanel 自己控制内边距（embedded 模式下无自带外观）
          overlayInnerStyle={{ padding: 0 }}
          content={
            <div
              className={styles.colorFlyout}
              onMouseEnter={() => setHoveringMenu(true)}
              onMouseLeave={() => setHoveringMenu(false)}
            >
              <ColorPickerPanel
                embedded
                onTextColorChange={handleTextColorChange}
                onBackgroundColorChange={handleBackgroundColorChange}
              />
            </div>
          }
          trigger="click"
          placement="right"
        >
          <button
            className={`${styles.btnAction} ${colorOpen ? styles.btnActionActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setColorOpen(!colorOpen);
              setHoveringMenu(true);
            }}
          >
            <span className={styles.actionIcon}>🎨</span>
            <span>颜色</span>
            <span className={styles.actionArrow}>{colorOpen ? '⌄' : '›'}</span>
          </button>
        </Popover>
        <div className={styles.divider} />
        <button
          onClick={handleComment}
          className={styles.btnAction}
          disabled={DISABLED_ACTIONS.includes('comment')}
        >
          <span className={styles.actionIcon}>💬</span>
          <span>评论</span>
        </button>
        <button
          onClick={() => handleMenuClick('cut')}
          className={styles.btnAction}
          disabled={DISABLED_ACTIONS.includes('cut')}
        >
          <span className={styles.actionIcon}>✂</span>
          <span>剪切</span>
        </button>
        <button
          onClick={() => handleMenuClick('copy')}
          className={styles.btnAction}
          disabled={DISABLED_ACTIONS.includes('copy')}
        >
          <span className={styles.actionIcon}>📋</span>
          <span>复制</span>
        </button>
        <button
          onClick={() => handleMenuClick('delete')}
          className={styles.btnAction}
          disabled={DISABLED_ACTIONS.includes('delete')}
        >
          <span className={styles.actionIcon}>🗑</span>
          <span>删除</span>
        </button>
        <div className={styles.divider} />
        <button
          className={styles.btnAction}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            const path = getTargetPath();
            if (!path) return;
            setEmbedInsertPath(getInsertPathAfter(path));
            forceCloseMenu();
          }}
        >
          <span className={styles.actionIcon}>🌐</span>
          <span>内嵌网页</span>
        </button>
        {canInsertBelow && (
          <>
            <div className={styles.divider} />
            <Popover
              open={insertOpen}
              onOpenChange={(open) => {
                setInsertOpen(open);
                setHoveringMenu(open);
              }}
              // antd Popover 默认给内容容器 padding 12-16px，会让 BlockTypePicker
              // 内部看着比左侧 DocBar 块类型区宽一圈。归零让 picker 自身控制。
              overlayInnerStyle={{ padding: 0 }}
              content={
                <div
                  onMouseEnter={() => setHoveringMenu(true)}
                  onMouseLeave={() => setHoveringMenu(false)}
                >
                  <BlockTypePicker onSelect={handleInsertBlock} />
                </div>
              }
              trigger="click"
              placement="right"
            >
              <button
                className={`${styles.btnAction} ${insertOpen ? styles.btnActionActive : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setInsertOpen(!insertOpen);
                  setHoveringMenu(true);
                }}
              >
                <span className={styles.actionIcon}>＋</span>
                <span>在下方插入</span>
                <span className={styles.actionArrow}>{insertOpen ? '⌄' : '›'}</span>
              </button>
            </Popover>
          </>
        )}
      </div>
    </>
  );
};
