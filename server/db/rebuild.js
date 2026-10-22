// 索引全量重建：data/meta.json + data/articles/*.json → SQLite 两张表
// 启动时执行一次；因为索引只是缓存，重建成本很低，也永远不会和文件对不上
import { getDb, transaction } from './index.js';
import { listArticleFiles } from '../storage/article-files.js';
import { readMetaFile } from '../storage/meta-file.js';

export function rebuildIndex() {
  const db = getDb();
  const meta = readMetaFile();
  const articles = listArticleFiles();

  transaction((tx) => {
    tx.exec('DELETE FROM article_tag; DELETE FROM article; DELETE FROM tag; DELETE FROM category;');

    const insertCategory = tx.prepare(
      `INSERT OR REPLACE INTO category (id, name, color, icon, "desc", cover, position)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );
    meta.categories.forEach((c, i) =>
      insertCategory.run(
        c.id,
        c.name ?? c.id,
        c.color ?? null,
        c.icon ?? null,
        c.desc ?? null,
        c.cover ?? null,
        i,
      ),
    );

    const insertTag = tx.prepare(
      'INSERT OR REPLACE INTO tag (id, name, color, position) VALUES (?, ?, ?, ?)',
    );
    meta.tags.forEach((t, i) => insertTag.run(t.id, t.name ?? t.id, t.color ?? null, i));

    const insertArticle = tx.prepare(
      `INSERT OR REPLACE INTO article
         (id, title, summary, category_id, rel_path, status, reads, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const insertLink = tx.prepare(
      'INSERT OR IGNORE INTO article_tag (article_id, tag_id) VALUES (?, ?)',
    );

    for (const a of articles) {
      insertArticle.run(
        a.id,
        a.title,
        a.summary,
        a.categoryId,
        `articles/${a.id}.json`,
        a.status,
        a.reads,
        a.createdAt,
        a.updatedAt,
      );
      for (const tagId of a.tagIds) insertLink.run(a.id, tagId);
    }
  });

  return {
    articles: articles.length,
    categories: meta.categories.length,
    tags: meta.tags.length,
  };
}
