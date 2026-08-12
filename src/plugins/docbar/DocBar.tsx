import { useState, useCallback, useEffect, useRef } from 'react';
import { useDocBar } from '@/plugins/docbar-context';
import { useMenu } from '@/plugins/menu-context';
import { useSelection } from '@/plugins/selection-context';
import { useTheme } from '@/context/ThemeContext';
import { BlockElementType } from '@/enums';
import styles from './DocBar.module.less';

interface SvgIconProps {
  color: string;
  size?: number;
}

const HeadingIcon = ({ color, size = 14, level = 1 }: SvgIconProps & { level?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <text
      x="12"
      y="16"
      fontSize={Math.max(8, 13 - level)}
      fill={color}
      textAnchor="middle"
      fontWeight="bold"
    >
      H{level}
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

const EmptyIcon = ({ color, size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="7"
      y="7"
      width="10"
      height="10"
      rx="3"
      stroke={color}
      strokeWidth="1.5"
      strokeDasharray="3 2"
    />
    <path d="M12 8v8M8 12h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
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

const TodoListIcon = ({ color, size = 16 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="7" y="7" width="10" height="10" rx="2" stroke={color} strokeWidth="2" fill={color} />
    <path
      d="M8 12l2 2 4-4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TableIcon = ({ color, size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

const ImageIcon = ({ color, size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const DrawioIcon = ({ color, size = 14 }: SvgIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <path d="M6.5 10v3a2 2 0 0 0 2 2h3" />
    <path d="M10 6.5h3a2 2 0 0 1 2 2v3" />
  </svg>
);

const DragIcon = ({ color = '#999', size = 12 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="6" x2="15" y2="6" />
  </svg>
);

interface IconConfig {
  component: React.FC<SvgIconProps & { level?: number }>;
  props?: { level?: number };
}

const TitleIcon = ({ color, size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <text x="12" y="17" fontSize="12" fill={color} textAnchor="middle" fontWeight="bold">
      T
    </text>
  </svg>
);

const getElementIcon = (type: BlockElementType, attrs?: any, isEmpty?: boolean): IconConfig => {
  // 当标题或段落为空时，显示加号图标
  if (
    isEmpty &&
    (type === BlockElementType.HEADING ||
      type === BlockElementType.HEADING_TITLE ||
      type === BlockElementType.PARAGRAPH)
  ) {
    return { component: EmptyIcon };
  }

  switch (type) {
    case BlockElementType.HEADING_TITLE:
      return { component: TitleIcon };
    case BlockElementType.HEADING:
      return {
        component: HeadingIcon,
        props: { level: attrs?.level || 1 },
      };
    case BlockElementType.BLOCKQUOTE:
      return { component: QuoteIcon };
    case BlockElementType.CODE_BLOCK:
      return { component: CodeIcon };
    case BlockElementType.BULLETED_LIST:
      return { component: ListIcon };
    case BlockElementType.NUMBERED_LIST:
      return { component: NumberedListIcon };
    case BlockElementType.LIST_ITEM:
      return { component: ListIcon };
    case BlockElementType.TODO_LIST:
      return { component: TodoListIcon };
    case BlockElementType.TABLE:
      return { component: TableIcon };
    case BlockElementType.IMAGE_BLOCK:
      return { component: ImageIcon };
    case BlockElementType.DRAWIO:
      return { component: DrawioIcon };
    default:
      return { component: ParagraphIcon };
  }
};

const getElementColor = (isDarkMode: boolean): string => {
  if (isDarkMode) return 'var(--dm-text-primary, #e5e7eb)';
  return 'var(--theme-primary)';
};

export const DocBar = () => {
  const { activeElement } = useDocBar();
  const { openMenu, closeMenu, hoveringMenu } = useMenu();
  const { hasSelection } = useSelection();
  const { isDarkMode } = useTheme();
  const [iconHovered, setIconHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const timerRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const lastElementRef = useRef<typeof activeElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      scrollTimerRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

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

  const shouldShow =
    !isScrolling && (activeElement || iconHovered || hoveringMenu) && !hasSelection;

  const currentElement = activeElement || lastElementRef.current;

  if (!shouldShow || !currentElement) {
    return null;
  }

  const { component: IconComponent, props } = getElementIcon(
    currentElement.type,
    currentElement.attrs,
    currentElement.isEmpty,
  );
  const iconColor = currentElement.isEmpty ? '#262626' : getElementColor(isDarkMode);

  return (
    <div
      data-docbar-area
      className={styles.docbar}
      style={{
        left: currentElement.rect.left - 52,
        top: currentElement.rect.top + 4,
      }}
      onMouseEnter={handleIconMouseEnter}
      onMouseLeave={handleIconMouseLeave}
    >
      <div className={styles.iconButton}>
        <IconComponent color={iconColor} {...props} />
      </div>
      <button
        className={styles.dragButton}
        disabled
        title="拖拽排序功能开发中"
        onClick={(e) => e.stopPropagation()}
      >
        <DragIcon color="#999" />
      </button>
    </div>
  );
};
