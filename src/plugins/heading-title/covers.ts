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

export const BuiltInCovers: CoverItem[] = [
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
];

export const getCoverById = (id: string): CoverItem | undefined =>
  BuiltInCovers.find((c) => c.id === id);
