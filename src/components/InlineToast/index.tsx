// 飞书风格跟随光标的行内提示气泡（InlineToast）
//
// 使用场景：替代 message 弹窗，做操作反馈提示，例如：
//   - 按 Tab 但选区含非文本块时，提示"缩进仅针对文本类内容"
//   - 达到最大缩进时，提示"已达到最大缩进限制"
//
// ⚠️ 这个模块只放「渲染」，不许 import slate —— 它被 App.tsx 顶层渲染，
// 一旦引入 slate，首页也得先下载 60 kB 编辑器内核。
// 需要按光标定位的 showCursorToast 在 ./showCursorToast（只有编辑器内部会引）。
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { InlineToastManager, type ToastItem } from './manager';
import styles from './InlineToast.module.less';

export { InlineToastManager } from './manager';
export type { ToastKey, ToastItem } from './manager';

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
