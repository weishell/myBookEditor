import { useState, useRef, useEffect } from 'react';
import { useTheme, THEME_PRESETS, type ThemeId } from '@/context/ThemeContext';
import {
  WALLPAPER_PRESETS,
  WALLPAPER_NONE_ID,
  getWallpaperById,
  type WallpaperPreset,
} from '@/components/wallpapers';
import styles from './ThemeSwitcher.module.less';

const BLACK_THEME_ID: ThemeId = 'black';

/** 预览卡片 */
function WallpaperThumb({ preset }: { preset: WallpaperPreset }) {
  if (preset.id === WALLPAPER_NONE_ID) {
    return (
      <div
        className={styles.thumbInner}
        style={{
          background: 'linear-gradient(180deg, #080b13 0%, #121721 100%)',
          color: '#9ca3af',
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
  if (preset.kind === 'image' && preset.imageUrl) {
    return (
      <div
        className={styles.thumbInner}
        style={{
          backgroundImage: `url(${preset.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    );
  }
  if (preset.kind === 'svg' && preset.id === 'firefly-night-sky') {
    return (
      <div
        className={styles.thumbInner}
        style={{
          background:
            'radial-gradient(circle at 70% 22%, rgba(255,255,255,0.18), transparent 22%),' +
            'linear-gradient(180deg, #020617 0%, #07101f 50%, #050912 100%)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 14,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.98), rgba(226,232,240,0.78))',
            boxShadow:
              'inset -4px -3px 8px -2px rgba(15,23,42,0.92), 0 0 6px rgba(255,255,255,0.18)',
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
  const { theme, themeColor, setTheme, wallpaper, setWallpaper } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [wallpaperOpen, setWallpaperOpen] = useState(false);

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

  const currentWallpaper = wallpaper ? getWallpaperById(wallpaper) : undefined;
  const currentWallpaperName =
    currentWallpaper?.id === WALLPAPER_NONE_ID ? '默认' : currentWallpaper?.name;

  // 统一的"黑色主题悬浮区"：包含选项 + 壁纸弹框，鼠标离开整块才关
  const hoverGroupEnter = () => setWallpaperOpen(true);
  const hoverGroupLeave = () => setWallpaperOpen(false);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button className={styles.button} onClick={() => setOpen(!open)} title="切换主题">
        <span className={styles.swatch} style={{ backgroundColor: themeColor }} />
        <span>主题</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {THEME_PRESETS.map((preset) => {
            const isBlack = preset.id === BLACK_THEME_ID;
            const isActive = theme === preset.id;

            if (isBlack) {
              // 黑色主题：用 hoverGroup 包住选项和弹框，避免"鼠标移到弹框时选项已离开"
              return (
                <div
                  key={preset.id}
                  className={styles.hoverGroup}
                  onMouseEnter={hoverGroupEnter}
                  onMouseLeave={hoverGroupLeave}
                >
                  <div
                    className={`${styles.option} ${isActive ? styles.optionActive : ''} ${styles.optionIsBlack}`}
                    onClick={() => setTheme(preset.id)}
                  >
                    <span
                      className={styles.optionSwatch}
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className={styles.optionName}>{preset.name}</span>
                    <span className={styles.optionBadge}>
                      壁纸：{currentWallpaperName ?? '默认'}
                    </span>
                    <span className={styles.caret}>›</span>
                  </div>

                  {wallpaperOpen && (
                    <div className={styles.wallpaperPop} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.wallpaperPopTitle}>选择暗黑壁纸</div>
                      <div className={styles.wallpaperGrid}>
                        {WALLPAPER_PRESETS.map((w) => {
                          const selected = wallpaper === w.id;
                          return (
                            <button
                              key={w.id}
                              type="button"
                              className={`${styles.wallpaperCard} ${selected ? styles.wallpaperCardActive : ''}`}
                              onClick={() => {
                                setWallpaper(w.id);
                                if (theme !== BLACK_THEME_ID) setTheme(BLACK_THEME_ID);
                              }}
                            >
                              <div className={styles.thumbBox}>
                                <WallpaperThumb preset={w} />
                                {selected && <span className={styles.check}>✓</span>}
                              </div>
                              <div className={styles.wallpaperMeta}>
                                <div className={styles.wallpaperName}>{w.name}</div>
                                {w.description && (
                                  <div className={styles.wallpaperDesc}>{w.description}</div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // 其他主题：普通选项
            return (
              <div
                key={preset.id}
                className={`${styles.option} ${isActive ? styles.optionActive : ''}`}
                onClick={() => {
                  setTheme(preset.id);
                  setOpen(false);
                }}
              >
                <span className={styles.optionSwatch} style={{ backgroundColor: preset.color }} />
                <span className={styles.optionName}>{preset.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
