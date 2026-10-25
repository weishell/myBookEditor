// 首页 Hero 的氛围背景
//
// 为什么不直接复用全局壁纸（components/wallpapers）：
// - 全局壁纸按 1200×800 的整屏竖构图设计，塞进 1200×460 的横幅里，
//   preserveAspectRatio="slice" 会把底部的山脚、水纹整片裁掉，只剩中间一层灰雾
// - 全局壁纸不区分"这块区域上有没有字"，而 Hero 里压着大标题，
//   每套场景必须自带色调（深色场景配浅字），对比度才稳
// 所以这里按横幅比例另画一套，全部内联 SVG + CSS 渐变，零图片资源。
import type { CSSProperties, ReactNode } from 'react';

/** 场景色调：决定 Hero 上的文字/按钮用深色还是浅色 */
export type HeroSceneTone = 'light' | 'dark';

export interface HeroScene {
  id: string;
  name: string;
  /** 一句话说明，切换器里做 title */
  desc: string;
  tone: HeroSceneTone;
  /** 切换器上的小色板（任意 CSS background） */
  swatch: string;
  render: () => ReactNode;
}

/** 铺满 Hero 的画布 */
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

/** 1200×460 横幅视图，slice 保证任何比例都铺满不变形 */
function Layer({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 1200 460"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }}
    >
      {children}
    </svg>
  );
}

/**
 * 确定性伪随机：同 seed 永远同一值。
 * 星星位置不能每次 render 重算，否则切换背景回来时会发现星空"挪位置"了。
 */
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** 星空：count 颗、直径 0.5~1.8 之间，密度靠 count 控制 */
function Stars({
  count,
  seed = 0,
  opacity = 1,
}: {
  count: number;
  seed?: number;
  opacity?: number;
}) {
  return (
    <g fill="#ffffff">
      {Array.from({ length: count }, (_, i) => {
        const k = seed + i;
        return (
          <circle
            key={i}
            cx={rand(k + 1) * 1200}
            cy={rand(k + 97) * 440}
            r={0.5 + rand(k + 211) * 1.3}
            opacity={(0.18 + rand(k + 313) * 0.72) * opacity}
          />
        );
      })}
    </g>
  );
}

/* ==========================================================================
   1. 水墨远山 —— 宣纸底 + 三层淡墨山峦 + 淡日飞鸟
   ========================================================================== */
function InkMountainScene() {
  return (
    <Canvas background="linear-gradient(180deg, #f8f4e9 0%, #f4f1e6 46%, #e9e9de 100%)">
      {/* 右上暖光 / 左下冷调：模拟宣纸吸墨不匀 */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(760px 420px at 86% -14%, rgba(255,251,236,0.95), transparent 64%),' +
            'radial-gradient(680px 380px at 4% 104%, rgba(198,214,203,0.45), transparent 66%)',
        }}
      />
      <Layer>
        {/* 淡日放在中偏左：右侧留给数据卡，别让卡片刚好压在太阳上像误触 */}
        <circle cx="702" cy="132" r="70" fill="#e9c9a1" opacity="0.26" />
        <circle cx="702" cy="132" r="40" fill="#dfae80" opacity="0.4" />
        {/* 远山：几乎化进雾里 */}
        <path
          d="M0 344 L118 268 L226 322 L352 236 L470 312 L586 262 L706 330 L826 254 L940 318 L1064 250 L1200 312 L1200 460 L0 460 Z"
          fill="#9aa9a0"
          opacity="0.3"
        />
        {/* 中山 */}
        <path
          d="M0 396 L150 322 L286 384 L432 300 L580 380 L736 314 L878 388 L1040 316 L1200 372 L1200 460 L0 460 Z"
          fill="#7b8b82"
          opacity="0.34"
        />
        {/* 近山 */}
        <path
          d="M0 440 L196 392 L392 430 L592 382 L792 432 L992 388 L1200 424 L1200 460 L0 460 Z"
          fill="#59695f"
          opacity="0.36"
        />
        {/* 水纹三条，越远越淡 */}
        {[424, 440, 454].map((y, i) => (
          <path
            key={y}
            d={`M${140 + i * 46} ${y} q 62 -6 124 0 t 124 0 t 124 0`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            opacity={0.3 - i * 0.07}
          />
        ))}
        {/* 飞鸟 */}
        <g stroke="#5c6b62" strokeWidth="2" fill="none" opacity="0.34" strokeLinecap="round">
          <path d="M846 168 q 11 -9 22 0 q 11 -9 22 0" />
          <path d="M918 130 q 8 -7 16 0 q 8 -7 16 0" />
          <path d="M798 136 q 7 -6 14 0 q 7 -6 14 0" />
        </g>
      </Layer>
    </Canvas>
  );
}

