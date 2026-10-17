// 质感纸纹壁纸（浅色模式）—— 有道云纸纹思路的自绘版本
// - 全部用纯 CSS 渐变 / 内联 SVG feTurbulence 噪声绘制，零图片文件（几百字节代码 vs 每张几百 KB 的 jpg）
// - 设计约束：纹理对比度压得很低（α ≈ 0.03~0.08），铺满全窗后透过半透明纸面（--lw-paper）
//   能在正文、目录上自然透出底纹，但不会干扰深色文字的阅读
// - paper 给较低不透明度（≈0.55~0.65），让纹理能"透"到纸面上；可读性靠纹理本身低对比保证
import type { ReactNode } from 'react';

function TextureBase({ layers, children }: { layers: string; children?: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        background: layers,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

/**
 * 内联 SVG 分形噪声（纸张颗粒）。
 * - feTurbulence 生成灰度噪点，feComponentTransfer 把 alpha 压到 ~0.05，只留一层极轻的"纸粒"
 * - data URI 里的 # 必须写成 %23；引号用单引号避免和外层双引号冲突
 */
const NOISE_GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
  "<feColorMatrix type='saturate' values='0'/>" +
  "<feComponentTransfer><feFuncA type='linear' slope='0.055'/></feComponentTransfer>" +
  '</filter>' +
  "<rect width='180' height='180' filter='url(%23n)'/></svg>\")";

/** 亚麻织纹 —— 米白底 + 经纬细线交织，像铺了块亚麻桌布 */
export function LinenWeaveWallpaper() {
  return (
    <TextureBase
      layers={
        'repeating-linear-gradient(0deg, rgba(122,100,68,0.05) 0 1px, transparent 1px 3px),' +
        'repeating-linear-gradient(90deg, rgba(122,100,68,0.05) 0 1px, transparent 1px 3px),' +
        'radial-gradient(circle at 18% 20%, rgba(255,255,255,0.55), transparent 42%),' +
        'linear-gradient(180deg, #f8f4ec 0%, #f2ecdf 60%, #ece4d3 100%)'
      }
    />
  );
}

/** 宣纸颗粒 —— 暖米色 + 极轻分形噪声，旧纸张的细腻质感 */
export function PaperGrainWallpaper() {
  return (
    <TextureBase
      layers={
        `${NOISE_GRAIN},` +
        'radial-gradient(circle at 76% 16%, rgba(255,252,242,0.7), transparent 40%),' +
        'linear-gradient(180deg, #f7f1e5 0%, #f1e8d6 55%, #eaddc6 100%)'
      }
    />
  );
}

/** 云白点阵 —— 冷白底 + 浅蓝灰小圆点阵，安静干净 */
export function DotGridWallpaper() {
  return (
    <TextureBase
      layers={
        // 点阵层必须用 "位置 / 尺寸" 语法指定平铺周期，否则整屏只画一个点
        'radial-gradient(rgba(86,108,130,0.10) 1.1px, transparent 1.5px) 0 0 / 22px 22px repeat,' +
        'radial-gradient(circle at 70% 24%, rgba(255,255,255,0.6), transparent 45%),' +
        'linear-gradient(180deg, #f7fafc 0%, #eef3f8 60%, #e7edf4 100%)'
      }
    />
  );
}

/** 手账方格 —— 淡青白底 + 24px 浅绿方格，笔记本内页的感觉 */
export function GridPaperWallpaper() {
  return (
    <TextureBase
      layers={
        'repeating-linear-gradient(0deg, rgba(96,142,118,0.08) 0 1px, transparent 1px 24px),' +
        'repeating-linear-gradient(90deg, rgba(96,142,118,0.08) 0 1px, transparent 1px 24px),' +
        'radial-gradient(circle at 24% 18%, rgba(255,255,255,0.6), transparent 44%),' +
        'linear-gradient(180deg, #f4faf6 0%, #ecf5ef 60%, #e3efe7 100%)'
      }
    />
  );
}

/** 青瓷横纹 —— 淡青底 + 极细横向帘纹，传统"帘纹纸"的味道 */
export function LaidPaperWallpaper() {
  return (
    <TextureBase
      layers={
        'repeating-linear-gradient(0deg, rgba(74,112,106,0.055) 0 1px, transparent 1px 4px),' +
        'repeating-linear-gradient(0deg, rgba(74,112,106,0.05) 0 1px, transparent 1px 28px),' +
        'radial-gradient(circle at 78% 20%, rgba(255,255,255,0.55), transparent 40%),' +
        'linear-gradient(180deg, #f0f6f4 0%, #e7f0ed 60%, #ddeae6 100%)'
      }
    />
  );
}

/** 藕荷斜纹 —— 淡粉紫底 + 45° 织物斜纹，温柔一点的选择 */
export function TwillWallpaper() {
  return (
    <TextureBase
      layers={
        'repeating-linear-gradient(45deg, rgba(146,106,132,0.05) 0 2px, transparent 2px 6px),' +
        'radial-gradient(circle at 30% 22%, rgba(255,255,255,0.6), transparent 44%),' +
        'linear-gradient(180deg, #f9f1f5 0%, #f3e7ee 60%, #ecdee8 100%)'
      }
    />
  );
}
