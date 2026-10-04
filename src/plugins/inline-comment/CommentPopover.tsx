// 行内评论气泡：新建评论（create）/ 查看连续区域内的一个或多个会话（popover.threadIds）
import { useEffect, useRef, useState } from 'react';
import { useInlineComments } from './InlineCommentContext';
import { formatTime, MY_AUTHOR } from './store';
import type { InlineCommentThread, CommentMessage } from './types';
import styles from './InlineComment.module.less';

const IconSend = () => (
  <svg
    width="15"
    height="15"
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

const IconTrash = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M6 6l1 14h10l1-14" />
    <path d="M10 11v5M14 11v5" />
  </svg>
);

const IconCheck = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const IconClose = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function MessageRow({ msg }: { msg: CommentMessage }) {
  return (
    <div className={styles.msg}>
      <span className={styles.avatar} style={{ backgroundColor: msg.color }}>
        {msg.author.slice(0, 1)}
      </span>
      <div className={styles.msgBody}>
        <div className={styles.msgMeta}>
          <span className={styles.name}>{msg.author}</span>
          <span className={styles.time}>{formatTime(msg.createTime)}</span>
        </div>
        <div className={styles.msgText}>{msg.content}</div>
      </div>
    </div>
  );
}

function CommentInput({
  onCommit,
  placeholder,
  autoFocus,
}: {
  onCommit: (content: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState('');
  const submit = () => {
    const content = value.trim();
    if (!content) return;
    onCommit(content);
  };
  return (
    <div className={styles.inputBox}>
      <textarea
        className={styles.input}
        placeholder={placeholder}
        rows={1}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={(e) => {
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button
        type="button"
        className={styles.sendBtn}
        disabled={!value.trim()}
        onClick={submit}
        title="发送"
      >
        <IconSend />
      </button>
    </div>
  );
}

function QuotedHeader({ quote, resolved }: { quote: string; resolved?: boolean }) {
  return (
    <div className={`${styles.quote} ${resolved ? styles.quoteResolved : ''}`}>
      <span className={styles.quoteBullet} />
      <span className={styles.quoteText}>{quote}</span>
    </div>
  );
}

function ThreadCard({ thread }: { thread: InlineCommentThread }) {
  const { reply, deleteThread, toggleResolved } = useInlineComments();
  const resolved = !!thread.resolved;

  return (
    <div className={styles.thread}>
      <div className={styles.popHeader}>
        <span className={styles.popTitle}>
          评论{resolved ? '（已解决）' : ''}
          <span className={styles.count}>{thread.messages.length}</span>
        </span>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => toggleResolved(thread.id)}
            title={resolved ? '重新打开' : '标记已解决'}
          >
            <span className={styles.checkIcon}>
              <IconCheck />
            </span>
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => {
              if (window.confirm(`删除这段文本下的 ${thread.messages.length} 条评论？`))
                deleteThread(thread.id);
            }}
            title="删除会话"
          >
            <span className={styles.trashIcon}>
              <IconTrash />
            </span>
          </button>
        </div>
      </div>
      <QuotedHeader quote={thread.quotedText} resolved={resolved} />
      <div className={styles.body}>
        <div className={styles.msgList}>
          {thread.messages.map((m) => (
            <MessageRow key={m.id} msg={m} />
          ))}
        </div>
        <div className={styles.writeRow}>
          <span className={styles.myAvatar}>{MY_AUTHOR.slice(0, 1)}</span>
          <CommentInput placeholder="回复…" onCommit={(c) => reply(thread.id, c)} />
        </div>
      </div>
    </div>
  );
}

function PanelShell({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  const { setPopover, closeCreate } = useInlineComments();
  const ref = useRef<HTMLDivElement | null>(null);
  // 计算垂直位置：尽量不超出视口
  const top = y < 180 ? y + 28 : Math.max(12, Math.min(y - 220, window.innerHeight - 320));

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('[data-inline-comment-popover]')) return;
      setPopover(null);
      closeCreate();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [setPopover, closeCreate]);

  return (
    <div
      ref={ref}
      className={styles.popover}
      style={{ left: x, top }}
      data-inline-comment-popover
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

function CreatePanel() {
  const { create, submitComment, closeCreate } = useInlineComments();
  if (!create) return null;
  return (
    <PanelShell x={create.x} y={create.y}>
      <div className={styles.popHeader}>
        <span className={styles.popTitle}>添加评论</span>
        <button type="button" className={styles.iconBtn} onClick={closeCreate} title="取消">
          <IconClose />
        </button>
      </div>
      <QuotedHeader quote={create.quotedText} />
      <div className={styles.body}>
        <div className={styles.writeRow}>
          <span className={styles.myAvatar}>{MY_AUTHOR.slice(0, 1)}</span>
          <CommentInput placeholder="写下你的评论…" autoFocus onCommit={(c) => submitComment(c)} />
        </div>
      </div>
    </PanelShell>
  );
}

export function InlineCommentPopover() {
  const { create, popover, threads, setPopover } = useInlineComments();

  if (create) return <CreatePanel />;
  if (!popover) return null;
  const list = popover.threadIds
    .map((id) => threads.find((t) => t.id === id))
    .filter((t): t is InlineCommentThread => !!t);
  if (list.length === 0) return null;

  return (
    <PanelShell x={popover.x} y={popover.y}>
      <div className={styles.popHeader}>
        <span className={styles.popTitle}>
          评论
          <span className={styles.count}>{list.length}</span>
        </span>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setPopover(null)}
            title="关闭"
          >
            <IconClose />
          </button>
        </div>
      </div>
      <div className={styles.runList}>
        {list.map((t) => (
          <ThreadCard key={t.id} thread={t} />
        ))}
      </div>
    </PanelShell>
  );
}
