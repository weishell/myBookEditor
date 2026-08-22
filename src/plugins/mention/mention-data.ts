/** 艾特弹框的内置数据（分类 + 文章） */

export interface MentionItem {
  id: string;
  name: string;
  kind: 'category' | 'doc';
  /** 所属分类 id（仅 doc 类型有） */
  categoryId?: string;
  /** 描述/副标题 */
  description?: string;
}

export const mentionCategories: MentionItem[] = [
  { id: 'cat-product', name: '产品需求', kind: 'category', description: '产品相关文档与需求' },
  { id: 'cat-design', name: '设计规范', kind: 'category', description: 'UI/UX 设计资源' },
  { id: 'cat-dev', name: '技术开发', kind: 'category', description: '研发文档与技术方案' },
  { id: 'cat-ops', name: '运营活动', kind: 'category', description: '运营方案与活动策划' },
  { id: 'cat-hr', name: '人事行政', kind: 'category', description: '人事与行政制度' },
];

export const mentionDocs: MentionItem[] = [
  {
    id: 'doc-prd-v2',
    name: '产品需求文档 V2.0',
    kind: 'doc',
    categoryId: 'cat-product',
    description: '核心功能需求说明',
  },
  {
    id: 'doc-roadmap',
    name: '产品路线图 2026',
    kind: 'doc',
    categoryId: 'cat-product',
    description: '全年产品规划',
  },
  {
    id: 'doc-user-research',
    name: '用户调研报告',
    kind: 'doc',
    categoryId: 'cat-product',
    description: 'Q2 用户访谈汇总',
  },
  {
    id: 'doc-design-system',
    name: '设计系统规范',
    kind: 'doc',
    categoryId: 'cat-design',
    description: '组件库与视觉规范',
  },
  {
    id: 'doc-icon-lib',
    name: '图标库全集',
    kind: 'doc',
    categoryId: 'cat-design',
    description: '线性图标 200+ 枚',
  },
  {
    id: 'doc-prototype',
    name: '交互原型文件',
    kind: 'doc',
    categoryId: 'cat-design',
    description: '高保真原型链接',
  },
  {
    id: 'doc-arch',
    name: '系统架构设计',
    kind: 'doc',
    categoryId: 'cat-dev',
    description: '前后端架构总览',
  },
  {
    id: 'doc-api',
    name: 'API 接口文档',
    kind: 'doc',
    categoryId: 'cat-dev',
    description: 'RESTful API 说明',
  },
  {
    id: 'doc-deploy',
    name: '部署运维手册',
    kind: 'doc',
    categoryId: 'cat-dev',
    description: '线上发布流程',
  },
  {
    id: 'doc-newyear',
    name: '新年活动方案',
    kind: 'doc',
    categoryId: 'cat-ops',
    description: '春节运营活动策划',
  },
  {
    id: 'doc-growth',
    name: '用户增长策略',
    kind: 'doc',
    categoryId: 'cat-ops',
    description: '增长黑客方法论',
  },
  {
    id: 'doc-onboarding',
    name: '新员工入职手册',
    kind: 'doc',
    categoryId: 'cat-hr',
    description: '入职指引与须知',
  },
  {
    id: 'doc-leave',
    name: '请假考勤制度',
    kind: 'doc',
    categoryId: 'cat-hr',
    description: '年假病假事假规定',
  },
];

/** 全部艾特选项（分类在前，文章在后） */
export const allMentionItems: MentionItem[] = [...mentionCategories, ...mentionDocs];

/** 按关键词搜索，返回匹配的分类和文章 */
export const searchMentions = (keyword: string): MentionItem[] => {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return allMentionItems;
  return allMentionItems.filter(
    (item) =>
      item.name.toLowerCase().includes(kw) || (item.description || '').toLowerCase().includes(kw),
  );
};
