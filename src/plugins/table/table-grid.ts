// 表格逻辑网格 —— 用 colspan/rowspan 把物理单元格数组换算成「行 × 列」的逻辑格子。
// 合并/拆分/归一化都基于此网格计算，避免直接操作物理数组时被单元格跨度打乱。
import type { CustomElement } from '@/core/types';
import { BlockElementType } from '@/enums';

export interface CellOrigin {
  /** 物理行号（相对 table） */
  row: number;
  /** 在所在行 children 里的下标 */
  cell: number;
  /** 逻辑左上角列号 */
  col: number;
  colspan: number;
  rowspan: number;
}

export interface TableGrid {
  rows: number;
  cols: number;
  /** originAt[r][c]：逻辑格 (r,c) 属于哪个 cell；空位为 undefined */
  originAt: (CellOrigin | undefined)[][];
}

const keyOf = (row: number, cell: number): string => `${row}:${cell}`;

/** 收集 table 内所有真实 cell 节点，按 (row,cell) 定位存放 */
export const collectCellNodes = (table: CustomElement): Map<string, CustomElement> => {
  const map = new Map<string, CustomElement>();
  const rowChildren = (table.children as CustomElement[]) || [];
  rowChildren.forEach((row, r) => {
    ((row?.children as CustomElement[]) || []).forEach((cell, ci) => {
      map.set(keyOf(r, ci), cell);
    });
  });
  return map;
};

export const cellKey = keyOf;

/**
 * 计算表格的逻辑网格。cols 取「colWidths 长度」与「模拟摆放到的最大列」的较大者，
 * 保证表 attrs 丢失列数时仍能由各行的 colspan/rowspan 推导出完整列数。
 */
export const computeGrid = (table: CustomElement): TableGrid => {
  const rowChildren = (table.children as CustomElement[]) || [];
  const rows = rowChildren.length;
  const attrCols = (table.attrs as any)?.colWidths?.length || 0;

  const covered = new Set<string>();
  const originRows: Map<number, (CellOrigin | undefined)[]> = new Map();
  let cols = 0;

  const setOrigin = (r: number, c: number, origin: CellOrigin | undefined) => {
    if (!originRows.has(r)) originRows.set(r, []);
    const arr = originRows.get(r)!;
    while (arr.length <= c) arr.push(undefined);
    arr[c] = origin;
  };
  const isCovered = (r: number, c: number) => covered.has(`${r}|${c}`);

  rowChildren.forEach((row, r) => {
    const cells = ((row?.children as CustomElement[]) || []) as CustomElement[];
    let c = 0;
    cells.forEach((cell, ci) => {
      const attrs = (cell?.attrs || {}) as any;
      const colspan = Math.max(1, Number(attrs.colspan) || 1);
      const rowspan = Math.max(1, Number(attrs.rowspan) || 1);
      while (isCovered(r, c)) c++; // 跳过被上方 rowspan / 同行 colspan 占用的格
      const origin: CellOrigin = { row: r, cell: ci, col: c, colspan, rowspan };
      for (let dr = 0; dr < rowspan; dr++) {
        for (let dc = 0; dc < colspan; dc++) {
          setOrigin(r + dr, c + dc, origin);
          covered.add(`${r + dr}|${c + dc}`);
        }
      }
      cols = Math.max(cols, c + colspan);
      c += colspan;
    });
  });

  cols = Math.max(cols, attrCols);
  const originAt: (CellOrigin | undefined)[][] = [];
  for (let r = 0; r < rows; r++) {
    const arr = originRows.get(r) || [];
    while (arr.length < cols) arr.push(undefined);
    originAt.push(arr);
  }

  return { rows, cols, originAt };
};

/** 把物理 cell 内的段落浅拷贝出来，供合并时拼接进锚点单元格 */
const collectParagraphs = (cell: CustomElement | undefined): any[] => {
  const ps = (cell?.children as any[] | undefined) || [];
  return ps.map((p) => ({ ...p, children: (p.children || []).map((t: any) => ({ ...t })) }));
};

const makeEmptyCell = (): CustomElement =>
  ({
    type: BlockElementType.TABLE_CELL,
    id: `cell-${Math.random().toString(36).slice(2, 10)}`,
    attrs: { colspan: 1, rowspan: 1 },
    children: [
      {
        type: BlockElementType.PARAGRAPH,
        id: `p-${Math.random().toString(36).slice(2, 10)}`,
        attrs: {},
        children: [{ text: '' }],
      } as any,
    ],
  }) as CustomElement;

/* ------------------------------------------------------------------ */
/* 合并 / 拆分 —— 基于网格重建 table.children 的纯函数，产出新的 rows    */
/* ------------------------------------------------------------------ */

