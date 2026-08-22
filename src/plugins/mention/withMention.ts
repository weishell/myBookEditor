import type { Editor } from 'slate';
import { BlockElementType } from '@/enums';

/**
 * 艾特（@）行内元素扩展：
 *  - isInline：艾特作为行内元素存在于段落文本流中
 *  - isVoid：艾特内部不可编辑，显示名称存放在 attrs.name
 */
export const withMention = (editor: Editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    if (element.type === BlockElementType.MENTION) return true;
    return isInline(element);
  };

  editor.isVoid = (element) => {
    if (element.type === BlockElementType.MENTION) return true;
    return isVoid(element);
  };

  return editor;
};
