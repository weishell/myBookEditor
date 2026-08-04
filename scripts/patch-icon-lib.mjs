// scripts/patch-icon-lib.mjs —— 用新生成的 LUCIDE_RAW 替换 icon-lib.ts 中的 lucide 部分
import { readFileSync, writeFileSync } from 'fs';

const current = readFileSync('src/components/IconPicker/icon-lib.ts', 'utf8');
const lucideRawFile = readFileSync('.tmp-lucide-raw.ts', 'utf8');

const BEFORE_MARKER = '// ====================== Lucide 线性图标库 ======================';
const idxA = current.indexOf(BEFORE_MARKER);
if (idxA < 0) throw new Error('BEFORE marker not found in icon-lib.ts');
const head = current.slice(0, idxA);

const m1 = lucideRawFile.match(
  /^export const LUCIDE_RAW: \[string, string, string, LucideCat\]\[\] = \[([\s\S]*?)\n\];/m,
);
if (!m1) throw new Error('LUCIDE_RAW body not found in .tmp-lucide-raw.ts');
const rawBody = m1[1]; // 内容不含开头的 "[" 和结尾的 "\n]"

const tail = `// ====================== Lucide 线性图标库 ======================
// 自动生成来源：scripts/gen-lucide-categories.mjs（基于 lucide-react 实际导出名，约 3000+ 图标）
// 扩充方式：
//   A. 改脚本：scripts/gen-lucide-categories.mjs 调整 EDIT / DOC / UI / DEV / MEDIA 关键词，
//      然后执行 pnpm node scripts/gen-lucide-categories.mjs && pnpm node scripts/patch-icon-lib.mjs
//   B. 手动：往下面 LUCIDE_RAW 数组里按 [组件名, 英文关键词, 中文关键词, 分类key] 追加即可。

export const LUCIDE_CATEGORIES: { key: string; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'edit', label: '编辑' },
  { key: 'doc', label: '文档' },
  { key: 'ui', label: '界面' },
  { key: 'dev', label: '开发' },
  { key: 'media', label: '媒体' },
];

type LucideRow = [string, string, string, string];
const LUCIDE_RAW: LucideRow[] = [
${rawBody}
];

export const LUCIDE_ITEMS: IconItem[] = LUCIDE_RAW.map(
  ([key, en, zh, category]) => ({
    kind: 'lucide' as const,
    key,
    searchable: \`\${en} \${zh ?? ''}\`.toLowerCase().trim(),
    category: category ?? 'ui',
  }),
);

/**
 * Lucide 图标白名单 —— 与上面 LUCIDE_RAW 第 0 列保持一致
 * 组件在 index.tsx 中按名字从 lucide-react 动态取用
 */
export const LUCIDE_KEYS = LUCIDE_RAW.map((r) => r[0]);
`;

const out = head + tail;
writeFileSync('src/components/IconPicker/icon-lib.ts', out, 'utf8');
console.log('icon-lib.ts regenerated, bytes:', out.length);
