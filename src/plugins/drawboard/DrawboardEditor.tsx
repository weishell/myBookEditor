// 画板（drawui）全屏编辑器 - 全屏即编辑态
import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CanvasBoard } from 'drawui-react';
import 'drawui-react/styles.css';
import styles from './Drawboard.module.less';

interface DrawboardEditorProps {
  onClose: () => void;
}

const DrawboardEditor: React.FC<DrawboardEditorProps> = ({ onClose }) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const doClose = useCallback(() => {
    onCloseRef.current();
  }, []);

  // Esc 退出全屏
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        doClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [doClose]);

  return createPortal(
    <div className={styles.fullscreen}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="8" y="14" width="9" height="7" rx="1" />
            <line x1="6.5" y1="10" x2="6.5" y2="14" />
            <line x1="17.5" y1="10" x2="17.5" y2="14" />
          </svg>
          画板
        </span>
        <span className={styles.headerHint}>Esc 退出编辑</span>
        <button className={styles.headerClose} onClick={doClose} title="退出 (Esc)">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className={styles.body}>
        <CanvasBoard />
      </div>
    </div>,
    document.body,
  );
};

export default DrawboardEditor;
