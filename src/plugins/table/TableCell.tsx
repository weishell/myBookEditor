import React from 'react';
import type { RenderElementProps } from 'slate-react';
import type { CustomElement } from '@/components/Editor/types';
import type { TableCellAttrs } from './table-operations';
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

  return (
    <td
      {...attributes}
      colSpan={colspan}
      rowSpan={rowspan}
      data-col-index={colIndex}
      className={styles.cell}
      style={{
        backgroundColor: bgColor || 'transparent',
        width: width || 'auto',
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
