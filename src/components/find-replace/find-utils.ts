// 查找 / 替换 —— 纯逻辑层（与 UI 解耦）
//
// 职责：
//   1. collectMatches：仅在「文本类 block」的叶子文本里收集查询词的出现位置，
//      表格 / 代码块 / 图片 / 图表 / 公式等非文本插件即便含相同文字也不参与。
//   2. searchDecorate：把匹配结果转成 Slate 装饰区间，交给 renderLeaf 做高亮。
//   3. replaceTextInLeaf / replaceAll：局部替换与全局替换的最小实现。
//
// ⚠️ 这个文件**不许 import slate 的运行时**（只能用 type）：它被 FindReplaceProvider
// 引入，而 Provider 挂在应用最顶层，会把整个寻址链拉进首页。
// 需要 slate 实际做事的（选中跳转 / 替换）都在 ./find-ops.ts 里，按需动态加载。
import type { Editor, NodeEntry, Range } from 'slate';
import { BlockElementType } from '@/enums';

/** 文本类 block（可被查找替换）。其余一律视为非文本插件，即使含相同文字也不替换。 */
export const TEXT_SEARCH_BLOCK_TYPES = new Set<string>([
  BlockElementType.PARAGRAPH,
  BlockElementType.HEADING,
  BlockElementType.HEADING_TITLE,
  BlockElementType.BLOCKQUOTE,
  BlockElementType.HINT_BLOCK,
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
    // 等价于 Text.isText()，但不引 slate 运行时（见文件头说明）
    if (typeof (child as any)?.text === 'string') {
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
