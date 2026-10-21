// 本地开发 API：node:http + node:sqlite，零第三方依赖
// 职责划分：文件读写（articles.mjs）｜索引查询（db.mjs）｜路由与 HTTP（本文件）
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {
  DATA_DIR,
  DRAWBOARDS_DIR,
  FILES_DIR,
  IMAGES_DIR,
  MAX_BODY_BYTES,
  MEDIA_DIR,
  PORT,
  VIDEOS_DIR,
} from './config.mjs';
import { createRouter } from './router.mjs';
import {
  isSafeId,
  listArticles,
  newArticleId,
  normalizeArticle,
  readArticle,
  trashArticle,
  writeArticle,
} from './articles.mjs';
import {
  countArticlesByCategory,
  countArticlesByTag,
  deleteArticleRow,
  getArticleRow,
  getTagsOf,
  openDb,
  queryArticles,
  rebuildIndex,
  syncTaxonomy,
  titleTaken,
  tx,
  upsertArticleRow,
} from './db.mjs';
import {
  assertUniqueName,
  cleanColor,
  cleanDesc,
  cleanIcon,
  newTaxonomyId,
  normalizeCover,
  readMeta,
  saveCategoryCover,
  writeMeta,
} from './meta.mjs';

// ---------- 目录与索引初始化 ----------
for (const dir of [DATA_DIR, DRAWBOARDS_DIR, IMAGES_DIR, FILES_DIR, VIDEOS_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = openDb();
const rebuilt = rebuildIndex(db);
console.log(
  `📚 索引重建完成：${rebuilt.articles} 篇 / ${rebuilt.categories} 分类 / ${rebuilt.tags} 标签`,
);

// ---------- HTTP 工具 ----------
const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const send = (res, status, body, headers = {}) => {
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(JSON.stringify(body, null, 2));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Filename',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(payload);
};

const httpError = (status, message) => Object.assign(new Error(message), { status });

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw httpError(413, '请求体过大（上限 20MB）');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw httpError(400, '请求体不是合法 JSON');
  }
}

const articleToApi = (row, content, tagIds) => ({
  id: row.id,
  title: row.title,
  summary: row.summary,
  category: row.categoryId,
  tags: tagIds,
  date: (row.createdAt || '').slice(0, 10),
  reads: row.reads,
  updatedAt: row.updatedAt,
  content,
});

// ---------- 路由 ----------
const router = createRouter();

router.get('/api/health', (_req, res) => {
  send(res, 200, { ok: true, articles: rebuilt.articles, source: 'local-sqlite' });
});

router.get('/api/meta', (_req, res) => {
  const meta = readMeta();
  send(res, 200, meta);
});

// ---------- 分类：可新增 / 重命名 / 改色 / 上传封面 / 删除（被引用时禁止） ----------
const CATEGORY_COLORS = [
  '#2f6fed',
  '#00a66c',
  '#7c3aed',
  '#e05b3f',
  '#d4a017',
  '#c026a5',
  '#0ea5e9',
  '#14b8a6',
];

const metaResponse = (meta, extra = {}) => ({ categories: meta.categories, tags: meta.tags, ...extra });

router.post('/api/categories', async (req, res) => {
  const body = await readJsonBody(req);
  const meta = readMeta();
  const name = assertUniqueName(meta.categories, body.name);
  const category = {
    id: newTaxonomyId('cat'),
    name,
    color: cleanColor(body.color, CATEGORY_COLORS[meta.categories.length % CATEGORY_COLORS.length]),
    icon: cleanIcon(body.icon),
    desc: cleanDesc(body.desc),
    cover: null,
  };
  meta.categories.push(category);
  writeMeta(meta);
  syncTaxonomy(db, meta);
  send(res, 201, metaResponse(meta, { category }));
});

router.put('/api/categories/:id', async (req, res, params) => {
  const meta = readMeta();
  const index = meta.categories.findIndex((c) => c.id === params.id);
  if (index < 0) throw httpError(404, '分类不存在');

  const body = await readJsonBody(req);
  const current = meta.categories[index];
  const next = {
    ...current,
    name: body.name === undefined ? current.name : assertUniqueName(meta.categories, body.name, current.id),
    color: body.color === undefined ? current.color : cleanColor(body.color, current.color),
    icon: body.icon === undefined ? current.icon : cleanIcon(body.icon, current.icon ?? '📄'),
    desc: body.desc === undefined ? current.desc : cleanDesc(body.desc),
    cover: body.cover === undefined ? (current.cover ?? null) : normalizeCover(body.cover),
  };
  meta.categories[index] = next;
  writeMeta(meta);
  syncTaxonomy(db, meta);
  send(res, 200, metaResponse(meta, { category: next }));
});

