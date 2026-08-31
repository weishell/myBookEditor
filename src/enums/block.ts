export const BlockElementType = {
  HEADING_TITLE: 'heading-title',
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
  TABLE: 'table',
  TABLE_ROW: 'table-row',
  TABLE_CELL: 'table-cell',
  DRAWIO: 'drawio',
  FORMULA: 'inline-formula',
  MENTION: 'mention',
  FILE_BLOCK: 'file-block',
  VIDEO_BLOCK: 'video-block',
  COUNTDOWN: 'countdown',
  COLUMN_GROUP: 'column-group',
  COLUMN: 'column',
} as const;

export type BlockElementType = (typeof BlockElementType)[keyof typeof BlockElementType];

/* lilist 列表类型（绑定在段落/标题上的有序无序） */
export const LilistType = {
  OL: 'ol', // 有序列表
  UL: 'ul', // 无序列表
} as const;

export type LilistType = (typeof LilistType)[keyof typeof LilistType];

/* 引用块类型 */
export const BlockquoteType = {
  INFO: 'info', // 说明
  NOTE: 'note', // 注意
  WARNING: 'warning', // 警告
  TIP: 'tip', // 提示
} as const;

export type BlockquoteType = (typeof BlockquoteType)[keyof typeof BlockquoteType];
