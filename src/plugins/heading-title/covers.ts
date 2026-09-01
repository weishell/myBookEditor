// 内置封面图片库
// 以 SVG data URL 的形式提供，无需外部依赖
export interface CoverItem {
  id: string;
  name: string;
  url: string;
  tags: string[];
}

const svgToDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

// Vue 绿色封面
const vueSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="vueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#42b883;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#35495e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#vueGrad)"/>
  <g transform="translate(600,200)" opacity="0.15">
    <polygon points="0,-120 104,60 -104,60" fill="#fff" stroke="#fff" stroke-width="8" fill-opacity="0"/>
    <polygon points="0,-60 52,30 -52,30" fill="#fff"/>
  </g>
  <text x="100" y="340" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#fff" opacity="0.9">Vue</text>
  <text x="100" y="380" font-family="Arial, sans-serif" font-size="20" fill="#fff" opacity="0.7">渐进式 JavaScript 框架</text>
</svg>`;

// React 蓝封面
const reactSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="reactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#282c34;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#61dafb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#reactGrad)"/>
  <g transform="translate(950,200)" opacity="0.2" stroke="#61dafb" stroke-width="3" fill="none">
    <ellipse cx="0" cy="0" rx="120" ry="40"/>
    <ellipse cx="0" cy="0" rx="120" ry="40" transform="rotate(60)"/>
    <ellipse cx="0" cy="0" rx="120" ry="40" transform="rotate(120)"/>
    <circle cx="0" cy="0" r="12" fill="#61dafb" stroke="none"/>
  </g>
  <text x="100" y="340" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#61dafb" opacity="0.95">React</text>
  <text x="100" y="380" font-family="Arial, sans-serif" font-size="20" fill="#fff" opacity="0.7">用于构建用户界面的 JavaScript 库</text>
</svg>`;

// Webpack 蓝封面
const webpackSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="wpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1c78c0;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8ed6fb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#wpGrad)"/>
  <g transform="translate(950,200)" opacity="0.2" stroke="#fff" stroke-width="2.5" fill="#8ed6fb">
    <polygon points="0,-100 87,-50 87,50 0,100 -87,50 -87,-50"/>
    <line x1="0" y1="-100" x2="0" y2="100"/>
    <line x1="-87" y1="-50" x2="87" y2="50"/>
    <line x1="87" y1="-50" x2="-87" y2="50"/>
  </g>
  <text x="100" y="340" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#fff" opacity="0.95">webpack</text>
  <text x="100" y="380" font-family="Arial, sans-serif" font-size="20" fill="#fff" opacity="0.75">静态模块打包器</text>
</svg>`;

// Vite 紫封面
const viteSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="viteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#41d1ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#bd34fe;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="viteLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffe983;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffae37;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#viteGrad)"/>
  <g transform="translate(950,210)" opacity="0.25">
    <polygon points="0,-120 14,-18 116,-18 28,44 62,146 0,84 -62,146 -28,44 -116,-18 -14,-18" fill="url(#viteLight)" stroke="#fff" stroke-width="2"/>
  </g>
  <text x="100" y="340" font-family="Arial, sans-serif" font-size="72" font-weight="bold" font-style="italic" fill="#fff" opacity="0.95">Vite</text>
  <text x="100" y="380" font-family="Arial, sans-serif" font-size="20" fill="#fff" opacity="0.8">下一代前端构建工具</text>
</svg>`;

// TypeScript 蓝封面
const tsSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="tsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#007acc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#235a97;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#tsGrad)"/>
  <g transform="translate(950,200)" opacity="0.2">
    <rect x="-80" y="-80" width="160" height="160" rx="18" fill="#fff"/>
    <text x="0" y="38" font-family="Arial, sans-serif" font-size="100" font-weight="bold" text-anchor="middle" fill="#007acc">TS</text>
  </g>
  <text x="100" y="340" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="#fff" opacity="0.95">TypeScript</text>
  <text x="100" y="380" font-family="Arial, sans-serif" font-size="20" fill="#fff" opacity="0.75">JavaScript 的超集</text>
</svg>`;

// Slate 编辑器封面
const slateSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="slateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#475569;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#slateGrad)"/>
  <g transform="translate(950,200)" opacity="0.2" stroke="#fff" stroke-width="3" fill="none">
    <rect x="-90" y="-70" width="180" height="140" rx="10"/>
    <line x1="-70" y1="-35" x2="70" y2="-35" stroke-width="6"/>
    <line x1="-70" y1="0" x2="50" y2="0"/>
    <line x1="-70" y1="35" x2="30" y2="35"/>
  </g>
  <text x="100" y="340" font-family="Georgia, serif" font-size="64" font-weight="bold" fill="#fff" opacity="0.95">MyBook</text>
  <text x="100" y="380" font-family="Arial, sans-serif" font-size="20" fill="#fff" opacity="0.7">富文本编辑器</text>
</svg>`;

// 简洁文档封面（米黄）
const docSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fef9e7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fde68a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#docGrad)"/>
  <g transform="translate(950,200)" opacity="0.25">
    <rect x="-70" y="-90" width="140" height="180" rx="8" fill="#fff" stroke="#d97706" stroke-width="3"/>
    <line x1="-50" y1="-55" x2="50" y2="-55" stroke="#d97706" stroke-width="4"/>
    <line x1="-50" y1="-20" x2="40" y2="-20" stroke="#d97706" stroke-width="3"/>
    <line x1="-50" y1="15" x2="30" y2="15" stroke="#d97706" stroke-width="3"/>
    <line x1="-50" y1="50" x2="20" y2="50" stroke="#d97706" stroke-width="3"/>
  </g>
  <text x="100" y="340" font-family="Georgia, serif" font-size="64" font-weight="bold" fill="#92400e" opacity="0.9">文档</text>
  <text x="100" y="380" font-family="Arial, sans-serif" font-size="20" fill="#a16207" opacity="0.8">记录 · 整理 · 分享</text>
</svg>`;

// 星空封面
const galaxySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <radialGradient id="galaxyGrad" cx="30%" cy="30%" r="80%">
      <stop offset="0%" style="stop-color:#1e1b4b;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#312e81;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f0a1f;stop-opacity:1" />
    </radialGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#galaxyGrad)"/>
  <g fill="#fff" opacity="0.8">
    <circle cx="100" cy="60" r="1.5"/>
    <circle cx="250" cy="120" r="1"/>
    <circle cx="380" cy="40" r="2"/>
    <circle cx="520" cy="180" r="1.2"/>
    <circle cx="680" cy="90" r="1"/>
    <circle cx="820" cy="220" r="1.8"/>
    <circle cx="960" cy="50" r="1.4"/>
    <circle cx="1100" cy="160" r="1"/>
    <circle cx="180" cy="280" r="1.2"/>
    <circle cx="460" cy="320" r="1"/>
    <circle cx="740" cy="330" r="1.6"/>
    <circle cx="1050" cy="300" r="1.1"/>
    <circle cx="600" cy="60" r="0.8"/>
  </g>
  <circle cx="900" cy="180" r="40" fill="#fff" opacity="0.08"/>
  <circle cx="900" cy="180" r="25" fill="#fff" opacity="0.1"/>
  <text x="100" y="340" font-family="Georgia, serif" font-size="64" font-weight="bold" fill="#c7d2fe" opacity="0.95">星空笔记</text>
  <text x="100" y="380" font-family="Arial, sans-serif" font-size="20" fill="#a5b4fc" opacity="0.8">记录每一个闪耀的灵感</text>
</svg>`;

// ===== 飞书风格封面 =====

// 飞书蓝 - 几何线条
const feishuBlueSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="fsBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3370FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4E83FD;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#fsBlue)"/>
  <g opacity="0.12" stroke="#fff" stroke-width="1.5" fill="none">
    <path d="M0,320 Q300,200 600,280 T1200,240"/>
    <path d="M0,280 Q300,160 600,240 T1200,200"/>
    <path d="M0,240 Q300,120 600,200 T1200,160"/>
  </g>
  <g opacity="0.2">
    <circle cx="950" cy="120" r="80" fill="#fff"/>
    <circle cx="950" cy="120" r="60" fill="none" stroke="#fff" stroke-width="2"/>
  </g>
  <rect x="80" y="330" width="220" height="4" rx="2" fill="#fff" opacity="0.5"/>
  <rect x="80" y="350" width="160" height="4" rx="2" fill="#fff" opacity="0.3"/>
</svg>`;

// 飞书紫 - 流动渐变
const feishuPurpleSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="fsPurple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#A855F7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#fsPurple)"/>
  <g opacity="0.15" fill="#fff">
    <circle cx="200" cy="80" r="120"/>
    <circle cx="400" cy="200" r="90"/>
    <circle cx="1050" cy="300" r="100"/>
    <circle cx="900" cy="100" r="60"/>
  </g>
  <g opacity="0.1" stroke="#fff" stroke-width="1" fill="none">
    <ellipse cx="600" cy="200" rx="500" ry="120"/>
    <ellipse cx="600" cy="200" rx="500" ry="80"/>
    <ellipse cx="600" cy="200" rx="500" ry="40"/>
  </g>
  <rect x="80" y="340" width="180" height="4" rx="2" fill="#fff" opacity="0.5"/>
  <rect x="80" y="360" width="120" height="4" rx="2" fill="#fff" opacity="0.3"/>
</svg>`;

// 飞书青 - 极简几何
const feishuTealSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="fsTeal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0D9488;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#14B8A6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#fsTeal)"/>
  <g opacity="0.1" fill="#fff">
    <rect x="700" y="50" width="200" height="200" rx="16" transform="rotate(15 800 150)"/>
    <rect x="850" y="100" width="120" height="120" rx="12" transform="rotate(-20 910 160)"/>
  </g>
  <g opacity="0.08" stroke="#fff" stroke-width="2" fill="none">
    <circle cx="900" cy="180" r="100"/>
    <circle cx="900" cy="180" r="70"/>
    <circle cx="900" cy="180" r="40"/>
  </g>
  <rect x="80" y="340" width="180" height="4" rx="2" fill="#fff" opacity="0.5"/>
  <rect x="80" y="360" width="140" height="4" rx="2" fill="#fff" opacity="0.3"/>
