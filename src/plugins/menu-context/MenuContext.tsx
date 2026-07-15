import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

interface MenuContextType {
  visible: boolean;
  position: { x: number; y: number };
  targetId: string | null;
  hoveringMenu: boolean;
  activeDocbarId: string | null;
  openMenu: (id: string, x: number, y: number) => void;
  closeMenu: () => void;
  forceCloseMenu: () => void;
  setHoveringMenu: (hovering: boolean) => void;
  setActiveDocbarId: (id: string | null) => void;
}

const MenuContext = createContext<MenuContextType | null>(null);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetId, setTargetId] = useState<string | null>(null);
  const [hoveringMenu, setHoveringMenu] = useState(false);
  const [activeDocbarId, setActiveDocbarId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const hoveringMenuRef = useRef(false);

  useEffect(() => {
    hoveringMenuRef.current = hoveringMenu;
  }, [hoveringMenu]);

  const openMenu = useCallback((id: string, x: number, y: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setTargetId(id);
    setPosition({ x, y });
    setVisible(true);
  }, []);

  const closeMenu = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      if (!hoveringMenuRef.current) {
        setVisible(false);
        setTargetId(null);
      }
    }, 200);
  }, []);

  const forceCloseMenu = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setVisible(false);
    setTargetId(null);
  }, []);

  return (
    <MenuContext.Provider
      value={{
        visible,
        position,
        targetId,
        hoveringMenu,
        activeDocbarId,
        openMenu,
        closeMenu,
        forceCloseMenu,
        setHoveringMenu,
        setActiveDocbarId,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
