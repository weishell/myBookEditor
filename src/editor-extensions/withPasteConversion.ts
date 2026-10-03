// 粘贴转换 —— 把外部富文本（Word / 网页 / 富文本）粘贴的 text/html 转成编辑器自己的块格式
//
// 覆盖 insertData：优先解析 text/html，
//   - <table>        → table 块
//   - <h1-h6>        → heading 块
//   - <pre>/<code>   → code-block 块（逐行 code-line）
//   - <ul>/<ol>/<li> → 列表项（段落 + attrs.lilist，嵌套用 attrs.indent）
//   - <img>          → 段落占位文本 [图片]（图片上传后续再加）
//   - <p>/文本       → 段落；行内加粗/斜体/下划线/删除线/行内代码/链接标记保留
// 解析出块后走 editor.insertFragment（withEditorBehaviors 负责换 id / 标题降级），
// 无法解析或选区在代码块内时回退原 insertData 逻辑。
import { Editor, Transforms, Element, Range, type Descendant } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType, LilistType, ZERO_WIDTH_SPACE } from '@/enums';

interface RawMark {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  hyperlink?: string;
}

const UUID_PREFIX = 'paste-';

const isEl = (n: Node): n is Element => (n as Element)?.tagName !== undefined;
const tagOf = (n: Node): string => (isEl(n) ? (n as Element).tagName.toLowerCase() : '');

const paragraph = (children: Record<string, unknown>[]): Descendant =>
  ({
    type: BlockElementType.PARAGRAPH,
    id: `${UUID_PREFIX}${uuidv4()}`,
    attrs: {},
    children: children.length ? children : [{ text: '' }],
  }) as unknown as Descendant;

const textNode = (text: string, marks: RawMark = {}): Record<string, unknown> => {
  const leaf: Record<string, unknown> = { text };
  if (marks.bold) leaf.bold = true;
  if (marks.italic) leaf.italic = true;
  if (marks.underline) leaf.underline = true;
  if (marks.strikethrough) leaf.strikethrough = true;
  if (marks.code) leaf.code = true;
  if (marks.hyperlink) leaf.hyperlink = marks.hyperlink;
  return leaf;
};

interface InlineRun {
  text: string;
  marks: RawMark;
}

const ifr = (...out: InlineRun[]) => out;

/** 处理单个节点 → 行内 run（文本直接产出，元素按标记递归其子节点） */
const inlineRunsOf = (node: Node, marks: RawMark): InlineRun[] => {
  if (node.nodeType === Node.TEXT_NODE) {
    const t = node.textContent ?? '';
    return t ? ifr({ text: t, marks }) : [];
  }
  if (!isEl(node)) return [];
  const tag = tagOf(node);
  const el = node as Element;
  const next: RawMark = { ...marks };
  if (tag === 'strong' || tag === 'b') next.bold = true;
  else if (tag === 'em' || tag === 'i') next.italic = true;
  else if (tag === 'u') next.underline = true;
  else if (tag === 's' || tag === 'strike' || tag === 'del') next.strikethrough = true;
  else if (tag === 'code') next.code = true;
  else if (tag === 'a') next.hyperlink = el.getAttribute('href') || undefined;
  else if (tag === 'img') return ifr({ text: '[图片]', marks });
  else if (tag === 'br' || tag === 'hr') return ifr({ text: ' ', marks });
  const out: InlineRun[] = [];
  childArray(el).forEach((c) => out.push(...inlineRunsOf(c, next)));
  return out;
};

/** 把元素内的行内内容转成带标记的文本叶子（合并相邻同标记文本，交由 Slate 自动 coalesce） */
const parseInlineRuns = (el: Element): InlineRun[] => {
  const out: InlineRun[] = [];
  childArray(el).forEach((c) => out.push(...inlineRunsOf(c, {})));
  return out;
};

const childArray = (n: Node): Node[] => Array.from(n.childNodes);

/** 元素内纯文本（丢弃结构） */
const plainTextOf = (el: Element): string =>
  Array.from(el.childNodes)
    .map((c) => {
      if (c.nodeType === Node.TEXT_NODE) return c.textContent || '';
      if (isEl(c)) return plainTextOf(c as Element);
      return '';
    })
    .join('');

/* ----------------------------- 块转换 ----------------------------- */

/** 生成 code-block 块：<pre> / <pre><code> */
const buildCodeBlock = (el: Element): Descendant => {
  // code 节点里的文本即为代码内容
  let codeEl: Element | null = el;
  const innerCode = el.querySelector('code');
  if (innerCode) codeEl = innerCode;
  const codeText = plainTextOf(codeEl);
  const id = `${UUID_PREFIX}${uuidv4()}`;
  const lines = codeText.split('\n').map((lineText, i) => ({
    type: BlockElementType.CODE_LINE,
    id: `${id}-line-${i}`,
    children: [{ text: lineText }, { text: ZERO_WIDTH_SPACE }],
  }));
  return {
    type: BlockElementType.CODE_BLOCK,
    id,
    attrs: {},
    children:
      lines.length > 0
        ? lines
        : [
            {
              type: BlockElementType.CODE_LINE,
              id,
              children: [{ text: '' }, { text: ZERO_WIDTH_SPACE }],
            },
          ],
  } as unknown as Descendant;
};