/* ==========================================================================
   2. 青绿山水 —— 青绿设色 + 泥金勾边 + 祥云
   ========================================================================== */
function CeladonScene() {
  return (
    <Canvas background="linear-gradient(180deg, #f4f9f3 0%, #e8f2ea 52%, #dceade 100%)">
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(700px 400px at 74% -10%, rgba(255,255,255,0.85), transparent 62%),' +
            'radial-gradient(620px 360px at 12% 108%, rgba(150,196,166,0.35), transparent 66%)',
        }}
      />
      <Layer>
        {/* 远峰：青绿填色 + 泥金描边，两笔就是"青绿山水"的语法 */}
        <path
          d="M0 352 L124 226 L238 320 L368 176 L486 312 L604 200 L738 322 L860 214 L982 318 L1108 232 L1200 306 L1200 460 L0 460 Z"
          fill="#b9d0bd"
          opacity="0.55"
          stroke="#c9a86a"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M0 410 L164 306 L306 392 L462 292 L616 396 L776 300 L918 398 L1074 302 L1200 384 L1200 460 L0 460 Z"
          fill="#8fb69c"
          opacity="0.62"
          stroke="#c9a86a"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M0 452 L212 396 L418 442 L628 388 L838 444 L1048 392 L1200 432 L1200 460 L0 460 Z"
          fill="#5f8f77"
          opacity="0.55"
        />
        {/* 祥云：三组同心弧，越靠右越淡 */}
        <g fill="none" stroke="#ffffff" strokeLinecap="round" opacity="0.85">
          <path d="M812 118 q 18 -26 44 -12 q 26 -22 48 4 q 26 -4 30 20" strokeWidth="3" />
          <path d="M826 138 q 16 -22 40 -10 q 22 -18 42 4" strokeWidth="2.4" opacity="0.75" />
          <path d="M1042 196 q 16 -22 38 -10 q 22 -18 40 4" strokeWidth="2.6" opacity="0.6" />
          <path d="M604 88 q 14 -20 34 -8 q 18 -16 34 4" strokeWidth="2.2" opacity="0.5" />
        </g>
        <circle cx="770" cy="96" r="34" fill="#f2d9ae" opacity="0.6" />
      </Layer>
    </Canvas>
  );
}

/* ==========================================================================
   3. 月下竹影 —— 淡青纸底 + 右侧修竹 + 左侧淡影
   ========================================================================== */
