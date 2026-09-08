// 浅色柔和壁纸（护眼系列）
// - 全部为纯 CSS 渐变 + 极轻装饰，静态或近乎静态，不干扰正文阅读
// - tint：整体色调，染到顶栏/容器；paper：编辑纸面底色（高不透明度，保证深色文字可读）
// - 两者由 WallpaperHost 写入 CSS 变量 --lw-tint / --lw-paper
import type { CSSProperties, ReactNode } from 'react';

function SoftTint({ background, children }: { background: string; children?: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        background,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

const blob = (top: string, left: string, size: string, color: string): CSSProperties => ({
  position: 'absolute',
  top,
  left,
  width: size,
  height: size,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
});

/** 豆沙绿护眼 —— 经典护眼绿，柔光斑点点 */
export function GreenEyeWallpaper() {
  return (
    <SoftTint background="linear-gradient(180deg, #d9efde 0%, #cde9d5 48%, #c4e3cd 100%)">
      <span style={blob('8%', '12%', '34vw', 'rgba(255,255,255,0.55)')} />
      <span style={blob('55%', '78%', '40vw', 'rgba(163,214,178,0.5)')} />
      <span style={blob('78%', '6%', '30vw', 'rgba(178,220,190,0.45)')} />
    </SoftTint>
  );
}

/** 暖纸米黄 —— 旧纸张质感，柔和暖光 */
export function WarmPaperWallpaper() {
  return (
    <SoftTint
      background={
        'repeating-linear-gradient(0deg, rgba(180,150,90,0.025) 0 2px, transparent 2px 4px),' +
        'linear-gradient(180deg, #f7eed8 0%, #f1e4c6 55%, #ecdcb9 100%)'
      }
    >
      <span style={blob('6%', '70%', '36vw', 'rgba(255,250,235,0.7)')} />
      <span style={blob('70%', '10%', '32vw', 'rgba(226,203,155,0.4)')} />
    </SoftTint>
  );
}

/** 晨雾青 —— 淡青渐变 + 远山与薄日 */
export function MistMorningWallpaper() {
  return (
    <SoftTint background="linear-gradient(180deg, #e2f0f4 0%, #d3e9ee 42%, #d8eee6 100%)">
      {/* 薄日 */}
      <span
        style={{
          position: 'absolute',
          top: '9%',
          right: '16%',
          width: 74,
          height: 74,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 38% 34%, rgba(255,252,240,0.95), rgba(255,238,200,0.55) 60%, transparent 75%)',
        }}
      />
      {/* 远山两叠 */}
      <span
        style={{
          position: 'absolute',
          bottom: '-4%',
          left: '-6%',
          right: '-6%',
          height: '26%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(154,196,188,0.35) 100%)',
          clipPath:
            'polygon(0 62%, 14% 38%, 30% 58%, 47% 30%, 63% 56%, 80% 36%, 100% 60%, 100% 100%, 0 100%)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: '-4%',
          left: '-6%',
          right: '-6%',
          height: '18%',
          background: 'rgba(140,186,178,0.4)',
          clipPath:
            'polygon(0 70%, 22% 44%, 42% 68%, 61% 40%, 82% 66%, 100% 48%, 100% 100%, 0 100%)',
        }}
      />
    </SoftTint>
  );
}

/** 暮色暖橙 —— 黄昏暖光 + 落日 */
export function SunsetGlowWallpaper() {
  return (
    <SoftTint background="linear-gradient(180deg, #fdeee2 0%, #f9ddca 48%, #f5d2c0 100%)">
      <span style={blob('12%', '8%', '38vw', 'rgba(255,243,224,0.8)')} />
      {/* 落日 */}
      <span
        style={{
          position: 'absolute',
          top: '16%',
          left: '20%',
          width: 64,
          height: 64,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 42% 38%, #fff4e0 0%, #ffd9a8 46%, rgba(255,193,138,0.35) 78%, transparent 92%)',
        }}
      />
      <span style={blob('74%', '72%', '34vw', 'rgba(240,178,150,0.4)')} />
    </SoftTint>
  );
}

/** 樱花粉 —— 春日樱色，柔粉渐变 + 飘落花瓣 */
export function SakuraPinkWallpaper() {
  return (
    <SoftTint background="linear-gradient(180deg, #fdeef3 0%, #f9e0ea 52%, #f5d6e3 100%)">
      <span style={blob('6%', '64%', '36vw', 'rgba(255,255,255,0.65)')} />
      <span style={blob('66%', '8%', '32vw', 'rgba(244,194,214,0.45)')} />
      {/* 飘落花瓣 */}
      {[
        { t: '18%', l: '14%', r: '-12deg', s: 10 },
        { t: '38%', l: '72%', r: '24deg', s: 8 },
        { t: '58%', l: '34%', r: '-30deg', s: 9 },
        { t: '78%', l: '58%', r: '10deg', s: 7 },
        { t: '30%', l: '44%', r: '40deg', s: 6 },
      ].map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: p.t,
            left: p.l,
            width: p.s,
            height: p.s * 0.72,
            borderRadius: '60% 40% 55% 45% / 55% 60% 40% 45%',
            background: 'rgba(247,183,209,0.55)',
            transform: `rotate(${p.r})`,
          }}
        />
      ))}
    </SoftTint>
  );
}

