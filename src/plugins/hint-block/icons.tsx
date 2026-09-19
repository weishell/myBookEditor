import React from 'react';
import { HintBlockType } from '@/enums';

interface IconProps {
  size?: number;
  className?: string;
}

const SparkleIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 3.5c.6 4.6 1.9 5.9 6.5 6.5-4.6.6-5.9 1.9-6.5 6.5-.6-4.6-1.9-5.9-6.5-6.5 4.6-.6 5.9-1.9 6.5-6.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 15c.3 2.1.9 2.7 3 3-2.1.3-2.7.9-3 3-.3-2.1-.9-2.7-3-3 2.1-.3 2.7-.9 3-3z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const BubbleIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M20 11a8 8 0 0 1-8.5 7.97A8 8 0 0 1 4 11V7.2l3.1-1.55A8 8 0 0 1 12 4.9a8 8 0 0 1 4.9 2.35L20 9v2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 10.5l2 2 3-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 3l7 2.6v5.4c0 4.4-3 7.9-7 9.6-4-1.7-7-5.2-7-9.6V5.6L12 3z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="0.8" fill="currentColor" />
  </svg>
);

const WandIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M15 4.5l4.5 4.5-3 3L12 7.5 15 4.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M12 7.5l-8 8a2.12 2.12 0 0 0 0 3l1.5 1.5a2.12 2.12 0 0 0 3 0l8-8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M6 12l3 3M15.5 3l-.5 2M18.5 6l2 .5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const HINT_BLOCK_ICONS: Record<HintBlockType, React.FC<IconProps>> = {
  [HintBlockType.INFO]: SparkleIcon,
  [HintBlockType.NOTE]: BubbleIcon,
  [HintBlockType.WARNING]: ShieldIcon,
  [HintBlockType.TIP]: WandIcon,
};

export const HINT_BLOCK_LABELS: Record<HintBlockType, string> = {
  [HintBlockType.INFO]: '说明',
  [HintBlockType.NOTE]: '注意',
  [HintBlockType.WARNING]: '警告',
  [HintBlockType.TIP]: '提示',
};

export const HINT_BLOCK_COLORS: Record<HintBlockType, string> = {
  [HintBlockType.INFO]: 'var(--theme-primary, #1890ff)',
  [HintBlockType.NOTE]: '#faad14',
  [HintBlockType.WARNING]: '#ff4d4f',
  [HintBlockType.TIP]: '#52c41a',
};
