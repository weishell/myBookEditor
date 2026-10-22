// 分类 / 标签的文件存储（data/meta.json）
// 和文章一样：文件是真相，库里只是它的索引
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR, META_FILE } from '../config.js';

const EMPTY = { categories: [], tags: [] };

export function readMetaFile() {
  if (!fs.existsSync(META_FILE)) return { ...EMPTY };
  try {
    const raw = JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
    return {
      categories: Array.isArray(raw.categories) ? raw.categories : [],
      tags: Array.isArray(raw.tags) ? raw.tags : [],
    };
  } catch (err) {
    console.warn(`[storage] meta.json 解析失败：${err.message}`);
    return { ...EMPTY };
  }
}

export function writeMetaFile(meta) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const payload = {
    categories: (meta.categories ?? []).map(({ id, name, color, icon, desc, cover }) => ({
      id,
      name,
      color,
      icon,
      desc,
      cover: cover ?? null,
    })),
    tags: (meta.tags ?? []).map(({ id, name, color }) => ({ id, name, color })),
  };
  const tmp = `${META_FILE}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.renameSync(tmp, META_FILE);
  return payload;
}

export const META_BACKUP_HINT = path.basename(META_FILE);
