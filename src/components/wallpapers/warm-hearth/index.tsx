// 壁炉深夜壁纸（SVG/代码绘制）
// - 右侧墙砖背景 + 内嵌壁炉外框
// - 火焰多层 radial-gradient 模拟跳动
// - 暖色光晕漫射到整个右侧
import styles from './warm-hearth.module.less';

export default function WarmHearth() {
  return (
    <div className={styles.wallpaper} aria-hidden="true">
      {/* 整体环境暖色光 */}
      <div className={styles.roomGlow} />

      {/* 壁炉位置（右下偏中） */}
      <div className={styles.fireplaceWrap}>
        {/* 墙面砖石暗纹 */}
        <div className={styles.bricks} />

        {/* 壁炉外框 */}
        <div className={styles.mantel} />
        <div className={styles.mantelTop} />

        {/* 炉膛内部：炭火 + 柴火 */}
        <div className={styles.firebox}>
          <div className={styles.fire}>
            <span className={styles.flameA} />
            <span className={styles.flameB} />
            <span className={styles.flameC} />
            <span className={styles.embers} />
          </div>
          <div className={styles.logs} />
        </div>
      </div>
    </div>
  );
}
