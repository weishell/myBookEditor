import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface SelectionContextType {
  hasSelection: boolean;
}

const SelectionContext = createContext<SelectionContextType | null>(null);

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    const checkSelection = () => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        setHasSelection(true);
      } else {
        setHasSelection(false);
      }
    };

    document.addEventListener('selectionchange', checkSelection);
    document.addEventListener('mouseup', checkSelection);

    return () => {
      document.removeEventListener('selectionchange', checkSelection);
      document.removeEventListener('mouseup', checkSelection);
    };
  }, []);

  return <SelectionContext.Provider value={{ hasSelection }}>{children}</SelectionContext.Provider>;
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};
