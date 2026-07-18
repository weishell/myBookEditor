import type { Descendant } from 'slate';
import { BlockElementType } from '@/enums';
import { v4 as uuidv4 } from 'uuid';

export const initialValue: Descendant[] = [
  {
    type: BlockElementType.HEADING_ONE,
    id: uuidv4(),
    children: [{ text: '欢迎使用文档编辑器' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    style: { lineHeight: '1.8' },
    attrs: {
      customData: 'intro-content',
    },
    children: [
      {
        text: '这是一个基于 Slate 构建的文档编辑器。支持富文本编辑，包括标题、段落、列表、引用等功能。',
      },
    ],
  },
  {
    type: BlockElementType.HEADING_TWO,
    id: uuidv4(),
    children: [{ text: '主要功能' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      {
        text: '支持多种标题级别、粗体斜体下划线格式化、有序列表和无序列表、代码块和行内代码、引用块等功能。',
      },
    ],
  },
  {
    type: BlockElementType.HEADING_TWO,
    id: uuidv4(),
    children: [{ text: '引用示例' }],
  },
  {
    type: BlockElementType.BLOCKQUOTE,
    id: uuidv4(),
    attrs: {
      cite: 'https://example.com',
    },
    children: [{ text: '这是一段引用文字。引用功能可以用来强调重要内容或引用他人观点。' }],
  },
  {
    type: BlockElementType.HEADING_TWO,
    id: uuidv4(),
    children: [{ text: '代码示例' }],
  },
  {
    type: BlockElementType.CODE_BLOCK,
    id: uuidv4(),
    attrs: {
      language: 'javascript',
    },
    children: [{ text: 'console.log("Hello, World!");' }],
  },
  {
    type: BlockElementType.HEADING_THREE,
    id: uuidv4(),
    children: [{ text: '小标题示例' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      { text: '你可以使用工具栏中的按钮来格式化文本。选中文字后点击相应的格式按钮即可应用样式。' },
    ],
  },
];
