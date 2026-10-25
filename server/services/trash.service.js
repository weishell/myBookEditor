// 回收站业务层：列举 / 关键词搜索 / 分页 / 批量恢复 / 彻底删除
// 真相仍是 data/.trash/ 下的 JSON 文件；这里只做筛选、分页和索引回填
import * as repo from '../repositories/articles.repo.js';
import {
  listTrashEntries,
  removeTrashEntry,
  restoreTrashEntry,
  writeArticleFile,
} from '../storage/article-files.js';
import { badRequest } from '../utils/http-error.js';
import { excerpt, extractText } from './articles.service.js';

/** 每页固定 50 篇，与列表页保持一致 */
const DEFAULT_PAGE_SIZE = 50;

/** 去重、去空，批量接口的统一入参清洗 */
function normalizeNames(names) {
  if (!Array.isArray(names)) throw badRequest('names 必须是数组');
  return [...new Set(names.map((n) => String(n ?? '').trim()).filter(Boolean))];
}

/** 索引行 → 前端列表项（与 ArticleIndex 字段对齐） */
function toItem(entry) {
  const article = entry.article;
  return {
    name: entry.name,
    articleId: entry.articleId,
    title: article?.title ?? '（无法解析的回收站文件）',
    summary: article?.summary ?? '',
    category: article?.categoryId ?? '',
    date: String(article?.createdAt ?? '').slice(0, 10),
    deletedAt: entry.deletedAt,
    size: entry.size,
    matchedIn: '',
    snippet: '',
  };
}

/**
 * 回收站列表：q 命中标题 / 摘要 / 正文任一即返回，命中正文时附上下文摘要。
 * 按删除时间倒序，50 条一页。
 */
export function listTrash(query = {}) {
  const q = String(query.q ?? '')
    .trim()
    .toLowerCase();
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number.parseInt(query.pageSize, 10) || DEFAULT_PAGE_SIZE),
  );

  const items = [];
  for (const entry of listTrashEntries()) {
    const article = entry.article;
    const item = toItem(entry);

    if (q) {
      // 坏文件没有正文可搜，直接跳过，避免出现一条永远匹配不上的“幽灵”结果
      if (!article) continue;
      const inTitle = article.title.toLowerCase().includes(q);
      const inSummary = article.summary.toLowerCase().includes(q);
      const body = extractText(article.content);
      const inBody = body.toLowerCase().includes(q);
      if (!inTitle && !inSummary && !inBody) continue;

      item.matchedIn = inTitle ? 'title' : inSummary ? 'summary' : 'body';
      item.snippet = excerpt(inTitle || inSummary ? article.summary || body : body, q);
    }

    items.push(item);
  }

  items.sort((a, b) => String(b.deletedAt).localeCompare(String(a.deletedAt)));
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

/**
 * 批量恢复：文件移回 data/articles/ 后重建索引。
 * 逐条返回结果——一条坏文件不该拖累整批。
 * 若当前已有同标题文章，自动加“（恢复）”后缀，避免标题重复。
 */
export function restoreTrash(names) {
  const list = normalizeNames(names);
  if (list.length === 0) throw badRequest('请先选择要恢复的文档');

  const restored = [];
  const failed = [];

  for (const name of list) {
    try {
      const article = restoreTrashEntry(name);

      let title = article.title;
      if (repo.titleExists(title)) {
        let n = 1;
        do {
          title = `${article.title}（恢复${n > 1 ? n : ''}）`;
          n += 1;
        } while (repo.titleExists(title));
      }

      const next = title === article.title ? article : { ...article, title };
      if (next !== article) writeArticleFile(next);
      // 索引行可能还在（例如上次索引与文件不一致），就地更新而不是报错
      if (repo.findArticleById(next.id)) {
        repo.updateArticleIndex(next);
      } else {
        repo.insertArticle({ ...next, relPath: `articles/${next.id}.json` });
      }

      restored.push({ name, id: next.id, title: next.title });
    } catch (err) {
      failed.push({ name, error: err instanceof Error ? err.message : '恢复失败' });
    }
  }

  return { restored, failed };
}

/** 批量彻底删除：直接删盘，不可恢复 */
export function purgeTrash(names) {
  const list = normalizeNames(names);
  if (list.length === 0) throw badRequest('请先选择要彻底删除的文档');

  const deleted = [];
  const failed = [];
  for (const name of list) {
    try {
      removeTrashEntry(name);
      deleted.push(name);
    } catch (err) {
      failed.push({ name, error: err instanceof Error ? err.message : '删除失败' });
    }
  }
  return { deleted, failed };
}
