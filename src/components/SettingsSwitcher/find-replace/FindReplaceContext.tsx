// 查找 / 替换 —— 全局状态与逻辑 Provider
//
// 挂载在应用最顶层，负责：
//   1. 管理查找面板开关（open）
//   2. 全局监听 Ctrl/Cmd + F 打开查找替换，并拦截浏览器原生查找
//   3. 根据 editor 与查询词实时收集匹配，供 decorate 高亮与面板计数
//   4. 提供上/下一个、替换当前、全部替换等操作
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { useEditorMode } from '@/context/EditorContext';
import { collectMatches, replaceAllMatches, replaceMatch, type FindMatch } from './find-utils';

interface FindReplaceContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  replacement: string;
  setReplacement: (replacement: string) => void;
  matches: FindMatch[];
  total: number;
  currentIndex: number;
  goToNext: () => void;
  goToPrev: () => void;
  replaceOne: () => void;
  replaceAll: () => void;
  /** 阅读模式下禁用替换 */
  canReplace: boolean;
}

const FindReplaceContext = createContext<FindReplaceContextType | undefined>(undefined);

/** 选中某个匹配并滚动到可视区域（同时让"当前项"高亮生效） */
const focusAndScroll = (editor: any, match: FindMatch): void => {
  if (!editor) return;
  const range = {
    anchor: { path: match.path, offset: match.offset },
    focus: { path: match.path, offset: match.offset + match.length },
  };
  try {
    Transforms.select(editor, range);
    const dom = ReactEditor.toDOMRange(editor, range);
    const el = dom?.startContainer?.parentElement;
    el?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  } catch {
    /* 只读或极端情况忽略滚动 */
  }
};

export function FindReplaceProvider({ children }: { children: ReactNode }) {
  const { editor, mode } = useEditorMode();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [replacement, setReplacement] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);
  // 替换操作后版本号 +1，触发 matches 重算（query 未变但匹配区间已变）
  const [version, setVersion] = useState(0);
  const editorRef = useRef(editor);
  editorRef.current = editor;

  // 全局 Ctrl/Cmd + F → 打开查找面板并拦截浏览器原生查找
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f' && (e.ctrlKey || e.metaKey) && !e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const matches = useMemo<FindMatch[]>(
    () => collectMatches(editor as any, query),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, query, version],
  );
  const total = matches.length;

  // 查询词变化：若还有匹配则跳到第一个
  useEffect(() => {
    setCurrentIndex(total > 0 ? 0 : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, version]);

  const goToIndex = useCallback(
    (next: number) => {
      if (!matches.length) return;
      const idx = ((next % matches.length) + matches.length) % matches.length;
      setCurrentIndex(idx);
      focusAndScroll(editorRef.current, matches[idx]);
    },
    [matches],
  );

  const goToNext = useCallback(() => {
    const base = currentIndex < 0 ? 0 : currentIndex + 1;
    goToIndex(base);
  }, [currentIndex, goToIndex]);

  const goToPrev = useCallback(() => {
    const base = currentIndex < 0 ? matches.length - 1 : currentIndex - 1;
    goToIndex(base);
  }, [currentIndex, matches.length, goToIndex]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const replaceOne = useCallback(() => {
    const ed = editorRef.current;
    const m = matches[currentIndex];
    if (!ed || !m) return;
    replaceMatch(ed, m, replacement);
    refresh();
  }, [matches, currentIndex, replacement, refresh]);

  const replaceAll = useCallback(() => {
    const ed = editorRef.current;
    if (!ed || !matches.length) return;
    replaceAllMatches(ed, matches, replacement);
    refresh();
  }, [matches, replacement, refresh]);

  const value = useMemo<FindReplaceContextType>(
    () => ({
      open,
      setOpen,
      query,
      setQuery: (q: string) => {
        setQuery(q);
      },
      replacement,
      setReplacement,
      matches,
      total,
      currentIndex: total > 0 ? currentIndex : -1,
      goToNext,
      goToPrev,
      replaceOne,
      replaceAll,
      canReplace: mode === 'edit',
    }),
    [
      open,
      query,
      replacement,
      matches,
      total,
      currentIndex,
      goToNext,
      goToPrev,
      replaceOne,
      replaceAll,
      mode,
    ],
  );

  return <FindReplaceContext.Provider value={value}>{children}</FindReplaceContext.Provider>;
}

export function useFindReplace() {
  const context = useContext(FindReplaceContext);
  if (context === undefined) {
    throw new Error('useFindReplace must be used within a FindReplaceProvider');
  }
  return context;
}
