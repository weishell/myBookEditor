// 斜杠命令的瞬态 UI store。
//
// 与上传进度类似：它独立于 Slate 文档，也不参与撤销/重做历史。
// 编辑器 core 把 onChange 改成了 no-op，Slate 不会主动触发 React 重渲染，
// 所以这里用"模块级单例 + useSyncExternalStore"驱动 SlashMenu，既可控又零侵入。
import { Editor, Element, Node, Path } from 'slate';

export interface SlashPoint {
  /** '/' 所在的 text 叶子 path */
  path: number[];
  /** '/' 在叶子文本内的 offset */
  offset: number;
}

export interface SlashState {
  open: boolean;
  /** '/' 之后已输入的过滤关键字（不含 '/' 本身） */
  query: string;
  /** 光标锚点定位，用于弹层摆放 */
  rect: { left: number; top: number; height: number } | null;
  /** 触发块（触发斜杠时 '/' 所在的元素）的 path */
  blockPath: number[] | null;
  /** 触发块的 id：用于跨结构变更判断光标是否仍在同一块（比 path 稳定） */
  blockId: string | null;
  /** '/' 所在的叶子点位：用于删掉 "/query" 及重建 query */
  slashPoint: SlashPoint | null;
}

let state: SlashState = {
  open: false,
  query: '',
  rect: null,
  blockPath: null,
  blockId: null,
  slashPoint: null,
};

let editorRef: Editor | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const slashStore = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  /** 打开：只允许由 withSlashCommand 检测到合法 '/' 时调用 */
  open: (next: Omit<SlashState, 'open' | 'query'>) => {
    state = { ...state, ...next, open: true, query: '' };
    emit();
  },
  /** 更新 query（连同光标位置一起刷新，弹层跟随光标） */
  update: (
    query: string,
    rect: SlashState['rect'],
    blockPath: number[] | null,
    blockId: string | null,
  ) => {
    if (!state.open) return;
    state = { ...state, query, rect, blockPath, blockId };
    emit();
  },
  close: () => {
    if (!state.open) return;
    state = { ...state, open: false };
    emit();
  },
};

export const setSlashEditor = (editor: Editor) => {
  editorRef = editor;
};

export const getSlashEditor = () => editorRef;

// ---------- 光标块定位 ----------

/**
 * 计算光标当前所在"叶子元素块"的 path（用于转换/插入）。
 * 若祖先链落在代码块 / 独立标题里则返回 null（这两种场景禁止斜杠）。
 */
export const getCurrentBlockPath = (editor: Editor): number[] | null => {
  const { selection } = editor;
  if (!selection) return null;
  let forbid = false;
  let blockPath: number[] | null = null;
  for (const entry of Node.ancestors(editor, selection, { reverse: true })) {
    const [node, path] = entry;
    if (!Editor.isEditor(node) && Element.isElement(node)) {
      const type = (node as any).type;
      if (type === 'code_block' || type === 'heading_title') {
        forbid = true;
        break;
      }
      if (!blockPath) blockPath = path;
    }
  }
  if (forbid) return null;
  // 最内层元素兜底：若上面的祖先遍历没拿到（极端嵌套），退回直接取 selection 的父元素
  if (!blockPath) {
    const [parent] = Editor.parent(editor, selection);
    if (Element.isElement(parent)) {
      if ((parent as any).type === 'code_block' || (parent as any).type === 'heading_title') {
        return null;
      }
      const [pp] = Editor.parent(editor, selection);
      blockPath = pp;
    }
  }
  return blockPath;
};

export const pathEquals = (a: Path | null | undefined, b: Path | null | undefined): boolean => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
};

/** 当前光标锚点的屏幕坐标（用于弹层定位） */
export const getCaretRect = (): { left: number; top: number; height: number } | null => {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const r = sel.getRangeAt(0).getBoundingClientRect();
  if (!r) return null;
  return { left: r.left, top: r.top, height: r.height };
};
