// 壁纸元数据注册表
// - 每种壁纸是一个独立文件夹，放在 src/components/wallpapers/ 下
// - kind: 'svg' 表示用代码/SVG 绘制（组件渲染）；'image' 表示直接用背景图（可以是 public/ 下的图 URL 或 import 的图）
// - mode: 'dark'（缺省）只在暗黑模式渲染；'light' 只在浅色模式渲染
// - 浅色壁纸建议提供 tint（容器/顶栏染色）与 paper（纸面底色），由 WallpaperHost 写入 CSS 变量
// - 新增壁纸：在对应文件夹下写好组件/图片，再往 WALLPAPER_PRESETS 里追加一条即可
import type { ComponentType } from 'react';
import FireflyNightSky from './firefly-night-sky';
import WarmHearth from './warm-hearth';
import MeteorNightSky from './meteor-night-sky';
import {
  GreenEyeWallpaper,
  WarmPaperWallpaper,
  MistMorningWallpaper,
  SunsetGlowWallpaper,
  SakuraPinkWallpaper,
  LavenderFieldWallpaper,
  LakeMorningWallpaper,
  SnowPeakWallpaper,
} from './light-tints';
import {
  LinenWeaveWallpaper,
  PaperGrainWallpaper,
  DotGridWallpaper,
  GridPaperWallpaper,
  LaidPaperWallpaper,
  TwillWallpaper,
} from './textures';

export type WallpaperKind = 'svg' | 'image';
export type WallpaperMode = 'dark' | 'light';

export interface WallpaperPreset {
  id: string;
  name: string;
  kind: WallpaperKind;
  /** 适用模式：缺省 'dark'（兼容旧壁纸） */
  mode?: WallpaperMode;
  /** kind='svg' 时必填 */
  component?: ComponentType;
  /** kind='image' 时必填，可以是任意 url() 可用的字符串 */
  imageUrl?: string;
  /** 弹框里的预览缩略图（image/svg 都建议提供，没有则用渲染组件兜底） */
  thumbnail?: string;
  description?: string;
  /** 浅色壁纸：整体色调，染顶栏/容器（CSS 变量 --lw-tint） */
  tint?: string;
  /** 浅色壁纸：编辑纸面底色（CSS 变量 --lw-paper）。
   *  照片类壁纸可给较低不透明度让底图透出来；柔化由 blur/veil 在壁纸层完成。
   *  ⚠️ 不要在纸面上用 backdrop-filter：它会让纸面成为 position:fixed 子元素的
   *     包含块，导致图片选中框 / 缩放手柄脱离图片本体。 */
  paper?: string;
  /** 选择弹框里的缩略图背景（任意 CSS background 值） */
  thumbCss?: string;
  /** kind='image'：覆盖在照片上的柔化遮罩（任意 CSS background 值）。
   *  作用是把照片压柔、降低对正文的干扰，保证可读性 */
  veil?: string;
  /** kind='image'：照片轻微模糊（px），边缘更柔，进一步降低干扰 */
  blur?: number;
  /** 浅色壁纸在设置面板里的分组标题（柔和护眼 / 质感纸纹 / 风景照片） */
  group?: string;
  /** 素材来源（免费商用图库）标注，仅作注释 */
  source?: string;
}

