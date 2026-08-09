import type { Descendant } from 'slate';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import { v4 as uuidv4 } from 'uuid';

const codeBlockId = uuidv4();
const codeText = 'console.log("Hello, World!");\nconst a = 1;\nconst b = 2;\nconsole.log(a + b);';
const codeLines = codeText.split('\n').map((text, i) => ({
  type: BlockElementType.CODE_LINE,
  id: `${codeBlockId}-line-${i}`,
  children: [{ text }, { text: ZERO_WIDTH_SPACE }],
}));

export const initialValue: Descendant[] = [
  {
    type: BlockElementType.HEADING_TITLE,
    id: uuidv4(),
    attrs: {
      author: '青柠脉动',
      date: new Date().toISOString().slice(0, 10),
    },
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
    children: [{ text: '引用块示例' }],
  },
  {
    type: BlockElementType.BLOCKQUOTE,
    id: uuidv4(),
    attrs: { type: 'info', label: '说明' },
    children: [
      { text: '本文档编辑器支持 Markdown 语法，可以使用快捷键快速插入标题、列表、代码块等元素。' },
    ],
  },
  {
    type: BlockElementType.BLOCKQUOTE,
    id: uuidv4(),
    attrs: { type: 'note', label: '注意' },
    children: [
      {
        text: '在编辑过程中，系统会自动保存你的内容。你也可以手动点击保存按钮或使用 Ctrl+S 快捷键进行保存。',
      },
    ],
  },
  {
    type: BlockElementType.BLOCKQUOTE,
    id: uuidv4(),
    attrs: { type: 'warning', label: '警告' },
    children: [{ text: '切换主题或退出编辑模式前，请确保内容已保存，未保存的更改可能会丢失。' }],
  },
  {
    type: BlockElementType.BLOCKQUOTE,
    id: uuidv4(),
    attrs: { type: 'tip', label: '提示' },
    children: [{ text: '选中文本后点击右键可以快速调出格式菜单，提高编辑效率。' }],
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
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 2 },
    children: [{ text: '文本格式展示' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      { text: '这是一段包含' },
      { text: '加粗', bold: true },
      { text: '、' },
      { text: '斜体', italic: true },
      { text: '、' },
      { text: '下划线', underline: true },
      { text: '、' },
      { text: '删除线', strikethrough: true },
      { text: ' 的文字。还可以' },
      { text: '组合样式', bold: true, italic: true, underline: true },
      { text: '，或者设置' },
      { text: '文字颜色', color: '#1890ff' },
      { text: '和' },
      { text: '高亮背景', highlight: '#fff5b1' },
      { text: '。' },
    ],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      { text: '不同' },
      { text: '字体', fontFamily: 'Georgia, serif' },
      { text: '也可以在同一行中' },
      { text: '混合', fontFamily: 'Courier New, monospace', bold: true, color: '#e83e8c' },
      { text: '展示。' },
    ],
  },
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 2 },
    children: [{ text: '艺术字效果' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      {
        text: '渐变文字',
        artText: JSON.stringify({
          type: 'gradient',
          colors: ['#ff0000', '#8a2be2', '#0000ff'],
          direction: 'left-to-right',
        }),
      },
    ],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      {
        text: '发光文字',
        artText: JSON.stringify({ type: 'glow', glowColor: '#ff6600', glowIntensity: 8 }),
      },
    ],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      {
        text: '阴影文字',
        artText: JSON.stringify({
          type: 'shadow',
          shadowColor: '#333333',
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowBlur: 4,
        }),
      },
    ],
  },
];
