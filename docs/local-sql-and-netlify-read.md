# 本地 SQL 可写 + 线上静态只读：可行性分析与落地方案

> 结论先行：**能做到，而且是这类"写作工具 + 只读站点"的标准做法。**
> 本地用 Express + 本地 SQLite 做完整增删改查；发布到 Netlify 时把数据库导成
> **静态 JSON 快照**，前端只 `fetch` 读取——零后台、零 wasm、零数据库费用。
> 不建议按原设计文档那样"线上用 sql.js 在浏览器里打开 .db"（能跑，但首屏和体积都吃亏，见 3.3）。

本文基于当前代码实测得出（2026-10-17），与 `docs/backend-data-design.md` 是**替代关系**：
表结构、相对路径约定照旧沿用，**线上那一层换成 JSON 快照**。

---

## 1. 现状盘点（决定改造面的关键事实）

| 项目         | 现状                                                                                            | 对方案的影响                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 站点文章数据 | `src/data/articles.ts` 硬编码生成 360 篇（6 分类 × 5 主题 × 12 变体），**打包进 bundle**        | 页面全是**同步** import 常量 → 改成异步 fetch 会牵动 5 个页面，需要「启动时预加载」来兜住                                   |
| 阅读页       | `Article.tsx` → `getArticleById(id)` 同步取，正文直接喂给 `BookEditor`                          | 详情页正文若要按需加载，只改这 1 个页面                                                                                     |
| 搜索         | `Search.tsx` 纯内存 `includes` 过滤 title/summary/分类名/标签名                                 | **不需要全文检索引擎**，一个元数据索引 JSON 足够                                                                            |
| 编辑器持久化 | `src/core/index.tsx` 用 localStorage，key 固定 `mybook-editor-content-v1`，400ms 节流           | ⚠️ 见下方"必须先修的 bug"                                                                                                   |
| 后端参考     | `demo/server/index.js`（Express + sql.js，**2671 行单文件**），被 `.gitignore` 排除             | 可借鉴形状，但有几处必须绕开的坑（见第 3 节）                                                                               |
| 部署         | **没有 `netlify.toml`、没有 `public/_redirects`**；`build = tsc -b && vite build`，产物 `dist/` | 直接访问 `/article/xxx`、`/demo` 会 **404**，这是"线上打不开"的头号原因                                                     |
| 依赖         | 未安装 sql.js / express / multer / sharp                                                        | 本地后端要新增依赖，注意 `pnpm-workspace.yaml` 里有 `minimumReleaseAge: 10080`（只装发布满 7 天的版本），新包可能要显式放行 |

### ⚠️ 必须先修的既有 bug（否则接库后现象会很怪）

`Article.tsx` 传了 `initialValue` 但**没传 `persistKey`**，而 `BookEditor` 的默认值是同一个
`mybook-editor-content-v1`。结果：

- 打开文章 A 编辑 → 写入这个 key；
- 再打开文章 B → `loadPersistedDoc` 命中，**显示的是文章 A 的内容**；
- 编辑过 `/demo` 示例文档后，**任何文章都会变成那份示例文档**。

正确做法：文章页传 `persistKey={`article:${article.id}`}`，`/demo` 传 `persistKey="demo"`。
接 SQL 之后这个 key 会被"服务端正文"取代，但改库之前先修掉，不然排查时会怀疑数据层。

---

## 2. 参考后端（`demo/server/index.js`）能学到什么、要避开什么

### 2.1 值得照搬的四点

1. **整体形状**：`initSqlJs()` → 建表/读库 → REST 路由 → 每次写库后落盘。思路是对的。
2. **图片链路**：`multer.memoryStorage()` 收内存 → `sharp` 按 jpeg/png/webp 分别压缩 → 落 `media/images/` → 只把**相对路径**写库。本项目第 11 节的媒体设计可以直接复用这套代码。
3. **多对多走关联表**：`actor_work` / `work_genre` 两张桥表 —— 正好对应我们需要的 `article_tag`，不要在文章表里拼逗号字符串。
4. **`/api/health`**：本地起服务先探活，前端能给出明确报错而不是白屏。

