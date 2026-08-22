import { useEffect, useRef, useState } from 'react';
import { useCursor, CURSOR_THEMES } from '@/context/CursorContext';
import styles from './CursorSwitcher.module.less';

export default function CursorSwitcher() {
  const { cursorTheme, setCursorTheme } = useCursor();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const current = CURSOR_THEMES.find((t) => t.id === cursorTheme) ?? CURSOR_THEMES[0];

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button className={styles.button} onClick={() => setOpen(!open)} title="切换光标样式">
        <span className={styles.badge}>{current.badge}</span>
        <span>光标</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.title}>光标样式</div>
          {CURSOR_THEMES.map((t) => {
            const active = t.id === cursorTheme;
            return (
              <div
                key={t.id}
                className={`${styles.option} ${active ? styles.optionActive : ''}`}
                onClick={() => {
                  setCursorTheme(t.id);
                  setOpen(false);
                }}
              >
                <span className={styles.optionBadge}>{t.badge}</span>
                <div className={styles.optionMeta}>
                  <span className={styles.optionName}>{t.name}</span>
                  {t.desc && <span className={styles.optionDesc}>{t.desc}</span>}
                </div>
                {active && <span className={styles.check}>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
