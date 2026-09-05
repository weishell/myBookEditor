// 右上角「设置」下拉（合并原 FontSwitcher / ThemeSwitcher / CursorSwitcher /
// ModeSwitcher / LanguageSwitcher，新增「查找替换」入口）
//
// 交互：点击「设置」按钮展开面板；面板内可逐级进入字体 / 主题 / 光标子视图，
//       模式与语言为即时切换项；「查找替换」点击后打开全局查找替换面板。
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, THEME_PRESETS, type ThemeId } from '@/context/ThemeContext';
import { useCursor, CURSOR_THEMES } from '@/context/CursorContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEditorMode } from '@/context/EditorContext';
import { FONT_LIST, DEFAULT_FONT_ID, loadFont, getFontById } from '@/plugins/font';
import { WALLPAPER_PRESETS, WALLPAPER_NONE_ID, getWallpaperById } from '@/components/wallpapers';
import { useFindReplace } from './find-replace/FindReplaceContext';
import styles from './SettingsSwitcher.module.less';

type View = 'home' | 'font' | 'theme' | 'cursor' | 'wallpaper';

const BLACK_THEME_ID: ThemeId = 'black';

/** 顶部返回栏 */
function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className={styles.subHeader}>
      <button className={styles.backBtn} onClick={onBack} title="返回">
        ←
      </button>
      <span className={styles.subTitle}>{title}</span>
    </div>
  );
}

