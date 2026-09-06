import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlateStatic, useSelected } from 'slate-react';
import { ElementWrapper } from '../element-wrapper/ElementWrapper';
import { BlockElementType } from '@/enums';
import { createPortal } from 'react-dom';
import { normalizeEmbedAttrs, normalizeEmbedUrl, type EmbedAttrs } from './embed-node';
import { EmbedSettings } from './EmbedSettings';
import styles from './Embed.module.less';

interface EmbedProps {
  attributes: any;
  children?: React.ReactNode;
  pluginId: string;
  element: { attrs: EmbedAttrs } & Record<string, any>;
}

const PencilIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#666"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
  </svg>
);

const Embed: React.FC<EmbedProps> = ({ attributes, children, pluginId, element }) => {
  const editor = useSlateStatic();
  const attrs = normalizeEmbedAttrs(element.attrs);
  const isSelected = useSelected();

  const [showToolbar, setShowToolbar] = useState(false);
  const [editing, setEditing] = useState(false);
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);
  const attrsRef = useRef(attrs);
  attrsRef.current = attrs;

  const getPath = useCallback(() => {
    try {
      return ReactEditor.findPath(editor, element as any);
    } catch {
      return null;
    }
  }, [editor, element]);

  const updateAttrs = useCallback(
    (patch: Partial<EmbedAttrs>) => {
      const path = getPath();
      if (!path) return;
      Transforms.setNodes(editor, { attrs: { ...attrsRef.current, ...patch } } as any, {
        at: path,
      });
    },
    [editor, getPath],
  );

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

  useEffect(
    () => () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    },
    [],
  );

  // 底部手柄拖拽调高
  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = { startY: e.clientY, startH: attrsRef.current.height };
      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dy = ev.clientY - dragRef.current.startY;
        const next = Math.min(2000, Math.max(120, dragRef.current.startH + dy));
        setDragHeight(next);
      };
      const onUp = (ev: MouseEvent) => {
        const dy = ev.clientY - dragRef.current!.startY;
        const next = Math.min(2000, Math.max(120, dragRef.current!.startH + dy));
        dragRef.current = null;
        setDragHeight(null);
        updateAttrs({ height: next });
        void dy;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [updateAttrs],
  );

  const height = dragHeight ?? attrs.height;
  const hasUrl = !!attrs.url;

  const handleRemove = useCallback(() => {
    const path = getPath();
    if (!path) return;
    Transforms.removeNodes(editor, { at: path });
  }, [editor, getPath]);

  const handleConfirmEdit = useCallback(
    (next: EmbedAttrs) => {
      updateAttrs({ url: normalizeEmbedUrl(next.url), height: next.height });
      setEditing(false);
    },
    [updateAttrs],
  );

  return (
    <ElementWrapper type={BlockElementType.EMBED} pluginId={pluginId} attributes={attributes}>
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
            <button
              className={styles.toolbarButton}
              title="编辑网址"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
            >
              <PencilIcon />
            </button>
            <button
              className={styles.toolbarButton}
              title="删除"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <TrashIcon />
            </button>
          </div>
        )}

        <div
          className={`${styles.frame} ${isSelected ? styles.frameSelected : ''}`}
          style={{ height }}
          contentEditable={false}
          suppressContentEditableWarning={true}
        >
          {hasUrl ? (
            <iframe
              className={styles.iframe}
              src={attrs.url}
              title="内嵌网页"
              style={{ height }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer-when-downgrade"
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholder} style={{ height }} onClick={() => setEditing(true)}>
              <GlobeIcon />
              <div className={styles.placeholderTitle}>内嵌网页</div>
              <div className={styles.placeholderHint}>点击填写网站地址</div>
            </div>
          )}
        </div>

        {/* 底部高度拖拽手柄 */}
        <div
          className={styles.resizeHandle}
          title="拖拽调整高度"
          onMouseDown={onDragStart}
          contentEditable={false}
        >
          <div className={styles.resizeGrip} />
        </div>
      </div>

      {children}

      {editing &&
        createPortal(
          <EmbedSettings
            initial={attrs}
            onConfirm={handleConfirmEdit}
            onCancel={() => setEditing(false)}
          />,
          document.body,
        )}
    </ElementWrapper>
  );
};

export default Embed;
