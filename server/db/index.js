// 索引库连接：全局单例 + PRAGMA
// journal_mode = DELETE → 只产生 database/mybook.db 一个文件（不会有 -wal / -shm）
// 表结构版本不一致时整库重建：这个库是缓存，正文永远在 JSON 文件里
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { DATABASE_DIR, DB_FILE } from '../config.js';
import { DROP_SQL, META_KEYS, SCHEMA_SQL, SCHEMA_VERSION } from './schema.js';

let connection = null;

function readSchemaVersion(db) {
  try {
    const row = db.prepare('SELECT value FROM app_meta WHERE key = ?').get(META_KEYS.schemaVersion);
    return row?.value ?? null;
  } catch {
    return null; // 表还不存在
  }
}

/** 打开（或复用）索引库，保证表结构是当前版本 */
export function getDb() {
  if (connection) return connection;

  fs.mkdirSync(DATABASE_DIR, { recursive: true });
  const db = new DatabaseSync(DB_FILE);
  db.exec('PRAGMA journal_mode = DELETE;');
  db.exec('PRAGMA synchronous = NORMAL;');

  const version = readSchemaVersion(db);
  if (version !== SCHEMA_VERSION) {
    db.exec(DROP_SQL);
  }
  db.exec(SCHEMA_SQL);
  db.prepare(
    `INSERT INTO app_meta (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  ).run(META_KEYS.schemaVersion, SCHEMA_VERSION);

  connection = db;
  return db;
}

export function closeDb() {
  if (!connection) return;
  connection.close();
  connection = null;
}

export function getMetaValue(key) {
  const row = getDb().prepare('SELECT value FROM app_meta WHERE key = ?').get(key);
  return row?.value ?? null;
}

export function setMetaValue(key, value) {
  getDb()
    .prepare(
      `INSERT INTO app_meta (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    )
    .run(key, String(value));
}

/** 事务包装：任何一步抛错都整体回滚 */
export function transaction(fn) {
  const db = getDb();
  db.exec('BEGIN');
  try {
    const result = fn(db);
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

/** 给 /api/health 用：库文件信息 */
export function dbFileInfo() {
  const exists = fs.existsSync(DB_FILE);
  return {
    file: `database/${path.basename(DB_FILE)}`,
    exists,
    sizeBytes: exists ? fs.statSync(DB_FILE).size : 0,
    note: '仅索引缓存，可从 data/articles 重建',
  };
}
