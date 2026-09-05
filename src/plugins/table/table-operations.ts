import { Editor, Transforms, Element } from 'slate';
import type { Descendant } from 'slate';
import type { CustomElement, CustomElementAttrs } from '@/core/types';
import { BlockElementType } from '@/enums';
import { v4 as uuidv4 } from 'uuid';
import {
  computeGrid,
  mergeTableGrid,
  splitTableGrid,
  insertRowGrid,
  insertColumnGrid,
  deleteRowGrid,
  deleteColumnGrid,
} from './table-grid';

export interface TableCellAttrs extends CustomElementAttrs {
  colspan?: number;
  rowspan?: number;
  bgColor?: string;
  width?: string;
  vertAlign?: 'top' | 'middle' | 'bottom';
}

export interface TableRowAttrs extends CustomElementAttrs {
  bgColor?: string;
}

export interface TableAttrs extends CustomElementAttrs {
  borderColor?: string;
  borderWidth?: string;
  /** 与 cell 解耦的列宽数组：每列一个像素宽度，索引即列号 */
  colWidths?: number[];
}

type NodeEntry = [CustomElement, number[]];

export const createTableCell = (attrs?: TableCellAttrs): CustomElement => ({
  type: BlockElementType.TABLE_CELL,
  id: uuidv4(),
  attrs: { width: '160px', ...attrs },
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
  // 默认每列 160px；调用方传入的 attrs（含 colWidths）可覆盖
  attrs: { colWidths: Array.from({ length: cols }, () => 160), ...attrs },
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
    if (Element.isElement(node)) {
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

// 获取表格路径：优先使用传入的 path，否则遍历文档查找
const getTablePath = (editor: Editor, tablePath?: number[]): [CustomElement, number[]] | null => {
  if (tablePath) {
    try {
      const [node] = Editor.node(editor, tablePath);
      if (Element.isElement(node) && (node as CustomElement).type === BlockElementType.TABLE) {
        return [node as CustomElement, tablePath];
      }
    } catch {
      // path 无效，回退到搜索
    }
  }
  return findTableInDocument(editor.children, []);
};

export const insertRow = (editor: Editor, at?: number, tablePath?: number[]) => {
  const foundTable = getTablePath(editor, tablePath);

  if (!foundTable) {
    const nodes: NodeEntry[] = Array.from(
      (editor as any).nodes({
        match: (n: unknown) =>
          Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
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

export const insertColumn = (editor: Editor, at?: number, tablePath?: number[]) => {
  const foundTable = getTablePath(editor, tablePath);

  if (!foundTable) {
    const nodes: NodeEntry[] = Array.from(
      (editor as any).nodes({
        match: (n: unknown) =>
          Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
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

  // 从最后一行开始插入，避免路径偏移问题
  const rows = tableElement.children as CustomElement[];
  for (let rowIndex = rows.length - 1; rowIndex >= 0; rowIndex--) {
    const rowElement = rows[rowIndex];
    const cellCount = rowElement.children.length;
    const insertIndex = at !== undefined ? Math.min(at, cellCount) : cellCount;

    Transforms.insertNodes(editor, createTableCell(), {
      at: [...tablePath, rowIndex, insertIndex],
    });
  }

  // 同步 table 节点的 colWidths 数组（列宽与 cell 解耦）
  try {
    const [curTable] = Editor.node(editor, tablePath);
    const curAttrs = ((curTable as CustomElement).attrs || {}) as TableAttrs;
    const curWidths = Array.isArray(curAttrs.colWidths)
      ? [...curAttrs.colWidths]
      : Array.from(
          { length: (tableElement.children[0] as CustomElement)?.children?.length || 0 },
          () => 160,
        );
    const insertAt = at !== undefined ? Math.min(at, curWidths.length) : curWidths.length;
    curWidths.splice(insertAt, 0, 160);
    updateTable(editor, tablePath, { colWidths: curWidths });
  } catch (err) {
    console.error('Update colWidths on insertColumn failed:', err);
  }
};

export const deleteRow = (editor: Editor) => {
  const rowNodes: NodeEntry[] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE_ROW,
    }),
  );
  const tableRowNode = rowNodes[0];

  if (!tableRowNode) return;

  const [, rowPath] = tableRowNode;
  const tableNodes: NodeEntry[] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
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
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE_CELL,
    }),
  );
  const tableCellNode = cellNodes[0];

  if (!tableCellNode) return;

  const [, cellPath] = tableCellNode;
  const colIndex = cellPath[2];

  const tableNodes: NodeEntry[] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
    }),
  );
  const tableNode = tableNodes[0];

  if (!tableNode) return;

  const [tableElement, tablePath] = tableNode;
  const firstRow = tableElement.children[0] as CustomElement;

  if (firstRow.children.length <= 1) {
    Transforms.removeNodes(editor, { at: tablePath });
  } else {
    // 从最后一行开始删除
    const rows = tableElement.children as CustomElement[];
    for (let rowIndex = rows.length - 1; rowIndex >= 0; rowIndex--) {
      Transforms.removeNodes(editor, { at: [...tablePath, rowIndex, colIndex] });
    }
    // 同步 table 节点的 colWidths 数组
    try {
      const [curTable] = Editor.node(editor, tablePath);
      const curAttrs = ((curTable as CustomElement).attrs || {}) as TableAttrs;
      const curWidths = Array.isArray(curAttrs.colWidths) ? [...curAttrs.colWidths] : [];
      if (curWidths.length > colIndex) {
        curWidths.splice(colIndex, 1);
        updateTable(editor, tablePath, { colWidths: curWidths });
      }
    } catch (err) {
      console.error('Update colWidths on deleteColumn failed:', err);
    }
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
    {
      at: cellPath,
      // 严格限定为目标单元格，避免 setNodes 把 attrs 下发到单元格内图表等后代元素
      match: (n) =>
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE_CELL,
    },
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
    {
      at: rowPath,
      // 严格限定为目标行，避免把 attrs 下发到行内单元格/图表等后代元素
      match: (n) =>
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE_ROW,
    },
  );
};

export const updateTable = (editor: Editor, tablePath: number[], attrs: Partial<TableAttrs>) => {
  // 合并已有 attrs，避免只更新 colWidths 时把 borderColor 等一起清掉
  try {
    const [node] = Editor.node(editor, tablePath);
    const existing = ((node as CustomElement).attrs || {}) as TableAttrs;
    Transforms.setNodes(
      editor,
      { attrs: { ...existing, ...attrs } },
      {
        at: tablePath,
        // 关键：match 严格限定为 table 节点本身。宽松的 Element.isElement 会把 attrs
        // 下发到表格内所有元素（单元格里的图表/图片等），覆盖并清空它们的配置。
        match: (n) => Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
      },
    );
  } catch {
    Transforms.setNodes(
      editor,
      { attrs: { ...attrs } },
      {
        at: tablePath,
        match: (n) => Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
      },
    );
  }
};

/* ================================================================== */
/* 合并 / 拆分 / 单元格颜色 / 行颜色 / 表格边框 / 删除表格                */
/* 基于 table-grid 的逻辑网格，把「逻辑行列」解析成物理 cell 再改 attrs；    */
/* 合并/拆分则整体重建 table.children（保留复杂子块引用，避免内容丢失）。 */
/* ================================================================== */

/** 读取逻辑位所在的 origin，供水平/垂直对齐、颜色等操作使用 */
export const getLogicalCell = (
  editor: Editor,
  tablePath: number[],
  row: number,
  col: number,
): { row: number; cell: number; node: CustomElement } | null => {
  try {
    const [tableEl] = Editor.node(editor, tablePath) as [CustomElement, number[]];
    const grid = computeGrid(tableEl);
    const o = grid.originAt[row]?.[col];
    if (!o) return null;
    const node = (tableEl.children[o.row] as CustomElement)?.children?.[o.cell] as CustomElement;
    return { row: o.row, cell: o.cell, node };
  } catch {
    return null;
  }
};

/** 合并逻辑矩形（含边界）为一个单元格，操作后选区由调用方重建 */
export const mergeCells = (
  editor: Editor,
  tablePath: number[],
  r0: number,
  c0: number,
  r1: number,
  c1: number,
) => {
  try {
    const [tableEl] = Editor.node(editor, tablePath) as [CustomElement, number[]];
    const newRows = mergeTableGrid(tableEl, r0, c0, r1, c1);
    applyTableRebuild(editor, tablePath, newRows);
  } catch {
    /* ignore */
  }
};

/** 拆分逻辑位 (r,c) 所在合并格，操作后选区由调用方重建 */
export const splitCell = (editor: Editor, tablePath: number[], r0: number, c0: number) => {
  try {
    const [tableEl] = Editor.node(editor, tablePath) as [CustomElement, number[]];
    const newRows = splitTableGrid(tableEl, r0, c0);
    applyTableRebuild(editor, tablePath, newRows);
  } catch {
    /* ignore */
  }
};

/**
 * 原子地整体重建 table.children（合并/拆分/插删行列共用）。
 * children 与 colWidths 必须同一时刻写入：否则 normalizeNode 会在中间态用旧 colWidths
 * 反推列数，误补幽灵格（删除一列却多出空列）或把 colWidths 覆盖错。
 */
const applyTableRebuild = (
  editor: Editor,
  tablePath: number[],
  newRows: CustomElement[],
  colWidths?: number[],
) => {
  Editor.withoutNormalizing(editor, () => {
    const [tableEl] = Editor.node(editor, tablePath) as [CustomElement, number[]];
    const prevAttrs = ((tableEl.attrs || {}) as TableAttrs) || {};
    const attrs = colWidths ? { ...prevAttrs, colWidths } : prevAttrs;
    const rebuilt = { ...tableEl, attrs, children: newRows } as CustomElement;
    Transforms.removeNodes(editor, { at: tablePath });
    Transforms.insertNodes(editor, rebuilt, { at: tablePath });
  });
};

/** 给逻辑位 (row,col) 所在 cell 设置背景色（空串清除），保留其余 attrs */
export const setCellBgColor = (
  editor: Editor,
  tablePath: number[],
  row: number,
  col: number,
  color: string,
) => {
  const info = getLogicalCell(editor, tablePath, row, col);
  if (!info) return;
  const attrs = { ...((info.node.attrs || {}) as TableCellAttrs), bgColor: color };
  updateTableCell(editor, [...tablePath, info.row, info.cell], attrs);
};

/** 给矩形选区（含边界）内所有独立 cell 设置背景色（空串清除）。去重按 origin，跨矩形边界的合并格整格上色 */
export const setCellRangeBgColor = (
  editor: Editor,
  tablePath: number[],
  r0: number,
  c0: number,
  r1: number,
  c1: number,
  color: string,
) => {
  try {
    const [tableEl] = Editor.node(editor, tablePath) as [CustomElement, number[]];
    const grid = computeGrid(tableEl);
    const top = Math.min(r0, r1);
    const bottom = Math.max(r0, r1);
    const left = Math.min(c0, c1);
    const right = Math.max(c0, c1);
    const seen = new Set<string>();
    Editor.withoutNormalizing(editor, () => {
      for (let r = top; r <= bottom; r++) {
        for (let c = left; c <= right; c++) {
          const o = grid.originAt[r]?.[c];
          if (!o) continue;
          const key = `${o.row}:${o.cell}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const cell = (tableEl.children[o.row] as CustomElement)?.children?.[o.cell] as
            CustomElement | undefined;
          if (!cell) continue;
          const attrs = { ...((cell.attrs || {}) as TableCellAttrs), bgColor: color };
          updateTableCell(editor, [...tablePath, o.row, o.cell], attrs);
        }
      }
    });
  } catch {
    /* ignore */
  }
};

/** 给矩形选区（含边界）内所有独立 cell 设置垂直对齐（去重按 origin，跨边界合并格整格设置） */
export const setCellRangeVertAlign = (
  editor: Editor,
  tablePath: number[],
  r0: number,
  c0: number,
  r1: number,
  c1: number,
  align: 'top' | 'middle' | 'bottom',
) => {
  try {
    const [tableEl] = Editor.node(editor, tablePath) as [CustomElement, number[]];
    const grid = computeGrid(tableEl);
    const top = Math.min(r0, r1);
    const bottom = Math.max(r0, r1);
    const left = Math.min(c0, c1);
    const right = Math.max(c0, c1);
    const seen = new Set<string>();
    Editor.withoutNormalizing(editor, () => {
      for (let r = top; r <= bottom; r++) {
        for (let c = left; c <= right; c++) {
          const o = grid.originAt[r]?.[c];
          if (!o) continue;
          const key = `${o.row}:${o.cell}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const cell = (tableEl.children[o.row] as CustomElement)?.children?.[o.cell] as
            CustomElement | undefined;
          if (!cell) continue;
          const attrs = { ...((cell.attrs || {}) as TableCellAttrs), vertAlign: align };
          updateTableCell(editor, [...tablePath, o.row, o.cell], attrs);
        }
      }
    });
  } catch {
    /* ignore */
  }
};

/** 给逻辑位所在 cell 设置垂直对齐（top/middle/bottom），保留其余 attrs */
export const setCellVertAlign = (
  editor: Editor,
  tablePath: number[],
  row: number,
  col: number,
  align: 'top' | 'middle' | 'bottom',
) => {
  const info = getLogicalCell(editor, tablePath, row, col);
  if (!info) return;
  const attrs = { ...((info.node.attrs || {}) as TableCellAttrs), vertAlign: align };
  updateTableCell(editor, [...tablePath, info.row, info.cell], attrs);
};

/** 给行设置背景色（空串清除），保留其余 attrs */
export const setRowBgColor = (editor: Editor, tablePath: number[], row: number, color: string) => {
  try {
    const [rowNode] = Editor.node(editor, [...tablePath, row]) as [CustomElement, number[]];
    const attrs = { ...((rowNode.attrs || {}) as TableRowAttrs), bgColor: color };
    updateTableRow(editor, [...tablePath, row], attrs);
  } catch {
    /* ignore */
  }
};

/** 设置表格边框颜色 / 宽度 */
export const setTableBorder = (
  editor: Editor,
  tablePath: number[],
  patch: { borderColor?: string; borderWidth?: string },
) => {
  updateTable(editor, tablePath, { ...patch });
};

/** 删除整个表格 */
export const deleteTable = (editor: Editor, tablePath: number[]) => {
  Transforms.removeNodes(editor, { at: tablePath });
};

/* ================================================================== */
/* 网格感知的行/列插入与删除（配合合并布局，走整体重建）                    */
/* ================================================================== */

const getTableEntry = (editor: Editor, tablePath: number[]): [CustomElement, number[]] => {
  return Editor.node(editor, tablePath) as [CustomElement, number[]];
};

/**
 * 读取一致化的列宽数组：优先 table.attrs.colWidths；缺失/为空时按逻辑网格从各列 origin
 * cell 的 width 推导（colspan/rowspan 感知），补齐到 cols 列。
 */
const readColWidths = (tableEl: CustomElement, fallbackCols?: number): number[] => {
  const attrs = ((tableEl.attrs || {}) as TableAttrs) || {};
  if (Array.isArray(attrs.colWidths) && attrs.colWidths.length > 0) {
    return attrs.colWidths.map((w) => Number(w) || 160);
  }
  const grid = computeGrid(tableEl);
  const cols = Math.max(fallbackCols ?? 0, grid.cols);
  const widths: number[] = new Array(cols).fill(160);
  for (let c = 0; c < grid.cols; c++) {
    for (let r = 0; r < grid.rows; r++) {
      const o = grid.originAt[r]?.[c];
      if (!o) continue;
      const cellNode = (tableEl.children?.[o.row] as CustomElement | undefined)?.children?.[
        o.cell
      ] as CustomElement | undefined;
      const w = parseInt(((cellNode?.attrs as any)?.width as string) || '', 10);
      if (w && !Number.isNaN(w)) widths[c] = w;
      break;
    }
  }
  return widths;
};

/** 在逻辑行 at（0..rows，缺省追加末尾）插入一行 */
export const insertRowAt = (editor: Editor, tablePath: number[], at?: number) => {
  try {
    const [tableEl] = getTableEntry(editor, tablePath);
    const r = at !== undefined ? at : computeGrid(tableEl).rows;
    const newRows = insertRowGrid(tableEl, r);
    applyTableRebuild(editor, tablePath, newRows);
  } catch {
    /* ignore */
  }
};

/** 删除逻辑行 r；仅剩一行时删除整个表格 */
export const deleteRowAt = (editor: Editor, tablePath: number[], r: number) => {
  try {
    const [tableEl] = getTableEntry(editor, tablePath);
    const grid = computeGrid(tableEl);
    if (grid.rows <= 1) {
      Transforms.removeNodes(editor, { at: tablePath });
      return;
    }
    const newRows = deleteRowGrid(tableEl, r);
    applyTableRebuild(editor, tablePath, newRows);
  } catch {
    /* ignore */
  }
};

/** 在逻辑列 at（0..cols，缺省追加末尾）插入一列，并原子同步 colWidths */
export const insertColumnAt = (editor: Editor, tablePath: number[], at?: number) => {
  try {
    const [tableEl] = getTableEntry(editor, tablePath);
    const grid = computeGrid(tableEl);
    const c = at !== undefined ? at : grid.cols;
    const newRows = insertColumnGrid(tableEl, c);
    const widths = readColWidths(tableEl, grid.cols);
    const idx = Math.max(0, Math.min(c, widths.length));
    widths.splice(idx, 0, 160);
    applyTableRebuild(editor, tablePath, newRows, widths);
  } catch {
    /* ignore */
  }
};

/** 删除逻辑列 col；仅剩一列时删除整个表格，并原子同步 colWidths */
export const deleteColumnAt = (editor: Editor, tablePath: number[], col: number) => {
  try {
    const [tableEl] = getTableEntry(editor, tablePath);
    const grid = computeGrid(tableEl);
    if (grid.cols <= 1) {
      Transforms.removeNodes(editor, { at: tablePath });
      return;
    }
    const newRows = deleteColumnGrid(tableEl, col);
    const widths = readColWidths(tableEl, grid.cols);
    if (col < widths.length) widths.splice(col, 1);
    else if (widths.length > grid.cols - 1) widths.length = grid.cols - 1;
    applyTableRebuild(editor, tablePath, newRows, widths);
  } catch {
    /* ignore */
  }
};
