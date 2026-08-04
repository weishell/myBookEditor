import { useState, useEffect } from 'react';
import { useEditorMode } from '@/context/EditorContext';
import { useHeadings } from './useHeadings';
import styles from './Outline.module.less';

// 断点：小于此宽度时显示为悬浮模式
const MOBILE_BREAKPOINT = 1200;

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

  // 移动端显示为悬浮按钮
  if (isMobile) {
    return (
      <>
        {/* 悬浮按钮 */}
        {hasHeadings && (
          <button
            className={styles.fab}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="目录"
            title="目录"
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
              <span>目录</span>
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
      <div className={styles.sidebarHeader}>目录</div>
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
  return (
    <nav className={styles.nav}>
      {headings.map((h) => (
        <button
          key={h.id}
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
