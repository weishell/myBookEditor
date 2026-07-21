import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import type { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hasExistingCrop = offsetWidth && offsetHeight;

  useEffect(() => {
    if (hasExistingCrop && offsetWidth && offsetHeight) {
      setCrop({
        unit: '%',
        x: ((offsetLeft || 0) / imageWidth) * 100,
        y: ((offsetTop || 0) / imageHeight) * 100,
        width: (offsetWidth / imageWidth) * 100,
        height: (offsetHeight / imageHeight) * 100,
      });
    }
  }, []);

  const onImageLoad = useCallback(() => {}, []);

  const onCropComplete = useCallback((_crop: PixelCrop) => {
    setCompletedCrop(_crop);
  }, []);

  const onCropChange = useCallback((c: Crop) => {
    setCrop(c);
  }, []);

  const handleConfirm = useCallback(() => {
    if (completedCrop && imgRef.current) {
      const scaleX = imageWidth / imgRef.current.width;
      const scaleY = imageHeight / imgRef.current.height;
      onCrop(
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
      );
    }
  }, [completedCrop, onCrop, imageWidth, imageHeight]);

  const handleReset = useCallback(() => {
    setCrop({
      unit: '%',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
  }, []);

  const handleClear = useCallback(() => {
    onCrop(0, 0, imageWidth, imageHeight);
  }, [imageWidth, imageHeight, onCrop]);

  return (
    <div
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
        if (e.target === e.currentTarget) {
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
            border: '1px solid #e8e8e8',
            borderRadius: '4px',
            backgroundColor: '#f5f5f5',
            maxWidth: '800px',
            maxHeight: '600px',
            marginBottom: '12px',
          }}
        >
          <ReactCrop
            crop={crop}
            onChange={onCropChange}
            onComplete={onCropComplete}
            style={{
              maxWidth: '800px',
              maxHeight: '600px',
            }}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt=""
              style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '600px',
                objectFit: 'contain',
              }}
              draggable={false}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
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
