// 查找 / 替换 —— 需要 slate 运行时的操作（选中跳转 / 替换）
//
// 为什么要单独拆一个文件：FindReplaceProvider 挂在应用最顶层（App.tsx），
// 如果它静态 import slate，首页（不带编辑器）也得先下载 slate 那 60 kB。
// 这里的三个函数只在「真的操作了文档」时才会被调用 —— 那时候编辑器必然已经加载，
// 动态 import 命中缓存，等于零成本；而首页的静态依赖链上就没有 slate 了。
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import type { FindMatch } from './find-utils';

/** 选中某个匹配并滚动到可视区域（同时让"当前项"高亮生效） */
export const focusAndScroll = (editor: any, match: FindMatch): void => {
  if (!editor) return;
  const range = {
    anchor: { path: match.path, offset: match.offset },
    focus: { path: match.path, offset: match.offset + match.length },
  };
  try {
    Transforms.select(editor, range);
    const dom = ReactEditor.toDOMRange(editor, range);
    const el = dom?.startContainer?.parentElement;
    el?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  } catch {
    /* 只读或极端情况忽略滚动 */
  }
};

/**
 * 替换一个叶子内的 [start,end) 区间为 replacement。
 * 用「先删除区间再 insertText」实现：比 setNodes 直接改 text 更可靠，
 * 且不影响区间外文本的 marks（仅新插入的替换文本不带 mark）。
 * 必须在 Editor.withoutNormalizing（或等价）包裹内调用。
 */
const replaceRangeInLeaf = (
  editor: any,
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
export const replaceMatch = (editor: any, match: FindMatch, replacement: string): void => {
  Editor.withoutNormalizing(editor, () => {
    replaceRangeInLeaf(editor, match.path, match.offset, match.offset + match.length, replacement);
  });
};

/**
 * 全局替换：按叶子分组，每个叶子内从右往左逐个替换，这样左侧匹配的
 * offset 不受右侧替换长度变化影响，路径也保持稳定。
 */
export const replaceAllMatches = (editor: any, matches: FindMatch[], replacement: string): void => {
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
