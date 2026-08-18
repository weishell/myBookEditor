// 流星雨夜空壁纸
// - 深空背景 + 两层星点（含慢速闪烁），复用 firefly-night-sky 的星空基调但更冷更深
// - 流星：光迹是旋转 45° 的细长渐变条（头部亮、尾部渐隐），沿自身轴向斜向划过；
//   速度 = 行程 / 可见窗口（固定为周期的 12%）：短周期 + 小行程 = 快碎流星，
//   长周期 + 大行程 = 缓扫大流星
// - 纯 CSS 动画，无 JS 计时器；流星大部分时间处于隐藏段，避免满屏乱飞
import { useMemo } from 'react';
import styles from './meteor-night-sky.module.less';

interface MeteorConfig {
  /** 轨迹起点（视口百分比），位于画面上半区域 */
  top: string;
  left: string;
  /** 轨迹长度 px，越长越有“大流星”感 */
  length: number;
  /** 完整周期 = 划过 + 休息 */
  duration: string;
  /** 错峰延迟，避免同屏出现 */
  delay: string;
  /** 头部尺寸 px */
  size: number;
  /** 单次划过距离 vmin：越大行程越长 */
  travel: number;
}

const METEORS: MeteorConfig[] = [
  // 常规节奏：周期 9-13s，可见飞行约 1.1-1.6s
  { top: '6%', left: '12%', length: 150, duration: '9s', delay: '0.5s', size: 3, travel: 62 },
  { top: '10%', left: '46%', length: 180, duration: '11s', delay: '3.2s', size: 3.5, travel: 62 },
  { top: '4%', left: '70%', length: 130, duration: '10s', delay: '6s', size: 2.5, travel: 62 },
  { top: '16%', left: '28%', length: 200, duration: '12s', delay: '8.5s', size: 4, travel: 62 },
  { top: '8%', left: '86%', length: 150, duration: '10.5s', delay: '4.8s', size: 3, travel: 62 },
  { top: '22%', left: '60%', length: 120, duration: '11.5s', delay: '11s', size: 2.5, travel: 62 },
  { top: '13%', left: '4%', length: 160, duration: '13s', delay: '7.4s', size: 3, travel: 62 },
  // 快流星：周期 4.5-5.5s + 小行程，可见飞行仅约 0.3s，嘟一下划过
  { top: '3%', left: '34%', length: 90, duration: '5s', delay: '2.1s', size: 2, travel: 42 },
  { top: '18%', left: '76%', length: 80, duration: '4.5s', delay: '9.6s', size: 2, travel: 40 },
  { top: '9%', left: '56%', length: 100, duration: '5.5s', delay: '13.8s', size: 2.2, travel: 46 },
  { top: '26%', left: '16%', length: 85, duration: '4.8s', delay: '6.9s', size: 2, travel: 38 },
  // 慢流星：周期 21-23s + 大行程，可见飞行约 2.6s，缓缓扫过大半个天空
  { top: '2%', left: '22%', length: 240, duration: '21s', delay: '12.6s', size: 4.5, travel: 92 },
  { top: '6%', left: '64%', length: 220, duration: '23s', delay: '17s', size: 4, travel: 86 },
];

export default function MeteorNightSky() {
  const meteors = useMemo(
    () =>
      METEORS.map((m, i) => (
        <span
          key={i}
          className={styles.meteor}
          style={
            {
              '--meteor-top': m.top,
              '--meteor-left': m.left,
              '--meteor-length': `${m.length}px`,
              '--meteor-size': `${m.size}px`,
              '--meteor-duration': m.duration,
              '--meteor-delay': m.delay,
              '--meteor-travel': `${m.travel}vmin`,
            } as React.CSSProperties
          }
        />
      )),
    [],
  );

  return (
    <div className={styles.wallpaper} aria-hidden="true">
      <div className={styles.nebula} />
      <div className={styles.stars} />
      <div className={styles.starsFar} />
      {meteors}
    </div>
  );
}
