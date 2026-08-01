import { Transforms, Element, Editor, Path, Node } from 'slate';
import { BlockElementType } from '@/enums';

// 最大缩进级别
export const MAX_INDENT = 24;
// 每级缩进像素
export const INDENT_PX = 28;

// 支持缩进的文本类块类型
const INDENTABLE_TYPES: BlockElementType[] = [
  BlockElementType.PARAGRAPH,
  BlockElementType.HEADING,
  BlockElementType.BLOCKQUOTE,
  BlockElementType.BULLETED_LIST,
  BlockElementType.NUMBERED_LIST,
  BlockElementType.TODO_LIST,
];

/**
 * 判断块类型是否支持缩进
 */
export function isIndentable(type: BlockElementType): boolean {
  return INDENTABLE_TYPES.includes(type);
}

/**
 * 获取元素的当前缩进级别
 */
export function getIndent(element: any): number {
  return element?.attrs?.indent ?? 0;
}

/**
 * 检查选区中是否包含不支持缩进的块（图片、表格、代码块等）
 */
export function hasNonIndentableInSelection(editor: Editor): boolean {
  if (!editor.selection) return false;

  for (const [node] of Editor.nodes(editor, {
    at: editor.selection,
    match: (n: any) => Element.isElement(n) && Editor.isBlock(editor, n),
    mode: 'highest',
  })) {
    const type = (node as any)?.type as BlockElementType;
    if (!type) continue;
    if (!isIndentable(type)) return true;
  }

  return false;
}

/**
 * 获取选区内所有顶层块元素
 * 返回 null 表示选区中包含不支持缩进的块
 */
function getSelectedBlocks(editor: Editor): { node: any; path: number[] }[] | null {
  if (!editor.selection) return null;

  const blocks: { node: any; path: number[] }[] = [];
  let hasNonIndentable = false;

  for (const [node, path] of Editor.nodes(editor, {
    at: editor.selection,
    match: (n: any) => Element.isElement(n) && Editor.isBlock(editor, n),
    mode: 'highest',
  })) {
    const type = (node as any)?.type as BlockElementType;
    if (!type) continue;

    if (!isIndentable(type)) {
      hasNonIndentable = true;
    }
    blocks.push({ node: node as any, path });
  }

  if (hasNonIndentable) return null;
  return blocks;
}

/**
 * 获取上一个同级块的缩进级别
 * 如果是第一个块，返回 -1（不允许缩进）
 */
function getPrevSiblingIndent(editor: Editor, path: number[]): number {
  try {
    const prevPath = Path.previous(path);
    const prevNode = Node.get(editor, prevPath) as any;
    return getIndent(prevNode);
  } catch {
    return -1;
  }
}

/**
 * 增加缩进（Tab）
 * 规则：不能超过前一个块的缩进 + 1；第一个块不能缩进
 */
export function increaseIndent(editor: Editor): boolean {
  const blocks = getSelectedBlocks(editor);
  if (!blocks || blocks.length === 0) return false;

  let changed = false;

  for (const { node, path } of blocks) {
    const currentIndent = getIndent(node);
    const prevIndent = getPrevSiblingIndent(editor, path);

    if (prevIndent < 0) continue;
    if (currentIndent >= prevIndent + 1) continue;
    if (currentIndent >= MAX_INDENT) continue;

    const newAttrs = { ...(node as any).attrs, indent: currentIndent + 1 };
    Transforms.setNodes(editor, { attrs: newAttrs } as any, { at: path });
    changed = true;
  }

  return changed;
}

/**
 * 减少缩进（Shift+Tab）
 * 如果选区包含非文本块，返回 false
 */
export function decreaseIndent(editor: Editor): boolean {
  const blocks = getSelectedBlocks(editor);
  if (!blocks || blocks.length === 0) return false;

  for (const { node, path } of blocks) {
    const currentIndent = getIndent(node);
    if (currentIndent <= 0) continue;

    const newAttrs = { ...(node as any).attrs, indent: currentIndent - 1 };
    Transforms.setNodes(editor, { attrs: newAttrs } as any, { at: path });
  }

  return true;
}
