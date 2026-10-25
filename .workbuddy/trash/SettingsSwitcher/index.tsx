// 右上角「设置」下拉（合并原 FontSwitcher / ThemeSwitcher / CursorSwitcher /
// ModeSwitcher / LanguageSwitcher，新增「查找替换」入口）
//
// 交互：点击「设置」按钮展开面板；面板内可逐级进入字体 / 主题 / 光标 / 语言子视图，
//       模式为即时切换项；「查找替换」点击后打开全局查找替换面板。
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme, THEME_PRESETS, type ThemeId } from '@/context/ThemeContext';
import { useCursor, CURSOR_THEMES } from '@/context/CursorContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEditorMode } from '@/context/EditorContext';
import { SUPPORTED_LANGUAGES, LANGUAGE_SHORT } from '@/i18n';
import { FONT_LIST, DEFAULT_FONT_ID, loadFont, getFontById } from '@/plugins/font';
import { getWallpaperById, WALLPAPER_NONE_ID } from '@/components/wallpapers';
import { useFindReplace } from './find-replace/FindReplaceContext';
import styles from './SettingsSwitcher.module.less';

// 背景选择已独立成 /appearance 整页画廊（缩略图预览 + 即时生效），
// 这里只留一个入口跳过去，不在下拉里再维护一份壁纸清单
type View = 'home' | 'font' | 'theme' | 'cursor' | 'language';

const BLACK_THEME_ID: ThemeId = 'black';

/** 顶部返回栏 */
function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const { t } = useTranslation();
  return (
    <div className={styles.subHeader}>
      <button className={styles.backBtn} onClick={onBack} title={t('settings.back')}>
        ←
      </button>
      <span className={styles.subTitle}>{title}</span>
    </div>
  );
}