/** 生成 table 块：<table> → table > (table-row > table-cell > paragraph) */
const buildTable = (el: Element): Descendant | null => {
  const rows: Descendant[] = [];
  let maxCols = 0;

  el.querySelectorAll(
    ':scope > tr, :scope > tbody > tr, :scope > thead > tr, :scope > tfoot > tr',
  ).forEach((tr, rowIdx) => {
    const cells: Descendant[] = [];
    tr.querySelectorAll(':scope > td, :scope > th').forEach((td) => {
      const attrs: Record<string, unknown> = { width: '160px' };
      const cs = parseInt(td.getAttribute('colspan') || '1', 10);
      const rs = parseInt(td.getAttribute('rowspan') || '1', 10);
      if (cs > 1) attrs.colspan = cs;
      if (rs > 1) attrs.rowspan = rs;
      cells.push({
        type: BlockElementType.TABLE_CELL,
        id: `${UUID_PREFIX}${uuidv4()}`,
        attrs,
        children: [cellParagraph(td)],
      } as unknown as Descendant);
    });
    if (cells.length === 0) {
      cells.push({
        type: BlockElementType.TABLE_CELL,
        id: `${UUID_PREFIX}${uuidv4()}`,
        attrs: { width: '160px' },
        children: [paragraph([])],
      } as unknown as Descendant);
    }
    maxCols = Math.max(maxCols, cells.length);
    rows.push({
      type: BlockElementType.TABLE_ROW,
      id: `${UUID_PREFIX}${uuidv4()}`,
      attrs: rowIdx === 0 ? { isHeader: true } : {},
      children: cells,
    } as unknown as Descendant);
  });

  if (rows.length === 0) return null;
  return {
    type: BlockElementType.TABLE,
    id: `${UUID_PREFIX}${uuidv4()}`,
    attrs: { colWidths: Array.from({ length: maxCols }, () => 160) },
    children: rows,
  } as unknown as Descendant;
};

/** 单元格内容：把单元格里的块级子元素（p/div/br 间隔）拆成多个段落 */
const cellParagraph = (td: Element): Descendant => {
  const hasBlock =
    Array.from(td.children).some((c) =>
      ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL'].includes(c.tagName),
    ) || false;
  if (!hasBlock) {
    const runs = parseInlineRuns(td);
    return paragraph(runs.map((r) => textNode(r.text, r.marks)));
  }
  const paras: Descendant[] = [];
  const blocks = Array.from(td.children).filter((c) =>
    ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL'].includes(c.tagName),
  );
  if (blocks.length === 0) return paragraph([]);
  blocks.forEach((b) => {
    const runs = parseInlineRuns(b);
    paras.push(paragraph(runs.map((r) => textNode(r.text, r.marks))));
  });
  return paras[0];
};

/** 生成列表项（段落块 fn attrs.lilist）。同一 <ol>/<ul> 一个 list_id，嵌套用 indent。 */
const buildList = (el: Element, indent: number): Descendant[] => {
  const listType = el.tagName.toLowerCase() === 'ol' ? LilistType.OL : LilistType.UL;
  const listId = `${UUID_PREFIX}${uuidv4()}`;
  const items: Descendant[] = [];
  const lis = Array.from(el.children).filter((c) => c.tagName.toLowerCase() === 'li');
  lis.forEach((li) => {
    // li 的直接子节点：text 与内联内容 → 段落项；嵌套 <ul>/<ol> → 递归（indent+1）
    const inlineNodes: Node[] = [];
    const nestedLists: Element[] = [];
    childArray(li).forEach((c) => {
      const tag = tagOf(c);
      if (tag === 'ol' || tag === 'ul') nestedLists.push(c as Element);
      else inlineNodes.push(c);
    });
    const runs: InlineRun[] = [];
    inlineNodes.forEach((c) => runs.push(...inlineRunsOf(c, {})));
    if (inlineNodes.length > 0) {
      items.push({
        type: BlockElementType.PARAGRAPH,
        id: `${UUID_PREFIX}${uuidv4()}`,
        attrs: {
          indent,
          lilist: { list_type: listType, list_id: listId, list_number: 1, list_custom: false },
        },
        children: runs.length ? runs.map((r) => textNode(r.text, r.marks)) : [{ text: '' }],
      } as unknown as Descendant);
    }
    nestedLists.forEach((nl) => {
      items.push(...buildList(nl, indent + 1));
    });
  });
  return items;
};

