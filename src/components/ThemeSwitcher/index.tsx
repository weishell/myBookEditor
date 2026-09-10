import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useTheme, THEME_PRESETS, type ThemeId } from '@/context/ThemeContext';
import {
  getWallpaperById,
  getWallpapersByMode,
  WALLPAPER_NONE_ID,
  type WallpaperPreset,
} from '@/components/wallpapers';
import styles from './ThemeSwitcher.module.less';

const BLACK_THEME_ID: ThemeId = 'black';

/** 预览卡片 */
function WallpaperThumb({
  preset,
  mode = 'dark',
}: {
  preset: WallpaperPreset;
  mode?: 'dark' | 'light';
}) {
  if (preset.id === WALLPAPER_NONE_ID) {
    return (
      <div
        className={styles.thumbInner}
        style={{
          background:
            mode === 'light'
              ? 'linear-gradient(180deg, #f5f7fb 0%, #e9eef5 100%)'
              : 'linear-gradient(180deg, #080b13 0%, #121721 100%)',
          color: mode === 'light' ? '#8a94a6' : '#9ca3af',
          fontSize: 11,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        无壁纸
      </div>
    );
  }
  // 浅色壁纸：注册表直接给 thumbCss，通用渲染
  if (preset.thumbCss) {
    return <div className={styles.thumbInner} style={{ background: preset.thumbCss }} />;
  }
  if (preset.kind === 'image' && preset.imageUrl) {
    return (
      <div
        className={styles.thumbInner}
        style={{
          backgroundImage: `url(${preset.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* 与 WallpaperHost 保持一致：缩略图也叠柔化遮罩，预览即实际效果 */}
        {preset.veil && <div style={{ position: 'absolute', inset: 0, background: preset.veil }} />}
      </div>
    );
  }
  if (preset.kind === 'svg' && preset.id === 'firefly-night-sky') {
    return (
      <div
        className={styles.thumbInner}
        style={{
          background:
            'radial-gradient(circle at 70% 22%, rgba(250,240,205,0.16), transparent 22%),' +
            'linear-gradient(180deg, #020617 0%, #07101f 50%, #050912 100%)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 暖象牙月亮：径向渐变 + 右下暗部界线（对齐主壁纸 SVG 效果） */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 14,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 34% 30%, #faf3dc 0%, #f0e2b6 42%, #d8c28e 74%, #a8946a 100%)',
            boxShadow:
              'inset -4px -3px 7px -2px rgba(11,19,36,0.6), 0 0 7px rgba(253,230,138,0.28)',
          }}
        />
        {[
          { t: '55%', l: '18%' },
          { t: '70%', l: '60%' },
          { t: '40%', l: '48%' },
          { t: '82%', l: '28%' },
        ].map((p, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: p.t,
              left: p.l,
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: '#fde047',
              boxShadow: '0 0 4px rgba(253,224,71,0.9)',
            }}
          />
        ))}
      </div>
    );
  }
  if (preset.kind === 'svg' && preset.id === 'meteor-night-sky') {
    return (
      <div
        className={styles.thumbInner}
        style={{
          background:
            'radial-gradient(ellipse 40% 30% at 24% 18%, rgba(129,140,248,0.14), transparent 70%),' +
            'radial-gradient(ellipse 36% 26% at 80% 12%, rgba(56,189,248,0.12), transparent 70%),' +
            'linear-gradient(180deg, #010409 0%, #050d1c 55%, #03060e 100%)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 大颗慢流星：长光迹 + 亮头，斜向右下 */}
        <div
          style={{
            position: 'absolute',
            top: '16%',
            left: '14%',
            width: 46,
            height: 2,
            borderRadius: 2,
            transform: 'rotate(45deg)',
            transformOrigin: '0 50%',
            background:
              'linear-gradient(to right, transparent, rgba(191,219,254,0.5) 70%, rgba(240,247,255,0.95))',
          }}
        >
          <span
            style={{
              position: 'absolute',
              right: -2,
              top: '50%',
              width: 4,
              height: 4,
              transform: 'translateY(-50%)',
              borderRadius: '50%',
              background: '#f0f7ff',
              boxShadow: '0 0 5px 1px rgba(186,220,255,0.9), 0 0 10px 3px rgba(125,180,255,0.4)',
            }}
          />
        </div>
        {/* 快碎流星：短光迹，另一条斜线位置 */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '62%',
            width: 24,
            height: 1.5,
            borderRadius: 2,
            transform: 'rotate(45deg)',
            transformOrigin: '0 50%',
            background:
              'linear-gradient(to right, transparent, rgba(191,219,254,0.4) 65%, rgba(240,247,255,0.85))',
          }}
        >
          <span
            style={{
              position: 'absolute',
              right: -1.5,
              top: '50%',
              width: 3,
              height: 3,
              transform: 'translateY(-50%)',
              borderRadius: '50%',
              background: '#f0f7ff',
              boxShadow: '0 0 4px 1px rgba(186,220,255,0.85)',
            }}
          />
        </div>
        {/* 零星点缀 */}
        {[
          { t: '30%', l: '40%' },
          { t: '58%', l: '22%' },
          { t: '72%', l: '70%' },
          { t: '48%', l: '86%' },
        ].map((p, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: p.t,
              left: p.l,
              width: 2,
              height: 2,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.85)',
              boxShadow: '0 0 3px rgba(255,255,255,0.6)',
            }}
          />
        ))}
      </div>
    );
  }
  if (preset.kind === 'svg' && preset.id === 'warm-hearth') {
    return (
      <div
        className={styles.thumbInner}
        style={{
          background:
            'radial-gradient(ellipse at 68% 72%, rgba(251,146,60,0.5), transparent 34%),' +
            'linear-gradient(180deg, #0b0705 0%, #120a08 50%, #0a0605 100%)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 14,
            bottom: 10,
            width: 30,
            height: 32,
            borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
            background:
              'radial-gradient(ellipse at 50% 92%, #fff 0%, #fde047 22%, #fb923c 46%, rgba(248,113,113,0.0) 92%)',
            mixBlendMode: 'screen',
          }}
        />
      </div>
    );
  }
  return (
    <div
      className={styles.thumbInner}
      style={{
        background: '#121721',
        color: '#6b7280',
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      预览
    </div>
  );
}

export default function ThemeSwitcher() {
  const {
    theme,
    themeColor,
    isDarkMode,
    setTheme,
    wallpaper,
    setWallpaper,
    lightWallpaper,
    setLightWallpaper,
  } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wallpaperPopRef = useRef<HTMLDivElement>(null);

  // 壁纸弹框：由底部"壁纸与护眼"入口点击开合（hover 在多行上易互相干扰，改为点击）
  const [wallpaperOpen, setWallpaperOpen] = useState(false);
  const [popPlacement, setPopPlacement] = useState<'bottom' | 'top'>('bottom');

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setWallpaperOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const darkWallpaperName = (() => {
    const w = wallpaper ? getWallpaperById(wallpaper) : undefined;
    return w && w.id !== WALLPAPER_NONE_ID ? w.name : '默认';
  })();
  const lightWallpaperName = (() => {
    const w = lightWallpaper ? getWallpaperById(lightWallpaper) : undefined;
    return w && w.id !== WALLPAPER_NONE_ID ? w.name : '默认';
  })();

  // 两组壁纸都在弹框里列出，点哪组就自动切到对应模式，任何主题下都能直接选
  const lightPresets = getWallpapersByMode('light');
  const darkPresets = getWallpapersByMode('dark');

  const pickLightWallpaper = (id: string) => {
    setLightWallpaper(id);
    if (theme === BLACK_THEME_ID) setTheme('blue');
  };
  const pickDarkWallpaper = (id: string) => {
    setWallpaper(id);
    if (theme !== BLACK_THEME_ID) setTheme(BLACK_THEME_ID);
  };

  // 弹框智能定位：下方空间不够时自动翻转到上方
  useLayoutEffect(() => {
    if (!wallpaperOpen) return;
    const raf = requestAnimationFrame(() => {
      const popEl = wallpaperPopRef.current;
      const hoverEl = popEl?.parentElement as HTMLElement | null;
      if (!popEl || !hoverEl) return;

      const hoverRect = hoverEl.getBoundingClientRect();
      const estimatedHeight = Math.min(popEl.scrollHeight, 480);
      const gap = 6;
      const spaceBelow = window.innerHeight - hoverRect.bottom;
      const spaceAbove = hoverRect.top;

      if (spaceBelow < estimatedHeight + gap && spaceAbove > estimatedHeight + gap) {
        setPopPlacement('top');
        hoverEl.style.setProperty('--bridge-top', '-6px');
      } else {
        setPopPlacement('bottom');
        hoverEl.style.setProperty('--bridge-top', '100%');
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [wallpaperOpen]);

  const renderWallpaperCards = (
    presets: WallpaperPreset[],
    activeId: string,
    onPick: (id: string) => void,
    mode: 'dark' | 'light',
  ) =>
    presets.map((w) => {
      const selected = activeId === w.id;
      return (
        <button
          key={w.id}
          type="button"
          className={`${styles.wallpaperCard} ${selected ? styles.wallpaperCardActive : ''}`}
          onClick={() => onPick(w.id)}
        >
          <div className={styles.thumbBox}>
            <WallpaperThumb preset={w} mode={mode} />
            {selected && <span className={styles.check}>✓</span>}
          </div>
          <div className={styles.wallpaperMeta}>
            <div className={styles.wallpaperName}>{w.name}</div>
            {w.description && <div className={styles.wallpaperDesc}>{w.description}</div>}
          </div>
        </button>
      );
    });

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
              <span className={styles.optionName}>{preset.name}</span>
            </div>
          ))}

          {/* 壁纸 / 护眼统一入口：任何主题下都能点开，两组都列出，点哪组自动切到对应模式 */}
          <div className={styles.divider} />
          <div className={styles.hoverGroup}>
            <div
              className={`${styles.option} ${styles.wallpaperEntry}`}
              onClick={(e) => {
                e.stopPropagation();
                setWallpaperOpen((v) => !v);
              }}
            >
              <span className={styles.optionName}>壁纸与护眼</span>
              <span className={styles.optionBadge}>
                {isDarkMode ? darkWallpaperName : lightWallpaperName}
              </span>
              <span className={styles.caret}>›</span>
            </div>

            {wallpaperOpen && (
              <div
                ref={wallpaperPopRef}
                className={styles.wallpaperPop}
                data-placement={popPlacement}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.wallpaperPopTitle}>柔和护眼（浅色模式）</div>
                <div className={styles.wallpaperGrid}>
                  {renderWallpaperCards(lightPresets, lightWallpaper, pickLightWallpaper, 'light')}
                </div>
                <div className={styles.wallpaperPopTitle}>暗黑壁纸</div>
                <div className={styles.wallpaperGrid}>
                  {renderWallpaperCards(darkPresets, wallpaper, pickDarkWallpaper, 'dark')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
