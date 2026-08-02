// 飞书风格跟随光标的行内提示气泡（InlineToast）
//
// 使用场景：替代 message 弹窗，做操作反馈提示，例如：
//   - 按 Tab 但选区含非文本块时，提示"缩进仅针对文本类内容"
//   - 达到最大缩进时，提示"已达到最大缩进限制"
//
// 触发方式：调用 showCursorToast(editor, toastKey)，
//           内部通过 ReactEditor.toDOMRange 定位光标，Portal 到 body。
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { ReactEditor } from 'slate-react';
import { Editor } from 'slate';
import styles from './InlineToast.module.less';

export type ToastKey = 'toast.indentOnlyText' | 'toast.indentMaxReached';

interface ToastItem {
  id: number;
  messageKey: ToastKey;
  x: number;
  y: number;
}

let toastId = 0;

export function showCursorToast(editor: Editor, messageKey: ToastKey): void {
  try {
    const domRange = ReactEditor.toDOMRange(editor as any, editor.selection as any);
    const rect = domRange.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + window.scrollX;
    const y = rect.bottom + window.scrollY + 8;
    InlineToastManager.show(messageKey, x, y);
  } catch {
    const editorEl = document.querySelector('[data-slate-editor]');
    if (editorEl) {
      const r = editorEl.getBoundingClientRect();
      InlineToastManager.show(
        messageKey,
        r.left + r.width / 2 + window.scrollX,
        r.top + window.scrollY + 8,
      );
    }
  }
}

class InlineToastManagerClass {
  private listeners = new Set<(toasts: ToastItem[]) => void>();
  private toasts: ToastItem[] = [];
  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  show(messageKey: ToastKey, x: number, y: number): void {
    const id = ++toastId;
    this.toasts = [...this.toasts, { id, messageKey, x, y }];
    this.emit();

    const timer = setTimeout(() => this.dismiss(id), 2000);
    this.timers.set(id, timer);
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.emit();
  }

  subscribe(fn: (toasts: ToastItem[]) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit(): void {
    this.listeners.forEach((fn) => fn(this.toasts));
  }
}

export const InlineToastManager = new InlineToastManagerClass();

export const InlineToastHost: React.FC = () => {
  const { t } = useTranslation();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return InlineToastManager.subscribe(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  return createPortal(
    <div>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={styles.toast}
          style={{ left: toast.x, top: toast.y }}
          onClick={() => InlineToastManager.dismiss(toast.id)}
        >
          <span className={styles.icon}>💡</span>
          <span className={styles.message}>{t(toast.messageKey)}</span>
        </div>
      ))}
    </div>,
    document.body,
  );
};
