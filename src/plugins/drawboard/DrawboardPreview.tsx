// 画板只读缩略图：优先用 drawui-core 的 renderToCanvas 出图。
// 为什么不再走 renderSVGString：SVG 导出与编辑器 CanvasBoard 是两条独立绘制链路
// （圆角/折线路由、箭头端点计算并不完全一致），缩略图会和编辑态看到的图形有差异。
// renderToCanvas 内部用的就是编辑器同一个 Renderer，出图 = 编辑态所见，天然一致；
// 内容按包围盒自适应铺满，整张画板按比例缩小、完整呈现。
import React, { useMemo } from 'react';
import { getContentBounds, renderToCanvas, renderSVGString } from 'drawui-core';
import type { Shape } from 'drawui-core';
import { filterSaneShapes } from './drawboard-fit';
import styles from './Drawboard.module.less';

interface DrawboardPreviewProps {
  shapes: Shape[];
}

/** 内容四周留白（页面坐标），让图形不贴边 */
const PAD = 16;
/** 位图倍率：2 倍足够在卡片尺寸下保持清晰 */
const SCALE = 2;

/**
 * renderToCanvas 内部按 DPR 把画布再放大了一次（canvas 像素 = 内容 × scale × dpr），
 * 但相机 zoom 仍是 1，图形只画在左上角 1/scale² 区域，右侧/下方留下大片空白。
 * 这里按「期望像素尺寸」把有效区域裁出来，缩略图才能真正铺满卡片。
 */
function renderPreviewCanvas(shapes: Shape[]): HTMLCanvasElement {
  const bounds = getContentBounds(shapes, PAD);
  const source = renderToCanvas(shapes, { padding: PAD, scale: SCALE, background: '#ffffff' });
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
    const used = filterSaneShapes(shapes);
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
