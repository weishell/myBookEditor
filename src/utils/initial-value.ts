import type { Descendant } from 'slate';
import { BlockElementType, LilistType, ZERO_WIDTH_SPACE } from '@/enums';
import { v4 as uuidv4 } from 'uuid';

const codeBlockId = uuidv4();
// 列表示例分组 id（lilist 绑定模型）
const demoOlListId = uuidv4();
const demoUlListId = uuidv4();
const codeText = 'console.log("Hello, World!");\nconst a = 1;\nconst b = 2;\nconsole.log(a + b);';
const codeLines = codeText.split('\n').map((text, i) => ({
  type: BlockElementType.CODE_LINE,
  id: `${codeBlockId}-line-${i}`,
  children: [{ text }, { text: ZERO_WIDTH_SPACE }],
}));

// —— 分栏示例数据 ——
const makeDemoParagraph = (text: string): Descendant => ({
  type: BlockElementType.PARAGRAPH,
  id: uuidv4(),
  children: [{ text }],
});

const makeDemoColumn = (title: string, texts: string[], width: number): Descendant => ({
  type: BlockElementType.COLUMN,
  id: uuidv4(),
  attrs: { width },
  children: [
    {
      type: BlockElementType.HEADING,
      id: uuidv4(),
      attrs: { level: 3 },
      children: [{ text: title }],
    },
    ...texts.map(makeDemoParagraph),
  ],
});

