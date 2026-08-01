import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Transforms } from 'slate';
import { useSlate, useSelected } from 'slate-react';
import { ElementWrapper } from '../element-wrapper/ElementWrapper';
import { BlockElementType } from '@/enums';
import ResizeHandle from '../resize-handle/ResizeHandle';
import ImageCropper from './ImageCropper';
import { v4 as uuidv4 } from 'uuid';
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
}

interface ImageProps {
  attributes: any;
  children?: React.ReactNode;
  pluginId: string;
  element: { attrs: ImageAttrs } & Record<string, any>;
}

const Image: React.FC<ImageProps> = ({ attributes, children, pluginId, element }) => {
  const editor = useSlate();
  const { attrs } = element;
  // 用 Slate 原生 useSelected 检测选中状态
  const isSelected = useSelected();

  const [showToolbar, setShowToolbar] = useState(false);
  const [bounds, setBounds] = useState<DOMRect | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<number | null>(null);
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

  const handleResize = useCallback(
    (newWidth: number, newHeight: number) => {
      if (!editor || !editor.children) return;

      for (let i = 0; i < editor.children.length; i++) {
        const child = editor.children[i] as any;
        if (
          child.type === BlockElementType.IMAGE_BLOCK &&
          child.attrs?.url === attrsRef.current.url
        ) {
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
            { at: [i] },
          );
          return;
        }
      }
    },
    [editor],
  );

  const handleOpenCrop = useCallback(() => {
    setIsCropping(true);
  }, []);

  const handleCrop = useCallback(
    (offsetLeft: number, offsetTop: number, offsetWidth: number, offsetHeight: number) => {
      if (!editor || !editor.children) return;

      for (let i = 0; i < editor.children.length; i++) {
        const child = editor.children[i] as any;
        if (
          child.type === BlockElementType.IMAGE_BLOCK &&
          child.attrs?.url === attrsRef.current.url
        ) {
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
            { at: [i] },
          );
          break;
        }
      }
      setIsCropping(false);
    },
    [editor],
  );

  const handleCancelCrop = useCallback(() => {
    setIsCropping(false);
  }, []);

  const showToolbarHandler = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowToolbar(true);
  }, []);

  const hideToolbarHandler = useCallback(() => {
    // 选中状态下不隐藏工具栏
    if (isSelected) return;
    hideTimerRef.current = window.setTimeout(() => {
      setShowToolbar(false);
      hideTimerRef.current = null;
    }, 300);
  }, [isSelected]);

  const handleAlign = useCallback(
    (align: 'left' | 'center' | 'right') => {
      if (!editor || !editor.children) return;

      for (let i = 0; i < editor.children.length; i++) {
        const child = editor.children[i] as any;
        if (
          child.type === BlockElementType.IMAGE_BLOCK &&
          child.attrs?.url === attrsRef.current.url
        ) {
          Transforms.setNodes(editor, { attrs: { ...attrsRef.current, align } } as any, {
            at: [i],
          });
          return;
        }
      }
    },
    [editor],
  );

  const handleRemove = useCallback(() => {
    if (!editor || !editor.children) return;

    for (let i = 0; i < editor.children.length; i++) {
      const child = editor.children[i] as any;
      if (
        child.type === BlockElementType.IMAGE_BLOCK &&
        child.attrs?.url === attrsRef.current.url
      ) {
        Transforms.removeNodes(editor, { at: [i] });
        return;
      }
    }
  }, [editor]);

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
              className={`${styles.toolbarButton} ${attrs.align === 'left' ? styles.toolbarButtonActive : ''}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="15" y1="3" x2="6" y2="3"></line>
                <line x1="19" y1="21" x2="6" y2="21"></line>
                <path d="M4 9h10"></path>
                <path d="M4 15h14"></path>
              </svg>
            </button>
            <button
              onClick={() => handleAlign('center')}
              className={`${styles.toolbarButton} ${attrs.align === 'center' ? styles.toolbarButtonActive : ''}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="3" x2="6" y2="3"></line>
                <line x1="21" y1="21" x2="3" y2="21"></line>
                <path d="M9 9h6"></path>
                <path d="M8 15h8"></path>
              </svg>
            </button>
            <button
              onClick={() => handleAlign('right')}
              className={`${styles.toolbarButton} ${attrs.align === 'right' ? styles.toolbarButtonActive : ''}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="9" y1="3" x2="18" y2="3"></line>
                <line x1="3" y1="21" x2="18" y2="21"></line>
                <path d="M14 9h6"></path>
                <path d="M10 15h6"></path>
              </svg>
            </button>
            <div className={styles.divider} />
            <button
              onClick={() => handleResize(CROP_WIDTH * 0.25, CROP_HEIGHT * 0.25)}
              className={`${styles.toolbarButton} ${styles.toolbarButtonText}`}
            >
              S
            </button>
            <button
              onClick={() => handleResize(CROP_WIDTH * 0.5, CROP_HEIGHT * 0.5)}
              className={`${styles.toolbarButton} ${styles.toolbarButtonText}`}
            >
              M
            </button>
            <button
              onClick={() => handleResize(CROP_WIDTH * 0.75, CROP_HEIGHT * 0.75)}
              className={`${styles.toolbarButton} ${styles.toolbarButtonText}`}
            >
              L
            </button>
            <button
              onClick={() => handleResize(attrs.width || 800, attrs.height || 450)}
              className={`${styles.toolbarButton} ${styles.toolbarButtonText}`}
            >
              原
            </button>
            <div className={styles.divider} />
            <button onClick={handleOpenCrop} className={styles.toolbarButton}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
            <button
              onClick={() => {
                if (!editor || !editor.children) return;
                for (let i = 0; i < editor.children.length; i++) {
                  const child = editor.children[i] as any;
                  if (
                    child.type === BlockElementType.IMAGE_BLOCK &&
                    child.attrs?.url === attrsRef.current.url
                  ) {
                    Transforms.insertNodes(
                      editor,
                      {
                        type: BlockElementType.IMAGE_BLOCK,
                        id: uuidv4(),
                        attrs: { ...attrsRef.current },
                        children: [{ text: '' }],
                      } as any,
                      { at: [i + 1] },
                    );
                    return;
                  }
                }
              }}
              className={styles.toolbarButton}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button onClick={handleRemove} className={styles.toolbarButton}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        )}

        <div
          ref={containerRef}
          className={`${styles.imageContainer} ${hasCrop ? styles.imageContainerCropped : ''} ${isSelected ? styles.imageContainerSelected : ''}`}
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
        </div>

        {(isSelected || showToolbar) && bounds && !hasCrop && (
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