### 2.2 必须绕开的坑（都是真实隐患，不是风格问题）

| demo 里的写法                                             | 问题                                               | 本项目怎么做                                                                        |
| --------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 每次写都 `db.export()` + `writeFileSync(dbFile)` 全量重写 | 数据一多就卡；写到一半崩了会得到一个**损坏的 .db** | 用 `node:sqlite` / better-sqlite3 直接写真实文件（增量页写入 + WAL），不需要 export |
| 2671 行单文件：建表、路由、业务、压缩全挤在一起           | 改一处要通读全篇，回归成本高                       | 按 `docs/backend-data-design.md` 第 12 节拆 `db/ models/ routes/ services/`         |
| 无事务：更新文章 + 重算标签是多表写                       | 中途失败 → 标签和正文不一致                        | `db.exec('BEGIN')…'COMMIT'`，出错 `ROLLBACK`                                        |
| 无 schema 版本                                            | 加字段只能手改库文件                               | `schema_version` 表 + 顺序迁移                                                      |
| `express.static('public')` 用相对 cwd 的路径              | 换个目录启动就 404                                 | 一律 `path.join(__dirname, '..')`                                                   |
| 列表接口一次全量返回，无分页                              | 文章多了首页就拖死                                 | `LIMIT/OFFSET` + 总数分开查                                                         |
| `cors()` 全开                                             | 本地无所谓，但这类配置不能带到公网                 | 线上无后端，天然规避；本地用 Vite proxy 甚至可以不要 cors                           |

### 2.3 技术选型建议：用 `node:sqlite`，不用 sql.js

本机 Node 22.22.2 **实测可直接 `require('node:sqlite')`**（`DatabaseSync` 可用，只有一条 experimental 警告）：

```js
import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('data/app.db');
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
const list = db.prepare('SELECT id,title FROM articles ORDER BY created_at DESC LIMIT ?').all(20);
```

对比：

| 方案                    | 安装                     | 写盘                | 事务/索引      | 备注                                                  |
| ----------------------- | ------------------------ | ------------------- | -------------- | ----------------------------------------------------- |
| **node:sqlite（推荐）** | 零依赖                   | 真实文件增量写      | 支持           | Node 22 起内置，API 仍标 experimental（本地工具够用） |
| better-sqlite3          | 需原生模块（有预编译包） | 同上                | 支持           | API 稳定，Windows 上偶发编译问题                      |
| sql.js（demo 用的）     | 纯 wasm，无需编译        | **每次全量 export** | 支持但落盘笨重 | 适合"只读打开 .db"，不适合当写库                      |

---

## 3. 推荐架构：一套模型，两种数据源

### 3.1 总览

| 场景            | 后端                 | 数据形态                                        | 能力                     |
| --------------- | -------------------- | ----------------------------------------------- | ------------------------ |
| 本地 `pnpm dev` | Express（`server/`） | `data/app.db`（SQLite）+ `data/articles/*.json` | 增删改查、自动保存、上传 |
| 线上 Netlify    | **无**（纯静态）     | 构建时导出的 `dist/data/*.json`                 | 列表、详情、搜索、只读   |

关键点：**页面/组件不感知数据从哪来**，只依赖一个数据访问层；`import.meta.env.PROD` 决定装配哪个实现。

### 3.2 为什么线上用 JSON 快照，而不是原设计里的"浏览器开 .db"

| 方案                              | 首屏                           | 额外下载               | 查询能力                 | 改造量                         | 结论                   |
| --------------------------------- | ------------------------------ | ---------------------- | ------------------------ | ------------------------------ | ---------------------- |
| **A. 构建时导出 JSON 快照**       | 最快（索引几十 KB）            | 无                     | 列表/详情/内存过滤，够用 | 小                             | ✅ 推荐                |
| B. 浏览器 sql.js 打开导出的 .db   | 慢：要等 wasm + 整个 db 下载完 | wasm ≈ 1.2MB + db 全量 | 完整 SQL                 | 中（要处理 wasm 加载、内存态） | 可作 Plan B            |
| C. Netlify Functions + 托管数据库 | 中                             | 无                     | 完整 CRUD                | 大（选型 + 账号 + 密钥）       | 只有"线上也要写"才需要 |

