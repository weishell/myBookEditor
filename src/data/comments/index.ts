// 底部评论的初始种子数据：单独抽成 JSON 文件夹，便于维护与扩充
// 组件仍然把用户新增的评论持久化在 localStorage，这里只负责“首次打开时的示例”
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
