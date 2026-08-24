// 全文评论（底部评论区）- 对齐飞书文档底部评论样式
// 标题 + 评论列表 + 输入区三部分；评论持久化到 localStorage
import React, { useEffect, useState } from 'react';
import styles from './CommentSection.module.less';

interface CommentItem {
  id: string;
  author: string;
  color: string;
  content: string;
  createTime: number;
}

const STORAGE_KEY = 'mybook-document-comments';

const AVATAR_COLORS = ['#3370ff', '#41b584', '#f2a54a', '#e85a71', '#7b6cf0', '#3aa0c9'];

// 初始示例评论（首次打开时预置，便于体验评论区效果）
const SEED: CommentItem[] = [
  {
    id: 'seed-1',
    author: '青柠脉动',
    color: '#f2a54a',
    content: '这篇文档写得真不错，条理清晰，感谢整理！',
    createTime: Date.now() - 1000 * 60 * 8,
  },
  {
    id: 'seed-2',
    author: '山雀',
    color: '#41b584',
    content: '建议再补充一下分栏在不同场景下的使用对比。',
    createTime: Date.now() - 1000 * 60 * 60 * 3,
  },
];

function genId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadComments(): CommentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CommentItem[];
  } catch {
    /* 忽略读取失败，回退到示例 */
  }
  return SEED;
}

// 相对时间："刚刚 / N 分钟前 / N 小时前 / MM-DD"
function formatTime(ts: number): string {
  const min = Math.floor((Date.now() - ts) / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} 小时前`;
  const d = new Date(ts);
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 线性图标（对齐飞书简洁线性风格）
const IconImage = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const IconMore = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </svg>
);

const IconSend = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<CommentItem[]>(loadComments);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch {
      /* 存储失败不影响本次会话 */
    }
  }, [comments]);

  const canSubmit = value.trim().length > 0;

  const submit = () => {
    const content = value.trim();
    if (!content) return;
    const mine: CommentItem = {
      id: genId(),
      author: '我',
      color: AVATAR_COLORS[0],
      content,
      createTime: Date.now(),
    };
    setComments((c) => [mine, ...c]);
    setValue('');
  };

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h3 className={styles.title}>全文评论</h3>
        {comments.length > 0 && <span className={styles.count}>{comments.length}</span>}
      </header>

      <div className={styles.list}>
        {comments.length === 0 && <div className={styles.empty}>暂无评论，快来抢沙发～</div>}
        {comments.map((c) => (
          <div key={c.id} className={styles.item}>
            <div className={styles.avatar} style={{ backgroundColor: c.color }}>
              {c.author.slice(0, 1)}
            </div>
            <div className={styles.body}>
              <div className={styles.meta}>
                <span className={styles.name}>{c.author}</span>
                <span className={styles.time}>{formatTime(c.createTime)}</span>
              </div>
              <div className={styles.text}>{c.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.inputBox} ${focused ? styles.focused : ''}`}>
        <textarea
          className={styles.input}
          placeholder="输入评论"
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} title="添加图片">
            <IconImage />
          </button>
          <button type="button" className={styles.actionBtn} title="更多操作">
            <IconMore />
          </button>
          {(focused || value.trim().length > 0) && (
            <button
              type="button"
              className={styles.send}
              disabled={!canSubmit}
              onClick={submit}
              title="发送"
            >
              <IconSend />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
