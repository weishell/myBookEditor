import { useState, useEffect, useCallback, useRef } from 'react';
import { BACK_TO_TOP_THRESHOLD } from '@/enums';
import styles from './BackToTop.module.less';

const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const SCROLL_DURATION = 600;

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > BACK_TO_TOP_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    if (scrolling) return;
    setScrolling(true);

    const startTime = performance.now();
    const startScrollY = window.scrollY;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);
      const eased = easeInOutCubic(progress);
      const currentY = startScrollY * (1 - eased);

      window.scrollTo(0, currentY);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setScrolling(false);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [scrolling]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <button
      className={`${styles.button} ${visible ? styles.visible : ''} ${scrolling ? styles.scrolling : ''}`}
      onClick={scrollToTop}
      aria-label="回到顶部"
      title="熊猫送你上天～"
    >
      <svg className={styles.panda} width="48" height="48" viewBox="0 0 100 100" fill="none">
        {/* 左耳 - 黑色圆耳朵 */}
        <circle cx="22" cy="22" r="13" fill="currentColor" />
        <circle cx="22" cy="22" r="9" fill="#3d3d3d" />
        {/* 右耳 - 黑色圆耳朵 */}
        <circle cx="78" cy="22" r="13" fill="currentColor" />
        <circle cx="78" cy="22" r="9" fill="#3d3d3d" />

        {/* 白色大圆脸 */}
        <ellipse cx="50" cy="55" rx="30" ry="28" fill="#fff" />

        {/* 左眼黑眼圈 */}
        <ellipse
          cx="36"
          cy="50"
          rx="10"
          ry="12"
          fill="currentColor"
          transform="rotate(-15 36 50)"
        />
        {/* 右眼黑眼圈 */}
        <ellipse cx="64" cy="50" rx="10" ry="12" fill="currentColor" transform="rotate(15 64 50)" />

        {/* 左眼白 */}
        <ellipse cx="36" cy="52" rx="5" ry="6" fill="#fff" transform="rotate(-15 36 52)" />
        {/* 右眼白 */}
        <ellipse cx="64" cy="52" rx="5" ry="6" fill="#fff" transform="rotate(15 64 52)" />

        {/* 左眼瞳孔 */}
        <ellipse
          className={styles.pupilLeft}
          cx="37"
          cy="52"
          rx="2.5"
          ry="3.5"
          fill="#2c2c2c"
          transform="rotate(-15 37 52)"
        />
        {/* 右眼瞳孔 */}
        <ellipse
          className={styles.pupilRight}
          cx="63"
          cy="52"
          rx="2.5"
          ry="3.5"
          fill="#2c2c2c"
          transform="rotate(15 63 52)"
        />

        {/* 左眼高光 */}
        <circle cx="38" cy="50.5" r="1.2" fill="#fff" />
        {/* 右眼高光 */}
        <circle cx="64" cy="50.5" r="1.2" fill="#fff" />

        {/* 小鼻子 */}
        <ellipse cx="50" cy="63" rx="4" ry="3" fill="#3d3d3d" />

        {/* 嘴巴 */}
        <path d="M50 66L45 72" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path
          d="M45 72Q42 75 40 73"
          stroke="#3d3d3d"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M50 66L55 72" stroke="#3d3d3d" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path
          d="M55 72Q58 75 60 73"
          stroke="#3d3d3d"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* 腮红 - 左 */}
        <ellipse cx="26" cy="62" rx="4" ry="2.5" fill="#ffb3c6" opacity="0.6" />
        {/* 腮红 - 右 */}
        <ellipse cx="74" cy="62" rx="4" ry="2.5" fill="#ffb3c6" opacity="0.6" />
      </svg>
    </button>
  );
}
