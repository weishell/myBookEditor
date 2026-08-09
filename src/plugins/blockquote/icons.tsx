import React from 'react';
import { BlockquoteType } from '@/enums';

interface IconProps {
  size?: number;
  className?: string;
}

const InfoIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M12 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </svg>
);

const NoteIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 4h16v14l-4 4H4V4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const WarningIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 3l10.392 18H1.608L12 3z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />
    <path d="M12 10v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="19" r="0.8" fill="currentColor" />
  </svg>
);

const TipIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 002 2h4a2 2 0 002-2v-2.26A6.98 6.98 0 0019 9a7 7 0 00-7-7z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M9 21h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const BLOCKQUOTE_ICONS: Record<BlockquoteType, React.FC<IconProps>> = {
  [BlockquoteType.INFO]: InfoIcon,
  [BlockquoteType.NOTE]: NoteIcon,
  [BlockquoteType.WARNING]: WarningIcon,
  [BlockquoteType.TIP]: TipIcon,
};

export const BLOCKQUOTE_LABELS: Record<BlockquoteType, string> = {
  [BlockquoteType.INFO]: '说明',
  [BlockquoteType.NOTE]: '注意',
  [BlockquoteType.WARNING]: '警告',
  [BlockquoteType.TIP]: '提示',
};

export const BLOCKQUOTE_COLORS: Record<BlockquoteType, string> = {
  [BlockquoteType.INFO]: 'var(--theme-primary, #1890ff)',
  [BlockquoteType.NOTE]: '#faad14',
  [BlockquoteType.WARNING]: '#ff4d4f',
  [BlockquoteType.TIP]: '#52c41a',
};
