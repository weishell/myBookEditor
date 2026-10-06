import { useState, useCallback, useEffect, useRef } from 'react';
import { useSlateStatic } from 'slate-react';
import { useDocBar } from '@/plugins/docbar-context';
import { useMenu } from '@/plugins/menu-context';
import { useSelection } from '@/plugins/selection-context';
import { useTheme } from '@/context/ThemeContext';
import { BlockElementType } from '@/enums';
import { LilistType, OlListIcon, UlListIcon } from '@/plugins/lilist';
import { beginDragSort, isDragSortableType, DRAG_SORT_EVENT } from '@/plugins/drag-sort';
import styles from './DocBar.module.less';

// 图标全部来自全站统一图标集 —— 与 FloatBar / 块菜单 / 块类型面板 / 斜杠菜单同源同风格。
// 下面按 DocBar 原有的名字做别名，getElementIcon 的映射表因此无需改动。
import {
  ParagraphIcon,
  HeadingIcon,
  DocTitleIcon as TitleIcon,
  PlusIcon as EmptyIcon,
  QuoteIcon,
  HintIcon,
  CodeBlockIcon as CodeIcon,
  TodoIcon as TodoListIcon,
  TableIcon,
  ImageIcon,
  FileIcon,
  VideoIcon,
  DrawioIcon,
  CountdownIcon,
  CalendarIcon,
  TimelineIcon,
  ChartIcon,
  DrawboardIcon,
  DragHandleIcon as DragIcon,
  type SvgIconProps,
} from '@/components/icons/lineIcons';

interface IconConfig {
  component: React.FC<SvgIconProps & { level?: number }>;
  props?: { level?: number };
}

const getElementIcon = (type: BlockElementType, attrs?: any, isEmpty?: boolean): IconConfig => {
  // lilist 判断：列表绑定在段落/标题宿主上（与正文共用同一块类型），
  // 不能只按 type 判断，否则列表项会显示成段落图标；空列表项也保持列表图标。
  // H 标题例外：优先展示标题层级图标（H1~H9），不被有序/无序图标覆盖
  const lilist = attrs?.lilist;
  if (lilist && type !== BlockElementType.HEADING) {
    return { component: lilist.list_type === LilistType.OL ? OlListIcon : UlListIcon };
  }

  // 只有"段落"空行才显示 +；其他类型空行仍展示对应类型的图标
  if (isEmpty && type === BlockElementType.PARAGRAPH) {
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
    case BlockElementType.HINT_BLOCK:
      return { component: HintIcon };
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
      return { component: FileIcon };
    case BlockElementType.VIDEO_BLOCK:
      return { component: VideoIcon };
    case BlockElementType.DRAWIO:
      return { component: DrawioIcon };
    case BlockElementType.COUNTDOWN:
      return { component: CountdownIcon };
    case BlockElementType.CALENDAR:
      return { component: CalendarIcon };
    case BlockElementType.TIMELINE:
      return { component: TimelineIcon };
    case BlockElementType.CHART:
      return { component: ChartIcon };
    case BlockElementType.DRAWBOARD:
      return { component: DrawboardIcon };
    default:
      return { component: ParagraphIcon };
  }
};

const getElementColor = (isDarkMode: boolean): string => {
  if (isDarkMode) return 'var(--dm-text-primary, #e5e7eb)';
  return 'var(--theme-primary)';
};

export const DocBar = () => {
  const editor = useSlateStatic();
  const { activeElement, refreshActiveElement } = useDocBar();
  const { openMenu, closeMenu, forceCloseMenu, hoveringMenu } = useMenu();
  const { hasSelection } = useSelection();
  const { isDarkMode } = useTheme();
  const [iconHovered, setIconHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragSorting, setIsDragSorting] = useState(false);
  const timerRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const lastElementRef = useRef<typeof activeElement>(null);

  // 拖拽排序进行中：隐藏 DocBar 及其展开菜单，交由幽灵卡片接管视觉
  useEffect(() => {
    const onDragSort = (e: Event) => {
      const dragging = (e as CustomEvent<{ dragging?: boolean }>).detail?.dragging ?? false;
      setIsDragSorting(dragging);
      if (dragging) forceCloseMenu(); // 立即收起展开的块菜单弹框
    };
    window.addEventListener(DRAG_SORT_EVENT, onDragSort as EventListener);
    return () => {
      window.removeEventListener(DRAG_SORT_EVENT, onDragSort as EventListener);
    };
  }, [forceCloseMenu]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      scrollTimerRef.current = window.setTimeout(() => {
        // 滚动停止：重新测量 activeElement 的真实位置，再恢复显示
        refreshActiveElement();
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
  }, [refreshActiveElement]);

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

  // 文档标题（HEADING_TITLE）不需要 DocBar；拖拽排序期间也不显示（交给幽灵卡片）
  const shouldShow =
    !isScrolling &&
    !isDragSorting &&
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
  // 全部使用主题色（空行也要展示主题色，与正文图标保持一致）
  const iconColor = getElementColor(isDarkMode);

  return (
    <div
      data-docbar-area
      className={styles.docbar}
      style={{
        left: currentElement.rect.left - (currentElement.isEmpty ? 30 : 56),
        top: currentElement.rect.top + 4,
      }}
      onMouseEnter={handleIconMouseEnter}
      onMouseLeave={handleIconMouseLeave}
    >
      <div className={styles.iconButton}>
        <IconComponent color={iconColor} {...props} />
      </div>
      {/* 空行不显示拖拽手柄；可拖拽类型显示启用态手柄，结构内部块（分栏/表格行列）保持禁用 */}
      {!currentElement.isEmpty && isDragSortableType(currentElement.type) && (
        <button
          className={`${styles.dragButton} ${styles.dragButtonEnabled}`}
          title="按住拖动可排序"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            beginDragSort(editor, currentElement.id, e.clientX, e.clientY);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DragIcon color={iconColor} />
        </button>
      )}
    </div>
  );
};
