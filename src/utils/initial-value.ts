import type { Descendant } from 'slate';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import { v4 as uuidv4 } from 'uuid';

const codeBlockId = uuidv4();
const codeText = 'console.log("Hello, World!");\nconst a = 1;\nconst b = 2;\nconsole.log(a + b);';
const codeLines = codeText.split('\n').map((text, i) => ({
  type: BlockElementType.CODE_LINE,
  id: `${codeBlockId}-line-${i}`,
  attrs: { lineNumber: i + 1 },
  children: [{ text }, { text: ZERO_WIDTH_SPACE }],
}));

export const initialValue: Descendant[] = [
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 1 },
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
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 1 },
    children: [{ text: '' }],
  },
  {
    type: BlockElementType.DIVIDER,
    id: uuidv4(),
    children: [{ text: '' }],
  },
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 2 },
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
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 2 },
    children: [{ text: '待办事项示例' }],
  },
  {
    type: BlockElementType.TODO_LIST,
    id: uuidv4(),
    attrs: { checked: false },
    children: [{ text: '完成文档编辑器基础功能' }],
  },
  {
    type: BlockElementType.TODO_LIST,
    id: uuidv4(),
    attrs: { checked: false },
    children: [{ text: '实现 Markdown 快捷键支持' }],
  },
  {
    type: BlockElementType.TODO_LIST,
    id: uuidv4(),
    attrs: { checked: true },
    children: [{ text: '添加代码块语法高亮' }],
  },
  {
    type: BlockElementType.TODO_LIST,
    id: uuidv4(),
    attrs: { checked: true },
    children: [{ text: '实现图片上传和裁剪功能' }],
  },
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 2 },
    children: [{ text: '图片示例' }],
  },
  {
    type: BlockElementType.IMAGE_BLOCK,
    id: uuidv4(),
    attrs: {
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=675&fit=crop',
      width: 800,
      height: 450,
      align: 'center',
    },
    children: [{ text: '' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [{ text: '这是一张示例图片，支持拖拽调整尺寸和对齐功能。' }],
  },
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 2 },
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
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 2 },
    children: [{ text: '代码示例' }],
  },
  {
    type: BlockElementType.CODE_BLOCK,
    id: codeBlockId,
    attrs: {
      language: 'javascript',
      wrap: true,
      height: 150,
    },
    children: codeLines as any,
  },
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 3 },
    children: [{ text: '小标题示例' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      { text: '你可以使用工具栏中的按钮来格式化文本。选中文字后点击相应的格式按钮即可应用样式。' },
    ],
  },
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 2 },
    children: [{ text: '表格示例' }],
  },
  {
    type: BlockElementType.TABLE,
    id: uuidv4(),
    attrs: { borderColor: '#d9d9d9', borderWidth: '1px' },
    children: [
      {
        type: BlockElementType.TABLE_ROW,
        id: uuidv4(),
        attrs: { bgColor: '#fafafa' },
        children: [
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            attrs: { width: '120px' },
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '姓名' }],
              },
            ],
          },
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            attrs: { width: '150px' },
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '部门' }],
              },
            ],
          },
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            attrs: { width: '200px' },
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '职位' }],
              },
            ],
          },
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '入职日期' }],
              },
            ],
          },
        ],
      },
      {
        type: BlockElementType.TABLE_ROW,
        id: uuidv4(),
        children: [
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            attrs: { width: '120px' },
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '张三' }],
              },
            ],
          },
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            attrs: { width: '150px' },
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '技术部' }],
              },
            ],
          },
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            attrs: { width: '200px' },
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '高级工程师' }],
              },
            ],
          },
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '2023-01-15' }],
              },
            ],
          },
        ],
      },
      {
        type: BlockElementType.TABLE_ROW,
        id: uuidv4(),
        children: [
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            attrs: { width: '120px' },
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '李四' }],
              },
            ],
          },
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            attrs: { width: '150px' },
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '产品部' }],
              },
            ],
          },
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            attrs: { width: '200px' },
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '产品经理' }],
              },
            ],
          },
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '2023-03-20' }],
              },
            ],
          },
        ],
      },
      {
        type: BlockElementType.TABLE_ROW,
        id: uuidv4(),
        children: [
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            attrs: { width: '120px' },
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '王五' }],
              },
            ],
          },
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            attrs: { width: '150px' },
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '设计部' }],
              },
            ],
          },
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            attrs: { width: '200px' },
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: 'UI设计师' }],
              },
            ],
          },
          {
            type: BlockElementType.TABLE_CELL,
            id: uuidv4(),
            children: [
              {
                type: BlockElementType.PARAGRAPH,
                id: uuidv4(),
                attrs: {},
                children: [{ text: '2023-06-10' }],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      {
        text: '表格支持插入行、插入列、删除行、删除列以及合并单元格等操作，右键点击表格可以打开更多功能菜单。',
      },
    ],
  },
];