const demoColumnGroup: Descendant = {
  type: BlockElementType.COLUMN_GROUP,
  id: uuidv4(),
  attrs: {},
  children: [
    makeDemoColumn('计划与目标', ['左侧分栏用于拆分版式，各栏内容独立编辑。'], 33),
    makeDemoColumn('执行要点', ['拖动分栏之间的分隔线即可调整列宽。'], 33),
    makeDemoColumn(
      '备注',
      ['悬停分栏右上角的 × 可删除该栏，宽度会自动分给其余栏。', '点击分隔线上的 ▶ 可新增一栏。'],
      34,
    ),
  ],
};

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
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      { text: '行内公式示例：质能方程 ' },
      {
        type: BlockElementType.FORMULA,
        id: uuidv4(),
        attrs: { value: 'E = mc^2' },
        children: [{ text: '' }],
      },
      { text: '，勾股定理 ' },
      {
        type: BlockElementType.FORMULA,
        id: uuidv4(),
        attrs: { value: 'a^2 + b^2 = c^2' },
        children: [{ text: '' }],
      },
      { text: '，以及积分公式 ' },
      {
        type: BlockElementType.FORMULA,
        id: uuidv4(),
        attrs: { value: '\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}' },
        children: [{ text: '' }],
      },
      { text: '。点击公式可编辑，按 ESC 完成输入。' },
    ],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      { text: '艾特功能示例：你可以 ' },
      {
        type: BlockElementType.MENTION,
        id: uuidv4(),
        attrs: { name: '产品需求文档 V2.0', kind: 'doc', targetId: 'doc-prd-v2' },
        children: [{ text: '' }],
      },
      { text: ' 或 ' },
      {
        type: BlockElementType.MENTION,
        id: uuidv4(),
        attrs: { name: '技术开发', kind: 'category', targetId: 'cat-dev' },
        children: [{ text: '' }],
      },
      { text: ' 来引用相关文档和分类。在段落中输入 @ 即可调出选择器。' },
    ],
  },
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 2 },
    children: [{ text: '超链接示例' }],
  },
  {
    // 自动识别链接：输入完整网址后自动变链接，hyperlinkAuto 标记其文本必须一直是合法 URL
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      { text: '自动识别：输入完整网址会自动变成链接，例如 ' },
      {
        text: 'https://www.baidu.com',
        hyperlink: 'https://www.baidu.com',
        hyperlinkAuto: true,
      },
      { text: ' 和 ' },
      { text: 'www.zhihu.com', hyperlink: 'www.zhihu.com', hyperlinkAuto: true },
      { text: '。继续往后输入字母让网址非法（如 www.zhihu.comf）会自动取消链接，' },
      { text: '把多余字符删掉后又会重新变回链接。' },
    ],
  },
  {
    // 手动链接：文字与地址可以不同，不带 hyperlinkAuto，因此不会被自动降级
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      { text: '自定义文字：链接文字可以和地址不同，比如 ' },
      { text: '前往 Slate 官方文档', hyperlink: 'https://docs.slatejs.org' },
      { text: '；链接也能和其它样式叠加：' },
      { text: '加粗链接', hyperlink: 'https://react.dev', bold: true },
      { text: '、' },
      { text: '彩色链接', hyperlink: 'https://vitejs.dev', color: '#e83e8c' },
      { text: '、' },
      { text: '带高亮的链接', hyperlink: 'https://cn.vitejs.dev/', highlight: '#fff5b1' },
      { text: '。选中文字后即可添加链接。' },
    ],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      { text: '边界规则：中文、空格和标点都是链接的边界 —— ' },
      { text: 'https://cn.bing.com', hyperlink: 'https://cn.bing.com', hyperlinkAuto: true },
      { text: ' 后面接着写的中文不会带上链接色，网址本身依然是完整链接。' },
    ],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      {
        text: '操作方式：直接点击链接即可在新标签页打开；鼠标悬停会弹出浮层，可打开、修改地址或移除链接。',
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
    children: [{ text: '列表示例（lilist 绑定模型）' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    attrs: {
      lilist: {
        list_type: LilistType.OL,
        list_id: demoOlListId,
        list_number: 1,
        list_custom: true,
      },
    },
    children: [{ text: '输入 "1." + 空格 可创建有序列表' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    attrs: {
      lilist: {
        list_type: LilistType.OL,
        list_id: demoOlListId,
        list_number: 2,
        list_custom: false,
      },
    },
    children: [{ text: '回车自动延续编号，空项回车退出列表' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    attrs: {
      lilist: {
        list_type: LilistType.OL,
        list_id: demoOlListId,
        list_number: 1,
        list_custom: false,
      },
      indent: 1,
    },
    children: [{ text: 'Tab 缩进形成嵌套子项' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    attrs: {
      lilist: {
        list_type: LilistType.OL,
        list_id: demoOlListId,
        list_number: 3,
        list_custom: false,
      },
    },
    children: [{ text: '嵌套结束后父级编号继续' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [{ text: '（普通段落把列表断开，下方是新列表）' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    attrs: {
      lilist: {
        list_type: LilistType.UL,
        list_id: demoUlListId,
        list_number: 1,
        list_custom: true,
      },
    },
    children: [{ text: '输入 "-" + 空格 可创建无序列表' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    attrs: {
      lilist: {
        list_type: LilistType.UL,
        list_id: demoUlListId,
        list_number: 2,
        list_custom: false,
      },
    },
    children: [{ text: '无序符号随缩进层级交替' }],
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
      { text: '，以及' },
      { text: '行内代码', code: true },
      { text: '（选中文字按 ' },
      { text: 'Ctrl+Shift+C', code: true },
      { text: ' 或输入 `code` 反引号快捷插入）。' },
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
    children: [{ text: '流程图示例' }],
  },
  {
    type: BlockElementType.DRAWIO,
    id: uuidv4(),
    attrs: {
      content:
        'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="520" height="220" viewBox="0 0 520 220">' +
            '<rect x="10" y="10" width="120" height="50" rx="8" fill="#e6f7ff" stroke="#1890ff" stroke-width="2"/>' +
            '<text x="70" y="40" text-anchor="middle" font-size="14" fill="#333">开始</text>' +
            '<line x1="130" y1="35" x2="190" y2="35" stroke="#1890ff" stroke-width="2" marker-end="url(#arrow)"/>' +
            '<rect x="190" y="10" width="140" height="50" rx="8" fill="#fff7e6" stroke="#fa8c16" stroke-width="2"/>' +
            '<text x="260" y="40" text-anchor="middle" font-size="14" fill="#333">处理数据</text>' +
            '<line x1="330" y1="35" x2="390" y2="35" stroke="#1890ff" stroke-width="2" marker-end="url(#arrow)"/>' +
            '<rect x="390" y="10" width="120" height="50" rx="8" fill="#f6ffed" stroke="#52c41a" stroke-width="2"/>' +
            '<text x="450" y="40" text-anchor="middle" font-size="14" fill="#333">完成</text>' +
            '<line x1="260" y1="60" x2="260" y2="110" stroke="#1890ff" stroke-width="2" marker-end="url(#arrow)"/>' +
            '<rect x="190" y="110" width="140" height="50" rx="8" fill="#f9f0ff" stroke="#722ed1" stroke-width="2"/>' +
            '<text x="260" y="140" text-anchor="middle" font-size="14" fill="#333">异常处理</text>' +
            '<line x1="190" y1="135" x2="130" y2="135" stroke="#fa8c16" stroke-width="2" stroke-dasharray="6 3"/>' +
            '<text x="160" y="128" text-anchor="middle" font-size="12" fill="#999">重试</text>' +
            '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#1890ff"/></marker></defs>' +
            '</svg>',
        ),
      xml: '',
      description: '示例流程图 - 点击可编辑',
      width: 520,
      height: 220,
    },
    children: [{ text: '' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      { text: '点击上方流程图可打开 draw.io 编辑器进行编辑，支持创建各类流程图和 UML 图。' },
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
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 2 },
    children: [{ text: '文件与视频示例' }],
  },
  {
    type: BlockElementType.FILE_BLOCK,
    id: uuidv4(),
    attrs: {
      kind: 'file',
      src: '/sample.txt',
      name: 'sample.txt',
      size: 0,
      mimeType: 'text/plain',
      layer: 'card',
    },
    children: [{ text: '' }],
  },
  {
    type: BlockElementType.FILE_BLOCK,
    id: uuidv4(),
    attrs: {
      kind: 'file',
      src: 'https://raw.githubusercontent.com/weishell/myBookEditor/main/public/eg.docx',
      name: 'eg.docx',
      size: 11233,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      layer: 'card',
    },
    children: [{ text: '' }],
  },
  {
    type: BlockElementType.VIDEO_BLOCK,
    id: uuidv4(),
    attrs: {
      kind: 'video',
      src: '',
      name: '新建视频.mp4',
      size: 0,
      mimeType: 'video/mp4',
      layer: 'card',
    },
    children: [{ text: '' }],
  },
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 2 },
    children: [{ text: '分栏示例' }],
  },
  demoColumnGroup,
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 3 },
    children: [{ text: '倒计时示例' }],
  },
  {
    type: BlockElementType.COUNTDOWN,
    id: uuidv4(),
    attrs: {
      mode: 'datetime',
      duration: { days: 2, hours: 0, minutes: 0, seconds: 0 },
      targetDate: Date.now() + 2 * 86400000,
      notify: true,
    },
    children: [{ text: ZERO_WIDTH_SPACE }],
  },

  // —— 日历示例（含农历/节气/节日 + 跨日期日程）——
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 3 },
    children: [{ text: '日历示例' }],
  },
  {
    type: BlockElementType.CALENDAR,
    id: uuidv4(),
    attrs: {
      // 默认展示当月，让示例日程一打开就能看到
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      events: makeDemoCalendarEvents(),
      showLunar: true,
      showTerm: true,
      weekStart: 1,
    },
    children: [{ text: ZERO_WIDTH_SPACE }],
  },

  // —— 时间轴示例（横向 + 交替布局）——
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 3 },
    children: [{ text: '时间轴示例' }],
  },
  {
    type: BlockElementType.TIMELINE,
    id: uuidv4(),
    attrs: {
      width: 700,
      height: 300,
      direction: 'horizontal',
      sideMode: 'alternate',
      items: [
        { id: uuidv4(), title: '项目启动', detail: '完成需求调研与立项评审', time: '2023年1月' },
        { id: uuidv4(), title: '原型设计', detail: '输出高保真原型并通过评审', time: '2023年3月' },
        { id: uuidv4(), title: '开发阶段', detail: '核心功能模块开发与联调', time: '2023年6月' },
        { id: uuidv4(), title: '测试上线', detail: '完成验收测试并正式发布', time: '2023年9月' },
      ],
    },
    children: [{ text: ZERO_WIDTH_SPACE }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      {
        text: '点击时间轴右上角的齿轮图标可切换「交替 / 同侧」和「水平 / 垂直」排列。卡片上的标题、详情、时间均可直接点击编辑，时间支持中文（如「第二年」）和数字（如「2024」）任意输入。',
      },
    ],
  },

  // —— 时间轴示例（纵向 + 同侧布局）——
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [{ text: '下方是纵向 + 同侧排列的时间轴：' }],
  },
  {
    type: BlockElementType.TIMELINE,
    id: uuidv4(),
    attrs: {
      width: 900,
      height: 520,
      direction: 'vertical',
      sideMode: 'same',
      items: [
        { id: uuidv4(), title: '第一阶段', detail: '搭建基础框架', time: '第一年' },
        { id: uuidv4(), title: '第二阶段', detail: '完善核心功能', time: '第二年' },
        { id: uuidv4(), title: '第三阶段', detail: '性能优化与推广', time: '第三年' },
      ],
    },
    children: [{ text: ZERO_WIDTH_SPACE }],
  },

  // —— 图表示例（基于 ECharts，数据可手动录入或粘贴 JSON）——
  {
    type: BlockElementType.HEADING,
    id: uuidv4(),
    attrs: { level: 3 },
    children: [{ text: '图表示例' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [
      {
        text: '在下方插入处点击「图表」即可选择柱状/饼图/词云及其子类型。下方是已生成的柱状图与环形图示例，点击图表上的铅笔可重新配置；选中图表后拖动四角手柄可缩放。',
      },
    ],
  },
  {
    type: BlockElementType.CHART,
    id: uuidv4(),
    attrs: {
      kind: 'bar',
      variant: 'vertical',
      title: '月度销售趋势',
      description: '近五个月销售额（单位：万元）',
      data: [
        { name: '一月', value: 320 },
        { name: '二月', value: 210 },
        { name: '三月', value: 260 },
        { name: '四月', value: 180 },
        { name: '五月', value: 340 },
      ],
      width: 720,
      height: 320,
    },
    children: [{ text: ZERO_WIDTH_SPACE }],
  },
  {
    type: BlockElementType.CHART,
    id: uuidv4(),
    attrs: {
      kind: 'pie',
      variant: 'donut',
      title: '访问来源构成',
      description: '各渠道流量占比',
      data: [
        { name: '直接访问', value: 335 },
        { name: '搜索引擎', value: 246 },
        { name: '邮件营销', value: 148 },
        { name: '联盟广告', value: 102 },
      ],
      width: 560,
      height: 300,
    },
    children: [{ text: ZERO_WIDTH_SPACE }],
  },
  {
    type: BlockElementType.CHART,
    id: uuidv4(),
    attrs: {
      kind: 'gauge',
      variant: 'plain',
      title: '服务器负载',
      description: '当前 CPU 使用率',
      data: [{ name: '当前值', value: 82 }],
      gaugeValue: 82,
      gaugeMin: 0,
      gaugeMax: 100,
      gaugeUnit: '%',
      width: 420,
      height: 300,
    },
    children: [{ text: ZERO_WIDTH_SPACE }],
  },
  {
    // 把图表放进分栏，验证窄容器内自适应
    type: BlockElementType.COLUMN_GROUP,
    id: uuidv4(),
    attrs: {},
    children: [
      {
        type: BlockElementType.COLUMN,
        id: uuidv4(),
        attrs: { width: 50 },
        children: [
          {
            type: BlockElementType.HEADING,
            id: uuidv4(),
            attrs: { level: 3 },
            children: [{ text: '柱状图（窄栏自适应）' }],
          },
          {
            type: BlockElementType.CHART,
            id: uuidv4(),
            attrs: {
              kind: 'bar',
              variant: 'horizontal',
              title: '预算占比',
              description: '',
              data: [
                { name: '研发', value: 46 },
                { name: '市场', value: 28 },
                { name: '运营', value: 18 },
                { name: '管理', value: 8 },
              ],
              width: 720,
              height: 240,
            },
            children: [{ text: ZERO_WIDTH_SPACE }],
          },
        ],
      },
      {
        type: BlockElementType.COLUMN,
        id: uuidv4(),
        attrs: { width: 50 },
        children: [
          {
            type: BlockElementType.HEADING,
            id: uuidv4(),
            attrs: { level: 3 },
            children: [{ text: '词云（窄栏自适应）' }],
          },
          {
            type: BlockElementType.CHART,
            id: uuidv4(),
            attrs: {
              kind: 'wordcloud',
              variant: 'plain',
              title: '关键词热度',
              description: '',
              data: [
                { name: 'ECharts', value: 10000 },
                { name: '数据可视化', value: 7200 },
                { name: '柱状图', value: 6800 },
                { name: '饼图', value: 6100 },
                { name: '折线图', value: 5400 },
                { name: '词云', value: 4900 },
                { name: '主题色', value: 3800 },
                { name: '编辑器', value: 3400 },
                { name: '飞书', value: 2900 },
              ],
              width: 720,
              height: 240,
            },
            children: [{ text: ZERO_WIDTH_SPACE }],
          },
        ],
      },
    ],
  },
];

/**
 * 构造一组贴合"当前展示月"的示例日程（相对当月日期动态生成，
 * 保证任何月份打开都能在当前视图里看到日程条）：
 *  - 单日事件（与另一条单日事件同日，演示泳道叠放）
 *  - 跨 3 天事件（演示连续横条）
 *  - 跨周边界事件（演示周断、圆角续接）
 *  - 跨月事件（演示视口裁剪）
 */
function makeDemoCalendarEvents() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1; // 1-12
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const iso = (year: number, month: number, day: number) => `${year}-${pad2(month)}-${pad2(day)}`;
  const lastDay = new Date(y, m, 0).getDate();
  // 上月/下月（用于跨月事件）
  const prev = new Date(y, m - 2, 1);
  const next = new Date(y, m, 1);

  const day = (d: number) => iso(y, m, Math.min(lastDay, Math.max(1, d)));

  return [
    {
      id: 'cal-ev-1',
      title: '团队周会',
      start: day(3),
      end: day(3),
      color: '#3370ff',
    },
    {
      id: 'cal-ev-2',
      title: '需求评审',
      start: day(3),
      end: day(3),
      color: '#f2a54a',
    },
    {
      id: 'cal-ev-3',
      title: '产品发布准备',
      start: day(10),
      end: day(12),
      color: '#41b584',
    },
    {
      id: 'cal-ev-4',
      title: '项目总结',
      start: day(Math.min(lastDay, 26)),
      end: iso(next.getFullYear(), next.getMonth() + 1, 3),
      color: '#e85a71',
    },
    {
      id: 'cal-ev-5',
      title: '上月收尾',
      start: iso(prev.getFullYear(), prev.getMonth() + 1, 28),
      end: day(2),
      color: '#7b6cf0',
    },
  ];
}
