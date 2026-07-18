import type { Editor } from 'slate';
import { handleEnterAtBlockEnd } from '@/utils/block-behaviors';

export const withEditor = (editor: Editor): Editor => {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    if (handleEnterAtBlockEnd(editor)) {
      return;
    }
    insertBreak();
  };

  return editor;
};
