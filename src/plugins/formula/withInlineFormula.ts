import type { Editor } from 'slate';
import { BlockElementType } from '@/enums';

/**
 * 行内公式扩展：
 *  - isInline：公式作为行内元素存在于段落文本流中（非独立块）
 *  - isVoid：公式内部不可编辑，LaTeX 内容存放在 attrs.value
 */
export const withInlineFormula = (editor: Editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    if (element.type === BlockElementType.FORMULA) return true;
    return isInline(element);
  };

  editor.isVoid = (element) => {
    if (element.type === BlockElementType.FORMULA) return true;
    return isVoid(element);
  };

  return editor;
};
