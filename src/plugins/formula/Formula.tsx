import { useMemo, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { RenderElementProps } from 'slate-react';
import { useSlate, useSelected, ReactEditor } from 'slate-react';
import { updateFormula, type FormulaElement } from './formula-utils';
import { renderFormulaToHtml } from './katex-utils';
import { FormulaEditor } from './FormulaEditor';
import { useTheme } from '@/context/ThemeContext';
import { getInlineMarkStyle } from '@/utils/inline-mark-style';
import styles from './Formula.module.less';

interface FormulaProps {
  element: FormulaElement;
  attributes: RenderElementProps['attributes'];
  readOnly?: boolean;
}

export const Formula = ({ element, attributes, readOnly }: FormulaProps) => {
  const editor = useSlate();
  const isSelected = useSelected();
  const { isDarkMode } = useTheme();
  const [editing, setEditing] = useState(false);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const value = element.attrs?.value ?? '';

  // 选中公式后调「文字颜色 / 背景色」时，颜色 mark 落在子文本节点上；
  // 公式是自绘元素，这里把它取出来套到渲染结果上，颜色才真正生效。
  const markStyle = getInlineMarkStyle(element, isDarkMode);

  // 合并 slate 注入的 ref 与自身的 anchor ref
  const { ref: slateRef, ...restAttributes } = attributes;
  const mergedRef = useCallback(
    (node: HTMLSpanElement | null) => {
      spanRef.current = node;
      if (typeof slateRef === 'function') {
        (slateRef as (n: unknown) => void)(node);
      } else if (slateRef && 'current' in slateRef) {
        (slateRef as { current: unknown }).current = node;
      }
    },
    [slateRef],
  );

  const html = useMemo(() => renderFormulaToHtml(value), [value]);

  const handleCopy = useCallback(
    (e: React.ClipboardEvent) => {
      if (value) {
        e.clipboardData?.setData('text/plain', value);
      }
    },
    [value],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (readOnly) return;
      // 点击公式：打开编辑弹层
      setEditing(true);
    },
    [readOnly],
  );

  // 编辑结束保存（点击外部 / ESC / 失焦统一入口）
  const handleCommit = useCallback(
    (next: string) => {
      const trimmed = next.trim();
      if (trimmed) {
        // 用 ReactEditor.findPath 精确定位当前节点并更新，先保存再关闭
        try {
          const path = ReactEditor.findPath(editor, element);
          updateFormula(editor, [element, path], trimmed);
        } catch {
          // 节点已不存在则忽略
        }
      }
      setEditing(false);
    },
    // element 引用跟随每次渲染更新；editor 为稳定引用
    [editor, element],
  );

  const handleCancel = useCallback(() => {
    setEditing(false);
  }, []);

  return (
    <>
      <span
        ref={mergedRef}
        {...restAttributes}
        data-inline-formula
        data-formula={value}
        contentEditable={false}
        suppressContentEditableWarning
        className={`${styles.formula} ${isSelected ? styles.isSelected : ''}`}
        style={markStyle}
        onMouseDown={readOnly ? undefined : (e) => e.preventDefault()}
        onClick={handleClick}
        onCopy={handleCopy}
        title={value}
      >
        {html ? (
          <span className={styles.katexWrap} dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <span className={styles.formulaPlaceholder}>∑</span>
        )}
      </span>
      {editing &&
        !readOnly &&
        createPortal(
          <FormulaEditor
            initialValue={value}
            anchorRef={spanRef}
            onCommit={handleCommit}
            onCancel={handleCancel}
          />,
          document.body,
        )}
    </>
  );
};