B 的致命点不是"能不能跑"，而是**你线上只需要读**：为了读一篇文章，让用户先下 1MB wasm 和一个可能几 MB 的库文件，再用 SQL 查出等价于一个 JSON 字段的内容——不划算。A 还能把正文拆成单篇文件按需取。

### 3.3 数据分层（A 方案）

```text
public/data/                    # 构建产物，进 dist/
├── meta.json                   # 分类 + 标签 + 总数（首页/导航一次取完，几 KB）
├── articles.json               # 列表索引：id/title/summary/category/tags/date/reads（不含正文）
└── content/<articleId>.json    # 单篇 Slate 正文，详情页按需 fetch
```

判定规则很简单：**如果全部文章（含正文）gzip 后 < 500KB，可以偷懒把正文也塞进 `articles.json`**，详情页就能保持同步渲染；超过就拆分。360 篇短文的量级大概率在临界点附近，先按拆分做，后面想合并只改导出脚本。

### 3.4 数据访问层（保证页面少改）

```text
src/data/
├── articles.ts          # 保留：类型 + 同步 helper（改为读内存 store，签名不变）
├── store.ts             # 内存态：categories / tags / articles / contentCache
├── bootstrap.ts         # 启动装配：dev → /api，prod → /data/*.json
└── repositories/
    ├── api.ts           # 本地：fetch('/api/...')，支持 CRUD
    └── static.ts        # 线上：fetch('/data/...')，只读
```

**让 5 个页面零改动的关键技巧**：`main.tsx` 里先 await 一次 `bootstrapData()` 再 render，
快照灌进模块级 store；之后 `getArticleById` / `ALL_CATEGORIES` / `ARTICLES` 这些同步 API
照旧工作，只是背后从"硬编码数组"变成"store 里的数组"。

```tsx
// main.tsx
bootstrapData()
  .catch((e) => console.warn('[data] 快照加载失败，降级到内置示例数据', e))
  .finally(() => root.render(<App />));
```

找不到快照/接口不通时**降级到现有的 360 篇生成数据**，站点永远不会白屏。

详情页正文按需加载需要一个小 hook（唯一要动的页面）：

```ts
const content = useArticleContent(article.id); // 命中 contentCache 直接返回，未命中则 fetch 并缓存
```

---

## 4. 本地后端设计（`server/`）

### 4.1 目录（沿用设计文档，补上迁移）

```text
server/
├── index.mjs               # 装配中间件、挂载路由、监听 3001
├── config.mjs              # 端口、storageRoot、上传限制
├── db/
│   ├── connection.mjs      # DatabaseSync、WAL、foreign_keys
│   ├── schema.sql          # 建表语句（单一来源）
│   └── migrate.mjs         # schema_version 顺序迁移
├── models/                 # article / category / tag / media
├── routes/                 # articles / categories / tags / upload
└── services/               # 唯一性校验、autosave 编排、事务边界
```

### 4.2 表结构（与前端现有类型对齐）

```sql
CREATE TABLE IF NOT EXISTS category (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT, icon TEXT, desc TEXT, cover TEXT,       -- 前端 Category 的扩展字段
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tag (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  summary TEXT,
  category_id TEXT REFERENCES category(id),
  content_path TEXT NOT NULL,                          -- articles/<id>.json
  status TEXT NOT NULL DEFAULT 'draft',                -- draft | published
  reads INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_articles_cat ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status, created_at DESC);

CREATE TABLE IF NOT EXISTS article_tag (
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id     TEXT NOT NULL REFERENCES tag(id)     ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY, kind TEXT NOT NULL, rel_path TEXT NOT NULL,
  article_id TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS schema_version (version INTEGER NOT NULL);
```

