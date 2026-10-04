// 行内评论数据模型
// 锚定方式：评论把 id 以文本 mark（key="comments"，值为 id 数组）写进文档数据结构，
// 因此被评文字只要还在正文里就必然高亮（如同加粗一样可靠），不依赖外部锚点。
// 评论正文单独存放（localStorage JSON，后续可并入文档数据结构）。

/** 单条评论消息 */
export interface CommentMessage {
  id: string;
  author: string;
  color: string;
  content: string;
  createTime: number;
}

/** 一个行内评论会话 */
export interface InlineCommentThread {
  id: string;
  /** 被评文本快照（用于弹层展示引用） */
  quotedText: string;
  messages: CommentMessage[];
  resolved?: boolean;
  /** 创建时的选区区间标识，用于"再选同一段文字 = 追加评论到同一会话" */
  rangeKey: string;
}

/** 新建评论的临时状态（提交前） */
export interface CommentCreateState {
  threadId: string;
  quotedText: string;
  x: number;
  y: number;
  /** 已存在的会话：提交时追加评论到该会话 */
  existing?: boolean;
}

/** 气泡弹层：一次展示一个连续被评区域上的所有会话 */
export interface CommentPopoverState {
  runId: string;
  threadIds: string[];
  x: number;
  y: number;
}

/** 连续被评文本区域（用于生成角标） */
export interface CommentRun {
  /** 稳定标识，由 region 的 path 序列决定 */
  id: string;
  /** 该区域内出现的所有会话 id */
  threadIds: string[];
  firstPath: number[];
}

/** 叶子文本上的存根键 */
export const COMMENTS_MARK = 'comments';
