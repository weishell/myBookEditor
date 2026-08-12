// Drawio 8点位拖拽缩放组件 - 使用 fixed 定位
// 每个点位以其对边/对角为锚点收缩生长（锚点固定，被拖拽侧跟随鼠标）
// 拖拽中手柄位置由拖拽状态计算（基于拖拽开始的快照），不依赖实时 DOM bounds，
// 避免容器 transform 平移导致点位与图形分离
import React, { useRef, useCallback, useState } from 'react';
import styles from './Drawio.module.less';

const HANDLE_POSITIONS = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'] as const;

type HandlePos = (typeof HANDLE_POSITIONS)[number];

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

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
  // 拖拽中的手柄矩形（由拖拽计算得出），null 表示未拖拽，使用 props.bounds
  const [dragRect, setDragRect] = useState<Rect | null>(null);
  const dragHandleRef = useRef<HandlePos | null>(null);
  // 拖拽开始时锁定的快照
  const startRef = useRef<Rect>({ left: 0, top: 0, right: 0, bottom: 0 });
  const onResizeRef = useRef(onResize);
  const onResizeEndRef = useRef(onResizeEnd);
  onResizeRef.current = onResize;
  onResizeEndRef.current = onResizeEnd;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, position: HandlePos) => {
      e.preventDefault();
      e.stopPropagation();
      dragHandleRef.current = position;
      startRef.current = {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom,
      };

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragHandleRef.current) return;

        const s = startRef.current;
        const pos = dragHandleRef.current;
        const mouseX = ev.clientX;
        const mouseY = ev.clientY;

        let newW = s.right - s.left;
        let newH = s.bottom - s.top;
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
          offsetX = -(newW - (s.right - s.left)) / 2;
        } else if (pos === 'e' || pos === 'ne' || pos === 'se') {
          offsetX = (newW - (s.right - s.left)) / 2;
        }

        // 垂直方向：锚点在上时无需补偿，锚点在下时向上补偿
        if (pos === 'n' || pos === 'nw' || pos === 'ne') {
          offsetY = -(newH - (s.bottom - s.top));
        }

        // 手柄矩形 = 锚点固定的矩形（与容器 transform 后实际位置一致）
        const rect: Rect = { ...s };
        if (pos === 'e' || pos === 'ne' || pos === 'se') {
          rect.right = rect.left + newW;
        } else if (pos === 'w' || pos === 'nw' || pos === 'sw') {
          rect.left = rect.right - newW;
        }
        if (pos === 's' || pos === 'sw' || pos === 'se') {
          rect.bottom = rect.top + newH;
        } else if (pos === 'n' || pos === 'nw' || pos === 'ne') {
          rect.top = rect.bottom - newH;
        }
        setDragRect(rect);

        onResizeRef.current(newW, newH, offsetX, offsetY);
      };

      const onMouseUp = () => {
        dragHandleRef.current = null;
        setDragRect(null);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        onResizeEndRef.current();
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [bounds.left, bounds.top, bounds.right, bounds.bottom],
  );

  const handleSize = 10;
  const half = handleSize / 2;

  // 渲染用的矩形：拖拽中用计算值，否则用实时 bounds
  const rect = dragRect || {
    left: bounds.left,
    top: bounds.top,
    right: bounds.right,
    bottom: bounds.bottom,
  };
  const width = rect.right - rect.left;
  const height = rect.bottom - rect.top;

  const getHandlePosition = (pos: HandlePos): React.CSSProperties => {
    switch (pos) {
      case 'nw':
        return { left: rect.left - half, top: rect.top - half };
      case 'n':
        return { left: rect.left + width / 2 - half, top: rect.top - half };
      case 'ne':
        return { left: rect.right - half, top: rect.top - half };
      case 'w':
        return { left: rect.left - half, top: rect.top + height / 2 - half };
      case 'e':
        return { left: rect.right - half, top: rect.top + height / 2 - half };
      case 'sw':
        return { left: rect.left - half, top: rect.bottom - half };
      case 's':
        return { left: rect.left + width / 2 - half, top: rect.bottom - half };
      case 'se':
        return { left: rect.right - half, top: rect.bottom - half };
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
