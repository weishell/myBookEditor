// Drawio 8点位拖拽缩放组件 - 使用 fixed 定位
import React, { useRef, useCallback } from 'react';
import styles from './Drawio.module.less';

const HANDLE_POSITIONS = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'] as const;

type HandlePos = (typeof HANDLE_POSITIONS)[number];

interface DrawioResizeHandleProps {
  bounds: DOMRect;
  onResize: (width: number, height: number) => void;
}

const getCursor = (pos: HandlePos): string => {
  const map: Record<HandlePos, string> = {
    nw: 'nw-resize',
    n: 'n-resize',
    ne: 'ne-resize',
    w: 'w-resize',
    e: 'e-resize',
    sw: 'sw-resize',
    s: 's-resize',
    se: 'se-resize',
  };
  return map[pos];
};

const DrawioResizeHandle: React.FC<DrawioResizeHandleProps> = ({ bounds, onResize }) => {
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const dragHandleRef = useRef<HandlePos | null>(null);
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, position: HandlePos) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      dragHandleRef.current = position;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: bounds.width,
        height: bounds.height,
      };

      const onMouseMove = (ev: MouseEvent) => {
        if (!isDraggingRef.current || !dragHandleRef.current) return;

        const dx = ev.clientX - dragStartRef.current.x;
        const dy = ev.clientY - dragStartRef.current.y;
        const startW = dragStartRef.current.width;
        const startH = dragStartRef.current.height;

        let newW = startW;
        let newH = startH;

        switch (dragHandleRef.current) {
          case 'nw':
            newW = startW - dx;
            newH = startH - dy;
            break;
          case 'ne':
            newW = startW + dx;
            newH = startH - dy;
            break;
          case 'sw':
            newW = startW - dx;
            newH = startH + dy;
            break;
          case 'se':
            newW = startW + dx;
            newH = startH + dy;
            break;
          case 'n':
            newH = startH - dy;
            break;
          case 's':
            newH = startH + dy;
            break;
          case 'w':
            newW = startW - dx;
            break;
          case 'e':
            newW = startW + dx;
            break;
        }

        newW = Math.max(200, Math.min(1600, newW));
        newH = Math.max(150, Math.min(1200, newH));

        onResizeRef.current(newW, newH);
      };

      const onMouseUp = () => {
        isDraggingRef.current = false;
        dragHandleRef.current = null;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [bounds.width, bounds.height],
  );

  const handleSize = 10;
  const half = handleSize / 2;

  const getHandlePosition = (pos: HandlePos): React.CSSProperties => {
    switch (pos) {
      case 'nw':
        return { left: bounds.left - half, top: bounds.top - half };
      case 'n':
        return { left: bounds.left + bounds.width / 2 - half, top: bounds.top - half };
      case 'ne':
        return { left: bounds.right - half, top: bounds.top - half };
      case 'w':
        return { left: bounds.left - half, top: bounds.top + bounds.height / 2 - half };
      case 'e':
        return { left: bounds.right - half, top: bounds.top + bounds.height / 2 - half };
      case 'sw':
        return { left: bounds.left - half, top: bounds.bottom - half };
      case 's':
        return { left: bounds.left + bounds.width / 2 - half, top: bounds.bottom - half };
      case 'se':
        return { left: bounds.right - half, top: bounds.bottom - half };
    }
  };

  return (
    <>
      {HANDLE_POSITIONS.map((pos) => (
        <div
          key={pos}
          className={styles.resizeHandle}
          style={{
            cursor: getCursor(pos),
            ...getHandlePosition(pos),
          }}
          onMouseDown={(e) => handleMouseDown(e, pos)}
        />
      ))}
    </>
  );
};

export default DrawioResizeHandle;
