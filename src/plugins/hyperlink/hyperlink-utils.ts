import { Editor, Text, Transforms, Range } from 'slate';

/**
 * 超链接通过「文本叶子上的 mark」实现，而不是独立元素：
 *  - HYPERLINK_KEY     = url 字符串（渲染成跳转地址）
 *  - HYPERLINK_AUTO_KEY = 是否为「输入时自动识别」的链接
 *    自动链接的文本必须始终是合法的 URL，且地址跟随文本变化；
 *    手动链接文本可随意编辑，地址固定、不做自动降级。
 * mark 会随光标移动/文字编辑自然保留在叶子文本上，
 * 因此：在链接中间打字仍保持链接、新字符也显示为链接色；
 * 链接之外的空格/后续文本不会带上链接色（只作用于带 mark 的叶子）。
 */

export const HYPERLINK_KEY = 'hyperlink';
export const HYPERLINK_AUTO_KEY = 'hyperlinkAuto';

export const isHyperlinkLeaf = (node: unknown): boolean =>
  Text.isText(node) && typeof (node as any)[HYPERLINK_KEY] === 'string';

/** 链接色：暗黑模式用更亮的蓝保证可读，浅色跟随主题（带兜底） */
export const getLinkColor = (isDark: boolean, themeColor?: string): string =>
  isDark ? '#5b8ff9' : themeColor || '#1677ff';

/* ------------------------------------------------------------------ */
/* 自动 URL 校验：结构 + 已知顶级域名集合                             */
/* - "www.21.com" 合法；继续成 "www.21.comas" 不合法 → 自动降级        */
/* - 汉字始终是链接边界，判定只看链接叶子自身文本                      */
/* ------------------------------------------------------------------ */

