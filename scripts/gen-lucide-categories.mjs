// 临时脚本：从 lucide-react 模块读取实际导出名，输出分类好的 LUCIDE_RAW 数组到 .tmp-icons.ts
// 运行： node scripts/gen-lucide-categories.mjs
import { createRequire } from 'module';
import { writeFileSync } from 'fs';

const require = createRequire(import.meta.url);
const mod = require('lucide-react');

// 过滤掉不是组件的东西，去掉 XXXIcon 重复后缀（和不带后缀重复）
let keys = Object.keys(mod).filter((k) => {
  if (!/^[A-Z]/.test(k)) return false;
  if (k.endsWith('Icon')) return false; // 有不带 Icon 版本的会保留
  const v = mod[k];
  if (typeof v !== 'function' && typeof v !== 'object') return false;
  // 排除 LucideProvider
  if (k === 'LucideProvider') return false;
  return true;
});
keys = Array.from(new Set(keys)).sort();

// ======= 分类规则：按关键词匹配 =======
const EDIT = ['edit', 'write', 'pen', 'pencil', 'eraser', 'drafting', 'save', 'undo', 'redo', 'file', 'paste', 'copy', 'cut', 'clipboard', 'signature', 'stamp', 'type', 'italic', 'bold', 'case', 'highlighter', 'rotate', 'wand', 'remove', 'trash', 'scissors', 'scrapbook', 'combine'];
const DOC = ['book', 'doc', 'note', 'notepad', 'file', 'folder', 'paperclip', 'archive', 'library', 'newspaper', 'bookmark', 'magnet', 'message', 'notebook-text', 'file-text', 'file-audio', 'file-image', 'file-video', 'file-key', 'file-plus', 'file-minus', 'file-search', 'file-type', 'file-up', 'file-down', 'file-heart', 'file-check', 'file-copy', 'file-dashed', 'file-a', 'file', 'folder-tree', 'folder-input', 'folder-output', 'folder-lock', 'folder-open', 'folder-search', 'folder-x', 'folder-plus', 'folder-kanban', 'folder-git', 'folder-root', 'folder-key', 'folder-down', 'folder-up', 'folder-open'];
const UI = ['button', 'check', 'x', 'chevron', 'arrow', 'menu', 'circle', 'square', 'triangle', 'star', 'heart', 'thumbs', 'eye', 'bell', 'home', 'search', 'filter', 'sort', 'toggle', 'switch', 'radio', 'select', 'slider', 'list', 'grid', 'columns', 'rows', 'table', 'panel', 'scroll', 'sidebar', 'layout', 'columns', 'form', 'input', 'textarea', 'field', 'label', 'upload', 'download', 'link', 'external', 'unlink', 'maximize', 'minimize', 'monitor', 'zoom', 'move', 'copy', 'paperclip', 'mouse', 'hand', 'pointer', 'cursor', 'click', 'drag', 'gesture'];
const DEV = ['code', 'binary', 'brackets', 'braces', 'cpu', 'chip', 'terminal', 'command', 'git', 'branch', 'commit', 'diff', 'merge', 'github', 'gitlab', 'workflow', 'pipeline', 'network', 'server', 'database', 'cloud', 'container', 'docker', 'package', 'boxes', 'box', 'shield', 'lock', 'unlock', 'key', 'bug', 'beaker', 'flask', 'hammer', 'wrench', 'settings', 'gear', 'cog', 'sliders', 'rocket', 'plug', 'zap', 'cpu', 'sparkles', 'blocks', 'bot'];
const MEDIA = ['image', 'picture', 'video', 'music', 'audio', 'play', 'pause', 'stop', 'record', 'camera', 'video', 'film', 'microphone', 'mic', 'headphones', 'radio', 'volume', 'speaker', 'sound', 'waves', 'waveform', 'palette', 'brush', 'crop', 'shapes', 'image-plus', 'image-plus-up', 'image-minus', 'image-album', 'sliders', 'contrast', 'sun', 'moon', 'camera-off', 'video-off', 'music-2', 'music-3', 'music-4'];

function match(k, kw) {
  const low = k.toLowerCase();
  return kw.some((w) => low.includes(w));
}

const all = { 全部: keys };
const EDIT_keys = keys.filter((k) => match(k, EDIT));
const DOC_keys = keys.filter((k) => match(k, DOC));
const UI_keys = keys.filter((k) => match(k, UI));
const DEV_keys = keys.filter((k) => match(k, DEV));
const MEDIA_keys = keys.filter((k) => match(k, MEDIA));

// 写临时 json
const res = {
  total: keys.length,
  categories: {
    all: keys,
    edit: EDIT_keys,
    doc: DOC_keys,
    ui: UI_keys,
    dev: DEV_keys,
    media: MEDIA_keys,
  },
};

// 中文分类映射（用于生成中文搜索词）
const ZH_LABEL = {
  edit: '编辑',
  doc: '文档',
  ui: '界面',
  dev: '开发',
  media: '媒体',
};

// 也直接生成 LUCIDE_RAW 内容（TS 源）—— 输出与当前 icon-lib.ts 同格式： [组件名, 英文搜索词, 中文搜索词, 英文分类key]
const lines = [];
lines.push('// 由 scripts/gen-lucide-categories.mjs 自动生成，基于 lucide-react@1.28.0 实际导出名');
lines.push('// 运行：pnpm node scripts/gen-lucide-categories.mjs');
lines.push('');
lines.push('export type LucideCat = \'all\' | \'edit\' | \'doc\' | \'ui\' | \'dev\' | \'media\';');
lines.push('');
lines.push('/** 每个 Lucide 图标条目：[导出名, 英文关键词, 中文关键词, 分类 key] */');
lines.push('export const LUCIDE_RAW: [string, string, string, LucideCat][] = [');

function emit(arr, catKey) {
  const zh = ZH_LABEL[catKey] || catKey;
  for (const k of arr) {
    // 关键词：驼峰拆成英文小写空格连接
    const words = k.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
    const englishPart = `${k.toLowerCase()} ${words}`;
    const chinesePart = zh; // 用分类名作为中文补充
    lines.push(`  ['${k}', '${englishPart}', '${chinesePart}', '${catKey}'],`);
  }
}

emit(EDIT_keys, 'edit');
emit(DOC_keys, 'doc');
emit(UI_keys, 'ui');
emit(DEV_keys, 'dev');
emit(MEDIA_keys, 'media');

lines.push('];');
lines.push('');
lines.push('export const LUCIDE_KEYS: readonly string[] = LUCIDE_RAW.map(i => i[0]);');

writeFileSync(new URL('../.tmp-lucide-categories.json', import.meta.url), JSON.stringify(res, null, 2));
writeFileSync(new URL('../.tmp-lucide-raw.ts', import.meta.url), lines.join('\n'));

console.log('keys:', keys.length);
console.log('编辑:', EDIT_keys.length);
console.log('文档:', DOC_keys.length);
console.log('界面:', UI_keys.length);
console.log('开发:', DEV_keys.length);
console.log('媒体:', MEDIA_keys.length);
console.log('ts 生成于 .tmp-lucide-raw.ts');
