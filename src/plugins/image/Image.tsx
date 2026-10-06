import React, { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlateStatic, useSelected } from 'slate-react';
import { ElementWrapper } from '../element-wrapper/ElementWrapper';
import { BlockElementType } from '@/enums';
import ResizeHandle from '../resize-handle/ResizeHandle';
import ImageCropper from './ImageCropper';
import { uploadProgressStore } from './uploadImage';
import { useTranslation } from 'react-i18next';
import { ResetIcon, TrashIcon } from '@/components/icons/lineIcons';
import { AlignIcon } from '@/components/AlignIndentPanel';
import styles from './Image.module.less';

interface ImageAttrs {
  url: string;
  width?: number;
  height?: number;
  align?: 'left' | 'center' | 'right';
  offsetLeft?: number;
  offsetTop?: number;
  offsetWidth?: number;
  offsetHeight?: number;
  name?: string;
}

interface ImageProps {
  attributes: any;
  children?: React.ReactNode;
  pluginId: string;
  element: { attrs: ImageAttrs } & Record<string, any>;
}

const Image: React.FC<ImageProps> = ({ attributes, children, pluginId, element }) => {
  const editor = useSlateStatic();
  const { attrs } = element;
  const { t } = useTranslation();
  // 用 Slate 原生 useSelected 检测选中状态
  const isSelected = useSelected();

  const [showToolbar, setShowToolbar] = useState(false);
  const [bounds, setBounds] = useState<DOMRect | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  // 上传进度来自模块级瞬态 store（不进 Slate 文档/历史）。
  // store 里有该节点 id 的进度 → 显示进度条 overlay；否则正常显示图片。
  useSyncExternalStore(uploadProgressStore.subscribe, uploadProgressStore.getVersion);
  const transientProgress = uploadProgressStore.get(element.id);
  const isUploading = transientProgress !== undefined;
  const uploadProgress = Math.min(Math.max(transientProgress ?? 0, 0), 100);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<number | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const attrsRef = useRef(attrs);

  attrsRef.current = attrs;

  const hasCrop = attrs.offsetWidth && attrs.offsetHeight;
  const CROP_WIDTH = attrs.offsetWidth || attrs.width || 800;
  const CROP_HEIGHT = attrs.offsetHeight || attrs.height || 450;
  const ASPECT_RATIO = hasCrop
    ? CROP_WIDTH / CROP_HEIGHT
    : attrs.width && attrs.height
      ? attrs.width / attrs.height
      : 16 / 9;
  const DISPLAY_WIDTH = CROP_WIDTH;

  const updateBounds = useCallback(() => {
    if (containerRef.current) {
      setBounds(containerRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds, true);
    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds, true);
    };
  }, [updateBounds]);

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(() => {
        updateBounds();
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [updateBounds]);

  useEffect(() => {
    requestAnimationFrame(() => {
      updateBounds();
    });
  }, [
    attrs.align,
    attrs.offsetLeft,
    attrs.offsetTop,
    attrs.offsetWidth,
    attrs.offsetHeight,
    updateBounds,
  ]);

  const getElementPath = useCallback(() => {
    try {
      return ReactEditor.findPath(editor, element as any);
    } catch {
      return null;
    }
  }, [editor, element]);

  const handleResize = useCallback(
    (newWidth: number, newHeight: number) => {
      const path = getElementPath();
      if (!path) return;

      const currentAttrs = attrsRef.current;
      Transforms.setNodes(
        editor,
        {
          attrs: {
            ...currentAttrs,
            width: newWidth,
            height: newHeight,
          },
        } as any,
        { at: path },
      );
    },
    [editor, getElementPath],
  );

  const handleCrop = useCallback(
    (offsetLeft: number, offsetTop: number, offsetWidth: number, offsetHeight: number) => {
      const path = getElementPath();
      if (path) {
        Transforms.setNodes(
          editor,
          {
            attrs: {
              ...attrsRef.current,
              offsetLeft,
              offsetTop,
              offsetWidth,
              offsetHeight,
            },
          } as any,
          { at: path },
        );
      }
      setIsCropping(false);
    },
    [editor, getElementPath],
  );

  const handleCancelCrop = useCallback(() => {
    setIsCropping(false);
  }, []);

  const showToolbarHandler = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    // 悬浮展示延迟 300ms：避免鼠标划过块体时工具条闪现
    if (showTimerRef.current) return;
    showTimerRef.current = window.setTimeout(() => {
      showTimerRef.current = null;
      setShowToolbar(true);
    }, 300);
  }, []);

  const hideToolbarHandler = useCallback(() => {
    // 选中状态下不隐藏工具栏
    if (isSelected) return;
    // 取消尚未触发的展示计时，防止鼠标已离开工具条仍弹出
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    hideTimerRef.current = window.setTimeout(() => {
      setShowToolbar(false);
      hideTimerRef.current = null;
    }, 300);
  }, [isSelected]);

  const handleAlign = useCallback(
    (align: 'left' | 'center' | 'right') => {
      const path = getElementPath();
      if (!path) return;

      Transforms.setNodes(editor, { attrs: { ...attrsRef.current, align } } as any, {
        at: path,
      });
    },
    [editor, getElementPath],
  );

  const handleRemove = useCallback(() => {
    const path = getElementPath();
    if (!path) return;

    Transforms.removeNodes(editor, { at: path });
  }, [editor, getElementPath]);

  const getAlignStyle = () => {
    switch (attrs.align) {
      case 'left':
        return { justifyContent: 'flex-start' };
      case 'right':
        return { justifyContent: 'flex-end' };
      default:
        return { justifyContent: 'center' };
    }
  };

  return (
    <ElementWrapper type={BlockElementType.IMAGE_BLOCK} pluginId={pluginId} attributes={attributes}>
      <div
        ref={wrapperRef}
        className={styles.wrapper}
        style={getAlignStyle()}
        onMouseEnter={showToolbarHandler}
        onMouseLeave={hideToolbarHandler}
      >
        {(showToolbar || isSelected) && (
          <div
            ref={toolbarRef}
            className={styles.toolbar}
            onMouseEnter={showToolbarHandler}
            onMouseLeave={hideToolbarHandler}
          >
            <button
              onClick={() => handleAlign('left')}
              title={t('imageToolbar.alignLeft')}
              className={`${styles.toolbarButton} ${attrs.align === 'left' ? styles.toolbarButtonActive : ''}`}
            >
              <AlignIcon align="left" active={attrs.align === 'left'} size={16} />
            </button>
            <button
              onClick={() => handleAlign('center')}
              title={t('imageToolbar.alignCenter')}
              className={`${styles.toolbarButton} ${attrs.align === 'center' ? styles.toolbarButtonActive : ''}`}
            >
              <AlignIcon align="center" active={attrs.align === 'center'} size={16} />
            </button>
            <button
              onClick={() => handleAlign('right')}
              title={t('imageToolbar.alignRight')}
              className={`${styles.toolbarButton} ${attrs.align === 'right' ? styles.toolbarButtonActive : ''}`}
            >
              <AlignIcon align="right" active={attrs.align === 'right'} size={16} />
            </button>
            <div className={styles.divider} />
            <button
              onClick={() => handleResize(attrs.width || 800, attrs.height || 450)}
              title={t('imageToolbar.resetSize')}
              className={styles.toolbarButton}
            >
              <ResetIcon size={16} />
            </button>
            <div className={styles.divider} />
            <button
              onClick={handleRemove}
              title={t('imageToolbar.delete')}
              className={styles.toolbarButton}
            >
              <TrashIcon size={16} />
            </button>
          </div>
        )}

        <div
          ref={containerRef}
          data-visual-root
          className={`${styles.imageContainer} ${hasCrop ? styles.imageContainerCropped : ''}`}
          style={{
            width: DISPLAY_WIDTH,
            aspectRatio: ASPECT_RATIO,
          }}
          contentEditable={false}
          suppressContentEditableWarning={true}
        >
          <img
            src={attrs.url}
            alt=""
            className={`${styles.image} ${hasCrop ? styles.imageCropped : styles.imageFull}`}
            style={
              hasCrop
                ? {
                    left: -(attrs.offsetLeft || 0),
                    top: -(attrs.offsetTop || 0),
                    width: attrs.width,
                    height: attrs.height,
                  }
                : undefined
            }
            draggable={false}
            onLoad={updateBounds}
          />

          {isUploading && (
            <div className={styles.uploadOverlay}>
              <div className={styles.uploadInfo}>{attrs.name || t('imageToolbar.uploading')}</div>
              <div className={styles.progressTrack}>
                <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
              </div>
              <div className={styles.uploadPercent}>{uploadProgress}%</div>
            </div>
          )}
        </div>

        {!isUploading && (isSelected || showToolbar) && bounds && !hasCrop && (
          <ResizeHandle
            bounds={bounds}
            onResize={handleResize}
            aspectRatio={ASPECT_RATIO}
            initialWidth={bounds.width}
            initialHeight={bounds.height}
          />
        )}
      </div>

      {children}

      {isCropping && (
        <ImageCropper
          imageUrl={attrs.url}
          imageWidth={attrs.width || 800}
          imageHeight={attrs.height || 450}
          offsetLeft={attrs.offsetLeft}
          offsetTop={attrs.offsetTop}
          offsetWidth={attrs.offsetWidth}
          offsetHeight={attrs.offsetHeight}
          onCrop={handleCrop}
          onCancel={handleCancelCrop}
        />
      )}
    </ElementWrapper>
  );
};

export default Image;
