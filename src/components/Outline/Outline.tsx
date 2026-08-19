import { useState, useEffect, useRef, useMemo } from 'react';
import { useEditorMode } from '@/context/EditorContext';
import { useHeadings } from './useHeadings';
import { BlockElementType } from '@/enums';
import styles from './Outline.module.less';

// 断点：小于此宽度时显示为悬浮模式
const MOBILE_BREAKPOINT = 1500;

/** 从 Slate 节点递归提取纯文本 */
function extractNodeText(node: any): string {
  if (!node) return '';
  if (node.text) return node.text;
  if (!node.children || !Array.isArray(node.children)) return '';
  return node.children.map((child: any) => extractNodeText(child)).join('');
}

export function Outline() {
  const { editor } = useEditorMode();
  const { headings, activeId, scrollToHeading } = useHeadings(editor);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 响应式检测
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasHeadings = headings.length > 0;

  // 取文档标题：优先从 HEADING_TITLE 块提取（即文章大标题"欢迎使用文档编辑器"），
  // 其次 fallback 到第一个 h1，都没有则留空
  const docTitle = useMemo(() => {
    if (!editor) return '';
    const children = (editor as any).children;
    if (!Array.isArray(children)) return '';
    // 找 heading-title 类型块
    for (const node of children) {
      if (node.type === BlockElementType.HEADING_TITLE) {
        const text = extractNodeText(node);
        if (text.trim()) return text.trim();
      }
    }
    // fallback: 第一个 h1
    const h1 = headings.find((h) => h.level === 1);
    if (h1?.text) return h1.text;
    return '';
  }, [editor, headings]);

  // 移动端显示为悬浮按钮
  if (isMobile) {
    return (
      <>
        {/* 悬浮按钮 */}
        {hasHeadings && (
          <button
            className={styles.fab}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={docTitle || '目录导航'}
            title={docTitle || '目录导航'}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        )}
        {/* 展开的目录面板 */}
        {isCollapsed && hasHeadings && (
          <div className={`${styles.panel} ${styles.panelMobile}`}>
            <div className={styles.mobileHeader}>
              <span>{docTitle || '目录'}</span>
              <button
                className={styles.closeBtn}
                onClick={() => setIsCollapsed(false)}
                aria-label="关闭"
              >
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <OutlineList
              headings={headings}
              activeId={activeId}
              onSelect={(id) => {
                scrollToHeading(id);
                setIsCollapsed(false);
              }}
            />
          </div>
        )}
      </>
    );
  }

  // 桌面端：右侧固定目录
  if (!hasHeadings) return null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>{docTitle || '目录'}</div>
      <OutlineList headings={headings} activeId={activeId} onSelect={scrollToHeading} />
    </aside>
  );
}

// 目录列表
interface OutlineListProps {
  headings: ReturnType<typeof useHeadings>['headings'];
  activeId: string;
  onSelect: (id: string) => void;
}

function OutlineList({ headings, activeId, onSelect }: OutlineListProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (!activeId || !navRef.current) return;
    const activeEl = itemRefs.current.get(activeId);
    if (activeEl) {
      const navRect = navRef.current.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      if (elRect.top < navRect.top || elRect.bottom > navRect.bottom) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeId]);

  return (
    <nav className={styles.nav} ref={navRef}>
      {headings.map((h) => (
        <button
          key={h.id}
          ref={(el) => {
            if (el) itemRefs.current.set(h.id, el);
            else itemRefs.current.delete(h.id);
          }}
          className={`${styles.item} ${styles[`level-${h.level}`]} ${activeId === h.id ? styles.active : ''}`}
          onClick={() => onSelect(h.id)}
          title={h.text}
        >
          <span className={styles.text}>{h.text}</span>
        </button>
      ))}
    </nav>
  );
}