router.delete('/api/categories/:id', (_req, res, params) => {
  const meta = readMeta();
  const category = meta.categories.find((c) => c.id === params.id);
  if (!category) throw httpError(404, '分类不存在');

  // 有文档在用就不许删：避免文章指向一个不存在的分类
  const used = countArticlesByCategory(db, params.id);
  if (used > 0) throw httpError(409, `「${category.name}」下还有 ${used} 篇文档，先把它们改到别的分类`);

  meta.categories = meta.categories.filter((c) => c.id !== params.id);
  writeMeta(meta);
  syncTaxonomy(db, meta);
  send(res, 200, metaResponse(meta));
});

/** 封面上传：原始字节流 + X-Filename（不为 multipart 引依赖） */
router.post('/api/categories/:id/cover', async (req, res, params) => {
  const meta = readMeta();
  const index = meta.categories.findIndex((c) => c.id === params.id);
  if (index < 0) throw httpError(404, '分类不存在');
  if (!/^image\//.test(req.headers['content-type'] || '')) {
    throw httpError(400, '只支持图片文件');
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw httpError(413, '图片过大（上限 20MB）');
    chunks.push(chunk);
  }
  if (!chunks.length) throw httpError(400, '空文件');

  const fileName = decodeURIComponent(req.headers['x-filename'] || 'cover.png');
  const cover = saveCategoryCover(params.id, fileName, Buffer.concat(chunks));
  const next = { ...meta.categories[index], cover };
  meta.categories[index] = next;
  writeMeta(meta);
  syncTaxonomy(db, meta);
  send(res, 200, metaResponse(meta, { category: next }));
});

// ---------- 标签：可新增 / 重命名 / 改色 / 删除（被引用时禁止） ----------
router.post('/api/tags', async (req, res) => {
  const body = await readJsonBody(req);
  const meta = readMeta();
  const name = assertUniqueName(meta.tags, body.name);
  const tag = {
    id: newTaxonomyId('tag'),
    name,
    color: cleanColor(body.color, CATEGORY_COLORS[meta.tags.length % CATEGORY_COLORS.length]),
  };
  meta.tags.push(tag);
  writeMeta(meta);
  syncTaxonomy(db, meta);
  send(res, 201, metaResponse(meta, { tag }));
});

router.put('/api/tags/:id', async (req, res, params) => {
  const meta = readMeta();
  const index = meta.tags.findIndex((t) => t.id === params.id);
  if (index < 0) throw httpError(404, '标签不存在');

  const body = await readJsonBody(req);
  const current = meta.tags[index];
  const next = {
    ...current,
    name: body.name === undefined ? current.name : assertUniqueName(meta.tags, body.name, current.id),
    color: body.color === undefined ? current.color : cleanColor(body.color, current.color),
  };
  meta.tags[index] = next;
  writeMeta(meta);
  syncTaxonomy(db, meta);
  send(res, 200, metaResponse(meta, { tag: next }));
});

router.delete('/api/tags/:id', (_req, res, params) => {
  const meta = readMeta();
  const tag = meta.tags.find((t) => t.id === params.id);
  if (!tag) throw httpError(404, '标签不存在');

  const used = countArticlesByTag(db, params.id);
  if (used > 0) throw httpError(409, `「${tag.name}」还有 ${used} 篇文档在用，先解除引用再删除`);

  meta.tags = meta.tags.filter((t) => t.id !== params.id);
  writeMeta(meta);
  syncTaxonomy(db, meta);
  send(res, 200, metaResponse(meta));
});

/** 列表：返回索引（不含正文），分类/标签筛选与搜索交给 SQL */
router.get('/api/articles', (req, res, _params, url) => {
  const category = url.searchParams.get('category') ?? undefined;
  const tag = url.searchParams.get('tag') ?? undefined;
  const q = url.searchParams.get('q') ?? undefined;
  send(res, 200, queryArticles(db, { category, tag, q }));
});

router.get('/api/articles/:id', (_req, res, params) => {
  if (!isSafeId(params.id)) throw httpError(400, '非法 id');
  const row = getArticleRow(db, params.id);
  const article = readArticle(params.id);
  if (!row || !article) throw httpError(404, '文章不存在');
  send(res, 200, articleToApi(row, article.content, getTagsOf(db, params.id)));
});

router.post('/api/articles', async (req, res) => {
  const body = await readJsonBody(req);
  const title = String(body.title ?? '').trim();
  if (!title) throw httpError(400, '标题不能为空');
  if (titleTaken(db, title)) throw httpError(409, '标题已存在');

  const now = new Date().toISOString();
  const article = normalizeArticle({
    id: newArticleId(),
    title,
    summary: body.summary,
    categoryId: body.categoryId,
    tagIds: Array.isArray(body.tagIds) ? body.tagIds : [],
    content: body.content,
    status: body.status ?? 'published',
    createdAt: now,
    updatedAt: now,
  });

  // 先落文件再进索引：文件成功但索引失败时，索引下次启动会自愈；反过来会丢数据
  writeArticle(article);
  tx(db, () => upsertArticleRow(db, article));
  send(res, 201, articleToApi(article, article.content, article.tagIds));
});

