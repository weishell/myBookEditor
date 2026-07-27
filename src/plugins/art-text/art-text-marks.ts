import type { Editor } from 'slate';

export interface ArtTextStyle {
  type: 'gradient' | 'glow' | 'shadow';
  colors?: string[];
  direction?: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top' | 'diagonal';
  glowColor?: string;
  glowIntensity?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowBlur?: number;
}

export const ART_TEXT_KEY = 'artText';

export const setArtTextStyle = (editor: Editor, style: ArtTextStyle | null) => {
  if (style) {
    (editor as any).addMark(ART_TEXT_KEY, JSON.stringify(style));
  } else {
    (editor as any).removeMark(ART_TEXT_KEY);
  }
};

export const getArtTextStyle = (editor: Editor): ArtTextStyle | null => {
  const marks = (editor as any).marks;
  if (marks && marks[ART_TEXT_KEY]) {
    try {
      return JSON.parse(marks[ART_TEXT_KEY]);
    } catch {
      return null;
    }
  }
  return null;
};

export const isArtTextActive = (editor: Editor): boolean => {
  const marks = (editor as any).marks;
  return marks ? !!marks[ART_TEXT_KEY] : false;
};

export const ArtTextPresets = {
  Rainbow: {
    type: 'gradient' as const,
    colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#8b00ff'],
    direction: 'left-to-right' as const,
  },
  Golden: {
    type: 'gradient' as const,
    colors: ['#ffd700', '#ffec8b', '#ffd700'],
    direction: 'left-to-right' as const,
  },
  Fire: {
    type: 'gradient' as const,
    colors: ['#ff4500', '#ff6347', '#ffa500'],
    direction: 'bottom-to-top' as const,
  },
  Ice: {
    type: 'gradient' as const,
    colors: ['#add8e6', '#00bfff', '#1e90ff'],
    direction: 'top-to-bottom' as const,
  },
  云舞缭绕: {
    type: 'gradient' as const,
    colors: ['#19CAAD', '#D6D5B7', '#8CC7B5', '#A0EEE1', '#BEE7E9', '#BEEDC7', '#F4606C'],
    direction: 'left-to-right' as const,
  },
  GreenGlow: {
    type: 'glow' as const,
    glowColor: '#00ff00',
    glowIntensity: 15,
  },
  PinkGlow: {
    type: 'glow' as const,
    glowColor: '#ff69b4',
    glowIntensity: 12,
  },
  Shadow: {
    type: 'shadow' as const,
    shadowColor: '#333333',
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    shadowBlur: 4,
  },
};
