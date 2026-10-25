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
  /** 暗黑模式壁纸（mode='dark' 组） */
  wallpaper: string;
  /** 浅色模式壁纸（mode='light' 组，柔和护眼底色） */
  lightWallpaper: string;
  setTheme: (theme: ThemeId) => void;
  setWallpaper: (wallpaperId: string) => void;
  setLightWallpaper: (wallpaperId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_WALLPAPER = 'none';

/**
 * 默认浅色壁纸：首次访问就给一层"水墨远山"，而不是纯白。
 * 纯白页面在现在的审美里太像后台管理，给个克制的氛围底更像"书"。
 */
const DEFAULT_LIGHT_WALLPAPER = 'art-ink-mountain';

/* ---------------- 持久化 ----------------
   外观属于"用户偏好"，必须跨刷新保留；存 localStorage 而不是服务端，
   因为它是纯客户端表现层设置，换设备重设一下也不心疼。 */
const APPEARANCE_STORAGE_KEY = 'mybook:appearance:v1';

interface StoredAppearance {
  theme?: ThemeId;
  wallpaper?: string;
  lightWallpaper?: string;
}

/** 只认合法的主题 id：老的 key 可能残留已删除的主题，避免脏数据把界面搞崩 */
function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && THEME_PRESETS.some((preset) => preset.id === value);
}

function readStoredAppearance(): StoredAppearance {
  try {
    const raw = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const next: StoredAppearance = {};
    if (isThemeId(parsed.theme)) next.theme = parsed.theme;
    if (typeof parsed.wallpaper === 'string') next.wallpaper = parsed.wallpaper;
    if (typeof parsed.lightWallpaper === 'string') next.lightWallpaper = parsed.lightWallpaper;
    return next;
  } catch {
    // 隐私模式禁用 storage、或历史数据不是合法 JSON —— 一律退回默认值，不影响启动
    return {};
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 惰性初始化：三个状态共用一次解析，避免各读一遍 JSON
  const [initial] = useState(readStoredAppearance);

  const [theme, setTheme] = useState<ThemeId>(initial.theme ?? DEFAULT_THEME);
  // 壁纸 ID：暗黑/浅色两套互不干扰，分别记忆
  const [wallpaper, setWallpaper] = useState<string>(initial.wallpaper ?? DEFAULT_WALLPAPER);
  const [lightWallpaper, setLightWallpaper] = useState<string>(
    initial.lightWallpaper ?? DEFAULT_LIGHT_WALLPAPER,
  );

  // 任一偏好变化就落盘（quota 满或隐私模式失败时静默忽略，不能因为存不了就报错）
  useEffect(() => {
    try {
      window.localStorage.setItem(
        APPEARANCE_STORAGE_KEY,
        JSON.stringify({ theme, wallpaper, lightWallpaper }),
      );
    } catch {
      /* 忽略写入失败 */
    }
  }, [theme, wallpaper, lightWallpaper]);

  const themeColor = useMemo(() => {
    const base = THEME_PRESETS.find((t) => t.id === theme)?.color ?? '#1890ff';
    // 「黑色」这个主题本质是"切换暗黑模式"，它的色值 #1f1f1f 当强调色等于没有：
    // 选中边框、章节竖线、激活按钮会整片沉进暗底。暗黑模式下一律换成亮蓝，
    // 保证所有靠 --theme-primary 上色的地方在深色界面上依然可辨。
    return theme === 'black' ? '#7aa2ff' : base;
  }, [theme]);

  // 当 theme === 'black' 时进入暗黑模式
  const isDarkMode = theme === 'black';

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-primary', themeColor);
  }, [themeColor]);

  // 暗黑模式：给 html 加 class，同步切换全局 CSS 变量（文字/背景/边框）
  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
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
      // html/body 底色变暗，保证"无壁纸"时页面也不是白的
      htmlEl.style.backgroundColor = '#080b13';
      if (bodyEl) bodyEl.style.backgroundColor = '#080b13';
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
      htmlEl.style.backgroundColor = '';
      if (bodyEl) bodyEl.style.backgroundColor = '';
    }
  }, [isDarkMode]);

  const value = useMemo(
    () => ({
      theme,
      themeColor,
      isDarkMode,
      wallpaper,
      lightWallpaper,
      setTheme,
      setWallpaper,
      setLightWallpaper,
    }),
    [theme, themeColor, isDarkMode, wallpaper, lightWallpaper],
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
