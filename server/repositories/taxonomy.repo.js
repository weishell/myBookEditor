// 分类 / 标签索引：SQL 只负责查询和整体同步
// 真相在 data/meta.json，这里每次变更后整体重写两张表（几十行数据，代价可以忽略）
import { getDb, transaction } from '../db/index.js';

export function findCategories() {
  return getDb()
    .prepare(
      `SELECT id, name, color, icon, "desc", cover
         FROM category ORDER BY position ASC, name ASC`,
    )
    .all();
}

export function findTags() {
  return getDb().prepare('SELECT id, name, color FROM tag ORDER BY position ASC, name ASC').all();
}

/** 用 meta.json 的内容整体替换索引里的分类与标签 */
export function replaceTaxonomy({ categories = [], tags = [] }) {
  transaction((db) => {
    db.exec('DELETE FROM tag; DELETE FROM category;');

    const insertCategory = db.prepare(
      `INSERT INTO category (id, name, color, icon, "desc", cover, position)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );
    categories.forEach((c, i) =>
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

    const insertTag = db.prepare('INSERT INTO tag (id, name, color, position) VALUES (?, ?, ?, ?)');
    tags.forEach((t, i) => insertTag.run(t.id, t.name ?? t.id, t.color ?? null, i));
  });
}
