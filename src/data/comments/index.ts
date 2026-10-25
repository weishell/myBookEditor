// 底部评论的初始种子数据 + 服务端读写
// 本地后端可写时评论落 data/comments/<articleId>.json；只读模式回退 localStorage
import seedData from './seed.json';

export interface CommentItem {
  id: string;
  author: string;
  color: string;
  content: string;
  createTime: number;
}

/** JSON 里的原始形态：用“距今多少分钟”描述时间，加载时再换算成时间戳 */
interface SeedComment {
  id: string;
  author: string;
  color: string;
  content: string;
  offsetMin: number;
}

const SEED_RAW = seedData as SeedComment[];

/** 首次加载时预置的示例评论：时间按“X 分钟前”实时换算，保证观感新鲜 */
export const SEED_COMMENTS: CommentItem[] = SEED_RAW.map((c) => ({
  id: c.id,
  author: c.author,
  color: c.color,
  content: c.content,
  createTime: Date.now() - c.offsetMin * 60_000,
}));

/** 读取一篇文档的全文评论（data/comments/<articleId>.json） */
export async function fetchComments(articleId: string): Promise<CommentItem[]> {
  const res = await fetch(`/api/comments/${encodeURIComponent(articleId)}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const body = (await res.json()) as { comments?: CommentItem[] };
  return Array.isArray(body.comments) ? body.comments : [];
}

/** 覆盖保存全文评论：后端按 articleId 整文件重写 */
export async function saveComments(articleId: string, comments: CommentItem[]): Promise<void> {
  const res = await fetch(`/api/comments/${encodeURIComponent(articleId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comments }),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
}
