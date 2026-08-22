import { useEffect, useMemo, useRef, useState } from 'react';
import { renderFormulaToHtml } from './katex-utils';
import styles from './FormulaEditor.module.less';

interface FormulaEditorProps {
  initialValue?: string;
  /** 定位锚点（公式所在元素 / FloatBar 工具栏），弹层出现在其下方；点击锚点本身不关闭 */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** 对齐方式：center = 居中（默认），left = 左对齐 */
  align?: 'center' | 'left';
  /** 保存并关闭（唯一出口：点击弹框外部区域 或 按 ESC） */
  onCommit: (value: string) => void;
  onCancel?: () => void;
}

export const FormulaEditor = ({
  initialValue = '',
  anchorRef,
  align = 'center',
  onCommit,
}: FormulaEditorProps) => {
  const [value, setValue] = useState(initialValue);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  // 始终保存最新输入值，供 document 监听器回调使用（避免闭包过期）
  const valueRef = useRef(value);
  valueRef.current = value;

  // 实时预览公式
  const previewHtml = useMemo(() => renderFormulaToHtml(value), [value]);

  // 计算定位：锚点下方
  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let left: number;
    if (align === 'left') {
      left = rect.left;
    } else {
      left = rect.left + rect.width / 2 - 260;
    }
    left = Math.max(16, Math.min(left, window.innerWidth - 536));
    setPosition({
      top: rect.bottom + 8,
      left,
    });
    // 确保 textarea 拿到焦点
    const timer = window.setTimeout(() => {
      const ta = inputRef.current;
      if (!ta) return;
      ta.focus();
      const len = ta.value.length;
      ta.setSelectionRange(len, len);
    }, 30);
    return () => window.clearTimeout(timer);
  }, [anchorRef, align]);

  // 唯一的保存出口：点击弹框/锚点之外，或按 ESC
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 点击弹框内部或锚点本身：不关闭、不保存
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onCommit(valueRef.current);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCommit(valueRef.current);
      }
    };
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [onCommit, anchorRef]);

  return (
    <div
      ref={panelRef}
      className={styles.editor}
      data-formula-editor
      style={{ top: position.top, left: position.left }}
    >
      <div className={styles.inputBox}>
        <textarea
          ref={inputRef}
          className={styles.input}
          value={value}
          placeholder="输入 LaTeX 公式，如 E=mc^2"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              onCommit(valueRef.current);
            }
          }}
        />
      </div>
      {/* 实时预览区 */}
      <div className={styles.previewBox}>
        {previewHtml ? (
          <span
            className={styles.previewContent}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <span className={styles.previewPlaceholder}>公式预览效果</span>
        )}
      </div>
      <div className={styles.footer}>
        <span className={styles.footerTip}>按 ESC 完成输入，点击其他位置保存</span>
        <a
          className={styles.footerHelp}
          href="https://katex.org/docs/supported"
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          查看帮助文档
        </a>
      </div>
    </div>
  );
};
