import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { lockPageScroll } from '@/utils/scroll-lock';
import { CloseIcon, ZoomInIcon, ZoomOutIcon, ResetIcon } from '@/components/icons/lineIcons';
import styles from './ImagePreview.module.less';

interface ImagePreviewProps {
  src: string;
  offsetLeft?: number;
  offsetTop?: number;
  offsetWidth?: number;
  offsetHeight?: number;
  naturalWidth?: number;
  naturalHeight?: number;
  onClose: () => void;
}

/** 全屏图片预览（飞书风格）：遮罩 + 滚轮缩放（鼠标锚点） + 拖拽平移 + 90° 旋转 + Esc/点遮罩关闭 */
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
  const { t } = useTranslation();
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
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => lockPageScroll(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === '0') {
        setScale(1);
        setTx(0);
        setTy(0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const hasCrop = offsetWidth > 0 && offsetHeight > 0;
  // 渲染"未旋转"的源图尺寸：裁剪时是选区，未裁剪时是原图（或兜底）
  const sourceWidth = hasCrop
    ? offsetWidth
    : naturalWidth > 0
      ? naturalWidth
      : window.innerWidth * 0.9;
  const sourceHeight = hasCrop
    ? offsetHeight
    : naturalHeight > 0
      ? naturalHeight
      : window.innerHeight * 0.85;

  const viewWidth = sourceWidth;
  const viewHeight = sourceHeight;

  // 初次渲染自适应到屏幕 90%，用户滚轮缩放基于这个 fitScale 累加
  const fitScale = Math.min(
    1,
    (window.innerWidth * 0.9) / viewWidth,
    (window.innerHeight * 0.8) / viewHeight,
  );

  /** 缩放：基于鼠标位置的"锚点缩放"（飞书同款）。鼠标指向的点保持不动。 */
  const zoomAt = useCallback(
    (nextScale: number, anchorX?: number, anchorY?: number) => {
      const clamped = Math.min(8, Math.max(0.2, nextScale));
      // 如果没传 anchor，落到 viewport 中心
      const v = viewportRef.current;
      let ax = anchorX;
      let ay = anchorY;
      if ((ax === undefined || ay === undefined) && v) {
        const rect = v.getBoundingClientRect();
        ax = rect.left + rect.width / 2;
        ay = rect.top + rect.height / 2;
      }
      if (ax === undefined || ay === undefined || !v) {
        setScale(clamped);
        return;
      }
      // 锚点处 viewport 内的局部坐标（视觉空间）
      const rect = v.getBoundingClientRect();
      const localX = (ax - rect.left - tx) / scale;
      const localY = (ay - rect.top - ty) / scale;
      // 缩放后保持锚点对齐：解出新 tx/ty
      const newTx = ax - rect.left - localX * clamped;
      const newTy = ay - rect.top - localY * clamped;
      setScale(clamped);
      setTx(newTx);
      setTy(newTy);
    },
    [scale, tx, ty],
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.stopPropagation();
      const delta = -e.deltaY * 0.0018;
      zoomAt(scale * (1 + delta), e.clientX, e.clientY);
    },
    [scale, zoomAt],
  );

  /** 拖拽：在 overlay 上任意位置按下都能拖，体验更像飞书 */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 工具条按钮上的点击不进入拖拽
      const target = e.target as HTMLElement;
      if (target.closest(`.${styles.toolbar}`) || target.closest(`.${styles.hint}`)) return;
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

  /** 适配窗口：把视图缩到屏幕 90% 并居中 */
  const handleFit = useCallback(() => {
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  /** 重置视图：缩放归 1 + 位移归零 */
  const handleResetView = useCallback(() => {
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      style={{ zIndex: 2147483647 }}
    >
      <div className={styles.hint}>
        {Math.round(scale * fitScale * 100)}% · 拖动平移 · 0 重置 · Esc 关闭
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
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

      <div
        className={styles.toolbar}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <span className={styles.divider} />
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => zoomAt(scale / 1.2)}
          title={t('imageToolbar.zoomOut')}
        >
          <ZoomOutIcon size={16} />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={handleFit}
          title={t('imageToolbar.fit')}
        >
          <span className={styles.percent}>{Math.round(scale * fitScale * 100)}%</span>
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => zoomAt(scale * 1.2)}
          title={t('imageToolbar.zoomIn')}
        >
          <ZoomInIcon size={16} />
        </button>
        <span className={styles.divider} />
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={handleResetView}
          title={t('imageToolbar.resetView')}
        >
          <ResetIcon size={16} />
        </button>
        <span className={styles.divider} />
        <button
          type="button"
          className={`${styles.toolbarButton} ${styles.toolbarButtonDanger}`}
          onClick={onClose}
          title={t('imageToolbar.close')}
        >
          <CloseIcon size={16} />
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default ImagePreview;
