// 媒体文件服务：上传落盘 + 安全路径解析（防目录穿越）
// 数据库只存正文与元数据，图片 / 附件 / 视频这类大二进制仍放磁盘，由 /media 静态托管
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DRAWBOARDS_DIR, FILES_DIR, IMAGES_DIR, MEDIA_DIR, VIDEOS_DIR } from '../config.js';
import { HttpError, badRequest } from '../utils/http-error.js';
import { safeFileName } from '../utils/validators.js';

export const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.pdf': 'application/pdf',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.zip': 'application/zip',
};

const KINDS = {
  images: IMAGES_DIR,
  files: FILES_DIR,
  videos: VIDEOS_DIR,
};

/** 图片扩展名：即使从「文件」入口上传，也统一落到 images 目录 */
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif', '.bmp']);

/** 上传目录：kind 只接受 images / files / videos，默认 images */
export function resolveKind(kind) {
  return KINDS[kind] ? kind : 'images';
}

/**
 * 按内容 hash 在三个媒体目录里找同内容文件。
 * 命中则直接复用，避免同一张图在 files / images 各存一份。
 */
function findExistingByHash(hash, ext) {
  for (const [kind, dir] of Object.entries(KINDS)) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith(`-${hash}${ext}`)) return { kind, name };
    }
  }
  return null;
}

/**
 * 保存上传文件
 * @returns {{ path: string, size: number, originalName: string, deduped?: boolean }}
 */
export function saveUpload(kind, rawName, buffer) {
  if (!buffer?.length) throw badRequest('空文件');

  const { ext } = safeFileName(rawName);
  // 图片统一进 images：从「文件」入口传图片也不会多出 files 副本
  const resolvedKind = IMAGE_EXT.has(ext.toLowerCase()) ? 'images' : resolveKind(kind);
  const dir = KINDS[resolvedKind];
  const originalName = decodeURIComponent(String(rawName || 'file'));

  const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 16);
  const existing = findExistingByHash(hash, ext);
  if (existing) {
    const file = path.join(KINDS[existing.kind], existing.name);
    return {
      path: `media/${existing.kind}/${existing.name}`,
      size: fs.statSync(file).size,
      originalName,
      deduped: true,
    };
  }

  const fileName = `${Date.now()}-${hash}${ext}`;

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, fileName), buffer);

  return {
    // 存库/存文档统一用相对路径（不带前导 /），前端拼成 /media/... 访问
    path: `media/${resolvedKind}/${fileName}`,
    size: buffer.length,
    originalName,
  };
}

/** 画板 JSON 的合法相对路径（只允许 data/media/drawboards 下的 .json） */
const DRAWBOARD_PATH_RE = /^media\/drawboards\/[A-Za-z0-9._-]+\.json$/;

/**
 * 保存画板数据到 data/media/drawboards/<file>.json。
 * 传 existingPath 时覆盖原文件（重新编辑同一画板），否则新建。
 * @returns {string} 相对路径 media/drawboards/<file>.json
 */
export function saveDrawboard(data, existingPath) {
  if (!Array.isArray(data)) throw badRequest('画板数据必须是数组');

  let rel;
  if (existingPath) {
    if (!DRAWBOARD_PATH_RE.test(String(existingPath))) throw badRequest('画板路径非法');
    rel = String(existingPath);
  } else {
    rel = `media/drawboards/${Date.now()}-${crypto.randomUUID()}.json`;
  }

  fs.mkdirSync(DRAWBOARDS_DIR, { recursive: true });
  const file = path.join(MEDIA_DIR, rel.replace(/^media\//, ''));
  fs.writeFileSync(file, JSON.stringify(data));
  return rel;
}

/** 解析 /media/ 下的路径，越界一律 403 */
export function resolveMediaFile(relativePath) {
  const decoded = decodeURIComponent(relativePath);
  const file = path.resolve(MEDIA_DIR, decoded);
  const root = path.resolve(MEDIA_DIR);

  if (file !== root && !file.startsWith(root + path.sep)) {
    throw new HttpError(403, '路径非法');
  }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    throw new HttpError(404, '文件不存在');
  }
  return { file, mime: MIME_TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream' };
}