export const URL_TOKEN_CHARS = /[A-Za-z0-9.\-:/_?&=#%+~]/;

const COMMON_TLDS = new Set([
  'com',
  'net',
  'org',
  'edu',
  'gov',
  'mil',
  'int',
  'info',
  'biz',
  'name',
  'pro',
  'mobi',
  'asia',
  'io',
  'co',
  'ai',
  'app',
  'dev',
  'xyz',
  'site',
  'online',
  'tech',
  'store',
  'blog',
  'shop',
  'club',
  'fun',
  'live',
  'news',
  'vip',
  'work',
  'run',
  'plus',
  'space',
  'cloud',
  'digital',
  'email',
  'support',
  'website',
  'world',
  'company',
  'network',
  'social',
  'group',
  'market',
  'party',
  'link',
  'red',
  'pink',
  'gold',
  'purple',
  'top',
  'win',
  'wang',
  'kim',
  'design',
  'art',
  'solutions',
  'agency',
  'services',
  'media',
  'photo',
  'tv',
  'cc',
  'me',
  'ac',
  'travel',
  'bet',
  'case',
  'auto',
  'career',
  'law',
  'sport',
  'music',
  'game',
  'wiki',
  'zone',
  'icu',
  'guru',
  'life',
  'today',
  'best',
  'monster',
  'review',
  'rocks',
  'team',
  'watch',
  'center',
  'city',
  'community',
  'cn',
  'us',
  'uk',
  'jp',
  'kr',
  'hk',
  'tw',
  'au',
  'de',
  'fr',
  'ca',
  'br',
  'in',
  'ru',
  'eu',
  'nl',
  'se',
  'no',
  'fi',
  'dk',
  'it',
  'es',
  'pt',
  'gr',
  'ch',
  'at',
  'be',
  'pl',
  'cz',
  'mx',
  'ar',
  'sg',
  'my',
  'th',
  'vn',
  'ph',
  'id',
  'nz',
  'ie',
  'za',
  'tr',
  'il',
  'sa',
  'ae',
  'eg',
  'ng',
  'ua',
  'ro',
  'hu',
  'bg',
  'hr',
  'sk',
  'si',
  'lt',
  'lv',
  'ee',
  'is',
  'mt',
  'lu',
  'cy',
  'qa',
  'kw',
  'bh',
  'om',
  'lb',
  'pk',
  'bd',
  'lk',
  'np',
  'mn',
  'kz',
  'uz',
  'ge',
  'az',
  'am',
  'by',
  'md',
]);

export const isAutoLinkText = (text: string): boolean => {
  const t = text.trim();
  if (!t || t !== text) return false;
  if (!/^(?:www\.|https?:\/\/)/i.test(t)) return false;
  const host = t.replace(/^[a-z]+:\/\//i, '').split(/[/#?]/)[0];
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(host)) return false;
  const labels = host.split('.');
  return COMMON_TLDS.has(labels[labels.length - 1].toLowerCase());
};

/**
 * 返回文本开头连续「URL 字符」的长度（用作边界扫描）。
 * 中文/全角标点/空格不是 URL 字符，因此遇到即停止：
 *  - "www.23.com色粉" → 11（"色粉" 是边界）
 *  - "www.23.com is" → 11（空格是边界）
 *  - "www.21.comas"  → 14（as 是 ASCII 字母，继续算进 URL，使域名非法）
 */
export const getUrlPrefixEnd = (text: string): number => {
  let i = 0;
  while (i < text.length && URL_TOKEN_CHARS.test(text[i])) i++;
  return i;
};

/* ------------------------------------------------------------------ */
/* 清理 editor.marks 中的超链接 mark，避免泄漏给后续输入               */
/* ------------------------------------------------------------------ */

const clearActiveHyperlink = (editor: Editor) => {
  const m = editor.marks as any;
  if (!m) return;
  const next = { ...m };
  delete next[HYPERLINK_KEY];
  delete next[HYPERLINK_AUTO_KEY];
  const rest = Object.keys(next);
  editor.marks = (rest.length ? next : null) as any;
};

/* ------------------------------------------------------------------ */
/* 自动识别：光标所在叶子中，光标前的完整 URL 打上链接 mark            */
/* ------------------------------------------------------------------ */

export const autoLinkify = (editor: Editor): boolean => {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) return false;
  const { anchor } = selection;

  let entry: any;
  try {
    entry = Editor.node(editor, anchor.path);
  } catch {
    return false;
  }
  const [node, path] = entry as readonly [any, number[]];
  if (typeof node.text !== 'string') return false;
  // 若光标已在链接叶子内，不重复识别（手动/自动链接都不动）
  if (node[HYPERLINK_KEY]) return false;

  const text = node.text as string;
  if (!text) return false;
  const cursor = Math.max(0, Math.min(anchor.offset, text.length));

  // 取「光标所在的连续 URL 字符区间」：向左右两侧同时扩展。
  // 只向后扫会在「中间删除字符」时漏判（如 www.2.comf 把光标放在 com 后删掉 f，
  // 只看光标左侧得到 www.2.co，永远识别不回来），所以必须整段一起判定：
  // 整段是合法 URL → 恢复链接；整段不合法 → 维持纯文本。
  let start = cursor;
  while (start > 0 && URL_TOKEN_CHARS.test(text[start - 1])) start--;
  let end = cursor;
  while (end < text.length && URL_TOKEN_CHARS.test(text[end])) end++;

  const word = text.slice(start, end);
  if (!word) return false;
  if (!isAutoLinkText(word)) return false;

  // 记录光标位置，打完 mark 后还原（打 mark 会按区间切分叶子，路径/偏移会变）
  const cursorRef = Editor.pointRef(editor, { path, offset: cursor }, { affinity: 'forward' });
  let point = null;
  try {
    Transforms.select(editor, {
      anchor: { path, offset: start },
      focus: { path, offset: end },
    });
    Editor.addMark(editor, HYPERLINK_KEY, word);
    Editor.addMark(editor, HYPERLINK_AUTO_KEY, true);
    point = cursorRef.current;
  } finally {
    cursorRef.unref();
  }
  if (point) {
    Transforms.select(editor, point);
  } else {
    Transforms.collapse(editor, { edge: 'end' });
  }
  clearActiveHyperlink(editor);
  return true;
};

/**
 * 删除后重新识别链接：删掉让 URL 失效的字符（www.2.comf 的 f / www.2.coxm 的 x）
 * 之后，需要把「整段文本重新变回合法 URL」的情况补回链接。
 */
export const relinkAfterDelete = (editor: Editor): boolean => {
  try {
    return autoLinkify(editor);
  } catch {
    return false;
  }
};

/* ------------------------------------------------------------------ */
/* 手动插入链接（FloatBar / 悬浮层编辑）                              */
/* - 光标未选区：原地插入显示文本并打上链接 mark                      */
/* - 展开选区：选中文字原地转为链接（保留原有加粗/斜体等 mark），     */
/*   不删除文字、不产生额外空文本节点。                               */
/* ------------------------------------------------------------------ */

export const insertHyperlink = (editor: Editor, attrs: { url: string; text?: string }) => {
  const { selection } = editor;
  if (!selection) return;
  const url = attrs.url.trim();
  if (!url) return;

  if (Range.isCollapsed(selection)) {
    const display = attrs.text?.trim() || url;
    const previous = editor.marks as any;
    editor.marks = { ...(previous || {}), [HYPERLINK_KEY]: url } as any;
    Transforms.insertText(editor, display);
    editor.marks = previous ?? null;
    return;
  }

  // 展开选区：把选中文字包成链接（不动文字本身）
  Editor.addMark(editor, HYPERLINK_KEY, url);
  // 手动链接不受自动校验约束：清掉选区里可能残留的 auto 标记
  Transforms.unsetNodes(editor, [HYPERLINK_AUTO_KEY as any], { match: Text.isText });
  clearActiveHyperlink(editor);
};
