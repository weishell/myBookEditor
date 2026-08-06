import React from 'react';
import type { RenderElementProps } from 'slate-react';
import type { CustomElement } from '@/core/types';
import type { TableRowAttrs } from './table-operations';
import { useTheme } from '@/context/ThemeContext';
import { LIGHT_BG_PATTERN, DARK_CELL_BG } from '@/core/renderLeaf';
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
  const { isDarkMode } = useTheme();

  let actualBg: string | undefined = bgColor;
  if (isDarkMode) {
    if (actualBg && LIGHT_BG_PATTERN.test(actualBg.trim())) {
      actualBg = DARK_CELL_BG;
    } else if (!actualBg && rowIndex === 0) {
      // 暗黑模式下默认表头给个深底色，免得和内容行混、或浅色页面原"白表头 + 黑字"不协调
      actualBg = DARK_CELL_BG;
    }
  }

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
      style={{
        backgroundColor: actualBg || 'transparent',
        transition: 'background-color 0.2s',
      }}
    >
      {renderChildren()}
    </tr>
  );
};

export type { TableRowProps };
