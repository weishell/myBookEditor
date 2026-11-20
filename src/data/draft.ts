// 本机草稿：正文提交到服务器失败时的兜底。
//
// 不变量（整条链都靠它成立）：**只要服务器没确认保存成功，localStorage 里就一定留着最新正文。**
// 之所以要做「先写本机、再发请求」，是因为 onSave 是 400ms 防抖后的异步 POST：
//   - 后端 500 / 断网 → 请求 reject，正文只活在内存里，切页即丢
//   - 请求挂起（超时几十秒）→ reject 之前用户一直在打字，这段同样只活在内存里
//   - 渲染崩溃 / 误关标签页 → 连 reject 都等不到
// 所以不能「失败时再写草稿」，必须是写入与请求并行、成功才清。
//
// 反过来说：「本机有草稿」等价于「上次没存上」，恢复提示不用去比时间戳猜哪份更新。
import type { Descendant } from 'slate';

const PREFIX = 'mybook:draft:';
/** 写入节流：编辑器已经 400ms 防抖过一次，这里再合并到 1.2s，避免长文档反复序列化卡输入 */
const MIN_INTERVAL = 1200;

export interface Draft {
  content: Descendant[];
  /** 本机写入时间戳（ms） */
  savedAt: number;
}

interface PendingWrite {
  content: Descendant[];
  timer: number | null;
  lastWrite: number;
}

/** 挂起中的写入：同一篇的多次改动只保留最后一份内容 */
const pending = new Map<string, PendingWrite>();

const keyOf = (id: string): string => `${PREFIX}${id}`;

/** 真正落盘。超过配额时不抛给调用方——草稿失败不该阻断正常保存 */
function write(id: string, content: Descendant[]): boolean {
  try {
    localStorage.setItem(
      keyOf(id),
      JSON.stringify({ content, savedAt: Date.now() } satisfies Draft),
    );
    return true;
  } catch (err) {
    // 典型是 QuotaExceededError：正文里嵌了大体积数据（drawio 的 svg data url、粘贴进来的 base64 图）
    console.warn('[draft] 本地草稿写入失败，本次改动只留在内存：', err);
    return false;
  }
}

/** 登记一次改动。首次立即写，之后的写合并到 MIN_INTERVAL 之后 */
export function queueDraft(id: string, content: Descendant[]): void {
  const now = Date.now();
  let entry = pending.get(id);
  if (!entry) {
    entry = { content, timer: null, lastWrite: 0 };
    pending.set(id, entry);
  }
  entry.content = content;

  if (now - entry.lastWrite >= MIN_INTERVAL) {
    if (entry.timer !== null) {
      window.clearTimeout(entry.timer);
      entry.timer = null;
    }
    if (write(id, content)) entry.lastWrite = now;
    return;
  }

  if (entry.timer === null) {
    entry.timer = window.setTimeout(
      () => {
        const cur = pending.get(id);
        if (!cur) return;
        cur.timer = null;
        if (write(id, cur.content)) cur.lastWrite = Date.now();
      },
      MIN_INTERVAL - (now - entry.lastWrite),
    );
  }
}

/**
 * 立刻把挂起的写入落到本机。
 * 用于 pagehide（关标签页/切后台）和保存失败的那一刻——这两处等不到节流定时器。
 */
export function flushDraft(id?: string): void {
  const ids = id ? [id] : Array.from(pending.keys());
  const now = Date.now();
  for (const key of ids) {
    const entry = pending.get(key);
    if (!entry) continue;
    if (entry.timer !== null) {
      window.clearTimeout(entry.timer);
      entry.timer = null;
    }
    if (write(key, entry.content)) entry.lastWrite = now;
  }
}

/** 读草稿；内容为空（`[]`）视为没有，避免把空文档灌回编辑器 */
export function loadDraft(id: string): Draft | null {
  try {
    const raw = localStorage.getItem(keyOf(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    if (!parsed || !Array.isArray(parsed.content) || parsed.content.length === 0) return null;
    return { content: parsed.content, savedAt: Number(parsed.savedAt) || 0 };
  } catch {
    return null;
  }
}

/** 有没有草稿。只读 key 不解析 JSON：beforeunload 里要同步、要快 */
export function hasDraft(id: string): boolean {
  try {
    return localStorage.getItem(keyOf(id)) !== null;
  } catch {
    return false;
  }
}

/** 清草稿。服务器确认保存成功、或用户主动丢弃时调用 */
export function clearDraft(id: string): void {
  const entry = pending.get(id);
  if (entry?.timer != null) window.clearTimeout(entry.timer);
  pending.delete(id);
  try {
    localStorage.removeItem(keyOf(id));
  } catch {
    /* 隐私模式下 removeItem 也可能抛，忽略 */
  }
}
