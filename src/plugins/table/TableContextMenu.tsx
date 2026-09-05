import React, { useState } from 'react';

export type TableMenuAction =
  | 'merge'
  | 'split'
  | 'cellColor'
  | 'vertAlign'
  | 'rowColor'
  | 'borderColor'
  | 'borderWidth'
  | 'deleteTable'
  | 'insertRow'
  | 'insertColumn'
  | 'deleteRow'
  | 'deleteColumn';

interface TableContextMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  /** 是否有多格选区（合并入口可用） */
  hasRange: boolean;
  /** 目标单元格是否为合并格（拆分入口可用） */
  isMerged: boolean;
  /** 目标单元格当前背景色 */
  cellBg: string;
  /** 目标行当前背景色 */
  rowBg: string;
  /** 表格当前边框颜色 */
  borderColor: string;
  onAction: (action: TableMenuAction, payload?: any) => void;
}

const BG_COLORS = [
  { id: 'none', value: '' },
  { id: 'green', value: '#d9f3e3' },
  { id: 'blue', value: '#d9e9ff' },
  { id: 'cyan', value: '#d9f2f3' },
  { id: 'red', value: '#ffe1e1' },
  { id: 'orange', value: '#ffe8d1' },
  { id: 'yellow', value: '#fff3c4' },
  { id: 'purple', value: '#ead9ff' },
  { id: 'pink', value: '#ffddf0' },
  { id: 'gray', value: '#e8e8e8' },
];

const BORDER_COLORS = [
  { id: 'gray', value: '#d9d9d9' },
  { id: 'dark', value: '#333333' },
  { id: 'blue', value: '#1677ff' },
  { id: 'red', value: '#f5222d' },
  { id: 'green', value: '#52c41a' },
  { id: 'orange', value: '#fa8c16' },
  { id: 'purple', value: '#722ed1' },
];

type Panel = null | 'cellColor' | 'rowColor' | 'borderColor' | 'vAlign' | 'borderWidth';

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: '7px 12px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: '13px',
  color: '#333',
  borderRadius: '5px',
  gap: '8px',
  fontFamily: 'inherit',
};

const subItemStyle: React.CSSProperties = {
  ...itemStyle,
  padding: '6px 12px',
  justifyContent: 'space-between',
};