export default function SettingsSwitcher() {
  const { t } = useTranslation();
  const { globalFont, setGlobalFont, mode, setMode } = useEditorMode();
  const { theme, themeColor, setTheme, wallpaper, setWallpaper } = useTheme();
  const { cursorTheme, setCursorTheme } = useCursor();
  const { language, toggleLanguage } = useLanguage();
  const { setOpen: setFindOpen } = useFindReplace();

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('home');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setView('home');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const currentFontId = FONT_LIST.find((f) => f.family === globalFont)?.id || DEFAULT_FONT_ID;
  const currentTheme = THEME_PRESETS.find((p) => p.id === theme);
  const currentCursor = CURSOR_THEMES.find((c) => c.id === cursorTheme) ?? CURSOR_THEMES[0];
  const currentWallpaper = wallpaper ? getWallpaperById(wallpaper) : undefined;

  const openView = (v: View) => setView(v);
  const backHome = () => setView('home');

  const handleFind = () => {
    setFindOpen(true);
    setOpen(false);
    setView('home');
  };

  const handleFontClick = async (fontId: string) => {
    const font = getFontById(fontId);
    if (!font) return;
    if (font.id === DEFAULT_FONT_ID) {
      setGlobalFont('inherit');
      return;
    }
    if (font.category === 'web' && font.url) {
      try {
        await loadFont(font);
      } catch (e) {
        console.error('字体加载失败:', font.id, e);
      }
    }
    setGlobalFont(font.family);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button className={styles.trigger} onClick={() => setOpen(!open)} title="设置">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span>设置</span>
      </button>

      {open && (
        <div className={styles.dropdown} onMouseDown={(e) => e.stopPropagation()}>
          {view === 'home' && (
            <>
              <div className={styles.group}>
                <button className={styles.rowItem} onClick={handleFind}>
                  <span className={`${styles.rowIcon} ${styles.findIcon}`}>⌕</span>
                  <span className={styles.rowLabel}>查找替换</span>
                  <span className={styles.rowValue}>
                    <kbd>Ctrl</kbd>+<kbd>F</kbd>
                  </span>
                </button>
              </div>

              <div className={styles.divider} />

              <button className={styles.rowItem} onClick={() => openView('font')}>
                <span className={styles.rowIcon}>Aa</span>
                <span className={styles.rowLabel}>字体</span>
                <span className={styles.rowValue}>
                  {currentFontId !== DEFAULT_FONT_ID
                    ? t(`fontSwitcher.names.${currentFontId}`)
                    : t('fontSwitcher.names.default')}
                </span>
                <span className={styles.caret}>›</span>
              </button>
              <button className={styles.rowItem} onClick={() => openView('theme')}>
                <span className={styles.swatch} style={{ backgroundColor: themeColor }} />
                <span className={styles.rowLabel}>主题</span>
                <span className={styles.rowValue}>{currentTheme?.name ?? ''}</span>
                <span className={styles.caret}>›</span>
              </button>
              <button className={styles.rowItem} onClick={() => openView('cursor')}>
                <span className={styles.rowIcon}>{currentCursor.badge}</span>
                <span className={styles.rowLabel}>光标</span>
                <span className={styles.rowValue}>{currentCursor.name}</span>
                <span className={styles.caret}>›</span>
              </button>

              <div className={styles.divider} />

              <button
                className={styles.rowItem}
                onClick={() => setMode(mode === 'edit' ? 'read' : 'edit')}
              >
                <span className={styles.rowIcon}>◐</span>
                <span className={styles.rowLabel}>模式</span>
                <span className={styles.rowValue}>{mode === 'edit' ? '编辑' : '阅读'}</span>
                <span className={styles.caret}>›</span>
              </button>
              <button className={styles.rowItem} onClick={toggleLanguage}>
                <span className={styles.rowIcon}>文</span>
                <span className={styles.rowLabel}>语言</span>
                <span className={styles.rowValue}>{language === 'zh' ? '中文' : 'EN'}</span>
                <span className={styles.caret}>›</span>
              </button>
            </>
          )}

          {view === 'font' && (
            <>
              <SubHeader title="字体" onBack={backHome} />
              <div className={styles.options}>
                {FONT_LIST.map((font) => {
                  const isActive = currentFontId === font.id;
                  const isDefault = font.id === DEFAULT_FONT_ID;
                  return (
                    <div
                      key={font.id}
                      className={`${styles.option} ${isActive ? styles.optionActive : ''}`}
                      onClick={() => handleFontClick(font.id)}
                    >
                      <span
                        className={styles.optionName}
                        style={{ fontFamily: isDefault ? undefined : font.family }}
                      >
                        {isDefault
                          ? t('fontSwitcher.names.default')
                          : t(`fontSwitcher.names.${font.id}`)}
                      </span>
                      {font.category === 'web' && <span className={styles.optionTag}>Web</span>}
                      {isActive && <span className={styles.check}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {view === 'theme' && (
            <>
              <SubHeader title="主题" onBack={backHome} />
              <div className={styles.options}>
                {THEME_PRESETS.map((preset, i) => (
                  <div
                    key={preset.id}
                    className={`${styles.option} ${theme === preset.id ? styles.optionActive : ''}`}
                    onClick={() => setTheme(preset.id)}
                  >
                    <span
                      className={styles.optionSwatch}
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className={styles.optionName}>
                      {i === 11 ? '黑色（暗黑）' : preset.name}
                    </span>
                    {theme === preset.id && <span className={styles.check}>✓</span>}
                  </div>
                ))}
              </div>
              {theme === BLACK_THEME_ID && (
                <button className={styles.subEntry} onClick={() => openView('wallpaper')}>
                  <span>暗黑壁纸</span>
                  <span className={styles.rowValue}>
                    {currentWallpaper?.id === WALLPAPER_NONE_ID ? '默认' : currentWallpaper?.name}
                  </span>
                  <span className={styles.caret}>›</span>
                </button>
              )}
            </>
          )}

          {view === 'wallpaper' && (
            <>
              <SubHeader title="暗黑壁纸" onBack={() => openView('theme')} />
              <div className={styles.options}>
                {WALLPAPER_PRESETS.map((w) => {
                  const selected = wallpaper === w.id;
                  return (
                    <div
                      key={w.id}
                      className={`${styles.option} ${selected ? styles.optionActive : ''}`}
                      onClick={() => {
                        setWallpaper(w.id);
                        if (theme !== BLACK_THEME_ID) setTheme(BLACK_THEME_ID);
                      }}
                    >
                      <span className={styles.optionName}>{w.name}</span>
                      {w.description && <span className={styles.optionDesc}>{w.description}</span>}
                      {selected && <span className={styles.check}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {view === 'cursor' && (
            <>
              <SubHeader title="光标" onBack={backHome} />
              <div className={styles.options}>
                {CURSOR_THEMES.map((c) => {
                  const active = c.id === cursorTheme;
                  return (
                    <div
                      key={c.id}
                      className={`${styles.option} ${active ? styles.optionActive : ''}`}
                      onClick={() => setCursorTheme(c.id)}
                    >
                      <span className={styles.optionBadge}>{c.badge}</span>
                      <div className={styles.optionMeta}>
                        <span className={styles.optionName}>{c.name}</span>
                        {c.desc && <span className={styles.optionDesc}>{c.desc}</span>}
                      </div>
                      {active && <span className={styles.check}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