function BambooScene() {
  // 三竿竹：x / 粗细 / 倾角，全部压在右侧 25% 内，左侧留给标题
  const stalks = [
    { x: 900, w: 11, lean: -7, opacity: 0.5 },
    { x: 986, w: 15, lean: 5, opacity: 0.66 },
    { x: 1064, w: 9, lean: -3, opacity: 0.42 },
  ];
  return (
    <Canvas background="linear-gradient(180deg, #f5f8f1 0%, #edf3e9 54%, #e3ebe0 100%)">
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(680px 400px at 80% 4%, rgba(255,255,255,0.9), transparent 62%),' +
            'radial-gradient(560px 340px at 0% 96%, rgba(190,208,196,0.4), transparent 66%)',
        }}
      />
      <Layer>
        {/* 月 */}
        <circle cx="686" cy="108" r="72" fill="#fffdf3" opacity="0.55" />
        <circle cx="686" cy="108" r="48" fill="#fdf8e8" opacity="0.95" />
        {/* 竹竿 */}
        {stalks.map((s) => (
          <g key={s.x} opacity={s.opacity}>
            <path
              d={`M${s.x} -10 L${s.x + s.lean} 470`}
              stroke="#4f6b58"
              strokeWidth={s.w}
              strokeLinecap="round"
            />
            {/* 竹节 */}
            {[70, 168, 266, 364].map((y) => (
              <path
                key={y}
                d={`M${s.x - s.w / 2 + s.lean * (y / 470)} ${y} l ${s.w + 3} ${s.lean * 0.02}`}
                stroke="#f5f8f1"
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.85"
              />
            ))}
            {/* 竹叶：几片旋转的椭圆，位置跟着竹竿倾角走 */}
            {[96, 168, 240, 312].map((y, i) => (
              <g key={y}>
                <ellipse
                  cx={s.x + s.lean * (y / 470) - 30 - i * 4}
                  cy={y}
                  rx="38"
                  ry="6"
                  fill="#4f6b58"
                  transform={`rotate(-26 ${s.x - 30} ${y})`}
                />
                <ellipse
                  cx={s.x + s.lean * (y / 470) - 18 - i * 2}
                  cy={y + 16}
                  rx="28"
                  ry="5"
                  fill="#4f6b58"
                  opacity="0.8"
                  transform={`rotate(8 ${s.x - 18} ${y + 16})`}
                />
                <ellipse
                  cx={s.x + s.lean * (y / 470) + 26 + i * 4}
                  cy={y + 24}
                  rx="34"
                  ry="5.5"
                  fill="#4f6b58"
                  opacity="0.85"
                  transform={`rotate(22 ${s.x + 26} ${y + 24})`}
                />
              </g>
            ))}
          </g>
        ))}
        {/* 左侧压一层极淡的竹影，让空白不那么空 */}
        <g opacity="0.09" stroke="#4f6b58" strokeWidth="7" strokeLinecap="round">
          <path d="M96 -10 L74 470" />
          <path d="M176 -10 L166 470" />
          {[150, 300].map((y) => (
            <ellipse key={y} cx="70" cy={y} rx="40" ry="6" fill="#4f6b58" stroke="none" />
          ))}
        </g>
      </Layer>
    </Canvas>
  );
}

/* ==========================================================================
   4. 星河夜幕 —— 深空交响 + 银河 + 流星
   ========================================================================== */
function StarfieldScene() {
  return (
    <Canvas background="radial-gradient(1200px 700px at 84% -18%, #24395f 0%, #0b1326 46%, #04070e 100%)">
      <Layer>
        <defs>
          <radialGradient id="hs-nebula-a" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4f7bd6" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#4f7bd6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hs-nebula-b" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9b6bd8" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#9b6bd8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hs-moon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dce8ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#dce8ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hs-meteor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="60%" stopColor="#cfe0ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* 星云两团 + 银河斜带：靠"低透明度大面积"堆出层次，不用滤镜 */}
        <ellipse cx="880" cy="60" rx="380" ry="220" fill="url(#hs-nebula-a)" />
        <ellipse cx="560" cy="230" rx="300" ry="170" fill="url(#hs-nebula-b)" />
        <path
          d="M-40 300 C 220 210 420 250 640 190 C 820 140 980 170 1240 96 L1240 150 C 980 224 820 196 640 244 C 420 304 220 266 -40 356 Z"
          fill="#8fa9e8"
          opacity="0.08"
        />
        <Stars count={110} />
        <Stars count={26} seed={500} opacity={0.55} />
        {/* 月 + 氛围光：放中偏右，避开右侧数据卡 */}
        <circle cx="764" cy="100" r="96" fill="url(#hs-moon)" />
        <circle cx="764" cy="100" r="36" fill="#e8f0ff" opacity="0.92" />
        {/* 流星两道 */}
        <path d="M712 96 L 806 42" stroke="url(#hs-meteor)" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M448 68 L 512 30"
          stroke="url(#hs-meteor)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* 地平线：给画面一个"底"，否则星星浮在半空 */}
        <path
          d="M0 460 L0 404 L172 372 L328 408 L520 366 L700 410 L880 370 L1060 408 L1200 380 L1200 460 Z"
          fill="#050912"
          opacity="0.92"
        />
      </Layer>
    </Canvas>
  );
}

