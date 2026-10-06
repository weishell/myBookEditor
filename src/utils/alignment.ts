import { Editor, Element, Node as SlateNode, Path, Transforms } from 'slate';
import { BlockElementType, TextAlign, type TextAlignValue } from '@/enums';

// 对外再导出对齐值类型：使用方（如 ContextMenu）习惯从本模块取
export type { TextAlignValue };

// 支持对齐的文本类块类型（与缩进一致：正文/标题/引用/提示块/列表/待办）
const ALIGNABLE_TYPES: BlockElementType[] = [
  BlockElementType.PARAGRAPH,
  BlockElementType.HEADING,
  BlockElementType.BLOCKQUOTE,
  BlockElementType.HINT_BLOCK,
  BlockElementType.BULLETED_LIST,
  BlockElementType.NUMBERED_LIST,
  BlockElementType.TODO_LIST,
  BlockElementType.LIST_ITEM,
];

export const ALIGN_OPTIONS: TextAlignValue[] = [TextAlign.LEFT, TextAlign.CENTER, TextAlign.RIGHT];

/** 判断块类型是否支持对齐 */
export function isAlignable(type: BlockElementType): boolean {
  return ALIGNABLE_TYPES.includes(type);
}

/** 读取块的当前对齐值（非法/缺省返回 undefined，即左对齐） */
export function getBlockAlign(element: any): TextAlignValue | undefined {
  const align = element?.attrs?.align;
  return ALIGN_OPTIONS.includes(align) ? (align as TextAlignValue) : undefined;
}

/** 收集应用对齐的目标块：优先给定 path，否则取选区顶层块 */
function getAlignTargets(editor: Editor, path?: Path): { node: any; path: Path }[] | null {
  if (path) {
    try {
      const node = SlateNode.get(editor, path) as any;
      return node && isAlignable(node.type) ? [{ node, path }] : null;
    } catch {
      return null;
    }
  }
  if (!editor.selection) return null;
  const blocks: { node: any; path: Path }[] = [];
  let hasNonAlignable = false;
  for (const [node, p] of Editor.nodes(editor, {
    at: editor.selection,
    match: (n: any) => Element.isElement(n) && Editor.isBlock(editor, n),
    mode: 'highest',
  })) {
    const type = (node as any)?.type as BlockElementType;
    if (!type) continue;
    if (!isAlignable(type)) {
      hasNonAlignable = true;
      continue;
    }
    blocks.push({ node: node as any, path: p });
  }
  return hasNonAlignable || blocks.length === 0 ? null : blocks;
}

/**
 * 取「选区顶层可对齐块」，供 FloatBar 的对齐面板计算当前值 / 可用态。
 *
 * 必须用它而不是 `Editor.above`：跨多块选区时 `Editor.above` 返回 undefined，
 * 会让面板被误判成"不可用"而整片变灰。与 setBlockAlignment 内部取块逻辑同源。
 * 返回 null 表示选区为空或含不可对齐的块。
 */
export function getSelectionAlignBlocks(editor: Editor): { node: any; path: Path }[] | null {
  return getAlignTargets(editor);
}

/**
 * 设置块对齐。align 为 'left' 时清除 align 字段（left 是默认值，无需显式存储）。
 * 可指定 path（DocBar 悬浮块）；不传则作用于选区顶层块。返回是否发生了改动。
 */
export function setBlockAlignment(editor: Editor, align: TextAlignValue, path?: Path): boolean {
  const targets = getAlignTargets(editor, path);
  if (!targets) return false;

  let changed = false;
  Editor.withoutNormalizing(editor, () => {
    for (const { node, path: p } of targets) {
      const attrs = { ...(node?.attrs || {}) };
      if (align === TextAlign.LEFT) delete attrs.align;
      else attrs.align = align;
      Transforms.setNodes(editor, { attrs } as any, { at: p });
      changed = true;
    }
  });
  return changed;
}
