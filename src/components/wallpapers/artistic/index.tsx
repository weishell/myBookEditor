// 氛围壁纸（古风雅韵 / 科技极客 / 山水意境）
// - 全部用内联 SVG + CSS 渐变绘制，零图片资源：不会 404、不增加打包体积、可无限缩放
// - 统一 1200×800 视图 + preserveAspectRatio="slice"，任何屏幕比例都能铺满不留白边
// - 设计约束：背景只做"氛围"，中部与左侧保持低对比留白，保证正文/首页卡片上的深色文字可读
import type { ReactNode } from 'react';

/** 铺满视口的壁纸画布 */
function Canvas({ background, children }: { background: string; children?: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, background, overflow: 'hidden' }}
    >
      {children}
    </div>
  );
}

/** SVG 图层：slice 保证等比铺满，窄屏时裁两侧而不是拉伸变形 */
function SvgLayer({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      {children}
    </svg>
  );
}

/* ==========================================================================
   古风雅韵
   ========================================================================== */

/**
 * 水墨远山 —— 宣纸底 + 三层淡墨山峦 + 一点朱印
 * 墨色只用青灰系、透明度压在 0.5 以下，远看是"雾里看山"，不抢文字
 */
export function InkMountainWallpaper() {
  return (
    <Canvas background="linear-gradient(180deg, #f8f5ec 0%, #f2f1e9 46%, #eaece6 100%)">
      {/* 纸面晕染：右上暖光、左下冷调，模拟宣纸吸墨不匀 */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(900px 520px at 82% -10%, rgba(255,252,240,0.9), transparent 62%),' +
            'radial-gradient(760px 480px at 6% 92%, rgba(206,219,208,0.42), transparent 64%)',
        }}
      />
      <SvgLayer>
        {/* 最远一层：淡到近乎雾。
            三层山整体压在下方 1/3 —— 背景要"托住"内容，不能顶到内容脸上，
            上方 2/3 必须留白给首页文案 */}
        <path
          d="M0 700 L130 610 L250 668 L392 558 L520 646 L648 576 L784 658 L910 592 L1042 664 L1200 606 L1200 800 L0 800 Z"
          fill="#a9b7ae"
          opacity="0.22"
        />
        {/* 中层：墨色稍重，撑起层次 */}
        <path
          d="M0 748 L168 664 L306 730 L452 648 L604 726 L766 658 L906 734 L1064 658 L1200 712 L1200 800 L0 800 Z"
          fill="#87978e"
          opacity="0.3"
        />
        {/* 近景：最深，压住画面下缘 */}
        <path
          d="M0 786 L206 736 L404 776 L604 726 L806 776 L1006 730 L1200 766 L1200 800 L0 800 Z"
          fill="#63736b"
          opacity="0.34"
        />
        {/* 水面细纹 */}
        {[750, 768, 786].map((y, i) => (
          <path
            key={y}
            d={`M${120 + i * 40} ${y} q 60 -6 120 0 t 120 0 t 120 0`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            opacity={0.3 - i * 0.07}
          />
        ))}
        {/* 飞鸟三只：只留极细一笔，添生气 */}
        <g stroke="#5c6b62" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round">
          <path d="M712 268 q 11 -9 22 0 q 11 -9 22 0" />
          <path d="M784 226 q 8 -7 16 0 q 8 -7 16 0" />
          <path d="M664 232 q 7 -6 14 0 q 7 -6 14 0" />
        </g>
        {/* 朱红闲章：整幅画唯一的高饱和色，用来提神。
            尺寸刻意做小 —— 大了就从"印章"变成"色块"，很破坏意境 */}
        <g opacity="0.7">
          <rect x="1104" y="726" width="30" height="38" rx="2.5" fill="#b0463b" />
          <path
            d="M1113 738 h12 M1113 748 h12 M1113 756 h8"
            stroke="#f8f2e6"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </SvgLayer>
    </Canvas>
  );
}

