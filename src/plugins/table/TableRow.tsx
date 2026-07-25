import React from 'react';
import type { RenderElementProps } from 'slate-react';
import type { CustomElement } from '@/components/Editor/types';
import type { TableRowAttrs } from './table-operations';

interface TableRowProps extends RenderElementProps {
  pluginId?: string;
  element: CustomElement;
  onInsertRow?: (at?: number) => void;
  onDeleteRow?: () => void;
  onSetBackgroundColor?: (color: string) => void;
}

export const TableRow: React.FC<TableRowProps> = ({ attributes, children, element }) => {
  const attrs = element.attrs as TableRowAttrs;
  const { bgColor } = attrs || {};

  return (
    <tr
      {...attributes}
      data-plugin-id={element.id}
      data-block-type={element.type}
      data-block-attrs={element.attrs ? JSON.stringify(element.attrs) : undefined}
      style={{ backgroundColor: bgColor || 'transparent' }}
    >
      {children}
    </tr>
  );
};

export type { TableRowProps };
