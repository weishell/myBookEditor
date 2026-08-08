// 统一的壁纸宿主：根据 wallpaperId 渲染不同壁纸
// - 仅在 isDarkMode && wallpaperId !== 'none' 下显示
// - kind='svg'：挂载对应的 React 组件（组件内自带绝对定位 / 样式）
// - kind='image'：用 <div style="background-image: url(...)"> 铺满
import { useTheme } from '@/context/ThemeContext';
import { getWallpaperById, WALLPAPER_NONE_ID } from './index';
import styles from './WallpaperHost.module.less';

export default function WallpaperHost() {
  const { isDarkMode, wallpaper } = useTheme();
  if (!isDarkMode) return null;
  if (!wallpaper || wallpaper === WALLPAPER_NONE_ID) return null;

  const preset = getWallpaperById(wallpaper);
  if (!preset) return null;

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