/**
 * 墨竹疏影 —— 淡青纸底 + 右侧几竿修竹
 * 刻意把竹子全部压在右侧 30% 内，左侧留白给首页文案
 */
export function InkBambooWallpaper() {
  // 竹节：每竿按 height 分段，节处画短横线
  const stalks = [
    { x: 946, w: 13, top: -20, bottom: 800, lean: -8 },
    { x: 1032, w: 17, top: -40, bottom: 800, lean: 6 },
    { x: 1118, w: 11, top: -10, bottom: 800, lean: -4 },
  ];

  return (
    <Canvas background="linear-gradient(180deg, #f3f6f1 0%, #eef2ec 52%, #e7ece6 100%)">
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(880px 560px at 12% 18%, rgba(255,255,255,0.86), transparent 68%),' +
            'radial-gradient(620px 420px at 96% 86%, rgba(150,178,152,0.26), transparent 66%)',
        }}
      />
      <SvgLayer>
        {stalks.map((s) => (
          <g key={s.x} opacity="0.5">
            <path
              d={`M${s.x} ${s.top} L${s.x + s.lean} ${s.bottom}`}
              stroke="#78937b"
              strokeWidth={s.w}
              strokeLinecap="round"
            />
            {/* 竹节：沿竿等距横断 */}
            {Array.from({ length: 7 }).map((_, i) => {
              const y = 60 + i * 108;
              return (
                <path
                  key={y}
                  d={`M${s.x - s.w * 0.9} ${y} L${s.x + s.w * 1.5} ${y - 2}`}
                  stroke="#4f6b55"
                  strokeWidth="2.4"
                  opacity="0.55"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        ))}
        {/* 竹叶：柳叶形，成组斜出 */}
        {[
          [920, 150, -28, 96],
          [890, 214, -46, 84],
          [980, 268, 34, 104],
          [1010, 96, 42, 88],
          [1080, 196, -22, 92],
          [1104, 330, 30, 78],
          [1046, 420, -40, 86],
          [1148, 470, 24, 74],
        ].map(([x, y, rot, len], i) => (
          <ellipse
            key={`${x}-${y}`}
            cx={x + len / 2}
            cy={y}
            rx={len / 2}
            ry={7 - (i % 3)}
            fill="#6f8a72"
            opacity={0.34 + (i % 4) * 0.04}
            transform={`rotate(${rot} ${x + len / 2} ${y})`}
          />
        ))}
      </SvgLayer>
    </Canvas>
  );
}

/**
 * 青花缠枝 —— 泛青白瓷底 + 边缘缠枝纹
 * 纹样只贴四边，中央大面积留白，像瓷器内壁
 */
export function BluePorcelainWallpaper() {
  const wave = (y: number) =>
    `M-40 ${y} q 80 -46 160 0 t 160 0 t 160 0 t 160 0 t 160 0 t 160 0 t 160 0 t 160 0`;

  return (
    <Canvas background="linear-gradient(180deg, #f7fafc 0%, #f1f6fa 48%, #e9f0f6 100%)">
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(760px 520px at 50% 42%, rgba(255,255,255,0.94), transparent 72%)',
        }}
      />
      <SvgLayer>
        {/* 上缘两道缠枝，粗细错开更像手绘 */}
        <path d={wave(64)} fill="none" stroke="#35618c" strokeWidth="2.4" opacity="0.24" />
        <path d={wave(96)} fill="none" stroke="#35618c" strokeWidth="1.4" opacity="0.16" />
        {/* 下缘同样两道，形成上下呼应 */}
        <path d={wave(700)} fill="none" stroke="#35618c" strokeWidth="2.4" opacity="0.22" />
        <path d={wave(732)} fill="none" stroke="#35618c" strokeWidth="1.4" opacity="0.15" />
        {/* 缠枝上的小花：五瓣简笔 */}
        {[220, 540, 860].map((cx, i) => (
          <g key={cx} opacity={0.2 - i * 0.02}>
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse
                key={deg}
                cx={cx}
                cy={80}
                rx="13"
                ry="6"
                fill="#35618c"
                transform={`rotate(${deg} ${cx} 80) translate(0 -9)`}
              />
            ))}
            <circle cx={cx} cy={80} r="3.4" fill="#35618c" />
          </g>
        ))}
        {/* 左右竖向回纹：极淡，只做边界暗示 */}
        {[0, 1].map((side) => (
          <path
            key={side}
            d={`M${side ? 1168 : 32} 180 l 0 440`}
            stroke="#35618c"
            strokeWidth="1.6"
            opacity="0.14"
            strokeDasharray="10 12"
          />
        ))}
      </SvgLayer>
    </Canvas>
  );
}

