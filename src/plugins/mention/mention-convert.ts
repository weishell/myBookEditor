// 把正文里的「《文档标题》」交叉引用转换为真正的 @文档 提及节点。
// 纯文字书名号读者点不动；转成 mention 后可点击跳转。
// mention 的创建 / 渲染 / 搜索能力已经在插件里，这里只补「从已有文字反查 → 就地替换」这一段。
import { Editor, Node, Path, Transforms } from 'slate';
import { getMentionItems } from './mention-data';
import { createMentionElement } from './mention-utils';

/** 成对引用符号。中英文写作里常见的几种都认，顺序不影响结果 */
const QUOTE_PAIRS: Array<[string, string]> = [
  ['《', '》'],
  ['「', '」'],
  ['“', '”'],
  ['„', '“'],
  ['«', '»'],
];

export interface DocRef {
  /** 书名号里的名称（已 trim） */
  name: string;
  /** 在文本里的起始下标（含左符号） */
  start: number;
  /** 结束下标（含右符号），可直接当 slice 终点 */
  end: number;
}

interface DocTarget {
  id: string;
  name: string;
  url: string;
}

/** 可跳转的文档候选：只有 doc 类型才能当交叉引用目标 */
const getDocTargets = (): DocTarget[] =>
  getMentionItems()
    .filter((item) => item.kind === 'doc')
    .map((item) => ({ id: item.id, name: item.name.trim(), url: item.url }));

/**
 * 找出一段文本里「书名号包住、且名称能对上已有文档」的引用。
 * 对不上的书名号保持原样 —— 那多半是真的书名，不该被误改。
 */
export const findDocRefs = (text: string, docs: DocTarget[] = getDocTargets()): DocRef[] => {
  const names = new Set(docs.map((doc) => doc.name));
  const found: DocRef[] = [];

  for (const [open, close] of QUOTE_PAIRS) {
    let from = 0;
    for (;;) {
      const at = text.indexOf(open, from);
      if (at === -1) break;
      const to = text.indexOf(close, at + open.length);
      if (to === -1) break;
      const name = text.slice(at + open.length, to).trim();
      from = to + close.length;
      if (name && names.has(name)) {
        found.push({ name, start: at, end: from });
      }
    }
  }

  // 不同符号对可能框到同一段（如 “x” 与 „x“），按位置排序后丢掉重叠的
  found.sort((a, b) => a.start - b.start);
  const refs: DocRef[] = [];
  for (const item of found) {
    const last = refs[refs.length - 1];
    if (last && item.start < last.end) continue;
    refs.push(item);
  }
  return refs;
};

/** 指定块里是否有可转的引用（右键菜单据此决定显示还是隐藏入口） */
export const hasConvertibleDocRefs = (editor: Editor, path: number[]): boolean => {
  const block = Node.get(editor, path) as any;
  const text = ((block?.children ?? []) as any[])
    .map((child) => (typeof child?.text === 'string' ? child.text : ''))
    .join('');
  return findDocRefs(text).length > 0;
};

/**
 * 把指定文本块里的书名号引用就地换成 @文档 节点。
 * 返回实际转换的条数；0 表示这块里没有能对上的引用，文档不会有任何改动。
 */
export const convertDocRefsInBlock = (editor: Editor, path: number[]): number => {
  const docs = getDocTargets();
  const block = Node.get(editor, path) as any;
  const children = (block?.children ?? []) as any[];

  let converted = 0;
  const nextChildren: any[] = [];

  for (const child of children) {
    // 已经是提及或其它行内元素，原样保留
    if (typeof child?.text !== 'string') {
      nextChildren.push(child);
      continue;
    }

    const refs = findDocRefs(child.text, docs);
    if (refs.length === 0) {
      nextChildren.push(child);
      continue;
    }

    let cursor = 0;
    for (const ref of refs) {
      if (ref.start > cursor) {
        nextChildren.push({ ...child, text: child.text.slice(cursor, ref.start) });
      }
      const doc = docs.find((item) => item.name === ref.name);
      if (!doc) continue;
      nextChildren.push(
        createMentionElement({
          name: doc.name,
          kind: 'doc',
          targetId: doc.id,
          icon: '📄',
          url: doc.url,
        }) as any,
      );
      cursor = ref.end;
      converted += 1;
    }
    if (cursor < child.text.length) {
      nextChildren.push({ ...child, text: child.text.slice(cursor) });
    }
  }

  if (converted === 0) return 0;

  try {
    Editor.withoutNormalizing(editor, () => {
      // 整块换成处理后的版本：先插入新块、再删旧块，中途文档始终非空，
      // 即使整篇只有一个块也不会触发「空文档」归一化把内容吞掉。
      const fresh = Node.get(editor, path) as any;
      Transforms.insertNodes(editor, { ...fresh, children: nextChildren }, { at: path });
      Transforms.removeNodes(editor, { at: Path.next(path) });
    });
  } catch {
    // 结构异常时保持原文不动，调用方按 0 处理
    return 0;
  }

  return converted;
};
