// 真实文件存储：图片/文件/视频上传到 data/media 下，画板数据存 data/media/drawboards
// 文档里只保存相对路径（如 media/images/1690-abc.png），渲染时再拼成 /media/... 访问
import { canWrite } from './store';

export type UploadKind = 'images' | 'files' | 'videos';

/** 相对路径 → 可访问地址；blob/http/data/绝对路径原样返回 */
export const toMediaUrl = (path?: string): string => {
  if (!path) return '';
  if (/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(path)) return path;
  return `/${path.replace(/^\.\//, '')}`;
};

/** 上传结果：path 为文档里保存的相对路径，file 为实际入库的文件（可能已压缩） */
export interface UploadedMedia {
  path: string;
  file: File;
}

const COMPRESSIBLE_IMAGE = /^image\/(jpeg|png|webp)$/i;
/** 压缩后的最长边（px）：截图/照片在这个尺寸下观感仍然清晰 */
const MAX_EDGE = 2560;
/** JPEG/WebP 质量：0.86 在肉眼几乎无损的前提下明显减小体积 */
const IMAGE_QUALITY = 0.86;
/** 小于该体积的图片不折腾，避免越压越大 */
const MIN_COMPRESS_BYTES = 120 * 1024;

/**
 * 上传前压缩图片：
 * - JPEG/WebP 用 canvas 重新编码（有损但清晰），PNG 转 WebP（保留透明通道）
 * - 超过 2560px 的图先等比缩小
 * - 压缩后反而更大 / 不支持的格式（gif/svg 等）保持原文件
 */
export async function compressImage(file: File): Promise<File> {
  if (!COMPRESSIBLE_IMAGE.test(file.type)) return file;
  if (file.size <= MIN_COMPRESS_BYTES && file.type !== 'image/png') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const targetType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, targetType, IMAGE_QUALITY),
    );
    if (!blob) return file;
    // 没变小就保留原图（常见于已优化过的小图）
    if (blob.size >= file.size * 0.95 && scale === 1) return file;

    const ext = blob.type === 'image/jpeg' ? '.jpg' : blob.type === 'image/webp' ? '.webp' : '.png';
    const base = (file.name || 'image').replace(/\.[^./\\]+$/, '');
    return new File([blob], `${base}${ext}`, {
      type: blob.type || targetType,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

/** 上传二进制文件，返回相对路径与实际文件；只读模式（线上/示例数据）退回 blob 临时地址 */
export async function uploadBinary(file: File, kind: UploadKind): Promise<UploadedMedia> {
  if (!canWrite()) return { path: URL.createObjectURL(file), file };

  const upload = await compressImage(file);
  const res = await fetch(`/api/upload?kind=${kind}`, {
    method: 'POST',
    headers: {
      'Content-Type': upload.type || 'application/octet-stream',
      'X-Filename': encodeURIComponent(upload.name || 'file'),
    },
    body: upload,
  });
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      /* 非 JSON 响应，保留状态码信息 */
    }
    throw new Error(message);
  }
  const data = (await res.json()) as { path: string };
  return { path: data.path, file: upload };
}

/** 保存画板数据：有 path 时覆盖原文件，返回相对路径 */
export async function saveDrawboard(data: unknown[], path?: string): Promise<string> {
  const res = await fetch('/api/drawboards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, path }),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const body = (await res.json()) as { path: string };
  return body.path;
}

/** 按相对路径读取画板数据 */
export async function loadDrawboard(path: string): Promise<unknown[]> {
  const res = await fetch(toMediaUrl(path));
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const data = (await res.json()) as unknown;
  return Array.isArray(data) ? data : [];
}
