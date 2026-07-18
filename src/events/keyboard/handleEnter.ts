import type { Editor } from 'slate';
import { Editor as SlateEditor, Transforms, Point } from 'slate';
import { BlockElementType } from '@/enums';
import { handleEnterAtBlockEnd } from '@/utils/block-behaviors';

const isSelectionCollapsed = (selection: any): boolean => {
  if (!selection) return false;
  return Point.equals(selection.anchor, selection.focus);
};

export const handleEnter = (editor: Editor) => {
  const { selection } = editor;
  if (!selection || !isSelectionCollapsed(selection)) {
    editor.insertBreak();
    return;
  }

  const match = SlateEditor.above(editor, {
    match: (n: any) => SlateEditor.isBlock(editor, n),
    mode: 'lowest',
  });

  if (match) {
    const [blockNode] = match;
    const blockType = (blockNode as any)?.type as BlockElementType;

    if (blockType === BlockElementType.CODE_BLOCK) {
      Transforms.insertText(editor, '\n');
      return;
    }
  }

  if (!handleEnterAtBlockEnd(editor)) {
    editor.insertBreak();
  }
};