export default function SettingsSwitcher() {
  const { t } = useTranslation();
  const { globalFont, setGlobalFont, mode, setMode } = useEditorMode();
  const { theme, themeColor, isDarkMode, setTheme, wallpaper, lightWallpaper } = useTheme();
  const { cursorTheme, setCursorTheme } = useCursor();
  const { language, setLanguage } = useLanguage();
  const { setOpen: setFindOpen } = useFindReplace();
  const navigate = useNavigate();

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

  // 入口行只显示"当前模式正在用的那张壁纸"的名字
  const activeWallpaper = getWallpaperById(isDarkMode ? wallpaper : lightWallpaper);
  const activeWallpaperLabel =
    !activeWallpaper || activeWallpaper.id === WALLPAPER_NONE_ID ? '纯色底' : activeWallpaper.name;

  /** 跳独立路由前先关掉下拉，否则返回时下拉还开着 */
  const goAppearance = () => {
    setOpen(false);
    setView('home');
    navigate('/appearance');
  };

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
      <button className={styles.trigger} onClick={() => setOpen(!open)} title={t('settings.title')}>
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
        <span>{t('settings.title')}</span>
      </button>

      {open && (
        <div className={styles.dropdown} onMouseDown={(e) => e.stopPropagation()}>
          {view === 'home' && (
            <>
              <div className={styles.group}>
                <button className={styles.rowItem} onClick={handleFind}>
                  <span className={`${styles.rowIcon} ${styles.findIcon}`}>⌕</span>
                  <span className={styles.rowLabel}>{t('settings.findReplace')}</span>
                  <span className={styles.rowValue}>
                    <kbd>Ctrl</kbd>+<kbd>F</kbd>
                  </span>
                </button>
              </div>

              <div className={styles.divider} />

              <button className={styles.rowItem} onClick={() => openView('font')}>
                <span className={styles.rowIcon}>Aa</span>
                <span className={styles.rowLabel}>{t('settings.font')}</span>
                <span className={styles.rowValue}>
                  {currentFontId !== DEFAULT_FONT_ID
                    ? t(`fontSwitcher.names.${currentFontId}`)
                    : t('fontSwitcher.names.default')}
                </span>
                <span className={styles.caret}>›</span>
              </button>
              <button className={styles.rowItem} onClick={() => openView('theme')}>
                <span className={styles.swatch} style={{ backgroundColor: themeColor }} />
                <span className={styles.rowLabel}>{t('settings.theme')}</span>
                <span className={styles.rowValue}>
                  {currentTheme ? t(`themePresets.${currentTheme.id}`) : ''}
                </span>
                <span className={styles.caret}>›</span>
              </button>
              <button className={styles.rowItem} onClick={() => openView('cursor')}>
                <span className={styles.rowIcon}>{currentCursor.badge}</span>
                <span className={styles.rowLabel}>{t('settings.cursor')}</span>
                <span className={styles.rowValue}>
                  {t(`cursorThemes.${currentCursor.id}.name`)}
                </span>
                <span className={styles.caret}>›</span>
              </button>
              {/* 外观/背景是整页画廊，跳路由而不是在这里展开二级列表 */}
              <button className={styles.rowItem} onClick={goAppearance}>
                <span className={styles.rowIcon}>◧</span>
                <span className={styles.rowLabel}>外观与背景</span>
                <span className={styles.rowValue}>{activeWallpaperLabel}</span>
                <span className={styles.caret}>›</span>
              </button>

              <div className={styles.divider} />

              <button
                className={styles.rowItem}
                onClick={() => setMode(mode === 'edit' ? 'read' : 'edit')}
              >
                <span className={styles.rowIcon}>◐</span>
                <span className={styles.rowLabel}>{t('settings.mode')}</span>
                <span className={styles.rowValue}>
                  {mode === 'edit' ? t('settings.modeEdit') : t('settings.modeRead')}
                </span>
                <span className={styles.caret}>›</span>
              </button>
              <button className={styles.rowItem} onClick={() => openView('language')}>
                <span className={styles.rowIcon}>文</span>
                <span className={styles.rowLabel}>{t('settings.language')}</span>
                <span className={styles.rowValue}>{LANGUAGE_SHORT[language]}</span>
                <span className={styles.caret}>›</span>
              </button>
            </>
          )}

          {view === 'font' && (
            <>
              <SubHeader title={t('settings.font')} onBack={backHome} />
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
              <SubHeader title={t('settings.theme')} onBack={backHome} />
              <div className={styles.options}>
                {THEME_PRESETS.map((preset) => (
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
                      {preset.id === BLACK_THEME_ID
                        ? t('themePresets.blackDark')
                        : t(`themePresets.${preset.id}`)}
                    </span>
                    {theme === preset.id && <span className={styles.check}>✓</span>}
                  </div>
                ))}
              </div>
              {/* 背景选择在独立路由里做（缩略图画廊），这里只跳转 */}
              <button className={styles.subEntry} onClick={goAppearance}>
                <span>{t('settings.wallpaper')}</span>
                <span className={styles.rowValue}>{activeWallpaperLabel}</span>
                <span className={styles.caret}>›</span>
              </button>
            </>
          )}

          {view === 'cursor' && (
            <>
              <SubHeader title={t('settings.cursor')} onBack={backHome} />
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
                        <span className={styles.optionName}>{t(`cursorThemes.${c.id}.name`)}</span>
                        {c.desc && (
                          <span className={styles.optionDesc}>
                            {t(`cursorThemes.${c.id}.desc`)}
                          </span>
                        )}
                      </div>
                      {active && <span className={styles.check}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {view === 'language' && (
            <>
              <SubHeader title={t('settings.language')} onBack={backHome} />
              <div className={styles.options}>
                {SUPPORTED_LANGUAGES.map((code) => {
                  const active = language === code;
                  return (
                    <div
                      key={code}
                      className={`${styles.option} ${active ? styles.optionActive : ''}`}
                      onClick={() => setLanguage(code)}
                    >
                      <span className={styles.optionName}>{t(`languages.${code}`)}</span>
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
