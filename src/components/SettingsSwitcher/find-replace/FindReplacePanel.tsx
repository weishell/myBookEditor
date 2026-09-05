// 查找 / 替换 —— 面板 UI（悬浮于编辑器上方，portal 到 body）
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useFindReplace } from './FindReplaceContext';
import styles from './FindReplace.module.less';

export function FindReplacePanel() {
  const { t } = useTranslation();
  const {
    open,
    setOpen,
    query,
    setQuery,
    replacement,
    setReplacement,
    total,
    currentIndex,
    goToNext,
    goToPrev,
    replaceOne,
    replaceAll,
    canReplace,
  } = useFindReplace();

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
    }
  }, [open]);

  // Esc 关闭，Enter 下一个、Shift+Enter 上一个
  const onSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) goToPrev();
      else goToNext();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (!open) return null;

  const countLabel = total > 0 ? `${currentIndex + 1}/${total}` : '0/0';

  return createPortal(
    <div className={styles.bar} onMouseDown={(e) => e.stopPropagation()}>
      <div className={styles.row}>
        <span className={styles.label}>查找</span>
        <input
          ref={searchRef}
          className={styles.input}
          value={query}
          spellCheck={false}
          placeholder={t('findReplace.searchPlaceholder')}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onSearchKeyDown}
        />
        <span className={styles.count} title={t('findReplace.totalTip')}>
          {countLabel}
        </span>
        <button
          className={styles.iconBtn}
          title="上一个"
          onMouseDown={(e) => e.preventDefault()}
          onClick={goToPrev}
        >
          ↑
        </button>
        <button
          className={styles.iconBtn}
          title="下一个（Enter）"
          onMouseDown={(e) => e.preventDefault()}
          onClick={goToNext}
        >
          ↓
        </button>
        <button className={styles.closeBtn} title="关闭（Esc）" onClick={() => setOpen(false)}>
          ×
        </button>
      </div>

      <div className={`${styles.row} ${styles.replaceRow}`}>
        <span className={styles.label}>替换</span>
        <input
          className={styles.input}
          value={replacement}
          spellCheck={false}
          placeholder={t('findReplace.replacePlaceholder')}
          onChange={(e) => setReplacement(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              replaceOne();
            }
          }}
        />
        <button
          className={styles.actionBtn}
          disabled={!canReplace || !total || currentIndex < 0}
          onClick={replaceOne}
        >
          {t('findReplace.replaceOne')}
        </button>
        <button
          className={`${styles.actionBtn} ${styles.actionPrimary}`}
          disabled={!canReplace || !total}
          onClick={replaceAll}
        >
          {t('findReplace.replaceAll')}
        </button>
      </div>
      <div className={styles.tip}>{t('findReplace.tip')}</div>
    </div>,
    document.body,
  );
}