/** 薰衣草田野 —— 柔紫渐变 + 层叠田垄 */
export function LavenderFieldWallpaper() {
  return (
    <SoftTint background="linear-gradient(180deg, #f1edfa 0%, #e4dcf4 55%, #ddd3ee 100%)">
      <span style={blob('8%', '18%', '34vw', 'rgba(255,255,255,0.6)')} />
      {/* 远近三道田垄，由淡到深 */}
      {[
        { h: '16%', o: 0.28, c: 'rgba(167,148,214,0.5)' },
        { h: '12%', o: 0.5, c: 'rgba(150,128,200,0.5)' },
        { h: '9%', o: 0.72, c: 'rgba(132,110,184,0.45)' },
      ].map((b, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            bottom: `-${4 + i * 2}%`,
            left: '-6%',
            right: '-6%',
            height: b.h,
            background: b.c,
            clipPath:
              'polygon(0 62%, 12% 44%, 26% 60%, 42% 38%, 58% 58%, 74% 40%, 88% 58%, 100% 46%, 100% 100%, 0 100%)',
            opacity: 1 - i * 0.22,
          }}
        />
      ))}
    </SoftTint>
  );
}

/** 湖畔清晨 —— 淡蓝天光 + 远山与湖面倒影 */
export function LakeMorningWallpaper() {
  return (
    <SoftTint background="linear-gradient(180deg, #e8f3f8 0%, #dcebf2 48%, #d3e4ee 100%)">
      {/* 晨光 */}
      <span
        style={{
          position: 'absolute',
          top: '8%',
          left: '62%',
          width: 90,
          height: 90,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 44% 40%, rgba(255,252,238,0.9), rgba(255,243,214,0.4) 58%, transparent 76%)',
        }}
      />
      {/* 远山 */}
      <span
        style={{
          position: 'absolute',
          top: '46%',
          left: '-6%',
          right: '-6%',
          height: '16%',
          background: 'rgba(148,182,200,0.38)',
          clipPath:
            'polygon(0 74%, 16% 38%, 32% 66%, 50% 28%, 68% 62%, 84% 40%, 100% 68%, 100% 100%, 0 100%)',
        }}
      />
      {/* 湖面（下 1/3） + 倒影光带 */}
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '34%',
          background:
            'linear-gradient(180deg, rgba(196,222,236,0.55) 0%, rgba(208,230,240,0.7) 100%)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: '16%',
          left: '58%',
          width: '26%',
          height: 3,
          borderRadius: 3,
          background: 'rgba(255,250,235,0.6)',
        }}
      />
    </SoftTint>
  );
}

/** 雪山晨光 —— 淡冷天光 + 雪峰 */
export function SnowPeakWallpaper() {
  return (
    <SoftTint background="linear-gradient(180deg, #eaf2f9 0%, #e0ebf4 55%, #d8e4ee 100%)">
      <span style={blob('10%', '70%', '34vw', 'rgba(255,255,255,0.7)')} />
      {/* 远雪山 */}
      <span
        style={{
          position: 'absolute',
          top: '42%',
          left: '-6%',
          right: '-6%',
          height: '22%',
          background: 'linear-gradient(180deg, #f6fafd 0%, rgba(178,200,220,0.45) 100%)',
          clipPath:
            'polygon(0 78%, 14% 44%, 28% 68%, 46% 26%, 64% 60%, 80% 36%, 100% 70%, 100% 100%, 0 100%)',
        }}
      />
      {/* 近雪山（更淡，叠在前面） */}
      <span
        style={{
          position: 'absolute',
          top: '56%',
          left: '-6%',
          right: '-6%',
          height: '18%',
          background:
            'linear-gradient(180deg, rgba(250,253,255,0.9) 0%, rgba(196,214,230,0.4) 100%)',
          clipPath:
            'polygon(0 70%, 20% 40%, 38% 64%, 58% 32%, 76% 62%, 100% 44%, 100% 100%, 0 100%)',
        }}
      />
    </SoftTint>
  );
}
