// 萤火夜空壁纸（原 DarkWallpaper 重绘版）
// - 月亮：SVG 绘制——银白月面径向渐变 + 明暗界线（terminator）+ 陨石坑细节，
//   取代旧版“金色渐变 + inset 阴影假月缺”的贴片做法
// - 星空：背景里加很多小 radial-gradient 作为星点
// - 山丘 / 萤火虫保留原设计，萤火虫位置写死在组件内
import { useMemo } from 'react';
import styles from './firefly-night-sky.module.less';

const FIREFLIES = [
  // 顶部左上
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
  // 右下
  { top: '63%', left: '90%', size: 5, delay: '0.6s', duration: '6.3s' },
  { top: '70%', left: '93%', size: 6, delay: '2.2s', duration: '5.6s' },
  { top: '70%', left: '82%', size: 4, delay: '2.5s', duration: '5.6s' },
  // 中下
  { top: '82%', left: '40%', size: 6, delay: '1.0s', duration: '6.1s' },
  { top: '86%', left: '50%', size: 5, delay: '2.0s', duration: '5.9s' },
  { top: '90%', left: '60%', size: 4, delay: '0.9s', duration: '6.5s' },
  // 左下
  { top: '78%', left: '5%', size: 6, delay: '1.4s', duration: '6.7s' },
  { top: '86%', left: '10%', size: 5, delay: '2.7s', duration: '5.8s' },
  { top: '92%', left: '6%', size: 4, delay: '1.2s', duration: '6.4s' },
  { top: '78%', left: '54%', size: 5, delay: '1.1s', duration: '6.1s' },
];

export default function FireflyNightSky() {
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

  return (
    <div className={styles.wallpaper} aria-hidden="true">
      <div className={styles.skyGlow} />
      <div className={styles.stars} />
      {/* 月亮：SVG 一次性画出光晕 + 月面 + 明暗界线 + 陨石坑 */}
      <svg className={styles.moonSvg} viewBox="0 0 260 260" aria-hidden="true">
        <defs>
          {/* 月面：暖象牙基底（银白偏黄），亮心偏左上（受光面） */}
          <radialGradient id="moonBody" cx="38%" cy="34%" r="80%">
            <stop offset="0%" stopColor="#faf3dc" />
            <stop offset="40%" stopColor="#f0e2b6" />
            <stop offset="72%" stopColor="#d8c28e" />
            <stop offset="100%" stopColor="#a8946a" />
          </radialGradient>
          {/* 明暗界线：右下方向渐暗，形成凸月观感 */}
          <radialGradient id="moonTerminator" cx="34%" cy="30%" r="90%">
            <stop offset="0%" stopColor="rgba(11, 19, 36, 0)" />
            <stop offset="58%" stopColor="rgba(11, 19, 36, 0)" />
            <stop offset="85%" stopColor="rgba(11, 19, 36, 0.42)" />
            <stop offset="100%" stopColor="rgba(11, 19, 36, 0.6)" />
          </radialGradient>
          {/* 光晕：淡暖白向四周渐隐，外圈带一层浅浅的金调 */}
          <radialGradient id="moonHaloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(250, 240, 205, 0.16)" />
            <stop offset="46%" stopColor="rgba(250, 232, 170, 0.09)" />
            <stop offset="72%" stopColor="rgba(253, 224, 71, 0.05)" />
            <stop offset="100%" stopColor="rgba(250, 240, 205, 0)" />
          </radialGradient>
          <clipPath id="moonClip">
            <circle cx="130" cy="130" r="48" />
          </clipPath>
          <filter id="moonBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>

        <circle cx="130" cy="130" r="118" fill="url(#moonHaloGrad)" />
        <circle cx="130" cy="130" r="48" fill="url(#moonBody)" />

        {/* 陨石坑：只在月面内可见，低对比度 + 轻微模糊，避免画成“圆点贴纸” */}
        <g clipPath="url(#moonClip)" filter="url(#moonBlur)" fill="#8a8163">
          <circle cx="114" cy="112" r="7.5" opacity="0.2" />
          <circle cx="147" cy="141" r="5.5" opacity="0.18" />
          <circle cx="121" cy="151" r="4" opacity="0.16" />
          <circle cx="143" cy="109" r="3.2" opacity="0.15" />
          <circle cx="103" cy="136" r="3" opacity="0.13" />
          <ellipse cx="133" cy="124" rx="6" ry="4.5" opacity="0.1" />
        </g>

        {/* 界线叠加在月面与陨石坑之上，暗部细节同步沉入阴影 */}
        <circle cx="130" cy="130" r="48" fill="url(#moonTerminator)" />
      </svg>
      <div className={styles.hillBack} />
      <div className={styles.hillFront} />
      {fireflies}
    </div>
  );
}
