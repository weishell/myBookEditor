// 行内评论角标层：扫描文档中带 "comments" 标记的文本，生成连续区域，在区域上方悬浮数量 pill
import { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useSlate, ReactEditor } from 'slate-react';
import { useInlineComments } from './InlineCommentContext';
import { getCommentRuns } from './mark';
import type { CommentRun } from './types';
import styles from './InlineComment.module.less';

type Positions = Record<string, { x: number; y: number }>;

export function InlineCommentBadges() {
  const editor = useSlate();
  const { threads, openPopover } = useInlineComments();
  const [runs, setRuns] = useState<CommentRun[]>([]);
  const [positions, setPositions] = useState<Positions>({});
  const rafRef = useRef<number | null>(null);

  // 收集"连续被评区域"，并绑定每个区域的会话 id（过滤掉已删除会话的孤儿 id）
  const collect = useCallback(() => {
    const all = getCommentRuns(editor);
    const threadIds = new Set(threadsRef.current.map((t) => t.id));
    const valid = all
      .map((r) => ({ ...r, threadIds: r.threadIds.filter((id) => threadIds.has(id)) }))
      .filter((r) => r.threadIds.length > 0);
    setRuns(valid);
    // 计算位置
    const pos: Positions = {};
    for (const r of valid) {
      try {
        const start = { path: r.firstPath, offset: 0 };
        const dom = ReactEditor.toDOMRange(editor, { anchor: start, focus: start });
        const rect = dom.getBoundingClientRect();
        if (!rect || (rect.width === 0 && rect.height === 0)) continue;
        // 角标锚在区域起始文本的左上角，向上飘出
        pos[r.id] = { x: rect.left, y: rect.top };
      } catch {
        /* 区域可能已随编辑失效 */
      }
    }
    setPositions(pos);
  }, [editor]);

  const threadsRef = useRef(threads);
  threadsRef.current = threads;
  const collectRef = useRef(collect);
  collectRef.current = collect;

  useLayoutEffect(() => {
    collect();
  }, [threads, editor]);

  useLayoutEffect(() => {
    const schedule = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        collectRef.current();
      });
    };
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    document.addEventListener('input', schedule, true);
    const timer = window.setInterval(() => {
      collectRef.current();
    }, 800);
    return () => {
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      document.removeEventListener('input', schedule, true);
      window.clearInterval(timer);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {runs.length > 0 && (
        <div className={styles.badgeLayer}>
          {runs.map((run) => {
            const p = positions[run.id];
            if (!p) return null;
            const resolved = run.threadIds.every(
              (id) => threadsRef.current.find((t) => t.id === id)?.resolved,
            );
            return (
              <button
                key={run.id}
                type="button"
                className={`${styles.badge} ${resolved ? styles.badgeResolved : ''}`}
                style={{ left: p.x, top: p.y }}
                title={resolved ? '已解决，点击查看' : `查看 ${run.threadIds.length} 条评论`}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  openPopover(run, p.x, p.y);
                }}
              >
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
                  <path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.6 1.3 4.9 3.4 6.5L4.8 21l3.6-1.9c1.2.3 2.4.5 3.6.5 5.5 0 10-3.9 10-8.9S17.5 3 12 3z" />
                </svg>
                <span>{run.threadIds.length}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
