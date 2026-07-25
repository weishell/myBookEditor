import React from 'react';

interface ArtTextProps {
  attributes: React.HTMLAttributes<HTMLSpanElement>;
  children: React.ReactNode;
  artStyle?: {
    type: 'gradient' | 'outline' | 'glow' | 'shadow';
    colors?: string[];
    direction?: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top' | 'diagonal';
    outlineColor?: string;
    outlineWidth?: number;
    glowColor?: string;
    glowIntensity?: number;
    shadowColor?: string;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowBlur?: number;
  };
}

export const ArtText: React.FC<ArtTextProps> = ({ attributes, children, artStyle }) => {
  if (!artStyle) {
    return <span {...attributes}>{children}</span>;
  }

  const style: React.CSSProperties = {};

  switch (artStyle.type) {
    case 'gradient': {
      const colors = artStyle.colors || ['#ff0000', '#00ff00', '#0000ff'];
      const directionMap: Record<string, string> = {
        'left-to-right': 'to right',
        'right-to-left': 'to left',
        'top-to-bottom': 'to bottom',
        'bottom-to-top': 'to top',
        diagonal: 'to bottom right',
      };
      const direction = directionMap[artStyle.direction || 'left-to-right'];
      style.background = `linear-gradient(${direction}, ${colors.join(', ')})`;
      style.WebkitBackgroundClip = 'text';
      style.WebkitTextFillColor = 'transparent';
      style.backgroundClip = 'text';
      break;
    }
    case 'outline': {
      const color = artStyle.outlineColor || '#000000';
      const width = artStyle.outlineWidth || 2;
      style.color = 'transparent';
      style.textShadow = `
        -${width}px -${width}px 0 ${color},
        ${width}px -${width}px 0 ${color},
        -${width}px ${width}px 0 ${color},
        ${width}px ${width}px 0 ${color}
      `;
      break;
    }
    case 'glow': {
      const color = artStyle.glowColor || '#ff0000';
      const intensity = artStyle.glowIntensity || 10;
      style.textShadow = `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}`;
      break;
    }
    case 'shadow': {
      const color = artStyle.shadowColor || '#000000';
      const offsetX = artStyle.shadowOffsetX || 2;
      const offsetY = artStyle.shadowOffsetY || 2;
      const blur = artStyle.shadowBlur || 4;
      style.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${color}`;
      break;
    }
  }

  return (
    <span {...attributes} style={{ ...attributes.style, ...style }}>
      {children}
    </span>
  );
};
