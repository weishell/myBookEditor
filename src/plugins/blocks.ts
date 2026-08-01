import { Editor, Transforms, Element } from 'slate';
import { BlockElementType } from '@/enums';

interface ToggleBlockOptions {
  level?: number;
}

export const toggleBlock = (
  editor: Editor,
  format: BlockElementType,
  options?: ToggleBlockOptions,
) => {
  const isActive = isBlockActive(editor, format, options);

  if (format === BlockElementType.HEADING && options?.level) {
    Transforms.setNodes(
      editor,
      {
        type: isActive ? BlockElementType.PARAGRAPH : format,
        attrs: { level: options.level },
      } as Partial<Element>,
      { match: (n) => Element.isElement(n) && (editor as any).isBlock(n) },
    );
  } else {
    Transforms.setNodes(
      editor,
      { type: isActive ? BlockElementType.PARAGRAPH : format } as Partial<Element>,
      { match: (n) => Element.isElement(n) && (editor as any).isBlock(n) },
    );
  }
};

export const isBlockActive = (
  editor: Editor,
  format: BlockElementType,
  options?: ToggleBlockOptions,
) => {
  const { selection } = editor;
  if (!selection) return false;

  const nodes = Array.from(
    (editor as any).nodes({
      at: (editor as any).unhangRange(selection),
      match: (n: unknown) => {
        if (!(n as any).isEditor && Element.isElement(n)) {
          const node = n as { type?: BlockElementType; attrs?: { level?: number } };
          if (format === BlockElementType.HEADING && options?.level) {
            return node.type === format && node.attrs?.level === options.level;
          }
          return node.type === format;
        }
        return false;
      },
    }),
  );

  return nodes.length > 0;
};
