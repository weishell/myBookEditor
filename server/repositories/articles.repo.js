// 文章索引数据访问层：只操作 SQL。正文不在这里——它在 data/articles/<id>.json
import { getDb } from '../db/index.js';

/** 批量取标签，避免 N+1 查询 */
function tagsByArticle(articleIds) {
  if (articleIds.length === 0) return new Map();
  const placeholders = articleIds.map(() => '?').join(',');
  const rows = getDb()
    .prepare(
      `SELECT article_id AS id, tag_id AS tagId FROM article_tag WHERE article_id IN (${placeholders})`,
    )
    .all(...articleIds);

  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.id)) map.set(row.id, []);
    map.get(row.id).push(row.tagId);
  }
  return map;
}

/** 列表查询：分类 / 标签 / 关键词可叠加；返回索引行，不含正文 */
export function findArticles({ category, tag, q } = {}) {
  const where = [];
  const params = [];

  if (category) {
    where.push('a.category_id = ?');
    params.push(category);
  }
  if (tag) {
    where.push(
      'EXISTS (SELECT 1 FROM article_tag at WHERE at.article_id = a.id AND at.tag_id = ?)',
    );
    params.push(tag);
  }
  if (q) {
    where.push('(a.title LIKE ? OR a.summary LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  const rows = getDb()
    .prepare(
      `SELECT a.id, a.title, a.summary, a.category_id AS categoryId, a.rel_path AS relPath,
              a.reads, a.status, a.created_at AS createdAt, a.updated_at AS updatedAt
         FROM article a
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY a.created_at DESC`,
    )
    .all(...params);

  const tagMap = tagsByArticle(rows.map((r) => r.id));
  return rows.map((row) => ({ ...row, tagIds: tagMap.get(row.id) ?? [] }));
}

export function findArticleById(id) {
  const row = getDb()
    .prepare(
      `SELECT id, title, summary, category_id AS categoryId, rel_path AS relPath,
              reads, status, created_at AS createdAt, updated_at AS updatedAt
         FROM article WHERE id = ?`,
    )
    .get(id);
  if (!row) return null;
  return { ...row, tagIds: tagsByArticle([id]).get(id) ?? [] };
}

export function titleExists(title, excludeId = '') {
  const row = getDb()
    .prepare('SELECT id FROM article WHERE title = ? AND id <> ? LIMIT 1')
    .get(title, excludeId);
  return Boolean(row);
}

export function insertArticle(article) {
  getDb()
    .prepare(
      `INSERT INTO article (id, title, summary, category_id, rel_path, status, reads, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      article.id,
      article.title,
      article.summary,
      article.categoryId,
      article.relPath,
      article.status,
      article.reads,
      article.createdAt,
      article.updatedAt,
    );
  replaceTags(article.id, article.tagIds);
}

/** 更新索引里的元数据（正文已在文件里写好了） */
export function updateArticleIndex(article) {
  getDb()
    .prepare(
      `UPDATE article SET title = ?, summary = ?, category_id = ?, status = ?, updated_at = ?
        WHERE id = ?`,
    )
    .run(
      article.title,
      article.summary,
      article.categoryId,
      article.status,
      article.updatedAt,
      article.id,
    );
  if (article.tagIds) replaceTags(article.id, article.tagIds);
}

/** 自动保存：文件已写，索引只需更新时间 */
export function touchArticle(id, updatedAt) {
  getDb().prepare('UPDATE article SET updated_at = ? WHERE id = ?').run(updatedAt, id);
}

export function deleteArticle(id) {
  const db = getDb();
  db.prepare('DELETE FROM article_tag WHERE article_id = ?').run(id);
  db.prepare('DELETE FROM article WHERE id = ?').run(id);
}

export function replaceTags(articleId, tagIds = []) {
  const db = getDb();
  db.prepare('DELETE FROM article_tag WHERE article_id = ?').run(articleId);
  const insert = db.prepare('INSERT OR IGNORE INTO article_tag (article_id, tag_id) VALUES (?, ?)');
  for (const tagId of tagIds) insert.run(articleId, tagId);
}

export function countArticles() {
  return getDb().prepare('SELECT COUNT(*) AS n FROM article').get().n;
}

export function countPublished() {
  return getDb().prepare("SELECT COUNT(*) AS n FROM article WHERE status = 'published'").get().n;
}

export function countByCategory(categoryId) {
  return getDb().prepare('SELECT COUNT(*) AS n FROM article WHERE category_id = ?').get(categoryId)
    .n;
}

export function countByTag(tagId) {
  return getDb()
    .prepare('SELECT COUNT(DISTINCT article_id) AS n FROM article_tag WHERE tag_id = ?')
    .get(tagId).n;
}
