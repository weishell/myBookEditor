// 索引库（node:sqlite）：只存元数据，不存正文
// 设计前提：文件是真相，库可随时重建 —— 所以这里不做复杂迁移，启动时整体重建即可，
// 真正做到「像真数据库一样查」，又不会因为库和文件不一致而疑神疑鬼。
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { DATA_DIR, DB_FILE } from './config.mjs';
import { listArticles, toIndexRow } from './articles.mjs';
import { readMeta } from './meta.mjs';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS category (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  "desc" TEXT,
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tag (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  position INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS article (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  category_id TEXT,
  rel_path TEXT NOT NULL,
  reads INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_article_category ON article(category_id);
CREATE INDEX IF NOT EXISTS idx_article_created ON article(created_at DESC);

CREATE TABLE IF NOT EXISTS article_tag (
  article_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (article_id, tag_id)
);
`;

export function openDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(DB_FILE);
  // WAL 让读写互不阻塞；外键约束靠代码维护（索引表没有级联删除需求）
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec(SCHEMA);
  return db;
}

/** 用事务包一层，任何一步失败都整体回滚 */
export function tx(db, fn) {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export function replaceTags(db, articleId, tagIds) {
  db.prepare('DELETE FROM article_tag WHERE article_id = ?').run(articleId);
  const insert = db.prepare('INSERT OR IGNORE INTO article_tag (article_id, tag_id) VALUES (?, ?)');
  for (const tagId of tagIds) insert.run(articleId, tagId);
}

/** 从 meta.json + data/articles/*.json 全量重建索引 */
export function rebuildIndex(db) {
  const meta = readMeta();
  const articles = listArticles();

  tx(db, () => {
    db.exec('DELETE FROM article; DELETE FROM article_tag; DELETE FROM category; DELETE FROM tag;');

    const insertCategory = db.prepare(
      'INSERT OR REPLACE INTO category (id, name, color, icon, "desc", position) VALUES (?, ?, ?, ?, ?, ?)',
    );
    meta.categories.forEach((c, i) =>
      insertCategory.run(c.id, c.name ?? c.id, c.color ?? null, c.icon ?? null, c.desc ?? null, i),
    );

    const insertTag = db.prepare(
      'INSERT OR REPLACE INTO tag (id, name, color, position) VALUES (?, ?, ?, ?)',
    );
    meta.tags.forEach((t, i) => insertTag.run(t.id, t.name ?? t.id, t.color ?? null, i));

    const insertArticle = db.prepare(
      `INSERT OR REPLACE INTO article
         (id, title, summary, category_id, rel_path, reads, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    for (const article of articles) {
      const row = toIndexRow(article);
      insertArticle.run(
        row.id,
        row.title,
        row.summary,
        row.categoryId,
        row.relPath,
        row.reads,
        row.status,
        row.createdAt,
        row.updatedAt,
      );
      replaceTags(db, row.id, row.tagIds);
    }
  });

  return { articles: articles.length, categories: meta.categories.length, tags: meta.tags.length };
}

/** 只同步分类/标签两张表（改 meta.json 后用，不动文章与关联表） */
export function syncTaxonomy(db, meta) {
  tx(db, () => {
    db.exec('DELETE FROM category; DELETE FROM tag;');

    const insertCategory = db.prepare(
      'INSERT OR REPLACE INTO category (id, name, color, icon, "desc", position) VALUES (?, ?, ?, ?, ?, ?)',
    );
    meta.categories.forEach((c, i) =>
      insertCategory.run(c.id, c.name ?? c.id, c.color ?? null, c.icon ?? null, c.desc ?? null, i),
    );

    const insertTag = db.prepare(
      'INSERT OR REPLACE INTO tag (id, name, color, position) VALUES (?, ?, ?, ?)',
    );
    meta.tags.forEach((t, i) => insertTag.run(t.id, t.name ?? t.id, t.color ?? null, i));
  });
}

/** 被引用计数：删除前必须先查，>0 不允许删 */
export const countArticlesByCategory = (db, id) =>
  db.prepare('SELECT COUNT(*) AS n FROM article WHERE category_id = ?').get(id).n;

export const countArticlesByTag = (db, id) =>
  db.prepare('SELECT COUNT(DISTINCT article_id) AS n FROM article_tag WHERE tag_id = ?').get(id).n;

/** 列表查询：返回前端直接可用的索引结构（不含正文） */
export function queryArticles(db, { category, tag, q } = {}) {
  const where = [];
  const params = [];

  if (category) {
    where.push('a.category_id = ?');
    params.push(category);
  }
  if (tag) {
    where.push('EXISTS (SELECT 1 FROM article_tag at WHERE at.article_id = a.id AND at.tag_id = ?)');
    params.push(tag);
  }
  if (q) {
    where.push('(a.title LIKE ? OR a.summary LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  const rows = db
    .prepare(
      `SELECT a.id, a.title, a.summary, a.category_id AS categoryId, a.reads,
              a.status, a.created_at AS createdAt, a.updated_at AS updatedAt,
              substr(a.created_at, 1, 10) AS date
         FROM article a
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY a.created_at DESC`,
    )
    .all(...params);

  const tagRows = db.prepare('SELECT article_id AS id, tag_id AS tagId FROM article_tag').all();
  const tagsByArticle = new Map();
  for (const row of tagRows) {
    if (!tagsByArticle.has(row.id)) tagsByArticle.set(row.id, []);
    tagsByArticle.get(row.id).push(row.tagId);
  }

  return rows.map((row) => ({
    ...row,
    category: row.categoryId,
    tags: tagsByArticle.get(row.id) ?? [],
  }));
}

export function getArticleRow(db, id) {
  return db
    .prepare(
      `SELECT id, title, summary, category_id AS categoryId, rel_path AS relPath, reads,
              status, created_at AS createdAt, updated_at AS updatedAt
         FROM article WHERE id = ?`,
    )
    .get(id);
}

export function getTagsOf(db, id) {
  return db
    .prepare('SELECT tag_id AS tagId FROM article_tag WHERE article_id = ?')
    .all(id)
    .map((r) => r.tagId);
}

/** 标题唯一：排除自身后查重 */
export function titleTaken(db, title, excludeId = '') {
  const row = db
    .prepare('SELECT id FROM article WHERE title = ? AND id <> ? LIMIT 1')
    .get(title, excludeId);
  return Boolean(row);
}

export function upsertArticleRow(db, article) {
  const row = toIndexRow(article);
  db.prepare(
    `INSERT INTO article (id, title, summary, category_id, rel_path, reads, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title,
       summary = excluded.summary,
       category_id = excluded.category_id,
       rel_path = excluded.rel_path,
       reads = excluded.reads,
       status = excluded.status,
       updated_at = excluded.updated_at`,
  ).run(
    row.id,
    row.title,
    row.summary,
    row.categoryId,
    row.relPath,
    row.reads,
    row.status,
    row.createdAt,
    row.updatedAt,
  );
  replaceTags(db, row.id, row.tagIds);
}

export function deleteArticleRow(db, id) {
  db.prepare('DELETE FROM article WHERE id = ?').run(id);
  db.prepare('DELETE FROM article_tag WHERE article_id = ?').run(id);
}

/** 启动自检：所有文件的 mtime 与库里的 updated_at 不可能完全对齐，直接重建最省心 */
export function countArticles(db) {
  return db.prepare('SELECT COUNT(*) AS n FROM article').get().n;
}

export function articleFileMissing(db, id) {
  const row = getArticleRow(db, id);
  if (!row) return true;
  return !fs.existsSync(path.join(DATA_DIR, row.relPath));
}