</svg>`;

// 飞书橙 - 活力渐变
const feishuOrangeSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="fsOrange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F97316;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FB923C;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#fsOrange)"/>
  <g opacity="0.15">
    <path d="M800,50 L1000,200 L900,350 L700,200 Z" fill="#fff"/>
  </g>
  <g opacity="0.1" stroke="#fff" stroke-width="2" fill="none">
    <path d="M800,50 L1000,200 L900,350 L700,200 Z"/>
  </g>
  <g opacity="0.2" fill="#fff">
    <polygon points="950,100 970,140 1010,140 980,165 990,210 950,185 910,210 920,165 890,140 930,140"/>
  </g>
  <rect x="80" y="340" width="180" height="4" rx="2" fill="#fff" opacity="0.5"/>
  <rect x="80" y="360" width="140" height="4" rx="2" fill="#fff" opacity="0.3"/>
</svg>`;

// 飞书粉 - 柔和渐变
const feishuPinkSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="fsPink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#EC4899;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F472B6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#fsPink)"/>
  <g opacity="0.12" fill="#fff">
    <circle cx="950" cy="100" r="8"/>
    <circle cx="1000" cy="150" r="12"/>
    <circle cx="920" cy="180" r="6"/>
    <circle cx="1050" cy="120" r="5"/>
    <circle cx="980" cy="250" r="10"/>
    <circle cx="930" cy="300" r="7"/>
    <circle cx="1020" cy="280" r="4"/>
  </g>
  <g opacity="0.1" stroke="#fff" stroke-width="1" fill="none">
    <path d="M850,80 Q950,120 900,200 Q850,280 950,320"/>
    <path d="M1000,60 Q1100,120 1050,200 Q1000,280 1100,320"/>
  </g>
  <rect x="80" y="340" width="180" height="4" rx="2" fill="#fff" opacity="0.5"/>
  <rect x="80" y="360" width="140" height="4" rx="2" fill="#fff" opacity="0.3"/>
</svg>`;

// 飞书灰 - 科技质感
const feishuDarkSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="fsDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1F2937;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#374151;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#fsDark)"/>
  <g opacity="0.15" stroke="#60A5FA" stroke-width="1" fill="none">
    <line x1="0" y1="100" x2="1200" y2="100"/>
    <line x1="0" y1="150" x2="1200" y2="150"/>
    <line x1="0" y1="200" x2="1200" y2="200"/>
    <line x1="0" y1="250" x2="1200" y2="250"/>
    <line x1="0" y1="300" x2="1200" y2="300"/>
  </g>
  <g opacity="0.2" fill="#60A5FA">
    <rect x="850" y="120" width="30" height="30" rx="4"/>
    <rect x="900" y="160" width="30" height="30" rx="4"/>
    <rect x="950" y="140" width="30" height="30" rx="4"/>
    <rect x="1000" y="180" width="30" height="30" rx="4"/>
    <rect x="920" y="200" width="30" height="30" rx="4"/>
    <rect x="970" y="220" width="30" height="30" rx="4"/>
  </g>
  <g opacity="0.3" fill="#22D3EE">
    <circle cx="1050" cy="100" r="3"/>
    <circle cx="1080" cy="130" r="2"/>
    <circle cx="1100" cy="80" r="2"/>
  </g>
  <rect x="80" y="340" width="180" height="4" rx="2" fill="#fff" opacity="0.4"/>
  <rect x="80" y="360" width="140" height="4" rx="2" fill="#fff" opacity="0.25"/>
</svg>`;

// 飞书绿 - 自然清新
const feishuGreenSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="fsGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#34D399;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#fsGreen)"/>
  <g opacity="0.12" stroke="#fff" stroke-width="1.5" fill="none">
    <path d="M0,350 Q200,250 400,300 Q600,350 800,250 Q1000,150 1200,200"/>
    <path d="M0,300 Q200,200 400,250 Q600,300 800,200 Q1000,100 1200,150"/>
  </g>
  <g opacity="0.15" fill="#fff">
    <circle cx="200" cy="80" r="4"/>
    <circle cx="350" cy="120" r="3"/>
    <circle cx="500" cy="70" r="5"/>
    <circle cx="700" cy="100" r="3"/>
    <circle cx="850" cy="60" r="4"/>
  </g>
  <g opacity="0.1" stroke="#fff" stroke-width="1" fill="none">
    <path d="M900,50 Q1050,100 1000,200 Q950,300 1100,350"/>
  </g>
  <rect x="80" y="340" width="180" height="4" rx="2" fill="#fff" opacity="0.5"/>
  <rect x="80" y="360" width="140" height="4" rx="2" fill="#fff" opacity="0.3"/>
</svg>`;

// 飞书彩虹 - 渐变多彩
const feishuRainbowSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="fsRb" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366F1;stop-opacity:1" />
      <stop offset="25%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#EC4899;stop-opacity:1" />
      <stop offset="75%" style="stop-color:#F97316;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EAB308;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#fsRb)"/>
  <g opacity="0.1" fill="#fff">
    <path d="M0,200 Q300,100 600,200 T1200,200 L1200,400 L0,400 Z"/>
    <path d="M0,250 Q300,150 600,250 T1200,250 L1200,400 L0,400 Z"/>
  </g>
  <g opacity="0.15" fill="#fff">
    <circle cx="150" cy="80" r="6"/>
    <circle cx="400" cy="100" r="4"/>
    <circle cx="650" cy="70" r="8"/>
    <circle cx="900" cy="110" r="5"/>
    <circle cx="1100" cy="60" r="7"/>
  </g>
  <rect x="80" y="340" width="180" height="4" rx="2" fill="#fff" opacity="0.5"/>
  <rect x="80" y="360" width="140" height="4" rx="2" fill="#fff" opacity="0.3"/>
</svg>`;

// ===== 童年动画主题（原创同人风格）=====

// 少年侦探 —— 通用侦探主题，原创设计
const youngDetectiveSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="ydSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a"/>
      <stop offset="60%" style="stop-color:#7c3aed"/>
      <stop offset="100%" style="stop-color:#f59e0b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#ydSky)"/>
  <!-- 城市天际线剪影 -->
  <g fill="#0f172a" opacity="0.85">
    <rect x="0" y="280" width="80" height="120"/>
    <rect x="80" y="240" width="60" height="160"/>
    <rect x="140" y="260" width="50" height="140"/>
    <rect x="190" y="220" width="70" height="180"/>
    <rect x="260" y="250" width="50" height="150"/>
    <rect x="950" y="240" width="60" height="160"/>
    <rect x="1010" y="270" width="50" height="130"/>
    <rect x="1060" y="220" width="70" height="180"/>
    <rect x="1130" y="250" width="70" height="150"/>
  </g>
  <!-- 窗户灯 -->
  <g fill="#fbbf24" opacity="0.7">
    <rect x="20" y="300" width="6" height="6"/>
    <rect x="50" y="320" width="6" height="6"/>
    <rect x="100" y="270" width="6" height="6"/>
    <rect x="220" y="250" width="6" height="6"/>
    <rect x="970" y="280" width="6" height="6"/>
    <rect x="1020" y="290" width="6" height="6"/>
    <rect x="1080" y="250" width="6" height="6"/>
    <rect x="1150" y="280" width="6" height="6"/>
  </g>
  <!-- 主角剪影（戴鸭舌帽 + 红色领结） -->
  <g transform="translate(380,180)">
    <!-- 头 -->
    <ellipse cx="0" cy="0" rx="38" ry="42" fill="#1e293b"/>
    <!-- 鸭舌帽 -->
    <path d="M-50,-20 Q-50,-50 0,-50 Q50,-50 50,-20 L60,-10 L-60,-10 Z" fill="#0f172a"/>
    <path d="M-65,-10 Q-50,-18 0,-18 Q50,-18 65,-10 L65,-5 L-65,-5 Z" fill="#0f172a"/>
    <!-- 红色领结 -->
    <polygon points="-12,55 -2,50 -2,70 -12,65" fill="#dc2626"/>
    <polygon points="12,55 2,50 2,70 12,65" fill="#dc2626"/>
    <rect x="-3" y="55" width="6" height="10" fill="#b91c1c"/>
    <!-- 身体 -->
    <path d="M-40,80 Q-45,140 -30,200 L30,200 Q45,140 40,80 Z" fill="#1e3a8a"/>
  </g>
  <!-- 大放大镜 -->
  <g transform="translate(820,200)">
    <circle cx="0" cy="0" r="75" fill="none" stroke="#fef3c7" stroke-width="10" opacity="0.9"/>
    <circle cx="0" cy="0" r="75" fill="#fef9c3" opacity="0.12"/>
    <line x1="55" y1="55" x2="110" y2="110" stroke="#fef3c7" stroke-width="14" stroke-linecap="round"/>
    <!-- 放大镜内高光 -->
    <ellipse cx="-25" cy="-25" rx="20" ry="12" fill="#fff" opacity="0.3" transform="rotate(-30)"/>
  </g>
  <!-- 脚印轨迹（线索） -->
  <g fill="#fbbf24" opacity="0.5">
    <ellipse cx="500" cy="370" rx="8" ry="4"/>
    <ellipse cx="560" cy="365" rx="8" ry="4"/>
    <ellipse cx="620" cy="370" rx="8" ry="4"/>
    <ellipse cx="680" cy="360" rx="8" ry="4"/>
    <ellipse cx="740" cy="365" rx="8" ry="4"/>
  </g>
  <rect x="80" y="40" width="180" height="4" rx="2" fill="#fff" opacity="0.5"/>
  <text x="80" y="80" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#fef3c7" opacity="0.95">少年侦探</text>
  <text x="80" y="105" font-family="Arial, sans-serif" font-size="14" fill="#fef3c7" opacity="0.7">真相只有一个</text>