/* ==========================================================================
   科技极客
   ========================================================================== */

/**
 * 星链网格 —— 冷白底 + 细网格 + 节点连线
 * 科技感靠"结构"而非深色：底仍保持浅色，保证首页正文可读
 */
export function TechGridWallpaper() {
  const nodes = [
    [180, 168],
    [428, 246],
    [690, 156],
    [906, 292],
    [286, 470],
    [560, 402],
    [820, 512],
    [1064, 396],
    [402, 664],
    [742, 690],
  ];
  // 预先算好相邻连线，避免运行时两两 O(n²) 判断
  const links: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [1, 5],
    [4, 5],
    [5, 6],
    [6, 7],
    [3, 5],
    [4, 8],
    [5, 8],
    [5, 9],
    [6, 9],
    [8, 9],
  ];

  return (
    <Canvas background="linear-gradient(180deg, #f7fafd 0%, #eef4fb 50%, #e8f0f9 100%)">
      {/* 网格：两条 repeating 叠加，32px 一格 */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, rgba(72,116,178,0.07) 0 1px, transparent 1px 32px),' +
            'repeating-linear-gradient(90deg, rgba(72,116,178,0.07) 0 1px, transparent 1px 32px)',
          maskImage: 'radial-gradient(circle at 50% 42%, #000 8%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 42%, #000 8%, transparent 78%)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(680px 460px at 84% 8%, rgba(88,150,232,0.2), transparent 66%),' +
            'radial-gradient(620px 420px at 6% 88%, rgba(120,110,220,0.14), transparent 68%)',
        }}
      />
      <SvgLayer>
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            stroke="#4d7dbd"
            strokeWidth="1.2"
            opacity="0.2"
          />
        ))}
        {nodes.map(([x, y], i) => (
          <g key={i} opacity={0.34 + (i % 3) * 0.08}>
            <circle cx={x} cy={y} r={i % 4 === 0 ? 4.6 : 3} fill="#3c6fae" />
            {i % 4 === 0 && (
              <circle
                cx={x}
                cy={y}
                r="13"
                fill="none"
                stroke="#3c6fae"
                strokeWidth="1"
                opacity="0.5"
              />
            )}
          </g>
        ))}
      </SvgLayer>
    </Canvas>
  );
}

/**
 * 数据流 —— 斜向流线 + 缓动光带
 * 用虚线 path 模拟数据包在链路上跑，静态不耗 CPU
 */
