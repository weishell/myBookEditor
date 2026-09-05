// 查找 / 替换 —— 纯逻辑层（与 UI 解耦）
//
// 职责：
//   1. collectMatches：仅在「文本类 block」的叶子文本里收集查询词的出现位置，
//      表格 / 代码块 / 图片 / 图表 / 公式等非文本插件即便含相同文字也不参与。
//   2. searchDecorate：把匹配结果转成 Slate 装饰区间，交给 renderLeaf 做高亮。
//   3. replaceTextInLeaf / replaceAll：局部替换与全局替换的最小实现。
import { Editor, Text, Transforms, type NodeEntry, type Range } from 'slate';
import { BlockElementType } from '@/enums';

/** 文本类 block（可被查找替换）。其余一律视为非文本插件，即使含相同文字也不替换。 */
export const TEXT_SEARCH_BLOCK_TYPES = new Set<string>([
  BlockElementType.PARAGRAPH,
  BlockElementType.HEADING,
  BlockElementType.HEADING_TITLE,
  BlockElementType.BLOCKQUOTE,
  BlockElementType.LIST_ITEM,
  BlockElementType.TODO_LIST,
]);

export interface FindMatch {
  /** 叶子文本节点的绝对路径 */
  path: number[];
  /** 匹配在叶子文本内的起始偏移 */
  offset: number;
  /** 匹配长度 */
  length: number;
  /** 匹配到的原文（== 查询词） */
  text: string;
}

/**
 * 递归遍历编辑器树，仅收集「文本类 block」内的叶子文本。
 * 遇到非文本插件（table 等）时整棵子树跳过。
 */
const walkTextLeaves = (nodeList: any[], basePath: number[], out: any[]): void => {
  for (let i = 0; i < nodeList.length; i++) {
    const child = nodeList[i];
    const path = [...basePath, i];
    if (Text.isText(child)) {
      out.push({ node: child, path });
      continue;
    }
    const children = (child as any).children;
    if (!Array.isArray(children)) continue;
    const type: string = (child as any).type;
    const isTextBlock = TEXT_SEARCH_BLOCK_TYPES.has(type);
    const isContainer =
      type === BlockElementType.COLUMN_GROUP ||
      type === BlockElementType.COLUMN ||
      type === BlockElementType.NUMBERED_LIST ||
      type === BlockElementType.BULLETED_LIST;
    // 非文本 block 且非容器：整棵子树跳过（表格 / 代码块 / 图片 / 图表等）
    // 只有文本类 block 或容器类才继续下钻收集叶子文本
    if (!isTextBlock && !isContainer) continue;
    walkTextLeaves(children, path, out);
  }
};

/**
 * 在文本类 block 内收集所有查询词出现位置（大小写不敏感）。
 */
export const collectMatches = (editor: Editor, query: string): FindMatch[] => {
  const q = query.trim();
  if (!q || !editor?.children?.length) return [];

  const textLeaves: { node: any; path: number[] }[] = [];
  walkTextLeaves((editor as any).children as any[], [], textLeaves);

  const lowerQ = q.toLowerCase();
  const matches: FindMatch[] = [];

  for (const leaf of textLeaves) {
    const text: string = leaf.node.text ?? '';
    if (!text) continue;
    const lowerText = text.toLowerCase();
    let from = 0;
    let idx = lowerText.indexOf(lowerQ, from);
    while (idx !== -1) {
      matches.push({
        path: leaf.path,
        offset: idx,
        length: q.length,
        text: text.slice(idx, idx + q.length),
      });
      from = idx + Math.max(q.length, 1);
      if (from > text.length) break;
      idx = lowerText.indexOf(lowerQ, from);
    }
  }

  return matches;
};

/** entry.path 是否是 match 叶子文本的「直接父级 block」路径（保证每个匹配只装饰一次） */
const isImmediateParent = (matchPath: number[], entryPath: number[]): boolean => {
  if (matchPath.length !== entryPath.length + 1) return false;
  return entryPath.every((p, i) => p === matchPath[i]);
};

/**
 * 把匹配结果转成 Slate 装饰区间。
 * 只有命中「匹配叶子的直接父 block」时才输出，避免向上级容器重复装饰。
 */
export const searchDecorate = (
  matches: FindMatch[],
  currentIndex: number,
  entry: NodeEntry,
): Range[] => {
  if (!matches.length) return [];
  const [, path] = entry;
  const ranges: Range[] = [];

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    if (!isImmediateParent(m.path, path)) continue;
    const range: any = {
      anchor: { path: m.path, offset: m.offset },
      focus: { path: m.path, offset: m.offset + m.length },
    };
    if (i === currentIndex) {
      range.searchCurrent = true;
    } else {
      range.searchHighlight = true;
    }
    ranges.push(range);
  }

  return ranges;
};

/**
 * 替换一个叶子内的 [start,end) 区间为 replacement。
 * 用「先删除区间再 insertText」实现：比 setNodes 直接改 text 更可靠，
 * 且不影响区间外文本的 marks（仅新插入的替换文本不带 mark）。
 * 必须在 Editor.withoutNormalizing（或等价）包裹内调用。
 */
const replaceRangeInLeaf = (
  editor: Editor,
  path: number[],
  start: number,
  end: number,
  replacement: string,
): void => {
  Transforms.delete(editor, {
    at: { anchor: { path, offset: start }, focus: { path, offset: end } },
  });
  const prevMarks = editor.marks;
  editor.marks = null; // 避免误注入搜索框/光标处的格式
  Transforms.insertText(editor, replacement, { at: { path, offset: start } });
  editor.marks = prevMarks;
};

/** 替换单个匹配（当前项） */
export const replaceMatch = (editor: Editor, match: FindMatch, replacement: string): void => {
  Editor.withoutNormalizing(editor, () => {
    replaceRangeInLeaf(editor, match.path, match.offset, match.offset + match.length, replacement);
  });
};

/**
 * 全局替换：按叶子分组，每个叶子内从右往左逐个替换，这样左侧匹配的
 * offset 不受右侧替换长度变化影响，路径也保持稳定。
 */
export const replaceAllMatches = (
  editor: Editor,
  matches: FindMatch[],
  replacement: string,
): void => {
  if (!matches.length) return;

  const byLeaf = new Map<string, FindMatch[]>();
  for (const m of matches) {
    const key = m.path.join('/');
    if (!byLeaf.has(key)) byLeaf.set(key, []);
    byLeaf.get(key)!.push(m);
  }

  Editor.withoutNormalizing(editor, () => {
    for (const list of byLeaf.values()) {
      const sorted = [...list].sort((a, b) => b.offset - a.offset);
      for (const item of sorted) {
        replaceRangeInLeaf(editor, item.path, item.offset, item.offset + item.length, replacement);
      }
    }
  });
};
