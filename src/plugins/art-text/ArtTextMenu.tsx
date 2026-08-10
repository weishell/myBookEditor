import React from 'react';
import type { Editor } from 'slate';
import { setArtTextStyle, ArtTextPresets } from './art-text-marks';
import type { ArtTextStyle } from './art-text-marks';
import styles from './ArtTextMenu.module.less';

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
      className={styles.menu}
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.sectionTitle}>渐变字</div>
      {Object.entries(ArtTextPresets).map(([name, style]) => {
        if (style.type !== 'gradient') return null;
        return (
          <button key={name} className={styles.item} onClick={() => handleSelectStyle(style)}>
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
      <div className={styles.divider} />
      <div className={styles.sectionTitle}>发光字</div>
      {Object.entries(ArtTextPresets).map(([name, style]) => {
        if (style.type !== 'glow') return null;
        return (
          <button key={name} className={styles.item} onClick={() => handleSelectStyle(style)}>
            <span
              className={styles.previewGlow}
              style={{
                textShadow: `0 0 ${style.glowIntensity}px ${style.glowColor}, 0 0 ${style.glowIntensity * 2}px ${style.glowColor}`,
              }}
            >
              Aa
            </span>
            {name}
          </button>
        );
      })}
      <div className={styles.divider} />
      <button className={styles.clearBtn} onClick={handleClearStyle}>
        清除艺术字
      </button>
    </div>
  );
};