</svg>`;

// 猫鼠追逐 —— 通用追逐主题，原创设计
const catMouseSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="cmBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fef3c7"/>
      <stop offset="100%" style="stop-color:#fbbf24"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#cmBg)"/>
  <!-- 厨房墙壁格子 -->
  <g stroke="#92400e" stroke-width="2" opacity="0.15" fill="none">
    <line x1="0" y1="100" x2="1200" y2="100"/>
    <line x1="0" y1="200" x2="1200" y2="200"/>
    <line x1="0" y1="300" x2="1200" y2="300"/>
    <line x1="150" y1="0" x2="150" y2="400"/>
    <line x1="300" y1="0" x2="300" y2="400"/>
    <line x1="450" y1="0" x2="450" y2="400"/>
    <line x1="600" y1="0" x2="600" y2="400"/>
    <line x1="750" y1="0" x2="750" y2="400"/>
    <line x1="900" y1="0" x2="900" y2="400"/>
    <line x1="1050" y1="0" x2="1050" y2="400"/>
  </g>
  <!-- 鼠洞 -->
  <ellipse cx="1050" cy="340" rx="50" ry="20" fill="#451a03"/>
  <ellipse cx="1050" cy="335" rx="40" ry="12" fill="#78350f"/>
  <!-- 奶酪 -->
  <g transform="translate(900,300)">
    <polygon points="0,0 60,0 50,40 -10,40" fill="#fbbf24" stroke="#92400e" stroke-width="2"/>
    <circle cx="10" cy="15" r="4" fill="#92400e"/>
    <circle cx="30" cy="10" r="3" fill="#92400e"/>
    <circle cx="45" cy="20" r="4" fill="#92400e"/>
    <circle cx="20" cy="28" r="3" fill="#92400e"/>
  </g>
  <!-- 老鼠（逃） -->
  <g transform="translate(820,320)">
    <ellipse cx="0" cy="0" rx="28" ry="20" fill="#94a3b8"/>
    <circle cx="-22" cy="-10" r="14" fill="#94a3b8"/>
    <circle cx="-28" cy="-12" r="3" fill="#0f172a"/>
    <circle cx="-26" cy="-15" r="1" fill="#fff"/>
    <ellipse cx="-30" cy="-5" rx="6" ry="4" fill="#fda4af"/>
    <!-- 耳朵 -->
    <ellipse cx="-25" cy="-22" rx="6" ry="8" fill="#94a3b8"/>
    <ellipse cx="-18" cy="-22" rx="6" ry="8" fill="#94a3b8"/>
    <!-- 尾巴 -->
    <path d="M25,0 Q45,-15 50,5 Q52,15 45,20" stroke="#94a3b8" stroke-width="3" fill="none"/>
    <!-- 跑步姿态 -->
    <line x1="-10" y1="18" x2="-15" y2="32" stroke="#0f172a" stroke-width="3"/>
    <line x1="10" y1="18" x2="15" y2="32" stroke="#0f172a" stroke-width="3"/>
  </g>
  <!-- 速度线 -->
  <g stroke="#92400e" stroke-width="3" opacity="0.4" fill="none">
    <line x1="680" y1="310" x2="760" y2="310"/>
    <line x1="700" y1="330" x2="770" y2="330"/>
    <line x1="690" y1="350" x2="750" y2="350"/>
  </g>
  <!-- 猫（追） -->
  <g transform="translate(480,280)">
    <!-- 身体 -->
    <ellipse cx="0" cy="20" rx="60" ry="40" fill="#475569"/>
    <!-- 头 -->
    <circle cx="50" cy="-5" r="35" fill="#475569"/>
    <!-- 耳朵 -->
    <polygon points="30,-30 38,-50 48,-32" fill="#475569"/>
    <polygon points="55,-32 65,-52 72,-30" fill="#475569"/>
    <polygon points="33,-32 38,-45 44,-34" fill="#fda4af"/>
    <polygon points="58,-34 65,-48 70,-32" fill="#fda4af"/>
    <!-- 眼睛 -->
    <ellipse cx="40" cy="-8" rx="6" ry="10" fill="#fbbf24"/>
    <ellipse cx="40" cy="-6" rx="2" ry="8" fill="#0f172a"/>
    <ellipse cx="60" cy="-8" rx="6" ry="10" fill="#fbbf24"/>
    <ellipse cx="60" cy="-6" rx="2" ry="8" fill="#0f172a"/>
    <!-- 鼻子嘴 -->
    <polygon points="50,2 46,8 54,8" fill="#fda4af"/>
    <path d="M50,8 Q45,14 40,12 M50,8 Q55,14 60,12" stroke="#0f172a" stroke-width="2" fill="none"/>
    <!-- 胡须 -->
    <line x1="25" y1="0" x2="5" y2="-3" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="25" y1="5" x2="5" y2="5" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="75" y1="0" x2="95" y2="-3" stroke="#0f172a" stroke-width="1.5"/>
    <line x1="75" y1="5" x2="95" y2="5" stroke="#0f172a" stroke-width="1.5"/>
    <!-- 腿（跑） -->
    <ellipse cx="-35" cy="55" rx="12" ry="20" fill="#475569" transform="rotate(-20)"/>
    <ellipse cx="-10" cy="60" rx="12" ry="20" fill="#475569" transform="rotate(15)"/>
    <ellipse cx="20" cy="55" rx="12" ry="20" fill="#475569" transform="rotate(-10)"/>
    <ellipse cx="45" cy="60" rx="12" ry="20" fill="#475569" transform="rotate(20)"/>
    <!-- 尾巴 -->
    <path d="M-55,15 Q-90,0 -95,30 Q-95,50 -75,55" stroke="#475569" stroke-width="14" fill="none" stroke-linecap="round"/>
  </g>
  <text x="80" y="60" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#7c2d12" opacity="0.9">猫鼠追逐</text>
  <text x="80" y="90" font-family="Arial, sans-serif" font-size="16" fill="#7c2d12" opacity="0.7">永不停歇的厨房大战</text>
</svg>`;

// 数码萌兽 —— 像素风数码生物，原创设计
const digiCreatureSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="dcBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0c0a1f"/>
      <stop offset="100%" style="stop-color:#1e1b4b"/>
    </linearGradient>
    <radialGradient id="dcGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#22d3ee;stop-opacity:0.5"/>
      <stop offset="100%" style="stop-color:#22d3ee;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#dcBg)"/>
  <!-- 数字网格 -->
  <g stroke="#22d3ee" stroke-width="1" opacity="0.15" fill="none">
    <path d="M0,100 L1200,100 M0,200 L1200,200 M0,300 L1200,300"/>
    <path d="M200,0 L200,400 M400,0 L400,400 M600,0 L600,400 M800,0 L800,400 M1000,0 L1000,400"/>
  </g>
  <!-- 飘浮数字粒子 -->
  <g fill="#22d3ee" opacity="0.6" font-family="monospace" font-size="14">
    <text x="100" y="80">01</text>
    <text x="180" y="50">10</text>
    <text x="280" y="100">11</text>
    <text x="380" y="60">00</text>
    <text x="900" y="70">10</text>
    <text x="1000" y="120">01</text>
    <text x="1100" y="80">11</text>
    <text x="150" y="340">00</text>
    <text x="350" y="350">10</text>
    <text x="950" y="360">11</text>
  </g>
  <!-- 进化光环 -->
  <circle cx="600" cy="200" r="180" fill="url(#dcGlow)"/>
  <circle cx="600" cy="200" r="140" fill="none" stroke="#22d3ee" stroke-width="2" opacity="0.4" stroke-dasharray="8 4"/>
  <circle cx="600" cy="200" r="160" fill="none" stroke="#a78bfa" stroke-width="1.5" opacity="0.3" stroke-dasharray="4 6"/>
  <!-- 像素蛋（裂开） -->
  <g transform="translate(600,210)">
    <!-- 蛋主体 -->
    <ellipse cx="0" cy="20" rx="90" ry="110" fill="#fff"/>
    <ellipse cx="0" cy="20" rx="90" ry="110" fill="url(#dcGlow)" opacity="0.3"/>
    <!-- 像素格子 -->
    <g fill="#fef3c7" opacity="0.4">
      <rect x="-60" y="-50" width="20" height="20"/>
      <rect x="-20" y="-30" width="20" height="20"/>
      <rect x="20" y="-50" width="20" height="20"/>
      <rect x="40" y="0" width="20" height="20"/>
      <rect x="-40" y="30" width="20" height="20"/>
      <rect x="0" y="60" width="20" height="20"/>
    </g>
    <!-- 裂痕 -->
    <path d="M-20,-60 L0,-20 L-30,0 L10,30 L-20,60 L0,100" stroke="#0c0a1f" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- 破壳而出的萌兽剪影 -->
    <g transform="translate(0,-10)">
      <ellipse cx="0" cy="0" rx="35" ry="30" fill="#22d3ee"/>
      <!-- 耳朵 -->
      <polygon points="-25,-20 -15,-40 -5,-22" fill="#22d3ee"/>
      <polygon points="25,-20 15,-40 5,-22" fill="#22d3ee"/>
      <!-- 眼睛 -->
      <circle cx="-12" cy="-5" r="4" fill="#0c0a1f"/>
      <circle cx="12" cy="-5" r="4" fill="#0c0a1f"/>
      <circle cx="-11" cy="-6" r="1.5" fill="#fff"/>
      <circle cx="13" cy="-6" r="1.5" fill="#fff"/>
      <!-- 嘴 -->
      <path d="M-5,8 Q0,12 5,8" stroke="#0c0a1f" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
  </g>
  <!-- 进化箭头 -->
  <g fill="#fbbf24" opacity="0.8">
    <polygon points="780,200 810,190 810,210"/>
    <polygon points="830,200 860,190 860,210"/>
  </g>
  <text x="80" y="60" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#22d3ee" opacity="0.95">数码萌兽</text>
  <text x="80" y="92" font-family="Arial, sans-serif" font-size="16" fill="#a78bfa" opacity="0.8">像素世界的伙伴</text>
