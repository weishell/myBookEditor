import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSlate, useReadOnly, ReactEditor } from 'slate-react';
import { Text, Transforms } from 'slate';
import type { Range } from 'slate';
import { HYPERLINK_KEY, HYPERLINK_AUTO_KEY } from './hyperlink-utils';
import { HyperlinkEditor } from './HyperlinkEditor';
import styles from './Hyperlink.module.less';

interface HyperlinkLeafProps {
  /** 跳转地址 */
  url: string;
  /** Slate renderLeaf 的 attributes（含 data-slate-leaf） */
  attributes: Record<string, unknown>;
  /** link 上需要保留的其它内联样式（加粗/斜体等，已含 color） */
  style: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * 超链接叶子渲染：在文本外层包一个可点击、可悬浮操作的 <a>。
 * 只作用于带 hyperlink mark 的叶子文本，不会影响后续普通文本。
 */
export const HyperlinkLeaf = ({ url, attributes, style, children }: HyperlinkLeafProps) => {
  const editor = useSlate();
  const readOnly = useReadOnly();
  const [popover, setPopover] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const aRef = useRef<HTMLAnchorElement | null>(null);
  const hideTimer = useRef<number | null>(null);

  const { style: attrsStyle, ...restAttrs } = attributes as {
    style?: React.CSSProperties;
    [k: string]: unknown;
  };

  const openUrl = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (url) {
        const target = /^(https?:)?\/\//.test(url) ? url : `https://${url}`;
        window.open(target, '_blank', 'noopener,noreferrer');
      }
    },
    [url],
  );

  const showPopover = useCallback(() => {
    if (readOnly) return;
    const el = aRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.top - 10, left: r.left + r.width / 2 });
    setPopover(true);
  }, [readOnly]);

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setPopover(false), 160);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    },
    [],
  );

  /** 把当前链接叶子的 DOM 范围换算成 Slate 范围，用于移除/改地址 */
  const linkRange = useCallback((): Range | null => {
    const el = aRef.current;
    if (!el) return null;
    const dr = document.createRange();
    dr.selectNodeContents(el);
    try {
      const sr = ReactEditor.toSlateRange(editor as any, dr, {
        exactMatch: false,
        suppressThrow: true,
      } as any) as Range;
      return sr || null;
    } catch {
      return null;
    }
  }, [editor]);

  const removeLink = useCallback(() => {
    const range = linkRange();
    if (range) {
      Transforms.unsetNodes(editor, [HYPERLINK_KEY as any, HYPERLINK_AUTO_KEY as any], {
        at: range,
        match: Text.isText,
      });
    }
    setEditing(false);
    setPopover(false);
  }, [editor, linkRange]);

  const commit = useCallback(
    (_text: string, nextUrl: string) => {
      const range = linkRange();
      const trimmed = nextUrl.trim();
      if (range && trimmed) {
        Transforms.setNodes(editor, { [HYPERLINK_KEY]: trimmed } as any, {
          at: range,
          match: Text.isText,
        });
      }
      setEditing(false);
      setPopover(false);
    },
    [editor, linkRange],
  );

  const cancel = useCallback(() => {
    setEditing(false);
    setPopover(false);
  }, []);

  return (
    <>
      <span {...restAttrs} style={{ ...attrsStyle, ...style }}>
        <a
          ref={aRef}
          className={styles.hyperlink}
          href={url}
          data-hyperlink
          data-url={url}
          onClick={openUrl}
          onMouseEnter={showPopover}
          onMouseLeave={scheduleHide}
        >
          {children}
        </a>
      </span>

      {!readOnly &&
        popover &&
        !editing &&
        createPortal(
          <div
            className={styles.popover}
            style={{ top: pos.top, left: pos.left }}
            onMouseEnter={cancelHide}
            onMouseLeave={scheduleHide}
            onMouseDown={(e) => e.preventDefault()}
          >
            <button className={styles.actionBtn} onClick={() => openUrl()}>
              <span className={styles.linkIcon}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </span>
              打开
            </button>
            <button className={styles.actionBtn} onClick={() => setEditing(true)}>
              编辑链接
            </button>
            <button className={`${styles.actionBtn} ${styles.danger}`} onClick={removeLink}>
              移除
            </button>
          </div>,
          document.body,
        )}

      {!readOnly &&
        editing &&
        createPortal(
          <HyperlinkEditor
            initialText={aRef.current?.textContent ?? ''}
            initialUrl={url}
            anchorRef={aRef}
            onCommit={commit}
            onRemove={removeLink}
            onCancel={cancel}
          />,
          document.body,
        )}
    </>
  );
};
