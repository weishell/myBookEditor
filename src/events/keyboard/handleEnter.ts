import type { Editor } from 'slate';
import { handleEnterAtBlockEnd } from '@/utils/block-behaviors';

export const handleEnter = (editor: Editor) => {
  if (!handleEnterAtBlockEnd(editor)) {
    editor.insertBreak();
  }
};
