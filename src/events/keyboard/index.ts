import type { Editor } from 'slate';
import type { KeyboardEvent } from 'react';
import { handleEnter } from './handleEnter';

export const createKeyboardHandler = (editor: Editor) => {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnter(editor);
      return;
    }
  };
};
