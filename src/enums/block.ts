export const BlockElementType = {
  PARAGRAPH: 'paragraph',
  HEADING: 'heading',
  BLOCKQUOTE: 'blockquote',
  CODE_BLOCK: 'code-block',
  CODE_LINE: 'code-line',
  LIST_ITEM: 'list-item',
  NUMBERED_LIST: 'numbered-list',
  BULLETED_LIST: 'bulleted-list',
  TODO_LIST: 'todo-list',
  IMAGE_BLOCK: 'image-block',
  DIVIDER: 'divider',
} as const;

export type BlockElementType = (typeof BlockElementType)[keyof typeof BlockElementType];
