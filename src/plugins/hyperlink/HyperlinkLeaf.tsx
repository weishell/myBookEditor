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

const SHOW_DELAY = 200;
const HIDE_DELAY = 160;
const POPOVER_GAP = 8;
// 浮层翻转阈值：上方空间不足这么多像素时改到下方显示
const FLIP_THRESHOLD = 48;

type Placement = 'top' | 'bottom';

/**
 * 超链接叶子渲染：在文本外层包一个可点击、可悬浮操作的 <a>。
 * 浮层规则：
 *  - 默认显示在链接上方，不会遮挡链接；上方空间不足时自动翻到下方
 *  - 悬浮 200ms 后才出现，防止快速滑过时不必要的闪烁
 *  - 移出后延迟隐藏，方便把鼠标移进浮层继续操作
 *  - 链接本身悬浮带下划线
 */
export const HyperlinkLeaf = ({ url, attributes, style, children }: HyperlinkLeafProps) => {
  const editor = useSlate();
  const readOnly = useReadOnly();
  const [popover, setPopover] = useState(false);
  const [editing, setEditing] = useState(false);
  const [placement, setPlacement] = useState<Placement>('top');
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const aRef = useRef<HTMLAnchorElement | null>(null);
  const showTimer = useRef<number | null>(null);
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

  const clearShowTimer = useCallback(() => {
    if (showTimer.current) {
      window.clearTimeout(showTimer.current);
      showTimer.current = null;
    }
  }, []);

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const showPopover = useCallback(() => {
    if (readOnly) return;
    const el = aRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nextPlacement: Placement = r.top < FLIP_THRESHOLD ? 'bottom' : 'top';
    setPlacement(nextPlacement);
    setPos({
      top: nextPlacement === 'top' ? r.top - POPOVER_GAP : r.bottom + POPOVER_GAP,
      left: r.left + r.width / 2,
    });
    setPopover(true);
  }, [readOnly]);

  const scheduleShow = useCallback(() => {
    clearShowTimer();
    clearHideTimer();
    showTimer.current = window.setTimeout(() => {
      showPopover();
    }, SHOW_DELAY);
  }, [clearShowTimer, clearHideTimer, showPopover]);

  const scheduleHide = useCallback(() => {
    clearShowTimer();
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setPopover(false), HIDE_DELAY);
  }, [clearShowTimer]);

  const cancelHide = useCallback(() => {
    clearShowTimer();
    clearHideTimer();
  }, [clearShowTimer, clearHideTimer]);

  useEffect(
    () => () => {
      clearShowTimer();
      clearHideTimer();
    },
    [clearShowTimer, clearHideTimer],
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

  const popoverStyle: React.CSSProperties = {
    top: pos.top,
    left: pos.left,
    transform: placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
  };

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
          onMouseEnter={scheduleShow}
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
            style={popoverStyle}
            onMouseEnter={cancelHide}
            onMouseLeave={scheduleHide}
            onMouseDown={(e) => e.preventDefault()}
          >
            <span className={styles.urlText} title={url} onClick={() => openUrl()}>
              {url}
            </span>
            <button className={styles.actionBtn} title="编辑链接" onClick={() => setEditing(true)}>
              <span className={styles.linkIcon}>
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
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </span>
            </button>
            <button
              className={`${styles.actionBtn} ${styles.danger}`}
              title="移除链接"
              onClick={removeLink}
            >
              <span className={styles.linkIcon}>
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
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  <line x1="4.93" y1="4.95" x2="9.17" y2="9.19" />
                  <line x1="14.83" y1="14.87" x2="19.07" y2="19.07" />
                </svg>
              </span>
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
