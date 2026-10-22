// 媒体文件服务：上传落盘 + 安全路径解析（防目录穿越）
// 数据库只存正文与元数据，图片 / 附件 / 视频这类大二进制仍放磁盘，由 /media 静态托管
import fs from 'node:fs';
import path from 'node:path';
import { FILES_DIR, IMAGES_DIR, MEDIA_DIR, VIDEOS_DIR } from '../config.js';
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

/** 上传目录：kind 只接受 images / files / videos，默认 images */
export function resolveKind(kind) {
  return KINDS[kind] ? kind : 'images';
}

/**
 * 保存上传文件
 * @returns {{ path: string, size: number, originalName: string }}
 */
export function saveUpload(kind, rawName, buffer) {
  if (!buffer?.length) throw badRequest('空文件');

  const resolvedKind = resolveKind(kind);
  const dir = KINDS[resolvedKind];
  const { base, ext } = safeFileName(rawName);
  const fileName = `${Date.now()}-${base}${ext}`;

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, fileName), buffer);

  return {
    path: `/media/${resolvedKind}/${fileName}`,
    size: buffer.length,
    originalName: decodeURIComponent(String(rawName || fileName)),
  };
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
