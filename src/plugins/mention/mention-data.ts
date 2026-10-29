/** 艾特弹框的候选数据：实时读取站点的分类、标签与文章 */
import { getDataState } from '@/data/store';

export interface MentionItem {
  id: string;
  name: string;
  kind: 'category' | 'tag' | 'doc';
  /** 所属分类 id（仅 doc 类型有） */
  categoryId?: string;
  /** 描述/副标题 */
  description?: string;
  /** 展示图标（分类用自身 icon，标签用 #，文章用文档图标） */
  icon?: string;
  /** 主题色（分类 / 标签） */
  color?: string;
  /** 点击跳转地址 */
  url: string;
}

/**
 * 构建全部艾特选项（分类 → 标签 → 文章）。
 * 每次调用都从内存快照现算，分类/标签/文章改动后立即生效。
 */
export const getMentionItems = (): MentionItem[] => {
  const { categories, tags, articles } = getDataState();

  const categoryCounts: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};
  for (const article of articles) {
    categoryCounts[article.category] = (categoryCounts[article.category] ?? 0) + 1;
    for (const tag of article.tags) tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
  }

  const categoryItems: MentionItem[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    kind: 'category',
    description: [c.desc, `${categoryCounts[c.id] ?? 0} 篇`].filter(Boolean).join(' · '),
    icon: c.icon || '📁',
    color: c.color,
    url: `/category/${encodeURIComponent(c.id)}`,
  }));

  const tagItems: MentionItem[] = tags.map((t) => ({
    id: t.id,
    name: t.name,
    kind: 'tag',
    description: `# ${t.name} · ${tagCounts[t.id] ?? 0} 篇`,
    icon: '#',
    color: t.color,
    url: `/tag/${encodeURIComponent(t.id)}`,
  }));

  const docItems: MentionItem[] = articles.map((a) => ({
    id: a.id,
    name: a.title,
    kind: 'doc',
    categoryId: a.category,
    description: (a.summary || '').trim() || undefined,
    icon: '📄',
    url: `/article/${encodeURIComponent(a.id)}`,
  }));

  return [...categoryItems, ...tagItems, ...docItems];
};

/** 按关键词搜索，返回匹配的分类、标签和文章 */
export const searchMentions = (keyword: string): MentionItem[] => {
  const all = getMentionItems();
  const kw = keyword.trim().toLowerCase();
  if (!kw) return all;
  return all.filter(
    (item) =>
      item.name.toLowerCase().includes(kw) || (item.description || '').toLowerCase().includes(kw),
  );
};