export const TableContextMenu: React.FC<TableContextMenuProps> = ({
  visible,
  position,
  onClose,
  hasRange,
  isMerged,
  cellBg,
  rowBg,
  borderColor,
  onAction,
}) => {
  const [panel, setPanel] = useState<Panel>(null);

  if (!visible) return null;

  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? null : p));
  const RowHover = (e: React.MouseEvent<HTMLElement>) =>
    (e.currentTarget.style.backgroundColor = '#f5f6f8');
  const RowLeave = (e: React.MouseEvent<HTMLElement>) =>
    (e.currentTarget.style.backgroundColor = 'transparent');
  const row = { onMouseEnter: RowHover, onMouseLeave: RowLeave };

  const disabledStyle = (flag: boolean): React.CSSProperties =>
    flag ? { opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' } : {};

  const Swatch = ({
    color,
    active,
    onPick,
  }: {
    color: string;
    active?: boolean;
    onPick: () => void;
  }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onPick();
      }}
      style={{
        width: 20,
        height: 20,
        borderRadius: 4,
        border: active ? '2px solid #1677ff' : '1px solid #e0e0e0',
        backgroundColor: color || '#fff',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        lineHeight: 1,
        color: '#999',
        padding: 0,
      }}
      title={color || '无颜色'}
    >
      {color ? '' : '×'}
    </button>
  );

  const actionItem = (
    label: string,
    act: TableMenuAction,
    opts?: { disabledFlag?: boolean; hint?: React.ReactNode },
  ) => (
    <button
      style={{ ...itemStyle, ...disabledStyle(!!opts?.disabledFlag) }}
      {...row}
      onClick={(e) => {
        e.stopPropagation();
        onAction(act);
        onClose();
      }}
    >
      <span style={{ flex: 1 }}>{label}</span>
      {opts?.hint}
    </button>
  );

  const subItem = (label: string, onClick: () => void, active?: boolean) => (
    <button
      style={{ ...subItemStyle, color: active ? '#1677ff' : '#333' }}
      {...row}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        onClose();
      }}
    >
      <span>{label}</span>
      {active && <span style={{ color: '#1677ff' }}>✓</span>}
    </button>
  );

  const colorPatch = (
    key: 'cellColor' | 'rowColor' | 'borderColor',
    palette: { id: string; value: string }[],
    current: string,
  ) => (
    <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {palette.map((c) => (
          <Swatch
            key={c.id}
            color={c.value}
            active={!!current && current.toLowerCase() === c.value.toLowerCase()}
            onPick={() => {
              onAction(key, c.value);
              onClose();
            }}
          />
        ))}
      </div>
    </div>
  );

  const expander = (label: string, p: Panel, hint?: string) => (
    <button
      style={{ ...itemStyle, justifyContent: 'space-between' }}
      {...row}
      onClick={(e) => {
        e.stopPropagation();
        toggle(p);
      }}
    >
      <span>{label}</span>
      <span style={{ color: '#bbb' }}>{hint ?? '▸'}</span>
    </button>
  );

  return (
    <>
      <div
        data-table-menu
        className="contextMenu"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
        onClick={() => {
          setPanel(null);
          onClose();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setPanel(null);
          onClose();
        }}
      />
      <div
        data-table-menu
        className="contextMenu"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          padding: '4px',
          zIndex: 1001,
          minWidth: '158px',
          maxHeight: 440,
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---- 单元格 ---- */}
        {actionItem('合并单元格', 'merge', {
          disabledFlag: !hasRange,
          hint: <span style={{ color: '#bbb' }}>▣</span>,
        })}
        {actionItem('拆分单元格', 'split', {
          disabledFlag: !isMerged,
          hint: <span style={{ color: '#bbb' }}>▤</span>,
        })}
        {expander('单元格背景色', 'cellColor')}
        {panel === 'cellColor' && colorPatch('cellColor', BG_COLORS, cellBg)}
        {expander('单元格对齐', 'vAlign')}
        {panel === 'vAlign' && (
          <div style={{ padding: '6px 8px' }}>
            {subItem('顶端对齐', () => onAction('vertAlign', 'top'))}
            {subItem('垂直居中', () => onAction('vertAlign', 'middle'))}
            {subItem('底端对齐', () => onAction('vertAlign', 'bottom'))}
          </div>
        )}

        {/* ---- 行 ---- */}
        {expander('行背景色', 'rowColor')}
        {panel === 'rowColor' && colorPatch('rowColor', BG_COLORS, rowBg)}
        {actionItem('插入行', 'insertRow')}
        {actionItem('删除行', 'deleteRow')}

        <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '4px 0' }} />

        {/* ---- 列 ---- */}
        {actionItem('插入列', 'insertColumn')}
        {actionItem('删除列', 'deleteColumn')}

        <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '4px 0' }} />

        {/* ---- 表格 ---- */}
        {expander('表格边框颜色', 'borderColor')}
        {panel === 'borderColor' && colorPatch('borderColor', BORDER_COLORS, borderColor)}
        {expander('表格边框粗细', 'borderWidth')}
        {panel === 'borderWidth' && (
          <div style={{ padding: '6px 8px' }}>
            {[1, 2, 3, 4].map((w) => (
              <span key={w}>{subItem(`${w}px`, () => onAction('borderWidth', `${w}px`))}</span>
            ))}
          </div>
        )}
        {actionItem('删除表格', 'deleteTable', { hint: <span style={{ color: '#bbb' }}>🗑</span> })}
      </div>
    </>
  );
};