export function TechStreamWallpaper() {
  const streams = [
    { d: 'M-60 720 C 220 640, 420 480, 700 430 S 1080 320, 1280 240', o: 0.26, w: 2.4 },
    { d: 'M-60 800 C 260 730, 470 590, 760 540 S 1100 430, 1280 360', o: 0.2, w: 1.8 },
    { d: 'M-60 480 C 240 430, 400 300, 680 250 S 1060 140, 1280 80', o: 0.16, w: 1.6 },
    { d: 'M-60 610 C 300 560, 520 420, 800 380 S 1120 280, 1280 210', o: 0.12, w: 1.2 },
  ];

  return (
    <Canvas background="linear-gradient(150deg, #f6fafe 0%, #eaf2fb 46%, #e5eef9 100%)">
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(135deg, rgba(86,132,196,0.05) 0 1px, transparent 1px 14px)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(760px 520px at 74% 22%, rgba(86,168,236,0.22), transparent 64%),' +
            'radial-gradient(560px 400px at 18% 84%, rgba(126,116,226,0.16), transparent 66%)',
        }}
      />
      <SvgLayer>
        {streams.map((s, i) => (
          <g key={i}>
            <path d={s.d} fill="none" stroke="#4f86c9" strokeWidth={s.w} opacity={s.o} />
            {/* 数据包：沿同一条曲线错开虚线相位，视觉上在"跑" */}
            <path
              d={s.d}
              fill="none"
              stroke="#2f6fb5"
              strokeWidth={s.w + 1.6}
              opacity={s.o * 0.85}
              strokeDasharray="16 240"
              strokeDashoffset={i * 70}
              strokeLinecap="round"
            />
          </g>
        ))}
        {/* 端点方块：像接口/节点 */}
        {[
          [700, 430],
          [760, 540],
          [680, 250],
          [800, 380],
        ].map(([x, y], i) => (
          <rect
            key={i}
            x={x - 4}
            y={y - 4}
            width="8"
            height="8"
            rx="1.6"
            fill="#2f6fb5"
            opacity="0.36"
          />
        ))}
      </SvgLayer>
    </Canvas>
  );
}

/* ==========================================================================
   暗黑 · 科技
   ========================================================================== */

/**
 * 赛博网格 —— 深空底 + 青色网格 + 发光节点
 * 浅色科技壁纸（星链/数据流）压深也好看，但暗色下的冷光感是另一种味道，
 * 所以单独做一款 mode='dark'：只在暗黑模式出现，不与浅色组混用。
 */
export function DarkTechNeonWallpaper() {
  const nodes: [number, number][] = [
    [180, 620],
    [420, 540],
    [690, 600],
    [930, 520],
    [1120, 610],
    [300, 380],
    [580, 330],
    [860, 380],
    [1040, 300],
  ];
  const links: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [5, 6],
    [6, 7],
    [7, 8],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  return (
    <Canvas background="radial-gradient(1200px 760px at 50% 118%, #0d1b2e 0%, #070d18 58%, #04070d 100%)">
      {/* 网格：青色细线，向下逐渐消失（mask 让地平线以上干净） */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, rgba(64,220,255,0.075) 0 1px, transparent 1px 46px),' +
            'repeating-linear-gradient(90deg, rgba(64,220,255,0.075) 0 1px, transparent 1px 46px)',
          maskImage: 'linear-gradient(180deg, transparent 18%, #000 72%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 18%, #000 72%)',
        }}
      />
      {/* 双色冷光：上方青、左下紫，营造纵深 */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(760px 460px at 74% 6%, rgba(50,190,235,0.16), transparent 66%),' +
            'radial-gradient(620px 420px at 6% 92%, rgba(120,90,230,0.14), transparent 68%)',
        }}
      />
      <SvgLayer>
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            stroke="#4fd8f0"
            strokeWidth="1.1"
            opacity="0.22"
          />
        ))}
        {nodes.map(([x, y], i) => (
          <g key={i}>
            {/* 光点外晕：三层递减，模拟发光 */}
            <circle cx={x} cy={y} r="16" fill="#3fd0f5" opacity="0.1" />
            <circle cx={x} cy={y} r="7" fill="#3fd0f5" opacity="0.22" />
            <circle cx={x} cy={y} r="2.8" fill="#bdf3ff" opacity={0.72 + (i % 3) * 0.08} />
          </g>
        ))}
      </SvgLayer>
    </Canvas>
  );
}

/* ==========================================================================
   山水意境
   ========================================================================== */

/**
 * 水月清辉 —— 冷调月夜 + 水面倒影
 * 整体压在低饱和蓝灰，月晕极淡，像凌晨四点的湖
 */
