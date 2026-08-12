// Drawio 流程图插件 - 主组件
// 支持内联预览 + 全屏编辑模式，通过 iframe 嵌入 draw.io
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlateStatic, useSelected } from 'slate-react';
import { ElementWrapper } from '../element-wrapper/ElementWrapper';
import { BlockElementType } from '@/enums';
import { v4 as uuidv4 } from 'uuid';
import DrawioEditor from './DrawioEditor';
import DrawioResizeHandle from './DrawioResizeHandle';
import styles from './Drawio.module.less';

interface DrawioAttrs {
  content?: string;
  xml?: string;
  description?: string;
  width?: number;
  height?: number;
}

interface DrawioProps {
  attributes: any;
  children?: React.ReactNode;
  pluginId: string;
  element: { id: string; attrs: DrawioAttrs } & Record<string, any>;
}

const Drawio: React.FC<DrawioProps> = ({ attributes, children, pluginId, element }) => {
  const editor = useSlateStatic();
  const { attrs } = element;
  const isSelected = useSelected();

  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [description, setDescription] = useState(attrs?.description || '');
  const [bounds, setBounds] = useState<DOMRect | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const attrsRef = useRef(attrs);
  const containerRef = useRef<HTMLDivElement>(null);
  attrsRef.current = attrs;

  // 更新容器边界
  const updateBounds = useCallback(() => {
    if (containerRef.current) {
      setBounds(containerRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds, true);
    // 延迟一帧确保 DOM 渲染完毕后测量准确
    requestAnimationFrame(updateBounds);
    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds, true);
    };
  }, [updateBounds]);

  // 选中状态变化时也更新 bounds
  useEffect(() => {
    requestAnimationFrame(updateBounds);
  }, [isSelected, updateBounds]);

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(updateBounds);
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [updateBounds]);

  // 查找节点路径
  const getElementPath = useCallback(() => {
    try {
      return ReactEditor.findPath(editor, element as any);
    } catch {
      return null;
    }
  }, [editor, element]);

  // 更新节点属性
  const updateAttrs = useCallback(
    (newAttrs: Partial<DrawioAttrs>) => {
      const path = getElementPath();
      if (!path) return;
      Transforms.setNodes(editor, { attrs: { ...attrsRef.current, ...newAttrs } } as any, {
        at: path,
      });
    },
    [editor, getElementPath],
  );

  // 保存流程图内容
  const handleSave = useCallback(
    (xml: string, svgDataUrl?: string) => {
      updateAttrs({
        xml,
        content: svgDataUrl || xml,
      });
    },
    [updateAttrs],
  );

  // 打开编辑器
  const handleOpenEditor = useCallback(() => {
    setIsEditing(true);
  }, []);

  // 关闭编辑器
  const handleCloseEditor = useCallback(() => {
    setIsEditing(false);
  }, []);

  // 删除节点
  const handleRemove = useCallback(() => {
    const path = getElementPath();
    if (!path) return;
    Transforms.removeNodes(editor, { at: path });
  }, [editor, getElementPath]);

  // 描述失焦保存
  const handleDescriptionBlur = useCallback(() => {
    updateAttrs({ description });
  }, [description, updateAttrs]);

  // 描述回车 - 保存并插入新段落
  const handleDescriptionKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        updateAttrs({ description });
        const path = getElementPath();
        if (!path) return;
        const insertPath = [...path];
        insertPath[insertPath.length - 1] += 1;
        Transforms.insertNodes(
          editor,
          {
            type: BlockElementType.PARAGRAPH,
            id: uuidv4(),
            children: [{ text: '' }],
          } as any,
          { at: insertPath },
        );
      }
    },
    [description, updateAttrs, editor, getElementPath],
  );

  // 工具栏显示/隐藏
  const showToolbarHandler = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowToolbar(true);
  }, []);

  const hideToolbarHandler = useCallback(() => {
    if (isSelected) return;
    hideTimerRef.current = window.setTimeout(() => {
      setShowToolbar(false);
      hideTimerRef.current = null;
    }, 300);
  }, [isSelected]);

  // 拖拽缩放回调
  const handleResize = useCallback(
    (newWidth: number, newHeight: number) => {
      updateAttrs({ width: newWidth, height: newHeight });
    },
    [updateAttrs],
  );

  // 预览内容处理
  const hasContent = !!attrs?.content;
  //   const isSvgContent =
  //     hasContent &&
  //     (attrs.content?.startsWith('data:image/') || attrs.content?.startsWith('<svg'));

  const previewSrc = useMemo(() => {
    if (!hasContent || !attrs.content) return null;
    // 已经是 data URL
    if (attrs.content.startsWith('data:image/')) return attrs.content;
    // 原始 SVG 字符串
    if (attrs.content.startsWith('<svg')) {
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(attrs.content)}`;
    }
    // XML 内容无法直接预览
    return null;
  }, [attrs?.content, hasContent]);

  return (
    <ElementWrapper type={BlockElementType.DRAWIO} pluginId={pluginId} attributes={attributes}>
      <div
        className={styles.wrapper}
        onMouseEnter={showToolbarHandler}
        onMouseLeave={hideToolbarHandler}
      >
        {/* 悬浮工具栏 */}
        {(showToolbar || isSelected) && (
          <div
            className={styles.toolbar}
            onMouseEnter={showToolbarHandler}
            onMouseLeave={hideToolbarHandler}
          >
            <button className={styles.toolbarButton} onClick={handleOpenEditor}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              编辑流程图
            </button>
            <div className={styles.toolbarDivider} />
            <button className={styles.toolbarButton} onClick={handleRemove}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              删除
            </button>
          </div>
        )}

        {/* 预览区域 - wrapper 包含容器和缩放手柄 */}
        <div className={styles.drawioBlock}>
          <div
            ref={containerRef}
            className={`${styles.container} ${isSelected ? styles.containerSelected : ''}`}
            contentEditable={false}
            suppressContentEditableWarning={true}
            onClick={handleOpenEditor}
          >
            {/* 标题栏 */}
            <div className={styles.titleBar}>
              <span className={styles.titleIcon}>D</span>
              <span>流程图</span>
            </div>

            {/* 内容预览 */}
            <div className={styles.previewArea} style={{ minHeight: attrs?.height || 200 }}>
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt="flowchart"
                  className={styles.previewImage}
                  draggable={false}
                />
              ) : (
                <div className={styles.emptyPlaceholder}>
                  <div className={styles.emptyIcon}>
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="8" y="14" width="7" height="7" rx="1" />
                      <line x1="6.5" y1="10" x2="6.5" y2="14" />
                      <line x1="17.5" y1="10" x2="17.5" y2="14" />
                      <line x1="6.5" y1="14" x2="11.5" y2="14" />
                      <line x1="17.5" y1="14" x2="11.5" y2="14" />
                    </svg>
                  </div>
                  <span className={styles.emptyText}>点击创建流程图</span>
                </div>
              )}
            </div>
          </div>

          {/* 8点位拖拽缩放 */}
          {(isSelected || showToolbar) && bounds && (
            <DrawioResizeHandle bounds={bounds} onResize={handleResize} />
          )}
        </div>

        {/* 描述输入框 */}
        <div className={styles.descriptionArea}>
          <input
            className={styles.descriptionInput}
            value={description}
            placeholder="输入流程图描述..."
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            onKeyDown={handleDescriptionKeyDown}
            style={{ width: attrs?.width || '100%' }}
          />
        </div>
      </div>

      {/* Slate children - 必须渲染 */}
      {children}

      {/* 全屏编辑器 */}
      {isEditing && (
        <DrawioEditor initialXml={attrs?.xml} onSave={handleSave} onClose={handleCloseEditor} />
      )}
    </ElementWrapper>
  );
};

export default Drawio;
