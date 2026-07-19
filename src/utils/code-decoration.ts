import type { Range, NodeEntry } from 'slate';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import { BlockElementType } from '@/enums';

export const CODE_TOKEN_COLORS: Record<string, string> = {
  'token comment': '#6a9955',
  'token prolog': '#6a9955',
  'token doctype': '#6a9955',
  'token cdata': '#6a9955',

  'token keyword': '#569cd6',
  'token selector-tag': '#569cd6',
  'token selector-id': '#569cd6',
  'token selector-class': '#569cd6',
  'token selector-attr': '#569cd6',
  'token selector-pseudo': '#569cd6',

  'token string': '#ce9178',
  'token attr-value': '#ce9178',
  'token char': '#ce9178',

  'token number': '#b5cea8',

  'token function': '#dcdcaa',
  'token function-name': '#dcdcaa',

  'token variable': '#9cdcfe',
  'token property': '#9cdcfe',

  'token class-name': '#4ec9b0',
  'token builtin': '#4ec9b0',

  'token boolean': '#569cd6',
  'token constant': '#9cdcfe',

  'token tag': '#569cd6',
  'token attr-name': '#9cdcfe',

  'token regex': '#ce9178',
  'token important': '#569cd6',
};

export const SHOULD_COLOR_TOKEN = new Set([
  'comment',
  'prolog',
  'doctype',
  'cdata',
  'keyword',
  'selector-tag',
  'selector-id',
  'selector-class',
  'selector-attr',
  'selector-pseudo',
  'string',
  'attr-value',
  'char',
  'number',
  'function',
  'function-name',
  'variable',
  'property',
  'class-name',
  'builtin',
  'boolean',
  'constant',
  'tag',
  'attr-name',
  'regex',
  'important',
]);

interface CodeBlockElement {
  type: string;
  children: any[];
  attrs?: {
    language?: string;
  };
}

interface TextNodeInfo {
  path: number[];
  text: string;
  start: number;
}

export const codeDecorate = ([node, path]: NodeEntry): Range[] => {
  const decorations: Range[] = [];

  if (!('children' in node) || !Array.isArray((node as any).children)) {
    return decorations;
  }

  const blockType = (node as any)?.type;
  if (blockType !== BlockElementType.CODE_BLOCK) {
    return decorations;
  }

  const codeBlock = node as CodeBlockElement;
  const language = codeBlock.attrs?.language || 'javascript';
  const prismLanguage = Prism.languages[language] || Prism.languages.javascript;

  // 收集所有文本节点信息：路径、文本、在整行合并文本中的起始位置
  const textNodes: TextNodeInfo[] = [];
  let globalOffset = 0;

  (codeBlock.children || []).forEach((lineNode: any, lineIndex: number) => {
    if (lineNode.type === BlockElementType.CODE_LINE) {
      (lineNode.children || []).forEach((textNode: any, textIndex: number) => {
        const text = textNode.text || '';
        if (text.length > 0) {
          textNodes.push({
            path: [...path, lineIndex, textIndex],
            text,
            start: globalOffset,
          });
          globalOffset += text.length;
        }
      });
    }
  });

  if (textNodes.length === 0) return decorations;

  const fullText = textNodes.map((n) => n.text).join('');
  if (!fullText) return decorations;

  const tokens = Prism.tokenize(fullText, prismLanguage);
  let offset = 0;

  const traverseTokens = (token: Prism.Token | string) => {
    if (typeof token === 'string') {
      offset += token.length;
      return;
    }

    const length = token.length as number;
    const tokenType = token.type as string;

    if (SHOULD_COLOR_TOKEN.has(tokenType)) {
      const start = offset;
      const end = offset + length;

      // 为 token 跨越的每个文本节点分别创建 decoration
      for (const textNode of textNodes) {
        const nodeStart = textNode.start;
        const nodeEnd = textNode.start + textNode.text.length;

        if (nodeEnd <= start || nodeStart >= end) continue;

        const localStart = Math.max(0, start - nodeStart);
        const localEnd = Math.min(textNode.text.length, end - nodeStart);

        if (localEnd > localStart) {
          decorations.push({
            anchor: { path: textNode.path, offset: localStart },
            focus: { path: textNode.path, offset: localEnd },
            [tokenType]: true,
          });
        }
      }
    }

    offset += length;

    if (token.content && Array.isArray(token.content)) {
      token.content.forEach(traverseTokens);
    }
  };

  tokens.forEach(traverseTokens);

  return decorations;
};
