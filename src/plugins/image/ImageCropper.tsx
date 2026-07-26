import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import type { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './ImageCropper.module.less';

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
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div className={styles.modal}>
        <div className={styles.title}>裁剪图片</div>

        <div className={styles.cropContainer}>
          <ReactCrop
            crop={crop}
            onChange={onCropChange}
            onComplete={onCropComplete}
            className={styles.crop}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt=""
              className={styles.cropImage}
              draggable={false}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        <div className={styles.buttonRow}>
          <button onClick={handleClear} className={`${styles.button} ${styles.buttonSecondary}`}>
            清除裁剪
          </button>
          <button onClick={handleReset} className={`${styles.button} ${styles.buttonSecondary}`}>
            重置
          </button>
          <button onClick={onCancel} className={`${styles.button} ${styles.buttonSecondary}`}>
            取消
          </button>
          <button onClick={handleConfirm} className={`${styles.button} ${styles.buttonPrimary}`}>
            确认裁剪
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
