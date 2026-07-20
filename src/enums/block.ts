export const BlockElementType = {
  PARAGRAPH: 'paragraph',
  HEADING_ONE: 'heading-one',
  HEADING_TWO: 'heading-two',
  HEADING_THREE: 'heading-three',
  BLOCKQUOTE: 'blockquote',
  CODE_BLOCK: 'code-block',
  CODE_LINE: 'code-line',
  LIST_ITEM: 'list-item',
  NUMBERED_LIST: 'numbered-list',
  BULLETED_LIST: 'bulleted-list',
  IMAGE_BLOCK: 'image-block',
} as const;

export type BlockElementType = (typeof BlockElementType)[keyof typeof BlockElementType];
