import { useState, useCallback, useEffect, useRef } from 'react';
import { useDocBar } from '@/plugins/docbar-context';
import { useMenu } from '@/plugins/menu-context';
import { useSelection } from '@/plugins/selection-context';
import { useTheme } from '@/context/ThemeContext';
import { BlockElementType } from '@/enums';
import { LilistType, OlListIcon, UlListIcon } from '@/plugins/lilist';
import styles from './DocBar.module.less';

interface SvgIconProps {
  color: string;
  size?: number;
}

// 通用线性图标样式（对齐飞书简洁线性风格）
const lineProps = {
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// 段落：无背景字母 T，直接融入文档（参考飞书 docbar）
const ParagraphIcon = ({ color, size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <text x="12" y="17" fontSize="13.5" fill={color} textAnchor="middle" fontWeight="bold">
      T
    </text>
  </svg>
);

// 标题 H1-H9：无背景字母 H{level}，直接融入文档（参考飞书 docbar）
const HeadingIcon = ({ color, size = 18, level = 1 }: SvgIconProps & { level?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <text
      x="12"
      y="17"
      fontSize={level > 9 ? 9.5 : 11.5}
      fill={color}
      textAnchor="middle"
      fontWeight="bold"
    >
      H{level}
    </text>
  </svg>
);

// 文档标题：T 形线性图标
const TitleIcon = ({ color, size = 16 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M7 5.5h10M12 5.5v13" />
  </svg>
);

// 空块：虚线框 + 加号
const EmptyIcon = ({ color, size = 16 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="6"
      y="6"
      width="12"
      height="12"
      rx="3"
      stroke={color}
      strokeWidth="1.5"
      strokeDasharray="3 2"
    />
    <path d="M12 9v6M9 12h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 引用：双引号
const QuoteIcon = ({ color, size = 16 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M10.5 7.5c-2.6 0-4.5 1.9-4.5 4.4V17h4.6v-4.6H8.4c0-1.2.7-2 2.1-2" />
    <path d="M18.5 7.5c-2.6 0-4.5 1.9-4.5 4.4V17h4.6v-4.6h-2.2c0-1.2.7-2 2.1-2" />
  </svg>
);

// 代码块：{} 花括号（对齐飞书）
const CodeIcon = ({ color, size = 16 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" />
    <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
  </svg>
);

// 任务列表：方框 + 勾
const TodoListIcon = ({ color, size = 16 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="5.5" y="5.5" width="13" height="13" rx="2" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

// 表格：表格线
const TableIcon = ({ color, size = 16 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
    <path d="M3.5 9.5h17M3.5 15.5h17M9.5 3.5v17M15.5 3.5v17" />
  </svg>
);

// 图片：框 + 山 + 太阳
const ImageIcon = ({ color, size = 16 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15.5l-5-5L5 21" />
  </svg>
);

// 流程图：菱形 + 矩形 + 连线（参考飞书流程图图标）
const DrawioIcon = ({ color, size = 16 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="9" y="2.5" width="6" height="6" rx="1" transform="rotate(45 12 5.5)" />
    <rect x="3" y="15.5" width="7" height="6" rx="1" />
    <rect x="14" y="15.5" width="7" height="6" rx="1" />
    <path d="M12 8.5v3M12 11.5H6.5v4M12 11.5h5.5v4" />
  </svg>
);

// 拖拽手柄
const DragIcon = ({ color = '#999', size = 14 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M9 6h6M9 12h6M9 18h6" />
  </svg>
);

interface IconConfig {
  component: React.FC<SvgIconProps & { level?: number }>;
  props?: { level?: number };
}

const getElementIcon = (type: BlockElementType, attrs?: any, isEmpty?: boolean): IconConfig => {
  // lilist 判断：列表绑定在段落/标题宿主上（与正文共用同一块类型），
  // 不能只按 type 判断，否则列表项会显示成段落图标；空列表项也保持列表图标
  const lilist = attrs?.lilist;
  if (lilist) {
    return { component: lilist.list_type === LilistType.OL ? OlListIcon : UlListIcon };
  }

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
      return { component: UlListIcon };
    case BlockElementType.NUMBERED_LIST:
      return { component: OlListIcon };
    case BlockElementType.LIST_ITEM:
      return { component: UlListIcon };
    case BlockElementType.TODO_LIST:
      return { component: TodoListIcon };
    case BlockElementType.TABLE:
      return { component: TableIcon };
    case BlockElementType.IMAGE_BLOCK:
      return { component: ImageIcon };
    case BlockElementType.FILE_BLOCK:
    case BlockElementType.VIDEO_BLOCK: {
      const MediaIcon = ({ color, size = 16 }: SvgIconProps) => (
        <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
          <path d="M14 2.5H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2.5V8h5.5" />
        </svg>
      );
      return { component: MediaIcon };
    }
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

  const currentElement = activeElement || lastElementRef.current;

  // 文档标题（HEADING_TITLE）不需要 DocBar
  const shouldShow =
    !isScrolling &&
    (activeElement || iconHovered || hoveringMenu) &&
    !hasSelection &&
    currentElement?.type !== BlockElementType.HEADING_TITLE;

  if (!shouldShow || !currentElement) {
    return null;
  }

  const { component: IconComponent, props } = getElementIcon(
    currentElement.type,
    currentElement.attrs,
    currentElement.isEmpty,
  );
  // 空块图标：浅色模式用深灰（接近主题黑），暗黑模式不能写死深色，否则暗底上看不见
  const iconColor = currentElement.isEmpty && !isDarkMode ? '#262626' : getElementColor(isDarkMode);

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