/**
 * 合并逻辑矩形 [top..bottom]×[left..right] 为一个单元格。
 * 矩形外的跨边界单元格会被裁剪到矩形边沿，避免 HTML 布局冲突。
 */
export const mergeTableGrid = (
  table: CustomElement,
  r0: number,
  c0: number,
  r1: number,
  c1: number,
): CustomElement[] => {
  const grid = computeGrid(table);
  const top = Math.min(r0, r1);
  const bottom = Math.max(r0, r1);
  const left = Math.min(c0, c1);
  const right = Math.max(c0, c1);
  const H = bottom - top + 1;
  const W = right - left + 1;

  const anchor = grid.originAt[top]?.[left];
  if (!anchor) return table.children as CustomElement[];
  const anchorKey = keyOf(anchor.row, anchor.cell);
  const nodes = collectCellNodes(table);

  const removed = new Set<string>();
  const spanOverride = new Map<string, { colspan: number; rowspan: number }>();
  const collected: any[] = [];

  const seen = new Set<string>();
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const o = grid.originAt[r]?.[c];
      if (!o) continue;
      const k = keyOf(o.row, o.cell);
      if (seen.has(k)) continue;
      seen.add(k);

      if (k === anchorKey) {
        spanOverride.set(k, { colspan: W, rowspan: H });
        continue;
      }
      const orgInside = o.row >= top && o.row <= bottom && o.col >= left && o.col <= right;
      if (orgInside) {
        removed.add(k);
        collected.push(...collectParagraphs(nodes.get(k)));
      } else if (
        (o.row < top &&
          o.row + o.rowspan - 1 >= top &&
          o.col + o.colspan - 1 >= left &&
          o.col <= right) ||
        (o.col < left && o.col + o.colspan - 1 >= left && o.row <= bottom)
      ) {
        const newRowspan = o.row < top ? top - o.row : o.rowspan;
        const newColspan = o.col < left ? left - o.col : o.colspan;
        spanOverride.set(k, { colspan: newColspan, rowspan: newRowspan });
      }
    }
  }

  const anchorChildren = (() => {
    const base = collectParagraphs(nodes.get(anchorKey));
    if (collected.length) base.push(...collected);
    return base;
  })();

  return rebuildRows(table, grid, removed, spanOverride, anchorKey, anchorChildren, undefined);
};

/** 拆分布折叠为独立 grid 位置的 cell：将合并格复原成 colspan×rowspan 个 1x1 格 */
export const splitTableGrid = (table: CustomElement, r0: number, c0: number): CustomElement[] => {
  const grid = computeGrid(table);
  const o = grid.originAt[r0]?.[c0];
  if (!o || (o.colspan === 1 && o.rowspan === 1)) return table.children as CustomElement[];
  const k = keyOf(o.row, o.cell);
  const nodes = collectCellNodes(table);
  const anchorNode = nodes.get(k);

  const additions = new Map<string, CustomElement>();
  for (let dr = 0; dr < o.rowspan; dr++) {
    for (let dc = 0; dc < o.colspan; dc++) {
      // 左上格沿用原单元格（保留 id/背景等），其余新建
      const cell =
        dr === 0 && dc === 0
          ? anchorNode
            ? {
                ...anchorNode,
                attrs: { ...((anchorNode?.attrs || {}) as object), colspan: 1, rowspan: 1 },
              }
            : makeEmptyCell()
          : makeEmptyCell();
      additions.set(`add:${o.row + dr}:${o.col + dc}`, cell);
    }
  }

  return rebuildRows(table, grid, new Set([k]), new Map(), undefined, undefined, additions);
};

const rebuildRows = (
  table: CustomElement,
  grid: TableGrid,
  removed: Set<string>,
  spanOverride: Map<string, { colspan: number; rowspan: number }>,
  anchorKey?: string,
  anchorChildren?: any[],
  additions?: Map<string, CustomElement>,
): CustomElement[] => {
  const nodes = collectCellNodes(table);
  const rowChildren = (table.children as CustomElement[]) || [];
  const out: CustomElement[] = [];

  for (let r = 0; r < grid.rows; r++) {
    const children: CustomElement[] = [];
    const rowNode = rowChildren[r] || ({} as CustomElement);
    for (let c = 0; c < grid.cols; c++) {
      const add = additions?.get(`add:${r}:${c}`);
      if (add) {
        children.push(add);
        continue;
      }
      const o = grid.originAt[r]?.[c];
      if (o && o.row === r && o.col === c) {
        const key = keyOf(o.row, o.cell);
        if (removed.has(key)) continue;
        let cell = nodes.get(key) as CustomElement;
        const over = spanOverride.get(key);
        if (over) {
          cell = {
            ...cell,
            attrs: {
              ...((cell?.attrs as object) || {}),
              colspan: over.colspan,
              rowspan: over.rowspan,
            },
          } as CustomElement;
        }
        if (anchorKey === key && anchorChildren) {
          cell = { ...cell, children: anchorChildren } as CustomElement;
        }
        children.push(cell);
      }
    }
    out.push({ ...rowNode, children });
  }
  return out;
};

