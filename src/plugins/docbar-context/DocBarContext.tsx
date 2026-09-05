import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import { BlockElementType } from '@/enums';

interface ActiveElementInfo {
  id: string;
  type: BlockElementType;
  attrs?: any;
  isEmpty?: boolean;
  rect: DOMRect;
  el?: HTMLElement;
}

interface DocBarContextType {
  activeElement: ActiveElementInfo | null;
  refreshActiveElement: () => void;
}

const DocBarContext = createContext<DocBarContextType | null>(null);

export const DocBarProvider = ({ children }: { children: ReactNode }) => {
  const [activeElement, setActiveElement] = useState<ActiveElementInfo | null>(null);
  const timerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const hoveredElementRef = useRef<HTMLElement | null>(null);
  const lastAttrsStrRef = useRef<string | null>(null);
  const suppressRef = useRef(false);

  useEffect(() => {
    const updateActiveElement = (element: HTMLElement) => {
      const pluginId = element.getAttribute('data-plugin-id');
      const blockType = element.getAttribute('data-block-type') as BlockElementType;
      const attrsStr = element.getAttribute('data-block-attrs');
      let attrs: any;
      try {
        attrs = attrsStr ? JSON.parse(attrsStr) : undefined;
      } catch {
        attrs = undefined;
      }

      if (!pluginId || !blockType) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const isEmpty = element.getAttribute('data-empty') === 'true';
      setActiveElement((current) => {
        // 比较 attrs（含 lilist）是否变化：列表/层级等只在 attrs 改变时不刷新图标会停在旧状态
        if (
          current?.id === pluginId &&
          current.type === blockType &&
          current.isEmpty === isEmpty &&
          current.rect.left === rect.left &&
          current.rect.top === rect.top &&
          current.rect.width === rect.width &&
          current.rect.height === rect.height &&
          JSON.stringify(current.attrs) === JSON.stringify(attrs)
        ) {
          return current;
        }

        return {
          id: pluginId,
          type: blockType,
          attrs,
          isEmpty,
          rect,
          el: element,
        };
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      // 表格内拖选单元格等高优先级场景：整段拖拽期间完全屏蔽 DocBar
      if (suppressRef.current) {
        return;
      }

      const target = e.target as HTMLElement;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const isInDocBarArea = !!target.closest('[data-docbar-area]');
      if (isInDocBarArea) {
        return;
      }

      const element = target.closest('[data-plugin-id]') as HTMLElement | null;

      if (element) {
        // 同一元素且 DOM attrs 未变化：跳过刷新，避免无效 getBoundingClientRect；
        // attrs 变了（如给标题加上有序列表）则必须重读，否则 DocBar 图标停在旧状态
        const attrsStr = element.getAttribute('data-block-attrs');
        if (hoveredElementRef.current === element && lastAttrsStrRef.current === attrsStr) {
          return;
        }

        hoveredElementRef.current = element;
        lastAttrsStrRef.current = attrsStr;
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
        frameRef.current = window.requestAnimationFrame(() => {
          updateActiveElement(element);
          frameRef.current = null;
        });
        return;
      }

      hoveredElementRef.current = null;
      timerRef.current = window.setTimeout(() => {
        setActiveElement((current) => (current ? null : current));
      }, 300);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  // 表格内跨单元格拖拽选中（合并单元格等场景）时，压制 DocBar 弹出
  useEffect(() => {
    const onTableCellSelect = (e: Event) => {
      const selecting = (e as CustomEvent<{ selecting?: boolean }>).detail?.selecting;
      suppressRef.current = !!selecting;
      if (selecting) {
        hoveredElementRef.current = null;
        if (timerRef.current) clearTimeout(timerRef.current);
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        setActiveElement(null);
      }
    };
    window.addEventListener('trae:table-cell-select', onTableCellSelect as EventListener);
    return () => {
      window.removeEventListener('trae:table-cell-select', onTableCellSelect as EventListener);
    };
  }, []);

  // 滚动停止后重新测量 activeElement 的真实位置（滚动期间 rect 会过期）；
  // 若已被滚出可视区则隐藏。存入 el 供此处复测。
  const refreshActiveElement = useCallback(() => {
    setActiveElement((current) => {
      if (!current?.el) return current;
      const rect = current.el.getBoundingClientRect();
      const visible =
        rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
      if (!visible) return null;
      if (
        rect.left === current.rect.left &&
        rect.top === current.rect.top &&
        rect.width === current.rect.width &&
        rect.height === current.rect.height
      ) {
        return current; // 引用不变，React 跳过重渲染
      }
      return { ...current, rect };
    });
  }, []);

  return (
    <DocBarContext.Provider value={{ activeElement, refreshActiveElement }}>
      {children}
    </DocBarContext.Provider>
  );
};

export const useDocBar = () => {
  const context = useContext(DocBarContext);
  if (!context) {
    throw new Error('useDocBar must be used within a DocBarProvider');
  }
  return context;
};
