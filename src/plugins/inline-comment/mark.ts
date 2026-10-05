// 评论 mark 读写：把评论 id 写进文档数据（叶子文本的 "comments" 标记），并从文档里读取。
import { Editor, Transforms, Text, Range, type Node } from 'slate';

type Leaf = { text: string; [k: string]: unknown };
type CommentLeaf = Leaf & { comments?: string[] };

const getIds = (node: unknown): string[] => {
  const arr = (node as CommentLeaf)?.comments;
  if (!Array.isArray(arr)) return [];
  return arr;
};

/**
 * 给当前选区文本添加一个评论 id（写进文档数据）。
 * 先在选区边界切分文本节点，让选区精确映射到独立的叶子，再对每片叶子把 id
 * 追加进已有 comments 数组（保留同句多重评论）。因此仅选区内的文字被标记。
 * 空选区不做任何事。
 */
export function commentSelection(editor: Editor, id: string): boolean {
  const { selection } = editor;
  if (!selection || Range.isCollapsed(selection)) return false;

  let touched = false;
  Editor.withoutNormalizing(editor, () => {
    // 1) 在选区边界切分文本，使选区范围 = 若干整片叶子
    const rangeRef = Editor.rangeRef(editor, selection, { affinity: 'inward' });
    const [start, end] = Range.edges(selection);
    Transforms.splitNodes(editor, {
      at: end,
      match: (n) => Text.isText(n),
      always: !Editor.isEnd(editor, end, end.path),
    });
    Transforms.splitNodes(editor, {
      at: start,
      match: (n) => Text.isText(n),
      always: !Editor.isStart(editor, start, start.path),
    });
    const ranged = rangeRef.unref();
    if (!ranged) return;

    // 2) 对选区内的每一片叶子，合并追加评论 id
    for (const [node, path] of Array.from(
      Editor.nodes(editor, {
        at: ranged,
        match: (n) => Text.isText(n),
        mode: 'lowest',
      }),
    )) {
      const cur = getIds(node);
      if (cur.includes(id)) continue;
      touched = true;
      Transforms.setNodes(editor, { comments: [...cur, id] }, { at: path });
    }
  });

  return touched;
}

/** 从所有叶子上去掉某个评论 id（取消/删除会话时用）。 */
export function removeCommentId(editor: Editor, id: string): void {
  const entries = Array.from(
    Editor.nodes(editor, { at: [], match: () => true, mode: 'all' }),
  ) as Array<[Node, number[]]>;
  for (const [node, path] of entries) {
    if (!Text.isText(node)) continue;
    const cur = getIds(node);
    if (!cur.includes(id)) continue;
    const next = cur.filter((x) => x !== id);
    Transforms.setNodes(editor, next.length ? { comments: next } : { comments: null }, {
      at: path,
    });
  }
}

/** 递归收集"是否为叶子文本都带评论"的最小单位，供角标层使用。 */
export function getCommentLeaves(editor: Editor): { node: CommentLeaf; path: number[] }[] {
  const out: { node: CommentLeaf; path: number[] }[] = [];
  const walk = (children: unknown[], base: number[]) => {
    children.forEach((child, i) => {
      const path = [...base, i];
      if (Text.isText(child)) {
        if (getIds(child).length) out.push({ node: child as CommentLeaf, path });
        return;
      }
      const arr = (child as { children?: unknown[] })?.children;
      if (Array.isArray(arr)) walk(arr, path);
    });
  };
  walk(editor.children as unknown[], []);
  return out;
}

/** 把相邻的被评叶子划分成"连续区域"，每个区域一个角标。 */
export function getCommentRuns(
  editor: Editor,
): { id: string; threadIds: string[]; firstPath: number[] }[] {
  const leaves = getCommentLeaves(editor);
  const runs: { id: string; threadIds: string[]; firstPath: number[] }[] = [];
  for (const leaf of leaves) {
    let matched: (typeof runs)[number] | null = null;
    // 与上一个区域相邻（同一父块、叶子下标连续）则并入
    if (runs.length) {
      const last = runs[runs.length - 1];
      const lastLeafIdx = last.firstPath[last.firstPath.length - 1];
      const parentSame = last.firstPath.slice(0, -1).join(',') === leaf.path.slice(0, -1).join(',');
      if (parentSame && leaf.path[leaf.path.length - 1] === lastLeafIdx + 1) {
        matched = last;
      }
    }
    if (!matched) {
      matched = {
        id: `run-${runs.length + 1}-${leaf.path.join('.')}`,
        threadIds: [],
        firstPath: leaf.path,
      };
      runs.push(matched);
    }
    for (const tid of getIds(leaf.node)) {
      if (!matched.threadIds.includes(tid)) matched.threadIds.push(tid);
    }
  }
  return runs;
}
