// 光标主题 Context（CursorContext）
//
// 提供多套可选光标：
//  - classic：系统默认光标（普通箭头 / 竖线 / 小手），恢复常规体验。
//  - themed：自定义光标，仅箭头填充主题色（--theme-primary），可一键换肤；小手与 I 形竖线用系统默认。
//  - flame：themed 同款主题箭头，外加鼠标移动时的黄焰尾迹特效。
// 三套都以 CSS 变量（--cursor-arrow/--cursor-text/--cursor-pointer）挂到
// documentElement，组件里 `cursor: var(--cursor-pointer)` 即可跟随主题。
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTheme } from './ThemeContext';

export type CursorThemeId = 'classic' | 'themed' | 'flame';

interface CursorThemeDef {
  id: CursorThemeId;
  name: string;
  badge: string; // 开关/下拉里展示的小徽标
  desc?: string;
}

// 光标主题预设
export const CURSOR_THEMES: CursorThemeDef[] = [
  {
    id: 'themed',
    name: '主题箭头',
    badge: '🎯',
    desc: '自定义箭头，颜色跟随当前主题色',
  },
  {
    id: 'classic',
    name: '经典',
    badge: '🖱',
    desc: '系统默认光标，干净利落',
  },
  {
    id: 'flame',
    name: '黄焰尾迹',
    badge: '🔥',
    desc: '主题箭头 + 移动时拖出黄焰尾迹',
  },
];

export const DEFAULT_CURSOR_THEME: CursorThemeId = 'themed';

const STORAGE_KEY = 'mybook-cursor-theme';

interface CursorVars {
  arrow: string;
  text: string;
  pointer: string;
}

/**
 * 生成一张跟随主题色的箭头光标（SVG data URI）。
 * 形状沿用经典鼠标箭头，填充色 = 主题色，描边用半透明白色保证在深浅背景都清晰。
 * hotspot 取箭头尖 (3,2)。
 */
function buildThemedArrowCursor(color: string): string {
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>" +
    "<path d='M3 2 L3 21 L8 16 L11 23 L13.6 21.8 L10.8 15 L17 15 Z' " +
    "fill='" +
    color +
    "' stroke='rgba(255,255,255,0.85)' stroke-width='1.4' stroke-linejoin='round'/>" +
    '</svg>';
  return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") 3 2, auto';
}

// 计算三态光标变量。
// - classic：三态全部退回系统默认。
// - themed/flame：仅箭头跟随主题色；小手与 I 形竖线用系统默认（更干净、不突兀）。
function varsFor(id: CursorThemeId, themeColor: string): CursorVars {
  if (id === 'classic') {
    return { arrow: 'default', text: 'text', pointer: 'pointer' };
  }
  return {
    arrow: buildThemedArrowCursor(themeColor),
    text: 'text',
    pointer: 'pointer',
  };
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
  // 主题色来自 ThemeContext（CursorProvider 已嵌套在 ThemeProvider 内）
  const { themeColor } = useTheme();

  const setCursorTheme = (id: CursorThemeId) => {
    setCursorThemeState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  };

  // 把光标应用到 documentElement 的 CSS 变量 + 打 data 属性。
  // 依赖 cursorTheme 与 themeColor：切换皮肤时箭头颜色实时刷新。
  useEffect(() => {
    const def = CURSOR_THEMES.find((t) => t.id === cursorTheme) ?? CURSOR_THEMES[0];
    const el = document.documentElement;
    el.setAttribute('data-cursor-theme', def.id);

    const vars = varsFor(cursorTheme, themeColor);
    el.style.setProperty('--cursor-arrow', vars.arrow);
    el.style.setProperty('--cursor-text', vars.text);
    el.style.setProperty('--cursor-pointer', vars.pointer);
  }, [cursorTheme, themeColor]);

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
