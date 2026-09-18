// 画板缩略图：
// 1) 有编辑器截图（attrs.snapshot）时直接回显该截图 —— 与全屏编辑器所见完全一致；
// 2) 没有截图（老数据/截图失败）时，用 drawui-core 的 Renderer 把 Shape[] 画到 canvas，
//    适配范围由「像素自校准」得到（见 drawboard-fit.ts），不依赖坐标语义假设。
import React, { useEffect, useRef } from 'react';
import { Renderer } from 'drawui-core';
import type { Shape } from 'drawui-core';
import {
  cameraForRect,
  estimateContentRect,
  filterSaneShapes,
  measureContentRect,
  type Rect,
} from './drawboard-fit';
import styles from './Drawboard.module.less';

interface DrawboardPreviewProps {
  shapes: Shape[];
  /** 编辑器关闭时对主画布的整幅截图（PNG dataURL），存在时优先回显 */
  snapshot?: string;
}

const PAD = 14;

const DrawboardPreview: React.FC<DrawboardPreviewProps> = ({ shapes, snapshot }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  // 测量结果按 shapes 引用缓存：容器 resize 时复用，不重复扫描像素
  const measureRef = useRef<{ shapes: Shape[]; used: Shape[]; rect: Rect | null } | null>(null);

  useEffect(() => {
    if (snapshot) return;
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

      let m = measureRef.current;
      if (!m || m.shapes !== shapes) {
        const used = filterSaneShapes(shapes);
        m = {
          shapes,
          used,
          rect: measureContentRect(used, estimateContentRect(used)),
        };
        measureRef.current = m;
      }
      const rect = m.rect;
      if (!rect) return;

      const cam = cameraForRect(rect, W, H, PAD);
      renderer.resize(W, H);
      renderer.setShowGrid(false);
      try {
        renderer.render(m.used as any, cam, new Set<string>());
      } catch (err) {
        // 不静默吞掉：渲染失败时缩略图会空白，必须留下可见线索
        console.warn('[drawboard-preview] render failed', err);
      }
    };

    draw();
    // 容器尺寸变化时重绘
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [shapes, snapshot]);

  // 编辑器截图优先：所见即所得，不做任何坐标换算
  if (snapshot) {
    return (
      <div className={styles.previewCanvasWrap}>
        <img className={styles.previewImg} src={snapshot} alt="" draggable={false} />
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={styles.previewCanvasWrap}>
      <canvas ref={canvasRef} className={styles.previewCanvas} />
    </div>
  );
};

export default DrawboardPreview;
