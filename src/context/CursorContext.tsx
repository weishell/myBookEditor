// 光标主题 Context（CursorContext）
//
// 提供两套可选光标：
//  - classic：系统默认光标（普通箭头 / 竖线 / 小手），恢复常规体验。
//  - flame：光标与默认完全一致，仅鼠标移动时拖出黄焰尾迹特效。
// 两套都以 CSS 变量（--cursor-arrow/--cursor-text/--cursor-pointer）挂到
// documentElement，组件里 `cursor: var(--cursor-pointer)` 即可跟随主题。
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type CursorThemeId = 'classic' | 'flame';

interface CursorThemeDef {
  id: CursorThemeId;
  name: string;
  badge: string; // 开关/下拉里展示的小徽标
  desc?: string;
}

// 光标主题预设 - 只保留普通光标与黄色火焰两款
export const CURSOR_THEMES: CursorThemeDef[] = [
  {
    id: 'classic',
    name: '经典',
    badge: '🖱',
    desc: '系统默认光标，干净利落',
  },
  {
    id: 'flame',
    name: '黄色火焰',
    badge: '🔥',
    desc: '与默认光标一致，仅移动时拖出黄焰尾迹',
  },
];

export const DEFAULT_CURSOR_THEME: CursorThemeId = 'classic';

const STORAGE_KEY = 'mybook-cursor-theme';

interface CursorVars {
  arrow: string;
  text: string;
  pointer: string;
}

// 两套主题都使用系统默认三态光标，区别仅在是否启用火焰尾迹特效
function varsFor(): CursorVars {
  return { arrow: 'default', text: 'text', pointer: 'pointer' };
}

/** 带火焰尾迹特效的光标主题 */
export const FLAME_TRAIL_THEMES: CursorThemeId[] = ['flame'];

interface CursorContextType {
  cursorTheme: CursorThemeId;
  setCursorTheme: (id: CursorThemeId) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

function readStored(): CursorThemeId {
  try {
    const v = localStorage.getItem(STORAGE_KEY) as CursorThemeId | null;
    if (v && CURSOR_THEMES.some((t) => t.id === v)) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_CURSOR_THEME;
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorTheme, setCursorThemeState] = useState<CursorThemeId>(readStored);

  const setCursorTheme = (id: CursorThemeId) => {
    setCursorThemeState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  };

  // 把光标应用到 documentElement 的 CSS 变量 + 打 data 属性
  useEffect(() => {
    const def = CURSOR_THEMES.find((t) => t.id === cursorTheme) ?? CURSOR_THEMES[0];
    const el = document.documentElement;
    el.setAttribute('data-cursor-theme', def.id);

    const vars = varsFor();
    el.style.setProperty('--cursor-arrow', vars.arrow);
    el.style.setProperty('--cursor-text', vars.text);
    el.style.setProperty('--cursor-pointer', vars.pointer);
  }, [cursorTheme]);

  const value = useMemo(() => ({ cursorTheme, setCursorTheme }), [cursorTheme]);
  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}

export type { CursorThemeDef };