/** 把单个 HTML 顶层节点转成 0..n 个编辑器块 */
const parseBlock = (node: Node): Descendant[] => {
  if (node.nodeType === Node.TEXT_NODE) {
    const t = (node.textContent || '').trim();
    return t ? [paragraph([{ text: t }])] : [];
  }
  if (!isEl(node)) return [];
  const el = node as Element;
  const tag = tagOf(el);

  switch (tag) {
    case 'table':
      return buildTable(el) ? [buildTable(el)!] : [];
    case 'ul':
    case 'ol':
      return buildList(el, 0);
    case 'pre': {
      const innerCode = el.querySelector('code');
      if (innerCode) return [buildCodeBlock(innerCode as Element)];
      return [buildCodeBlock(el)];
    }
    case 'img':
      return [paragraph([{ text: '[图片]' }])];
  }

  if (/^h[1-6]$/.test(tag)) {
    const level = parseInt(tag.slice(1), 10);
    const runs = parseInlineRuns(el);
    return [
      {
        type: BlockElementType.HEADING,
        id: `${UUID_PREFIX}${uuidv4()}`,
        attrs: { level },
        children: runs.length ? runs.map((r) => textNode(r.text, r.marks)) : [{ text: '' }],
      } as unknown as Descendant,
    ];
  }

  if (tag === 'blockquote' || tag === 'li') {
    const runs = parseInlineRuns(el);
    return [paragraph(runs.map((r) => textNode(r.text, r.marks)))];
  }

  if (tag === 'p' || tag === 'span' || tag === 'font') {
    const runs = parseInlineRuns(el);
    return [paragraph(runs.map((r) => textNode(r.text, r.marks)))];
  }

  // 容器类：递归展开为多个顶层块
  if (['div', 'section', 'article', 'main', 'body', 'html'].includes(tag)) {
    const out: Descendant[] = [];
    childArray(el).forEach((c) => out.push(...parseBlock(c)));
    if (out.length === 0) {
      const runs = parseInlineRuns(el);
      if (runs.some((r) => r.text.trim())) {
        return [paragraph(runs.map((r) => textNode(r.text, r.marks)))];
      }
    }
    return out;
  }

  // 其它元素按段落处理（如 <blockquote>、自定义标签）
  const runs = parseInlineRuns(el);
  return runs.some((r) => r.text.trim())
    ? [paragraph(runs.map((r) => textNode(r.text, r.marks)))]
    : [];
};

/** 解析 HTML 字符串为编辑器块列表（过滤纯空块） */
export const htmlToBlocks = (html: string): Descendant[] => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const blocks: Descendant[] = [];
  childArray(doc.body).forEach((c) => blocks.push(...parseBlock(c)));

  const hasText = (n: unknown): boolean => {
    if (!n) return false;
    const node = n as any;
    if (typeof node.text === 'string') return node.text.trim().length > 0;
    if (Array.isArray(node.children)) return node.children.some(hasText);
    return false;
  };
  const filtered: Descendant[] = [];
  for (const b of blocks) {
    const anyBlock = b as any;
    // 表格 / 代码块本身视为有内容
    if (anyBlock.type === BlockElementType.TABLE || anyBlock.type === BlockElementType.CODE_BLOCK) {
      filtered.push(b);
      continue;
    }
    if (anyBlock.attrs?.lilist) {
      filtered.push(b);
      continue;
    }
    if (hasText(b)) filtered.push(b);
  }
  return filtered;
};

const isInsideCodeBlock = (editor: Editor): boolean => {
  const { selection } = editor;
  if (!selection) return false;
  try {
    const match = (editor as any).above({
      match: (n: any) => Element.isElement(n) && n.type === BlockElementType.CODE_BLOCK,
      mode: 'lowest',
    });
    return !!match;
  } catch {
    return false;
  }
};

export const withPasteConversion = (editor: Editor) => {
  const { insertData, insertFragment } = editor;

  editor.insertData = (data: DataTransfer) => {
    const { selection } = editor;
    if (!selection) {
      insertData(data);
      return;
    }
    // 代码块内部粘贴走原逻辑（withCodeBlock 会把多行拆成 code-line）
    if (isInsideCodeBlock(editor)) {
      insertData(data);
      return;
    }
    const html = data.getData('text/html');
    if (!html) {
      insertData(data);
      return;
    }
    const blocks = htmlToBlocks(html);
    if (blocks.length === 0) {
      insertData(data);
      return;
    }

    try {
      if (!Range.isCollapsed(selection)) {
        Transforms.delete(editor, { at: selection });
      }
      // withEditorBehaviors.insertFragment：重新生成 id + 标题降级 + 标题内粘贴特判
      insertFragment(blocks as any);
    } catch {
      insertData(data);
    }
  };

  return editor;
};
