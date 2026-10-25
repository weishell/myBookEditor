// 文本文件预览的公共逻辑：类型判断、语言识别、Prism 语法着色
// 配色与编辑器代码块保持一致（复用 CODE_TOKEN_COLORS），避免文件预览是一片黑色。
import React from 'react';
import Prism from 'prismjs';
import { CODE_TOKEN_COLORS, SHOULD_COLOR_TOKEN } from '@/utils/code-decoration';

/** 可读取正文预览的文本类文件 */
const TEXTUAL_EXT =
  /\.(txt|md|markdown|json|jsonc|csv|tsv|log|xml|html|htm|svg|vue|css|scss|sass|less|js|mjs|cjs|jsx|ts|tsx|mts|cts|java|py|pyw|go|rs|rb|php|sh|bash|zsh|sql|yml|yaml|toml|ini|env|conf|properties|gitignore|kt|kts|c|h|cpp|hpp|cs|swift)$/i;

export const isTextualFile = (name = '', mime = ''): boolean => {
  if (/^text\//.test(mime)) return true;
  return TEXTUAL_EXT.test(name);
};

/** 扩展名 → Prism 语言 id（未注册的语言会回落 plaintext） */
const EXT_LANGUAGE: Record<string, string> = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  mts: 'typescript',
  cts: 'typescript',
  java: 'java',
  py: 'python',
  pyw: 'python',
  css: 'css',
  scss: 'css',
  sass: 'css',
  less: 'css',
  json: 'json',
  jsonc: 'json',
  html: 'markup',
  htm: 'markup',
  xml: 'markup',
  svg: 'markup',
  vue: 'markup',
  sql: 'sql',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  go: 'go',
  rs: 'rust',
};

export const detectFileLanguage = (name = '', mime = ''): string => {
  const ext = name.includes('.') ? (name.split('.').pop() || '').toLowerCase() : '';
  if (ext && EXT_LANGUAGE[ext]) return EXT_LANGUAGE[ext];
  if (/javascript/.test(mime)) return 'javascript';
  if (/typescript/.test(mime)) return 'typescript';
  if (/json/.test(mime)) return 'json';
  if (/html/.test(mime)) return 'markup';
  if (/css/.test(mime)) return 'css';
  return 'plaintext';
};

const tokenColor = (type: string | string[]): string | undefined => {
  const types = Array.isArray(type) ? type : [type];
  for (const t of types) {
    if (SHOULD_COLOR_TOKEN.has(t)) {
      const color = CODE_TOKEN_COLORS[`token ${t}`];
      if (color) return color;
    }
  }
  return undefined;
};

const renderToken = (token: Prism.Token | string, key: string): React.ReactNode => {
  if (typeof token === 'string') return token;
  const content = Array.isArray(token.content)
    ? token.content.map((child, i) => renderToken(child as Prism.Token | string, `${key}-${i}`))
    : renderToken(token.content as string | Prism.Token, `${key}-c`);
  const color = tokenColor(token.type);
  if (!color) return <React.Fragment key={key}>{content}</React.Fragment>;
  return (
    <span key={key} style={{ color }}>
      {content}
    </span>
  );
};

interface FileCodeProps {
  code: string;
  name?: string;
  mimeType?: string;
  className?: string;
}

/** 带语法着色的文本文件正文（外层是 pre，样式由调用方传 class 决定） */
export const FileCode: React.FC<FileCodeProps> = ({ code, name, mimeType, className }) => {
  const language = detectFileLanguage(name, mimeType);
  const nodes = React.useMemo<React.ReactNode>(() => {
    const grammar = Prism.languages[language];
    if (!code || !grammar || language === 'plaintext') return code;
    try {
      return Prism.tokenize(code, grammar).map((token, i) => renderToken(token, String(i)));
    } catch {
      return code;
    }
  }, [code, language]);

  return <pre className={className}>{nodes}</pre>;
};

export default FileCode;
