// 站点数据选择器：同步读取内存快照（main.tsx 里已 bootstrap 过）
// 保留原来的函数名，页面改动最小；分类/标签的使用数量现算，数据变了自然跟着变
import { getDataState } from './store';
import type { ArticleIndex, Category, CategoryWithCount, Tag, TagWithCount } from './types';

export type { Article, ArticleIndex, ArticleInput, Category, Tag } from './types';

/** 列表每页加载篇数 */
export const ARTICLE_PAGE_SIZE = 50;

export const getAllArticles = (): ArticleIndex[] => getDataState().articles;

export const getArticleById = (id: string): ArticleIndex | undefined =>
  getDataState().articles.find((a) => a.id === id);

export const getCategory = (id: string): Category | undefined =>
  getDataState().categories.find((c) => c.id === id);

export const getTag = (id: string): Tag | undefined => getDataState().tags.find((t) => t.id === id);

export const getArticlesByCategory = (id: string): ArticleIndex[] =>
  getDataState().articles.filter((a) => a.category === id);

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
