import type { Editor } from 'slate';
import { handleEnter } from './handleEnter';
import { handleTabIndent } from './handleTab';

export const createKeyboardHandler = (editor: Editor) => {
  return (e: React.KeyboardEvent) => {
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
