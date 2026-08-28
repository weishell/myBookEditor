import type { BaseEditor, Descendant, BaseElement, BaseText } from 'slate';
import type { ReactEditor } from 'slate-react';
import type { HistoryEditor } from 'slate-history';
import type { BlockElementType } from '@/enums';

export type BlockType = BlockElementType;

export interface CustomElementAttrs {
  [key: string]: unknown;
}

export interface CustomElement extends BaseElement {
  type: BlockElementType;
  id: string;
  style?: Record<string, unknown>;
  attrs?: CustomElementAttrs;
  children: CustomDescendant[];
}

export interface CustomText extends BaseText {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  color?: string;
  highlight?: string;
  fontFamily?: string;
  artText?: string;
  /** 超链接：值为跳转地址（文本叶子上的 mark） */
  hyperlink?: string;
  /** 是否为输入时自动识别生成的链接（其文本必须一直保持合法 URL） */
  hyperlinkAuto?: boolean;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type CustomDescendant = Descendant;
