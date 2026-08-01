import { useState, useRef, useEffect } from 'react';
import { useTheme, THEME_PRESETS } from '@/context/ThemeContext';
import styles from './ThemeSwitcher.module.less';

export default function ThemeSwitcher() {
  const { theme, themeColor, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
      <button className={styles.button} onClick={() => setOpen(!open)} title="切换主题">
        <span className={styles.swatch} style={{ backgroundColor: themeColor }} />
        <span>主题</span>
      </button>
      {open && (
        <div className={styles.dropdown}>
          {THEME_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className={`${styles.option} ${theme === preset.id ? styles.optionActive : ''}`}
              onClick={() => {
                setTheme(preset.id);
                setOpen(false);
              }}
            >
              <span className={styles.optionSwatch} style={{ backgroundColor: preset.color }} />
              <span>{preset.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