/* ------------------------------------------------------------------ */
/* 网格感知的行/列插入与删除 —— 兼顾 colspan/rowspan，避免破坏合并布局    */
/* ------------------------------------------------------------------ */

/**
 * 在逻辑行 at（0..rows）处插入一行。
 * 上方跨界（rowspan 恰好覆盖 at）的 cell 需 rowspan+1 以盖住新行；
 * 新行只在未被上方 rowspan 覆盖的列放空 cell。
 */
export const insertRowGrid = (table: CustomElement, at: number): CustomElement[] => {
  const grid = computeGrid(table);
  const nodes = collectCellNodes(table);
  const rowChildren = (table.children as CustomElement[]) || [];
  const c0 = Math.max(0, Math.min(at, grid.rows));
  if (grid.rows === 0) return rowChildren;

  const spanInc = new Map<string, number>();
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const o = grid.originAt[r]?.[c];
      if (!o) continue;
      if (o.row < c0 && o.row + o.rowspan - 1 >= c0) {
        spanInc.set(keyOf(o.row, o.cell), 1);
      }
    }
  }

  // 新行需要显式放空 cell 的列：未被上方 rowspan 覆盖
  const covered = new Array(grid.cols).fill(false);
  for (let r = 0; r < c0; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const o = grid.originAt[r]?.[c];
      if (o && o.row === r && o.col === c && o.row + o.rowspan - 1 >= c0) {
        for (let cc = o.col; cc < o.col + o.colspan; cc++) covered[cc] = true;
      }
    }
  }
  const newRowChildren: CustomElement[] = [];
  for (let c = 0; c < grid.cols; c++) {
    if (!covered[c]) newRowChildren.push(makeEmptyCell());
  }
  const tmpl = rowChildren[0] as CustomElement | undefined;
  const newRow: CustomElement = {
    ...(tmpl || { type: BlockElementType.TABLE_ROW, id: '', attrs: {}, children: [] }),
    id: (tmpl?.id || 'row-') + Math.random().toString(36).slice(2, 10),
    children: newRowChildren,
  };

  const newRows: CustomElement[] = [];
  for (let r = 0; r < grid.rows; r++) {
    const rowNode = rowChildren[r] || ({} as CustomElement);
    const children: CustomElement[] = [];
    for (let c = 0; c < grid.cols; c++) {
      const o = grid.originAt[r]?.[c];
      if (o && o.row === r && o.col === c) {
        const key = keyOf(o.row, o.cell);
        let cell = nodes.get(key) as CustomElement;
        if (spanInc.get(key)) {
          cell = {
            ...cell,
            attrs: { ...((cell?.attrs || {}) as object), rowspan: (o.rowspan || 1) + 1 },
          } as CustomElement;
        }
        children.push(cell);
      }
    }
    newRows.push({ ...rowNode, children });
  }
  newRows.splice(c0, 0, newRow);
  return newRows;
};

/**
 * 删除逻辑行 r。顶部在 r 的 cell 整格移除；上方跨入 r 的 cell rowspan-1；
 * r 下方各行整体上移。
 */
export const deleteRowGrid = (table: CustomElement, r: number): CustomElement[] => {
  const grid = computeGrid(table);
  const nodes = collectCellNodes(table);
  const rowChildren = (table.children as CustomElement[]) || [];
  if (grid.rows <= 1) return rowChildren;

  const removedKeys = new Set<string>();
  const spanDec = new Map<string, number>();
  for (let rr = 0; rr < grid.rows; rr++) {
    for (let c = 0; c < grid.cols; c++) {
      const o = grid.originAt[rr]?.[c];
      if (!o) continue;
      if (o.row === r) {
        removedKeys.add(keyOf(o.row, o.cell));
        continue;
      }
      if (o.row === rr && o.col === c && o.row < r && o.row + o.rowspan - 1 >= r) {
        spanDec.set(keyOf(o.row, o.cell), (spanDec.get(keyOf(o.row, o.cell)) || 0) + 1);
      }
    }
  }

  const newRows: CustomElement[] = [];
  for (let ri = 0; ri < grid.rows - 1; ri++) {
    const oldR = ri < r ? ri : ri + 1;
    const rowNode = rowChildren[oldR] || ({} as CustomElement);
    const children: CustomElement[] = [];
    for (let c = 0; c < grid.cols; c++) {
      const o = grid.originAt[oldR]?.[c];
      if (o && o.row === oldR && o.col === c) {
        const key = keyOf(o.row, o.cell);
        if (removedKeys.has(key)) continue;
        let cell = nodes.get(key) as CustomElement;
        const dec = spanDec.get(key) || 0;
        if (dec) {
          const ns = (o.rowspan || 1) - dec;
          if (ns <= 0) continue;
          cell = {
            ...cell,
            attrs: { ...((cell?.attrs || {}) as object), rowspan: ns },
          } as CustomElement;
        }
        children.push(cell);
      }
    }
    newRows.push({ ...rowNode, children });
  }
  return newRows;
};

