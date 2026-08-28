import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './HyperlinkEditor.module.less';

interface HyperlinkEditorProps {
  initialText: string;
  initialUrl: string;
  /** 定位锚点（超链接元素 / 触发按钮），弹层出现在其下方 */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** 保存并关闭 */
  onCommit: (text: string, url: string) => void;
  /** 移除链接 */
  onRemove?: () => void;
  onCancel: () => void;
}

export const HyperlinkEditor = ({
  initialText,
  initialUrl,
  anchorRef,
  onCommit,
  onRemove,
  onCancel,
}: HyperlinkEditorProps) => {
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);
  const [position, setPosition] = useState({ top: 0, left: -160 });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const el = anchorRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const left = rect.left + rect.width / 2 - 160;
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(8, Math.min(left, window.innerWidth - 336)),
      });
    }
    const timer = window.setTimeout(() => {
      // 初始聚焦：有文本则聚焦链接地址，否则聚焦文本
      if (textInputRef.current && !initialText) {
        textInputRef.current.focus();
      } else if (urlInputRef.current) {
        urlInputRef.current.focus();
        const len = urlInputRef.current.value.length;
        urlInputRef.current.setSelectionRange(len, len);
      }
      if (panelRef.current) panelRef.current.focus();
    }, 30);
    return () => window.clearTimeout(timer);
  }, [anchorRef, initialText]);

  // 点击弹层内部不关闭；ESC 关闭
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (panelRef.current?.contains(e.target as HTMLElement)) return;
      onCancel();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCancel();
      }
    };
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [onCancel]);

  const trimmedText = text.trim();
  const trimmedUrl = url.trim();
  const canCommit = trimmedUrl.length > 0;

  const handleCommit = () => {
    if (!canCommit) return;
    onCommit(trimmedText || trimmedUrl, trimmedUrl);
  };

  return createPortal(
    <div
      ref={panelRef}
      tabIndex={-1}
      className={styles.editor}
      data-hyperlink-editor
      style={{ top: position.top, left: position.left }}
    >
      <div className={styles.field}>
        <label className={styles.label}>文本</label>
        <input
          ref={textInputRef}
          className={styles.input}
          value={text}
          placeholder="链接的显示文字"
          spellCheck={false}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCommit();
            }
          }}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>链接地址</label>
        <input
          ref={urlInputRef}
          className={styles.input}
          value={url}
          placeholder="https:// 或 www.example.com"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCommit();
            }
          }}
        />
      </div>
      {trimmedUrl && <div className={styles.urlPreview}>{trimmedUrl}</div>}
      <div className={styles.footer}>
        {onRemove && (
          <button
            className={styles.removeBtn}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            移除链接
          </button>
        )}
        <button
          className={styles.secondaryBtn}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
        >
          取消
        </button>
        <button
          className={styles.primaryBtn}
          disabled={!canCommit}
          style={canCommit ? undefined : { opacity: 0.5, cursor: 'not-allowed' }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            handleCommit();
          }}
        >
          保存
        </button>
      </div>
    </div>,
    document.body,
  );
};
