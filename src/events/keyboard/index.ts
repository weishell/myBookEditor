import type { Editor } from 'slate';
import { handleEnter } from './handleEnter';
import { handleTabIndent } from './handleTab';

export const createKeyboardHandler = (editor: Editor) => {
  return (e: React.KeyboardEvent) => {
    // Tab / Shift+Tab 缩进（始终劫持，阻止浏览器默认跳转行为）
    if (e.key === 'Tab') {
      handleTabIndent(editor, e);
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnter(editor);
      return;
    }
  };
};
