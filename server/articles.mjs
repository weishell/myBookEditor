// 文章文件层：一篇一个 JSON（元数据 + Slate 正文），文件是唯一真相
// 索引库只从这些文件重建，所以这里的读写要保证「要么成功、要么保持旧文件」
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { ARTICLES_DIR } from './config.mjs';

/** id 直接当文件名用，必须白名单校验，避免 ../ 之类的路径穿越 */
const ID_RE = /^[A-Za-z0-9_-]{1,80}$/;

export const isSafeId = (id) => typeof id === 'string' && ID_RE.test(id);

export const articleRelPath = (id) => `articles/${id}.json`;
export const articleFilePath = (id) => path.join(ARTICLES_DIR, `${id}.json`);

/** 读一篇；文件不存在或 JSON 坏了都返回 null（坏文件不该让整个服务起不来） */
export function readArticle(id) {
  if (!isSafeId(id)) return null;
  const file = articleFilePath(id);
  if (!fs.existsSync(file)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!parsed || typeof parsed !== 'object') return null;
    return normalizeArticle({ ...parsed, id });
  } catch (err) {
    console.warn(`[articles] 跳过坏文件 ${path.basename(file)}: ${err.message}`);
    return null;
  }
}

/** 原子写：先写 .tmp 再 rename，避免写到一半崩溃留下半截 JSON */
export function writeArticle(article) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  const file = articleFilePath(article.id);
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(article, null, 2)}\n`, 'utf8');
  fs.renameSync(tmp, file);
}

/** 软删除：移到 data/.trash/ 而不是 unlink
 *  两个原因：① 误删可恢复（文件是资产）；② 某些环境会拦截 unlink/rm（安全删除 shim），rename 不会。 */
export function trashArticle(id) {
  if (!isSafeId(id)) return;
  const file = articleFilePath(id);
  if (!fs.existsSync(file)) return;
  const trashDir = path.join(path.dirname(ARTICLES_DIR), '.trash');
  fs.mkdirSync(trashDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.renameSync(file, path.join(trashDir, `${id}.${stamp}.json`));
}

/** 扫描文章目录，返回所有合法文章（坏文件跳过并告警） */
export function listArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((name) => name.endsWith('.json') && !name.endsWith('.tmp'))
    .map((name) => readArticle(name.slice(0, -5)))
    .filter(Boolean);
}

const asString = (v, fallback = '') => (typeof v === 'string' ? v : fallback);
const asNumber = (v, fallback = 0) => (Number.isFinite(Number(v)) ? Number(v) : fallback);

/** 把任意来源的对象收敛成固定形状，避免脏数据把索引和前端搞崩 */
export function normalizeArticle(raw) {
  const now = new Date().toISOString();
  return {
    id: raw.id,
    title: asString(raw.title).trim() || '未命名文档',
    summary: asString(raw.summary),
    categoryId: asString(raw.categoryId) || null,
    tagIds: Array.isArray(raw.tagIds) ? raw.tagIds.filter((t) => typeof t === 'string') : [],
    reads: asNumber(raw.reads, 0),
    status: asString(raw.status, 'published') || 'published',
    createdAt: asString(raw.createdAt) || now,
    updatedAt: asString(raw.updatedAt) || now,
    content: Array.isArray(raw.content) ? raw.content : [],
  };
}

export const newArticleId = () => randomUUID();

/** 索引库只需要这些字段，正文永远不进库 */
export function toIndexRow(article) {
  return {
    id: article.id,
    title: article.title,
    summary: article.summary,
    categoryId: article.categoryId,
    relPath: articleRelPath(article.id),
    reads: article.reads,
    status: article.status,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    tagIds: article.tagIds,
  };
}
