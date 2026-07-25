import React, { useState, useCallback, useRef } from 'react';
import type { RenderElementProps } from 'slate-react';
import { useSlate } from 'slate-react';
import type { CustomElement } from '@/components/Editor/types';
import type { TableAttrs } from './table-operations';
import { TableContextMenu } from './TableContextMenu';
import { insertRow, insertColumn } from './table-operations';

interface TableProps extends RenderElementProps {
  pluginId?: string;
  element: CustomElement;
}

export const Table: React.FC<TableProps> = ({ attributes, children, element }) => {
  const { ref: slateRef, ...otherAttributes } = attributes as { ref?: React.Ref<any> };
  const editor = useSlate();
  const tableRef = useRef<HTMLTableElement>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  console.warn(slateRef);

  const attrs = element.attrs as TableAttrs;
  const { borderColor = '#d9d9d9', borderWidth = '1px' } = attrs || {};

  // 计算行数量和列数量
  const rowCount = React.Children.count(children);
  const firstRow = React.Children.toArray(children)[0];
  const colCount =
    firstRow && React.isValidElement(firstRow)
      ? React.Children.count(
          (firstRow as React.ReactElement<{ children?: React.ReactNode }>).props.children,
        )
      : 0;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  const handleInsertRow = useCallback(
    (at: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        insertRow(editor, at);
      } catch (err) {
        console.error('Insert row failed:', err);
      }
    },
    [editor],
  );

  const handleInsertColumn = useCallback(
    (at: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        insertColumn(editor, at);
      } catch (err) {
        console.error('Insert column failed:', err);
      }
    },
    [editor],
  );

  const dotStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#d9d9d9',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#fff',
    padding: '0',
    transition: 'all 0.15s',
    flexShrink: 0,
    WebkitAppearance: 'none',
    appearance: 'none',
  };

  return (
    <div
      style={{
        margin: '16px 0',
        position: 'relative',
        paddingLeft: '24px',
        paddingTop: '24px',
      }}
      {...otherAttributes}
      data-plugin-id={element.id}
      data-block-type={element.type}
      data-block-attrs={element.attrs ? JSON.stringify(element.attrs) : undefined}
      onContextMenu={handleContextMenu}
    >
      {/* 列插入按钮 - 一直显示在表格上方 */}
      <div
        style={{
          position: 'absolute',
          left: '24px',
          top: '4px',
          right: '0',
          display: 'flex',
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: colCount + 1 }).map((_, i) => (
          <div
            key={`col-dot-${i}`}
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'auto',
            }}
          >
            <button
              onClick={(e) => handleInsertColumn(i, e)}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{
                ...dotStyle,
                marginTop: '0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1890ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#d9d9d9';
              }}
            >
              +
            </button>
          </div>
        ))}
      </div>

      {/* 行插入按钮 - 一直显示在表格左侧 */}
      <div
        style={{
          position: 'absolute',
          left: '4px',
          top: '24px',
          bottom: '0',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: rowCount + 1 }).map((_, i) => (
          <div
            key={`row-dot-${i}`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'auto',
            }}
          >
            <button
              onClick={(e) => handleInsertRow(i, e)}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{
                ...dotStyle,
                marginLeft: '0',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1890ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#d9d9d9';
              }}
            >
              +
            </button>
          </div>
        ))}
      </div>

      {/* 表格主体 */}
      <div style={{ overflowX: 'auto' }}>
        <table
          ref={tableRef}
          style={{
            borderCollapse: 'collapse',
            border: `${borderWidth} solid ${borderColor}`,
            minWidth: '100%',
          }}
        >
          <tbody>
            {React.Children.map(children, (child, rowIndex) => {
              if (!React.isValidElement(child)) return child;
              return React.cloneElement(child as React.ReactElement<{ rowIndex?: number }>, {
                rowIndex,
              });
            })}
          </tbody>
        </table>
      </div>

      <TableContextMenu visible={menuVisible} position={menuPosition} onClose={handleCloseMenu} />
    </div>
  );
};

export type { TableProps };
