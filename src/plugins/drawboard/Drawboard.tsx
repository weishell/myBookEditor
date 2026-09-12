// 画板（drawui）块主组件 - 文档内渲染预览卡，点击/按键进入全屏编辑态
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ReactEditor, useSelected, useSlateStatic } from 'slate-react';
import { Transforms } from 'slate';
import { ElementWrapper } from '../element-wrapper/ElementWrapper';
import ResizeHandle from '../resize-handle/ResizeHandle';
import { BlockElementType } from '@/enums';
import DrawboardEditor from './DrawboardEditor';
import { type DrawboardAttrs } from './drawboard-utils';
import styles from './Drawboard.module.less';

interface DrawboardProps {
  attributes: any;
  children?: React.ReactNode;
  pluginId: string;
  element: { id: string; attrs: DrawboardAttrs } & Record<string, any>;
}

const Drawboard: React.FC<DrawboardProps> = ({ attributes, children, pluginId, element }) => {
  const editor = useSlateStatic();
  const isSelected = useSelected();
  const { attrs } = element;

  const [editing, setEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  // 缩放：拖动期间用本地尺寸预览，松开(mouseup)才写回 attrs
  const [dragSize, setDragSize] = useState<{ w: number; h: number } | null>(null);
  const draggingRef = useRef(false);
  const elementRef = useRef(element);
  elementRef.current = element;
  const editorRef = useRef(editor);
  editorRef.current = editor;

  const width = attrs?.width || 720;
  const height = attrs?.height || 400;
  const effW = dragSize?.w ?? width;
  const effH = dragSize?.h ?? height;

  // 画板块被选中时，在窗口捕获阶段拦截 Enter → 进入全屏编辑。
  // 选捕获阶段在根节点 React/Slate 处理之前触发，preventDefault 会让 Slate 跳过插入换行等默认行为。
  useEffect(() => {
    if (!isSelected) return;
    const onKeyDownCapture = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.defaultPrevented) return;
      e.preventDefault();
      e.stopPropagation();
      setEditing(true);
    };
    window.addEventListener('keydown', onKeyDownCapture, true);
    return () => window.removeEventListener('keydown', onKeyDownCapture, true);
  }, [isSelected]);

  const openEditor = useCallback(() => setEditing(true), []);
  const closeEditor = useCallback(() => setEditing(false), []);

  // 点击卡片 → 把 Slate 选区落到当前画板块上（非文本块默认不随点击选中，
  // 需要手动 select 才能让「选中后按 Enter/方向键」的键盘链路生效）
  const handleSelect = useCallback(() => {
    try {
      const path = ReactEditor.findPath(editor, element as any);
      Transforms.select(editor, path);
      ReactEditor.focus(editor);
    } catch {
      /* ignore */
    }
  }, [editor, element]);

  const handleRemove = useCallback(() => {
    try {
      const path = ReactEditor.findPath(editor, element as any);
      if (path) Transforms.removeNodes(editor, { at: path });
    } catch {
      /* ignore */
    }
  }, [editor, element]);

  // 松开鼠标：把拖动得到的尺寸写回 attrs
  useEffect(() => {
    const onUp = () => {
      if (!draggingRef.current || !dragSize) return;
      draggingRef.current = false;
      const cur = elementRef.current;
      try {
        const path = ReactEditor.findPath(editorRef.current, cur as any);
        if (path) {
          const w = Math.min(Math.max(Math.round(dragSize.w), 320), 1200);
          const h = Math.min(Math.max(Math.round(dragSize.h), 240), 900);
          Transforms.setNodes(
            editorRef.current,
            { attrs: { ...cur.attrs, width: w, height: h } } as any,
            { at: path },
          );
        }
      } catch {
        /* ignore */
      }
      setDragSize(null);
    };
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
  }, [dragSize]);

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
    }, 300);
  }, [isSelected]);

  const bounds = cardRef.current?.getBoundingClientRect();

  return (
    <ElementWrapper
      type={BlockElementType.DRAWBOARD}
      pluginId={pluginId}
      attributes={attributes}
      isEmpty={false}
    >
      <div
        className={styles.wrapper}
        onMouseEnter={showToolbarHandler}
        onMouseLeave={hideToolbarHandler}
      >
        {(showToolbar || isSelected) && (
          <div
            className={styles.toolbar}
            onMouseEnter={showToolbarHandler}
            onMouseLeave={hideToolbarHandler}
          >
            <button className={styles.toolbarButton} onClick={openEditor}>
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
                <path d="M15 3h2a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h2" />
                <rect x="8" y="8" width="8" height="8" rx="1" />
              </svg>
              编辑
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

        <div
          ref={cardRef}
          className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
          contentEditable={false}
          suppressContentEditableWarning={true}
          onClick={handleSelect}
          onDoubleClick={openEditor}
          title="双击进入全屏编辑"
          style={{ maxWidth: `min(${effW}px, 100%)`, aspectRatio: `${effW} / ${effH}` }}
        >
          <div className={styles.titleBar}>
            <span className={styles.titleIcon}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="8" y="14" width="9" height="7" rx="1" />
              </svg>
            </span>
            <span>画板</span>
          </div>
          <div className={styles.previewArea}>
            <div className={styles.emptyIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="8" y="14" width="9" height="7" rx="1" />
                <line x1="6.5" y1="10" x2="6.5" y2="14" />
                <line x1="17.5" y1="10" x2="17.5" y2="14" />
                <line x1="6.5" y1="14" x2="11.5" y2="14" />
                <line x1="17.5" y1="14" x2="11.5" y2="14" />
              </svg>
            </div>
            <span className={styles.emptyText}>点击进入全屏编辑</span>
            <span className={styles.hint}>双击画板 或 选中后按 Enter</span>
          </div>
        </div>

        {/* 选中时显示缩放手柄（放在 .wrapper 内，避免被 .card 的 overflow:hidden 裁掉） */}
        {isSelected && bounds && (
          <ResizeHandle
            bounds={bounds}
            aspectRatio={effW / effH}
            initialWidth={effW}
            initialHeight={effH}
            onResize={(w, h) => {
              draggingRef.current = true;
              setDragSize({ w, h });
            }}
          />
        )}
      </div>

      {/* Slate children - 必须渲染 */}
      {children}

      {editing && <DrawboardEditor onClose={closeEditor} />}
    </ElementWrapper>
  );
};

export default Drawboard;