export function MoonLakeWallpaper() {
  return (
    <Canvas background="linear-gradient(180deg, #eef3f8 0%, #e4ecf4 42%, #dbe5ef 100%)">
      <SvgLayer>
        {/* 外晕 → 月盘 */}
        <circle cx="836" cy="196" r="132" fill="#ffffff" opacity="0.4" />
        <circle cx="836" cy="196" r="84" fill="#ffffff" opacity="0.5" />
        <circle cx="836" cy="196" r="56" fill="#fdfefe" opacity="0.92" />
        {/* 远山两层，冷蓝灰 */}
        <path
          d="M0 560 L164 486 L300 548 L438 470 L590 542 L742 476 L890 546 L1046 482 L1200 540 L1200 620 L0 620 Z"
          fill="#93a9bf"
          opacity="0.32"
        />
        <path
          d="M0 604 L200 546 L372 596 L556 534 L736 594 L920 540 L1104 592 L1200 566 L1200 640 L0 640 Z"
          fill="#7e95ad"
          opacity="0.26"
        />
        {/* 水面：横向细纹，越往下越疏 */}
        {Array.from({ length: 14 }).map((_, i) => {
          const y = 648 + i * 11;
          const inset = 60 + i * 14;
          return (
            <path
              key={y}
              d={`M${inset} ${y} H ${1200 - inset}`}
              stroke="#ffffff"
              strokeWidth={i < 4 ? 2 : 1.2}
              opacity={0.42 - i * 0.022}
              strokeLinecap="round"
            />
          );
        })}
        {/* 月影：竖向拉长的倒影，比月盘更淡更散 */}
        <ellipse cx="836" cy="700" rx="46" ry="86" fill="#ffffff" opacity="0.3" />
        <ellipse cx="836" cy="704" rx="22" ry="62" fill="#ffffff" opacity="0.26" />
      </SvgLayer>
    </Canvas>
  );
}

/**
 * 秋山薄雾 —— 暖褐层峦 + 横向雾带
 * 与水墨远山同为"层山"，但换成暖色，秋天萧散的感觉
 */
export function AutumnMistWallpaper() {
  return (
    <Canvas background="linear-gradient(180deg, #faf3e7 0%, #f6e9d6 48%, #f0e1ca 100%)">
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(820px 520px at 76% 4%, rgba(255,250,235,0.9), transparent 62%),' +
            'radial-gradient(680px 460px at 10% 90%, rgba(206,170,124,0.32), transparent 66%)',
        }}
      />
      <SvgLayer>
        {/* 后山：最淡，几乎融进雾里 */}
        <path
          d="M0 500 L150 420 L286 486 L430 404 L580 480 L730 408 L880 484 L1040 412 L1200 478 L1200 620 L0 620 Z"
          fill="#c9a882"
          opacity="0.3"
        />
        {/* 雾带：横向白色渐变，插在山层之间 */}
        <rect x="0" y="492" width="1200" height="72" fill="url(#autumnFog)" />
        <defs>
          <linearGradient id="autumnFog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbf4e8" stopOpacity="0" />
            <stop offset="52%" stopColor="#fdf8ee" stopOpacity="0.86" />
            <stop offset="100%" stopColor="#fbf4e8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* 中山：暖褐主体 */}
        <path
          d="M0 596 L186 522 L340 584 L500 508 L664 590 L828 516 L992 586 L1150 520 L1200 552 L1200 700 L0 700 Z"
          fill="#b58f66"
          opacity="0.4"
        />
        {/* 近山：最深，压住底部 */}
        <path
          d="M0 690 L220 634 L418 684 L620 626 L820 686 L1020 632 L1200 674 L1200 800 L0 800 Z"
          fill="#8e6f4d"
          opacity="0.34"
        />
        {/* 山脊上的树影：几笔竖线，暗示林木 */}
        {[236, 268, 300, 812, 844].map((x, i) => (
          <path
            key={x}
            d={`M${x} ${660 + (i % 2) * 8} l 0 -${18 + (i % 3) * 7}`}
            stroke="#6b543b"
            strokeWidth="2.2"
            opacity="0.34"
            strokeLinecap="round"
          />
        ))}
      </SvgLayer>
    </Canvas>
  );
}
