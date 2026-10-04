// 画板只读缩略图：把全部图形用 drawui-core 的 renderSVGString 渲染成完整矢量 SVG，
// 再以 <img object-fit:contain> 铺进预览区 —— 整张画板按比例缩小、完整呈现，不失真。
// 相比旧的 canvas Renderer 方案：不再依赖像素自校准与相机换算，矢量边角清晰可读，
// 且不把第三方生成的标记直接插入 DOM（用 data URL 当图片源，规避注入风险）。
import React, { useMemo } from 'react';
import { renderSVGString } from 'drawui-core';
import type { Shape } from 'drawui-core';
import { filterSaneShapes } from './drawboard-fit';
import styles from './Drawboard.module.less';

interface DrawboardPreviewProps {
  shapes: Shape[];
}

/** 内容四周留白（页面坐标），让图形不贴边 */
const PAD = 16;

const DrawboardPreview: React.FC<DrawboardPreviewProps> = ({ shapes }) => {
  const svgSrc = useMemo(() => {
    const used = filterSaneShapes(shapes);
    if (!used || used.length === 0) return null;
    try {
      const markup = renderSVGString(used, { padding: PAD, background: '#ffffff' });
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
    } catch (err) {
      // 渲染失败时缩略图会空白，必须留下可见线索
      console.warn('[drawboard-preview] renderSVGString failed', err);
      return null;
    }
  }, [shapes]);

  if (!svgSrc) return null;

  return (
    <div className={styles.previewSvgWrap}>
      <img className={styles.previewSvgImg} src={svgSrc} alt="" draggable={false} />
    </div>
  );
};

export default DrawboardPreview;