</svg>`;

// 机械伙伴 —— 通用机器人主题，原创设计（白橙配色，区别于任何官方形象）
const robotBuddySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="rbBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fef3c7"/>
      <stop offset="100%" style="stop-color:#fed7aa"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#rbBg)"/>
  <!-- 云朵 -->
  <g fill="#fff" opacity="0.7">
    <ellipse cx="150" cy="80" rx="50" ry="20"/>
    <ellipse cx="180" cy="70" rx="30" ry="15"/>
    <ellipse cx="900" cy="100" rx="60" ry="22"/>
    <ellipse cx="940" cy="90" rx="35" ry="16"/>
    <ellipse cx="1050" cy="60" rx="40" ry="15"/>
  </g>
  <!-- 地面 -->
  <path d="M0,340 Q600,310 1200,340 L1200,400 L0,400 Z" fill="#fb923c" opacity="0.4"/>
  <!-- 主角：白橙机器人 -->
  <g transform="translate(550,200)">
    <!-- 头顶天线 -->
    <line x1="0" y1="-130" x2="0" y2="-105" stroke="#475569" stroke-width="4"/>
    <circle cx="0" cy="-135" r="8" fill="#f97316"/>
    <!-- 头（圆角方） -->
    <rect x="-70" y="-100" width="140" height="100" rx="20" fill="#fff" stroke="#475569" stroke-width="3"/>
    <!-- 屏幕脸 -->
    <rect x="-50" y="-80" width="100" height="60" rx="10" fill="#1e293b"/>
    <!-- 眼睛（圆形，友好） -->
    <circle cx="-22" cy="-50" r="14" fill="#22d3ee"/>
    <circle cx="22" cy="-50" r="14" fill="#22d3ee"/>
    <circle cx="-19" cy="-53" r="4" fill="#fff"/>
    <circle cx="25" cy="-53" r="4" fill="#fff"/>
    <!-- 笑脸嘴 -->
    <path d="M-15,-30 Q0,-20 15,-30" stroke="#22d3ee" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- 脸颊红晕 -->
    <circle cx="-45" cy="-40" r="6" fill="#fb7185" opacity="0.6"/>
    <circle cx="45" cy="-40" r="6" fill="#fb7185" opacity="0.6"/>
    <!-- 身体 -->
    <rect x="-85" y="0" width="170" height="120" rx="25" fill="#fff" stroke="#475569" stroke-width="3"/>
    <!-- 身体口袋 -->
    <rect x="-30" y="40" width="60" height="60" rx="8" fill="#f97316" stroke="#475569" stroke-width="2"/>
    <circle cx="0" cy="70" r="4" fill="#fff"/>
    <!-- 手臂 -->
    <rect x="-115" y="20" width="30" height="80" rx="15" fill="#fff" stroke="#475569" stroke-width="3"/>
    <rect x="85" y="20" width="30" height="80" rx="15" fill="#fff" stroke="#475569" stroke-width="3"/>
    <!-- 脚 -->
    <ellipse cx="-40" cy="135" rx="30" ry="15" fill="#475569"/>
    <ellipse cx="40" cy="135" rx="30" ry="15" fill="#475569"/>
  </g>
  <!-- 道具：发光星星/齿轮飘浮 -->
  <g fill="#fbbf24" opacity="0.9">
    <polygon points="250,150 256,168 274,168 260,178 266,196 250,184 234,196 240,178 226,168 244,168" transform="scale(0.8) translate(80,30)"/>
    <polygon points="900,140 906,158 924,158 910,168 916,186 900,174 884,186 890,168 876,158 894,158"/>
  </g>
  <text x="80" y="60" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#9a3412" opacity="0.95">机械伙伴</text>
  <text x="80" y="92" font-family="Arial, sans-serif" font-size="16" fill="#9a3412" opacity="0.7">来自未来的好朋友</text>
</svg>`;

// 忍者神龟 —— 通用忍者主题，原创设计
const ninjaTurtleSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="ntBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#064e3b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#ntBg)"/>
  <!-- 下水道砖墙 -->
  <g fill="#475569" opacity="0.4">
    <rect x="0" y="280" width="1200" height="120"/>
  </g>
  <g stroke="#1e293b" stroke-width="2" opacity="0.6">
    <line x1="0" y1="320" x2="1200" y2="320"/>
    <line x1="0" y1="360" x2="1200" y2="360"/>
    <line x1="100" y1="280" x2="100" y2="320"/>
    <line x1="250" y1="280" x2="250" y2="320"/>
    <line x1="400" y1="280" x2="400" y2="320"/>
    <line x1="550" y1="280" x2="550" y2="320"/>
    <line x1="700" y1="280" x2="700" y2="320"/>
    <line x1="850" y1="280" x2="850" y2="320"/>
    <line x1="1000" y1="280" x2="1000" y2="320"/>
    <line x1="1150" y1="280" x2="1150" y2="320"/>
    <line x1="150" y1="320" x2="150" y2="360"/>
    <line x1="300" y1="320" x2="300" y2="360"/>
    <line x1="450" y1="320" x2="450" y2="360"/>
    <line x1="600" y1="320" x2="600" y2="360"/>
    <line x1="750" y1="320" x2="750" y2="360"/>
    <line x1="900" y1="320" x2="900" y2="360"/>
    <line x1="1050" y1="320" x2="1050" y2="360"/>
  </g>
  <!-- 月光 -->
  <circle cx="950" cy="100" r="50" fill="#fef3c7" opacity="0.9"/>
  <circle cx="950" cy="100" r="65" fill="#fef3c7" opacity="0.2"/>
  <!-- 主角：忍者龟 -->
  <g transform="translate(500,210)">
    <!-- 龟壳 -->
    <ellipse cx="0" cy="0" rx="100" ry="75" fill="#16a34a"/>
    <ellipse cx="0" cy="0" rx="100" ry="75" fill="none" stroke="#14532d" stroke-width="3"/>
    <!-- 壳纹 -->
    <ellipse cx="0" cy="0" rx="60" ry="45" fill="none" stroke="#14532d" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="30" ry="22" fill="none" stroke="#14532d" stroke-width="2"/>
    <!-- 头 -->
    <ellipse cx="0" cy="-95" rx="40" ry="35" fill="#22c55e"/>
    <!-- 红色眼罩（面具） -->
    <path d="M-50,-105 L-40,-95 L-40,-90 L-15,-85 L15,-85 L40,-90 L40,-95 L50,-105 L40,-100 L-40,-100 Z" fill="#dc2626"/>
    <path d="M-50,-105 L-70,-95 L-65,-100 Z" fill="#dc2626"/>
    <path d="M50,-105 L70,-95 L65,-100 Z" fill="#dc2626"/>
    <!-- 眼睛（眼罩下） -->
    <ellipse cx="-15" cy="-92" rx="7" ry="5" fill="#fff"/>
    <ellipse cx="15" cy="-92" rx="7" ry="5" fill="#fff"/>
    <circle cx="-15" cy="-92" r="3" fill="#0f172a"/>
    <circle cx="15" cy="-92" r="3" fill="#0f172a"/>
    <!-- 嘴 -->
    <path d="M-8,-78 Q0,-72 8,-78" stroke="#0f172a" stroke-width="2" fill="none"/>
    <!-- 腿 -->
    <ellipse cx="-65" cy="60" rx="20" ry="15" fill="#22c55e"/>
    <ellipse cx="65" cy="60" rx="20" ry="15" fill="#22c55e"/>
    <!-- 脚 -->
    <ellipse cx="-70" cy="75" rx="22" ry="8" fill="#16a34a"/>
    <ellipse cx="70" cy="75" rx="22" ry="8" fill="#16a34a"/>
  </g>
  <!-- 双截棍 -->
  <g transform="translate(750,180)">
    <rect x="0" y="-3" width="80" height="6" fill="#78350f" rx="3"/>
    <rect x="0" y="-3" width="80" height="6" fill="none" stroke="#451a03" stroke-width="1" rx="3"/>
    <rect x="80" y="-3" width="20" height="6" fill="#451a03" rx="2"/>
    <rect x="-3" y="-3" width="6" height="6" fill="#451a03" rx="2"/>
    <line x1="80" y1="0" x2="120" y2="50" stroke="#78350f" stroke-width="4"/>
    <rect x="115" y="48" width="20" height="6" fill="#451a03" rx="2"/>
  </g>
  <!-- 井盖 -->
  <g transform="translate(150,360)">
    <ellipse cx="0" cy="0" rx="60" ry="15" fill="#1e293b"/>
    <ellipse cx="0" cy="-3" rx="50" ry="10" fill="#334155"/>
    <text x="-15" y="0" font-family="monospace" font-size="10" fill="#0f172a">SEWER</text>
  </g>
  <text x="80" y="60" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#86efac" opacity="0.95">忍者神龟</text>
  <text x="80" y="92" font-family="Arial, sans-serif" font-size="16" fill="#86efac" opacity="0.7">下水道里的正义</text>
