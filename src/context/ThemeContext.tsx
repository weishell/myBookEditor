import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

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
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);

  const themeColor = useMemo(() => {
    return THEME_PRESETS.find((t) => t.id === theme)?.color ?? '#1890ff';
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-primary', themeColor);
  }, [themeColor]);

  const value = useMemo(() => ({ theme, themeColor, setTheme }), [theme, themeColor]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
