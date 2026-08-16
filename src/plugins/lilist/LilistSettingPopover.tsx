// 有序列表编号设置弹框（对齐飞书交互）
//  - 点击编号打开，只有三个操作：继续之前的编号 / 开始新列表 / 修改编号值
//  - 修改编号值：关闭弹框后编号本身变为可编辑输入（飞书同款交互）
//  - 弹框打开期间锁定页面滚动（body overflow hidden），关闭时恢复
//  - 点击弹框以外任意位置关闭
import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ReactEditor, useSlateStatic } from 'slate-react';
import type { Path } from 'slate';
import { canContinueLilist, continueLilist, restartLilist } from './lilist-commands';
import styles from './LilistSettingPopover.module.less';

interface LilistSettingPopoverProps {
  element: any;
  /** 编号 span 的位置信息，弹框贴着它下方展开 */
  anchorRect: { left: number; top: number; bottom: number };
  /** 点击"修改编号值"：关闭弹框并让编号进入行内编辑 */
  onEditNumber: () => void;
  onClose: () => void;
}

const POPOVER_WIDTH = 200;
const POPOVER_HEIGHT = 130;

export const LilistSettingPopover = ({
  element,
  anchorRect,
  onEditNumber,
  onClose,
}: LilistSettingPopoverProps) => {
  const editor = useSlateStatic();
  const popoverRef = useRef<HTMLDivElement>(null);

  const path: Path | null = useMemo(() => {
    try {
      return ReactEditor.findPath(editor, element);
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canContinue = useMemo(() => {
    if (!path) return false;
    try {
      return canContinueLilist(editor, path);
    } catch {
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 打开期间锁定页面滚动，关闭/卸载时恢复
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // 点击弹框以外任意位置关闭
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [onClose]);

  const position = useMemo(() => {
    let left = anchorRect.left;
    let top = anchorRect.bottom + 6;
    if (left + POPOVER_WIDTH > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - POPOVER_WIDTH - 8);
    }
    if (top + POPOVER_HEIGHT > window.innerHeight - 8) {
      top = Math.max(8, anchorRect.top - POPOVER_HEIGHT - 6);
    }
    return { left, top };
  }, [anchorRect]);

  const run = (action: () => void) => {
    action();
    onClose();
  };

  return createPortal(
    <div
      ref={popoverRef}
      className={styles.popover}
      style={{ left: position.left, top: position.top, width: POPOVER_WIDTH }}
    >
      <button
        className={styles.option}
        disabled={!canContinue || !path}
        onClick={() => path && run(() => continueLilist(editor, path))}
      >
        <svg
          className={styles.optionIcon}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 10l-5 2 5 2" />
          <path d="M4 12h12a4 4 0 0 0 0-8h-3" />
          <line x1="4" y1="20" x2="20" y2="20" />
        </svg>
        继续之前的编号
      </button>
      <button
        className={styles.option}
        disabled={!path}
        onClick={() => path && run(() => restartLilist(editor, path))}
      >
        <svg
          className={styles.optionIcon}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="4" cy="6" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="4" cy="12" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="4" cy="18" r="1.6" fill="currentColor" stroke="none" />
          <line x1="9" y1="6" x2="20" y2="6" />
          <line x1="9" y1="12" x2="20" y2="12" />
          <line x1="9" y1="18" x2="15" y2="18" />
        </svg>
        开始新列表
      </button>
      <button
        className={styles.option}
        disabled={!path}
        onClick={() => {
          onClose();
          onEditNumber();
        }}
      >
        <svg
          className={styles.optionIcon}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
        修改编号值
      </button>
    </div>,
    document.body,
  );
};
