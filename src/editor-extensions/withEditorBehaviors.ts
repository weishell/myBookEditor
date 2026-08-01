import type { Editor } from 'slate';
import { BlockElementType } from '@/enums';

/**
 * 集中管理 Slate 编辑器行为：
 * - isVoid：声明 void 元素（divider / image）
 *   声明后 Slate 点击 void 元素会自动选中它（useSelected 返回 true）
 */
export const withEditorBehaviors = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    switch (element.type) {
      case BlockElementType.DIVIDER:
      case BlockElementType.IMAGE_BLOCK:
        return true;
      default:
        return isVoid(element);
    }
  };

  return editor;
};
