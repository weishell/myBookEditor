// 画板缩略图：用 drawui-core 的 Renderer 把 Shape[] 直接绘制到 canvas，
// 在文档卡片内"回显"图形，无需挂载完整可交互编辑器（一个页面可有多个画板，避免性能问题）。
import React, { useEffect, useRef } from 'react';
import { Renderer, Camera } from 'drawui-core';
import type { Shape } from 'drawui-core';
import styles from './Drawboard.module.less';

interface DrawboardPreviewProps {
  shapes: Shape[];
}

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// 计算所有图形的包围盒，用于把内容自适应缩放进缩略图
function getBounds(shapes: Shape[]): Bounds {
  const b: Bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (const s of shapes as Array<Record<string, any>>) {
    const pts = s.points as Array<{ x: number; y: number }> | undefined;
    if (Array.isArray(pts) && pts.length) {
      for (const p of pts) {
        b.minX = Math.min(b.minX, p.x);
        b.minY = Math.min(b.minY, p.y);
        b.maxX = Math.max(b.maxX, p.x);
        b.maxY = Math.max(b.maxY, p.y);
      }
    } else if (typeof s.width === 'number' && typeof s.height === 'number') {
      b.minX = Math.min(b.minX, s.x);
      b.minY = Math.min(b.minY, s.y);
      b.maxX = Math.max(b.maxX, s.x + s.width);
      b.maxY = Math.max(b.maxY, s.y + s.height);
    } else if (typeof s.radius === 'number') {
      b.minX = Math.min(b.minX, s.x);
      b.minY = Math.min(b.minY, s.y);
      b.maxX = Math.max(b.maxX, s.x + 2 * s.radius);
      b.maxY = Math.max(b.maxY, s.y + 2 * s.radius);
    } else {
      b.minX = Math.min(b.minX, s.x);
      b.minY = Math.min(b.minY, s.y);
      b.maxX = Math.max(b.maxX, s.x + 40);
      b.maxY = Math.max(b.maxY, s.y + 40);
    }
  }
  return b;
}

const DrawboardPreview: React.FC<DrawboardPreviewProps> = ({ shapes }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    if (!rendererRef.current) {
      try {
        rendererRef.current = new Renderer(canvas);
      } catch {
        return;
      }
    }

    const draw = () => {
      const renderer = rendererRef.current;
      if (!renderer) return;
      const W = wrap.clientWidth || 240;
      const H = wrap.clientHeight || 160;
      if (W <= 0 || H <= 0) return;

      const b = getBounds(shapes);
      if (!isFinite(b.minX) || !isFinite(b.maxX)) return;

      const bw = Math.max(b.maxX - b.minX, 1);
      const bh = Math.max(b.maxY - b.minY, 1);
      const pad = 14;
      const zoom = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh);

      const cam = new Camera();
      cam.zoom = zoom;
      // 屏幕 = zoom * (page + cameraOffset)，令内容中心映射到画布中心
      cam.x = W / (2 * zoom) - (b.minX + b.maxX) / 2;
      cam.y = H / (2 * zoom) - (b.minY + b.maxY) / 2;

      renderer.resize(W, H);
      renderer.setShowGrid(false);
      try {
        renderer.render(shapes as any, cam, new Set<string>());
      } catch {
        /* 渲染异常不影响文档其它部分 */
      }
    };

    draw();
    // 容器尺寸变化时重绘
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [shapes]);

  return (
    <div ref={wrapRef} className={styles.previewCanvasWrap}>
      <canvas ref={canvasRef} className={styles.previewCanvas} />
    </div>
  );
};

export default DrawboardPreview;
