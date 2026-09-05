import React, { useState, useCallback, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import type { RenderElementProps } from 'slate-react';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { Path, Editor, Transforms } from 'slate';
import type { CustomElement } from '@/core/types';
import type { TableAttrs, TableCellAttrs, TableRowAttrs } from './table-operations';
import { TableContextMenu } from './TableContextMenu';
import type { TableMenuAction } from './TableContextMenu';
import {
  insertRowAt,
  insertColumnAt,
  deleteRowAt,
  deleteColumnAt,
  updateTable,
  mergeCells,
  splitCell,
  setCellBgColor,
  setCellRangeBgColor,
  setCellVertAlign,
  setCellRangeVertAlign,
  setRowBgColor,
  setTableBorder,
  deleteTable,
  getLogicalCell,
} from './table-operations';
import { computeGrid } from './table-grid';
import { useTheme } from '@/context/ThemeContext';
import { LIGHT_BG_PATTERN } from '@/core/renderLeaf';
import styles from './Table.module.less';

interface TableProps extends RenderElementProps {
  pluginId?: string;
  element: CustomElement;
}

interface DotPosition {
  top: number;
  left: number;
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
  const { isDarkMode } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const slateDivRef = useRef<HTMLDivElement | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  // 右键弹出的目标逻辑格（行/列），作为合并拆分/颜色等操作的锚点
  const [menuCell, setMenuCell] = useState<{ row: number; col: number } | null>(null);
  const [rowDots, setRowDots] = useState<DotPosition[]>([]);
  const [colDots, setColDots] = useState<DotPosition[]>([]);
  const [tableSize, setTableSize] = useState<TableSize>({ width: 0, height: 0 });
  // 横向滚动偏移：colDots 是「内容坐标」，wrapper 层浮层（工具栏）要减去它换算回视口坐标
  const [scrollLeft, setScrollLeft] = useState(0);

  // 智能显示状态
  const [showDots, setShowDots] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const hoverCountRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);
  const isPinnedRef = useRef(false);

  // 行列选中状态
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);

  // 跨单元格拖拽选中的矩形范围（合并/拆分等操作的基础）。r0/c0=锚点格，r1/c1=当前格。
  const [cellRange, setCellRange] = useState<{
    r0: number;
    c0: number;
    r1: number;
    c1: number;
  } | null>(null);
  const cellDragRef = useRef<{
    anchorRow: number;
    anchorCol: number;
    moved: boolean;
    startX: number;
    startY: number;
  } | null>(null);

  // hover 预览状态
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // 列宽拖拽状态
  const resizingRef = useRef<{
    colIndex: number;
    startX: number;
    startWidth: number;
    currentWidth: number;
  } | null>(null);
  const [draggingCol, setDraggingCol] = useState<number | null>(null);
  const [dragIndicatorX, setDragIndicatorX] = useState<number | null>(null);

  // ============ 悬浮横向滚动条（hover 表格时浮现，解决行多时原生滚动条沉底看不见） ============
  const [hScrollVisible, setHScrollVisible] = useState(false);
  const [hScrollRect, setHScrollRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>({ left: 0, top: 0, width: 0, height: 0 });
  const hScrollHideTimer = useRef<number | null>(null);
  const hScrollThumbRef = useRef<HTMLDivElement>(null);

  // 原生横向滚动条是否可见：当表格底部仍在可视区内时，原生滚动条本来就看得见、好用，
  // 此时悬浮滚动条应完全隐藏、直接沿用原生滚动条，避免两者互相干扰。
  const [hsNativeVisible, setHsNativeVisible] = useState(true);

  // 实时跟踪表格底部是否落在视口内（决定用原生滚动条还是悬浮滚动条）
  useEffect(() => {
    const measure = () => {
      const sc = scrollRef.current;
      if (!sc) return;
      const r = sc.getBoundingClientRect();
      // 底部一点余量内进入视口 → 原生横向滚动条可见 → 悬浮条不接管
      setHsNativeVisible(r.bottom <= window.innerHeight - 8);
    };
    measure();
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    const scroller = scrollRef.current;
    if (scroller) scroller.addEventListener('scroll', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
      if (scroller) scroller.removeEventListener('scroll', measure);
    };
  }, []);

  // 计算悬浮滚动条在视口内的矩形（fixed 定位）。
  // 表格行多时容器底部可能在视口外，故取「容器可视底部」与「视口底部(留 16px)」的较小值，
  // 保证 hover 表格任意位置，横向滚动条都浮在当前视口内可见、可拖。
  const updateHScrollRect = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const rect = scroller.getBoundingClientRect();
    const vh = window.innerHeight;
    const top = Math.max(rect.top + 40, Math.min(rect.bottom - 12, vh - 16));
    setHScrollRect({
      left: rect.left,
      top,
      width: rect.width,
      height: Math.max(0, rect.bottom - rect.top),
    });
  }, []);

  const showHScroll = useCallback(() => {
    if (hScrollHideTimer.current) {
      window.clearTimeout(hScrollHideTimer.current);
      hScrollHideTimer.current = null;
    }
    updateHScrollRect();
    setHScrollVisible(true);
  }, [updateHScrollRect]);

  const hideHScroll = useCallback(() => {
    if (hScrollHideTimer.current) window.clearTimeout(hScrollHideTimer.current);
    hScrollHideTimer.current = window.setTimeout(() => {
      setHScrollVisible(false);
    }, 400);
  }, []);

  // hover / 窗口滚动 / 容器滚动时保持悬浮滚动条贴在视口内
  useEffect(() => {
    if (!hScrollVisible || !scrollRef.current) return;
    updateHScrollRect();
    const update = () => updateHScrollRect();
    let raf = 0;
    const onScrollOrResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    const scroller = scrollRef.current;
    scroller.addEventListener('scroll', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      scroller.removeEventListener('scroll', onScrollOrResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hScrollVisible, updateHScrollRect]);

  // 用 ref 存储测量数据，避免拖拽回调的依赖问题
  const colDotsRef = useRef(colDots);
  colDotsRef.current = colDots;
  const rowDotsRef = useRef(rowDots);
  rowDotsRef.current = rowDots;
  const tableSizeRef = useRef(tableSize);
  tableSizeRef.current = tableSize;

  // 同步 ref
  useEffect(() => {
    isPinnedRef.current = isPinned;
  }, [isPinned]);

  const attrs = element.attrs as TableAttrs;
  const { borderColor: rawBorderColor = '#d9d9d9', borderWidth = '1px' } = attrs || {};
  const borderColor = (() => {
    if (!isDarkMode) return rawBorderColor;
    const c = rawBorderColor.trim();
    if (LIGHT_BG_PATTERN.test(c)) return '#2b3240';
    if (
      /^#(?:d9d9d9|dadada|dbdbdb|dcdcdc|dddddd|dedede|dfdfdf|e0e0e0|e1e1e1|e2e2e2|e3e3e3|e4e4e4|e5e5e5|e6e6e6|e7e7e7|e8e8e8|e9e9e9|eaeaea|ebebeb|ececec|ededed|eeeeee)$/i.test(
        c,
      )
    ) {
      return '#2b3240';
    }
    return rawBorderColor;
  })();

  // 行/列数一律从 Slate 数据读取（element.children），不依赖 React.Children.count：
  // slate-react 0.126 + React 19 下 props.children 可能是可迭代对象而非数组，
  // Children.count 会把它数成 1（列手柄只渲染了一个的根因）
  const rowCount = element.children?.length || React.Children.count(children);
  const firstRow = React.Children.toArray(children)[0];
  // 列数优先从 Slate 数据直接读取：slate-react 0.126 下 firstRow.props.children
  // 经 Children.count 实测只得到 1（而非真实列数），导致拖拽手柄只渲染了第一列一个，
  // 其余列边界无手柄可拖（浏览器实测确诊）
  const colCount = (() => {
    const firstRowCells = (element.children?.[0] as CustomElement | undefined)?.children;
    if (firstRowCells && firstRowCells.length > 0) return firstRowCells.length;
    return firstRow && React.isValidElement(firstRow)
      ? React.Children.count(
          (firstRow as React.ReactElement<{ children?: React.ReactNode }>).props.children,
        )
      : 0;
  })();

  // 从 Slate 数据直接计算每列的 left 和 width，零 DOM 测量
  // 列宽数组：优先取 table 节点 attrs.colWidths（与 cell 解耦，稳定多列布局）；
  // 旧文档无 colWidths 时，从首行 cell 的 width 回退推导。
  const colWidths: number[] = (() => {
    const fromAttrs = (element.attrs as TableAttrs | undefined)?.colWidths;
    if (Array.isArray(fromAttrs) && fromAttrs.length > 0) {
      return fromAttrs.map((w) => Number(w) || 160);
    }
    const firstRowCells = ((element.children?.[0] as CustomElement | undefined)?.children ||
      []) as CustomElement[];
    if (firstRowCells.length > 0) {
      return firstRowCells.map(
        (c) => parseInt(((c as any).attrs?.width as string) || '160px', 10) || 160,
      );
    }
    return [];
  })();

  // 表格总宽 = 各列宽之和，显式写回 <table> 的 width。
  // 关键：覆盖全局/组件库可能设的 table{width:100%}。否则 table-layout:fixed 会把各列
  // 「缩放到填满容器宽度」——拖宽一列其他列就被压窄，且表格永不溢出（出不来横向滚动条）。
  const totalWidth = colWidths.reduce((sum, w) => sum + w, 0);
  // 列宽签名：变化（插列/删列/拖宽）时驱动测量 effect 重跑，保证浮层几何同步
  const colWidthsKey = colWidths.join(',');

  // 列几何：由 DOM 实测 colDots 派生（已随横向滚动重测），保证浮层与真实列对齐
  const colLayouts: Array<{ left: number; width: number }> = useMemo(() => {
    const out: Array<{ left: number; width: number }> = [];
    for (let i = 0; i < colDots.length - 1; i++) {
      out.push({
        left: colDots[i].left,
        width: Math.max(0, colDots[i + 1].left - colDots[i].left),
      });
    }
    return out;
  }, [colDots]);

  // 跨格选中：把视口坐标换算成「内容坐标」，再对照 colDots/rowDots 命中行列。
  // 用纯几何而非 elementFromPoint/DOM 属性，天然免疫 docbar 等悬浮覆盖层，锚点和移动保持一致。
  const getCellFromPoint = useCallback((clientX: number, clientY: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return null;
    const scroller = scrollRef.current;
    const wrapperRect = wrapper.getBoundingClientRect();
    const scrollTop = scroller ? scroller.scrollTop : 0;
    const scrollLeft = scroller ? scroller.scrollLeft : 0;
    const cy = clientY - wrapperRect.top + scrollTop;
    const cx = clientX - wrapperRect.left + scrollLeft;
    const rd = rowDotsRef.current;
    const cd = colDotsRef.current;

    let row = -1;
    for (let i = 0; i < rd.length - 1; i++) {
      if (cy >= rd[i].top && cy < rd[i + 1].top) {
        row = i;
        break;
      }
    }
    if (row === -1 && rd.length >= 2 && cy >= rd[rd.length - 2].top - 0.5) {
      row = rd.length - 2; // 命中最后一行
    }

    let col = -1;
    for (let i = 0; i < cd.length - 1; i++) {
      if (cx >= cd[i].left && cx < cd[i + 1].left) {
        col = i;
        break;
      }
    }
    if (col === -1 && cd.length >= 2 && cx >= cd[cd.length - 2].left - 0.5) {
      col = cd.length - 2;
    }

    if (row < 0 || col < 0) return null;
    return { row, col };
  }, []);

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
      }, 300);
    }
  }, []);

  // 点击外部时清除所有状态
  useEffect(() => {
    if (!isPinned) return;
    const handleOutsideMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsPinned(false);
        setShowDots(false);
        setSelectedRow(null);
        setSelectedCol(null);
        setCellRange(null);
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

  // 点击其他单元格时取消行列选中（通过监听 Slate 选区，但不依赖 selectedCol 状态避免循环）
  const selectedRowRef = useRef(selectedRow);
  const selectedColRef = useRef(selectedCol);
  selectedRowRef.current = selectedRow;
  selectedColRef.current = selectedCol;

  useEffect(() => {
    // 只在 selectedRow/Col 从 null 变为有值时不需要检查，从有值变为 null 时也不需要检查
    // 这里只在 editor.selection 变化时检查是否点击了其他单元格
    if (selectedRowRef.current === null && selectedColRef.current === null) return;
    if (!editor.selection || !isCursorInTable()) return;

    try {
      const tablePath = ReactEditor.findPath(editor, element);
      const relativePath = editor.selection.anchor.path.slice(tablePath.length);
      const rowIdx = relativePath[0];
      const colIdx = relativePath[1];
      // 如果当前选区不在选中的行/列上，说明用户点击了其他单元格，取消选中
      if (selectedRowRef.current !== null && selectedRowRef.current !== rowIdx) {
        setSelectedRow(null);
      }
      if (selectedColRef.current !== null && selectedColRef.current !== colIdx) {
        setSelectedCol(null);
      }
    } catch {
      /* ignore */
    }
  }, [editor.selection, element, editor, isCursorInTable]);

  // 点击表格外部时取消行列选中
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSelectedRow(null);
        setSelectedCol(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
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
      // 关键：colDots/rowDots 存「内容坐标」（相对滚动内容左上角），
      // 因为所有跟随表格的浮层都渲染在 scrollContainer 内部、随内容滚动。
      // getBoundingClientRect 是视口坐标，须加回滚动偏移。
      const scroller = scrollRef.current;
      const scrollOffX = scroller ? scroller.scrollLeft : 0;
      const scrollOffY = scroller ? scroller.scrollTop : 0;
      const rows = tableRef.current.querySelectorAll('tr');
      if (rows.length === 0) {
        if (retryCount < maxRetries) {
          retryCount++;
          rafId = requestAnimationFrame(measure);
        }
        return;
      }

      // 使用 table.rows[0].cells 标准 API，最可靠
      const firstRow = tableRef.current.rows[0];
      if (!firstRow || firstRow.cells.length === 0) {
        if (retryCount < maxRetries) {
          retryCount++;
          rafId = requestAnimationFrame(measure);
        }
        return;
      }
      const cells = firstRow.cells;

      setTableSize({
        width: tableRect.width,
        height: tableRect.height,
      });

      const newRowDots: DotPosition[] = [];
      for (let i = 0; i <= rows.length; i++) {
        if (i === 0) {
          const rect = rows[0].getBoundingClientRect();
          newRowDots.push({ top: rect.top - wrapperRect.top + scrollOffY, left: 0 });
        } else if (i === rows.length) {
          const rect = rows[rows.length - 1].getBoundingClientRect();
          newRowDots.push({ top: rect.bottom - wrapperRect.top + scrollOffY, left: 0 });
        } else {
          const prevRect = rows[i - 1].getBoundingClientRect();
          const currRect = rows[i].getBoundingClientRect();
          const midY = (prevRect.bottom + currRect.top) / 2;
          newRowDots.push({ top: midY - wrapperRect.top + scrollOffY, left: 0 });
        }
      }
      setRowDots(newRowDots);

      // 计算 colDots（列头定位、拖拽手柄等，内容坐标）
      const newColDots: DotPosition[] = [];
      for (let i = 0; i <= cells.length; i++) {
        if (i === 0) {
          const rect = (cells[0] as HTMLElement).getBoundingClientRect();
          newColDots.push({ top: 0, left: rect.left - wrapperRect.left + scrollOffX });
        } else if (i === cells.length) {
          const rect = (cells[cells.length - 1] as HTMLElement).getBoundingClientRect();
          newColDots.push({ top: 0, left: rect.right - wrapperRect.left + scrollOffX });
        } else {
          const rect = (cells[i] as HTMLElement).getBoundingClientRect();
          newColDots.push({ top: 0, left: rect.left - wrapperRect.left + scrollOffX });
        }
      }
      setColDots(newColDots);
    };

    measure();

    // 滚动时内容坐标不变（浮层在容器内随内容滚动），无需重测；
    // 仅同步 scrollLeft，供 wrapper 层的工具栏换算位置。
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollLeft(scrollRef.current.scrollLeft);
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
  }, [children, rowCount, colCount, colWidthsKey]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const cell = getCellFromPoint(e.clientX, e.clientY);
      setMenuCell(cell);
      setMenuPosition({ x: e.clientX, y: e.clientY });
      setMenuVisible(true);
    },
    [getCellFromPoint],
  );

  const handleCloseMenu = useCallback(() => {
    setMenuVisible(false);
    setMenuCell(null);
  }, []);

  const handleInsertRow = useCallback(
    (at: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsPinned(true);
      setShowDots(true);
      setHoveredRow(null);
      setHoveredCol(null);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      try {
        const path = ReactEditor.findPath(editor, element);
        insertRowAt(editor, path, at);
        // 选中索引跟随原行：在选中行上方插入时，原行下移一格
        setSelectedRow((prev) => (prev !== null && at <= prev ? prev + 1 : prev));
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
      setHoveredRow(null);
      setHoveredCol(null);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      try {
        const path = ReactEditor.findPath(editor, element);
        insertColumnAt(editor, path, at);
        // 选中索引跟随原列：在选中列左侧插入时，原列右移一格
        setSelectedCol((prev) => (prev !== null && at <= prev ? prev + 1 : prev));
      } catch (err) {
        console.error('Insert column failed:', err);
      }
    },
    [editor, element],
  );

  // ========== 列宽拖拽 ==========
  const handleResizeStart = useCallback(
    (colIndex: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!tableRef.current) return;
      const cells = tableRef.current.querySelectorAll(`td[data-col-index="${colIndex}"]`);
      const firstCell = cells[0] as HTMLElement | undefined;
      const startWidth = firstCell ? firstCell.getBoundingClientRect().width : 160;

      resizingRef.current = {
        colIndex,
        startX: e.clientX,
        startWidth,
        currentWidth: startWidth,
      };
      setDraggingCol(colIndex);

      const handleMove = (moveEvent: MouseEvent) => {
        if (!resizingRef.current || !wrapperRef.current) return;
        const delta = moveEvent.clientX - resizingRef.current.startX;
        const newWidth = Math.max(60, resizingRef.current.startWidth + delta);
        resizingRef.current.currentWidth = newWidth;

        const colLeft = colDotsRef.current[colIndex]?.left || 0;
        setDragIndicatorX(colLeft + newWidth);

        // 实时预览：直接改 <col> 宽度（列宽由 colgroup 控制，而非 cell）
        const colEls = tableRef.current?.querySelectorAll('col');
        if (colEls && colEls[colIndex]) {
          (colEls[colIndex] as HTMLElement).style.width = `${newWidth}px`;
        }
      };

      const handleUp = () => {
        if (!resizingRef.current) return;
        const { colIndex: ci, currentWidth } = resizingRef.current;

        try {
          const tablePath = ReactEditor.findPath(editor, element);
          const curAttrs = ((element.attrs || {}) as TableAttrs) || {};
          const curWidths = Array.isArray(curAttrs.colWidths)
            ? [...(curAttrs.colWidths as number[])]
            : [];
          while (curWidths.length <= ci) curWidths.push(160);
          curWidths[ci] = currentWidth;
          // 列宽写入 table 节点 colWidths，与 cell 解耦
          updateTable(editor, tablePath, { colWidths: curWidths });
        } catch (err) {
          console.error('Update column width failed:', err);
        }

        resizingRef.current = null;
        setDraggingCol(null);
        setDragIndicatorX(null);
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    },
    [editor, element],
  );

  // ========== 跨单元格拖拽选中 ==========
  // 抑制 DocBar：拖选期间让 docbar-context 清空 activeElement，避免"选中整格区域"时误弹块工具栏
  const setDocbarCellSelect = useCallback((selecting: boolean) => {
    window.dispatchEvent(new CustomEvent('trae:table-cell-select', { detail: { selecting } }));
  }, []);

  useEffect(() => {
    const takeOver = () => {
      // 接管拖拽：清掉浏览器/Slate 正在做的文本选区，避免后续误选文字或光标乱跑
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) sel.removeAllRanges();
      Transforms.deselect(editor);
      setDocbarCellSelect(true);
    };

    const resolveCell = (e: MouseEvent) => getCellFromPoint(e.clientX, e.clientY);

    const onMouseMove = (e: MouseEvent) => {
      const drag = cellDragRef.current;
      if (!drag) return;
      if (!(e.buttons & 1)) {
        // 鼠标已抬起但 move 最后触发 → 按抬起处理
        if (cellDragRef.current) cellDragRef.current = null;
        return;
      }
      const cell = resolveCell(e);
      if (!cell) return;
      // 只有指针真正进入「不同」的单元格，才进入整格选中。
      // 仍停在锚点格内时不做任何接管，保留浏览器原生文本选择（同格内可正常选字）。
      if (!drag.moved) {
        if (cell.row === drag.anchorRow && cell.col === drag.anchorCol) return;
        drag.moved = true;
        takeOver();
      }
      setCellRange({
        r0: drag.anchorRow,
        c0: drag.anchorCol,
        r1: cell.row,
        c1: cell.col,
      });
    };

    const onMouseUp = () => {
      const drag = cellDragRef.current;
      if (!drag) return;
      // 单击（无位移）→ 回到单格编辑，清空范围
      if (!drag.moved) setCellRange(null);
      cellDragRef.current = null;
      // 不再在此关掉 DocBar 抑制：只要还留有 cellRange/行列选中，
      // 由下方「选中存在性」effect 持续保持抑制，避免选区高亮时误弹块工具栏
    };

    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('mouseup', onMouseUp, true);
    return () => {
      document.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('mouseup', onMouseUp, true);
      setDocbarCellSelect(false);
    };
  }, [editor, setDocbarCellSelect, getCellFromPoint]);

  // 只要还存在跨格选区 / 行列选中，就持续抑制 DocBar 弹出；
  // 选中清除后恢复。这是问题修复1：选中单元格时不该出现块工具栏
  useEffect(() => {
    const active = cellRange !== null || selectedRow !== null || selectedCol !== null;
    setDocbarCellSelect(active);
    return () => {
      setDocbarCellSelect(false);
    };
  }, [cellRange, selectedRow, selectedCol, setDocbarCellSelect]);

  // ========== 行列选中 ==========
  const handleSelectRow = useCallback(
    (rowIndex: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedRow((prev) => (prev === rowIndex ? null : rowIndex));
      setSelectedCol(null);
      setCellRange(null);
      setHoveredCol(null);
      setHoveredRow(null);
      setIsPinned(true);
      setShowDots(true);
      // 同步设置 Slate 选区到该行的第一个单元格，确保 useEffect 检查时匹配
      try {
        const tablePath = ReactEditor.findPath(editor, element);
        const cellPath = [...tablePath, rowIndex, 0];
        Transforms.select(editor, Editor.start(editor, cellPath));
      } catch {
        /* ignore */
      }
    },
    [editor, element],
  );

  const handleSelectCol = useCallback(
    (colIndex: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedCol((prev) => (prev === colIndex ? null : colIndex));
      setSelectedRow(null);
      setCellRange(null);
      setHoveredCol(null);
      setHoveredRow(null);
      setIsPinned(true);
      setShowDots(true);
      // 同步设置 Slate 选区到该列的第一个单元格，确保 useEffect 检查时匹配
      try {
        const tablePath = ReactEditor.findPath(editor, element);
        const cellPath = [...tablePath, 0, colIndex];
        Transforms.select(editor, Editor.start(editor, cellPath));
      } catch {
        /* ignore */
      }
    },
    [editor, element],
  );

  const handleDeleteSelectedRow = useCallback(() => {
    if (selectedRow === null) return;
    try {
      const tablePath = ReactEditor.findPath(editor, element);
      // 删除前先清空选区，防止 Slate normalize 后把选区锚到相邻 cell
      Transforms.deselect(editor);
      ReactEditor.blur(editor);
      deleteRowAt(editor, tablePath, selectedRow);
      setSelectedRow(null);
      // 删除后再次清空（防止 normalize 重新设置选区）
      Transforms.deselect(editor);
      ReactEditor.blur(editor);
      // DOM 兜底
      const domSel = window.getSelection?.();
      if (domSel && domSel.rangeCount > 0) domSel.removeAllRanges();
      const ae = document.activeElement as HTMLElement | null;
      ae?.blur?.();
    } catch (err) {
      console.error('Delete row failed:', err);
    }
  }, [selectedRow, editor, element]);

  const handleDeleteSelectedCol = useCallback(() => {
    if (selectedCol === null) return;
    try {
      const tablePath = ReactEditor.findPath(editor, element);
      // 删除前先清空选区，防止 Slate normalize 后把选区锚到相邻 cell
      Transforms.deselect(editor);
      ReactEditor.blur(editor);
      deleteColumnAt(editor, tablePath, selectedCol);
      setSelectedCol(null);
      // 删除后再次清空（防止 normalize 重新设置选区）
      Transforms.deselect(editor);
      ReactEditor.blur(editor);
      // DOM 兜底
      const domSel = window.getSelection?.();
      if (domSel && domSel.rangeCount > 0) domSel.removeAllRanges();
      const ae = document.activeElement as HTMLElement | null;
      ae?.blur?.();
    } catch (err) {
      console.error('Delete column failed:', err);
    }
  }, [selectedCol, editor, element]);

  // 重建后把光标放回合并/拆分后的左上格，避免选区悬空
  const restoreIntoTable = useCallback(
    (tablePath: number[]) => {
      try {
        Transforms.select(editor, Editor.start(editor, [...tablePath, 0, 0]));
      } catch {
        /* ignore */
      }
    },
    [editor],
  );

  // 右键菜单的目标上下文：是否多格选区 / 目标是否为合并格 / 背景色等
  const menuInfo = useMemo(() => {
    if (!menuVisible) {
      return { hasRange: false, isMerged: false, cellBg: '', rowBg: '' };
    }
    const target = menuCell ?? (cellRange ? { row: cellRange.r0, col: cellRange.c0 } : null);
    let isMerged = false;
    let cellBg = '';
    let rowBg = '';
    try {
      const tablePath = ReactEditor.findPath(editor, element);
      if (target) {
        const info = getLogicalCell(editor, tablePath, target.row, target.col);
        if (info) {
          const ca = (info.node.attrs || {}) as TableCellAttrs;
          isMerged = (ca.colspan ?? 1) > 1 || (ca.rowspan ?? 1) > 1;
          cellBg = ca.bgColor || '';
        }
      }
      const tRow = selectedRow ?? target?.row;
      if (tRow != null) {
        const rowNode = (element.children as CustomElement[] | undefined)?.[tRow];
        rowBg = ((rowNode?.attrs || {}) as TableRowAttrs).bgColor || '';
      }
    } catch {
      /* ignore */
    }
    return {
      hasRange: cellRange !== null || selectedRow !== null || selectedCol !== null,
      isMerged,
      cellBg,
      rowBg,
    };
  }, [menuVisible, menuCell, cellRange, selectedRow, selectedCol, editor, element, getLogicalCell]);

  const handleMenuAction = useCallback(
    (action: TableMenuAction, payload?: any) => {
      try {
        const tablePath = ReactEditor.findPath(editor, element);
        const target = menuCell ?? (cellRange ? { row: cellRange.r0, col: cellRange.c0 } : null);
        const tRow = selectedRow ?? target?.row ?? null;
        const tCol = selectedCol ?? target?.col ?? null;

        switch (action) {
          case 'merge': {
            // 跨格选区 / 选中整行 / 选中整列 → 合成对应矩形
            let rr0: number | undefined;
            let cc0: number | undefined;
            let rr1: number | undefined;
            let cc1: number | undefined;
            if (cellRange) {
              rr0 = cellRange.r0;
              cc0 = cellRange.c0;
              rr1 = cellRange.r1;
              cc1 = cellRange.c1;
            } else if (selectedRow !== null) {
              const g = computeGrid(element);
              rr0 = rr1 = selectedRow;
              cc0 = 0;
              cc1 = g.cols - 1;
            } else if (selectedCol !== null) {
              const g = computeGrid(element);
              rr0 = 0;
              rr1 = g.rows - 1;
              cc0 = cc1 = selectedCol;
            }
            if (rr0 !== undefined) {
              mergeCells(editor, tablePath, rr0, cc0!, rr1!, cc1!);
              setCellRange(null);
              setSelectedRow(null);
              setSelectedCol(null);
              restoreIntoTable(tablePath);
            }
            break;
          }
          case 'split':
            if (target) {
              splitCell(editor, tablePath, target.row, target.col);
              restoreIntoTable(tablePath);
            }
            break;
          case 'cellColor':
            if (cellRange) {
              setCellRangeBgColor(
                editor,
                tablePath,
                cellRange.r0,
                cellRange.c0,
                cellRange.r1,
                cellRange.c1,
                payload,
              );
            } else if (target) {
              setCellBgColor(editor, tablePath, target.row, target.col, payload);
            }
            break;
          case 'vertAlign':
            if (cellRange) {
              setCellRangeVertAlign(
                editor,
                tablePath,
                cellRange.r0,
                cellRange.c0,
                cellRange.r1,
                cellRange.c1,
                payload as 'top' | 'middle' | 'bottom',
              );
            } else if (target) {
              setCellVertAlign(
                editor,
                tablePath,
                target.row,
                target.col,
                payload as 'top' | 'middle' | 'bottom',
              );
            }
            break;
          case 'rowColor':
            if (tRow !== null) setRowBgColor(editor, tablePath, tRow, payload);
            break;
          case 'borderColor':
            setTableBorder(editor, tablePath, { borderColor: payload });
            break;
          case 'borderWidth':
            setTableBorder(editor, tablePath, { borderWidth: payload });
            break;
          case 'insertRow':
            if (tRow !== null) insertRowAt(editor, tablePath, tRow + 1);
            break;
          case 'deleteRow':
            if (tRow !== null) deleteRowAt(editor, tablePath, tRow);
            break;
          case 'insertColumn':
            if (tCol !== null) insertColumnAt(editor, tablePath, tCol + 1);
            break;
          case 'deleteColumn':
            if (tCol !== null) deleteColumnAt(editor, tablePath, tCol);
            break;
          case 'deleteTable':
            deleteTable(editor, tablePath);
            break;
          default:
            break;
        }
      } catch (err) {
        console.error('Table menu action failed:', err);
      }
    },
    [editor, element, menuCell, cellRange, selectedRow, selectedCol, restoreIntoTable, computeGrid],
  );

  // ========== 全局监听：调试 + 兜底清空非法光标 ==========
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // 1) 捕获阶段拦截：比 React 合成事件更早，确保浏览器默认行为被阻止
    const onMouseDownCapture = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t || !wrapper.contains(t)) return;

      // 白名单：td/th（可编辑单元格）
      const inCell = t.closest('td, th');
      if (inCell) return; // 正常点击单元格，放行

      // 白名单：已注册的交互控件
      const interactive = t.closest(
        [
          'button',
          '[class*="colHeader"]',
          '[class*="rowHeader"]',
          '[class*="selectionToolbar"]',
          '[class*="toolbarBtn"]',
          '[class*="resizeHandle"]',
          '[class*="contextMenu"]',
        ].join(','),
      );
      if (interactive) {
        // 交互控件：阻止默认行为（防光标）但允许事件传播（让 onClick 正常触发）
        e.preventDefault();
        return;
      }

      // 非法区域（空白、dot、indicator、Highlight 等）
      console.log('[Table] mousedown on non-cell target:', {
        tag: t.tagName,
        className: typeof t.className === 'string' ? t.className : '',
        id: t.id,
        parentTag: t.parentElement?.tagName,
        parentClass:
          typeof t.parentElement?.className === 'string' ? t.parentElement.className : '',
        rect: t.getBoundingClientRect
          ? {
              x: t.getBoundingClientRect().x,
              y: t.getBoundingClientRect().y,
              w: t.getBoundingClientRect().width,
              h: t.getBoundingClientRect().height,
            }
          : null,
        clientX: e.clientX,
        clientY: e.clientY,
      });
      e.preventDefault();
      e.stopPropagation();
    };

    // 2) selectionchange 兜底：如果光标意外落在 wrapper 内但不在 td/th 内，立即清空
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed === false) {
        // 有非折叠选区（用户选中文字）时不清空
        if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
          const range = sel.getRangeAt(0);
          const startEl =
            range.startContainer.nodeType === 1
              ? (range.startContainer as Element)
              : range.startContainer.parentElement;
          if (startEl && wrapper.contains(startEl)) {
            const inCell = startEl.closest('td, th');
            if (!inCell) {
              // 选区在 wrapper 内但不在单元格内 → 清空
              sel.removeAllRanges();
            }
          }
        }
        return;
      }
      // 折叠选区（光标）
      const range = sel.getRangeAt(0);
      const startEl =
        range.startContainer.nodeType === 1
          ? (range.startContainer as Element)
          : range.startContainer.parentElement;
      if (!startEl || !wrapper.contains(startEl)) return;

      const inCell = startEl.closest('td, th');
      if (!inCell) {
        console.log('[Table] Caret landed outside cell, clearing:', {
          startContainerTag: range.startContainer.nodeName,
          startElTag: startEl.tagName,
          startElClass: typeof startEl.className === 'string' ? startEl.className : '',
          offset: range.startOffset,
        });
        sel.removeAllRanges();
      }
    };

    // 捕获阶段，最早执行
    document.addEventListener('mousedown', onMouseDownCapture, true);
    document.addEventListener('selectionchange', onSelectionChange);

    return () => {
      document.removeEventListener('mousedown', onMouseDownCapture, true);
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, []);

  // ========== hover 检测（列头区域）==========
  const lastMouseMoveRef = useRef(0);

  const handleWrapperMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseMoveRef.current < 50) return;
      lastMouseMoveRef.current = now;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const wrapperRect = wrapper.getBoundingClientRect();
      const y = e.clientY - wrapperRect.top;
      if (y < 0 || y > 14) {
        setHoveredCol(null);
        return;
      }
      // colLayouts 是内容坐标，鼠标 x 须加回滚动偏移
      const x = e.clientX - wrapperRect.left + scrollLeft;
      for (let i = 0; i < colLayouts.length; i++) {
        const left = colLayouts[i].left;
        const right = left + colLayouts[i].width;
        if (x >= left && x < right) {
          setHoveredCol(i);
          return;
        }
      }
      setHoveredCol(null);
    },
    [colLayouts, scrollLeft],
  );

  // 拖拽指示线
  const resizeIndicatorLine =
    dragIndicatorX !== null && draggingCol !== null ? (
      <div
        className={styles.resizeIndicatorLine}
        style={{
          left: dragIndicatorX,
          top: 0,
          height: tableSizeRef.current.height,
        }}
      />
    ) : null;

  // 拖拽列高亮
  const dragColHighlight =
    draggingCol !== null && colDots.length > draggingCol + 1 ? (
      <div
        className={styles.dragColHighlight}
        style={{
          left: colDots[draggingCol]?.left || 0,
          width: (colDots[draggingCol + 1]?.left || 0) - (colDots[draggingCol]?.left || 0),
          height: tableSizeRef.current.height,
        }}
      />
    ) : null;

  // hover 预览高亮
  const hoverRowHighlight =
    hoveredRow !== null && selectedRow === null && rowDots.length > hoveredRow
      ? (() => {
          const top = rowDots[hoveredRow]?.top || 0;
          const bottom = rowDots[hoveredRow + 1]?.top || top;
          return (
            <div
              className={styles.hoverHighlight}
              style={{
                top,
                left: 0,
                width: tableSize.width,
                height: bottom - top,
              }}
            />
          );
        })()
      : null;

  const hoverColHighlight =
    hoveredCol !== null && selectedCol === null && colDots.length > hoveredCol + 1 ? (
      <div
        className={styles.hoverHighlight}
        style={{
          top: 0,
          left: colDots[hoveredCol]?.left || 0,
          width: (colDots[hoveredCol + 1]?.left || 0) - (colDots[hoveredCol]?.left || 0),
          height: tableSize.height,
        }}
      />
    ) : null;

  // 选中高亮
  const selectedRowHighlight =
    selectedRow !== null && rowDots.length > selectedRow
      ? (() => {
          const top = rowDots[selectedRow]?.top || 0;
          const bottom = rowDots[selectedRow + 1]?.top || top;
          return (
            <div
              className={styles.selectedHighlight}
              style={{
                top,
                left: 0,
                width: tableSize.width,
                height: bottom - top,
              }}
            />
          );
        })()
      : null;

  const selectedColHighlight =
    selectedCol !== null && colDots.length > selectedCol + 1 ? (
      <div
        className={styles.selectedHighlight}
        style={{
          top: 0,
          left: colDots[selectedCol]?.left || 0,
          width: (colDots[selectedCol + 1]?.left || 0) - (colDots[selectedCol]?.left || 0),
          height: tableSize.height,
        }}
      />
    ) : null;

  // 跨单元格拖拽选中的矩形高亮（整格选中，便于合并/拆分）
  const cellRangeHighlight =
    cellRange !== null &&
    colDots.length > Math.max(cellRange.c0, cellRange.c1) + 1 &&
    rowDots.length > Math.max(cellRange.r0, cellRange.r1) + 1
      ? (() => {
          const top = rowDots[Math.min(cellRange.r0, cellRange.r1)]?.top || 0;
          const bottom = rowDots[Math.max(cellRange.r0, cellRange.r1) + 1]?.top || top;
          const left = colDots[Math.min(cellRange.c0, cellRange.c1)]?.left || 0;
          const right = colDots[Math.max(cellRange.c0, cellRange.c1) + 1]?.left || left;
          return (
            <div
              className={styles.cellRangeHighlight}
              style={{
                top,
                left,
                width: Math.max(0, right - left),
                height: Math.max(0, bottom - top),
              }}
            />
          );
        })()
      : null;

  // 渲染时实时判断横向溢出与滚动边界（替代异步 state，保证 hover 表格必现滚动条/阴影）
  const hsScroller = scrollRef.current;
  const overflowNow = !!hsScroller && hsScroller.scrollWidth > hsScroller.clientWidth + 1;
  const hsMax = hsScroller ? hsScroller.scrollWidth - hsScroller.clientWidth : 0;
  const hsAtRight = hsScroller ? hsScroller.scrollLeft >= hsMax - 1 : true;
  const hsAtLeft = hsScroller ? hsScroller.scrollLeft > 1 : false;

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onContextMenu={handleContextMenu}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleWrapperMouseMove}
      onMouseDown={(e) => {
        const t = e.target as HTMLElement;
        // 右键菜单（面板/遮罩）内点击：既不当成单元格拖选锚点，
        // 也不清掉已有选区，避免「上色后选区消失」（问题修复3）
        if (t.closest && t.closest('[data-table-menu]')) {
          return;
        }
        // 记录锚点：在单元格内按下即可能开始拖选（跨格才接管，单击仍正常编辑）
        const anchorCell = getCellFromPoint(e.clientX, e.clientY);
        if (anchorCell) {
          cellDragRef.current = {
            anchorRow: anchorCell.row,
            anchorCol: anchorCell.col,
            moved: false,
            startX: e.clientX,
            startY: e.clientY,
          };
        }
        // Bug 1：点击 wrapper 内非单元格、非交互控件时，事件会冒泡到外层
        // Slate contentEditable 并产生光标。仅对白名单节点放行：
        if (t.closest) {
          const editable =
            t.closest('td, th') ||
            t.closest(
              // 合法交互控件 / 覆盖层
              [
                'button',
                '[class*="colHeader"]',
                '[class*="rowHeader"]',
                '[class*="selectionToolbar"]',
                '[class*="toolbarBtn"]',
                '[class*="indicatorLine"]',
                '[class*="resizeHandle"]',
                '[class*="Highlight"]', // hover/selected/drag 高亮
                '[class*="dot"]',
                '[class*="contextMenu"]',
              ].join(','),
            );
          if (!editable) {
            // 不属于可编辑单元格 且 不属于交互控件 → 阻止冒泡到外层 contentEditable 产生光标
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }}
    >
      {/* 1) wrapper 层级浮层：不随表格横向滚动、不挤宽页面
            - selectionToolbar: 选中行/列上方的删除按钮 (top:-36 在 wrapper 内能渲染)
            - tooltip:        "插入行/列" 提示 (left:-12 / top:-12)
       */}
      {(selectedRow !== null || selectedCol !== null) && (
        <div
          className={styles.selectionToolbar}
          contentEditable={false}
          style={{
            // 选中列时，按钮出现在该列上方居中（colDots 是内容坐标，工具栏在 wrapper 层须减 scrollLeft）
            ...(selectedCol !== null && colDots.length > selectedCol + 1
              ? {
                  left:
                    ((colDots[selectedCol]?.left || 0) + (colDots[selectedCol + 1]?.left || 0)) /
                      2 -
                    scrollLeft,
                  top: -36,
                  transform: 'translateX(-50%)',
                }
              : {}),
            // 选中行时，按钮出现在该行左侧上方
            ...(selectedRow !== null && rowDots[selectedRow]
              ? {
                  left: 0,
                  top: rowDots[selectedRow].top - 36,
                  transform: 'none',
                }
              : {}),
          }}
        >
          {selectedRow !== null && (
            <>
              <button
                className={styles.toolbarBtn}
                onClick={(e) => handleInsertRow(selectedRow, e)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {/* 向上箭头 + 顶部 + 号 = 往上插行 */}
                  <path d="M12 22V8M7 11l5-5 5 5M9 6h6M12 3v6" />
                </svg>
                <span>往上插行</span>
              </button>
              <button
                className={styles.toolbarBtn}
                onClick={(e) => handleInsertRow(selectedRow + 1, e)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {/* 向下箭头 + 底部 + 号 = 往下插行 */}
                  <path d="M12 2v14M7 13l5 5 5-5M9 18h6M12 15v6" />
                </svg>
                <span>往下插行</span>
              </button>
            </>
          )}
          {selectedRow !== null && (
            <button
              className={styles.toolbarBtn}
              onClick={handleDeleteSelectedRow}
              onMouseDown={(e) => {
                // 关键：阻止浏览器原生 mousedown 改 document.selection / 抢焦点
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              <span>删除行</span>
            </button>
          )}
          {selectedCol !== null && (
            <>
              <button
                className={styles.toolbarBtn}
                onClick={(e) => handleInsertColumn(selectedCol, e)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {/* 向左箭头 + 左侧 + 号 = 往左插列 */}
                  <path d="M22 12H8M11 7l-5 5 5 5M6 9v6M3 12h6" />
                </svg>
                <span>往左插列</span>
              </button>
              <button
                className={styles.toolbarBtn}
                onClick={(e) => handleInsertColumn(selectedCol + 1, e)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {/* 向右箭头 + 右侧 + 号 = 往右插列 */}
                  <path d="M2 12h14M13 7l5 5-5 5M18 9v6M15 12h6" />
                </svg>
                <span>往右插列</span>
              </button>
            </>
          )}
          {selectedCol !== null && (
            <button
              className={styles.toolbarBtn}
              onClick={handleDeleteSelectedCol}
              onMouseDown={(e) => {
                // 关键：阻止浏览器原生 mousedown 改 document.selection / 抢焦点
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              <span>删除列</span>
            </button>
          )}
        </div>
      )}

      {/* 横向滚动容器 —— 所有"跟随表格内容横向滚动"的浮层都搬到这里：
          row/col headers、resize handle、selection highlight、indicator、tooltip 等。
          关键：把它们放在 scrollContainer 里后，wrapper 就不再被绝对定位浮层撑宽，
          页面不会出现横向滚动条；表格列超出视口时由本容器自己出横向滚动条。
          横向滚动时这些浮层也会跟着一起移，"左侧点停留不变"的 bug 一并修掉。 */}
      <div
        ref={scrollRef}
        className={styles.scrollContainer}
        onMouseEnter={showHScroll}
        onMouseLeave={hideHScroll}
      >
        {/* 行头选择区（跟随单元格） */}
        {showDots &&
          Array.from({ length: rowCount }, (_, i) => {
            const top = rowDots[i]?.top || 0;
            const bottom = rowDots[i + 1]?.top || top;
            return (
              <div
                key={`row-header-${i}`}
                contentEditable={false}
                className={`${styles.rowHeader} ${selectedRow === i ? styles.rowHeaderSelected : ''}`}
                style={{
                  top,
                  left: colDots[0]?.left || 0,
                  height: bottom - top,
                }}
                onClick={(e) => handleSelectRow(i, e)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onMouseEnter={() => {
                  handleMouseEnter();
                  setHoveredRow(i);
                }}
                onMouseLeave={() => {
                  handleMouseLeave();
                  setHoveredRow(null);
                }}
              />
            );
          })}

        {/* 列头视觉条 — 从 Slate 数据计算位置，零 DOM 测量 */}
        {showDots &&
          colLayouts.map((layout, i) => (
            <div
              key={`col-header-${i}`}
              contentEditable={false}
              className={`${styles.colHeader} ${selectedCol === i ? styles.colHeaderSelected : ''} ${hoveredCol === i && selectedCol === null ? styles.colHeaderHovered : ''}`}
              style={{
                top: 0,
                left: layout.left,
                width: layout.width,
                pointerEvents: 'auto',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectCol(i, e);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseEnter={() => {
                handleMouseEnter();
                setHoveredCol(i);
              }}
              onMouseLeave={() => {
                handleMouseLeave();
                setHoveredCol(null);
              }}
            />
          ))}

        {/* 拖拽手柄 */}
        {showDots &&
          Array.from({ length: colCount }, (_, i) => {
            const rightEdge = colDots[i + 1];
            if (!rightEdge) return null;
            return (
              <div
                key={`resize-${i}`}
                contentEditable={false}
                className={`${styles.resizeHandle} ${draggingCol === i ? styles.resizeHandleActive : ''}`}
                style={{
                  left: rightEdge.left,
                  top: 0,
                  height: tableSize.height,
                }}
                onMouseDown={(e) => handleResizeStart(i, e)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}

        {/* 拖拽指示线 */}
        {resizeIndicatorLine}

        {/* 拖拽列高亮 */}
        {dragColHighlight}

        {/* hover 预览高亮 */}
        {hoverRowHighlight}
        {hoverColHighlight}

        {/* 选中高亮 */}
        {selectedRowHighlight}
        {selectedColHighlight}

        {/* 跨单元格整格选区 */}
        {cellRangeHighlight}

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
              width: totalWidth > 0 ? `${totalWidth}px` : undefined,
            }}
          >
            {colWidths.length > 0 && (
              <colgroup>
                {colWidths.map((w, i) => (
                  <col key={i} style={{ width: `${w}px` }} />
                ))}
              </colgroup>
            )}
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

      {/* 悬浮横向滚动条：渲染时实时判断是否存在横向溢出（不再依赖异步检测，
          保证 hover 表格一定能出现）；且仅在原生横向滚动条不可见（表格底部滚出视口）时才接管，
          平时表格底部在可视区内则完全隐藏、沿用原生滚动条 */}
      {hScrollVisible && overflowNow && !hsNativeVisible && (
        <div
          className={styles.hScrollOverlay}
          style={{ left: hScrollRect.left, top: hScrollRect.top, width: hScrollRect.width }}
          onMouseEnter={showHScroll}
          onMouseLeave={hideHScroll}
        >
          <FloatingHScrollBar
            scrollRef={scrollRef}
            thumbRef={hScrollThumbRef}
            onScrubStart={showHScroll}
          />
        </div>
      )}

      {/* 左右缘渐变阴影：有溢出未到尽头且原生滚动条不可见时提示「还有更多列」 */}
      {overflowNow && hScrollVisible && !hsNativeVisible && !hsAtRight && (
        <div
          className={styles.hScrollRightShadow}
          style={{
            left: hScrollRect.left + hScrollRect.width - 10,
            top: hScrollRect.top,
            height: Math.min(hScrollRect.height, window.innerHeight - hScrollRect.top),
          }}
        />
      )}
      {overflowNow && hScrollVisible && !hsNativeVisible && hsAtLeft && (
        <div
          className={styles.hScrollLeftShadow}
          style={{
            left: hScrollRect.left,
            top: hScrollRect.top,
            height: Math.min(hScrollRect.height, window.innerHeight - hScrollRect.top),
          }}
        />
      )}

      <TableContextMenu
        visible={menuVisible}
        position={menuPosition}
        onClose={handleCloseMenu}
        hasRange={menuInfo.hasRange}
        isMerged={menuInfo.isMerged}
        cellBg={menuInfo.cellBg}
        rowBg={menuInfo.rowBg}
        borderColor={rawBorderColor}
        onAction={handleMenuAction}
      />
    </div>
  );
};

export type { TableProps };

// 悬浮横向滚动条：根据容器滚动进度绘制 track + thumb，点击 track 或拖动 thumb 同步滚动
interface FloatingHScrollBarProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  thumbRef: React.RefObject<HTMLDivElement | null>;
  onScrubStart: () => void;
}

const FloatingHScrollBar: React.FC<FloatingHScrollBarProps> = ({
  scrollRef,
  thumbRef,
  onScrubStart,
}) => {
  const [progress, setProgress] = useState(0);
  // 拖拽状态：pointerId / 按下位置 / 起始滚动 / 是否已产生位移（未位移放起视为单击跳转）
  const dragStateRef = useRef<{
    pointerId: number;
    startClientX: number;
    startScrollLeft: number;
    moved: boolean;
  } | null>(null);

  // 同步 thumb 位置到滚动进度
  const sync = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    const max = sc.scrollWidth - sc.clientWidth;
    setProgress(max > 0 ? sc.scrollLeft / max : 0);
  }, [scrollRef]);

  useEffect(() => {
    sync();
    const sc = scrollRef.current;
    if (!sc) return;
    sc.addEventListener('scroll', sync, { passive: true });
    return () => sc.removeEventListener('scroll', sync);
  }, [sync, scrollRef]);

  const sc = scrollRef.current;
  const viewport = sc ? sc.clientWidth : 0;
  const maxScroll = sc ? sc.scrollWidth - sc.clientWidth : 0;
  // 滑块宽度 = 可视/内容比例，留最小宽度便于点按
  const thumbWidth = maxScroll > 0 ? Math.max(36, viewport * (viewport / sc!.scrollWidth)) : 36;

  // 仅"滑块"可拖（比例映射，贴近原生滚动条手感）。事件只绑在滑块上，
  // 轨道不再拦截整条拖拽 → 鼠标在滑块之外的空处按住不会被误拖。
  const onThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!(e.button === 0)) return;
    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    } catch {
      /* 忽略捕获失败 */
    }
    dragStateRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startScrollLeft: scrollRef.current ? scrollRef.current.scrollLeft : 0,
      moved: false,
    };
    onScrubStart();
  };

  const onThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = dragStateRef.current;
    const sc = scrollRef.current;
    if (!st || !sc || st.pointerId !== e.pointerId) return;
    // 只有左键真正按下才滚（松手后 buttons=0，任何移动都不会再滚）
    if (!(e.buttons & 1)) return;
    const dx = e.clientX - st.startClientX;
    if (!st.moved && Math.abs(dx) < 2) return;
    st.moved = true;
    const travel = viewport - thumbWidth;
    const factor = travel > 0 && maxScroll > 0 ? maxScroll / travel : 1;
    sc.scrollLeft = Math.min(Math.max(0, st.startScrollLeft + dx * factor), maxScroll);
  };

  const onThumbPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStateRef.current = null;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      /* 未捕获则忽略 */
    }
  };

  // 捕获丢失（系统中断、切换标签页、指针被抢占）时清空拖拽状态
  const onLostCapture = () => {
    dragStateRef.current = null;
  };

  // 窗口级兜底：指针在滚动条外松开 / 系统中断取消时也清空拖拽状态
  useEffect(() => {
    const endDrag = () => {
      dragStateRef.current = null;
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    return () => {
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, []);

  return (
    <div className={styles.hScrollTrack} onMouseEnter={onScrubStart}>
      <div
        ref={thumbRef}
        className={styles.hScrollThumb}
        style={{
          left: progress * (viewport - thumbWidth),
          width: thumbWidth,
        }}
        onPointerDown={onThumbPointerDown}
        onPointerMove={onThumbPointerMove}
        onPointerUp={onThumbPointerUp}
        onLostPointerCapture={onLostCapture}
      />
    </div>
  );
};
