import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { BlockElementType } from '@/enums';

interface ActiveElementInfo {
  id: string;
  type: BlockElementType;
  rect: DOMRect;
}

interface DocBarContextType {
  activeElement: ActiveElementInfo | null;
}

const DocBarContext = createContext<DocBarContextType | null>(null);

export const DocBarProvider = ({ children }: { children: ReactNode }) => {
  const [activeElement, setActiveElement] = useState<ActiveElementInfo | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
        const pluginId = element.getAttribute('data-plugin-id');
        const blockType = element.getAttribute('data-block-type') as BlockElementType;

        if (pluginId && blockType) {
          const rect = element.getBoundingClientRect();
          setActiveElement({ id: pluginId, type: blockType, rect });
          return;
        }
      }

      timerRef.current = window.setTimeout(() => {
        setActiveElement(null);
      }, 300);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
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
