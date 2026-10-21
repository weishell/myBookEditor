// 分类 / 标签维护：读写 data/meta.json（文本唯一真相）
// 约束：名称唯一（同表内、忽略大小写与首尾空格）；被文章引用时禁止删除
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { DATA_DIR, META_FILE, IMAGES_DIR } from './config.mjs';

const httpError = (status, message) => Object.assign(new Error(message), { status });

const LIMITS = { name: 24, desc: 60, icon: 4 };

export function readMeta() {
  try {
    const parsed = JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
    return {
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    };
  } catch (err) {
    console.warn(`[meta] meta.json 读取失败：${err.message}`);
    return { categories: [], tags: [] };
  }
}

/** 原子写：tmp + rename，避免写坏文件（meta.json 是唯一真相） */
export function writeMeta(meta) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const payload = `${JSON.stringify(meta, null, 2)}\n`;
  const tmp = `${META_FILE}.tmp`;
  fs.writeFileSync(tmp, payload, 'utf8');
  fs.renameSync(tmp, META_FILE);
}

export const newTaxonomyId = (prefix) => `${prefix}_${randomUUID().slice(0, 8)}`;

export const isHexColor = (v) => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);

/** 名称归一 + 唯一性校验（排除自身） */
export function assertUniqueName(list, rawName, excludeId = '') {
  const name = String(rawName ?? '').trim().replace(/\s+/g, ' ');
  if (!name) throw httpError(400, '名称不能为空');
  if (name.length > LIMITS.name) throw httpError(400, `名称最多 ${LIMITS.name} 个字符`);
  const dup = list.some(
    (item) => item.id !== excludeId && item.name.trim().toLowerCase() === name.toLowerCase(),
  );
  if (dup) throw httpError(409, `「${name}」已存在`);
  return name;
}

export const cleanDesc = (v) => String(v ?? '').trim().slice(0, LIMITS.desc);

export function cleanIcon(v, fallback = '📄') {
  const icon = String(v ?? '').trim();
  if (!icon) return fallback;
  // 只保留 1~2 个字符（emoji 可能由多个码点组成，用 spread 计数）
  return [...icon].slice(0, LIMITS.icon).join('');
}

export const cleanColor = (v, fallback) => (isHexColor(v) ? v : fallback);

/** 封面一律存相对地址（media/images/covers/x.png），换域名只改前缀 */
export const normalizeCover = (v) => {
  if (v === null || v === '' || v === undefined) return null;
  const value = String(v).trim();
  if (!value.startsWith('media/')) throw httpError(400, '封面必须是 media/ 开头的相对地址');
  return value;
};

/** 保存上传的封面图：落到 data/media/images/covers/，返回相对地址 */
export function saveCategoryCover(categoryId, fileName, buffer) {
  const dir = path.join(IMAGES_DIR, 'covers');
  fs.mkdirSync(dir, { recursive: true });
  const ext = (path.extname(fileName) || '.png').toLowerCase().slice(0, 6);
  const safeExt = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext) ? ext : '.png';
  const name = `${categoryId}-${Date.now()}${safeExt}`;
  fs.writeFileSync(path.join(dir, name), buffer);
  return `media/images/covers/${name}`;
}
