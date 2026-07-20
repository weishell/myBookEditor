import React, { useRef } from 'react';

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

const getHandleStyle = (position: HandlePositionType, bounds: DOMRect): React.CSSProperties => {
  const handleSize = 10;
  const halfHandle = handleSize / 2;

  switch (position) {
    case HandlePosition.NW:
      return {
        left: bounds.left - halfHandle,
        top: bounds.top - halfHandle,
        cursor: 'nw-resize',
      };
    case HandlePosition.NE:
      return {
        left: bounds.right - halfHandle,
        top: bounds.top - halfHandle,
        cursor: 'ne-resize',
      };
    case HandlePosition.SW:
      return {
        left: bounds.left - halfHandle,
        top: bounds.bottom - halfHandle,
        cursor: 'sw-resize',
      };
    case HandlePosition.SE:
      return {
        left: bounds.right - halfHandle,
        top: bounds.bottom - halfHandle,
        cursor: 'se-resize',
      };
    default:
      return {};
  }
};

const ResizeHandle: React.FC<ResizeHandleProps> = ({
  bounds,
  onResize,
  aspectRatio,
  initialWidth,
  initialHeight,
}) => {
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

    switch (dragHandleRef.current) {
      case HandlePosition.NE:
        newWidth = startWidth + deltaX;
        break;
      case HandlePosition.SE:
        newWidth = startWidth + deltaX;
        break;
      case HandlePosition.SW:
        newWidth = startWidth - deltaX;
        break;
      case HandlePosition.NW:
        newWidth = startWidth - deltaX;
        break;
      default:
        break;
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
    console.log('handleMouseDown:', position);
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    dragHandleRef.current = position;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: initialWidth,
      height: initialHeight,
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const positions = [HandlePosition.NW, HandlePosition.NE, HandlePosition.SW, HandlePosition.SE];

  const lineColor = '#1890ff';
  const lineWidth = 2;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: lineWidth,
          backgroundColor: lineColor,
          zIndex: 10000,
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: bounds.right - lineWidth,
          top: bounds.top,
          width: lineWidth,
          height: bounds.height,
          backgroundColor: lineColor,
          zIndex: 10000,
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: bounds.left,
          top: bounds.bottom - lineWidth,
          width: bounds.width,
          height: lineWidth,
          backgroundColor: lineColor,
          zIndex: 10000,
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: bounds.left,
          top: bounds.top,
          width: lineWidth,
          height: bounds.height,
          backgroundColor: lineColor,
          zIndex: 10000,
        }}
      />

      {positions.map((position) => (
        <div
          key={position}
          style={{
            ...getHandleStyle(position, bounds),
            position: 'fixed',
            width: '10px',
            height: '10px',
            backgroundColor: '#fff',
            border: '2px solid #1890ff',
            borderRadius: '50%',
            zIndex: 10001,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
          onMouseDown={(e) => handleMouseDown(e, position)}
        />
      ))}
    </>
  );
};

export default ResizeHandle;
