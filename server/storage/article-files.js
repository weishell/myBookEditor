// 文章文件存储层：一篇一个 JSON 文件（data/articles/<id>.json）
// 这是数据的真相层——用任何编辑器都能直接打开、搜索、diff
import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES_DIR, TRASH_DIR } from '../config.js';
import { badRequest } from '../utils/http-error.js';

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
