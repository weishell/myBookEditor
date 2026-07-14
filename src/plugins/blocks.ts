import type { Editor } from 'slate';
import { Transforms, Element as SlateElement } from 'slate';
import { BlockElementType } from '@/enums';

export const toggleBlock = (editor: Editor, format: BlockElementType) => {
  const isActive = isBlockActive(editor, format);

  Transforms.setNodes(
    editor,
    { type: isActive ? BlockElementType.PARAGRAPH : format } as Partial<SlateElement>,
    { match: (n) => SlateElement.isElement(n) && (editor as any).isBlock(n) },
  );
};

export const isBlockActive = (editor: Editor, format: BlockElementType) => {
  const { selection } = editor;
  if (!selection) return false;

  const nodes = Array.from(
    (editor as any).nodes({
      at: (editor as any).unhangRange(selection),
      match: (n: unknown) =>
        !(n as any).isEditor &&
        SlateElement.isElement(n) &&
        (n as { type?: BlockElementType }).type === format,
    }),
  );

  return nodes.length > 0;
};
