// 正文字数统计
//
// 只统计「文本类」块：段落、标题、任务列表、有序/无序列表、代码块、提示块、引用块。
// 图片、表格、图表、公式、嵌入等非文本块整块跳过，不计入字数。
import { Text, type Descendant } from 'slate';
import { BlockElementType } from '@/enums';

/** 非文本块：命中后整棵子树都不参与统计 */
const NON_TEXT_TYPES = new Set<string>([
  BlockElementType.IMAGE_BLOCK,
  BlockElementType.DIVIDER,
  BlockElementType.TABLE,
  BlockElementType.TABLE_ROW,
  BlockElementType.TABLE_CELL,
  BlockElementType.DRAWIO,
  BlockElementType.FORMULA,
  BlockElementType.MENTION,
  BlockElementType.FILE_BLOCK,
  BlockElementType.VIDEO_BLOCK,
  BlockElementType.COUNTDOWN,
  BlockElementType.CALENDAR,
  BlockElementType.TIMELINE,
  BlockElementType.CHART,
  BlockElementType.EMBED,
  BlockElementType.DRAWBOARD,
]);

function collectText(node: Descendant, buffer: string[]) {
  if (Text.isText(node)) {
    buffer.push(node.text);
    return;
  }
  const element = node as { type?: string; children?: Descendant[] };
  if (element.type && NON_TEXT_TYPES.has(element.type)) return;
  element.children?.forEach((child) => collectText(child, buffer));
}

/**
 * 统计字数：去掉空白与零宽占位符后按字符计数（中文一字算一字，英文一词算若干字符）。
 * 代码块的空行用零宽空格占位，必须排除，否则空行也会被算进去。
 */
export function countWords(value: Descendant[]): number {
  const buffer: string[] = [];
  value.forEach((node) => collectText(node, buffer));
  const text = buffer
    .join('')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, '');
  return Array.from(text).length;
}
