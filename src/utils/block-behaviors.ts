import { BlockElementType } from '@/enums';
import type { Editor } from 'slate';
import { Editor as SlateEditor, Point, Transforms, Path } from 'slate';
import { v4 as uuidv4 } from 'uuid';

export const ENTER_KEY_BEHAVIORS: Map<BlockElementType, BlockElementType> = new Map([
  [BlockElementType.HEADING_ONE, BlockElementType.PARAGRAPH],
  [BlockElementType.HEADING_TWO, BlockElementType.PARAGRAPH],
  [BlockElementType.HEADING_THREE, BlockElementType.PARAGRAPH],
]);

export const shouldEnterCreateNewBlock = (blockType: BlockElementType): boolean => {
  return ENTER_KEY_BEHAVIORS.has(blockType);
};

export const getNewBlockTypeOnEnter = (blockType: BlockElementType): BlockElementType => {
  return ENTER_KEY_BEHAVIORS.get(blockType) || BlockElementType.PARAGRAPH;
};

export const isSelectionCollapsed = (selection: any): boolean => {
  if (!selection) return false;
  return (
    selection.anchor.path.length === selection.focus.path.length &&
    selection.anchor.path.every((v: number, i: number) => v === selection.focus.path[i]) &&
    selection.anchor.offset === selection.focus.offset
  );
};

export const isAtEndOfBlock = (editor: Editor, blockPath: Path): boolean => {
  const { selection } = editor;
  if (!selection || !isSelectionCollapsed(selection)) return false;

  const blockEnd = SlateEditor.end(editor, blockPath);
  return Point.equals(selection.anchor, blockEnd);
};

export const handleEnterAtBlockEnd = (editor: Editor): boolean => {
  const { selection } = editor;
  if (!selection || !isSelectionCollapsed(selection)) return false;

  const match = SlateEditor.above(editor, {
    match: (n: any) => SlateEditor.isBlock(editor, n),
    mode: 'lowest',
  });

  if (!match) return false;

  const [blockNode, blockPath] = match;
  const blockType = (blockNode as any)?.type as BlockElementType;

  if (!shouldEnterCreateNewBlock(blockType) || !isAtEndOfBlock(editor, blockPath)) {
    return false;
  }

  const newBlockType = getNewBlockTypeOnEnter(blockType);
  const newBlock = {
    type: newBlockType,
    id: uuidv4(),
    children: [{ text: '' }],
  };
  const insertPath = Path.next(blockPath);
  Transforms.insertNodes(editor, newBlock, { at: insertPath });
  Transforms.select(editor, {
    anchor: { path: [...insertPath, 0], offset: 0 },
    focus: { path: [...insertPath, 0], offset: 0 },
  });

  return true;
};
