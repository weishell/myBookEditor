import React from 'react';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { insertRow, insertColumn, deleteRow, deleteColumn } from './table-operations';

interface TableContextMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

export const TableContextMenu: React.FC<TableContextMenuProps> = ({
  visible,
  position,
  onClose,
}) => {
  const editor = useSlateStatic();

  if (!visible) return null;

  const handleMenuClick = (action: string) => {
    // 确保编辑器已聚焦
    ReactEditor.focus(editor);

    switch (action) {
      case 'insertRow':
        insertRow(editor);
        break;
      case 'insertColumn':
        insertColumn(editor);
        break;
      case 'deleteRow':
        deleteRow(editor);
        break;
      case 'deleteColumn':
        deleteColumn(editor);
        break;
    }
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
        onClick={onClose}
      />
      <div
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
          minWidth: '160px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => handleMenuClick('insertRow')}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '13px',
            color: '#333',
            borderRadius: '4px',
            gap: '8px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span>⬆</span>
          <span>插入行</span>
        </button>
        <button
          onClick={() => handleMenuClick('insertColumn')}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '13px',
            color: '#333',
            borderRadius: '4px',
            gap: '8px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span>➡</span>
          <span>插入列</span>
        </button>
        <div style={{ height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' }} />
        <button
          onClick={() => handleMenuClick('deleteRow')}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '13px',
            color: '#333',
            borderRadius: '4px',
            gap: '8px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span>🗑</span>
          <span>删除行</span>
        </button>
        <button
          onClick={() => handleMenuClick('deleteColumn')}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '13px',
            color: '#333',
            borderRadius: '4px',
            gap: '8px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span>🗑</span>
          <span>删除列</span>
        </button>
      </div>
    </>
  );
};
