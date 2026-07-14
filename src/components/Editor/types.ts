import type { BaseEditor, Descendant, BaseElement, BaseText } from 'slate';
import type { ReactEditor } from 'slate-react';
import type { HistoryEditor } from 'slate-history';
import type { BlockElementType } from '@/enums';

export type BlockType = BlockElementType;

export interface CustomElementAttrs {
  [key: string]: unknown;
}

export interface CustomElement extends BaseElement {
  type?: BlockElementType;
  plugin_id?: string;
  style?: Record<string, unknown>;
  attrs?: CustomElementAttrs;
  children: CustomText[];
}

export interface CustomText extends BaseText {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type CustomDescendant = Descendant;