> `status` 是**发布闸门**：导出脚本只导 `published`，草稿天然不会上静态站。

### 4.3 API 清单

| 方法                | 路径                                              | 说明                                                |
| ------------------- | ------------------------------------------------- | --------------------------------------------------- |
| GET                 | `/api/articles?category=&tag=&q=&page=&pageSize=` | 列表（只回索引字段，正文不带）                      |
| GET                 | `/api/articles/:id`                               | 元数据 + 正文                                       |
| POST                | `/api/articles`                                   | 创建（标题唯一校验，冲突 409）                      |
| PUT                 | `/api/articles/:id`                               | 更新（正文 + 元数据 + 标签，**单事务**）            |
| PATCH               | `/api/articles/:id/autosave`                      | 只写正文 + `updated_at`，给编辑器节流用             |
| DELETE              | `/api/articles/:id`                               | 删除（可选软删到 `status='trashed'`）               |
| GET/POST/PUT/DELETE | `/api/categories`、`/api/tags`                    | 同上，名称唯一                                      |
| POST                | `/api/upload`                                     | multer + sharp → `data/media/images/`，返回相对路径 |
| GET                 | `/api/health`                                     | 探活                                                |

### 4.4 开发期接线

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': 'http://localhost:3001',
    '/media': 'http://localhost:3001',   // 本地直接看上传的图
  },
},
```

两条命令并行：`pnpm dev`（前端）+ `pnpm dev:server`（后端）。要一条命令就用 `concurrently`，
或者写个 `scripts/dev-all.mjs` 起两个子进程（避免多装一个依赖）。

---

## 5. 导出脚本（线上数据从哪来）

`scripts/export-static-data.mjs`（用 `node:sqlite` 只读打开，不依赖后端进程）：

```js
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const db = new DatabaseSync('data/app.db', { readOnly: true });
const OUT = 'public/data';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(`${OUT}/content`, { recursive: true });

const categories = db.prepare('SELECT * FROM category ORDER BY created_at').all();
const tags = db.prepare('SELECT * FROM tag ORDER BY created_at').all();
const rows = db
  .prepare(
    `SELECT a.id, a.title, a.summary, a.category_id, a.reads,
            date(a.created_at) AS date, a.content_path,
            group_concat(at.tag_id) AS tags
       FROM articles a
       LEFT JOIN article_tag at ON at.article_id = a.id
      WHERE a.status = 'published'
      GROUP BY a.id
      ORDER BY a.created_at DESC`,
  )
  .all();

fs.writeFileSync(
  `${OUT}/articles.json`,
  JSON.stringify(rows.map((r) => ({ ...r, tags: r.tags ? String(r.tags).split(',') : [] }))),
);
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify({ categories, tags }));

for (const r of rows) {
  const src = path.join('data', r.content_path);
  const content = JSON.parse(fs.readFileSync(src, 'utf8'));
  fs.writeFileSync(`${OUT}/content/${r.id}.json`, JSON.stringify(content));
}

