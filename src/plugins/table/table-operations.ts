import { Editor, Transforms, Element as SlateElement } from 'slate';
import type { CustomElement, CustomElementAttrs } from '@/components/Editor/types';
import { BlockElementType } from '@/enums';
import { v4 as uuidv4 } from 'uuid';

export interface TableCellAttrs extends CustomElementAttrs {
  colspan?: number;
  rowspan?: number;
  bgColor?: string;
  width?: string;
}

export interface TableRowAttrs extends CustomElementAttrs {
  bgColor?: string;
}

export interface TableAttrs extends CustomElementAttrs {
  borderColor?: string;
  borderWidth?: string;
}

type NodeEntry = [CustomElement, number[]];

export const createTableCell = (attrs?: TableCellAttrs): CustomElement => ({
  type: BlockElementType.TABLE_CELL,
  id: uuidv4(),
  attrs,
  children: [
    {
      type: BlockElementType.PARAGRAPH,
      id: uuidv4(),
      attrs: {},
      children: [{ text: '' }],
    } as CustomElement,
  ],
});

export const createTableRow = (cellCount: number, attrs?: TableRowAttrs): CustomElement => ({
  type: BlockElementType.TABLE_ROW,
  id: uuidv4(),
  attrs,
  children: Array.from({ length: cellCount }, () => createTableCell()),
});

export const createTable = (rows: number, cols: number, attrs?: TableAttrs): CustomElement => ({
  type: BlockElementType.TABLE,
  id: uuidv4(),
  attrs,
  children: Array.from({ length: rows }, () => createTableRow(cols)),
});

export const insertTable = (editor: Editor, rows: number = 3, cols: number = 3) => {
  const table = createTable(rows, cols);
  Transforms.insertNodes(editor, table);
};

export const insertRow = (editor: Editor, at?: number) => {
  const { selection } = editor;
  if (!selection) return;

  const nodes: NodeEntry[] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        SlateElement.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
    }),
  );
  const tableNode = nodes[0];

  if (!tableNode) return;

  const [tableElement, tablePath] = tableNode;
  const rowCount = tableElement.children.length;
  const firstRow = tableElement.children[0] as CustomElement;
  const colCount = firstRow ? firstRow.children.length : 3;

  const newRow = createTableRow(colCount);
  const insertIndex = at !== undefined ? Math.min(at, rowCount) : rowCount;

  Transforms.insertNodes(editor, newRow, {
    at: [...tablePath, insertIndex],
  });
};

export const insertColumn = (editor: Editor, at?: number) => {
  const { selection } = editor;
  if (!selection) return;

  const nodes: NodeEntry[] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        SlateElement.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
    }),
  );
  const tableNode = nodes[0];

  if (!tableNode) return;

  const [tableElement] = tableNode;

  tableElement.children.forEach((row, rowIndex) => {
    const rowElement = row as CustomElement;
    const cellCount = rowElement.children.length;
    const insertIndex = at !== undefined ? Math.min(at, cellCount) : cellCount;

    Transforms.insertNodes(editor, createTableCell(), {
      at: [0, rowIndex, insertIndex],
    });
  });
};

export const deleteRow = (editor: Editor) => {
  const { selection } = editor;
  if (!selection) return;

  const rowNodes: NodeEntry[] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        SlateElement.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE_ROW,
    }),
  );
  const tableRowNode = rowNodes[0];

  if (!tableRowNode) return;

  const [, rowPath] = tableRowNode;
  const tableNodes: NodeEntry[] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        SlateElement.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
    }),
  );
  const tableNode = tableNodes[0];

  if (!tableNode) return;

  const [tableElement, tablePath] = tableNode;
  if (tableElement.children.length <= 1) {
    Transforms.removeNodes(editor, { at: tablePath });
  } else {
    Transforms.removeNodes(editor, { at: rowPath });
  }
};

export const deleteColumn = (editor: Editor) => {
  const { selection } = editor;
  if (!selection) return;

  const cellNodes: NodeEntry[] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        SlateElement.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE_CELL,
    }),
  );
  const tableCellNode = cellNodes[0];

  if (!tableCellNode) return;

  const [, cellPath] = tableCellNode;
  const colIndex = cellPath[2];

  const tableNodes: NodeEntry[] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        SlateElement.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
    }),
  );
  const tableNode = tableNodes[0];

  if (!tableNode) return;

  const [tableElement, tablePath] = tableNode;
  const firstRow = tableElement.children[0] as CustomElement;

  if (firstRow.children.length <= 1) {
    Transforms.removeNodes(editor, { at: tablePath });
  } else {
    tableElement.children.forEach((_, rowIndex) => {
      Transforms.removeNodes(editor, { at: [0, rowIndex, colIndex] });
    });
  }
};

export const updateTableCell = (
  editor: Editor,
  cellPath: number[],
  attrs: Partial<TableCellAttrs>,
) => {
  Transforms.setNodes(
    editor,
    { attrs: { ...attrs } },
    { at: cellPath, match: (n) => SlateElement.isElement(n) },
  );
};

export const updateTableRow = (
  editor: Editor,
  rowPath: number[],
  attrs: Partial<TableRowAttrs>,
) => {
  Transforms.setNodes(
    editor,
    { attrs: { ...attrs } },
    { at: rowPath, match: (n) => SlateElement.isElement(n) },
  );
};

export const updateTable = (editor: Editor, tablePath: number[], attrs: Partial<TableAttrs>) => {
  Transforms.setNodes(
    editor,
    { attrs: { ...attrs } },
    { at: tablePath, match: (n) => SlateElement.isElement(n) },
  );
};
