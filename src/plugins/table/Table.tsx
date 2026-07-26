import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import type { RenderElementProps } from 'slate-react';
import { useSlate, ReactEditor } from 'slate-react';
import type { CustomElement } from '@/components/Editor/types';
import type { TableAttrs } from './table-operations';
import { TableContextMenu } from './TableContextMenu';
import { insertRow, insertColumn } from './table-operations';
import styles from './Table.module.less';

interface TableProps extends RenderElementProps {
  pluginId?: string;
  element: CustomElement;
}

interface DotPosition {
  top: number;
  left: number;
}

export const Table: React.FC<TableProps> = ({ attributes, children, element }) => {
  const { ref: slateRef, ...otherAttributes } = attributes as {
    ref?: React.RefCallback<HTMLDivElement>;
  };
  const editor = useSlate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const slateDivRef = useRef<HTMLDivElement | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [rowDots, setRowDots] = useState<DotPosition[]>([]);
  const [colDots, setColDots] = useState<DotPosition[]>([]);

  const attrs = element.attrs as TableAttrs;
  const { borderColor = '#d9d9d9', borderWidth = '1px' } = attrs || {};

  const rowCount = React.Children.count(children);
  const firstRow = React.Children.toArray(children)[0];
  const colCount =
    firstRow && React.isValidElement(firstRow)
      ? React.Children.count(
          (firstRow as React.ReactElement<{ children?: React.ReactNode }>).props.children,
        )
      : 0;

  // 合并 Slate ref 和本地 ref
  const setSlateDivRef = useCallback(
    (el: HTMLDivElement | null) => {
      slateDivRef.current = el;
      if (typeof slateRef === 'function') {
        slateRef(el);
      }
    },
    [slateRef],
  );

  // 测量 DOM 位置
  useLayoutEffect(() => {
    let rafId: number;
    let retryCount = 0;
    const maxRetries = 5;

    const measure = () => {
      if (!tableRef.current || !wrapperRef.current) return;

      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const rows = tableRef.current.querySelectorAll('tr');
      if (rows.length === 0) {
        if (retryCount < maxRetries) {
          retryCount++;
          rafId = requestAnimationFrame(measure);
        }
        return;
      }

      const cells = rows[0].querySelectorAll('td, th');
      if (cells.length === 0) {
        if (retryCount < maxRetries) {
          retryCount++;
          rafId = requestAnimationFrame(measure);
        }
        return;
      }

      // 测量行边界位置（相对于 wrapper）
      const newRowDots: DotPosition[] = [];
      for (let i = 0; i <= rows.length; i++) {
        if (i === 0) {
          const rect = rows[0].getBoundingClientRect();
          newRowDots.push({ top: rect.top - wrapperRect.top, left: 0 });
        } else if (i === rows.length) {
          const rect = rows[rows.length - 1].getBoundingClientRect();
          newRowDots.push({ top: rect.bottom - wrapperRect.top, left: 0 });
        } else {
          const prevRect = rows[i - 1].getBoundingClientRect();
          const currRect = rows[i].getBoundingClientRect();
          const midY = (prevRect.bottom + currRect.top) / 2;
          newRowDots.push({ top: midY - wrapperRect.top, left: 0 });
        }
      }
      setRowDots(newRowDots);

      // 测量列边界位置（相对于 wrapper）
      const newColDots: DotPosition[] = [];
      for (let i = 0; i <= cells.length; i++) {
        if (i === 0) {
          const rect = cells[0].getBoundingClientRect();
          newColDots.push({ top: 0, left: rect.left - wrapperRect.left });
        } else if (i === cells.length) {
          const rect = cells[cells.length - 1].getBoundingClientRect();
          newColDots.push({ top: 0, left: rect.right - wrapperRect.left });
        } else {
          const prevRect = cells[i - 1].getBoundingClientRect();
          const currRect = cells[i].getBoundingClientRect();
          const midX = (prevRect.right + currRect.left) / 2;
          newColDots.push({ top: 0, left: midX - wrapperRect.left });
        }
      }
      setColDots(newColDots);
    };

    measure();

    const handleScroll = () => {
      if (scrollRef.current) {
        measure();
      }
    };

    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollEl) {
        scrollEl.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', measure);
    };
  }, [children, rowCount, colCount]);

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
        const path = ReactEditor.findPath(editor, element);
        insertRow(editor, at, path);
      } catch (err) {
        console.error('Insert row failed:', err);
      }
    },
    [editor, element],
  );

  const handleInsertColumn = useCallback(
    (at: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        const path = ReactEditor.findPath(editor, element);
        insertColumn(editor, at, path);
      } catch (err) {
        console.error('Insert column failed:', err);
      }
    },
    [editor, element],
  );

  return (
    <div ref={wrapperRef} className={styles.wrapper} onContextMenu={handleContextMenu}>
      {/* 行插入圆点 - 在 wrapper 内，Slate 管理区域外 */}
      {rowDots.map((pos, i) => (
        <button
          key={`row-dot-${i}`}
          contentEditable={false}
          onClick={(e) => handleInsertRow(i, e)}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={styles.dot}
          style={{
            top: pos.top,
            left: -12,
          }}
        />
      ))}

      {/* 列插入圆点 - 在 wrapper 内，Slate 管理区域外 */}
      {colDots.map((pos, i) => (
        <button
          key={`col-dot-${i}`}
          contentEditable={false}
          onClick={(e) => handleInsertColumn(i, e)}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={styles.dot}
          style={{
            top: -12,
            left: pos.left,
          }}
        />
      ))}

      {/* 横向滚动容器 */}
      <div ref={scrollRef} className={styles.scrollContainer}>
        {/* Slate 管理的 div */}
        <div
          ref={setSlateDivRef}
          {...otherAttributes}
          data-plugin-id={element.id}
          data-block-type={element.type}
          data-block-attrs={element.attrs ? JSON.stringify(element.attrs) : undefined}
        >
          <table
            ref={tableRef}
            className={styles.table}
            style={{
              border: `${borderWidth} solid ${borderColor}`,
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
      </div>

      <TableContextMenu visible={menuVisible} position={menuPosition} onClose={handleCloseMenu} />
    </div>
  );
};

export type { TableProps };