</svg>`;

// ===== 游戏世界主题（原创同人风格）=====

// 像素坦克 —— 通用 FC 像素坦克主题，原创设计
const pixelTankSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" shape-rendering="crispEdges">
  <defs>
    <linearGradient id="ptBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1e293b"/>
      <stop offset="50%" style="stop-color:#334155"/>
      <stop offset="100%" style="stop-color:#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#ptBg)"/>
  <!-- 像素星空 -->
  <g fill="#fff" opacity="0.6">
    <rect x="50" y="40" width="4" height="4"/>
    <rect x="150" y="80" width="4" height="4"/>
    <rect x="300" y="50" width="4" height="4"/>
    <rect x="500" y="30" width="4" height="4"/>
    <rect x="800" y="60" width="4" height="4"/>
    <rect x="1000" y="40" width="4" height="4"/>
    <rect x="1100" y="80" width="4" height="4"/>
    <rect x="200" y="100" width="4" height="4"/>
    <rect x="700" y="90" width="4" height="4"/>
  </g>
  <!-- 月亮 -->
  <rect x="1000" y="60" width="60" height="60" fill="#fef3c7"/>
  <rect x="1020" y="60" width="40" height="20" fill="#0f172a"/>
  <rect x="1020" y="100" width="40" height="20" fill="#0f172a"/>
  <rect x="1000" y="100" width="20" height="20" fill="#0f172a"/>
  <!-- 砖墙（左） -->
  <g fill="#92400e">
    <rect x="100" y="280" width="40" height="20"/>
    <rect x="140" y="280" width="40" height="20"/>
    <rect x="180" y="280" width="40" height="20"/>
    <rect x="120" y="300" width="40" height="20"/>
    <rect x="160" y="300" width="40" height="20"/>
    <rect x="200" y="300" width="40" height="20"/>
  </g>
  <g fill="#78350f">
    <rect x="100" y="280" width="40" height="2"/>
    <rect x="140" y="280" width="40" height="2"/>
    <rect x="180" y="280" width="40" height="2"/>
    <rect x="120" y="300" width="40" height="2"/>
    <rect x="160" y="300" width="40" height="2"/>
    <rect x="200" y="300" width="40" height="2"/>
  </g>
  <!-- 钢墙（右） -->
  <g fill="#dc2626">
    <rect x="800" y="260" width="40" height="40"/>
    <rect x="840" y="260" width="40" height="40"/>
    <rect x="880" y="260" width="40" height="40"/>
  </g>
  <g fill="#fbbf24">
    <rect x="810" y="270" width="20" height="20"/>
    <rect x="850" y="270" width="20" height="20"/>
    <rect x="890" y="270" width="20" height="20"/>
  </g>
  <!-- 玩家坦克（绿色） -->
  <g transform="translate(400,260)">
    <!-- 履带 -->
    <rect x="-30" y="20" width="60" height="20" fill="#15803d"/>
    <g fill="#052e16">
      <rect x="-30" y="20" width="60" height="4"/>
      <rect x="-30" y="36" width="60" height="4"/>
      <rect x="-26" y="20" width="6" height="20"/>
      <rect x="-12" y="20" width="6" height="20"/>
      <rect x="2" y="20" width="6" height="20"/>
      <rect x="16" y="20" width="6" height="20"/>
    </g>
    <!-- 车身 -->
    <rect x="-22" y="0" width="44" height="22" fill="#22c55e"/>
    <rect x="-22" y="0" width="44" height="3" fill="#86efac"/>
    <!-- 炮塔 -->
    <rect x="-14" y="-12" width="28" height="14" fill="#22c55e"/>
    <rect x="-14" y="-12" width="28" height="3" fill="#86efac"/>
    <!-- 炮管 -->
    <rect x="-2" y="-32" width="4" height="22" fill="#22c55e"/>
  </g>
  <!-- 敌方坦克（深灰） -->
  <g transform="translate(700,260)">
    <rect x="-25" y="20" width="50" height="20" fill="#475569"/>
    <g fill="#1e293b">
      <rect x="-25" y="20" width="50" height="4"/>
      <rect x="-25" y="36" width="50" height="4"/>
    </g>
    <rect x="-18" y="0" width="36" height="22" fill="#64748b"/>
    <rect x="-12" y="-10" width="24" height="12" fill="#64748b"/>
    <rect x="-2" y="-28" width="4" height="20" fill="#64748b"/>
  </g>
  <!-- 子弹轨迹 -->
  <g fill="#fbbf24">
    <rect x="430" y="220" width="6" height="6"/>
    <rect x="470" y="225" width="6" height="6"/>
    <rect x="510" y="220" width="6" height="6"/>
    <rect x="550" y="225" width="6" height="6"/>
    <rect x="590" y="220" width="6" height="6"/>
    <rect x="630" y="225" width="6" height="6"/>
  </g>
  <!-- 鹰基地（右上小） -->
  <g transform="translate(1050,300)">
    <rect x="-20" y="0" width="40" height="20" fill="#1e293b"/>
    <polygon points="0,-15 -15,0 15,0" fill="#fbbf24"/>
    <polygon points="0,-10 -8,-2 8,-2" fill="#dc2626"/>
  </g>
  <text x="80" y="60" font-family="monospace" font-size="36" font-weight="bold" fill="#86efac" opacity="0.95">像素坦克</text>
  <text x="80" y="92" font-family="monospace" font-size="14" fill="#86efac" opacity="0.7">1990 · 8-BIT</text>
</svg>`;

// 召唤峡谷 —— 通用 MOBA 主题，原创设计
const summonRiftSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="srBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1e1b4b"/>
      <stop offset="50%" style="stop-color:#4c1d95"/>
      <stop offset="100%" style="stop-color:#0f172a"/>
    </linearGradient>
    <radialGradient id="srGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:0.4"/>
      <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#srBg)"/>
  <circle cx="600" cy="200" r="200" fill="url(#srGlow)"/>
  <!-- 法阵 -->
  <g transform="translate(600,200)">
    <circle cx="0" cy="0" r="140" fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.4" stroke-dasharray="6 4"/>
    <circle cx="0" cy="0" r="110" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.5" stroke-dasharray="3 3"/>
    <circle cx="0" cy="0" r="80" fill="none" stroke="#22d3ee" stroke-width="1" opacity="0.6"/>
    <!-- 法阵符文 -->
    <g fill="#a78bfa" opacity="0.6">
      <polygon points="0,-140 5,-128 -5,-128"/>
      <polygon points="99,99 92,89 105,93"/>
      <polygon points="-99,99 -105,93 -92,89"/>
      <polygon points="0,140 5,128 -5,128"/>
    </g>
  </g>
  <!-- 剑盾交叉（中央） -->
  <g transform="translate(600,200)">
    <!-- 剑 -->
    <g transform="rotate(45)">
      <rect x="-3" y="-80" width="6" height="100" fill="#cbd5e1"/>
      <polygon points="0,-90 -5,-75 5,-75" fill="#fbbf24"/>
      <rect x="-15" y="20" width="30" height="8" fill="#fbbf24" rx="2"/>
    </g>
    <!-- 盾 -->
    <g transform="rotate(-45)">
      <path d="M-30,-40 L30,-40 L30,30 Q30,50 0,60 Q-30,50 -30,30 Z" fill="#dc2626" stroke="#fbbf24" stroke-width="2"/>
      <path d="M-15,-20 L15,-20 L15,10 L0,25 L-15,10 Z" fill="#fbbf24"/>
    </g>
  </g>
  <!-- 左侧基地（蓝方） -->
  <g transform="translate(120,200)">
    <rect x="-40" y="-40" width="80" height="80" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/>
    <polygon points="0,-25 -15,0 15,0" fill="#60a5fa"/>
    <rect x="-12" y="0" width="24" height="35" fill="#60a5fa"/>
  </g>
  <!-- 右侧基地（红方） -->
  <g transform="translate(1080,200)">
    <rect x="-40" y="-40" width="80" height="80" fill="#7f1d1d" stroke="#dc2626" stroke-width="2"/>
    <polygon points="0,-25 -15,0 15,0" fill="#f87171"/>
    <rect x="-12" y="0" width="24" height="35" fill="#f87171"/>
  </g>
  <!-- 能量连线 -->
  <g stroke="#a78bfa" stroke-width="1" opacity="0.3" stroke-dasharray="2 4">
    <line x1="160" y1="200" x2="1040" y2="200"/>
  </g>
  <!-- 飞舞符文 -->
  <g fill="#fbbf24" opacity="0.8">
    <circle cx="300" cy="100" r="3"/>
    <circle cx="500" cy="80" r="2"/>
    <circle cx="800" cy="100" r="3"/>
    <circle cx="900" cy="320" r="2"/>
    <circle cx="400" cy="320" r="3"/>
  </g>
  <text x="80" y="60" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#a78bfa" opacity="0.95">召唤峡谷</text>
  <text x="80" y="92" font-family="Arial, sans-serif" font-size="16" fill="#fbbf24" opacity="0.8">团队荣耀之战</text>
