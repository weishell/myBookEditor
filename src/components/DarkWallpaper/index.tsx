import { useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from './DarkWallpaper.module.less';

const FIREFLIES = [
  // 左上区域（红框 1）
  { top: '6%', left: '8%', size: 5, delay: '0.2s', duration: '6.2s' },
  { top: '10%', left: '14%', size: 4, delay: '1.6s', duration: '5.7s' },
  // 顶部中部
  { top: '14%', left: '18%', size: 6, delay: '0s', duration: '5.8s' },
  { top: '20%', left: '72%', size: 5, delay: '0.8s', duration: '6.4s' },
  { top: '28%', left: '62%', size: 4, delay: '1.3s', duration: '5.2s' },
  // 右侧中部
  { top: '36%', left: '88%', size: 5, delay: '2.4s', duration: '6.0s' },
  { top: '38%', left: '22%', size: 5, delay: '2.1s', duration: '6.8s' },
  { top: '44%', left: '78%', size: 6, delay: '1.7s', duration: '5.9s' },
  { top: '52%', left: '12%', size: 4, delay: '2.8s', duration: '6.2s' },
  { top: '58%', left: '68%', size: 5, delay: '0.4s', duration: '5.5s' },
  { top: '66%', left: '30%', size: 6, delay: '1.9s', duration: '6.9s' },
  // 右下区域（红框 4）
  { top: '63%', left: '90%', size: 5, delay: '0.6s', duration: '6.3s' },
  { top: '70%', left: '93%', size: 6, delay: '2.2s', duration: '5.6s' },
  { top: '70%', left: '82%', size: 4, delay: '2.5s', duration: '5.6s' },
  // 中下艺术字下方（红框 3）
  { top: '82%', left: '40%', size: 6, delay: '1.0s', duration: '6.1s' },
  { top: '86%', left: '50%', size: 5, delay: '2.0s', duration: '5.9s' },
  { top: '90%', left: '60%', size: 4, delay: '0.9s', duration: '6.5s' },
  // 左下区域（红框 2）
  { top: '78%', left: '5%', size: 6, delay: '1.4s', duration: '6.7s' },
  { top: '86%', left: '10%', size: 5, delay: '2.7s', duration: '5.8s' },
  { top: '92%', left: '6%', size: 4, delay: '1.2s', duration: '6.4s' },
  { top: '78%', left: '54%', size: 5, delay: '1.1s', duration: '6.1s' },
];

export default function DarkWallpaper() {
  const { isDarkMode } = useTheme();

  const fireflies = useMemo(
    () =>
      FIREFLIES.map((item, index) => (
        <span
          key={index}
          className={styles.firefly}
          style={
            {
              '--firefly-top': item.top,
              '--firefly-left': item.left,
              '--firefly-size': `${item.size}px`,
              '--firefly-delay': item.delay,
              '--firefly-duration': item.duration,
            } as React.CSSProperties
          }
        />
      )),
    [],
  );

  if (!isDarkMode) {
    return null;
  }

  return (
    <div className={styles.wallpaper} aria-hidden="true">
      <div className={styles.skyGlow} />
      <div className={styles.moonHalo} />
      <div className={styles.moon} />
      <div className={styles.hillBack} />
      <div className={styles.hillFront} />
      {fireflies}
    </div>
  );
}
