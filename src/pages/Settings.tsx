// 设置页（独立路由 /settings）
//
// 为什么把原来顶栏那个「设置」下拉整块搬到这里：
// - 下拉浮层里塞了字体/主题/光标/语言/背景五套选择器，一层套一层，
//   选背景还得看缩略图才知道效果，浮层里根本展不开
// - 设置是"低频、想一次看全"的操作，做成整页 + 左侧分组最直观，
//   而且地址栏有 /settings，可以直接分享/收藏
// - 顶栏因此只剩 logo + 导航 + 搜索，干净很多
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme, THEME_PRESETS, type ThemeId } from '@/context/ThemeContext';
import { useCursor, CURSOR_THEMES } from '@/context/CursorContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEditorMode } from '@/context/EditorContext';
import { SUPPORTED_LANGUAGES, LANGUAGE_SHORT, type AppLanguage } from '@/i18n';
import { FONT_LIST, DEFAULT_FONT_ID, loadFont, getFontById } from '@/plugins/font';
import { canWrite } from '@/data/store';
import {
  fetchOrphanInspection,
  runOrphanCleanup,
  formatBytes,
  type OrphanInspection,
} from '@/data/maintenance';
import {
  WALLPAPER_NONE_ID,
  getWallpapersByMode,
  type WallpaperPreset,
} from '@/components/wallpapers';
import styles from './Settings.module.less';

type TabId = 'appearance' | 'theme' | 'font' | 'cursor' | 'language' | 'mode' | 'maintenance';

const TABS: { id: TabId; label: string; note: string; icon: string }[] = [
  { id: 'appearance', label: '外观与背景', note: '壁纸 · 明暗', icon: '◧' },
  { id: 'theme', label: '主题色', note: '按钮与高亮', icon: '◐' },
  { id: 'font', label: '字体', note: '正文默认字体', icon: 'Aa' },
  { id: 'cursor', label: '光标', note: '指针样式', icon: '↖' },
  { id: 'language', label: '语言', note: '界面语言', icon: '文' },
  { id: 'mode', label: '阅读模式', note: '编辑 / 只读', icon: '☰' },
  { id: 'maintenance', label: '资源维护', note: '清理无引用资源', icon: '⌫' },
];

// 字体没有自带中文名（i18n 里才有），这里给一份兜底，翻译缺失时不至于显示成 id
const FONT_LABELS: Record<string, string> = {
  default: '默认（继承）',
  songti: '宋体',
  heiti: '黑体',
  kaiti: '楷体',
  fangsong: '仿宋',
  yahei: '微软雅黑',
  jinshusong: '寒蝉锦书宋',
  dongfangdakai: '东方大楷',
};

const BLACK_THEME_ID: ThemeId = 'black';
const DEFAULT_THEME: ThemeId = 'blue';
const DEFAULT_LIGHT_WALLPAPER = 'art-ink-mountain';

/** 浅色壁纸的分组顺序：氛围类在前，「柔和护眼」这类纯色垫底 */
const GROUP_ORDER = [
  '古风雅韵',
  '科技极客',
  '山水意境',
  '质感纸纹',
  '风景照片',
  '插画底图',
  '柔和护眼',
];
const FALLBACK_GROUP = '柔和护眼';

/** 暗黑壁纸没有 thumbCss（组件里画的是动画夜空），给一张同色系的静态渐变兜底 */
const DARK_THUMB_FALLBACK =
  'radial-gradient(circle at 78% 18%, rgba(120,150,220,0.35), transparent 52%),' +
  'linear-gradient(180deg, #101725 0%, #080b13 100%)';

interface Group {
  title: string;
  items: WallpaperPreset[];
}

/** 按 group 字段聚合并按固定顺序排列，未知分组排到最后 */
function groupPresets(presets: WallpaperPreset[]): Group[] {
  const map = new Map<string, WallpaperPreset[]>();
  for (const preset of presets) {
    const key = preset.group || FALLBACK_GROUP;
    const list = map.get(key);
    if (list) list.push(preset);
    else map.set(key, [preset]);
  }

  const ordered: Group[] = [];
  for (const title of GROUP_ORDER) {
    const items = map.get(title);
    if (items?.length) {
      ordered.push({ title, items });
      map.delete(title);
    }
  }
  for (const [title, items] of map) ordered.push({ title, items });
  return ordered;
}