</svg>`;

// 像素冒险 —— 通用 2D 横版冒险主题，原创设计
const pixelAdventureSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" shape-rendering="crispEdges">
  <defs>
    <linearGradient id="paSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#93c5fd"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="280" fill="url(#paSky)"/>
  <rect y="280" width="1200" height="120" fill="#92400e"/>
  <!-- 远山 -->
  <polygon points="0,280 150,200 300,280" fill="#15803d" opacity="0.6"/>
  <polygon points="200,280 400,180 600,280" fill="#15803d" opacity="0.5"/>
  <polygon points="500,280 700,200 900,280" fill="#15803d" opacity="0.6"/>
  <polygon points="800,280 1000,180 1200,280" fill="#15803d" opacity="0.5"/>
  <!-- 云 -->
  <g fill="#fff" opacity="0.9">
    <rect x="100" y="60" width="60" height="20"/>
    <rect x="120" y="50" width="20" height="10"/>
    <rect x="600" y="40" width="50" height="20"/>
    <rect x="980" y="80" width="60" height="20"/>
  </g>
  <!-- 砖块平台 -->
  <g fill="#dc2626">
    <rect x="150" y="220" width="40" height="40"/>
    <rect x="190" y="220" width="40" height="40"/>
    <rect x="230" y="220" width="40" height="40"/>
  </g>
  <g fill="#fbbf24">
    <rect x="190" y="220" width="40" height="40"/>
    <text x="200" y="248" font-family="monospace" font-size="20" font-weight="bold" fill="#dc2626">?</text>
  </g>
  <g fill="#dc2626">
    <rect x="450" y="200" width="40" height="40"/>
    <rect x="490" y="200" width="40" height="40"/>
    <rect x="530" y="200" width="40" height="40"/>
  </g>
  <!-- 蘑菇 -->
  <g transform="translate(550,260)">
    <ellipse cx="0" cy="0" rx="20" ry="12" fill="#dc2626"/>
    <rect x="-6" y="0" width="12" height="20" fill="#fef3c7"/>
    <circle cx="-8" cy="-3" r="3" fill="#fff"/>
    <circle cx="6" cy="-5" r="3" fill="#fff"/>
  </g>
  <!-- 金币 -->
  <g transform="translate(300,180)">
    <circle cx="0" cy="0" r="12" fill="#fbbf24" stroke="#92400e" stroke-width="2"/>
    <text x="-4" y="5" font-family="serif" font-size="14" font-weight="bold" fill="#92400e">$</text>
  </g>
  <g transform="translate(700,180)">
    <circle cx="0" cy="0" r="12" fill="#fbbf24" stroke="#92400e" stroke-width="2"/>
    <text x="-4" y="5" font-family="serif" font-size="14" font-weight="bold" fill="#92400e">$</text>
  </g>
  <g transform="translate(900,250)">
    <circle cx="0" cy="0" r="12" fill="#fbbf24" stroke="#92400e" stroke-width="2"/>
    <text x="-4" y="5" font-family="serif" font-size="14" font-weight="bold" fill="#92400e">$</text>
  </g>
  <!-- 玩家角色（小人） -->
  <g transform="translate(360,200)">
    <rect x="-8" y="-20" width="16" height="20" fill="#dc2626"/>
    <rect x="-8" y="-30" width="16" height="12" fill="#fde68a"/>
    <rect x="-4" y="-28" width="2" height="3" fill="#0f172a"/>
    <rect x="2" y="-28" width="2" height="3" fill="#0f172a"/>
    <rect x="-6" y="0" width="5" height="15" fill="#1e3a8a"/>
    <rect x="1" y="0" width="5" height="15" fill="#1e3a8a"/>
    <rect x="-10" y="-18" width="4" height="10" fill="#fde68a"/>
    <rect x="6" y="-18" width="4" height="10" fill="#fde68a"/>
  </g>
  <!-- 食人花 -->
  <g transform="translate(800,260)">
    <ellipse cx="0" cy="0" rx="18" ry="14" fill="#16a34a"/>
    <rect x="-4" y="10" width="8" height="10" fill="#16a34a"/>
    <polygon points="-12,-2 -6,-10 0,-2 -6,4" fill="#dc2626"/>
    <polygon points="0,-2 6,-10 12,-2 6,4" fill="#dc2626"/>
  </g>
  <!-- 旗杆 -->
  <g transform="translate(1100,200)">
    <rect x="-2" y="0" width="4" height="80" fill="#78350f"/>
    <polygon points="2,0 40,15 2,30" fill="#dc2626"/>
  </g>
  <text x="80" y="360" font-family="monospace" font-size="32" font-weight="bold" fill="#fef3c7" opacity="0.95">像素冒险</text>
  <text x="80" y="385" font-family="monospace" font-size="13" fill="#fef3c7" opacity="0.8">8-BIT WORLD · 1-1</text>
</svg>`;

// 方块世界 —— 通用俄罗斯方块主题，原创设计
const tetrisWorldSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="twBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#twBg)"/>
  <!-- 网格背景 -->
  <g stroke="#1e40af" stroke-width="0.5" opacity="0.3">
    <line x1="0" y1="0" x2="1200" y2="0"/>
    <line x1="0" y1="50" x2="1200" y2="50"/>
    <line x1="0" y1="100" x2="1200" y2="100"/>
    <line x1="0" y1="150" x2="1200" y2="150"/>
    <line x1="0" y1="200" x2="1200" y2="200"/>
    <line x1="0" y1="250" x2="1200" y2="250"/>
    <line x1="0" y1="300" x2="1200" y2="300"/>
    <line x1="0" y1="350" x2="1200" y2="350"/>
    <line x1="100" y1="0" x2="100" y2="400"/>
    <line x1="200" y1="0" x2="200" y2="400"/>
    <line x1="300" y1="0" x2="300" y2="400"/>
    <line x1="400" y1="0" x2="400" y2="400"/>
    <line x1="500" y1="0" x2="500" y2="400"/>
    <line x1="600" y1="0" x2="600" y2="400"/>
    <line x1="700" y1="0" x2="700" y2="400"/>
    <line x1="800" y1="0" x2="800" y2="400"/>
    <line x1="900" y1="0" x2="900" y2="400"/>
    <line x1="1000" y1="0" x2="1000" y2="400"/>
    <line x1="1100" y1="0" x2="1100" y2="400"/>
  </g>
  <!-- 已堆叠的方块（底部） -->
  <g>
    <!-- 紫 T -->
    <rect x="100" y="320" width="30" height="30" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
    <rect x="130" y="320" width="30" height="30" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
    <rect x="160" y="320" width="30" height="30" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
    <rect x="130" y="350" width="30" height="30" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
    <!-- 绿 S -->
    <rect x="220" y="350" width="30" height="30" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
    <rect x="250" y="350" width="30" height="30" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
    <rect x="250" y="320" width="30" height="30" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
    <rect x="280" y="320" width="30" height="30" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
    <!-- 红 Z -->
    <rect x="330" y="350" width="30" height="30" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <rect x="360" y="350" width="30" height="30" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <rect x="360" y="320" width="30" height="30" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <rect x="390" y="320" width="30" height="30" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
    <!-- 黄 O -->
    <rect x="430" y="350" width="30" height="30" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>
    <rect x="460" y="350" width="30" height="30" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>
    <rect x="430" y="320" width="30" height="30" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>
    <rect x="460" y="320" width="30" height="30" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>
    <!-- 蓝 I -->
    <rect x="520" y="200" width="30" height="30" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
    <rect x="520" y="230" width="30" height="30" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
    <rect x="520" y="260" width="30" height="30" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
    <rect x="520" y="290" width="30" height="30" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
  </g>
  <!-- 下落中的方块（橙 L） -->
  <g opacity="0.95">
    <rect x="700" y="80" width="30" height="30" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
    <rect x="700" y="110" width="30" height="30" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
    <rect x="700" y="140" width="30" height="30" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
    <rect x="730" y="140" width="30" height="30" fill="#f97316" stroke="#c2410c" stroke-width="2"/>
    <!-- 移动轨迹 -->
    <rect x="700" y="50" width="30" height="6" fill="#f97316" opacity="0.2"/>
  </g>
  <!-- 下一个预览 -->
  <g transform="translate(900,100)">
    <text x="0" y="0" font-family="monospace" font-size="14" fill="#94a3b8" opacity="0.8">NEXT</text>
    <rect x="0" y="20" width="25" height="25" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
    <rect x="25" y="20" width="25" height="25" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
    <rect x="50" y="20" width="25" height="25" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
    <rect x="25" y="45" width="25" height="25" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
  </g>
  <!-- 分数 -->
  <g transform="translate(1000,200)">
    <text x="0" y="0" font-family="monospace" font-size="14" fill="#94a3b8" opacity="0.8">SCORE</text>
    <text x="0" y="30" font-family="monospace" font-size="28" font-weight="bold" fill="#fbbf24">128400</text>
    <text x="0" y="70" font-family="monospace" font-size="14" fill="#94a3b8" opacity="0.8">LINES</text>
    <text x="0" y="100" font-family="monospace" font-size="28" font-weight="bold" fill="#22d3ee">42</text>
  </g>
  <text x="80" y="60" font-family="monospace" font-size="36" font-weight="bold" fill="#a78bfa" opacity="0.95">方块世界</text>
  <text x="80" y="92" font-family="monospace" font-size="14" fill="#a78bfa" opacity="0.7">TETRIS · 经典永不褪色</text>
