import { useState, useCallback, useEffect, useRef } from 'react';
import { useDocBar } from '@/plugins/docbar-context';
import { useMenu } from '@/plugins/menu-context';
import { useSelection } from '@/plugins/selection-context';
import { BlockElementType } from '@/enums';

interface SvgIconProps {
  color: string;
  size?: number;
}

const H1Icon = ({ color, size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <text x="12" y="16" fontSize="12" fill={color} textAnchor="middle" fontWeight="bold">
      H1
    </text>
  </svg>
);

const H2Icon = ({ color, size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <text x="12" y="16" fontSize="11" fill={color} textAnchor="middle" fontWeight="bold">
      H2
    </text>
  </svg>
);

const H3Icon = ({ color, size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <text x="12" y="16" fontSize="10" fill={color} textAnchor="middle" fontWeight="bold">
      H3
    </text>
  </svg>
);

const ParagraphIcon = ({ color, size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <text x="12" y="16" fontSize="12" fill={color} textAnchor="middle" fontWeight="bold">
      T
    </text>
  </svg>
);

const QuoteIcon = ({ color, size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const CodeIcon = ({ color, size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const ListIcon = ({ color, size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const NumberedListIcon = ({ color, size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <path d="M3 6h1v4" />
    <path d="M3 10h1v8" />
  </svg>
);

const DragIcon = ({ color = '#999', size = 12 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="6" x2="15" y2="6" />
  </svg>
);

const getElementIcon = (type: BlockElementType) => {
  switch (type) {
    case BlockElementType.HEADING_ONE:
      return H1Icon;
    case BlockElementType.HEADING_TWO:
      return H2Icon;
    case BlockElementType.HEADING_THREE:
      return H3Icon;
    case BlockElementType.BLOCKQUOTE:
      return QuoteIcon;
    case BlockElementType.CODE_BLOCK:
      return CodeIcon;
    case BlockElementType.BULLETED_LIST:
      return ListIcon;
    case BlockElementType.NUMBERED_LIST:
      return NumberedListIcon;
    case BlockElementType.LIST_ITEM:
      return ListIcon;
    default:
      return ParagraphIcon;
  }
};

const getElementColor = (type: BlockElementType): string => {
  switch (type) {
    case BlockElementType.HEADING_ONE:
    case BlockElementType.HEADING_TWO:
    case BlockElementType.HEADING_THREE:
    case BlockElementType.PARAGRAPH:
      return '#1890ff';
    case BlockElementType.BLOCKQUOTE:
      return '#faad14';
    case BlockElementType.CODE_BLOCK:
      return '#722ed1';
    case BlockElementType.BULLETED_LIST:
    case BlockElementType.NUMBERED_LIST:
    case BlockElementType.LIST_ITEM:
      return '#52c41a';
    default:
      return '#1890ff';
  }
};

export const DocBar = () => {
  const { activeElement } = useDocBar();
  const { openMenu, closeMenu, hoveringMenu } = useMenu();
  const { hasSelection } = useSelection();
  const [iconHovered, setIconHovered] = useState(false);
  const timerRef = useRef<number | null>(null);
  const lastElementRef = useRef<typeof activeElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (hasSelection) {
      setIconHovered(false);
      closeMenu();
    }
  }, [hasSelection, closeMenu]);

  useEffect(() => {
    if (activeElement) {
      lastElementRef.current = activeElement;
    }
  }, [activeElement]);

  const handleIconMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setIconHovered(true);
      const rect = e.currentTarget.getBoundingClientRect();
      openMenu(lastElementRef.current?.id || '', rect.left + rect.width + 8, rect.top);
    },
    [openMenu],
  );

  const handleIconMouseLeave = useCallback(() => {
    setIconHovered(false);
  }, []);

  useEffect(() => {
    if (!activeElement && !iconHovered && !hoveringMenu) {
      timerRef.current = window.setTimeout(() => {
        closeMenu();
      }, 200);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [activeElement, iconHovered, hoveringMenu, closeMenu]);

  const shouldShow = (activeElement || iconHovered || hoveringMenu) && !hasSelection;

  const currentElement = activeElement || lastElementRef.current;

  if (!shouldShow || !currentElement) {
    return null;
  }

  const IconComponent = getElementIcon(currentElement.type);
  const iconColor = getElementColor(currentElement.type);

  return (
    <div
      data-docbar-area
      style={{
        position: 'fixed',
        left: currentElement.rect.left - 52,
        top: currentElement.rect.top + 4,
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
      onMouseEnter={handleIconMouseEnter}
      onMouseLeave={handleIconMouseLeave}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          border: 'none',
          background: '#fff',
          borderRadius: '4px 0 0 4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          padding: '0',
        }}
      >
        <IconComponent color={iconColor} />
      </div>
      <div
        style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0 4px 4px 0',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.15s ease',
          cursor: 'move',
        }}
      >
        <DragIcon color="#999" />
      </div>
    </div>
  );
};