console.log(`✅ 导出 ${rows.length} 篇 / ${categories.length} 分类 / ${tags.length} 标签 → ${OUT}`);
```

`package.json`：

```json
"scripts": {
  "dev": "vite",
  "dev:server": "node --watch server/index.mjs",
  "db:migrate": "node server/db/migrate.mjs",
  "export:data": "node scripts/export-static-data.mjs",
  "build": "node scripts/export-static-data.mjs && tsc -b && vite build"
}
```

> `tsc -b` 只检查 `src` 与 `vite.config.ts`，`server/*.mjs` 与 `scripts/*.mjs` 不进类型检查，不会拖累构建。

**`public/data` 是产物，写进 `.gitignore`**；但 **`data/`（db + 正文 json）必须进 git**——
不然 Netlify 构建时没有源数据可导。单人项目里几百 KB 的 db 进 git 完全可接受；
如果哪天怕二进制冲突，改成"以 `data/articles/*.json` + `data/meta.json` 为真相、db 只做本地索引"
（`pnpm db:rebuild` 随时重建），代价是多一层同步逻辑。

---

## 6. 部署到 Netlify：让线上真的能读

四件事，缺一件就会白屏或 404。

### 6.1 SPA 回退（当前缺失，最可能"打不开"的原因）

```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

# 所有前端路由回退到 index.html；静态文件优先命中，不会被这条覆盖
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

> 没有这条：`/article/frontend-t0-v1`、`/demo` 这类深层链接会直接 404（Netlify 按文件路径找）。
> 首页能开、点进去就 404 —— 这是最常见的"部署后不能阅读"。

### 6.2 数据产物必须真的进 `dist/`

`public/data/*` 会被 Vite 原样拷到 `dist/data/*`。构建命令里已串了导出脚本，所以：

- 本地 `pnpm build` 会先导出再打包；
- Netlify 构建同理（前提：`data/app.db` 在仓库里）。

构建后自检一次：`ls dist/data` 应该有 `meta.json`、`articles.json`、`content/`。

### 6.3 前端切静态数据源

```ts
// src/data/bootstrap.ts
import.meta.env.PROD
  ? loadStaticData() // fetch('/data/meta.json' + '/data/articles.json')
  : loadApiData(); // fetch('/api/...')
```

`loadStaticData` 失败时降级到内置示例数据并 `console.warn`，保证线上至少可读。

### 6.4 缓存策略

```toml
[[headers]]
  for = "/data/*"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

`/assets/*` 是 Vite 带 hash 的资源，可长缓存；`/data/*` 文件名是固定的，**必须短缓存/重验证**，
否则发完新文章用户还在看旧列表。要更彻底就导出时给文件名加 hash（`articles.<hash>.json`），
由 `meta.json` 指向它。

### 6.5 线上只读守卫

- 用 `import.meta.env.PROD` 关掉"新建 / 编辑 / 删除 / 上传"入口（不是隐藏按钮就行，路由层也要拦）。
- `/demo` 在生产环境默认 `readOnly = true`；否则用户以为在编辑，刷新就丢（只有 localStorage）。
- 文章页的 `BookEditor` 在生产环境也走只读，避免"编辑了但没保存"的误解。

### 6.6 发布前的隐私检查

静态快照 = **全站公开**。导出脚本只导 `status='published'`，并且确认：
草稿、私密文章、含真实姓名的图片都不会被打进 `dist/`。

---

## 7. 落地顺序（每步都能独立验收）

| 步骤      | 内容                                                                | 验收标准                                                |
| --------- | ------------------------------------------------------------------- | ------------------------------------------------------- |
| 0         | 修 `persistKey` 串号 bug                                            | 打开 A 编辑后，打开 B 显示 B 自己的内容                 |
| 1         | `src/data/store.ts` + `bootstrap.ts`，把 `articles.ts` 改成读 store | 页面表现与现在完全一致，`tsc -b` 通过                   |
| 2         | `server/` 骨架 + schema + 迁移                                      | `pnpm db:migrate` 生成 `data/app.db`；`/api/health` 200 |
| 3         | articles / categories / tags CRUD + 标题唯一 + 事务                 | curl 能建/改/删，重复标题返回 409                       |
| 4         | 编辑器接 `/api/articles/:id/autosave`                               | 输入 1s 后 db 里 `updated_at` 变化                      |
| 5         | `export-static-data.mjs`                                            | `pnpm export:data` 产出 3 类文件                        |
| 6         | `netlify.toml` + 构建命令 + 只读守卫                                | `netlify deploy --prod` 后深层链接可读、刷新不 404      |
| 7（可选） | 上传（multer + sharp）、画板、回收站                                | 图片落 `data/media/images/`，正文存相对路径             |

粗估：0~1 步半天，2~3 步 1~1.5 天，4~6 步 1 天，7 按需。

---

## 8. 备选与后续扩展

- **线上也要写**：不要用 Netlify Functions 存 SQLite（`/var/task` 只读、`/tmp` 随实例销毁）。
  换 Turso（libSQL，SQLite 语法几乎无缝）/ Supabase / Neon，数据访问层再加一个 `repositories/remote.ts`
  即可，页面代码不动。
- **不想构建时导出**：改成"本地改完 → `pnpm export:data` → 提交快照 → 推 git 触发 Netlify"。
  本质仍是快照，只是把导出动作前移到人工。缺点是忘了导出就会发布旧数据。
- **媒体文件变大**（视频）：`data/media/videos` 别进 git，走对象存储（Cloudflare R2 / 腾讯云 COS），
  库里只存相对 key，前缀由一处配置拼接（设计文档第 5 节的 `prefix + rel_path` 正好覆盖）。

---

## 9. 需要你拍板的三件事

1. **数据真相放哪**：`data/app.db` 进 git（最简，单源）；还是"每篇一个 JSON 进 git、db 只做本地索引"
   （git 友好、可 diff，但要多写一层同步）？
2. **详情页正文**：接受"按需 fetch 单篇"（首屏更快，详情页加个 loading），
   还是要求同步渲染（导出时把正文塞进 `articles.json`，体积大一点）？
3. **线上是否需要编辑能力**：如果确定只读，就走完全静态；如果偶尔想在线改，就要引入托管数据库，成本和复杂度上一个台阶。

---

## 10. 实际实现（2026-10-17，已定稿并落地）

三条决定改变了原方案的几处细节，以本节为准：

1. **数据库只做索引**：库里只有 `title / summary / category_id / rel_path / created_at / updated_at / reads / status` + `article_tag` 关联表，**正文永不入库**。
2. **文件是唯一真相**：`data/articles/<id>.json`（一篇一个文件，含元数据 + Slate 正文）是可提交、可 diff、可回滚的资产；
   `data/index.db` 是可丢弃的缓存，服务启动时**从文件全量重建**，因此不存在库与文件不一致的问题。
3. **线上不需要"转换"**：导出脚本读的就是同一批 JSON，只需要把正文从列表索引里剥出来、按篇拆文件。

### 10.1 目录（已建立）

```text
data/
├── meta.json               # 分类 + 标签（文本，进 git）
├── articles/<id>.json      # 文章：元数据 + 正文（进 git）
├── drawboards/             # 画板（预留，当前画板数据内嵌在文档节点里）
├── media/{images,files,videos}/   # 媒体，库里/文档里只存相对地址
├── index.db                # SQLite 索引（gitignore，可随时重建）
└── .trash/                 # 软删除（gitignore，可人工恢复）
```

### 10.2 本地后端（零依赖）

`server/` 用 `node:http` + `node:sqlite`，没有 express/multer/sql.js：

| 文件           | 职责                                                       |
| -------------- | ---------------------------------------------------------- |
| `config.mjs`   | 路径与端口（全部 `path.join(__dirname, ...)`，不依赖 cwd） |
| `articles.mjs` | 文件读写（原子写：`.tmp` + `rename`）、扫描、软删          |
| `db.mjs`       | 索引建表、从文件重建、列表查询、标题查重                   |
| `router.mjs`   | 极简 `:param` 路由（将来换 Express 只改这层）              |
| `index.mjs`    | HTTP 装配、REST 路由、`/media` 静态托管                    |

接口：`GET /api/health`、`GET /api/meta`、`GET /api/articles[?category=&tag=&q=]`、
`GET /api/articles/:id`、`POST /api/articles`、`PUT /api/articles/:id`、
`PATCH /api/articles/:id/autosave`、`DELETE /api/articles/:id`、`POST /api/rebuild`、
`POST /api/upload?kind=images`（原始字节流 + `X-Filename`，不引 multipart 依赖）。

> 两个本地环境的坑已处理：
> ① `unlink` 在某些环境会被安全删除 shim 拦截 → 删除一律走 `rename` 到 `data/.trash/`；
> ② 写库先落文件再更新索引，索引失败可由下次启动自愈。

### 10.3 前端数据层

```text
src/data/
├── types.ts       # Category / Tag / ArticleIndex / Article
├── store.ts       # 内存快照 + 正文缓存 + canWrite()
├── demo-data.ts   # 内置示例数据（接口不可用时的兜底）
├── bootstrap.ts   # dev→/api，prod→/data/*.json；loadArticle / create / autosave / delete
└── articles.ts    # 同步选择器（页面几乎不用改）
```

- `main.tsx` 先 `bootstrapData()` 再 render，页面继续用同步选择器；
- 详情页正文按篇懒加载，缓存以 `{ id, content }` 成对存放，切文章不会闪上一篇；
- 编辑器新增 `onSave`（内部 400ms 防抖 + 卸载时补交），文章页 `persistKey=""` 关掉 localStorage，
  避免「服务端内容」和「本地缓存」两个真相打架；
- `canWrite()`（数据源为 api）才出现「新建 / 删除」入口，线上自动只读。

### 10.4 命令

```bash
pnpm seed          # 首次：建目录 + 6 篇起始文档（已存在则跳过）
pnpm dev:server    # 本地 API（3001，--watch）
pnpm dev           # 前端（5173，/api 与 /media 已代理到 3001）
pnpm export:data   # 生成 public/data（meta / 列表索引 / 单篇）+ 拷贝 media
pnpm build         # export:data && tsc -b && vite build
```

### 10.5 线上验证结果（本地模拟）

- `dist/data/{meta,articles}.json` + `dist/data/articles/<id>.json` 均已生成；
- `vite preview` 下 `/data/*` 正常返回，`/article/<id>`、`/demo` 深链返回 200；
- `netlify.toml` 里 `/* → /index.html 200` 保证 Netlify 上同样的深链不会 404。

**发布前必看**：`data/`（meta + articles + media）要提交进 git；`public/data`、`public/media`、
`data/index.db`、`data/.trash` 已在 `.gitignore` 里。草稿（`status != published`）不会被导出。

---

## 11. 分类与标签维护（2026-10-17 追加）

分类/标签不再是写死的常量，`data/meta.json` 就是它们的真相文件，可增删改。

### 11.1 规则

| 规则                                                           | 实现位置                                                                            |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 名称唯一（同表内，忽略大小写与多余空格）                       | `server/meta.mjs` 的 `assertUniqueName`，冲突返回 **409**                           |
| 重命名只改名字，文章靠 `category_id` / `tag_id` 关联，不受影响 | 关联表存 id，不存名字                                                               |
| 有文档在用时禁止删除                                           | `countArticlesByCategory` / `countArticlesByTag`，返回 409 并带上篇数               |
| 分类封面可上传，未上传用默认封面                               | `POST /api/categories/:id/cover`（原始字节流）；默认 `/covers/category-default.svg` |
| 封面只存相对地址                                               | `media/images/covers/<id>-<ts>.jpg`，前端 `assetUrl()` 拼前缀                       |

### 11.2 接口

```text
POST   /api/categories            { name, color?, icon?, desc? }        → 201 + 全量 meta
PUT    /api/categories/:id        { name?, color?, icon?, desc?, cover? }
DELETE /api/categories/:id        被引用时 409（带篇数）
POST   /api/categories/:id/cover  原始字节流 + X-Filename + Content-Type: image/*
POST   /api/tags                  { name, color? }
PUT    /api/tags/:id              { name?, color? }
DELETE /api/tags/:id              被引用时 409
```

> 每个写接口都返回**完整 meta**，前端直接覆盖内存态，避免「分类改了但标签丢了」这类漂移。

### 11.3 前端

- 入口：首页「管理分类 / 标签」（仅本地可写模式出现）。
- 面板 `src/components/TaxonomyManager`：就地编辑——改名失焦提交、点色块即换色、封面点击上传、删除走确认气泡。
- 首页分类卡片改为「封面 + 内容」结构：有封面用封面，没有用默认封面。
- 写操作失败（重名、还有文档在用）会把服务端原因直接显示在面板顶部。