</svg>`;

// 街机时代 —— 通用街机游戏主题，原创设计
const arcadeEraSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
  <defs>
    <linearGradient id="aeBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e1b4b"/>
      <stop offset="100%" style="stop-color:#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#aeBg)"/>
  <!-- CRT 扫描线 -->
  <g stroke="#22d3ee" stroke-width="1" opacity="0.08">
    <line x1="0" y1="20" x2="1200" y2="20"/>
    <line x1="0" y1="60" x2="1200" y2="60"/>
    <line x1="0" y1="100" x2="1200" y2="100"/>
    <line x1="0" y1="140" x2="1200" y2="140"/>
    <line x1="0" y1="180" x2="1200" y2="180"/>
    <line x1="0" y1="220" x2="1200" y2="220"/>
    <line x1="0" y1="260" x2="1200" y2="260"/>
    <line x1="0" y1="300" x2="1200" y2="300"/>
    <line x1="0" y1="340" x2="1200" y2="340"/>
    <line x1="0" y1="380" x2="1200" y2="380"/>
  </g>
  <!-- 左侧街机 -->
  <g transform="translate(150,80)">
    <!-- 机身 -->
    <rect x="-60" y="0" width="120" height="280" rx="8" fill="#0f172a" stroke="#22d3ee" stroke-width="3"/>
    <!-- 屏幕 -->
    <rect x="-50" y="10" width="100" height="80" fill="#000" stroke="#22d3ee" stroke-width="2"/>
    <!-- 屏幕内容：像素小人对战 -->
    <g fill="#22d3ee" opacity="0.9">
      <rect x="-40" y="20" width="6" height="6"/>
      <rect x="-30" y="30" width="6" height="6"/>
      <rect x="20" y="20" width="6" height="6"/>
      <rect x="30" y="30" width="6" height="6"/>
    </g>
    <g fill="#ef4444" opacity="0.9">
      <rect x="-20" y="50" width="6" height="6"/>
      <rect x="0" y="50" width="6" height="6"/>
      <rect x="20" y="50" width="6" height="6"/>
    </g>
    <text x="-30" y="80" font-family="monospace" font-size="10" fill="#fbbf24">VS</text>
    <!-- 控制台 -->
    <rect x="-50" y="100" width="100" height="180" fill="#1e293b"/>
    <!-- 摇杆 -->
    <circle cx="-25" cy="135" r="14" fill="#000" stroke="#22d3ee" stroke-width="2"/>
    <line x1="-25" y1="135" x2="-25" y2="115" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
    <!-- 按钮 -->
    <circle cx="15" cy="125" r="7" fill="#ef4444"/>
    <circle cx="30" cy="135" r="7" fill="#fbbf24"/>
    <circle cx="15" cy="145" r="7" fill="#3b82f6"/>
    <circle cx="0" cy="135" r="7" fill="#22c55e"/>
    <!-- 投币口 -->
    <rect x="-10" y="240" width="20" height="3" fill="#fbbf24"/>
    <text x="-20" y="260" font-family="monospace" font-size="9" fill="#22d3ee" opacity="0.7">INSERT COIN</text>
  </g>
  <!-- 右侧街机 -->
  <g transform="translate(1050,80)">
    <rect x="-60" y="0" width="120" height="280" rx="8" fill="#0f172a" stroke="#ec4899" stroke-width="3"/>
    <rect x="-50" y="10" width="100" height="80" fill="#000" stroke="#ec4899" stroke-width="2"/>
    <g fill="#fbbf24" opacity="0.9">
      <circle cx="-25" cy="40" r="3"/>
      <circle cx="-15" cy="40" r="3"/>
      <circle cx="-5" cy="40" r="3"/>
      <circle cx="5" cy="40" r="3"/>
      <circle cx="15" cy="40" r="3"/>
      <circle cx="25" cy="40" r="3"/>
    </g>
    <text x="-25" y="70" font-family="monospace" font-size="14" fill="#ec4899" opacity="0.9">PONG</text>
    <rect x="-50" y="100" width="100" height="180" fill="#1e293b"/>
    <circle cx="-25" cy="135" r="14" fill="#000" stroke="#ec4899" stroke-width="2"/>
    <line x1="-25" y1="135" x2="-25" y2="115" stroke="#22d3ee" stroke-width="5" stroke-linecap="round"/>
    <circle cx="15" cy="125" r="7" fill="#ef4444"/>
    <circle cx="30" cy="135" r="7" fill="#fbbf24"/>
    <circle cx="15" cy="145" r="7" fill="#22c55e"/>
    <circle cx="0" cy="135" r="7" fill="#a855f7"/>
    <rect x="-10" y="240" width="20" height="3" fill="#fbbf24"/>
  </g>
  <!-- 中央霓虹灯 -->
  <g transform="translate(600,200)">
    <text x="-200" y="0" font-family="monospace" font-size="40" font-weight="bold" fill="#22d3ee" opacity="0.9">ARCADE</text>
    <text x="-180" y="40" font-family="monospace" font-size="40" font-weight="bold" fill="#ec4899" opacity="0.9">GAME</text>
    <text x="-160" y="80" font-family="monospace" font-size="40" font-weight="bold" fill="#fbbf24" opacity="0.9">PARADISE</text>
  </g>
  <!-- 装饰星星 -->
  <g fill="#fbbf24" opacity="0.8">
    <polygon points="500,80 506,98 524,98 510,108 516,126 500,114 484,126 490,108 476,98 494,98"/>
    <polygon points="700,100 706,118 724,118 710,128 716,146 700,134 684,146 690,128 676,118 694,118"/>
  </g>
  <text x="80" y="60" font-family="monospace" font-size="32" font-weight="bold" fill="#22d3ee" opacity="0.95">街机时代</text>
  <text x="80" y="90" font-family="monospace" font-size="14" fill="#ec4899" opacity="0.8">80's · 投币即玩</text>
</svg>`;

