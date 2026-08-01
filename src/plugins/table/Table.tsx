import React, { useState, useCallback, useRef, useLayoutEffect, useEffect } from 'react';
import type { RenderElementProps } from 'slate-react';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { Path } from 'slate';
import type { CustomElement } from '@/core/types';
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

interface HoveredDot {
  type: 'row' | 'col';
  index: number;
}

interface TableSize {
  width: number;
  height: number;
}

export const Table: React.FC<TableProps> = ({ attributes, children, element }) => {
  const { ref: slateRef, ...otherAttributes } = attributes as {
    ref?: React.RefCallback<HTMLDivElement>;
  };
  const editor = useSlateStatic();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const slateDivRef = useRef<HTMLDivElement | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [rowDots, setRowDots] = useState<DotPosition[]>([]);
  const [colDots, setColDots] = useState<DotPosition[]>([]);
  const [tableSize, setTableSize] = useState<TableSize>({ width: 0, height: 0 });

  // 智能显示状态
  const [showDots, setShowDots] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<HoveredDot | null>(null);
  const hoverCountRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);
  const isPinnedRef = useRef(false);

  // 同步 ref
  useEffect(() => {
    isPinnedRef.current = isPinned;
  }, [isPinned]);

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

  // 检查光标是否在表格内
  const isCursorInTable = useCallback(() => {
    if (!editor.selection) return false;
    try {
      const tablePath = ReactEditor.findPath(editor, element);
      const selectionPath = editor.selection.anchor.path;
      return Path.isAncestor(tablePath, selectionPath);
    } catch {
      return false;
    }
  }, [editor, element]);

  // 光标进入表格 → 常驻显示
  useEffect(() => {
    const checkAndPin = () => {
      if (isCursorInTable()) {
        setIsPinned(true);
      }
    };
    checkAndPin();
  });

  // 鼠标事件：进入/离开 wrapper 和圆点
  const handleMouseEnter = useCallback(() => {
    hoverCountRef.current += 1;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowDots(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverCountRef.current -= 1;
    if (hoverCountRef.current <= 0) {
      hoverCountRef.current = 0;
      if (isPinnedRef.current) return;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => {
        setShowDots(false);
        setHoveredDot(null);
      }, 300);
    }
  }, []);

  // 点击钉住后，点击外部释放
  useEffect(() => {
    if (!isPinned) return;
    const handleOutsideMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsPinned(false);
        setShowDots(false);
        setHoveredDot(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideMouseDown);
    return () => document.removeEventListener('mousedown', handleOutsideMouseDown);
  }, [isPinned]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  // 测量 DOM 位置
  useLayoutEffect(() => {
    let rafId: number;
    let retryCount = 0;
    const maxRetries = 5;

    const measure = () => {
      if (!tableRef.current || !wrapperRef.current) return;

      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const tableRect = tableRef.current.getBoundingClientRect();
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

      // 更新表格尺寸
      setTableSize({
        width: tableRect.width,
        height: tableRect.height,
      });

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
      setIsPinned(true);
      setShowDots(true);
      setHoveredDot(null);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
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
      setIsPinned(true);
      setShowDots(true);
      setHoveredDot(null);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      try {
        const path = ReactEditor.findPath(editor, element);
        insertColumn(editor, at, path);
      } catch (err) {
        console.error('Insert column failed:', err);
      }
    },
    [editor, element],
  );

  // 指示线渲染数据
  let indicatorLine: React.ReactNode = null;
  let tooltip: React.ReactNode = null;

  if (hoveredDot && showDots) {
    if (hoveredDot.type === 'row') {
      const pos = rowDots[hoveredDot.index];
      if (pos && tableSize.width > 0) {
        indicatorLine = (
          <div
            className={styles.indicatorLineH}
            style={{
              top: pos.top,
              left: 0,
              width: tableSize.width,
            }}
          />
        );
        tooltip = (
          <div
            className={styles.insertTooltip}
            style={{
              top: pos.top,
              left: -12,
              transform: 'translate(-100%, -50%)',
            }}
          >
            插入行
          </div>
        );
      }
    } else {
      const pos = colDots[hoveredDot.index];
      if (pos && tableSize.height > 0) {
        indicatorLine = (
          <div
            className={styles.indicatorLineV}
            style={{
              top: 0,
              left: pos.left,
              height: tableSize.height,
            }}
          />
        );
        tooltip = (
          <div
            className={styles.insertTooltip}
            style={{
              top: -12,
              left: pos.left,
              transform: 'translate(-50%, -100%)',
            }}
          >
            插入列
          </div>
        );
      }
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onContextMenu={handleContextMenu}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 行插入圆点 - 在 wrapper 内，Slate 管理区域外 */}
      {showDots &&
        rowDots.map((pos, i) => (
          <button
            key={`row-dot-${i}`}
            contentEditable={false}
            onClick={(e) => handleInsertRow(i, e)}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseEnter={() => {
              handleMouseEnter();
              setHoveredDot({ type: 'row', index: i });
            }}
            onMouseLeave={() => {
              handleMouseLeave();
              setHoveredDot((prev) => (prev?.type === 'row' && prev.index === i ? null : prev));
            }}
            className={styles.dot}
            style={{
              top: pos.top,
              left: -12,
            }}
          />
        ))}

      {/* 列插入圆点 - 在 wrapper 内，Slate 管理区域外 */}
      {showDots &&
        colDots.map((pos, i) => (
          <button
            key={`col-dot-${i}`}
            contentEditable={false}
            onClick={(e) => handleInsertColumn(i, e)}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseEnter={() => {
              handleMouseEnter();
              setHoveredDot({ type: 'col', index: i });
            }}
            onMouseLeave={() => {
              handleMouseLeave();
              setHoveredDot((prev) => (prev?.type === 'col' && prev.index === i ? null : prev));
            }}
            className={styles.dot}
            style={{
              top: -12,
              left: pos.left,
            }}
          />
        ))}

      {/* 悬浮指示线 */}
      {indicatorLine}

      {/* 插入提示 tooltip */}
      {tooltip}

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
