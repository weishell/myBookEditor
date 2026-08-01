import React from 'react';
import type { RenderElementProps } from 'slate-react';
import type { CustomElement } from '@/core/types';
import type { TableRowAttrs } from './table-operations';
import styles from './TableRow.module.less';

interface TableRowProps extends RenderElementProps {
  pluginId?: string;
  element: CustomElement;
  rowIndex?: number;
  onInsertRow?: (at?: number) => void;
  onDeleteRow?: () => void;
  onSetBackgroundColor?: (color: string) => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  attributes,
  children,
  element,
  rowIndex = 0,
}) => {
  const attrs = element.attrs as TableRowAttrs;
  const { bgColor } = attrs || {};

  // 给每个 TableCell 传入 colIndex
  const renderChildren = () => {
    return React.Children.map(children, (child, colIndex) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<{ colIndex?: number }>, { colIndex });
      }
      return child;
    });
  };

  return (
    <tr
      {...attributes}
      data-row-index={rowIndex}
      className={styles.row}
      style={{ backgroundColor: bgColor || 'transparent' }}
    >
      {renderChildren()}
    </tr>
  );
};

export type { TableRowProps };
