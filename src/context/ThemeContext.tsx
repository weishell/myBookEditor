// 主题换肤 Context（ThemeContext）
//
// 用法：用 ThemeProvider 包裹应用，通过 useTheme() 拿到
//       themeId / setTheme / toggleTheme，并通过 CSS 变量 --theme-primary
//       作用到 documentElement，从而让 DocBar 图标、Checkbox、分割线选中态、
//       图片拖拽边缘、表格插入线等全局跟随主题色变化。
//
// 主题色约定：所有颜色均避开 Ant Design 的语义色（error red / success green /
//            warning yellow），避免出现视觉歧义。
//
// 同时设置 --theme-primary-rgb（R G B 三通道），供 rgba() 透明场景使用（如 ::selection 选区色）。
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

// 将 #1890ff 转为 "24 144 255"（供 rgba() 使用）
// const hexToRgb = (hex: string): string => {
//   const normalized = hex.replace('#', '');
//   const r = parseInt(normalized.substring(0, 2), 16);
//   const g = parseInt(normalized.substring(2, 4), 16);
//   const b = parseInt(normalized.substring(4, 6), 16);
//   return `${r} ${g} ${b}`;
// };

// 主题标识
export type ThemeId =
  | 'blue'
  | 'red'
  | 'green'
  | 'gold'
  | 'purple'
  | 'teal'
  | 'pink'
  | 'brown'
  | 'coral'
  | 'forest'
  | 'slate'
  | 'black';

// 主题预设
interface ThemePreset {
  id: ThemeId;
  name: string;
  color: string;
}

// 主题色板 - 避开 antd 语义色（成功绿 #52c41a、警告黄 #faad14、错误红 #ff4d4f）
export const THEME_PRESETS: ThemePreset[] = [
  { id: 'blue', name: '蓝色', color: '#1890ff' },
  { id: 'red', name: '红色', color: '#cf1322' },
  { id: 'green', name: '绿色', color: '#00b96b' },
  { id: 'gold', name: '土豪金', color: '#d4af37' },
  { id: 'purple', name: '紫色', color: '#722ed1' },
  { id: 'teal', name: '青色', color: '#08979c' },
  { id: 'pink', name: '玫红', color: '#c41d7f' },
  { id: 'brown', name: '棕色', color: '#8b5e3c' },
  { id: 'coral', name: '珊瑚', color: '#e9644d' },
  { id: 'forest', name: '墨绿', color: '#237804' },
  { id: 'slate', name: '石板灰', color: '#4b5563' },
  { id: 'black', name: '黑色', color: '#1f1f1f' },
];

const DEFAULT_THEME: ThemeId = 'blue';

interface ThemeContextType {
  theme: ThemeId;
  themeColor: string;
  isDarkMode: boolean;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);

  const themeColor = useMemo(() => {
    return THEME_PRESETS.find((t) => t.id === theme)?.color ?? '#1890ff';
  }, [theme]);

  // 当 theme === 'black' 时进入暗黑模式
  const isDarkMode = theme === 'black';

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-primary', themeColor);
  }, [themeColor]);

  // 暗黑模式：给 html 加 class，同步切换全局 CSS 变量（文字/背景/边框）
  useEffect(() => {
    const htmlEl = document.documentElement;
    if (isDarkMode) {
      htmlEl.classList.add('dark-mode');
      htmlEl.style.setProperty('--dm-text-primary', '#e5e7eb');
      htmlEl.style.setProperty('--dm-text-secondary', '#9ca3af');
      htmlEl.style.setProperty('--dm-text-tertiary', '#6b7280');
      htmlEl.style.setProperty('--dm-text-placeholder', '#4b5563');
      htmlEl.style.setProperty('--dm-bg-base', '#121721');
      htmlEl.style.setProperty('--dm-bg-subtle', '#0f141d');
      htmlEl.style.setProperty('--dm-bg-hover', '#1e2532');
      htmlEl.style.setProperty('--dm-bg-page', '#080b13');
      htmlEl.style.setProperty('--dm-border', '#2b3240');
      htmlEl.style.setProperty('--dm-border-light', '#202837');
    } else {
      htmlEl.classList.remove('dark-mode');
      htmlEl.style.removeProperty('--dm-text-primary');
      htmlEl.style.removeProperty('--dm-text-secondary');
      htmlEl.style.removeProperty('--dm-text-tertiary');
      htmlEl.style.removeProperty('--dm-text-placeholder');
      htmlEl.style.removeProperty('--dm-bg-base');
      htmlEl.style.removeProperty('--dm-bg-subtle');
      htmlEl.style.removeProperty('--dm-bg-hover');
      htmlEl.style.removeProperty('--dm-bg-page');
      htmlEl.style.removeProperty('--dm-border');
      htmlEl.style.removeProperty('--dm-border-light');
    }
  }, [isDarkMode]);

  const value = useMemo(
    () => ({ theme, themeColor, isDarkMode, setTheme }),
    [theme, themeColor, isDarkMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
