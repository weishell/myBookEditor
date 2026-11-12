import { Editor, Element, Text, Transforms, Range, type Node } from 'slate';
import { BlockElementType } from '@/enums';
import { showCursorToast } from '@/components/InlineToast';

// 渐变字与背景高亮互斥：渐变字通过 background-clip 实现，会覆盖 background-color，
// 叠加时背景色必然"无效"。判断当前选区是否处于渐变字（glow/shadow 不冲突）。
const isGradientArtTextActive = (editor: Editor): boolean => {
  const marks = (editor as any).marks;
  const artTextData = marks ? (marks as Record<string, unknown>)['artText'] : undefined;
  if (typeof artTextData !== 'string' || !artTextData) return false;
  try {
    const parsed = JSON.parse(artTextData) as { type?: string };
    return parsed.type === 'gradient';
  } catch {
    return false;
  }
};

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    (editor as any).removeMark(format);
  } else {
    (editor as any).addMark(format, true);
  }
};

/**
 * 选区内是否「全部」带某个格式。
 *
 * ⚠️ 不能只读 `editor.marks`：Slate 里它只在**折叠光标**时才是当前格式的快照，
 * 展开选区时恒为 null。之前只看 marks，导致 B/I/U 永远被判定为「未激活」→
 * 点一次加格式、再点还是 addMark，取消不掉；图标也不会高亮。
 * 所以展开选区必须自己遍历选区内的文本节点统计。
 */
export const isMarkActive = (editor: Editor, format: string) => {
  const { selection } = editor;
  const marks = (editor as any).marks;
  const collapsedActive = marks ? marks[format as keyof typeof marks] === true : false;

  if (!selection) return collapsedActive;
  if (Range.isCollapsed(selection)) return collapsedActive;

  let total = 0;
  let matched = 0;
  for (const [node] of Editor.nodes(editor, {
    at: selection,
    match: (n: Node) => Text.isText(n),
  })) {
    // 空文本叶子（分片产生的占位）不参与判断，否则「全选一段」会被空叶子稀释成 false
    if (!(node as Text).text) continue;
    total += 1;
    if ((node as any)[format] === true) matched += 1;
  }
  return total > 0 && matched === total;
};

/** 当前是否选中了实际文本（用于判断格式类操作有没有作用对象） */
export const isSelectionExpanded = (editor: Editor) => {
  const { selection } = editor;
  return !!selection && Range.isExpanded(selection);
};

/** 颜色需要作用的"自绘 + void"行内元素类型 */
const INLINE_COLOR_ELEMENT_TYPES: string[] = [BlockElementType.FORMULA, BlockElementType.MENTION];

/**
 * 把颜色写到选区内行内自绘元素（公式 / @提及）的 attrs 上。
 *
 * 为什么不用 text mark：这类元素 isVoid，Slate 的 addMark 默认不进入 void 节点内部，
 * 其子文本的 mark 既写不进去、渲染时也不使用（组件是自绘的，不渲染 children）。
 * 所以改它们的颜色只能落到元素 attrs，由 Formula/Mention 读取渲染。
 */
const setInlineElementColor = (
  editor: Editor,
  key: 'color' | 'highlight',
  value: string | null,
) => {
  const { selection } = editor;
  if (!selection) return;

  const targets = Array.from(
    Editor.nodes(editor, {
      at: selection,
      voids: true,
      match: (n: Node) =>
        Element.isElement(n) &&
        INLINE_COLOR_ELEMENT_TYPES.includes((n as { type?: string }).type ?? ''),
    }),
  ) as Array<[{ attrs?: Record<string, unknown> }, number[]]>;
  if (targets.length === 0) return;

  Editor.withoutNormalizing(editor, () => {
    for (const [node, path] of targets) {
      const nextAttrs = { ...(node.attrs ?? {}) };
      if (value) nextAttrs[key] = value;
      else delete nextAttrs[key];
      Transforms.setNodes(editor, { attrs: nextAttrs } as any, { at: path });
    }
  });
};

export const setColor = (editor: Editor, color: string | null) => {
  if (color) {
    (editor as any).addMark('color', color);
  } else {
    (editor as any).removeMark('color');
  }
  // 公式 / @提及 是自绘 void 元素，text mark 到不了，需同步到 attrs
  setInlineElementColor(editor, 'color', color);
};

export const setBackgroundColor = (editor: Editor, backgroundColor: string | null) => {
  if (backgroundColor) {
    // 渐变字与背景高亮互斥：当前已是渐变字时禁止叠加背景色（会被渐变覆盖而"无效"），改用 toast 提示
    if (isGradientArtTextActive(editor)) {
      showCursorToast(editor, 'toast.artTextGradientConflict');
      return;
    }
    (editor as any).addMark('highlight', backgroundColor);
  } else {
    (editor as any).removeMark('highlight');
  }
  setInlineElementColor(editor, 'highlight', backgroundColor);
};

// Text 层字体：设置选区文字的 font-family mark
// 优先级：text mark > block attrs.fontFamily > 全局 globalFont
export const setFontFamily = (editor: Editor, fontFamily: string | null) => {
  if (fontFamily) {
    (editor as any).addMark('fontFamily', fontFamily);
  } else {
    (editor as any).removeMark('fontFamily');
  }
};

export const MarkTypes = {
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  STRIKETHROUGH: 'strikethrough',
  CODE: 'code',
  COLOR: 'color',
  HIGHLIGHT: 'highlight',
  ART_TEXT: 'artText',
  FONT_FAMILY: 'fontFamily',
} as const;

export type MarkTypes = (typeof MarkTypes)[keyof typeof MarkTypes];
