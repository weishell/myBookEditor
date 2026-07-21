import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { ElementWrapper } from '../element-wrapper/ElementWrapper';
import { BlockElementType } from '@/enums';
import ResizeHandle from '../resize-handle/ResizeHandle';
import ImageCropper from './ImageCropper';
import { v4 as uuidv4 } from 'uuid';

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
  pluginId: string;
  element: { attrs: ImageAttrs };
}

const Image: React.FC<ImageProps> = ({ attributes, pluginId, element }) => {
  const editor = useSlate();
  const { attrs } = element;
  const [showToolbar, setShowToolbar] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
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

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected((prev) => !prev);
  }, []);

  const showToolbarHandler = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowToolbar(true);
  }, []);

  const hideToolbarHandler = useCallback(() => {
    hideTimerRef.current = window.setTimeout(() => {
      setShowToolbar(false);
      setIsSelected(false);
      hideTimerRef.current = null;
    }, 300);
  }, []);

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
    <ElementWrapper type={BlockElementType.IMAGE_BLOCK} pluginId={pluginId}>
      <div
        ref={wrapperRef}
        style={{
          margin: '8px 0',
          display: 'flex',
          ...getAlignStyle(),
          userSelect: 'none',
          width: '100%',
          position: 'relative',
        }}
        onMouseEnter={showToolbarHandler}
        onMouseLeave={hideToolbarHandler}
      >
        {(showToolbar || isSelected) && (
          <div
            ref={toolbarRef}
            style={{
              position: 'absolute',
              top: '-48px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '0',
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '2px',
              zIndex: 10000,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              border: '1px solid #e8e8e8',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={showToolbarHandler}
            onMouseLeave={hideToolbarHandler}
          >
            <button
              onClick={() => handleAlign('left')}
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                background: attrs.align === 'left' ? '#f0f0f0' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  attrs.align === 'left' ? '#f0f0f0' : 'transparent')
              }
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
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                background: attrs.align === 'center' ? '#f0f0f0' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  attrs.align === 'center' ? '#f0f0f0' : 'transparent')
              }
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
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                background: attrs.align === 'right' ? '#f0f0f0' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  attrs.align === 'right' ? '#f0f0f0' : 'transparent')
              }
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
            <div
              style={{
                width: '1px',
                height: '20px',
                backgroundColor: '#e8e8e8',
                margin: '4px 2px',
              }}
            />
            <button
              onClick={() => handleResize(CROP_WIDTH * 0.25, CROP_HEIGHT * 0.25)}
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                background: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: '#666',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              S
            </button>
            <button
              onClick={() => handleResize(CROP_WIDTH * 0.5, CROP_HEIGHT * 0.5)}
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                background: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: '#666',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              M
            </button>
            <button
              onClick={() => handleResize(CROP_WIDTH * 0.75, CROP_HEIGHT * 0.75)}
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                background: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: '#666',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              L
            </button>
            <button
              onClick={() => handleResize(attrs.width || 800, attrs.height || 450)}
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                background: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: '#666',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              原
            </button>
            <div
              style={{
                width: '1px',
                height: '20px',
                backgroundColor: '#e8e8e8',
                margin: '4px 2px',
              }}
            />
            <button
              onClick={handleOpenCrop}
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                background: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                background: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
            <button
              onClick={handleRemove}
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                background: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        )}

        <div
          {...(attributes as React.HTMLAttributes<HTMLDivElement>)}
          ref={containerRef}
          className="image-container"
          style={{
            position: 'relative',
            width: DISPLAY_WIDTH,
            maxWidth: hasCrop ? 'none' : '90%',
            aspectRatio: ASPECT_RATIO,
            overflow: 'hidden',
            borderRadius: '4px',
            boxShadow: isSelected ? '0 0 0 2px #1890ff' : 'none',
            cursor: 'grab',
          }}
          contentEditable={false}
          suppressContentEditableWarning={true}
          onClick={handleClick}
        >
          <img
            src={attrs.url}
            alt=""
            style={{
              display: 'block',
              ...(hasCrop
                ? {
                    position: 'absolute' as const,
                    left: -(attrs.offsetLeft || 0),
                    top: -(attrs.offsetTop || 0),
                    width: attrs.width,
                    height: attrs.height,
                    objectFit: 'none' as const,
                  }
                : {
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain' as const,
                  }),
            }}
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
