// 壁纸元数据注册表
// - 每种壁纸是一个独立文件夹，放在 src/components/wallpapers/ 下
// - kind: 'svg' 表示用代码/SVG 绘制（组件渲染）；'image' 表示直接用背景图（可以是 public/ 下的图 URL 或 import 的图）
// - 新增壁纸：在对应文件夹下写好组件/图片，再往 WALLPAPER_PRESETS 里追加一条即可
import type { ComponentType } from 'react';
import FireflyNightSky from './firefly-night-sky';
import WarmHearth from './warm-hearth';
import MeteorNightSky from './meteor-night-sky';

export type WallpaperKind = 'svg' | 'image';

export interface WallpaperPreset {
  id: string;
  name: string;
  kind: WallpaperKind;
  /** kind='svg' 时必填 */
  component?: ComponentType;
  /** kind='image' 时必填，可以是任意 url() 可用的字符串 */
  imageUrl?: string;
  /** 弹框里的预览缩略图（image/svg 都建议提供，没有则用渲染组件兜底） */
  thumbnail?: string;
  description?: string;
}

/** 代表"无壁纸"：暗黑模式但只有纯色，不渲染任何壁纸层 */
export const WALLPAPER_NONE_ID = 'none';

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: WALLPAPER_NONE_ID,
    name: '默认',
    kind: 'svg',
    component: () => null,
    description: '不显示壁纸，仅保留暗黑底色',
  },
  {
    id: 'firefly-night-sky',
    name: '萤火夜空',
    kind: 'svg',
    component: FireflyNightSky,
    description: '新月、山丘和点点萤火虫',
  },
  {
    id: 'warm-hearth',
    name: '壁炉',
    kind: 'svg',
    component: WarmHearth,
    description: '深夜墙边暖光壁炉，氛围安逸',
  },
  {
    id: 'meteor-night-sky',
    name: '流星雨',
    kind: 'svg',
    component: MeteorNightSky,
    description: '深冷星空，流星不时划过夜空',
  },
];

export function getWallpaperById(id: string): WallpaperPreset | undefined {
  return WALLPAPER_PRESETS.find((w) => w.id === id);
}

export { default as WallpaperHost } from './WallpaperHost';