/**
 * 在逻辑列 at（0..cols）处插入一列。
 * 左侧跨入 at 的 cell colspan+1 以盖住新列；未跨入的行补空 cell。
 */
export const insertColumnGrid = (table: CustomElement, at: number): CustomElement[] => {
  const grid = computeGrid(table);
  const nodes = collectCellNodes(table);
  const rowChildren = (table.children as CustomElement[]) || [];
  const c0 = Math.max(0, Math.min(at, grid.cols));
  if (grid.cols === 0) return rowChildren;

  const spanInc = new Map<string, number>();
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const o = grid.originAt[r]?.[c];
      if (!o) continue;
      if (o.col < c0 && o.col + o.colspan - 1 >= c0) {
        spanInc.set(keyOf(o.row, o.cell), 1);
      }
    }
  }

  const newRows: CustomElement[] = [];
  for (let r = 0; r < grid.rows; r++) {
    const rowNode = rowChildren[r] || ({} as CustomElement);
    const children: CustomElement[] = [];
    // 新列 c0 是否已被「左侧跨入并覆盖 c0」的合并格天然占住：其 colspan+1 后可盖住新列，无需补空格
    let needHole = true;
    for (let c = 0; c < grid.cols; c++) {
      const o = grid.originAt[r]?.[c];
      if (o && o.row === r && o.col === c && o.col < c0 && o.col + o.colspan - 1 >= c0) {
        needHole = false;
      }
    }
    let holeInserted = false;
    for (let c = 0; c < grid.cols; c++) {
      const o = grid.originAt[r]?.[c];
      if (o && o.row === r && o.col === c) {
        // 遇到第一个逻辑起点 >= c0 的 cell 且新列尚未显式占位 → 先插入空 cell 作为新列
        if (needHole && !holeInserted && o.col >= c0) {
          children.push(makeEmptyCell());
          holeInserted = true;
        }
        const key = keyOf(o.row, o.cell);
        let cell = nodes.get(key) as CustomElement;
        const inc = spanInc.get(key) || 0;
        if (inc) {
          cell = {
            ...cell,
            attrs: { ...((cell?.attrs || {}) as object), colspan: (o.colspan || 1) + inc },
          } as CustomElement;
        }
        children.push(cell);
      }
    }
    // c0 在某行所有 cell 之后（如插到最右端）→ 追加空 cell 占住新列
    if (needHole && !holeInserted) {
      children.push(makeEmptyCell());
    }
    newRows.push({ ...rowNode, children });
  }
  return newRows;
};

/**
 * 删除逻辑列 col。起点在 col 的 cell 整格移除；左侧跨入 col 的 cell colspan-1；
 * 右侧各列整体左移。
 */
export const deleteColumnGrid = (table: CustomElement, col: number): CustomElement[] => {
  const grid = computeGrid(table);
  const nodes = collectCellNodes(table);
  const rowChildren = (table.children as CustomElement[]) || [];
  if (grid.cols <= 1) return rowChildren;

  const removedKeys = new Set<string>();
  const spanDec = new Map<string, number>();
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const o = grid.originAt[r]?.[c];
      if (!o) continue;
      if (o.col === col) {
        removedKeys.add(keyOf(o.row, o.cell));
        continue;
      }
      if (o.col < col && o.col + o.colspan - 1 >= col) {
        const key = keyOf(o.row, o.cell);
        spanDec.set(key, (spanDec.get(key) || 0) + 1);
      }
    }
  }

  const newRows: CustomElement[] = [];
  for (let r = 0; r < grid.rows; r++) {
    const rowNode = rowChildren[r] || ({} as CustomElement);
    const children: CustomElement[] = [];
    for (let c = 0; c < grid.cols; c++) {
      const o = grid.originAt[r]?.[c];
      if (o && o.row === r && o.col === c) {
        const key = keyOf(o.row, o.cell);
        if (removedKeys.has(key)) continue;
        let cell = nodes.get(key) as CustomElement;
        const dec = spanDec.get(key) || 0;
        if (dec) {
          const ns = (o.colspan || 1) - dec;
          if (ns <= 0) continue;
          cell = {
            ...cell,
            attrs: { ...((cell?.attrs || {}) as object), colspan: ns },
          } as CustomElement;
        }
        children.push(cell);
      }
    }
    newRows.push({ ...rowNode, children });
  }
  return newRows;
};
