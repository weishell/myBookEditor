import type { Editor } from 'slate';
import { handleEnter } from './handleEnter';

export const createKeyboardHandler = (editor: Editor) => {
  return (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnter(editor);
      return;
    }
  };
};
