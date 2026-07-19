import { useState } from 'react';

const FONT_COLORS = [
  '#000000',
  '#333333',
  '#666666',
  '#999999',
  '#cccccc',
  '#ff0000',
  '#ff6600',
  '#ffcc00',
  '#33cc00',
  '#00ccff',
  '#0066ff',
  '#9900ff',
  '#ff00ff',
  '#ff99cc',
  '#009999',
  '#669900',
  '#996633',
];

const HIGHLIGHT_COLORS = [
  '',
  '#fff1b8',
  '#ffe082',
  '#ffd54f',
  '#ffcc80',
  '#ffebee',
  '#ffcdd2',
  '#ef9a9a',
  '#ffab91',
  '#d1c4e9',
  '#c5cae9',
  '#bbdefb',
  '#b3e5fc',
  '#b2dfdb',
  '#a5d6a7',
  '#c8e6c9',
  '#fff9c4',
  '#fff59d',
  '#f3e5f5',
  '#e1bee7',
  '#fce4ec',
];

interface ColorPickerProps {
  onTextColorChange: (color: string | null) => void;
  onBackgroundColorChange: (color: string | null) => void;
}

export default function ColorPicker({
  onTextColorChange,
  onBackgroundColorChange,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  const handleTextColorClick = (color: string) => {
    onTextColorChange(color || null);
    setOpen(false);
  };

  const handleBackgroundColorClick = (color: string) => {
    onBackgroundColorChange(color || null);
    setOpen(false);
  };

  const handleReset = () => {
    onTextColorChange(null);
    onBackgroundColorChange(null);
    setOpen(false);
  };

  return (
    <div className="color-picker" style={{ position: 'relative' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{
          padding: '6px 10px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '14px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          color: '#333',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <span
          style={{
            backgroundColor: '#fff1b8',
            padding: '2px 6px',
            borderRadius: '2px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          A
        </span>
        <span style={{ fontSize: '10px', color: '#999' }}>▼</span>
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            padding: '8px',
            minWidth: '200px',
            zIndex: 10001,
          }}
        >
          <div
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              color: '#999',
              fontWeight: '600',
              marginBottom: '8px',
            }}
          >
            字体颜色
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(9, 1fr)',
              gap: '6px',
              marginBottom: '12px',
            }}
          >
            {FONT_COLORS.map((color) => (
              <button
                key={color}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTextColorClick(color);
                }}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  border: '1px solid #d9d9d9',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: color,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                A
              </button>
            ))}
          </div>

          <div
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              color: '#999',
              fontWeight: '600',
              marginBottom: '8px',
            }}
          >
            背景颜色
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(9, 1fr)',
              gap: '6px',
              marginBottom: '8px',
            }}
          >
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color}
                onClick={(e) => {
                  e.stopPropagation();
                  handleBackgroundColorClick(color);
                }}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  backgroundColor: color || '#fff',
                  border: color ? '1px solid #e8e8e8' : '1px dashed #ccc',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            style={{
              width: '100%',
              padding: '6px 12px',
              textAlign: 'center',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#999',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          >
            恢复默认
          </button>
        </div>
      )}
    </div>
  );
}
