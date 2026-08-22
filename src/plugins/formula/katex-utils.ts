import * as katexNs from 'katex';

// KaTeX ESM 是 export default，但 @types/katex 用的是命名导出，
// 这里做一层运行时兼容，保证能拿到真正的 katex 对象。
const katex: typeof katexNs =
  (katexNs as any).default && (katexNs as any).default.renderToString
    ? (katexNs as any).default
    : katexNs;

export const renderFormulaToHtml = (tex: string): string => {
  const trimmed = tex.trim();
  if (!trimmed) return '';
  try {
    return katex.renderToString(trimmed, {
      throwOnError: false,
      displayMode: false,
      strict: false,
      output: 'html',
    });
  } catch {
    return '';
  }
};

export { katex };