router.put('/api/articles/:id', async (req, res, params) => {
  if (!isSafeId(params.id)) throw httpError(400, '非法 id');
  const current = readArticle(params.id);
  if (!current) throw httpError(404, '文章不存在');

  const body = await readJsonBody(req);
  const nextTitle = body.title === undefined ? current.title : String(body.title).trim();
  if (!nextTitle) throw httpError(400, '标题不能为空');
  if (titleTaken(db, nextTitle, params.id)) throw httpError(409, '标题已存在');

  const article = normalizeArticle({
    ...current,
    title: nextTitle,
    summary: body.summary === undefined ? current.summary : body.summary,
    categoryId: body.categoryId === undefined ? current.categoryId : body.categoryId,
    tagIds: Array.isArray(body.tagIds) ? body.tagIds : current.tagIds,
    content: Array.isArray(body.content) ? body.content : current.content,
    status: body.status === undefined ? current.status : body.status,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  });

  writeArticle(article);
  tx(db, () => upsertArticleRow(db, article));
  send(res, 200, articleToApi(article, article.content, article.tagIds));
});

/** 自动保存：只写正文 + updated_at，不碰标题/分类/标签 */
router.patch('/api/articles/:id/autosave', async (req, res, params) => {
  if (!isSafeId(params.id)) throw httpError(400, '非法 id');
  const current = readArticle(params.id);
  if (!current) throw httpError(404, '文章不存在');

  const body = await readJsonBody(req);
  if (!Array.isArray(body.content)) throw httpError(400, 'content 必须是数组');

  const article = normalizeArticle({
    ...current,
    content: body.content,
    updatedAt: new Date().toISOString(),
  });
  writeArticle(article);
  db.prepare('UPDATE article SET updated_at = ? WHERE id = ?').run(
    article.updatedAt,
    article.id,
  );
  send(res, 200, { ok: true, updatedAt: article.updatedAt });
});

router.delete('/api/articles/:id', (_req, res, params) => {
  if (!isSafeId(params.id)) throw httpError(400, '非法 id');
  const row = getArticleRow(db, params.id);
  if (!row) throw httpError(404, '文章不存在');
  // 先移文件再删索引：文件移失败时索引还在，不会出现「库里有、文件没了」
  trashArticle(params.id);
  tx(db, () => deleteArticleRow(db, params.id));
  send(res, 200, { ok: true, trashed: true });
});

/** 重扫文件重建索引（改了 data/articles 里的文件后手动触发） */
router.post('/api/rebuild', (_req, res) => {
  const result = rebuildIndex(db);
  send(res, 200, { ok: true, ...result });
});

/** 上传：走原始字节流 + X-Filename，避免为了 multipart 引入依赖 */
router.post('/api/upload', async (req, res, _params, url) => {
  const kind = url.searchParams.get('kind') === 'files' ? 'files' : 'images';
  const dir = kind === 'files' ? FILES_DIR : IMAGES_DIR;
  const rawName = decodeURIComponent(req.headers['x-filename'] || 'untitled');
  const ext = path.extname(rawName).toLowerCase() || '.bin';
  const base = path.basename(rawName, ext).replace(/[^\w\u4e00-\u9fa5-]/g, '_').slice(0, 48);
  const fileName = `${Date.now()}-${base || 'file'}${ext}`;

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw httpError(413, '文件过大（上限 20MB）');
    chunks.push(chunk);
  }
  if (!chunks.length) throw httpError(400, '空文件');

  fs.writeFileSync(path.join(dir, fileName), Buffer.concat(chunks));
  send(res, 200, { ok: true, path: `/media/${kind}/${fileName}` });
});

// ---------- 静态媒体 ----------
const serveMedia = (res, pathname) => {
  const rel = decodeURIComponent(pathname.replace(/^\/media\//, ''));
  const file = path.resolve(MEDIA_DIR, rel);
  if (!file.startsWith(path.resolve(MEDIA_DIR))) throw httpError(403, '路径非法');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw httpError(404, '文件不存在');
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=60',
  });
  fs.createReadStream(file).pipe(res);
};

// ---------- 启动 ----------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  try {
    if (req.method === 'OPTIONS') return send(res, 204, {});

    if (req.method === 'GET' && url.pathname.startsWith('/media/')) {
      return serveMedia(res, url.pathname);
    }

    const hit = router.match(req.method ?? 'GET', url.pathname);
    if (!hit) throw httpError(404, `未知接口 ${req.method} ${url.pathname}`);
    await hit.handler(req, res, hit.params, url);
  } catch (err) {
    const status = err.status ?? 500;
    if (status >= 500) console.error('[server]', err);
    if (!res.headersSent) send(res, status, { error: err.message });
    else res.end();
  }
});

server.listen(PORT, () => {
  console.log(`🚀 本地 API 已启动：http://localhost:${PORT}`);
  console.log(`   数据目录：${DATA_DIR}`);
  console.log(`   当前文章数：${listArticles().length}`);
});
