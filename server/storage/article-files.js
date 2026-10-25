// 文章文件存储层：一篇一个 JSON 文件（data/articles/<id>.json）
// 这是数据的真相层——用任何编辑器都能直接打开、搜索、diff
import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES_DIR, TRASH_DIR } from '../config.js';
import { badRequest, conflict, notFound } from '../utils/http-error.js';

export function ensureArticleDirs() {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  fs.mkdirSync(TRASH_DIR, { recursive: true });
}

/** id 只允许安全字符，挡住 ../ 之类的路径穿越 */
function assertId(id) {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(String(id ?? ''))) throw badRequest('非法 id');
  return String(id);
}

const fileOf = (id) => path.join(ARTICLES_DIR, `${assertId(id)}.json`);

/** 单篇文件名 → id */
export function articleIdFromFile(file) {
  return path.basename(file, '.json');
}

/**
 * 读取目录下所有文章文件
 * 坏文件跳过并告警，不让一个坏 JSON 拖垮整个站点
 */
export function listArticleFiles() {
  ensureArticleDirs();
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.json') && !f.endsWith('.tmp'));

  const articles = [];
  for (const file of files) {
    const id = articleIdFromFile(file);
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8'));
      articles.push(normalize({ ...raw, id: raw.id ?? id }));
    } catch (err) {
      console.warn(`[storage] 跳过坏文件 ${file}：${err.message}`);
    }
  }
  return articles;
}

/** 读单篇；不存在返回 null */
export function readArticleFile(id) {
  const file = fileOf(id);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    return normalize({ ...raw, id: raw.id ?? id });
  } catch (err) {
    console.warn(`[storage] 文章 ${id} 解析失败：${err.message}`);
    return null;
  }
}

/** 原子写：先写 .tmp 再 rename，避免写一半断电留下坏文件 */
export function writeArticleFile(article) {
  ensureArticleDirs();
  const file = fileOf(article.id);
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(toStorage(article), null, 2)}\n`, 'utf8');
  fs.renameSync(tmp, file);
  return file;
}

/** 删除 = 移到 data/.trash/，可人工恢复 */
export function trashArticleFile(id) {
  const file = fileOf(id);
  if (!fs.existsSync(file)) return null;
  ensureArticleDirs();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(TRASH_DIR, `${assertId(id)}.${stamp}.json`);
  fs.renameSync(file, target);
  return target;
}

/* ---------------- 回收站（data/.trash/<id>.<删除时间>.json） ---------------- */

/** 回收站文件名 → 文章 id / 删除时间；手放进去的文件解析失败时返回 null */
export function parseTrashName(name) {
  const m = /^(.*)\.(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z\.json$/.exec(String(name));
  if (!m) return null;
  const [, articleId, d, h, mi, s, ms] = m;
  return { articleId, deletedAt: `${d}T${h}:${mi}:${s}.${ms}Z` };
}

/** 只允许回收站目录下的文件名，挡住 ../ 与子目录 */
function assertTrashName(name) {
  const n = String(name ?? '');
  if (
    !n ||
    path.basename(n) !== n ||
    n.includes('..') ||
    !n.endsWith('.json') ||
    n.endsWith('.tmp')
  ) {
    throw badRequest('非法回收站文件名');
  }
  return n;
}

/**
 * 列出回收站里的文件（含解析后的文章内容，供搜索用）
 * 坏文件不丢：article 为 null 也照样列出来，允许恢复/删除
 */
export function listTrashEntries() {
  ensureArticleDirs();
  const files = fs.readdirSync(TRASH_DIR).filter((f) => f.endsWith('.json') && !f.endsWith('.tmp'));

  const entries = [];
  for (const name of files) {
    const file = path.join(TRASH_DIR, name);
    let stat;
    try {
      stat = fs.statSync(file);
    } catch {
      continue; // 列举期间被删掉
    }
    const meta = parseTrashName(name);
    const fallbackId = meta?.articleId ?? path.basename(name, '.json');
    let article = null;
    try {
      const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
      article = normalize({ ...raw, id: raw.id ?? fallbackId });
    } catch (err) {
      console.warn(`[storage] 回收站文件 ${name} 解析失败：${err.message}`);
    }
    entries.push({
      name,
      articleId: article?.id ?? fallbackId,
      deletedAt: meta?.deletedAt ?? stat.mtime.toISOString(),
      size: stat.size,
      article,
    });
  }
  return entries;
}

/** 恢复：把文件从回收站移回 data/articles/，返回文章数据供重建索引 */
export function restoreTrashEntry(name) {
  const safe = assertTrashName(name);
  const source = path.join(TRASH_DIR, safe);
  if (!fs.existsSync(source)) throw notFound('回收站文件不存在');

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(source, 'utf8'));
  } catch (err) {
    throw badRequest(`回收站文件已损坏，无法恢复：${err.message}`);
  }

  const meta = parseTrashName(safe);
  const id = String(raw.id ?? meta?.articleId ?? path.basename(safe, '.json'));
  assertId(id);

  const target = fileOf(id);
  if (fs.existsSync(target)) throw conflict('原文仍在文章目录中，无需恢复');

  ensureArticleDirs();
  fs.renameSync(source, target);
  return normalize({ ...raw, id });
}

/** 彻底删除：回收站文件直接从磁盘移除，不可恢复 */
export function removeTrashEntry(name) {
  const safe = assertTrashName(name);
  const file = path.join(TRASH_DIR, safe);
  if (!fs.existsSync(file)) throw notFound('回收站文件不存在');
  fs.unlinkSync(file);
  return safe;
}

/** 统一字段，缺的补默认值 */
function normalize(raw) {
  return {
    id: String(raw.id),
    title: String(raw.title ?? '(无标题)'),
    summary: String(raw.summary ?? ''),
    categoryId: raw.categoryId ?? null,
    tagIds: Array.isArray(raw.tagIds) ? raw.tagIds : [],
    content: Array.isArray(raw.content) ? raw.content : [],
    status: raw.status ?? 'published',
    reads: Number(raw.reads ?? 0),
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? raw.createdAt ?? new Date().toISOString(),
  };
}

/** 落盘时保持字段顺序，方便人读和 diff */
function toStorage(a) {
  return {
    id: a.id,
    title: a.title,
    summary: a.summary,
    categoryId: a.categoryId,
    tagIds: a.tagIds,
    createdAt: a.createdAt,
    reads: a.reads,
    status: a.status,
    updatedAt: a.updatedAt,
    content: a.content,
  };
}

export { normalize as normalizeArticle };
