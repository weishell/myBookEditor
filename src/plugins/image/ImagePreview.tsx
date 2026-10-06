import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { lockPageScroll } from '@/utils/scroll-lock';
import styles from './ImagePreview.module.less';

interface ImagePreviewProps {
  src: string;
  /** 当前裁剪选区在原图坐标系下的偏移和尺寸（未裁剪时都为 0）。用于"所见即所得"。 */
  offsetLeft?: number;
  offsetTop?: number;
  offsetWidth?: number;
  offsetHeight?: number;
  /** 原图的 width / height（保存进 attrs 时的值）。未给则按 offset 推算或退回 0。 */
  naturalWidth?: number;
  naturalHeight?: number;
  onClose: () => void;
}

/** 全屏图片预览（飞书风格）：遮罩 + 滚轮缩放 + 拖拽平移 + Esc/点遮罩关闭 */
const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  offsetLeft = 0,
  offsetTop = 0,
  offsetWidth = 0,
  offsetHeight = 0,
  naturalWidth = 0,
  naturalHeight = 0,
  onClose,
}) => {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
  });

  useEffect(() => lockPageScroll(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = -e.deltaY * 0.0015;
    setScale((s) => Math.min(8, Math.max(0.2, s + delta)));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget) return;
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        baseX: tx,
        baseY: ty,
      };
    },
    [tx, ty],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d.active) return;
      setTx(d.baseX + (e.clientX - d.startX));
      setTy(d.baseY + (e.clientY - d.startY));
    };
    const onUp = () => {
      dragRef.current.active = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const hasCrop = offsetWidth > 0 && offsetHeight > 0;
  // 预览容器尺寸：有裁剪就只显示裁剪选区，否则按原图尺寸显示
  const viewWidth = hasCrop
    ? offsetWidth
    : naturalWidth > 0
      ? naturalWidth
      : window.innerWidth * 0.9;
  const viewHeight = hasCrop
    ? offsetHeight
    : naturalHeight > 0
      ? naturalHeight
      : window.innerHeight * 0.85;

  // 兜底：把过大的图缩到 viewport 内（不依赖 CSS objectFit，避免 wrap 被拉伸）
  const fitScale = Math.min(
    1,
    (window.innerWidth * 0.9) / viewWidth,
    (window.innerHeight * 0.85) / viewHeight,
  );

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onWheel={handleWheel}
      style={{ zIndex: 2147483647 }}
    >
      <div className={styles.hint}>{Math.round(scale * fitScale * 100)}% · 滚轮缩放 · Esc 关闭</div>
      <div
        className={styles.viewport}
        onMouseDown={handleMouseDown}
        style={{
          width: viewWidth * fitScale,
          height: viewHeight * fitScale,
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          className={styles.image}
          style={
            hasCrop
              ? {
                  marginLeft: -offsetLeft,
                  marginTop: -offsetTop,
                  width: naturalWidth,
                  height: naturalHeight,
                }
              : {
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }
          }
        />
      </div>
    </div>,
    document.body,
  );
};

export default ImagePreview;
