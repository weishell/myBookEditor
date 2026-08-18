// 有序列表编号设置弹框（对齐飞书交互）
//  - 点击编号打开，只有三个操作：继续之前的编号 / 开始新列表 / 修改编号值
//  - 修改编号值：面板切换为两行「当前编号的值为 [当前值]」+「新编号为 [输入框] [确定]」（对齐飞书），
//    正文中不出现任何输入框；左侧返回箭头回到三选项菜单
//  - H 标题有序兼容：当前值显示完整层级路径（1.1 等），新编号输入本层级序号，父级编号自动继承
//  - 弹框打开期间锁定页面滚动（body overflow hidden），关闭时恢复
//  - 点击弹框以外任意位置关闭
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, InputNumber } from 'antd';
import { ReactEditor, useSlateStatic } from 'slate-react';
import type { Path } from 'slate';
import { BlockElementType } from '@/enums';
import {
  canContinueLilist,
  changeLilistNumber,
  continueLilist,
  restartLilist,
} from './lilist-commands';
import { getLilist, MAX_LIST_NUMBER } from './lilist-model';
import styles from './LilistSettingPopover.module.less';

interface LilistSettingPopoverProps {
  element: any;
  /** 编号 span 的位置信息，弹框贴着它下方展开 */
  anchorRect: { left: number; top: number; bottom: number };
  /** 当前编号值，作为修改编号值面板的默认值 */
  currentNumber: number;
  onClose: () => void;
}

const POPOVER_WIDTH = 248;
const POPOVER_HEIGHT = 150;

export const LilistSettingPopover = ({
  element,
  anchorRect,
  currentNumber,
  onClose,
}: LilistSettingPopoverProps) => {
  const editor = useSlateStatic();
  const popoverRef = useRef<HTMLDivElement>(null);
  // 修改编号值面板：弹框内部切换，正文中不出现输入框
  const [modifyMode, setModifyMode] = useState(false);
  const [newValue, setNewValue] = useState<number | null>(currentNumber);
  const inputRef = useRef<any>(null);

  const lilist = getLilist(element);
  const isHeading = element?.type === BlockElementType.HEADING;
  // H 标题当前值显示完整层级路径（H1 = 1.，H2 = 1.1）；段落显示数字本身
  const currentPathLabel =
    isHeading && lilist?.list_path
      ? (element?.attrs?.level ?? 1) === 1
        ? `${lilist.list_path}.`
        : lilist.list_path
      : undefined;

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
  // 隐藏 body 滚动条会让内容横向位移一个滚动条宽度（页面抖动），
  // 用 paddingRight 等宽补偿；弹框是 fixed 定位且坐标在锁定前取好，不受影响
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
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

  // 修改编号值面板打开时自动聚焦并全选
  useEffect(() => {
    if (modifyMode) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [modifyMode]);

  // 确认修改：超限按 MAX_LIST_NUMBER 截断（对齐 template handleConfirmModify）
  const confirmModify = () => {
    if (newValue && newValue > 0 && path) {
      const v = Math.min(newValue, MAX_LIST_NUMBER);
      if (v !== currentNumber) {
        changeLilistNumber(editor, path, v);
      }
    }
    onClose();
  };

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
      {modifyMode ? (
        <div className={styles.modifyPanel}>
          <button
            className={styles.backButton}
            onClick={() => setModifyMode(false)}
            aria-label="返回"
          >
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
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className={styles.modifyBody}>
            <div className={styles.modifyRow}>
              <span className={styles.modifyLabel}>当前编号的值为</span>
              {currentPathLabel !== undefined ? (
                <span className={styles.currentPath}>{currentPathLabel}</span>
              ) : (
                <InputNumber
                  className={styles.modifyInput}
                  value={currentNumber}
                  controls
                  disabled
                />
              )}
            </div>
            <div className={styles.modifyRow}>
              <span className={styles.modifyLabel}>新编号为</span>
              <InputNumber
                ref={inputRef}
                className={styles.modifyInput}
                controls
                min={1}
                max={MAX_LIST_NUMBER}
                precision={0}
                value={newValue}
                onChange={(v) => setNewValue(v)}
                onPressEnter={confirmModify}
              />
              <Button type="primary" size="small" onClick={confirmModify}>
                确定
              </Button>
            </div>
            {isHeading && (
              <div className={styles.modifyHint}>新编号为本层级序号，父级编号自动继承</div>
            )}
          </div>
        </div>
      ) : (
        <>
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
          <button className={styles.option} disabled={!path} onClick={() => setModifyMode(true)}>
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
        </>
      )}
    </div>,
    document.body,
  );
};
