// 媒体文件服务：上传落盘 + 安全路径解析（防目录穿越）
// 数据库只存正文与元数据，图片 / 附件 / 视频这类大二进制仍放磁盘，由 /media 静态托管
import fs from 'node:fs';
import path from 'node:path';
import { FILES_DIR, IMAGES_DIR, MEDIA_DIR, VIDEOS_DIR } from '../config.js';
import { HttpError, badRequest, tooLarge } from '../utils/http-error.js';
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
  '.m4v': 'video/mp4',
  '.webm': 'video/webm',
  '.ogv': 'video/ogg',
  '.ogg': 'video/ogg',
  '.mov': 'video/quicktime',
  '.mkv': 'video/x-matroska',
  '.avi': 'video/x-msvideo',
  '.wmv': 'video/x-ms-wmv',
  '.flv': 'video/x-flv',
  '.3gp': 'video/3gpp',
  '.pdf': 'application/pdf',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
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

/* ------------------------- 远端图片代下载 ------------------------- */
/**
 * 为什么必须走服务端：浏览器 fetch 外链图会被 CORS 挡住（拿不到字节），
 * 而且很多图床有防盗链（无 Referer 就返 403）。服务端下载这两条都不受限制，
 * 落盘后再以本站 /media/... 相对路径写进文档 —— 换个域名部署也不会裂图。
 */
const REMOTE_MAX_BYTES = 25 * 1024 * 1024;
/** content-type → 扩展名；不在表里的一律拒绝（避免把 html 错误页当图片存下来） */
const REMOTE_IMAGE_EXT = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
  'image/bmp': '.bmp',
  'image/x-icon': '.ico',
};

/** 内网 / 回环地址一律拒绝：这个接口能被任意网页调用，不能当 SSRF 跳板 */
const PRIVATE_HOST_RE =
  /^(?:localhost|0\.0\.0\.0|127\.|10\.|192\.168\.|169\.254\.|::1$|\[?::1\]?$|172\.(?:1[6-9]|2\d|3[01])\.)/i;

function assertDownloadableUrl(raw) {
  let parsed;
  try {
    parsed = new URL(String(raw || '').trim());
  } catch {
    throw badRequest('图片地址无效');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw badRequest('只支持 http/https 图片地址');
  }
  if (PRIVATE_HOST_RE.test(parsed.hostname)) throw badRequest('不允许下载内网地址');
  return parsed;
}

/**
 * 下载远端图片并落盘到 data/media/images
 * @returns {Promise<{ path: string, size: number, originalName: string, contentType: string }>}
 */
export async function saveRemoteImage(rawUrl, preferredName) {
  const url = assertDownloadableUrl(rawUrl);

  let response;
  try {
    response = await fetch(url, {
      // 带 UA + Referer：部分图床会校验来源，缺了直接 403
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: `${url.protocol}//${url.host}/`,
        Accept: 'image/avif,image/webp,image/png,image/*;q=0.8,*/*;q=0.5',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    throw new HttpError(502, `图片下载失败：${err?.message || '网络错误'}`);
  }
  if (!response.ok) throw new HttpError(502, `图片下载失败：远端返回 ${response.status}`);

  const contentType = String(response.headers.get('content-type') || '')
    .split(';')[0]
    .trim()
    .toLowerCase();
  const ext = REMOTE_IMAGE_EXT[contentType];
  if (!ext) throw badRequest(`远端返回的不是图片（${contentType || '未知类型'}）`);

  const declared = Number(response.headers.get('content-length') || 0);
  if (declared > REMOTE_MAX_BYTES) throw tooLarge('远端图片超过 25MB');

  const buffer = Buffer.from(await response.arrayBuffer());
  if (!buffer.length) throw badRequest('远端图片为空');
  if (buffer.length > REMOTE_MAX_BYTES) throw tooLarge('远端图片超过 25MB');

  // 文件名优先用调用方给的（剪贴板里的 alt / 原名），否则退回 URL 末段
  const rawName = preferredName || decodeURIComponent(url.pathname.split('/').pop() || '');
  const { base } = safeFileName(rawName || 'image', ext);
  const fileName = `${Date.now()}-${base}${ext}`;

  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.writeFileSync(path.join(IMAGES_DIR, fileName), buffer);

  return {
    path: `/media/images/${fileName}`,
    size: buffer.length,
    originalName: rawName || fileName,
    contentType,
  };
}

/** 解析 /media/ 下的路径，越界一律 403；返回文件路径、MIME 与大小（Range 需要 size） */
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

  const stat = fs.statSync(file);
  return {
    file,
    size: stat.size,
    mtime: stat.mtime,
    mime: MIME_TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
  };
}
