// 行内评论全局状态：会话列表 + 新建/弹层 UI 状态
// 锚定 = 把评论 id 写进文档 text 的 "comments" mark，见 mark.ts。
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import { Editor, Range } from 'slate';
import { useSlate } from 'slate-react';
import {
  MY_AUTHOR,
  AVATAR_COLORS,
  genId,
  newCommentId,
  makeRangeKey,
  loadThreads,
  saveThreads,
} from './store';
import { commentSelection, removeCommentId } from './mark';
import type {
  InlineCommentThread,
  CommentMessage,
  CommentCreateState,
  CommentPopoverState,
  CommentRun,
} from './types';

interface InlineCommentApi {
  threads: InlineCommentThread[];
  create: CommentCreateState | null;
  popover: CommentPopoverState | null;
  createFromSelection: () => boolean;
  submitComment: (content: string) => void;
  reply: (threadId: string, content: string) => void;
  deleteThread: (threadId: string) => void;
  toggleResolved: (threadId: string) => void;
  openPopover: (run: CommentRun, x: number, y: number) => void;
  closePopover: () => void;
  closeCreate: () => void;
  setPopover: React.Dispatch<React.SetStateAction<CommentPopoverState | null>>;
}

const Ctx = createContext<InlineCommentApi | null>(null);

const mine = (content: string): CommentMessage => ({
  id: genId(),
  author: MY_AUTHOR,
  color: AVATAR_COLORS[0],
  content,
  createTime: Date.now(),
});

export function InlineCommentProvider({
  children,
  onCommentChange,
}: {
  children: React.ReactNode;
  onCommentChange?: () => void;
}) {
  const editor = useSlate();
  const [threads, setThreads] = useState<InlineCommentThread[]>(() => loadThreads());
  const [create, setCreate] = useState<CommentCreateState | null>(null);
  const [popover, setPopover] = useState<CommentPopoverState | null>(null);
  const threadsRef = useRef(threads);
  threadsRef.current = threads;
  const editorRef = useRef(editor);
  editorRef.current = editor;

  // 评论正文持久化（独立 JSON，后续可并入文档数据结构）
  useEffect(() => {
    saveThreads(threads);
  }, [threads]);

  const createFromSelection = useCallback((): boolean => {
    const { selection } = editorRef.current;
    if (!selection || Range.isCollapsed(selection)) return false;
    const rangeKey = makeRangeKey(selection.anchor, selection.focus);
    const quotedText = Editor.string(editorRef.current, selection).trim() || '（空文本）';

    let x = 0;
    let y = 0;
    const domSel = window.getSelection();
    if (domSel && !domSel.isCollapsed && domSel.rangeCount > 0) {
      const r = domSel.getRangeAt(0).getBoundingClientRect();
      x = r.left;
      y = r.top;
    }

    const existing = threadsRef.current.find((t) => t.rangeKey === rangeKey);
    if (existing) {
      setCreate({ threadId: existing.id, quotedText, x, y, existing: true });
    } else {
      const threadId = newCommentId();
      commentSelection(editorRef.current, threadId);
      setCreate({ threadId, quotedText, x, y, existing: false });
      onCommentChange?.();
    }
    setPopover(null);
    return true;
  }, [onCommentChange]);

  const submitComment = useCallback(
    (content: string) => {
      const c = create;
      if (!c) return;
      const msg = mine(content);
      if (c.existing) {
        setThreads((list) =>
          list.map((t) =>
            t.id === c.threadId ? { ...t, messages: [...t.messages, msg], resolved: false } : t,
          ),
        );
      } else {
        setThreads((list) => [
          ...list,
          {
            id: c.threadId,
            quotedText: c.quotedText,
            rangeKey: '',
            messages: [msg],
          },
        ]);
      }
      // 记录 rangeKey 用于再次选中判定（新会话第一次在此补充）
      if (!c.existing) {
        const { selection } = editorRef.current;
        if (selection) {
          const rk = makeRangeKey(selection.anchor, selection.focus);
          setThreads((list) => list.map((t) => (t.id === c.threadId ? { ...t, rangeKey: rk } : t)));
        }
      }
      setCreate(null);
      setPopover((p) =>
        p && p.threadIds.includes(c.threadId)
          ? p
          : { runId: `run-${c.threadId}`, threadIds: [c.threadId], x: c.x, y: c.y },
      );
    },
    [create],
  );

  const reply = useCallback((threadId: string, content: string) => {
    const msg = mine(content);
    setThreads((list) =>
      list.map((t) =>
        t.id === threadId ? { ...t, messages: [...t.messages, msg], resolved: false } : t,
      ),
    );
  }, []);

  const deleteThread = useCallback((threadId: string) => {
    removeCommentId(editorRef.current, threadId);
    setThreads((list) => list.filter((t) => t.id !== threadId));
    setPopover((p) => (p && p.threadIds.includes(threadId) ? null : p));
  }, []);

  const toggleResolved = useCallback((threadId: string) => {
    setThreads((list) =>
      list.map((t) => (t.id === threadId ? { ...t, resolved: !t.resolved } : t)),
    );
  }, []);

  const openPopover = useCallback((run: CommentRun, x: number, y: number) => {
    setCreate(null);
    setPopover({ runId: run.id, threadIds: run.threadIds, x, y });
  }, []);

  const closePopover = useCallback(() => setPopover(null), []);

  // 取消新建：若已把 id 写进了正文，去掉这个临时 id，避免留下"无会话的孤儿标记"
  const closeCreate = useCallback(() => {
    setCreate((c) => {
      if (c && !c.existing) {
        removeCommentId(editorRef.current, c.threadId);
        onCommentChange?.();
      }
      return null;
    });
  }, [onCommentChange]);

  const value = useMemo<InlineCommentApi>(
    () => ({
      threads,
      create,
      popover,
      createFromSelection,
      submitComment,
      reply,
      deleteThread,
      toggleResolved,
      openPopover,
      closePopover,
      closeCreate,
      setPopover,
    }),
    [
      threads,
      create,
      popover,
      createFromSelection,
      submitComment,
      reply,
      deleteThread,
      toggleResolved,
      openPopover,
      closePopover,
      closeCreate,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useInlineComments(): InlineCommentApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useInlineComments 必须在 InlineCommentProvider 内使用');
  return ctx;
}
