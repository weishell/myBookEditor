// 站点数据模型：列表用 ArticleIndex（无正文），详情才带 content
import type { Descendant } from 'slate';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  desc: string;
  /** 封面相对地址（media/images/covers/xxx.png）；为空时前端展示默认封面 */
  cover?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

/** 列表项：索引库/静态索引里的形状，正文不在其中 */
export interface ArticleIndex {
  id: string;
  title: string;
  summary: string;
  /** 分类 id（历史字段名沿用 category，便于页面少改） */
  category: string;
  tags: string[];
  date: string;
  reads: number;
  updatedAt?: string;
}

/** 单篇：索引 + Slate 正文 */
export interface Article extends ArticleIndex {
  content: Descendant[];
}

export interface CategoryWithCount extends Category {
  count: number;
}

export interface TagWithCount extends Tag {
  count: number;
}

/** 新建文档时前端提交的入参 */
export interface ArticleInput {
  title: string;
  summary?: string;
  categoryId?: string;
  tagIds?: string[];
  content?: Descendant[];
}

/** 数据来源：api=本地后端（可写）｜static=线上静态 JSON（只读）｜demo=接口不可用时的内置示例 */
export type DataSource = 'api' | 'static' | 'demo';

/** 回收站条目：对应 data/.trash/ 下的一个文件，name 是它的唯一标识 */
export interface TrashEntry {
  name: string;
  articleId: string;
  title: string;
  summary: string;
  /** 分类 id */
  category: string;
  /** 原文创建日期 */
  date: string;
  /** 删除时间（ISO） */
  deletedAt: string;
  size: number;
  /** 关键词命中位置：title / summary / body，空字符串表示无搜索 */
  matchedIn?: 'title' | 'summary' | 'body' | '';
  snippet?: string;
}
