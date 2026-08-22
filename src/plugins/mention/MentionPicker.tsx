import { useEffect, useMemo, useRef, useState } from 'react';
import type { MentionItem } from './mention-data';
import { searchMentions } from './mention-data';
import styles from './MentionPicker.module.less';

interface MentionPickerProps {
  /** 当前搜索关键词（@ 后面的文字） */
  searchText: string;
  /** 弹层定位（左上角坐标，相对 viewport） */
  position: { top: number; left: number };
  /** 是否暗黑模式 */
  isDark?: boolean;
  /** 选中（Tab / Enter / 点击） */
  onSelect: (item: MentionItem) => void;
  /** 关闭（Esc / 点击外部） */
  onClose: () => void;
}

export const MentionPicker = ({
  searchText,
  position,
  isDark = false,
  onSelect,
  onClose,
}: MentionPickerProps) => {
  const results = useMemo(() => searchMentions(searchText), [searchText]);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 搜索词变化时重置选中位置
  useEffect(() => {
    setActiveIndex(0);
  }, [searchText]);

  // 保证选中项可见
  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el && listRef.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const itemRect = el.getBoundingClientRect();
      if (itemRect.top < listRect.top) {
        el.scrollIntoView({ block: 'nearest' });
      } else if (itemRect.bottom > listRect.bottom) {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  // 键盘事件：上下选择、Tab/Enter 确认、Esc 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (results.length === 0 && e.key !== 'Escape') return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          e.stopPropagation();
          setActiveIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          e.stopPropagation();
          setActiveIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Tab':
        case 'Enter':
          e.preventDefault();
          e.stopPropagation();
          if (results[activeIndex]) {
            onSelect(results[activeIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          e.stopPropagation();
          onClose();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [results, activeIndex, onSelect, onClose]);

  // 点击外部关闭
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-mention-picker]')) return;
      onClose();
    };
    const timer = window.setTimeout(() => {
      document.addEventListener('mousedown', handleMouseDown, true);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mousedown', handleMouseDown, true);
    };
  }, [onClose]);

  // 按类型分组
  const { categories, docs } = useMemo(() => {
    const cats = results.filter((r) => r.kind === 'category');
    const ds = results.filter((r) => r.kind === 'doc');
    return { categories: cats, docs: ds };
  }, [results]);

  const flatItems = [...categories, ...docs];

  // 弹层位置修正：避免超出视口底部
  const adjustedTop = useMemo(() => {
    const estimatedHeight = Math.min(320, Math.max(100, flatItems.length * 36 + 60));
    const maxTop = window.innerHeight - estimatedHeight - 8;
    return Math.min(position.top, maxTop);
  }, [position.top, flatItems.length]);

  return (
    <div
      className={`${styles.picker} ${isDark ? styles.dark : ''}`}
      data-mention-picker
      style={{ top: adjustedTop, left: position.left }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className={styles.list} ref={listRef}>
        {flatItems.length === 0 ? (
          <div className={styles.empty}>没有找到匹配的结果</div>
        ) : (
          <>
            {categories.length > 0 && (
              <>
                {searchText.trim() === '' && <div className={styles.groupTitle}>分类</div>}
                {categories.map((item, idx) => {
                  const flatIdx = idx;
                  return (
                    <div
                      key={item.id}
                      ref={(el) => {
                        itemRefs.current[flatIdx] = el;
                      }}
                      className={`${styles.item} ${activeIndex === flatIdx ? styles.active : ''}`}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(item);
                      }}
                    >
                      <span className={styles.icon}>📁</span>
                      <div className={styles.content}>
                        <span className={styles.name}>{item.name}</span>
                        {item.description && (
                          <span className={styles.desc}>{item.description}</span>
                        )}
                      </div>
                      {activeIndex === flatIdx && <span className={styles.tab}>Tab</span>}
                    </div>
                  );
                })}
              </>
            )}
            {docs.length > 0 && (
              <>
                {(searchText.trim() === '' || categories.length > 0) && (
                  <div className={styles.groupTitle}>文档</div>
                )}
                {docs.map((item, idx) => {
                  const flatIdx = categories.length + idx;
                  return (
                    <div
                      key={item.id}
                      ref={(el) => {
                        itemRefs.current[flatIdx] = el;
                      }}
                      className={`${styles.item} ${activeIndex === flatIdx ? styles.active : ''}`}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(item);
                      }}
                    >
                      <span className={styles.icon}>📄</span>
                      <div className={styles.content}>
                        <span className={styles.name}>{item.name}</span>
                        {item.description && (
                          <span className={styles.desc}>{item.description}</span>
                        )}
                      </div>
                      {activeIndex === flatIdx && <span className={styles.tab}>Tab</span>}
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
      <div className={styles.footer}>
        <span>输入关键词搜索</span>
        <div className={styles.footerKeys}>
          <span className={styles.keyHint}>
            <span className={styles.keyCap}>↑↓</span> 选择
          </span>
          <span className={styles.keyHint}>
            <span className={styles.keyCap}>Tab</span> 插入
          </span>
          <span className={styles.keyHint}>
            <span className={styles.keyCap}>Esc</span> 关闭
          </span>
        </div>
      </div>
    </div>
  );
};
