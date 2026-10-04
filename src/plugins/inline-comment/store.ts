// 行内评论的评论正文持久化（独立 JSON，用户已认可）与基础工具
import type { InlineCommentThread } from './types';

export const THREADS_STORAGE_KEY = 'mybook-inline-comment-threads-v2';
export const COMMENT_ANNOTATION_PREFIX = 'cmt-';
export const MY_AUTHOR = '我';

export const AVATAR_COLORS = ['#3370ff', '#41b584', '#f2a54a', '#e85a71', '#7b6cf0', '#3aa0c9'];

export function genId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function newCommentId(): string {
  return `${COMMENT_ANNOTATION_PREFIX}${genId()}`;
}

/** 把时间戳格式化为 "MM-DD HH:mm" 的展示文本 */
export function formatTime(time: number): string {
  const d = new Date(time);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 由选区端点生成稳定 key，用于"再选同一段文字 = 追加评论"的判定 */
export function makeRangeKey(
  anchor: { path: number[]; offset: number },
  focus: { path: number[]; offset: number },
): string {
  const ord = [anchor, focus].sort((p, q) => {
    const min = Math.min(p.path.length, q.path.length);
    for (let i = 0; i < min; i++) if (p.path[i] !== q.path[i]) return p.path[i] - q.path[i];
    if (p.path.length !== q.path.length) return p.path.length - q.path.length;
    return p.offset - q.offset;
  });
  const fmt = (p: { path: number[]; offset: number }) => `${p.path.join(',')}:${p.offset}`;
  return `${fmt(ord[0])}~${fmt(ord[1])}`;
}

export function loadThreads(): InlineCommentThread[] {
  try {
    const raw = localStorage.getItem(THREADS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as InlineCommentThread[];
  } catch {
    /* 忽略读取失败 */
  }
  return [];
}

export function saveThreads(threads: InlineCommentThread[]): void {
  try {
    localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(threads));
  } catch {
    /* 存储失败不影响本次会话 */
  }
}
