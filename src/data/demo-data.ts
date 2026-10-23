// 内置示例数据：只在「数据源不可用」时兜底（本地 API 没起、线上快照没生成）
// 与真实数据使用同一套形状，页面无需感知差异。
// 这里只保留一篇“精修过的完整示例”，不再批量生成假文章，避免首页出现大量重复占位内容。
import type { Descendant } from 'slate';
import type { Article, Category, Tag } from './types';

export const DEMO_CATEGORIES: Category[] = [
  { id: 'design', name: '设计创意', color: '#e05b3f', icon: '🎨', desc: '视觉、交互与产品设计' },
  { id: 'tools', name: '效率工具', color: '#d4a017', icon: '🧰', desc: '软件工具与工作流搭建' },
  {
    id: 'frontend',
    name: '前端开发',
    color: '#2f6fed',
    icon: '🖥️',
    desc: '框架、工程化与浏览器技术',
  },
];

export const DEMO_TAGS: Tag[] = [
  { id: 'design', name: '设计', color: '#e05b3f' },
  { id: 'notes', name: '学习笔记', color: '#94a3b8' },
  { id: 'tools', name: '效率工具', color: '#d4a017' },
  { id: 'frontend', name: '前端', color: '#2f6fed' },
];

// 一篇完整示例文章：覆盖标题 / 段落 / 提示块 / 列表 / 代码块 / 待办 / 分割线 / 引用 / 图片
// 既是离线兜底样本，也用来展示编辑器支持的块类型。
const DEMO_CONTENT: Descendant[] = [
  {
    type: 'heading-title',
    id: 'demo-title',
    attrs: { author: '青柠脉动', date: '2026-10-17' },
    children: [{ text: 'MyBook 写作台 · 功能一览' }],
  },
  {
    type: 'heading',
    id: 'demo-h1',
    attrs: { level: 2 },
    children: [{ text: '为什么是 MyBook 写作台' }],
  },
  {
    type: 'paragraph',
    id: 'demo-p1',
    children: [
      {
        text: 'MyBook 把“写作”和“发布”拆成了两件独立的事：你只管在本地把内容写清楚，文件就是唯一真相；发布时前端直接读同一批 JSON，不需要数据库，也不需要服务器常驻。',
      },
    ],
  },
  {
    type: 'hint-block',
    id: 'demo-hint1',
    attrs: { type: 'tip' },
    children: [
      {
        text: '小提示：把正文当成纯文本来写，复杂的排版（列表、代码、卡片）交给块类型去处理，思路会清晰很多。',
      },
    ],
  },
  {
    type: 'heading',
    id: 'demo-h2',
    attrs: { level: 2 },
    children: [{ text: '核心能力一览' }],
  },
  {
    type: 'bulleted-list',
    id: 'demo-ul',
    children: [
      {
        type: 'list-item',
        id: 'demo-li1',
        children: [
          {
            type: 'paragraph',
            id: 'demo-li1-p',
            children: [
              { text: '块化编辑：标题、引用、提示、代码、图片、表格都能当成一个块来拖拽与嵌套。' },
            ],
          },
        ],
      },
      {
        type: 'list-item',
        id: 'demo-li2',
        children: [
          {
            type: 'paragraph',
            id: 'demo-li2-p',
            children: [{ text: '自动保存：正文改动实时落盘，刷新页面也不会丢。' }],
          },
        ],
      },
      {
        type: 'list-item',
        id: 'demo-li3',
        children: [
          {
            type: 'paragraph',
            id: 'demo-li3-p',
            children: [{ text: '多语言界面：内置七种语言，文案跟随设置切换。' }],
          },
        ],
      },
    ],
  },
  {
    type: 'heading',
    id: 'demo-h3',
    attrs: { level: 2 },
    children: [{ text: '一段真实代码示例' }],
  },
  {
    type: 'paragraph',
    id: 'demo-p2',
    children: [{ text: '下面这段代码演示了如何在编辑器里注册一个新的块类型：' }],
  },
  {
    type: 'code-block',
    id: 'demo-code',
    attrs: { language: 'typescript', wrap: true },
    children: [
      {
        type: 'code-line',
        id: 'demo-code-1',
        children: [{ text: "import { BlockElementType } from '@/enums';" }],
      },
      {
        type: 'code-line',
        id: 'demo-code-2',
        children: [{ text: 'export const renderElement = ({ element }) => {' }],
      },
      {
        type: 'code-line',
        id: 'demo-code-3',
        children: [{ text: '  switch (element.type) {' }],
      },
      {
        type: 'code-line',
        id: 'demo-code-4',
        children: [{ text: '    case BlockElementType.HINT_BLOCK: return <HintBlock />;' }],
      },
      {
        type: 'code-line',
        id: 'demo-code-5',
        children: [{ text: '  }' }],
      },
      {
        type: 'code-line',
        id: 'demo-code-6',
        children: [{ text: '};' }],
      },
    ],
  },
  {
    type: 'heading',
    id: 'demo-h4',
    attrs: { level: 2 },
    children: [{ text: '十分钟内上手' }],
  },
  {
    type: 'todo-list',
    id: 'demo-todo1',
    attrs: { checked: true },
    children: [{ text: '在首页点“新建文档”，填标题、选分类。' }],
  },
  {
    type: 'todo-list',
    id: 'demo-todo2',
    attrs: { checked: false },
    children: [{ text: '用“/”唤起块菜单，插入标题、列表和代码块。' }],
  },
  {
    type: 'todo-list',
    id: 'demo-todo3',
    attrs: { checked: false },
    children: [{ text: '滚动到正文底部，留下你的第一条评论。' }],
  },
  {
    type: 'divider',
    id: 'demo-divider',
    children: [{ text: '' }],
  },
  {
    type: 'blockquote',
    id: 'demo-quote',
    attrs: { type: 'info' },
    children: [{ text: '一句话：文件负责内容，数据库负责查询，静态托管负责公开阅读。' }],
  },
  {
    type: 'image-block',
    id: 'demo-img',
    attrs: { url: '/b1.png', align: 'center', width: 720 },
    children: [{ text: '' }],
  },
];

export const DEMO_ARTICLES: Article[] = [
  {
    id: 'demo-showcase',
    title: 'MyBook 写作台 · 功能一览',
    summary:
      '一篇完整的示例文档：覆盖标题、列表、代码块、待办、提示与图片，用来展示编辑器支持的块类型。',
    category: 'design',
    tags: ['design', 'notes'],
    date: '2026-10-17',
    reads: 128,
    content: DEMO_CONTENT,
  },
];
