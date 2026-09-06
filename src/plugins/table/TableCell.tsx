import React from 'react';
import { ReactEditor, useSlateStatic, type RenderElementProps } from 'slate-react';
import { Editor, Element } from 'slate';
import type { CustomElement } from '@/core/types';
import type { TableCellAttrs, TableAttrs } from './table-operations';
import { computeGrid } from './table-grid';
import { BlockElementType } from '@/enums';
import { useTheme } from '@/context/ThemeContext';
import { LIGHT_BG_PATTERN, DARK_CELL_BG } from '@/core/renderLeaf';
import styles from './TableCell.module.less';

interface TableCellProps extends RenderElementProps {
  pluginId?: string;
  element: CustomElement;
  onInsertRow?: (at?: number) => void;
  onInsertColumn?: (at?: number) => void;
  onDeleteRow?: () => void;
  onDeleteColumn?: () => void;
  onMergeCells?: (cells: Array<{ row: number; col: number }>) => void;
  onSetBackgroundColor?: (color: string) => void;
  onResizeColumn?: (width: string) => void;
  onToggleLazyLoad?: () => void;
}

export const TableCell: React.FC<TableCellProps> = ({ attributes, children, element }) => {
  const attrs = element.attrs as TableCellAttrs;
  const { colspan = 1, rowspan = 1, bgColor, vertAlign } = attrs || {};
  const { isDarkMode } = useTheme();
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const colIndex = path[path.length - 1] ?? 0;

  // 逻辑列起始位置（合并格取 origin.col，供 DOM 标记与列操作对齐）
  let logicalColStart = colIndex;

  // 标题行 / 标题列判定：向上找到最近的 table，读取 headerRows / headerCols
  let isHeaderRow = false;
  let isHeaderCol = false;
  try {
    const tableEntry = Editor.above(editor, {
      at: path,
      match: (n) => Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
    });
    if (tableEntry) {
      const [tableNode, tablePath] = tableEntry;
      // 相对表格的行 / 物理列索引（自动适配表格所在层级）
      const rowIndex = path[tablePath.length];
      const cellIndex = path[tablePath.length + 1];
      const ta = (((tableNode as CustomElement).attrs || {}) as TableAttrs) || {};
      const hr = ta.headerRows || [];
      const hc = ta.headerCols || [];
      isHeaderRow = hr.includes(rowIndex);
      const grid = computeGrid(tableNode as CustomElement);
      for (let c = 0; c < grid.cols; c++) {
        const origin = grid.originAt?.[rowIndex]?.[c];
        if (origin && origin.cell === cellIndex) {
          logicalColStart = c;
          break;
        }
      }
      if (hc.length > 0) {
        isHeaderCol = hc.includes(logicalColStart);
      }
    }
  } catch (err) {
    // 临时诊断：打印标题判定失败原因
    console.warn('[TableCell] header detect failed', err);
  }
  const isHeader = isHeaderRow || isHeaderCol;

  // 暗黑模式：用户把背景设成浅白（典型表头）→ 换成柔和深色；
  // 标题行/列无 bgColor 时给默认表头灰，并加粗文字
  let actualBg: string | undefined = bgColor;
  if (isDarkMode) {
    if (actualBg && LIGHT_BG_PATTERN.test(actualBg.trim())) {
      actualBg = DARK_CELL_BG;
    } else if (!actualBg && isHeader) {
      actualBg = DARK_CELL_BG;
    }
  } else if (!actualBg && isHeader) {
    actualBg = '#f2f3f5';
  }

  return (
    <td
      {...attributes}
      colSpan={colspan}
      rowSpan={rowspan}
      data-col-index={colIndex}
      data-logical-col={logicalColStart}
      data-header-row={isHeaderRow || undefined}
      data-header-col={isHeaderCol || undefined}
      className={styles.cell}
      style={{
        backgroundColor: actualBg || 'transparent',
        verticalAlign: vertAlign || 'middle',
        fontWeight: isHeader ? 600 : undefined,
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </td>
  );
};

export type { TableCellProps };
