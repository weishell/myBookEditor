// 统一的壁纸宿主：根据当前模式（暗黑/浅色）与选中的壁纸渲染
// - 暗黑模式 → 渲染 mode='dark' 的壁纸（旧字段 wallpaper）
// - 浅色模式 → 渲染 mode='light' 的壁纸（lightWallpaper）
// - kind='svg'：挂载对应的 React 组件（组件内自带绝对定位 / 样式）
// - kind='image'：用 <div style="background-image: url(...)"> 铺满
// - 浅色壁纸额外把 tint/paper 写入 CSS 变量 --lw-tint / --lw-paper，供容器/纸面染色
import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getWallpaperById, WALLPAPER_NONE_ID } from './index';
import styles from './WallpaperHost.module.less';

export default function WallpaperHost() {
  const { isDarkMode, wallpaper, lightWallpaper } = useTheme();

  const activeId = isDarkMode ? wallpaper : lightWallpaper;
  const preset =
    !activeId || activeId === WALLPAPER_NONE_ID ? undefined : getWallpaperById(activeId);

  // 选中的壁纸必须匹配当前模式，否则视为无壁纸（避免切主题时残留另一侧的壁纸）
  const modeOk = preset ? (isDarkMode ? preset.mode !== 'light' : preset.mode === 'light') : false;

  // 浅色壁纸的染色变量（容器/纸面用）；无有效壁纸时清理
  useEffect(() => {
    const htmlEl = document.documentElement;
    if (!isDarkMode && modeOk && preset?.tint) {
      htmlEl.classList.add('light-wallpaper');
      htmlEl.style.setProperty('--lw-tint', preset.tint);
      htmlEl.style.setProperty('--lw-paper', preset.paper || 'rgba(255,255,255,0.92)');
    } else {
      htmlEl.classList.remove('light-wallpaper');
      htmlEl.style.removeProperty('--lw-tint');
      htmlEl.style.removeProperty('--lw-paper');
    }
  }, [isDarkMode, modeOk, preset?.tint, preset?.paper]);

  if (!preset || !modeOk) return null;

  // SVG/代码绘制型
  if (preset.kind === 'svg' && preset.component) {
    const Comp = preset.component;
    return (
      <div className={styles.host} aria-hidden="true">
        <Comp />
      </div>
    );
  }

  // 图片型
  if (preset.kind === 'image' && preset.imageUrl) {
    return (
      <div
        className={styles.host}
        aria-hidden="true"
        style={{
          backgroundImage: `url(${preset.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    );
  }

  return null;
}
