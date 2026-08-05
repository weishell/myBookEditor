import { Transforms, Node, Element, type Editor, type Descendant, Range } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType } from '@/enums';
import { ensureHeadingTitle } from './withDelete';

/**
 * 把 Fragment 中所有 HEADING_TITLE 降级为 PARAGRAPH（保留 children 内容）
 */
const downgradeHeadingTitles = (nodes: Descendant[]): Descendant[] => {
  const result: Descendant[] = [];
  for (const n of nodes) {
    if (!Element.isElement(n)) {
      result.push(n);
      continue;
    }
    if ((n as any).type === BlockElementType.HEADING_TITLE) {
      result.push({
        type: BlockElementType.PARAGRAPH,
        id: (n as any).id,
        children: n.children as any,
      } as any);
      continue;
    }
    if (Array.isArray(n.children) && n.children.length > 0) {
      result.push({ ...(n as any), children: downgradeHeadingTitles(n.children as any) });
    } else {
      result.push(n as any);
    }
  }
  return result;
};

/** 提取节点树下所有叶子文本 */
const extractLeafTexts = (nodes: any[]): { text: string; [k: string]: any }[] => {
  const leaves: { text: string; [k: string]: any }[] = [];
  const walk = (list: any[]) => {
    for (const n of list) {
      if (n && typeof n === 'object' && 'text' in n) {
        leaves.push({ ...n });
      } else if (n && Array.isArray(n.children)) {
        walk(n.children);
      }
    }
  };
  walk(nodes);
  return leaves;
};

/** 把任意节点转成纯文本段落 */
const toParagraphWithText = (nodes: any[]): any => {
  const leaves = extractLeafTexts(nodes);
  if (leaves.length === 0) leaves.push({ text: '' });
  return {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: leaves,
  };
};

/** 获取光标所在 HEADING_TITLE 的 path（不在标题内返回 null） */
const getHeadingTitlePath = (editor: Editor): any => {
  const { selection } = editor;
  if (!selection) return null;
  try {
    for (const [, path] of (editor as any).nodes({
      at: selection,
      mode: 'highest',
      match: (n: any) => Element.isElement(n) && (n as any).type === BlockElementType.HEADING_TITLE,
    })) {
      return path;
    }
  } catch {
    /* ignore */
  }
  return null;
};

/**
 * 粘贴到 HEADING_TITLE 内部：
 *  - 第一块文本 → 插入标题光标位置
 *  - 其余块 → 降级为段落后插入标题下方
 *  - 标题本身的 id / attrs 不动
 * 返回 true = 已处理
 */
const handlePasteInsideHeadingTitle = (editor: Editor, fragment: Descendant[]): boolean => {
  const titlePath = getHeadingTitlePath(editor);
  if (!titlePath) return false;

  const { selection } = editor;
  const firstBlock = fragment[0];
  const restBlocks = fragment.slice(1);

  // 提取第一块叶子文本
  let inlineLeaves: any[] = [];
  if (firstBlock) {
    if ('text' in (firstBlock as any)) {
      inlineLeaves = [{ ...(firstBlock as any) }];
    } else if (Array.isArray((firstBlock as any).children)) {
      inlineLeaves = extractLeafTexts([firstBlock]);
    }
  }
  if (inlineLeaves.length === 0) inlineLeaves = [{ text: '' }];

  // 有选区先删选区
  if (selection && !Range.isCollapsed(selection as any)) {
    try {
      Transforms.delete(editor, { at: selection as any });
    } catch {
      /* ignore */
    }
  }

  // 插入文本到标题光标位置
  try {
    Transforms.insertNodes(editor, inlineLeaves as any, { select: true });
  } catch {
    /* ignore */
  }

  // 其余块降级为段落，插入到标题下方
  if (restBlocks.length > 0) {
    const paras: any[] = [];
    for (const b of restBlocks) {
      if (
        Element.isElement(b as any) &&
        ((b as any).type === BlockElementType.DIVIDER ||
          (b as any).type === BlockElementType.IMAGE_BLOCK)
      ) {
        paras.push({ ...(b as any) });
      } else {
        paras.push(toParagraphWithText([b]));
      }
    }
    try {
      Transforms.insertNodes(editor, paras, { at: [titlePath[0] + 1] });
    } catch {
      /* ignore */
    }
  }

  return true;
};

export const withEditorBehaviors = (editor: Editor) => {
  const { isVoid, setFragmentData, insertFragment } = editor;

  editor.isVoid = (element) => {
    switch (element.type) {
      case BlockElementType.DIVIDER:
      case BlockElementType.IMAGE_BLOCK:
        return true;
      default:
        return isVoid(element);
    }
  };

  // 复制/剪切：降级 HEADING_TITLE → PARAGRAPH 后写入剪贴板
  editor.setFragmentData = (data: DataTransfer) => {
    const { selection } = editor;
    if (!selection) {
      setFragmentData(data);
      return;
    }
    try {
      const tmp = window.DataTransfer ? new (window as any).DataTransfer() : ({} as DataTransfer);
      setFragmentData(tmp);

      let fragment: Descendant[] = [];
      const fragmentRaw = (editor as any).getFragment ? (editor as any).getFragment() : null;
      if (fragmentRaw && Array.isArray(fragmentRaw) && fragmentRaw.length > 0) {
        fragment = fragmentRaw;
      } else {
        const slateData = tmp.getData && tmp.getData('application/x-slate-fragment');
        if (slateData) {
          try {
            const decoded = decodeURIComponent(window.atob(slateData));
            fragment = JSON.parse(decoded);
          } catch {
            fragment = [];
          }
        }
      }

      if (fragment.length > 0) {
        const filtered = downgradeHeadingTitles(fragment);
        try {
          const encoded = window.btoa(encodeURIComponent(JSON.stringify(filtered)));
          data.setData('application/x-slate-fragment', encoded);
        } catch {
          /* ignore */
        }
        const plain = filtered
          .map((n) => Node.string(n as any))
          .filter((s) => s.length > 0)
          .join('\n');
        data.setData('text/plain', plain);
        const html = filtered
          .map((n) => {
            const txt = Node.string(n as any);
            const type = (n as any).type;
            if (type === BlockElementType.HEADING) {
              const lv = ((n as any).attrs?.level as number) || 1;
              return `<h${lv}>${txt}</h${lv}>`;
            }
            if (type === BlockElementType.BLOCKQUOTE) return `<blockquote>${txt}</blockquote>`;
            if (type === BlockElementType.CODE_BLOCK) return `<pre><code>${txt}</code></pre>`;
            return `<p>${txt}</p>`;
          })
          .join('');
        data.setData('text/html', html);
        return;
      }
    } catch {
      /* ignore, fallback */
    }
    setFragmentData(data);
  };

  // 粘贴：
  //  - 粘贴到标题内 → 文本插标题，其余块降级为段落放标题下方
  //  - 否则 → 降级 HEADING_TITLE 后正常插入
  editor.insertFragment = (fragment: any) => {
    const cleaned = downgradeHeadingTitles(fragment as Descendant[]);

    if (getHeadingTitlePath(editor)) {
      if (handlePasteInsideHeadingTitle(editor, cleaned)) return;
    }

    insertFragment(cleaned as any);
    try {
      ensureHeadingTitle(editor);
    } catch {
      /* ignore */
    }
  };

  return editor;
};
