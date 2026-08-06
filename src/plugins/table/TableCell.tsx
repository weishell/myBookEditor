import React from 'react';
import type { RenderElementProps } from 'slate-react';
import type { CustomElement } from '@/core/types';
import type { TableCellAttrs } from './table-operations';
import { useTheme } from '@/context/ThemeContext';
import { LIGHT_BG_PATTERN, DARK_CELL_BG } from '@/core/renderLeaf';
import styles from './TableCell.module.less';

interface TableCellProps extends RenderElementProps {
  pluginId?: string;
  element: CustomElement;
  colIndex?: number;
  onInsertRow?: (at?: number) => void;
  onInsertColumn?: (at?: number) => void;
  onDeleteRow?: () => void;
  onDeleteColumn?: () => void;
  onMergeCells?: (cells: Array<{ row: number; col: number }>) => void;
  onSetBackgroundColor?: (color: string) => void;
  onResizeColumn?: (width: string) => void;
  onToggleLazyLoad?: () => void;
}

export const TableCell: React.FC<TableCellProps> = ({
  attributes,
  children,
  element,
  colIndex = 0,
}) => {
  const attrs = element.attrs as TableCellAttrs;
  const { colspan = 1, rowspan = 1, bgColor, width } = attrs || {};
  const { isDarkMode } = useTheme();

  // 暗黑模式：若用户把单元格背景设成浅白（典型表头）→ 换成柔和深色
  let actualBg: string | undefined = bgColor;
  if (isDarkMode && actualBg && LIGHT_BG_PATTERN.test(actualBg.trim())) {
    actualBg = DARK_CELL_BG;
  }

  return (
    <td
      {...attributes}
      colSpan={colspan}
      rowSpan={rowspan}
      data-col-index={colIndex}
      className={styles.cell}
      style={{
        backgroundColor: actualBg || 'transparent',
        width: width || 'auto',
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
