import React from 'react';
import type { Editor } from 'slate';
import { setArtTextStyle, ArtTextPresets } from './art-text-marks';
import type { ArtTextStyle } from './art-text-marks';

interface ArtTextMenuProps {
  editor: Editor;
  visible: boolean;
  position?: { x: number; y: number };
  onClose: () => void;
}

export const ArtTextMenu: React.FC<ArtTextMenuProps> = ({
  editor,
  visible,
  position = { x: 0, y: 0 },
  onClose,
}) => {
  if (!visible) return null;

  const handleSelectStyle = (style: ArtTextStyle) => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      setArtTextStyle(editor, style);
    }
    onClose();
  };

  const handleClearStyle = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      setArtTextStyle(editor, null);
    }
    onClose();
  };

  return (
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
        minWidth: '180px',
        zIndex: 10001,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ padding: '4px 8px', fontSize: '12px', color: '#999', fontWeight: '600' }}>
        渐变字
      </div>
      {Object.entries(ArtTextPresets).map(([name, style]) => {
        if (style.type !== 'gradient') return null;
        return (
          <button
            key={name}
            onClick={() => handleSelectStyle(style)}
            style={{
              width: '100%',
              padding: '6px 12px',
              textAlign: 'left',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span
              style={{
                background: `linear-gradient(to right, ${style.colors?.join(', ')})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              Aa
            </span>
            {name}
          </button>
        );
      })}
      <div style={{ height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' }} />
      <div style={{ padding: '4px 8px', fontSize: '12px', color: '#999', fontWeight: '600' }}>
        发光字
      </div>
      {Object.entries(ArtTextPresets).map(([name, style]) => {
        if (style.type !== 'glow') return null;
        return (
          <button
            key={name}
            onClick={() => handleSelectStyle(style)}
            style={{
              width: '100%',
              padding: '6px 12px',
              textAlign: 'left',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <span
              style={{
                textShadow: `0 0 ${style.glowIntensity}px ${style.glowColor}, 0 0 ${style.glowIntensity * 2}px ${style.glowColor}`,
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              Aa
            </span>
            {name}
          </button>
        );
      })}
      <div style={{ height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' }} />
      <button
        onClick={handleClearStyle}
        style={{
          width: '100%',
          padding: '6px 12px',
          textAlign: 'left',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '13px',
          borderRadius: '4px',
          color: '#999',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        清除艺术字
      </button>
    </div>
  );
};