// 像素森林 —— 通用像素沙盒/创造主题，原创设计
const pixelForestSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" shape-rendering="crispEdges">
  <defs>
    <linearGradient id="pfSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#7dd3fc"/>
      <stop offset="100%" style="stop-color:#fef3c7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="240" fill="url(#pfSky)"/>
  <rect y="240" width="1200" height="160" fill="#65a30d"/>
  <!-- 远景树 -->
  <g fill="#15803d">
    <rect x="50" y="200" width="40" height="40"/>
    <rect x="60" y="180" width="20" height="20"/>
    <rect x="1100" y="200" width="40" height="40"/>
    <rect x="1110" y="180" width="20" height="20"/>
  </g>
  <!-- 方块（地面纹理） -->
  <g fill="#16a34a" opacity="0.5">
    <rect x="0" y="280" width="1200" height="2"/>
    <rect x="0" y="320" width="1200" height="2"/>
    <rect x="0" y="360" width="1200" height="2"/>
  </g>
  <!-- 像素树（前景） -->
  <g transform="translate(200,200)">
    <rect x="-10" y="0" width="20" height="40" fill="#78350f"/>
    <rect x="-30" y="-20" width="60" height="20" fill="#15803d"/>
    <rect x="-40" y="-40" width="80" height="20" fill="#16a34a"/>
    <rect x="-50" y="-60" width="100" height="20" fill="#22c55e"/>
    <rect x="-30" y="-80" width="60" height="20" fill="#16a34a"/>
  </g>
  <g transform="translate(950,180)">
    <rect x="-15" y="20" width="30" height="40" fill="#78350f"/>
    <rect x="-40" y="0" width="80" height="20" fill="#15803d"/>
    <rect x="-50" y="-20" width="100" height="20" fill="#16a34a"/>
    <rect x="-60" y="-40" width="120" height="20" fill="#22c55e"/>
    <rect x="-40" y="-60" width="80" height="20" fill="#16a34a"/>
  </g>
  <!-- 像素怪物（绿色，苦力怕风） -->
  <g transform="translate(500,200)">
    <rect x="-30" y="0" width="60" height="60" fill="#22c55e"/>
    <rect x="-30" y="0" width="60" height="6" fill="#16a34a"/>
    <rect x="-30" y="54" width="60" height="6" fill="#16a34a"/>
    <!-- 脸 -->
    <rect x="-18" y="15" width="10" height="15" fill="#0f172a"/>
    <rect x="8" y="15" width="10" height="15" fill="#0f172a"/>
    <rect x="-18" y="15" width="3" height="3" fill="#22c55e"/>
    <rect x="8" y="15" width="3" height="3" fill="#22c55e"/>
    <rect x="-11" y="15" width="3" height="3" fill="#22c55e"/>
    <rect x="15" y="15" width="3" height="3" fill="#22c55e"/>
    <rect x="-5" y="20" width="3" height="3" fill="#0f172a"/>
    <rect x="2" y="20" width="3" height="3" fill="#0f172a"/>
    <!-- 嘴 -->
    <rect x="-15" y="40" width="30" height="4" fill="#0f172a"/>
    <rect x="-9" y="36" width="4" height="4" fill="#0f172a"/>
    <rect x="5" y="36" width="4" height="4" fill="#0f172a"/>
    <rect x="-3" y="44" width="4" height="4" fill="#0f172a"/>
    <rect x="-15" y="44" width="4" height="4" fill="#0f172a"/>
    <rect x="11" y="44" width="4" height="4" fill="#0f172a"/>
    <!-- 腿 -->
    <rect x="-30" y="60" width="14" height="20" fill="#22c55e"/>
    <rect x="16" y="60" width="14" height="20" fill="#22c55e"/>
  </g>
  <!-- 阳光方块 -->
  <g fill="#fef3c7" opacity="0.8">
    <rect x="850" y="50" width="20" height="20"/>
    <rect x="870" y="70" width="20" height="20"/>
    <rect x="850" y="90" width="20" height="20"/>
    <rect x="900" y="100" width="20" height="20"/>
  </g>
  <!-- 漂浮云 -->
  <g fill="#fff" opacity="0.8">
    <rect x="100" y="40" width="40" height="10"/>
    <rect x="120" y="30" width="20" height="10"/>
    <rect x="600" y="60" width="50" height="10"/>
    <rect x="620" y="50" width="20" height="10"/>
  </g>
  <text x="80" y="350" font-family="monospace" font-size="32" font-weight="bold" fill="#fef3c7" opacity="0.95">像素森林</text>
  <text x="80" y="378" font-family="monospace" font-size="13" fill="#fef3c7" opacity="0.8">用方块构建世界</text>
</svg>`;

export const BuiltInCovers: CoverItem[] = [
  // 原有封面
  {
    id: 'cover-vue',
    name: 'Vue',
    url: svgToDataUrl(vueSvg),
    tags: ['前端', '框架'],
  },
  {
    id: 'cover-react',
    name: 'React',
    url: svgToDataUrl(reactSvg),
    tags: ['前端', '框架'],
  },
  {
    id: 'cover-webpack',
    name: 'Webpack',
    url: svgToDataUrl(webpackSvg),
    tags: ['构建工具', '打包'],
  },
  {
    id: 'cover-vite',
    name: 'Vite',
    url: svgToDataUrl(viteSvg),
    tags: ['构建工具', '前端'],
  },
  {
    id: 'cover-typescript',
    name: 'TypeScript',
    url: svgToDataUrl(tsSvg),
    tags: ['语言', '前端'],
  },
  {
    id: 'cover-slate',
    name: 'MyBook',
    url: svgToDataUrl(slateSvg),
    tags: ['编辑器', '文档'],
  },
  {
    id: 'cover-doc',
    name: '文档',
    url: svgToDataUrl(docSvg),
    tags: ['通用', '文档'],
  },
  {
    id: 'cover-galaxy',
    name: '星空',
    url: svgToDataUrl(galaxySvg),
    tags: ['通用', '灵感'],
  },
  // 飞书风格封面
  {
    id: 'cover-feishu-blue',
    name: '飞书蓝',
    url: svgToDataUrl(feishuBlueSvg),
    tags: ['飞书', '科技'],
  },
  {
    id: 'cover-feishu-purple',
    name: '飞书紫',
    url: svgToDataUrl(feishuPurpleSvg),
    tags: ['飞书', '创意'],
  },
  {
    id: 'cover-feishu-teal',
    name: '飞书青',
    url: svgToDataUrl(feishuTealSvg),
    tags: ['飞书', '极简'],
  },
  {
    id: 'cover-feishu-orange',
    name: '飞书橙',
    url: svgToDataUrl(feishuOrangeSvg),
    tags: ['飞书', '活力'],
  },
  {
    id: 'cover-feishu-pink',
    name: '飞书粉',
    url: svgToDataUrl(feishuPinkSvg),
    tags: ['飞书', '柔和'],
  },
  {
    id: 'cover-feishu-dark',
    name: '飞书灰',
    url: svgToDataUrl(feishuDarkSvg),
    tags: ['飞书', '科技'],
  },
  {
    id: 'cover-feishu-green',
    name: '飞书绿',
    url: svgToDataUrl(feishuGreenSvg),
    tags: ['飞书', '自然'],
  },
  {
    id: 'cover-feishu-rainbow',
    name: '飞书彩虹',
    url: svgToDataUrl(feishuRainbowSvg),
    tags: ['飞书', '多彩'],
  },
  // ===== 童年动画主题（原创同人风格，不使用任何官方角色形象）=====
  {
    id: 'cover-young-detective',
    name: '少年侦探',
    url: svgToDataUrl(youngDetectiveSvg),
    tags: ['童年', '推理'],
  },
  {
    id: 'cover-cat-mouse',
    name: '猫鼠追逐',
    url: svgToDataUrl(catMouseSvg),
    tags: ['童年', '喜剧'],
  },
  {
    id: 'cover-digi-creature',
    name: '数码萌兽',
    url: svgToDataUrl(digiCreatureSvg),
    tags: ['童年', '冒险'],
  },
  {
    id: 'cover-robot-buddy',
    name: '机械伙伴',
    url: svgToDataUrl(robotBuddySvg),
    tags: ['童年', '科幻'],
  },
  {
    id: 'cover-ninja-turtle',
    name: '忍者神龟',
    url: svgToDataUrl(ninjaTurtleSvg),
    tags: ['童年', '动作'],
  },
  // ===== 游戏世界主题（原创同人风格）=====
  {
    id: 'cover-pixel-tank',
    name: '像素坦克',
    url: svgToDataUrl(pixelTankSvg),
    tags: ['游戏', '像素'],
  },
  {
    id: 'cover-summon-rift',
    name: '召唤峡谷',
    url: svgToDataUrl(summonRiftSvg),
    tags: ['游戏', '竞技'],
  },
  {
    id: 'cover-pixel-adventure',
    name: '像素冒险',
    url: svgToDataUrl(pixelAdventureSvg),
    tags: ['游戏', '冒险'],
  },
  {
    id: 'cover-tetris-world',
    name: '方块世界',
    url: svgToDataUrl(tetrisWorldSvg),
    tags: ['游戏', '休闲'],
  },
  {
    id: 'cover-arcade-era',
    name: '街机时代',
    url: svgToDataUrl(arcadeEraSvg),
    tags: ['游戏', '怀旧'],
  },
  {
    id: 'cover-pixel-forest',
    name: '像素森林',
    url: svgToDataUrl(pixelForestSvg),
    tags: ['游戏', '创造'],
  },
  // ===== 风景摄影集（照片类，集中排列，不与插画混排）=====
  // --- Pexels 高清原图（已压缩至 1200x400）---
  {
    id: 'cover-landscape-01',
    name: '晚霞城市',
    url: '/covers/cover-landscape-01.jpg',
    tags: ['风景', '黄昏'],
  },
  {
    id: 'cover-landscape-02',
    name: '湖畔骑行',
    url: '/covers/cover-landscape-02.jpg',
    tags: ['风景', '湖畔'],
  },
  {
    id: 'cover-landscape-03',
    name: '油菜花海',
    url: '/covers/cover-landscape-03.jpg',
    tags: ['风景', '田园'],
  },
  {
    id: 'cover-landscape-04',
    name: '湖畔红杉',
    url: '/covers/cover-landscape-04.jpg',
    tags: ['风景', '秋意'],
  },
  {
    id: 'cover-landscape-05',
    name: '远山云海',
    url: '/covers/cover-landscape-05.jpg',
    tags: ['风景', '山水'],
  },
  {
    id: 'cover-landscape-06',
    name: '草原海天',
    url: '/covers/cover-landscape-06.jpg',
    tags: ['风景', '辽阔'],
  },
  // --- Picsum CC0 摄影（Unsplash 来源，免费商用）---
  {
    id: 'cover-landscape-07',
    name: '工业运河',
    url: '/covers/cover-landscape-07.jpg',
    tags: ['创意', '城市'],
  },
  {
    id: 'cover-landscape-08',
    name: '深海水母',
    url: '/covers/cover-landscape-08.jpg',
    tags: ['风景', '海洋'],
  },
  {
    id: 'cover-landscape-09',
    name: '棒球特写',
    url: '/covers/cover-landscape-09.jpg',
    tags: ['创意', '运动'],
  },
  {
    id: 'cover-landscape-10',
    name: '红色峡谷',
    url: '/covers/cover-landscape-10.jpg',
    tags: ['风景', '峡谷'],
  },
  {
    id: 'cover-landscape-11',
    name: '绅士风度',
    url: '/covers/cover-landscape-11.jpg',
    tags: ['创意', '时尚'],
  },
  {
    id: 'cover-landscape-12',
    name: '蓝墙小景',
    url: '/covers/cover-landscape-12.jpg',
    tags: ['创意', '极简'],
  },
  {
    id: 'cover-landscape-13',
    name: '森林瀑布',
    url: '/covers/cover-landscape-13.jpg',
    tags: ['风景', '森林'],
  },
  {
    id: 'cover-landscape-14',
    name: '登顶远眺',
    url: '/covers/cover-landscape-14.jpg',
    tags: ['风景', '山岳'],
  },
  {
    id: 'cover-landscape-15',
    name: '云海山道',
    url: '/covers/cover-landscape-15.jpg',
    tags: ['风景', '云海'],
  },
  {
    id: 'cover-landscape-16',
    name: '林间骑行',
    url: '/covers/cover-landscape-16.jpg',
    tags: ['风景', '骑行'],
  },
  {
    id: 'cover-landscape-17',
    name: '篝火背影',
    url: '/covers/cover-landscape-17.jpg',
    tags: ['风景', '夜色'],
  },
  {
    id: 'cover-landscape-18',
    name: '雪原公路',
    url: '/covers/cover-landscape-18.jpg',
    tags: ['风景', '雪原'],
  },
  {
    id: 'cover-landscape-19',
    name: '雾中人影',
    url: '/covers/cover-landscape-19.jpg',
    tags: ['风景', '意境'],
  },
  {
    id: 'cover-landscape-20',
    name: '焦土森林',
    url: '/covers/cover-landscape-20.jpg',
    tags: ['风景', '苍凉'],
  },
  {
    id: 'cover-landscape-21',
    name: '林荫大道',
    url: '/covers/cover-landscape-21.jpg',
    tags: ['风景', '森林'],
  },
  {
    id: 'cover-landscape-22',
    name: '烟花绽放',
    url: '/covers/cover-landscape-22.jpg',
    tags: ['风景', '烟花'],
  },
  {
    id: 'cover-landscape-23',
    name: '石阶独坐',
    url: '/covers/cover-landscape-23.jpg',
    tags: ['创意', '孤独'],
  },
  {
    id: 'cover-landscape-24',
    name: '旧楼绿意',
    url: '/covers/cover-landscape-24.jpg',
    tags: ['创意', '复古'],
  },
  {
    id: 'cover-landscape-25',
    name: '海港码头',
    url: '/covers/cover-landscape-25.jpg',
    tags: ['风景', '海港'],
  },
  {
    id: 'cover-landscape-26',
    name: '雪径黑白',
    url: '/covers/cover-landscape-26.jpg',
    tags: ['风景', '黑白'],
  },
  {
    id: 'cover-landscape-27',
    name: '松果特写',
    url: '/covers/cover-landscape-27.jpg',
    tags: ['创意', '微距'],
  },
  {
    id: 'cover-landscape-28',
    name: '银河星空',
    url: '/covers/cover-landscape-28.jpg',
    tags: ['风景', '星空'],
  },
  {
    id: 'cover-landscape-29',
    name: '沙丘之脊',
    url: '/covers/cover-landscape-29.jpg',
    tags: ['风景', '沙漠'],
  },
  {
    id: 'cover-landscape-30',
    name: '海岸长曝',
    url: '/covers/cover-landscape-30.jpg',
    tags: ['风景', '海岸'],
  },
];

export const getCoverById = (id: string): CoverItem | undefined =>
  BuiltInCovers.find((c) => c.id === id);