/** 代表"无壁纸"：只保留当前模式纯色底 */
export const WALLPAPER_NONE_ID = 'none';

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: WALLPAPER_NONE_ID,
    name: '默认',
    kind: 'svg',
    component: () => null,
    description: '不显示壁纸，仅保留当前模式底色',
  },

  /* ---------------- 暗黑模式 ---------------- */
  {
    id: 'firefly-night-sky',
    name: '萤火夜空',
    kind: 'svg',
    mode: 'dark',
    component: FireflyNightSky,
    description: '新月、山丘和点点萤火虫',
  },
  {
    id: 'warm-hearth',
    name: '壁炉',
    kind: 'svg',
    mode: 'dark',
    component: WarmHearth,
    description: '深夜墙边暖光壁炉，氛围安逸',
  },
  {
    id: 'meteor-night-sky',
    name: '流星雨',
    kind: 'svg',
    mode: 'dark',
    component: MeteorNightSky,
    description: '深冷星空，流星不时划过夜空',
  },

  /* ---------------- 浅色模式（柔和护眼） ---------------- */
  {
    id: 'green-eye',
    name: '豆沙绿',
    kind: 'svg',
    mode: 'light',
    component: GreenEyeWallpaper,
    description: '经典护眼绿，柔光斑点点',
    tint: '#cfe6d6',
    paper: 'rgba(238,248,241,0.92)',
    thumbCss:
      'radial-gradient(circle at 22% 26%, rgba(255,255,255,0.6), transparent 42%),' +
      'linear-gradient(180deg, #d9efde 0%, #c4e3cd 100%)',
  },
  {
    id: 'warm-paper',
    name: '暖纸米黄',
    kind: 'svg',
    mode: 'light',
    component: WarmPaperWallpaper,
    description: '旧纸张质感，柔和暖光',
    tint: '#f0e3c6',
    paper: 'rgba(250,244,228,0.92)',
    thumbCss:
      'repeating-linear-gradient(0deg, rgba(180,150,90,0.05) 0 2px, transparent 2px 4px),' +
      'linear-gradient(180deg, #f7eed8 0%, #ecdcb9 100%)',
  },
  {
    id: 'mist-morning',
    name: '晨雾青',
    kind: 'svg',
    mode: 'light',
    component: MistMorningWallpaper,
    description: '淡青晨雾，远山与薄日',
    tint: '#d3e7ec',
    paper: 'rgba(242,250,252,0.9)',
    thumbCss: 'linear-gradient(180deg, #e2f0f4 0%, #d8eee6 62%, rgba(154,196,188,0.5) 100%)',
  },
  {
    id: 'sunset-glow',
    name: '暮色暖橙',
    kind: 'svg',
    mode: 'light',
    component: SunsetGlowWallpaper,
    description: '黄昏暖光与落日',
    tint: '#f6ddcd',
    paper: 'rgba(253,243,236,0.9)',
    thumbCss:
      'radial-gradient(circle at 24% 30%, rgba(255,236,205,0.9), transparent 34%),' +
      'linear-gradient(180deg, #fdeee2 0%, #f5d2c0 100%)',
  },
  {
    id: 'sakura-pink',
    name: '樱花粉',
    kind: 'svg',
    mode: 'light',
    component: SakuraPinkWallpaper,
    description: '春日樱色，花瓣飘落',
    tint: '#f6d9e3',
    paper: 'rgba(252,240,245,0.72)',
    thumbCss:
      'radial-gradient(circle at 70% 24%, rgba(255,255,255,0.7), transparent 40%),' +
      'linear-gradient(180deg, #fdeef3 0%, #f5d6e3 100%)',
  },
  {
    id: 'lavender-field',
    name: '薰衣草田野',
    kind: 'svg',
    mode: 'light',
    component: LavenderFieldWallpaper,
    description: '柔紫田垄，随风起伏',
    tint: '#ddd3ee',
    paper: 'rgba(246,243,252,0.72)',
    thumbCss: 'linear-gradient(180deg, #f1edfa 0%, #e4dcf4 55%, #c9bce4 100%)',
  },
  {
    id: 'lake-morning',
    name: '湖畔清晨',
    kind: 'svg',
    mode: 'light',
    component: LakeMorningWallpaper,
    description: '远山湖面，晨光微澜',
    tint: '#cfe0ea',
    paper: 'rgba(240,248,252,0.72)',
    thumbCss: 'linear-gradient(180deg, #e8f3f8 0%, #dcebf2 62%, rgba(196,222,236,0.8) 100%)',
  },
  {
    id: 'snow-peak',
    name: '雪山晨光',
    kind: 'svg',
    mode: 'light',
    component: SnowPeakWallpaper,
    description: '淡冷天光下雪峰层叠',
    tint: '#d8e4ee',
    paper: 'rgba(244,250,254,0.72)',
    thumbCss: 'linear-gradient(180deg, #eaf2f9 0%, #e0ebf4 55%, rgba(178,200,220,0.55) 100%)',
  },

  /* ---------------- 浅色模式 · 质感纸纹（纯 CSS/SVG 绘制，零图片资源） ----------------
     纸纹类壁纸的 paper 给较低不透明度，让底纹能透到正文纸面和目录面板上（有道云纸纹的效果）；
     纹理本身对比度极低，不影响正文阅读 */
  {
    id: 'texture-linen',
    name: '亚麻织纹',
    kind: 'svg',
    mode: 'light',
    component: LinenWeaveWallpaper,
    group: '质感纸纹',
    description: '米白亚麻布经纬交织，温和素雅',
    tint: '#ece4d2',
    paper: 'rgba(251,248,242,0.6)',
    thumbCss:
      'repeating-linear-gradient(0deg, rgba(122,100,68,0.09) 0 1px, transparent 1px 3px),' +
      'repeating-linear-gradient(90deg, rgba(122,100,68,0.09) 0 1px, transparent 1px 3px),' +
      'linear-gradient(180deg, #f8f4ec 0%, #ece4d3 100%)',
  },
  {
    id: 'texture-grain',
    name: '宣纸颗粒',
    kind: 'svg',
    mode: 'light',
    component: PaperGrainWallpaper,
    group: '质感纸纹',
    description: '暖米色旧纸，细腻的纸张颗粒',
    tint: '#eee4d0',
    paper: 'rgba(250,245,235,0.58)',
    thumbCss:
      'repeating-radial-gradient(circle at 30% 30%, rgba(150,120,80,0.05) 0 1px, transparent 1px 3px),' +
      'linear-gradient(180deg, #f7f1e5 0%, #eaddc6 100%)',
  },
  {
    id: 'texture-dot-grid',
    name: '云白点阵',
    kind: 'svg',
    mode: 'light',
    component: DotGridWallpaper,
    group: '质感纸纹',
    description: '冷白底浅蓝灰点阵，安静干净',
    tint: '#dde6ee',
    paper: 'rgba(248,251,253,0.6)',
    thumbCss:
      'radial-gradient(rgba(86,108,130,0.18) 1px, transparent 1.4px) 0 0 / 10px 10px repeat,' +
      'linear-gradient(180deg, #f7fafc 0%, #e7edf4 100%)',
  },
  {
    id: 'texture-grid',
    name: '手账方格',
    kind: 'svg',
    mode: 'light',
    component: GridPaperWallpaper,
    group: '质感纸纹',
    description: '淡青白底浅绿方格，笔记本内页',
    tint: '#dcebe0',
    paper: 'rgba(248,252,249,0.6)',
    thumbCss:
      'repeating-linear-gradient(0deg, rgba(96,142,118,0.14) 0 1px, transparent 1px 12px),' +
      'repeating-linear-gradient(90deg, rgba(96,142,118,0.14) 0 1px, transparent 1px 12px),' +
      'linear-gradient(180deg, #f4faf6 0%, #e3efe7 100%)',
  },
  {
    id: 'texture-laid',
    name: '青瓷横纹',
    kind: 'svg',
    mode: 'light',
    component: LaidPaperWallpaper,
    group: '质感纸纹',
    description: '淡青底极细帘纹，传统帘纹纸',
    tint: '#d9e8e3',
    paper: 'rgba(247,251,250,0.58)',
    thumbCss:
      'repeating-linear-gradient(0deg, rgba(74,112,106,0.1) 0 1px, transparent 1px 4px),' +
      'linear-gradient(180deg, #f0f6f4 0%, #ddeae6 100%)',
  },
  {
    id: 'texture-twill',
    name: '藕荷斜纹',
    kind: 'svg',
    mode: 'light',
    component: TwillWallpaper,
    group: '质感纸纹',
    description: '淡粉紫织物斜纹，温柔耐看',
    tint: '#ecdfe8',
    paper: 'rgba(251,247,249,0.6)',
    thumbCss:
      'repeating-linear-gradient(45deg, rgba(146,106,132,0.1) 0 2px, transparent 2px 6px),' +
      'linear-gradient(180deg, #f9f1f5 0%, #ecdee8 100%)',
  },

  /* ---------------- 浅色模式 · 风景照片（复用项目内 public/covers 免费素材） ---------------- */
  {
    id: 'scene-rapeseed',
    name: '油菜花海',
    kind: 'image',
    mode: 'light',
    imageUrl: '/covers/cover-landscape-03.jpg',
    group: '风景照片',
    description: '金黄色花田，明快',
    tint: '#e6edc9',
    paper: 'rgba(252,253,246,0.7)',
    veil: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.46) 100%)',
    blur: 12,
    source: 'Pexels',
  },
  {
    id: 'scene-cloud-mountain',
    name: '远山云海',
    kind: 'image',
    mode: 'light',
    imageUrl: '/covers/cover-landscape-05.jpg',
    group: '风景照片',
    description: '层叠远山与云海',
    tint: '#d8e2ea',
    paper: 'rgba(247,250,253,0.7)',
    veil: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.46) 100%)',
    blur: 12,
    source: 'Pexels',
  },
  {
    id: 'scene-grassland',
    name: '草原海天',
    kind: 'image',
    mode: 'light',
    imageUrl: '/covers/cover-landscape-06.jpg',
    group: '风景照片',
    description: '辽阔草原与天际线',
    tint: '#dbe8d8',
    paper: 'rgba(248,251,246,0.7)',
    veil: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.46) 100%)',
    blur: 12,
    source: 'Pexels',
  },
  {
    id: 'scene-waterfall',
    name: '森林瀑布',
    kind: 'image',
    mode: 'light',
    imageUrl: '/covers/cover-landscape-13.jpg',
    group: '风景照片',
    description: '林间瀑布，清透绿意',
    tint: '#cfe0d4',
    paper: 'rgba(244,250,246,0.7)',
    veil: 'linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.46) 100%)',
    blur: 12,
    source: 'Picsum (Unsplash 来源)',
  },
  {
    id: 'scene-avenue',
    name: '林荫大道',
    kind: 'image',
    mode: 'light',
    imageUrl: '/covers/cover-landscape-21.jpg',
    group: '风景照片',
    description: '绿树成荫的静路',
    tint: '#d5e2c8',
    paper: 'rgba(248,251,244,0.7)',
    veil: 'linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.46) 100%)',
    blur: 12,
    source: 'Picsum (Unsplash 来源)',
  },
  {
    id: 'scene-coast',
    name: '海岸长曝',
    kind: 'image',
    mode: 'light',
    imageUrl: '/covers/cover-landscape-30.jpg',
    group: '风景照片',
    description: '长曝海岸，柔和静谧',
    tint: '#dbe6ec',
    paper: 'rgba(247,251,253,0.7)',
    veil: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.46) 100%)',
    blur: 12,
    source: 'Picsum (Unsplash 来源)',
  },
];

export function getWallpaperById(id: string): WallpaperPreset | undefined {
  return WALLPAPER_PRESETS.find((w) => w.id === id);
}

/** 按模式取壁纸组（none 永远包含，便于弹框展示"默认"） */
export function getWallpapersByMode(mode: WallpaperMode): WallpaperPreset[] {
  return WALLPAPER_PRESETS.filter((w) => w.id === WALLPAPER_NONE_ID || (w.mode ?? 'dark') === mode);
}

export function presetMode(p: WallpaperPreset): WallpaperMode {
  return p.mode ?? 'dark';
}

export { default as WallpaperHost } from './WallpaperHost';
