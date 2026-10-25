// 文章业务层：正文读写走文件（data/articles），索引走 SQLite
// 写入顺序：先落文件，再更新索引 —— 索引丢了能重建，文件丢了才是真丢
import crypto from 'node:crypto';
import * as repo from '../repositories/articles.repo.js';
import {
  listArticleFiles,
  readArticleFile,
  trashArticleFile,
  writeArticleFile,
} from '../storage/article-files.js';
import { badRequest, conflict, notFound } from '../utils/http-error.js';
import { assertSafeId } from '../utils/validators.js';

/** 索引行 → 前端列表项（ArticleIndex） */
function toIndex(row) {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary ?? '',
    category: row.categoryId ?? '',
    tags: row.tagIds ?? [],
    date: String(row.createdAt ?? '').slice(0, 10),
    reads: Number(row.reads ?? 0),
    updatedAt: row.updatedAt,
  };
}

/** 文件 + 索引 → 详情（Article） */
function toDetail(article) {
  return {
    id: article.id,
    title: article.title,
    summary: article.summary ?? '',
    category: article.categoryId ?? '',
    tags: article.tagIds ?? [],
    date: String(article.createdAt ?? '').slice(0, 10),
    reads: Number(article.reads ?? 0),
    updatedAt: article.updatedAt,
    content: article.content ?? [],
  };
}

const emptyDocument = () => [
  { type: 'paragraph', id: crypto.randomUUID(), children: [{ text: '' }] },
];

export function listArticles(query = {}) {
  return repo
    .findArticles({
      category: query.category || undefined,
      tag: query.tag || undefined,
      q: query.q || undefined,
    })
    .map(toIndex);
}

export function getArticle(id) {
  assertSafeId(id);
  const row = repo.findArticleById(id);
  const file = readArticleFile(id);
  if (!row && !file) throw notFound('文章不存在');
  // 文件优先：即使索引落后，读到的也是真实内容
  if (file) return toDetail(file);
  throw notFound('文章文件缺失，请检查 data/articles/');
}

export function createArticle(body = {}) {
  const title = String(body.title ?? '').trim();
  if (!title) throw badRequest('标题不能为空');
  if (repo.titleExists(title)) throw conflict('标题已存在');

  const now = new Date().toISOString();
  const article = {
    id: crypto.randomUUID(),
    title,
    summary: String(body.summary ?? ''),
    categoryId: body.categoryId ?? null,
    tagIds: Array.isArray(body.tagIds) ? body.tagIds : [],
    content: Array.isArray(body.content) ? body.content : emptyDocument(),
    status: body.status ?? 'published',
    reads: Number(body.reads ?? 0),
    createdAt: now,
    updatedAt: now,
  };

  writeArticleFile(article);
  repo.insertArticle({ ...article, relPath: `articles/${article.id}.json` });
  return toDetail(article);
}

export function updateArticle(id, body = {}) {
  assertSafeId(id);
  const current = readArticleFile(id) ?? repo.findArticleById(id);
  if (!current) throw notFound('文章不存在');

  const nextTitle = body.title === undefined ? current.title : String(body.title).trim();
  if (!nextTitle) throw badRequest('标题不能为空');
  if (repo.titleExists(nextTitle, id)) throw conflict('标题已存在');

  const article = {
    ...current,
    title: nextTitle,
    summary: body.summary === undefined ? current.summary : String(body.summary),
    categoryId: body.categoryId === undefined ? current.categoryId : body.categoryId,
    tagIds: Array.isArray(body.tagIds) ? body.tagIds : current.tagIds,
    content: Array.isArray(body.content) ? body.content : current.content,
    status: body.status === undefined ? current.status : body.status,
    updatedAt: new Date().toISOString(),
  };

  writeArticleFile(article);
  repo.updateArticleIndex(article);
  return toDetail(article);
}

/** 自动保存：只写正文，标题/分类/标签不动 */
export function autosaveArticle(id, content) {
  assertSafeId(id);
  if (!Array.isArray(content)) throw badRequest('content 必须是数组');

  const current = readArticleFile(id);
  if (!current) throw notFound('文章不存在');

  const updatedAt = new Date().toISOString();
  writeArticleFile({ ...current, content, updatedAt });
  repo.touchArticle(id, updatedAt);
  return { ok: true, updatedAt };
}

/** 阅读量 +1：文件与索引都写，正文和 updatedAt 保持不变 */
export function incrementReads(id) {
  assertSafeId(id);
  const current = readArticleFile(id);
  if (!current) throw notFound('文章不存在');

  const reads = Number(current.reads ?? 0) + 1;
  writeArticleFile({ ...current, reads });
  repo.setReads(id, reads);
  return { id, reads };
}

export function removeArticle(id) {
  assertSafeId(id);
  const exists = readArticleFile(id) || repo.findArticleById(id);
  if (!exists) throw notFound('文章不存在');

  const trashed = trashArticleFile(id);
  repo.deleteArticle(id);
  return { ok: true, trashed: Boolean(trashed), trashPath: trashed };
}

export function countArticles() {
  return repo.countArticles();
}

/** 从 Slate 文档树里抽纯文本（正文全文搜索用） */
export function extractText(nodes) {
  let out = '';
  const walk = (list) => {
    for (const node of list ?? []) {
      if (typeof node.text === 'string') out += `${node.text}\n`;
      if (Array.isArray(node.children)) walk(node.children);
    }
  };
  walk(nodes);
  return out;
}

/** 命中位置前后各取一段，做搜索结果摘要 */
export function excerpt(text, q) {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx < 0) return '';
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + q.length + 90);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\s+/g, ' ').trim()}${end < text.length ? '…' : ''}`;
}

/**
 * 全文搜索：扫 data/articles 下所有文件，标题 / 摘要 / 正文任一命中即返回。
 * 索引库的 LIKE 只覆盖标题摘要，正文搜索必须走文件层。
 */
export function searchArticles(query = {}) {
  const q = String(query.q ?? '')
    .trim()
    .toLowerCase();
  if (!q) return [];

  const hits = [];
  for (const article of listArticleFiles()) {
    const inTitle = article.title.toLowerCase().includes(q);
    const inSummary = article.summary.toLowerCase().includes(q);
    const bodyText = extractText(article.content);
    const inBody = bodyText.toLowerCase().includes(q);
    if (!inTitle && !inSummary && !inBody) continue;

    hits.push({
      id: article.id,
      title: article.title,
      summary: article.summary ?? '',
      category: article.categoryId ?? '',
      tags: article.tagIds ?? [],
      date: String(article.createdAt ?? '').slice(0, 10),
      reads: Number(article.reads ?? 0),
      updatedAt: article.updatedAt,
      matchedIn: inTitle ? 'title' : inSummary ? 'summary' : 'body',
      snippet: excerpt(inTitle || inSummary ? article.summary || bodyText : bodyText, q),
    });
  }

  // 标题命中 > 摘要命中 > 正文命中，同分按更新时间倒序
  const weight = { title: 2, summary: 1, body: 0 };
  hits.sort((a, b) => {
    const d = (weight[b.matchedIn] ?? 0) - (weight[a.matchedIn] ?? 0);
    return d !== 0 ? d : String(b.updatedAt ?? '').localeCompare(String(a.updatedAt ?? ''));
  });
  return hits;
}