export default function Settings() {
  const { t } = useTranslation();
  const {
    theme,
    themeColor,
    isDarkMode,
    wallpaper,
    lightWallpaper,
    setTheme,
    setWallpaper,
    setLightWallpaper,
  } = useTheme();
  const { cursorTheme, setCursorTheme } = useCursor();
  const { language, setLanguage } = useLanguage();
  const { globalFont, setGlobalFont, mode, setMode } = useEditorMode();

  const [tab, setTab] = useState<TabId>('appearance');

  /* ---------- 资源维护：只读体检 + 手动清理 ----------
     清理是危险操作，所以这里只做「展示 + 发起」：
     能不能清由后端判定（回收站必须为空），前端禁用按钮只是第一道门。 */
  const writable = canWrite();
  const [inspection, setInspection] = useState<OrphanInspection | null>(null);
  const [scanning, setScanning] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleanupMsg, setCleanupMsg] = useState<string | null>(null);
  const [cleanupError, setCleanupError] = useState<string | null>(null);

  const orphanTotal =
    (inspection?.orphanMedia.length ?? 0) + (inspection?.orphanComments.length ?? 0);

  const scanOrphans = useCallback(async () => {
    setScanning(true);
    setCleanupError(null);
    try {
      setInspection(await fetchOrphanInspection());
    } catch (err) {
      setCleanupError(err instanceof Error ? err.message : '扫描失败');
    } finally {
      setScanning(false);
    }
  }, []);

  // 进入「资源维护」时自动体检一次（只读，不会改任何文件）
  useEffect(() => {
    if (tab === 'maintenance' && writable && !inspection && !scanning) void scanOrphans();
  }, [tab, writable, inspection, scanning, scanOrphans]);

  const doCleanup = async () => {
    setCleaning(true);
    setCleanupError(null);
    setCleanupMsg(null);
    try {
      const result = await runOrphanCleanup();
      setCleanupMsg(
        `已清理 ${result.removed} 个文件，释放 ${formatBytes(result.freedBytes)}` +
          (result.failed ? `（${result.failed} 个删除失败，见服务端日志）` : ''),
      );
      setConfirming(false);
      await scanOrphans();
    } catch (err) {
      setCleanupError(err instanceof Error ? err.message : '清理失败');
    } finally {
      setCleaning(false);
    }
  };

  const lightGroups = useMemo(
    () => groupPresets(getWallpapersByMode('light').filter((p) => p.id !== WALLPAPER_NONE_ID)),
    [],
  );
  const darkPresets = useMemo(
    () => getWallpapersByMode('dark').filter((p) => p.id !== WALLPAPER_NONE_ID),
    [],
  );

  const activeId = isDarkMode ? wallpaper : lightWallpaper;
  // 无背景是"两套都关掉"的独立选项，不归属任何一组
  const isNone = activeId === WALLPAPER_NONE_ID || !activeId;

  const switchToLight = () => {
    if (isDarkMode) setTheme(DEFAULT_THEME);
  };
  const switchToDark = () => {
    if (!isDarkMode) setTheme(BLACK_THEME_ID);
  };

  // 浅色壁纸配浅色主题、暗黑壁纸配暗黑主题：壁纸和模式必须一致，
  // 否则 WallpaperHost 会把不匹配的壁纸当成"无壁纸"直接不渲染，用户会以为点了没反应
  const pickLight = (id: string) => {
    setLightWallpaper(id);
    if (isDarkMode) setTheme(DEFAULT_THEME);
  };
  const pickDark = (id: string) => {
    setWallpaper(id);
    if (!isDarkMode) setTheme(BLACK_THEME_ID);
  };
  const resetAll = () => {
    setTheme(DEFAULT_THEME);
    setLightWallpaper(DEFAULT_LIGHT_WALLPAPER);
    setWallpaper(WALLPAPER_NONE_ID);
  };

  const currentFontId = FONT_LIST.find((f) => f.family === globalFont)?.id || DEFAULT_FONT_ID;

  const handleFontClick = useCallback(
    async (fontId: string) => {
      const font = getFontById(fontId);
      if (!font) return;
      if (font.id === DEFAULT_FONT_ID) {
        setGlobalFont('inherit');
        return;
      }
      if (font.category === 'web' && font.url) {
        try {
          await loadFont(font);
        } catch (error) {
          console.error('字体加载失败:', font.id, error);
        }
      }
      setGlobalFont(font.family);
    },
    [setGlobalFont],
  );

  const renderCard = (preset: WallpaperPreset, onPick: (id: string) => void, dark = false) => {
    const selected = activeId === preset.id;
    const Comp = preset.component;
    return (
      <button
        key={preset.id}
        type="button"
        className={`${styles.card} ${selected ? styles.cardActive : ''}`}
        onClick={() => onPick(preset.id)}
        aria-pressed={selected}
      >
        <span className={styles.thumb}>
          {/* 缩略图直接用真实壁纸渲染：组件本身是 position:absolute; inset:0，
              会以卡片为参照系自适应尺寸，所以缩略图和实际效果一模一样 */}
          {Comp ? (
            <span
              className={styles.thumbLive}
              aria-hidden="true"
              style={{ transform: preset.thumbScale ? `scale(${preset.thumbScale})` : undefined }}
            >
              <Comp />
            </span>
          ) : preset.imageUrl ? (
            <span
              className={styles.thumbLive}
              aria-hidden="true"
              style={{ backgroundImage: `url(${preset.imageUrl})`, backgroundSize: 'cover' }}
            />
          ) : (
            <span
              className={styles.thumbLive}
              aria-hidden="true"
              style={{ backgroundImage: preset.thumbCss || (dark ? DARK_THUMB_FALLBACK : '') }}
            />
          )}
          {selected && <span className={styles.check}>✓</span>}
        </span>
        <span className={styles.cardName}>{preset.name}</span>
        {preset.description && <span className={styles.cardDesc}>{preset.description}</span>}
      </button>
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.headMain}>
          <Link to="/" className={styles.backLink}>
            ← 返回首页
          </Link>
          <h1 className={styles.title}>设置</h1>
          <p className={styles.subtitle}>
            外观、背景、字体、光标、语言都在这一页，点一下即时生效，选择记在本机浏览器里。
          </p>
        </div>
        <div className={styles.headSide}>
          <div className={styles.modeSwitch} role="group" aria-label="明暗模式">
            <button
              type="button"
              className={`${styles.modeBtn} ${!isDarkMode ? styles.modeBtnActive : ''}`}
              onClick={switchToLight}
            >
              浅色
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${isDarkMode ? styles.modeBtnActive : ''}`}
              onClick={switchToDark}
            >
              深色
            </button>
          </div>
          <span className={styles.headNote}>
            {isDarkMode ? '当前：深色模式' : `当前：浅色 · 主题色 ${themeColor}`}
          </span>
        </div>
      </header>

      <div className={styles.body}>
        <nav className={styles.side} aria-label="设置分组">
          {TABS.filter((item) => item.id !== 'maintenance' || writable).map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.sideItem} ${tab === item.id ? styles.sideItemActive : ''}`}
              onClick={() => setTab(item.id)}
              aria-current={tab === item.id}
            >
              <span className={styles.sideIcon}>{item.icon}</span>
              <span className={styles.sideMeta}>
                <span className={styles.sideLabel}>{item.label}</span>
                <span className={styles.sideNote}>{item.note}</span>
              </span>
            </button>
          ))}
        </nav>

        <section className={styles.content}>
          {tab === 'appearance' && (
            <>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>外观与背景</h2>
                <span className={styles.sectionDesc}>全部由代码绘制，不加载图片，切换无闪烁</span>
              </div>

              <div className={styles.noneRow}>
                <button
                  type="button"
                  className={`${styles.noneCard} ${isNone ? styles.cardActive : ''}`}
                  onClick={() => {
                    setLightWallpaper(WALLPAPER_NONE_ID);
                    setWallpaper(WALLPAPER_NONE_ID);
                  }}
                >
                  <span className={styles.noneThumb} />
                  <span className={styles.noneMeta}>
                    <span className={styles.cardName}>纯色底</span>
                    <span className={styles.cardDesc}>不用背景图，只保留主题色晕染</span>
                  </span>
                  {isNone && <span className={styles.noneCheck}>✓</span>}
                </button>
              </div>

              {lightGroups.map((group) => (
                <div key={group.title} className={styles.group}>
                  <h3 className={styles.groupTitle}>{group.title}</h3>
                  <div className={styles.grid}>
                    {group.items.map((p) => renderCard(p, pickLight))}
                  </div>
                </div>
              ))}

              <div className={styles.group}>
                <h3 className={styles.groupTitle}>
                  暗黑背景
                  <span className={styles.groupNote}>
                    {isDarkMode ? '当前生效' : '选择后自动切到深色模式'}
                  </span>
                </h3>
                <div className={styles.grid}>
                  {darkPresets.map((p) => renderCard(p, pickDark, true))}
                </div>
              </div>
            </>
          )}

          {tab === 'theme' && (
            <>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>主题色</h2>
                <span className={styles.sectionDesc}>按钮、链接、选区高亮都会跟着变</span>
              </div>
              <div className={styles.swatchGrid}>
                {THEME_PRESETS.map((preset) => {
                  const active = theme === preset.id;
                  const label = preset.id === BLACK_THEME_ID ? '深色' : preset.name;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      className={`${styles.themeCard} ${active ? styles.themeCardActive : ''}`}
                      onClick={() => setTheme(preset.id)}
                      aria-pressed={active}
                    >
                      <span className={styles.themeDot} style={{ backgroundColor: preset.color }} />
                      <span className={styles.themeName}>{label}</span>
                      {active && <span className={styles.themeCheck}>✓</span>}
                    </button>
                  );
                })}
              </div>
              <p className={styles.hint}>
                当前主题色 <code style={{ color: themeColor }}>{themeColor}</code>
                {isDarkMode && '　·　深色模式下壁纸取自「暗黑背景」'}
              </p>
            </>
          )}

          {tab === 'font' && (
            <>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>正文字体</h2>
                <span className={styles.sectionDesc}>只影响编辑器正文，界面 UI 保持系统字体</span>
              </div>
              <div className={styles.optionList}>
                {FONT_LIST.map((font) => {
                  const active = currentFontId === font.id;
                  const isDefault = font.id === DEFAULT_FONT_ID;
                  const label = isDefault
                    ? FONT_LABELS.default
                    : t(`fontSwitcher.names.${font.id}`, {
                        defaultValue: FONT_LABELS[font.id] || font.id,
                      });
                  return (
                    <button
                      key={font.id}
                      type="button"
                      className={`${styles.optionRow} ${active ? styles.optionRowActive : ''}`}
                      onClick={() => handleFontClick(font.id)}
                      aria-pressed={active}
                    >
                      <span
                        className={styles.optionPreview}
                        style={{ fontFamily: isDefault ? undefined : font.family }}
                      >
                        永
                      </span>
                      <span
                        className={styles.optionText}
                        style={{ fontFamily: isDefault ? undefined : font.family }}
                      >
                        {label}
                      </span>
                      {font.category === 'web' && <span className={styles.tag}>Web</span>}
                      {active && <span className={styles.optionCheck}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {tab === 'cursor' && (
            <>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>光标</h2>
                <span className={styles.sectionDesc}>箭头会跟着主题色走</span>
              </div>
              <div className={styles.optionList}>
                {CURSOR_THEMES.map((item) => {
                  const active = item.id === cursorTheme;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.optionRow} ${active ? styles.optionRowActive : ''}`}
                      onClick={() => setCursorTheme(item.id)}
                      aria-pressed={active}
                    >
                      <span className={styles.optionPreview}>{item.badge}</span>
                      <span className={styles.optionCol}>
                        <span className={styles.optionText}>
                          {t(`cursorThemes.${item.id}.name`, { defaultValue: item.name })}
                        </span>
                        {item.desc && <span className={styles.optionDesc}>{item.desc}</span>}
                      </span>
                      {active && <span className={styles.optionCheck}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {tab === 'language' && (
            <>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>界面语言</h2>
                <span className={styles.sectionDesc}>共 7 种语言，切换后立即生效</span>
              </div>
              <div className={styles.langGrid}>
                {SUPPORTED_LANGUAGES.map((code: AppLanguage) => {
                  const active = language === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      className={`${styles.langCard} ${active ? styles.langCardActive : ''}`}
                      onClick={() => setLanguage(code)}
                      aria-pressed={active}
                    >
                      <span className={styles.langShort}>{LANGUAGE_SHORT[code]}</span>
                      <span className={styles.langName}>{t(`languages.${code}`)}</span>
                      {active && <span className={styles.langCheck}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {tab === 'mode' && (
            <>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>阅读模式</h2>
                <span className={styles.sectionDesc}>对编辑器文档页生效，随时可切回</span>
              </div>
              <div className={styles.modeCards}>
                <button
                  type="button"
                  className={`${styles.modeCard} ${mode === 'edit' ? styles.modeCardActive : ''}`}
                  onClick={() => setMode('edit')}
                  aria-pressed={mode === 'edit'}
                >
                  <span className={styles.modeCardTitle}>编辑</span>
                  <span className={styles.modeCardDesc}>
                    工具栏、块拖拽、悬浮菜单全部可用，适合写作与排版
                  </span>
                </button>
                <button
                  type="button"
                  className={`${styles.modeCard} ${mode === 'read' ? styles.modeCardActive : ''}`}
                  onClick={() => setMode('read')}
                  aria-pressed={mode === 'read'}
                >
                  <span className={styles.modeCardTitle}>只读</span>
                  <span className={styles.modeCardDesc}>
                    隐藏编辑入口，专注阅读，正文仍可选中复制
                  </span>
                </button>
              </div>
            </>
          )}

          {tab === 'maintenance' && (
            <>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>资源维护</h2>
                <span className={styles.sectionDesc}>
                  清理已删除文档遗留的图片 / 视频 / 画板 / 评论
                </span>
              </div>

              <p className={styles.maintNotice}>
                仅删除「没有任何文档引用」的文件；正文、分类标签和索引库都不受影响。
                为避免误删待恢复文档的资源，<b>回收站必须为空</b>才允许清理，且需要二次确认。
              </p>

              <div className={styles.maintStats}>
                <div className={styles.maintStat}>
                  <b>{inspection ? inspection.trashCount : '—'}</b>
                  <span>回收站文件</span>
                </div>
                <div className={styles.maintStat}>
                  <b>{inspection ? inspection.orphanMedia.length : '—'}</b>
                  <span>无引用媒体</span>
                </div>
                <div className={styles.maintStat}>
                  <b>{inspection ? inspection.orphanComments.length : '—'}</b>
                  <span>无引用评论</span>
                </div>
                <div className={styles.maintStat}>
                  <b>{inspection ? formatBytes(inspection.totalBytes) : '—'}</b>
                  <span>可释放空间</span>
                </div>
              </div>

              <div className={styles.maintActions}>
                <button
                  type="button"
                  className={styles.maintBtn}
                  onClick={() => void scanOrphans()}
                  disabled={scanning || cleaning}
                >
                  {scanning ? '扫描中…' : '重新扫描'}
                </button>
                <button
                  type="button"
                  className={styles.maintDanger}
                  onClick={() => {
                    setConfirming(true);
                    setCleanupMsg(null);
                    setCleanupError(null);
                  }}
                  disabled={!inspection || !inspection.canCleanup || orphanTotal === 0 || cleaning}
                >
                  清理无引用资源
                </button>
              </div>

              {inspection && !inspection.canCleanup && (
                <p className={styles.maintHint}>
                  回收站里还有 {inspection.trashCount} 个文件，请先在回收站里恢复或清空后再清理。
                </p>
              )}
              {inspection && inspection.canCleanup && orphanTotal === 0 && (
                <p className={styles.maintHint}>当前没有可清理的资源，磁盘很干净。</p>
              )}

              {confirming && inspection && (
                <div className={styles.maintConfirm}>
                  <p>
                    将永久删除 <b>{inspection.orphanMedia.length}</b> 个媒体文件、
                    <b>{inspection.orphanComments.length}</b> 个评论文件，释放约{' '}
                    <b>{formatBytes(inspection.totalBytes)}</b>。
                  </p>
                  <p className={styles.maintWarn}>此操作不可恢复，确定继续？</p>
                  <div className={styles.maintActions}>
                    <button
                      type="button"
                      className={styles.maintBtn}
                      onClick={() => setConfirming(false)}
                      disabled={cleaning}
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      className={styles.maintDanger}
                      onClick={() => void doCleanup()}
                      disabled={cleaning}
                    >
                      {cleaning ? '清理中…' : '确认清理'}
                    </button>
                  </div>
                </div>
              )}

              {cleanupMsg && <p className={styles.maintOk}>{cleanupMsg}</p>}
              {cleanupError && <p className={styles.maintHint}>{cleanupError}</p>}
            </>
          )}
        </section>
      </div>

      <footer className={styles.foot}>
        <button type="button" className={styles.resetBtn} onClick={resetAll}>
          恢复默认外观
        </button>
        <span className={styles.footNote}>恢复默认：蓝色主题 + 水墨远山背景</span>
      </footer>
    </div>
  );
}
