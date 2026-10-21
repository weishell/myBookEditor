// 数据内存态：启动时灌一次快照，之后页面同步读取
// 这样列表页不需要改成异步组件 —— 保持原来的同步选择器 API
import type { Descendant } from 'slate';
import type { ArticleIndex, Category, DataSource, Tag } from './types';

interface DataState {
  categories: Category[];
  tags: Tag[];
  articles: ArticleIndex[];
  source: DataSource;
}

let state: DataState = { categories: [], tags: [], articles: [], source: 'demo' };

/** 正文缓存：按篇懒加载，避免每次进详情都请求 */
const contentCache = new Map<string, Descendant[]>();

export const getDataState = (): DataState => state;

export function setDataState(patch: Partial<DataState>) {
  state = { ...state, ...patch };
}

/** 只有本地后端（api）可写；线上静态快照与内置示例都是只读 */
export const canWrite = () => state.source === 'api';

export const getCachedContent = (id: string) => contentCache.get(id);
export const setCachedContent = (id: string, content: Descendant[]) => {
  contentCache.set(id, content);
};
export const clearContentCache = () => contentCache.clear();
