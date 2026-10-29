// 画板只读缩略图：优先用 drawui-core 的 renderToCanvas 出图。
// 为什么不再走 renderSVGString：SVG 导出与编辑器 CanvasBoard 是两条独立绘制链路
// （圆角/折线路由、箭头端点计算并不完全一致），缩略图会和编辑态看到的图形有差异。
// renderToCanvas 内部用的就是编辑器同一个 Renderer，出图 = 编辑态所见，天然一致。
//
// 性能要点（2026-10 修）：
//  1. 只框「主簇」——被拖到几千像素外的孤立图形不该把包围盒撑大（否则缩略图变成
//     "一堆蚂蚁 + 一片空白"，画布面积还会平方级膨胀）。
//  2. 最长边封顶 MAX_SIDE —— canvas 面积受浏览器上限约束（Chrome 约 16384²，
//     约 2.68 亿像素 / 1GB），超限后 toDataURL 直接返回 `data:,`，图就白了。
//     封顶只降分辨率、不裁内容，卡片 720px 宽 2 倍图完全够用。
import React, { useMemo } from 'react';
import { getContentBounds, renderToCanvas, renderSVGString } from 'drawui-core';
import type { Shape } from 'drawui-core';
import { estimateContentRect, filterSaneShapes } from './drawboard-fit';
import styles from './Drawboard.module.less';

interface DrawboardPreviewProps {
  shapes: Shape[];
}

/** 内容四周留白（页面坐标），让图形不贴边 */
const PAD = 16;
/** 位图倍率：卡片最宽 720px，2 倍足够清晰 */
const SCALE = 2;
/** 输出最长边像素上限（见文件头注释） */
const MAX_SIDE = 1600;

/**
 * 只保留主簇附近的图形。
 * estimateContentRect 内部已做了「聚类 + 挑图形最多的簇」，这里只拿它的框做粗筛：
 * 框外再留 50% 余量，避免把紧贴主簇的图形误伤（也可以规避旋转/粗描边导致的小偏差）。
 */
function keepMainCluster(shapes: Shape[]): Shape[] {
  const main = estimateContentRect(shapes);
  if (!main || !(main.width > 0) || !(main.height > 0)) return shapes;
  const margin = Math.max(main.width, main.height) * 0.5;
  const x0 = main.x - margin;
  const y0 = main.y - margin;
  const x1 = main.x + main.width + margin;
  const y1 = main.y + main.height + margin;

  const kept = shapes.filter((s) => {
    const anyShape = s as unknown as Record<string, unknown>;
    const pts = Array.isArray(anyShape.points)
      ? (anyShape.points as Array<{ x: number; y: number }>)
      : null;
    if (pts && pts.length) {
      return pts.some((p) => p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1);
    }
    const w = Math.abs(Number(anyShape.width) || 0);
    const h = Math.abs(Number(anyShape.height) || 0);
    const x = Number(anyShape.x) || 0;
    const y = Number(anyShape.y) || 0;
    return x + w / 2 >= x0 && x - w / 2 <= x1 && y + h / 2 >= y0 && y - h / 2 <= y1;
  });
  // 极端情况（全都判出去了）就退回原集合，宁可慢也别空白
  return kept.length ? kept : shapes;
}

/**
 * renderToCanvas 按「内容 × scale」出图；maxSize 封顶后不会再有超大画布。
 * 旧版 drawui（< 0.6.0）不认识 maxSize，会忽略它，行为与以前一致（不会报错）。
 */
function renderPreviewCanvas(shapes: Shape[]): HTMLCanvasElement {
  const source = renderToCanvas(shapes, {
    padding: PAD,
    scale: SCALE,
    background: '#ffffff',
    maxSize: MAX_SIDE,
  });
  // 旧版 drawui 的输出带一圈空白（内容只占左上 1/scale），这里裁掉；
  // 新版输出已经铺满，cropW/cropH 会 >= 源尺寸，直接返回 source。
  const bounds = getContentBounds(shapes, PAD);
  const cropW = Math.max(1, Math.ceil(bounds.width) * SCALE);
  const cropH = Math.max(1, Math.ceil(bounds.height) * SCALE);
  if (cropW >= source.width && cropH >= source.height) return source;

  const canvas = document.createElement('canvas');
  canvas.width = Math.min(cropW, source.width);
  canvas.height = Math.min(cropH, source.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) return source;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  return canvas;
}

const DrawboardPreview: React.FC<DrawboardPreviewProps> = ({ shapes }) => {
  const imageSrc = useMemo(() => {
    const used = keepMainCluster(filterSaneShapes(shapes));
    if (!used || used.length === 0) return null;
    try {
      const canvas = renderPreviewCanvas(used);
      return canvas.toDataURL('image/png');
    } catch (err) {
      // 画布渲染失败（极端环境）时退回矢量导出，至少还能显示
      console.warn('[drawboard-preview] renderToCanvas failed, fallback to svg', err);
      try {
        const markup = renderSVGString(used, { padding: PAD, background: '#ffffff' });
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
      } catch (svgErr) {
        console.warn('[drawboard-preview] renderSVGString failed', svgErr);
        return null;
      }
    }
  }, [shapes]);

  if (!imageSrc) return null;

  return (
    <div className={styles.previewSvgWrap}>
      <img className={styles.previewSvgImg} src={imageSrc} alt="" draggable={false} />
    </div>
  );
};

export default DrawboardPreview;
