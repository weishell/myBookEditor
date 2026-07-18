import type { Editor } from 'slate';
import type { KeyboardEvent } from 'react';

type KeyHandler = (editor: Editor, e: KeyboardEvent) => boolean;

interface KeyHandlerMap {
  [key: string]: KeyHandler;
}

export const createKeyboardHandler = (editor: Editor) => {
  const keyHandlers: KeyHandlerMap = {};

  const registerHandler = (key: string, handler: KeyHandler) => {
    keyHandlers[key] = handler;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    if (e.shiftKey && e.key === 'Enter') {
      if (keyHandlers['shift+enter']) {
        if (keyHandlers['shift+enter'](editor, e)) {
          e.preventDefault();
        }
      }
      return;
    }

    if (keyHandlers[key]) {
      if (keyHandlers[key](editor, e)) {
        e.preventDefault();
      }
    }
  };

  return {
    handleKeyDown,
    registerHandler,
  };
};

export const defaultKeyHandlers: KeyHandlerMap = {};
