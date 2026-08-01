import { Editor, Element, Transforms, Range } from 'slate';
import type { CustomElement } from '@/core/types';
import { BlockElementType } from '@/enums';
import { v4 as uuidv4 } from 'uuid';

type NodeEntry = [CustomElement, number[]];

const isInTable = (editor: Editor) => {
  const [table] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
    }),
  );
  return !!table;
};

const getCellPath = (editor: Editor): number[] | null => {
  const nodes: NodeEntry[] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE_CELL,
    }),
  );
  const cell = nodes[0];
  return cell ? cell[1] : null;
};

export const withTable = (editor: Editor) => {
  const { normalizeNode, insertBreak } = editor;

  editor.insertBreak = () => {
    if (!isInTable(editor)) {
      insertBreak();
      return;
    }

    const cellPath = getCellPath(editor);
    if (!cellPath) {
      insertBreak();
      return;
    }

    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) {
      insertBreak();
      return;
    }

    const [paragraph] = Editor.node(editor, [...cellPath, 0]);
    const paragraphElement = paragraph as CustomElement;

    if (paragraphElement.children.length === 0 || !paragraphElement.children[0]) {
      return;
    }

    Transforms.insertNodes(
      editor,
      {
        type: BlockElementType.PARAGRAPH,
        id: uuidv4(),
        attrs: {},
        children: [{ text: '' }],
      } as CustomElement,
      {
        at: [...cellPath, 1],
      },
    );

    Transforms.select(editor, {
      anchor: { path: [...cellPath, 1, 0], offset: 0 },
      focus: { path: [...cellPath, 1, 0], offset: 0 },
    });
  };

  editor.normalizeNode = ([node, path]) => {
    const element = node as { type?: string };

    if (element.type === BlockElementType.TABLE) {
      const table = node as CustomElement;
      if (!table.children || table.children.length === 0) {
        return;
      }

      const colCount = (table.children[0] as CustomElement)?.children?.length || 0;
      table.children.forEach((row) => {
        const rowElement = row as CustomElement;
        const rowChildren = rowElement.children || [];
        if (rowChildren.length < colCount) {
          const needed = colCount - rowChildren.length;
          for (let i = 0; i < needed; i++) {
            rowElement.children.push({
              type: BlockElementType.TABLE_CELL,
              id: uuidv4(),
              attrs: {},
              children: [
                {
                  type: BlockElementType.PARAGRAPH,
                  id: uuidv4(),
                  attrs: {},
                  children: [{ text: '' }],
                } as CustomElement,
              ],
            } as CustomElement);
          }
        }
      });
    }

    if (element.type === BlockElementType.TABLE_CELL) {
      const cell = node as CustomElement;
      if (!cell.children || cell.children.length === 0) {
        cell.children = [
          {
            type: BlockElementType.PARAGRAPH,
            id: uuidv4(),
            attrs: {},
            children: [{ text: '' }],
          } as CustomElement,
        ];
      }
    }

    normalizeNode([node, path]);
  };

  return editor;
};
