// 站点数据选择器：同步读取内存快照（main.tsx 里已 bootstrap 过）
// 保留原来的函数名，页面改动最小；分类/标签的使用数量现算，数据变了自然跟着变
import { getDataState } from './store';
import type { ArticleIndex, Category, CategoryWithCount, Tag, TagWithCount } from './types';

export type { Article, ArticleIndex, ArticleInput, Category, Tag } from './types';

/** 列表每页加载篇数 */
export const ARTICLE_PAGE_SIZE = 50;

/** 列表按更新时间倒序（updatedAt 优先，缺则用 date），保证“最近更新”与“全部文章”顺序一致 */
export const getAllArticles = (): ArticleIndex[] =>
  [...getDataState().articles].sort((a, b) => {
    const da = a.updatedAt || a.date || '';
    const db = b.updatedAt || b.date || '';
    return db.localeCompare(da);
  });

export const getArticleById = (id: string): ArticleIndex | undefined =>
  getDataState().articles.find((a) => a.id === id);

export const getCategory = (id: string): Category | undefined =>
  getDataState().categories.find((c) => c.id === id);

export const getTag = (id: string): Tag | undefined => getDataState().tags.find((t) => t.id === id);

export const getArticlesByCategory = (id: string): ArticleIndex[] =>
  getDataState().articles.filter((a) => a.category === id);

/**
 * 上一篇 / 下一篇：按「首页分类顺序 + 分类内列表顺序」把全站文章串成一条阅读线，
 * 分类末尾自动接到下一个分类的第一篇，分类开头往前则回到上一个分类的最后一篇。
 * 分类内顺序刻意与分类列表页保持一致（不做时间排序），这样点上一/下一篇
 * 和文章在列表里的上下位置对得上，也不会因为自动保存刷新时间而乱跳。
 */
export function getArticleNeighbors(id: string): {
  prev: ArticleIndex | null;
  next: ArticleIndex | null;
} {
  const { categories } = getDataState();
  const ordered: ArticleIndex[] = [];
  for (const category of categories) {
    ordered.push(...getArticlesByCategory(category.id));
  }
  const index = ordered.findIndex((a) => a.id === id);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}

export const getArticlesByTag = (id: string): ArticleIndex[] =>
  getDataState().articles.filter((a) => a.tags.includes(id));

export const getArticleTotal = (): number => getDataState().articles.length;

export const getAllCategories = (): CategoryWithCount[] => {
  const counts: Record<string, number> = {};
  for (const article of getDataState().articles) {
    counts[article.category] = (counts[article.category] ?? 0) + 1;
  }
  return getDataState().categories.map((c) => ({ ...c, count: counts[c.id] ?? 0 }));
};

export const getAllTags = (): TagWithCount[] => {
  const counts: Record<string, number> = {};
  for (const article of getDataState().articles) {
    for (const tag of article.tags) counts[tag] = (counts[tag] ?? 0) + 1;
  }
  return getDataState()
    .tags.map((t) => ({ ...t, count: counts[t.id] ?? 0 }))
    .sort((a, b) => b.count - a.count);
};
