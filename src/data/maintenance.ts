// 资源维护接口：体检 + 手动清理
//
// 设计约束（和后端一致）：
// - 只读体检随便调，不做任何修改；
// - 清理必须人工触发，且后端会再校验「回收站为空」，前端禁用只是第一道门。
export interface OrphanFile {
  path: string;
  size: number;
}

export interface OrphanInspection {
  /** 回收站里的文件数，> 0 时禁止清理 */
  trashCount: number;
  canCleanup: boolean;
  /** 当前被文档引用的资源路径数 */
  referencedCount: number;
  /** data/media 下的文件总数 */
  mediaFileCount: number;
  orphanMedia: OrphanFile[];
  orphanComments: OrphanFile[];
  totalBytes: number;
}

export interface CleanupResult {
  ok: boolean;
  removed: number;
  removedMedia: number;
  removedComments: number;
  failed: number;
  freedBytes: number;
  files: string[];
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      /* 非 JSON 响应，保留状态码 */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

/** 体检：扫描孤儿资源（不改动任何文件） */
export const fetchOrphanInspection = () => jsonFetch<OrphanInspection>('/api/maintenance/orphans');

/** 执行清理：仅删除无引用资源，回收站非空时后端返回 409 */
export const runOrphanCleanup = () =>
  jsonFetch<CleanupResult>('/api/maintenance/cleanup', { method: 'POST' });

/** 人类可读的体积 */
export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** i;
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}
