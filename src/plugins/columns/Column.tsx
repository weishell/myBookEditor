import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { Editor } from 'slate';
import type { RenderElementProps } from 'slate-react';
import type { CustomElement } from '@/core/types';
import { getColumnWidths, insertColumnAt, resizeColumnWidth } from './column-operations';
import styles from './Column.module.less';

interface ColumnProps extends RenderElementProps {
  pluginId?: string;
  element: CustomElement;
}

const MIN_COL_WIDTH = 12;

export const Column: React.FC<ColumnProps> = ({ attributes, children, element }) => {
  const editor = useSlateStatic();

  // 从 editor 读 widths（Slate 不会把 ColumnGroup 的 cloneElement prop 透传下来，所以必须自己读）
  const path = React.useMemo(() => {
    try {
      return ReactEditor.findPath(editor, element);
    } catch {
      return null;
    }
  }, [editor, element]);

  const groupPath = useMemo(() => (path && path.length >= 2 ? path.slice(0, -1) : []), [path]);
  const colIndex = path ? path[path.length - 1] : 0;

  const widths = (() => {
    if (!groupPath.length) return [];
    try {
      const [gn] = Editor.node(editor, groupPath);
      // 宽度统一存在每列自身 attrs.width 上，与 column-operations 的读写一致
      return getColumnWidths(gn as CustomElement);
    } catch {
      return [];
    }
  })();

  const totalColumns = widths.length;
  const isLast = colIndex === totalColumns - 1;
  const resolvedWidth = widths[colIndex] ?? Math.round(100 / Math.max(1, totalColumns || 1));

  if (typeof window !== 'undefined') {
    (window as any).__lastCol = {
      colIndex,
      groupPath,
      widths,
      resolvedWidth,
      totalColumns,
      elId: element.id?.slice(0, 6),
    };
    (window as any).__colRenderCount = ((window as any).__colRenderCount || 0) + 1;
    (window as any).__colRenderLog = (window as any).__colRenderLog || [];
    (window as any).__colRenderLog.push({
      elId: element.id?.slice(0, 6),
      colIndex,
      resolvedWidth,
      widths: [...widths],
    });
  }

  const [dragging, setDragging] = useState(false);
  const columnRef = useRef<HTMLDivElement | null>(null);

  // 拖拽调宽分隔线
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isLast) return;
      e.preventDefault();
      e.stopPropagation();
      const groupEl =
        (columnRef.current?.closest('[data-block-type="column-group"]') as HTMLElement) || null;
      if (!groupEl) return;
      const rect = groupEl.getBoundingClientRect();
      const groupWidth = rect.width;
      if (groupWidth <= 0) return;

      const startX = e.clientX;
      const startWidths = [...widths];
      setDragging(true);

      const onMove = (ev: MouseEvent) => {
        const deltaPercent = ((ev.clientX - startX) / groupWidth) * 100;
        const min = MIN_COL_WIDTH;
        const max = startWidths[colIndex] + startWidths[colIndex + 1] - MIN_COL_WIDTH;
        const newLeft = Math.max(min, Math.min(max, startWidths[colIndex] + deltaPercent));
        resizeColumnWidth(editor, groupPath, colIndex, newLeft);
      };

      const onUp = () => {
        setDragging(false);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [editor, groupPath, colIndex, widths, isLast],
  );

  // 新增分栏（在 colIndex 之前/之后各放一个 + 按钮）
  const handleAdd = useCallback(
    (at: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        insertColumnAt(editor, groupPath, at);
      } catch (err) {
        console.error('Add column failed:', err);
      }
    },
    [editor, groupPath],
  );

  // Slate 在 contenteditable 里挂载 attributes/contentEditable 事件，需要让 column div 能编辑
  const setColumnRef = useCallback(
    (el: HTMLDivElement | null) => {
      columnRef.current = el;
      const slateRef = (attributes as any).ref;
      if (typeof slateRef === 'function') {
        slateRef(el);
      } else if (slateRef && typeof slateRef === 'object' && 'current' in slateRef) {
        (slateRef as any).current = el;
      }
    },
    [attributes],
  );

  // 从 attributes 中剥离 ref（由 setColumnRef 接管），避免覆盖挂载逻辑
  const otherAttributes = { ...(attributes as any) };
  delete otherAttributes.ref;

  return (
    <div
      ref={setColumnRef}
      {...otherAttributes}
      className={`${styles.column} ${dragging ? styles.columnDragging : ''}`}
      style={{
        // 用 flex 权重分配剩余空间，配合列间距(margin)实现列间留白而不溢出容器
        flexGrow: resolvedWidth,
        flexShrink: resolvedWidth,
        flexBasis: '0%',
        minWidth: 0,
      }}
      data-plugin-id={element.id}
      data-block-type={element.type}
    >
      <div className={styles.content}>{children}</div>

      {/* 右侧分隔线（最后一列不显示） */}
      {!isLast && (
        <div
          className={styles.divider}
          contentEditable={false}
          data-column-divider={colIndex}
          onMouseDown={handleResizeMouseDown}
        >
          <div className={styles.resizeLine} />
          <button
            type="button"
            className={styles.addButtonRight}
            contentEditable={false}
            data-add-button="1"
            title="在此处右侧新增分栏"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={handleAdd(colIndex + 1)}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};
