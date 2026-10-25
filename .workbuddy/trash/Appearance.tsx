// 外观与背景设置（独立路由 /appearance）
//
// 为什么单独开一页而不是继续塞在顶栏下拉里：
// - 背景靠"看"来选，下拉列表只能显示文字名，选完才知道效果，来回试很累
// - 这里做成整页画廊，每张卡都是缩略预览，点击即时生效，整页本身就是预览
// - 顶栏齿轮只保留一个入口跳过来，避免两套壁纸列表各维护一份而逐渐不一致
import { useMemo, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useTheme, THEME_PRESETS, type ThemeId } from '@/context/ThemeContext';
import {
  WALLPAPER_NONE_ID,
  getWallpapersByMode,
  type WallpaperPreset,
} from '@/components/wallpapers';
import styles from './Appearance.module.less';

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

export default function Appearance() {
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
              会以卡片为参照系自适应尺寸，所以缩略图和实际效果一模一样，
              比另写一套 CSS 近似色块可靠得多 */}
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
        <div>
          <Link to="/" className={styles.backLink}>
            ← 返回首页
          </Link>
          <h1 className={styles.title}>外观与背景</h1>
          <p className={styles.subtitle}>
            点一下即时生效，这一页本身就是预览。选择会记在本机浏览器里，下次打开还是它。
          </p>
        </div>
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
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>主题色</h2>
        <span className={styles.sectionDesc}>按钮、链接、选区高亮都会跟着变</span>
        <div className={styles.swatches}>
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`${styles.swatch} ${theme === preset.id ? styles.swatchActive : ''}`}
              style={{ backgroundColor: preset.color, '--sw-color': preset.color } as CSSProperties}
              onClick={() => setTheme(preset.id)}
              title={preset.id === BLACK_THEME_ID ? '深色' : preset.name}
              aria-label={preset.id === BLACK_THEME_ID ? '深色' : preset.name}
              aria-pressed={theme === preset.id}
            />
          ))}
        </div>
        <p className={styles.hint}>
          当前主题色 <code style={{ color: themeColor }}>{themeColor}</code>
          {isDarkMode && '　·　深色模式下壁纸取自「暗黑背景」'}
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>背景</h2>
        <span className={styles.sectionDesc}>全部由代码绘制，不加载图片，切换无闪烁</span>

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
            <div className={styles.grid}>{group.items.map((p) => renderCard(p, pickLight))}</div>
          </div>
        ))}

        <div className={styles.group}>
          <h3 className={styles.groupTitle}>
            暗黑背景
            <span className={styles.groupNote}>
              {isDarkMode ? '当前生效' : '选择后自动切到深色模式'}
            </span>
          </h3>
          <div className={styles.grid}>{darkPresets.map((p) => renderCard(p, pickDark, true))}</div>
        </div>
      </section>

      <footer className={styles.foot}>
        <button type="button" className={styles.resetBtn} onClick={resetAll}>
          恢复默认外观
        </button>
        <span className={styles.footNote}>恢复默认：蓝色主题 + 水墨远山背景</span>
      </footer>
    </div>
  );
}
