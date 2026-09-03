import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { BlockElementType } from '@/enums';

interface ActiveElementInfo {
  id: string;
  type: BlockElementType;
  attrs?: any;
  isEmpty?: boolean;
  rect: DOMRect;
}

interface DocBarContextType {
  activeElement: ActiveElementInfo | null;
}

const DocBarContext = createContext<DocBarContextType | null>(null);

export const DocBarProvider = ({ children }: { children: ReactNode }) => {
  const [activeElement, setActiveElement] = useState<ActiveElementInfo | null>(null);
  const timerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const hoveredElementRef = useRef<HTMLElement | null>(null);
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
        if (
          current?.id === pluginId &&
          current.type === blockType &&
          current.isEmpty === isEmpty &&
          current.rect.left === rect.left &&
          current.rect.top === rect.top &&
          current.rect.width === rect.width &&
          current.rect.height === rect.height
        ) {
          return current;
        }

        return { id: pluginId, type: blockType, attrs, isEmpty, rect };
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
        if (hoveredElementRef.current === element) {
          return;
        }

        hoveredElementRef.current = element;
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

  return <DocBarContext.Provider value={{ activeElement }}>{children}</DocBarContext.Provider>;
};

export const useDocBar = () => {
  const context = useContext(DocBarContext);
  if (!context) {
    throw new Error('useDocBar must be used within a DocBarProvider');
  }
  return context;
};
