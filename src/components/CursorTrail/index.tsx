// 火焰尾迹（CursorTrail）
//
// 仅当光标主题为"黄色火焰"时启用：鼠标移动时会从光标后方
// 拖出一串黄焰渐隐的尾焰粒子（canvas 全屏覆盖，pointer-events:none 不拦截鼠标，
// z-index 极高使其如光标一般浮于所有内容之上）。
import { useEffect, useRef } from 'react';
import { useCursor, FLAME_TRAIL_THEMES } from '@/context/CursorContext';

const MAX_FLAMES = 170;

interface Flame {
  x: number;
  y: number;
  vx: number;
  vy: number;
  birth: number;
  life: number;
  size: number;
  seed: number;
  hue: number;
}

export default function CursorTrail() {
  const { cursorTheme } = useCursor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = FLAME_TRAIL_THEMES.includes(cursorTheme);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();

    const flames: Flame[] = [];
    let lastX = -1;
    let lastY = -1;
    let lastTime = 0;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const vx = lastX < 0 ? 0 : e.clientX - lastX;
      const vy = lastY < 0 ? 0 : e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;

      const speed = Math.hypot(vx, vy);
      if (speed < 2 || dt > 80) return;
      const nvx = vx / speed;
      const nvy = vy / speed;

      // 在光标后方（运动反方向）喷出一粒尾焰
      const back = (6 + Math.min(speed * 0.5, 14)) * dpr;
      const flame: Flame = {
        x: e.clientX * dpr - nvx * back + (Math.random() - 0.5) * 4 * dpr,
        y: e.clientY * dpr - nvy * back + (Math.random() - 0.5) * 4 * dpr,
        vx: -nvx * (0.25 + Math.random() * 0.25),
        vy: -nvy * (0.25 + Math.random() * 0.25),
        birth: now,
        life: 360 + Math.random() * 180,
        size: (3.2 + Math.random() * 2.6) * dpr,
        seed: Math.random() * Math.PI * 2,
        hue: Math.random() * 18 - 6,
      };
      if (flames.length >= MAX_FLAMES) flames.shift();
      flames.push(flame);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf = 0;
    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = flames.length - 1; i >= 0; i--) {
        const f = flames[i];
        const age = now - f.birth;
        if (age >= f.life) {
          flames.splice(i, 1);
          continue;
        }
        const t = age / f.life;
        f.x += f.vx * dpr;
        f.y += f.vy * dpr;

        const r = Math.max(
          f.size * (1 - t * 0.85) * (0.8 + 0.35 * Math.sin(now * 0.03 + f.seed)),
          0.5,
        );
        const alpha = (1 - t) * 0.95;
        const hue = 48 + f.hue;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        grad.addColorStop(0, `rgba(255,250,225,${alpha})`);
        grad.addColorStop(0.4, `hsla(${hue},100%,60%,${alpha * 0.8})`);
        grad.addColorStop(1, 'rgba(255,175,0,0)');
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2147482000,
        display: active ? 'block' : 'none',
      }}
    />
  );
}
