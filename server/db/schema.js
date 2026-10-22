// 索引库表结构（SQLite）：只存元数据，不存正文
// 正文在 data/articles/<id>.json，库里只有 rel_path 指向文件
// 因此这个库是纯缓存：删掉、损坏都没关系，启动时会从文件全量重建
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS category (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  "desc" TEXT,
  cover TEXT,
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
  status TEXT NOT NULL DEFAULT 'published',
  reads INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS article_tag (
  article_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_article_category ON article(category_id);
CREATE INDEX IF NOT EXISTS idx_article_created ON article(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_status ON article(status);
CREATE INDEX IF NOT EXISTS idx_article_title ON article(title);
CREATE INDEX IF NOT EXISTS idx_article_tag_tag ON article_tag(tag_id);

CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

/** app_meta 里的键名 */
export const META_KEYS = {
  schemaVersion: 'schema_version',
};

/** 表结构版本：改了表结构就 +1，启动时会整库重建（反正是缓存） */
export const SCHEMA_VERSION = '3';

/** 需要重建时按依赖顺序删除 */
export const DROP_SQL = `
DROP TABLE IF EXISTS article_tag;
DROP TABLE IF EXISTS article;
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS app_meta;
`;
