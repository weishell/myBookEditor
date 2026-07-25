import React from 'react';
import type { RenderElementProps } from 'slate-react';
import type { CustomElement } from '@/components/Editor/types';
import type { TableAttrs } from './table-operations';

interface TableProps extends RenderElementProps {
  pluginId?: string;
  element: CustomElement;
  onInsertRow?: (at?: number) => void;
  onInsertColumn?: (at?: number) => void;
  onDeleteRow?: () => void;
  onDeleteColumn?: () => void;
  onMergeCells?: (cells: Array<{ row: number; col: number }>) => void;
  onSetBackgroundColor?: (color: string) => void;
  onResizeColumn?: (colIndex: number, width: string) => void;
  onToggleLazyLoad?: (rowIndex: number) => void;
  onSelectAll?: () => void;
}

export const Table: React.FC<TableProps> = ({ attributes, children, element }) => {
  const attrs = element.attrs as TableAttrs;
  const { borderColor = '#d9d9d9', borderWidth = '1px' } = attrs || {};

  return (
    <div
      data-plugin-id={element.id}
      data-block-type={element.type}
      data-block-attrs={element.attrs ? JSON.stringify(element.attrs) : undefined}
      style={{ overflowX: 'auto', margin: '16px 0' }}
    >
      <table
        {...attributes}
        style={{
          borderCollapse: 'collapse',
          border: `${borderWidth} solid ${borderColor}`,
          minWidth: '100%',
        }}
      >
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export type { TableProps };
