// 光标主题 Context（CursorContext）
//
// 把系统默认的"箭头 / 竖线(I-beam) / 小手"替换成可爱温馨的自定义光标，
// 并提供多套可选主题。
//
// 光标来源分两类：
//  - emoji 主题（猫爪/星星/…）：直接用 SVG data URI（内嵌 <text> emoji），
//    这类在很多渲染引擎下都能正常显示。
//  - 歼-20 主题：先把 SVG 用 canvas 栅格化成 PNG 再当光标，PNG 光标
//    兼容性最好，确保战机真实可见。
// 两类都以 CSS 变量（--cursor-arrow/--cursor-text/--cursor-pointer）挂到
// documentElement，组件里 `cursor: var(--cursor-pointer)` 即可跟随主题。
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type CursorThemeId = 'classic' | 'paw' | 'sparkle' | 'blossom' | 'bear' | 'berry' | 'jet';

interface CursorThemeDef {
  id: CursorThemeId;
  name: string;
  badge: string; // 开关/下拉里展示的小徽标
  arrow?: string; // 默认(箭头)光标 emoji
  tip?: string; // 文本光标顶部的装饰 emoji
  pointer?: string; // 可点(小手)光标 emoji
  desc?: string;
}

// 光标主题预设 - 避开传统箭头/竖线/小手
export const CURSOR_THEMES: CursorThemeDef[] = [
  { id: 'classic', name: '经典', badge: '🖱' },
  {
    id: 'paw',
    name: '猫爪爪',
    badge: '🐾',
    arrow: '🐾',
    tip: '🐱',
    pointer: '🐾',
    desc: '软乎乎的猫爪，暖到心里',
  },
  {
    id: 'sparkle',
    name: '闪亮星星',
    badge: '✨',
    arrow: '✨',
    tip: '✨',
    pointer: '💫',
    desc: '星光闪烁，指尖生花',
  },
  {
    id: 'blossom',
    name: '春日花朵',
    badge: '🌸',
    arrow: '🌸',
    tip: '🌸',
    pointer: '🌷',
    desc: '繁花点点，春意盎然',
  },
  {
    id: 'bear',
    name: '软萌小熊',
    badge: '🐻',
    arrow: '🐻',
    tip: '🐻',
    pointer: '🍯',
    desc: '抱着蜂蜜罐的小熊',
  },
  {
    id: 'berry',
    name: '莓好时光',
    badge: '🍓',
    arrow: '🍓',
    tip: '🍓',
    pointer: '🍒',
    desc: '甜甜的草莓与樱桃',
  },
  {
    id: 'jet',
    name: '火箭',
    badge: '🚀',
    tip: '🚀',
    desc: '烈焰火箭，尾焰落下直冲云霄',
  },
];

export const DEFAULT_CURSOR_THEME: CursorThemeId = 'paw';

const STORAGE_KEY = 'mybook-cursor-theme';

// 文本光标配色（白色描边 + 深色芯线，明暗模式下都清晰可辨）
const TEXT_BAR = '#333a47';
const TEXT_OUTLINE = '#ffffff';

