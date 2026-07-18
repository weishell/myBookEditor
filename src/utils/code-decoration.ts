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

  let text = '';
  (codeBlock.children || []).forEach((child: any) => {
    if (child.text) text += child.text;
  });

  if (!text) return decorations;

  const tokens = Prism.tokenize(text, prismLanguage);
  let offset = 0;

  const traverseTokens = (token: Prism.Token | string) => {
    if (typeof token === 'string') {
      offset += token.length;
      return;
    }

    const length = token.length as number;
    const tokenType = token.type as string;

    if (SHOULD_COLOR_TOKEN.has(tokenType)) {
      decorations.push({
        anchor: { path: [...path, 0], offset },
        focus: { path: [...path, 0], offset: offset + length },
        [tokenType]: true,
      });
    }

    offset += length;

    if (token.content && Array.isArray(token.content)) {
      token.content.forEach(traverseTokens);
    }
  };

  tokens.forEach(traverseTokens);

  return decorations;
};
