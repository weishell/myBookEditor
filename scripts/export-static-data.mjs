// 构建前导出静态数据：把 data/ 下的「文件真相」变成浏览器可直接读的 JSON
// 输出结构（与线上路径一一对应）：
//   public/data/meta.json              分类 + 标签
//   public/data/articles.json          列表索引（不含正文）
//   public/data/articles/<id>.json     单篇（索引 + 正文），详情页按需取
//   public/media/<kind>/...            图片/文件/视频（存在才拷贝）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'data');
const ARTICLES_DIR = path.join(DATA_DIR, 'articles');
const MEDIA_DIR = path.join(DATA_DIR, 'media');
const OUT_DIR = path.join(ROOT, 'public', 'data');
const OUT_ARTICLES = path.join(OUT_DIR, 'articles');
const OUT_MEDIA = path.join(ROOT, 'public', 'media');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const metaFile = path.join(DATA_DIR, 'meta.json');
if (!fs.existsSync(metaFile)) {
  console.warn('⚠️  没有 data/meta.json，跳过静态数据导出（线上将回退到内置示例数据）');
  process.exit(0);
}

const meta = readJson(metaFile);
const files = fs.existsSync(ARTICLES_DIR)
  ? fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.json') && !f.endsWith('.tmp'))
  : [];

if (files.length === 0) {
  console.warn('⚠️  data/articles 为空，跳过静态数据导出');
  process.exit(0);
}

// 清理旧产物：某些环境会拦截递归删除，失败就继续（索引不引用旧文件即可）
try {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
} catch (err) {
  console.warn(`⚠️  旧产物清理失败（不影响导出）：${err.message}`);
}
fs.mkdirSync(OUT_ARTICLES, { recursive: true });

/** 正文不进列表索引，只留展示需要的字段 */
const toIndex = (article) => ({
  id: article.id,
  title: article.title,
  summary: article.summary ?? '',
  category: article.categoryId ?? '',
  tags: Array.isArray(article.tagIds) ? article.tagIds : [],
  date: String(article.createdAt ?? '').slice(0, 10),
  reads: Number(article.reads ?? 0),
  updatedAt: article.updatedAt,
});

const index = [];
let skipped = 0;

for (const file of files) {
  const id = file.slice(0, -5);
  try {
    const article = { ...readJson(path.join(ARTICLES_DIR, file)), id };
    // 只导出已发布的文档：草稿不该出现在公开站点上
    if ((article.status ?? 'published') !== 'published') {
      skipped += 1;
      continue;
    }
    index.push(toIndex(article));
    fs.writeFileSync(
      path.join(OUT_ARTICLES, `${id}.json`),
      JSON.stringify({ ...toIndex(article), content: article.content ?? [] }),
    );
  } catch (err) {
    console.warn(`跳过坏文件 ${file}：${err.message}`);
  }
}

index.sort((a, b) => (a.date < b.date ? 1 : -1));

fs.writeFileSync(path.join(OUT_DIR, 'meta.json'), JSON.stringify(meta));
fs.writeFileSync(path.join(OUT_DIR, 'articles.json'), JSON.stringify(index));

// 媒体目录：有内容才拷，避免每次构建都复制一堆空目录
if (fs.existsSync(MEDIA_DIR)) {
  const hasMedia = fs
    .readdirSync(MEDIA_DIR, { withFileTypes: true })
    .some((d) => d.isDirectory() && fs.readdirSync(path.join(MEDIA_DIR, d.name)).length > 0);
  if (hasMedia) {
    try {
      fs.rmSync(OUT_MEDIA, { recursive: true, force: true });
    } catch {
      /* 同上：清理失败不阻塞构建 */
    }
    fs.cpSync(MEDIA_DIR, OUT_MEDIA, { recursive: true });
    console.log('📎 已拷贝 media/ 到 public/media/');
  }
}

const drafts = skipped ? `，跳过草稿 ${skipped} 篇` : '';
console.log(`✅ 导出 ${index.length} 篇${drafts} → public/data/`);
