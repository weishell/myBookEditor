import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ImageCropperProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  offsetLeft?: number;
  offsetTop?: number;
  offsetWidth?: number;
  offsetHeight?: number;
  onCrop: (
    offsetLeft: number,
    offsetTop: number,
    offsetWidth: number,
    offsetHeight: number,
  ) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  imageWidth,
  imageHeight,
  offsetLeft,
  offsetTop,
  offsetWidth,
  offsetHeight,
  onCrop,
  onCancel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasExistingCrop = offsetWidth && offsetHeight;

  const [cropArea, setCropArea] = useState({
    left: hasExistingCrop
      ? offsetLeft || 0
      : Math.max(0, (imageWidth - Math.min(imageWidth, 600)) / 2),
    top: hasExistingCrop
      ? offsetTop || 0
      : Math.max(0, (imageHeight - Math.min(imageHeight, 400)) / 2),
    width: hasExistingCrop ? offsetWidth : Math.min(imageWidth, 600),
    height: hasExistingCrop ? offsetHeight : Math.min(imageHeight, 400),
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0, left: 0, top: 0, width: 0, height: 0 });

  const MIN_SIZE = 50;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragType(type);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        left: cropArea.left,
        top: cropArea.top,
        width: cropArea.width,
        height: cropArea.height,
      };
    },
    [cropArea],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragType) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      const { left, top, width, height } = dragStartRef.current;

      let newLeft = left;
      let newTop = top;
      let newWidth = width;
      let newHeight = height;

      switch (dragType) {
        case 'move':
          newLeft = Math.max(0, Math.min(imageWidth - width, left + deltaX));
          newTop = Math.max(0, Math.min(imageHeight - height, top + deltaY));
          break;
        case 'nw':
          newLeft = Math.min(left + deltaX, imageWidth - MIN_SIZE);
          newTop = Math.min(top + deltaY, imageHeight - MIN_SIZE);
          newWidth = Math.max(MIN_SIZE, width - deltaX);
          newHeight = Math.max(MIN_SIZE, height - deltaY);
          if (newLeft < 0) {
            newWidth += newLeft;
            newLeft = 0;
          }
          if (newTop < 0) {
            newHeight += newTop;
            newTop = 0;
          }
          newWidth = Math.min(newWidth, imageWidth - newLeft);
          newHeight = Math.min(newHeight, imageHeight - newTop);
          break;
        case 'ne':
          newTop = Math.min(top + deltaY, imageHeight - MIN_SIZE);
          newWidth = Math.max(MIN_SIZE, width + deltaX);
          newHeight = Math.max(MIN_SIZE, height - deltaY);
          if (newTop < 0) {
            newHeight += newTop;
            newTop = 0;
          }
          newWidth = Math.min(newWidth, imageWidth - left);
          newHeight = Math.min(newHeight, imageHeight - newTop);
          break;
        case 'sw':
          newLeft = Math.min(left + deltaX, imageWidth - MIN_SIZE);
          newWidth = Math.max(MIN_SIZE, width - deltaX);
          newHeight = Math.max(MIN_SIZE, height + deltaY);
          if (newLeft < 0) {
            newWidth += newLeft;
            newLeft = 0;
          }
          newWidth = Math.min(newWidth, imageWidth - newLeft);
          newHeight = Math.min(newHeight, imageHeight - top);
          break;
        case 'se':
          newWidth = Math.max(MIN_SIZE, width + deltaX);
          newHeight = Math.max(MIN_SIZE, height + deltaY);
          newWidth = Math.min(newWidth, imageWidth - left);
          newHeight = Math.min(newHeight, imageHeight - top);
          break;
        default:
          break;
      }

      setCropArea({
        left: newLeft,
        top: newTop,
        width: newWidth,
        height: newHeight,
      });
    },
    [isDragging, dragType, imageWidth, imageHeight],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleConfirm = useCallback(() => {
    onCrop(cropArea.left, cropArea.top, cropArea.width, cropArea.height);
  }, [cropArea, onCrop]);

  const handleReset = useCallback(() => {
    setCropArea({
      left: Math.max(0, (imageWidth - Math.min(imageWidth, 600)) / 2),
      top: Math.max(0, (imageHeight - Math.min(imageHeight, 400)) / 2),
      width: Math.min(imageWidth, 600),
      height: Math.min(imageHeight, 400),
    });
  }, [imageWidth, imageHeight]);

  const handleClear = useCallback(() => {
    onCrop(0, 0, imageWidth, imageHeight);
  }, [imageWidth, imageHeight, onCrop]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        cursor: 'default',
      }}
      onClick={(e) => {
        if (e.target === containerRef.current) {
          onCancel();
        }
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#333',
          }}
        >
          裁剪图片
        </div>

        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #e8e8e8',
            borderRadius: '4px',
            backgroundColor: '#f5f5f5',
            maxWidth: '800px',
            maxHeight: '600px',
          }}
        >
          <img
            src={imageUrl}
            alt=""
            style={{
              display: 'block',
              maxWidth: '100%',
              maxHeight: '600px',
              objectFit: 'fill',
            }}
            draggable={false}
          />

          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: `${(cropArea.left / imageWidth) * 100}%`,
              top: `${(cropArea.top / imageHeight) * 100}%`,
              width: `${(cropArea.width / imageWidth) * 100}%`,
              height: `${(cropArea.height / imageHeight) * 100}%`,
              backgroundColor: 'transparent',
              border: '2px dashed #1890ff',
              cursor: 'move',
              pointerEvents: 'auto',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
          >
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                width: '10px',
                height: '10px',
                backgroundColor: '#fff',
                border: '2px solid #1890ff',
                borderRadius: '50%',
                cursor: 'nw-resize',
              }}
              onMouseDown={(e) => handleMouseDown(e, 'nw')}
            />
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '10px',
                height: '10px',
                backgroundColor: '#fff',
                border: '2px solid #1890ff',
                borderRadius: '50%',
                cursor: 'ne-resize',
              }}
              onMouseDown={(e) => handleMouseDown(e, 'ne')}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                left: '-2px',
                width: '10px',
                height: '10px',
                backgroundColor: '#fff',
                border: '2px solid #1890ff',
                borderRadius: '50%',
                cursor: 'sw-resize',
              }}
              onMouseDown={(e) => handleMouseDown(e, 'sw')}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '10px',
                height: '10px',
                backgroundColor: '#fff',
                border: '2px solid #1890ff',
                borderRadius: '50%',
                cursor: 'se-resize',
              }}
              onMouseDown={(e) => handleMouseDown(e, 'se')}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '12px',
          }}
        >
          <button
            onClick={handleClear}
            style={{
              padding: '6px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1890ff')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#d9d9d9')}
          >
            清除裁剪
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '6px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1890ff')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#d9d9d9')}
          >
            重置
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: '6px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1890ff')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#d9d9d9')}
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '6px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#1890ff',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#40a9ff')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1890ff')}
          >
            确认裁剪
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