/* ==========================================================================
   5. 科技矩阵 —— 透视网格 + 地平线辉光 + 数据流
   ========================================================================== */
function TechGridScene() {
  const horizon = 286;
  const vanishX = 620;
  // 透视竖线：从底边均匀取点，全部收敛到消失点
  const rays = Array.from({ length: 15 }, (_, i) => {
    const bottomX = -220 + i * 118;
    return { bottomX, i };
  });
  // 横向线：越靠近视平线越密（二次分布），近大远小的透视才像地面
  const rows = Array.from({ length: 11 }, (_, i) => horizon + Math.pow(i / 10, 1.9) * 190);

  return (
    <Canvas background="linear-gradient(180deg, #04070e 0%, #071427 52%, #04070d 100%)">
      <Layer>
        <defs>
          <linearGradient id="hs-tech-horizon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38d6ff" stopOpacity="0" />
            <stop offset="45%" stopColor="#5ec8ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7a7dff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hs-tech-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2f8dff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2f8dff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* 地平线上的光雾 */}
        <ellipse cx="620" cy={horizon} rx="520" ry="150" fill="url(#hs-tech-glow)" />
        <rect x="0" y={horizon - 1} width="1200" height="2.4" fill="url(#hs-tech-horizon)" />
        {/* 地面：透视网格 */}
        <g stroke="#4ea3ff" strokeWidth="1.1" opacity="0.24">
          {rays.map((r) => (
            <line key={r.i} x1={vanishX} y1={horizon} x2={r.bottomX} y2="480" />
          ))}
          {rows.map((y, i) => (
            <line key={i} x1="0" y1={y} x2="1200" y2={y} opacity={0.35 + i * 0.06} />
          ))}
        </g>
        {/* 天空：细密竖线（像数据柱/光纤），只在上半部分 */}
        <g stroke="#5ea9ff" strokeWidth="1" opacity="0.14">
          {Array.from({ length: 26 }, (_, i) => (
            <line key={i} x1={40 + i * 46} y1="0" x2={40 + i * 46} y2={horizon - 40} />
          ))}
        </g>
        <Stars count={34} seed={900} opacity={0.5} />
        {/* 数据流：三组上升的光点 */}
        <g fill="#7fe6ff">
          {[
            { x: 372, r: 2.6, o: 0.85 },
            { x: 378, r: 1.6, o: 0.5 },
            { x: 842, r: 2.2, o: 0.7 },
            { x: 848, r: 1.4, o: 0.4 },
            { x: 604, r: 3, o: 0.9 },
          ].map((p, i) => (
            <circle key={i} cx={p.x} cy={horizon - 20 - i * 6} r={p.r} opacity={p.o} />
          ))}
        </g>
      </Layer>
    </Canvas>
  );
}

/* ==========================================================================
   6. 极光山谷 —— 北地夜空 + 极光帷幕 + 山脊剪影
   ========================================================================== */
