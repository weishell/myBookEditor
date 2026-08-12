// Drawio 8点位拖拽缩放组件 - 使用 fixed 定位
// 每个点位以其对边/对角为锚点收缩生长（锚点固定，被拖拽侧跟随鼠标）
import React, { useRef, useCallback } from 'react';
import styles from './Drawio.module.less';

const HANDLE_POSITIONS = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'] as const;

type HandlePos = (typeof HANDLE_POSITIONS)[number];

interface DrawioResizeHandleProps {
  bounds: DOMRect;
  onResize: (width: number, height: number, offsetX: number, offsetY: number) => void;
  onResizeEnd: () => void;
}

const MIN_WIDTH = 200;
const MAX_WIDTH = 1600;
const MIN_HEIGHT = 150;
const MAX_HEIGHT = 1200;

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

const DrawioResizeHandle: React.FC<DrawioResizeHandleProps> = ({
  bounds,
  onResize,
  onResizeEnd,
}) => {
  const isDraggingRef = useRef(false);
  // 拖拽开始时锁定的快照，避免拖拽中 bounds 变化导致计算漂移
  const startRef = useRef({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 });
  const dragHandleRef = useRef<HandlePos | null>(null);
  const onResizeRef = useRef(onResize);
  const onResizeEndRef = useRef(onResizeEnd);
  onResizeRef.current = onResize;
  onResizeEndRef.current = onResizeEnd;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, position: HandlePos) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      dragHandleRef.current = position;
      startRef.current = {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom,
        width: bounds.width,
        height: bounds.height,
      };

      const onMouseMove = (ev: MouseEvent) => {
        if (!isDraggingRef.current || !dragHandleRef.current) return;

        const s = startRef.current;
        const pos = dragHandleRef.current;
        const mouseX = ev.clientX;
        const mouseY = ev.clientY;

        let newW = s.width;
        let newH = s.height;
        let offsetX = 0;
        let offsetY = 0;

        // 水平方向：锚点在对边
        if (pos === 'e' || pos === 'ne' || pos === 'se') {
          // 锚点在左边，向右生长
          newW = mouseX - s.left;
        } else if (pos === 'w' || pos === 'nw' || pos === 'sw') {
          // 锚点在右边，向左生长
          newW = s.right - mouseX;
        }

        // 垂直方向：锚点在对边
        if (pos === 's' || pos === 'sw' || pos === 'se') {
          // 锚点在上边，向下生长
          newH = mouseY - s.top;
        } else if (pos === 'n' || pos === 'nw' || pos === 'ne') {
          // 锚点在下边，向上生长
          newH = s.bottom - mouseY;
        }

        newW = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newW));
        newH = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newH));

        // 容器水平居中，宽度变化会导致中心偏移，需补偿使锚点固定
        if (pos === 'w' || pos === 'nw' || pos === 'sw') {
          // 锚点在右 → 向左平移补偿（宽度增加 (newW - s.width)/2，居中会右移一半）
          offsetX = -(newW - s.width) / 2;
        } else if (pos === 'e' || pos === 'ne' || pos === 'se') {
          // 锚点在左 → 向右平移补偿
          offsetX = (newW - s.width) / 2;
        }

        // 垂直方向：锚点在上时无需补偿（文档流自然下移），锚点在下时向上补偿
        if (pos === 'n' || pos === 'nw' || pos === 'ne') {
          offsetY = -(newH - s.height);
        }

        onResizeRef.current(newW, newH, offsetX, offsetY);
      };

      const onMouseUp = () => {
        isDraggingRef.current = false;
        dragHandleRef.current = null;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        onResizeEndRef.current();
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [bounds.left, bounds.top, bounds.right, bounds.bottom, bounds.width, bounds.height],
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
