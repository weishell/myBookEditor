import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import styles from './ResizeHandle.module.less';

interface ResizeHandleProps {
  bounds: DOMRect;
  onResize: (width: number, height: number) => void;
  aspectRatio: number;
  initialWidth: number;
  initialHeight: number;
}

const HandlePosition = {
  NW: 'nw',
  NE: 'ne',
  SW: 'sw',
  SE: 'se',
} as const;

type HandlePositionType = (typeof HandlePosition)[keyof typeof HandlePosition];

/**
 * 选中框（蓝色边框 + 四角缩放手柄）。
 *
 * 旧实现用 bounds 的视口坐标 + position:fixed 绘制。但 fixed 会把框钉死在视口上，
 * 页面一滚动，框就与下方承载它的块（图表/图片/时间轴）分离/偏移。
 *
 * 新实现（对齐 img.txt：飞书把选中层放进块内部、相对定位，滚动不分离）：
 *   1. 框是 position:absolute，填在它所属定位祖先（offsetParent）里；
 *   2. 框的 left/top/width/height = 目标块的 getBoundingClientRect() 减去
 *      offsetParent 的 getBoundingClientRect()，即"目标块在祖先坐标系里的局部盒子"。
 *      块与 offsetParent 随页面滚动同步移动，两者差值恒定 → 框永远贴紧块，滚动不偏移。
 */
const ResizeHandle: React.FC<ResizeHandleProps> = ({
  bounds,
  onResize,
  aspectRatio,
  initialWidth,
  initialHeight,
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  // 将目标块的视口矩形换算成相对 offsetParent 的局部矩形
  const measure = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const parent = frame.offsetParent;
    if (!parent) return;
    const p = parent.getBoundingClientRect();
    setBox({
      left: bounds.left - p.left,
      top: bounds.top - p.top,
      width: bounds.width,
      height: bounds.height,
    });
  }, [bounds]);

  // 每次渲染（bounds 是调用方用 getBoundingClientRect 新算的矩形，身份都会变）
  // 都重算一次局部盒子。该盒子是"文档坐标系"下的常量：页面滚动时父容器与块
  // 同步位移、差值不变，因此不要再挂 scroll/resize 监听，否则用过期快照重算反而会漂移。
  useLayoutEffect(() => {
    measure();
  }, [measure]);

  const initialWidthRef = useRef(initialWidth);
  const initialHeightRef = useRef(initialHeight);
  initialWidthRef.current = initialWidth;
  initialHeightRef.current = initialHeight;

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const dragHandleRef = useRef<HandlePositionType | null>(null);
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !dragHandleRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const startWidth = dragStartRef.current.width;

    let newWidth = startWidth;
    const handle = dragHandleRef.current;
    if (handle === HandlePosition.NE || handle === HandlePosition.SE) {
      newWidth = startWidth + deltaX;
    } else if (handle === HandlePosition.SW || handle === HandlePosition.NW) {
      newWidth = startWidth - deltaX;
    }

    newWidth = Math.max(100, Math.min(1200, newWidth));
    const newHeight = newWidth / aspectRatio;
    onResizeRef.current(newWidth, newHeight);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    dragHandleRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent, position: HandlePositionType) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    dragHandleRef.current = position;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: initialWidthRef.current,
      height: initialHeightRef.current,
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleStyle = (position: HandlePositionType): React.CSSProperties => {
    switch (position) {
      case HandlePosition.NW:
        return { top: 0, left: 0, transform: 'translate(-50%, -50%)' };
      case HandlePosition.NE:
        return { top: 0, right: 0, transform: 'translate(50%, -50%)' };
      case HandlePosition.SW:
        return { bottom: 0, left: 0, transform: 'translate(-50%, 50%)' };
      case HandlePosition.SE:
        return { bottom: 0, right: 0, transform: 'translate(50%, 50%)' };
      default:
        return {};
    }
  };

  return (
    <div
      ref={frameRef}
      className={styles.frame}
      // 必须始终渲染（不能 display:none），否则 offsetParent 为 null、测不出盒子。
      // 未测出前用 (0,0,0,0) 兜底，useLayoutEffect 会在首帧量好后落入正确位置。
      style={{
        left: box?.left ?? 0,
        top: box?.top ?? 0,
        width: box?.width ?? 0,
        height: box?.height ?? 0,
      }}
    >
      <div className={styles.borderLineTop} />
      <div className={styles.borderLineRight} />
      <div className={styles.borderLineBottom} />
      <div className={styles.borderLineLeft} />

      {Object.values(HandlePosition).map((position) => (
        <div
          key={position}
          className={`${styles.handle} ${styles[`handle${position.toUpperCase()}`]}`}
          style={handleStyle(position)}
          onMouseDown={(e) => handleMouseDown(e, position)}
        />
      ))}
    </div>
  );
};

export default ResizeHandle;