function AuroraScene() {
  return (
    <Canvas background="linear-gradient(180deg, #040b15 0%, #051521 54%, #03080e 100%)">
      <Layer>
        <defs>
          <linearGradient id="hs-aurora-a" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3ef0c0" stopOpacity="0" />
            <stop offset="42%" stopColor="#3ef0c0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8ef7d8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hs-aurora-b" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#6a5ce0" stopOpacity="0" />
            <stop offset="50%" stopColor="#7f6cf0" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#b39bff" stopOpacity="0" />
          </linearGradient>
          {/* 水平方向也淡出：否则每条极光都是一个左右带硬边的矩形，一眼假 */}
          <linearGradient id="hs-aurora-fade-x" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="18%" stopColor="#ffffff" />
            <stop offset="82%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          <mask
            id="hs-aurora-mask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1200"
            height="460"
          >
            <rect x="0" y="0" width="1200" height="460" fill="url(#hs-aurora-fade-x)" />
          </mask>
        </defs>
        <Stars count={70} seed={1200} />
        {/* 极光：三片旋转的软渐变，交错叠加才有"帷幕飘动"的层次 */}
        <g mask="url(#hs-aurora-mask)">
          <rect
            x="300"
            y="-160"
            width="150"
            height="440"
            fill="url(#hs-aurora-a)"
            transform="rotate(16 375 60)"
          />
          <rect
            x="600"
            y="-190"
            width="190"
            height="470"
            fill="url(#hs-aurora-a)"
            opacity="0.75"
            transform="rotate(11 695 45)"
          />
          <rect
            x="880"
            y="-150"
            width="150"
            height="420"
            fill="url(#hs-aurora-b)"
            transform="rotate(19 955 60)"
          />
        </g>
        {/* 山脊：两层，前景更黑 */}
        <path
          d="M0 428 L138 352 L262 402 L392 322 L520 400 L648 336 L790 402 L920 344 L1046 400 L1200 348 L1200 460 L0 460 Z"
          fill="#071826"
          opacity="0.9"
        />
        <path
          d="M0 460 L0 436 L188 396 L352 440 L520 400 L700 444 L876 404 L1050 442 L1200 408 L1200 460 Z"
          fill="#02060b"
        />
      </Layer>
    </Canvas>
  );
}

/* ==========================================================================
   注册表
   ========================================================================== */
export const HERO_SCENES: HeroScene[] = [
  {
    id: 'ink-mountain',
    name: '水墨远山',
    desc: '宣纸底 + 淡墨山峦，最像一本摊开的线装书',
    tone: 'light',
    swatch: 'linear-gradient(135deg, #f4f1e6 0%, #8b9a91 58%, #59695f 100%)',
    render: () => <InkMountainScene />,
  },
  {
    id: 'celadon',
    name: '青绿山水',
    desc: '青绿设色 + 泥金勾边，浓一点的古意',
    tone: 'light',
    swatch: 'linear-gradient(135deg, #edf7ef 0%, #8fb69c 58%, #4f7f66 100%)',
    render: () => <CeladonScene />,
  },
  {
    id: 'bamboo',
    name: '月下竹影',
    desc: '一竿修竹 + 淡月，安静不抢字',
    tone: 'light',
    swatch: 'linear-gradient(135deg, #f2f6ec 0%, #9bb493 58%, #4f6b58 100%)',
    render: () => <BambooScene />,
  },
  {
    id: 'starfield',
    name: '星河夜幕',
    desc: '银河横过天顶，深空里读书',
    tone: 'dark',
    swatch: 'linear-gradient(135deg, #4a6fae 0%, #16213c 58%, #060a12 100%)',
    render: () => <StarfieldScene />,
  },
  {
    id: 'tech',
    name: '科技矩阵',
    desc: '透视网格 + 地平线冷光，极客感',
    tone: 'dark',
    swatch: 'linear-gradient(135deg, #5cc3ff 0%, #14406b 58%, #05080f 100%)',
    render: () => <TechGridScene />,
  },
  {
    id: 'aurora',
    name: '极光山谷',
    desc: '极光帷幕垂在山脊后，冷冽辽阔',
    tone: 'dark',
    swatch: 'linear-gradient(135deg, #56f0c8 0%, #2f8f8a 50%, #4d3ea6 100%)',
    render: () => <AuroraScene />,
  },
];

export const DEFAULT_HERO_SCENE_ID = 'ink-mountain';

export function getHeroScene(id: string | undefined): HeroScene {
  return HERO_SCENES.find((scene) => scene.id === id) ?? HERO_SCENES[0];
}

/** Hero 背景层：场景组件自己就是 absolute inset:0，直接垫在内容下面即可 */
export function HeroSceneBackdrop({ scene }: { scene: HeroScene }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>{scene.render()}</div>
  );
}

/** 本地偏好键：首页背景与全局壁纸分开记忆，互不影响 */
export const HERO_SCENE_STORAGE_KEY = 'mybook:home-scene:v1';
