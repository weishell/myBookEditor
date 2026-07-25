import { Editor, Transforms, Element as SlateElement } from 'slate';
import type { Descendant } from 'slate';
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

// 通过遍历文档树查找表格节点
const findTableInDocument = (
  nodes: Descendant[],
  path: number[],
): [CustomElement, number[]] | null => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (SlateElement.isElement(node)) {
      const currentPath = [...path, i];
      if ((node as CustomElement).type === BlockElementType.TABLE) {
        return [node as CustomElement, currentPath];
      }
      if (node.children && node.children.length > 0) {
        const found = findTableInDocument(node.children, currentPath);
        if (found) return found;
      }
    }
  }
  return null;
};

export const insertRow = (editor: Editor, at?: number) => {
  // 方法1：通过文档树遍历查找表格
  const foundTable = findTableInDocument(editor.children, []);

  if (!foundTable) {
    // 方法2：回退到使用 nodes() 查找
    const nodes: NodeEntry[] = Array.from(
      (editor as any).nodes({
        match: (n: unknown) =>
          SlateElement.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
      }),
    );
    if (nodes.length === 0) return;
    return insertRowInternal(editor, nodes[0], at);
  }

  return insertRowInternal(editor, foundTable, at);
};

const insertRowInternal = (editor: Editor, tableNode: [CustomElement, number[]], at?: number) => {
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
  // 方法1：通过文档树遍历查找表格
  const foundTable = findTableInDocument(editor.children, []);

  if (!foundTable) {
    // 方法2：回退到使用 nodes() 查找
    const nodes: NodeEntry[] = Array.from(
      (editor as any).nodes({
        match: (n: unknown) =>
          SlateElement.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
      }),
    );
    if (nodes.length === 0) return;
    return insertColumnInternal(editor, nodes[0], at);
  }

  return insertColumnInternal(editor, foundTable, at);
};

const insertColumnInternal = (
  editor: Editor,
  tableNode: [CustomElement, number[]],
  at?: number,
) => {
  const [tableElement, tablePath] = tableNode;

  tableElement.children.forEach((row, rowIndex) => {
    const rowElement = row as CustomElement;
    const cellCount = rowElement.children.length;
    const insertIndex = at !== undefined ? Math.min(at, cellCount) : cellCount;

    Transforms.insertNodes(editor, createTableCell(), {
      at: [...tablePath, rowIndex, insertIndex],
    });
  });
};

export const deleteRow = (editor: Editor) => {
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
      Transforms.removeNodes(editor, { at: [...tablePath, rowIndex, colIndex] });
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