function cursorUrl(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// 默认（箭头）光标：一个可爱的 emoji，热点在左上，模拟鼠标指向位置
function buildArrow(emoji: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">` +
    `<text x="2" y="24" font-size="21" text-anchor="start">${emoji}</text></svg>`;
  return `${cursorUrl(svg)} 2 7, default`;
}

// 可点（小手）光标：同一 emoji，热点略靠内，契合"点击中心"
function buildPointer(emoji: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">` +
    `<text x="2" y="24" font-size="21" text-anchor="start">${emoji}</text></svg>`;
  return `${cursorUrl(svg)} 4 8, pointer`;
}

// 文本光标：细圆头竖线 + 底部基线 + 顶部小 emoji 装饰
function buildText(tip: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">` +
    `<text x="12" y="13" font-size="14" text-anchor="middle">${tip}</text>` +
    `<rect x="10" y="13" width="4" height="17" rx="2" fill="${TEXT_OUTLINE}"/>` +
    `<rect x="11.3" y="14" width="1.4" height="15" rx="0.8" fill="${TEXT_BAR}"/>` +
    `<rect x="11.3" y="29" width="1.4" height="1.3" rx="0.65" fill="${TEXT_BAR}"/>` +
    `</svg>`;
  return `${cursorUrl(svg)} 12 30, text`;
}

// ============ 火箭光标（SVG 绘制 + PNG 栅格化） ============
// 空闲坐标系 34x54、弹头朝上。经典卡通火箭：红色尖头锥 + 银白机身 +
// 青色舷窗 + 两片红色尾翼 + 底部金属喷口，中轴对称。
const ROCKET_VB = '0 0 34 54';

// 红色头锥
const RK_NOSE = 'M17 0.6 L13.4 9.6 L14.8 12.4 L19.2 12.4 L20.6 9.6 Z';
// 银白机身（略收腰的筒身，平底）
const RK_BODY = 'M15.2 12.6 L18.8 12.6 L19.6 27 L19.2 38 L19 44 L15 44 L14.8 38 L14.4 27 Z';
// 两片红色尾翼（下部两侧外展）
const RK_FIN_L = 'M14.2 33 L8.4 44.5 L11 47 L14.6 45.4 Z';
const RK_FIN_R = 'M19.8 33 L25.6 44.5 L23 47 L19.4 45.4 Z';
// 底部金属喷口
const RK_NOZZLE = 'M15.2 44 L18.8 44 L17.6 48.2 L16.4 48.2 Z';

// 预览用单色剪影（切面板小图）：头锥 + 机身
const RK_SILH_NOSE = RK_NOSE;
const RK_SILH_BODY = RK_BODY;

export const THRUST_BODY: Record<'jet', string[]> = {
  jet: [RK_SILH_NOSE, RK_SILH_BODY],
};

export type ThrustThemeId = keyof typeof THRUST_BODY;

/** 带尾焰动效的光标主题（火箭） */
export const THRUST_THEMES: CursorThemeId[] = ['jet'];

const isThrust = (id: CursorThemeId): id is ThrustThemeId => id === 'jet';

/** 火箭轮廓（供切换面板预览；仅火箭主题返回） */
export function cursorPaths(def: CursorThemeDef): string[] | null {
  if (!isThrust(def.id)) return null;
  return THRUST_BODY[def.id];
}

// 完整多色火箭（头锥/尾翼红、机身银白、舷窗青、喷口深金属）
function rocketShapes(transform = ''): string {
  return (
    `<g transform="${transform}">` +
    `<path d="${RK_BODY}" fill="#e8ecf3" stroke="#5a6372" stroke-width="1.3" stroke-linejoin="round"/>` +
    `<path d="${RK_NOSE}" fill="#e8443a" stroke="#a0261f" stroke-width="1.3" stroke-linejoin="round"/>` +
    `<path d="${RK_FIN_L}" fill="#e8443a" stroke="#a0261f" stroke-width="1.3" stroke-linejoin="round"/>` +
    `<path d="${RK_FIN_R}" fill="#e8443a" stroke="#a0261f" stroke-width="1.3" stroke-linejoin="round"/>` +
    `<circle cx="17" cy="24" r="3.1" fill="#6fc3e0" stroke="#1e4c63" stroke-width="1.2"/>` +
    `<path d="${RK_NOZZLE}" fill="#39414f" stroke="#1c222c" stroke-width="1.2" stroke-linejoin="round"/>` +
    `</g>`
  );
}

function vehicleArrowSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="54" viewBox="${ROCKET_VB}">${rocketShapes()}</svg>`;
}

// 火箭文本光标：顶部一支小火箭 + 细竖线
function vehicleTextSvg(): string {
  const mini = rocketShapes('translate(7.4 2) scale(0.36)');
  const bars =
    `<rect x="13" y="26" width="4" height="13" rx="2" fill="${TEXT_OUTLINE}"/>` +
    `<rect x="14.3" y="27" width="1.4" height="11" rx="0.7" fill="${TEXT_BAR}"/>` +
    `<rect x="14.3" y="38.5" width="1.4" height="1.2" rx="0.6" fill="${TEXT_BAR}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">${mini}${bars}</svg>`;
}

// 把 SVG 栅格化成透明 PNG，返回 { dataUrl, scale }（scale 用于换算热点）
function rasterizeVehicle(
  svg: string,
  ow: number,
  oh: number,
  target = 32,
): Promise<{ dataUrl: string; scale: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(target / ow, target / oh);
        const w = Math.max(1, Math.round(ow * scale));
        const h = Math.max(1, Math.round(oh * scale));
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const g = c.getContext('2d');
        if (!g) return resolve(null);
        g.drawImage(img, 0, 0, w, h);
        resolve({ dataUrl: c.toDataURL('image/png'), scale });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  });
}

interface CursorVars {
  arrow: string;
  text: string;
  pointer: string;
}

function varsFor(def: CursorThemeDef): CursorVars {
  if (def.id === 'classic') {
    return { arrow: 'default', text: 'text', pointer: 'pointer' };
  }
  return {
    arrow: buildArrow(def.arrow ?? '🐾'),
    text: buildText(def.tip ?? '🐾'),
    pointer: buildPointer(def.pointer ?? '🐾'),
  };
}

// 拼出 `url("<png>") hx hy, fallback`
function pngCursor(png: string, scale: number, hx: number, hy: number, fallback: string): string {
  return `url("${png}") ${Math.round(hx * scale)} ${Math.round(hy * scale)}, ${fallback}`;
}

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

    // 歼-20：PNG 栅格化较慢，先应用占位，等就绪后再覆盖
    if (isThrust(def.id)) {
      el.style.setProperty('--cursor-arrow', 'default');
      el.style.setProperty('--cursor-text', 'text');
      el.style.setProperty('--cursor-pointer', 'pointer');
      let cancelled = false;
      (async () => {
        const arrow = await rasterizeVehicle(vehicleArrowSvg(), 34, 54);
        const text = await rasterizeVehicle(vehicleTextSvg(), 30, 40);
        const pointer = await rasterizeVehicle(vehicleArrowSvg(), 34, 54);
        if (cancelled) return;
        if (arrow)
          el.style.setProperty(
            '--cursor-arrow',
            pngCursor(arrow.dataUrl, arrow.scale, 17, 2, 'default'),
          );
        if (text)
          el.style.setProperty(
            '--cursor-text',
            pngCursor(text.dataUrl, text.scale, 15, 38, 'text'),
          );
        if (pointer)
          el.style.setProperty(
            '--cursor-pointer',
            pngCursor(pointer.dataUrl, pointer.scale, 17, 27, 'pointer'),
          );
      })();
      return () => {
        cancelled = true;
      };
    }

    const vars = varsFor(def);
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
