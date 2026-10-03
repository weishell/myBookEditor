# MyBook Editor 后台与存储设计

> 状态：**仅设计，未动工** ｜ 本文档先落库存档，作为后续实现的设计依据。
> 参考仓库内 `demo/`（Vue3 + Express + sql.js/SQLite 可移植库）的思路，为主编辑器（React + Slate + Antd）接入后台与数据库。

---

## 1. 目标与背景

当前主编辑器（`myBookEditor`）的文章/类型/标签是**纯前端演示数据**（见 `src/data/articles.ts`），刷新即失，无法长期保存。

本设计目标：

- **本地**：拥有完整后台（Express + sql.js），文章可增删改查、即时保存，数据落在本地可移植的 `.db` + 目录文件。
- **线上**：发布到 Netlify（纯静态、无常驻进程）后**零后台、零付费数据库**——由前端用 sql.js（WASM）在浏览器内打开「导出的只读 `.db`」直接查询阅读。
- 同一套表结构与 SQL，本地可写、线上只读，改动面最小。

---

## 2. 总体架构：一套数据，两种运行模式

| 场景             | 后台              | 数据库                                 | 读写                    |
| ---------------- | ----------------- | -------------------------------------- | ----------------------- |
| **本地开发**     | Express（分模块） | sql.js + 本地 `data/app.db` 文件       | 完整增删改查 + 即时保存 |
| **线上 Netlify** | 无后台（纯静态）  | sql.js 在浏览器打开「导出的 `app.db`」 | 只读                    |

- 本地 `/api/...` 接 Express；线上前端 `dataAccess` 层切到浏览器端 sql.js 直接查询。
- 导出脚本在发布前把 `data/app.db` + 媒体文件打进 `dist/` 静态目录。

---

## 3. 存储目录规划

所有资源落地为**相对地址**，根目录由一处配置统一给出（见第 5 节）。

```
data/                       # 运行时数据根目录（本地后台持）
├── app.db                  # sql.js / SQLite 数据库文件（元数据）
├── articles/               # ① 文章 JSON（Slate 内容，一人一文件）
│   └── <articleId>.json
├── drawboards/             # ⑥ 画板 JSON（画板独立成文件夹）
│   └── <boardId>.json
└── media/                  # ⑦ 各类媒体资源，各建独立子目录
    ├── images/             #   图片
    ├── files/              #   文件
    └── videos/             #   视频
```

> 说明：
>
> - 数据库只存**文章的元数据 + 内容相对路径**；文章正文（Slate JSON）单独存到 `articles/` 文件夹，避免把大 JSON 塞进 DB。
> - 画板、图片、文件、视频同理，各自独立目录，便于导出、备份与后期迁移。

---

## 4. 数据库表设计（`app.db`）

采用与 `demo/` 一致的 sql.js 建表方式，沿用「实体表 + 关联表」。

### 4.1 文章表 `articles`

| 字段           | 类型     | 说明                                             |
| -------------- | -------- | ------------------------------------------------ |
| `id`           | TEXT PK  | 文章 ID（uuid 或自增）                           |
| `title`        | TEXT     | 文章标题（**唯一**，创建/更新时校验）            |
| `content_path` | TEXT     | 文章 Slate JSON 相对路径，如 `articles/xxx.json` |
| `category_id`  | TEXT FK  | 所属类型（作品类型，见 4.2）                     |
| `created_at`   | DATETIME | 创建时间                                         |
| `updated_at`   | DATETIME | 修改时间                                         |

> 标签不直接放文章表，走关联表（4.4），避免逗号拼串难维护。

### 4.2 类型表 `category`（作品类型）

| 字段         | 类型      | 说明                                |
| ------------ | --------- | ----------------------------------- |
| `id`         | TEXT PK   |                                     |
| `name`       | TEXT      | 类型名（**唯一**，创建/更新时校验） |
| `cover`      | TEXT NULL | 类型封面相对路径，**可传可不传**    |
| `created_at` | DATETIME  |                                     |
| `updated_at` | DATETIME  |                                     |

> 对应现有前端 `Category`（已有 `color`/`icon`/`desc`，可保留为扩展字段，核心字段为 `name` + `cover`）。

### 4.3 标签表 `tag`

| 字段         | 类型     | 说明                                |
| ------------ | -------- | ----------------------------------- |
| `id`         | TEXT PK  |                                     |
| `name`       | TEXT     | 标签名（**唯一**，创建/更新时校验） |
| `created_at` | DATETIME |                                     |

### 4.4 文章-标签关联表 `article_tag`

```text
PK(article_id, tag_id)
```

多对多关系，一篇文章可挂多个标签，一个标签可归属多篇文章。

### 4.5 画板表 `drawboard`

| 字段           | 类型      | 说明                                         |
| -------------- | --------- | -------------------------------------------- |
| `id`           | TEXT PK   |                                              |
| `name`         | TEXT      | 画板名                                       |
| `content_path` | TEXT      | 画板 JSON 相对路径，如 `drawboards/xxx.json` |
| `article_id`   | TEXT NULL | 可选：归属某篇文章                           |
| `created_at`   | DATETIME  |                                              |
| `updated_at`   | DATETIME  |                                              |

### 4.6（建议）媒体表 `media`

记录已上传的图片/文件/视频，便于引用、复用与孤儿文件清理。

| 字段         | 类型      | 说明                          |
| ------------ | --------- | ----------------------------- |
| `id`         | TEXT PK   |                               |
| `kind`       | TEXT      | `images` / `files` / `videos` |
| `rel_path`   | TEXT      | 相对路径                      |
| `article_id` | TEXT NULL | 归属文章                      |
| `created_at` | DATETIME  |                               |

---

## 5. 相对路径与前缀拼接约定（重点）

**数据库与文章 JSON 内一律只存相对地址**，不写死绝对路径/域名；展示时统一使用一处配置的前缀拼接。

### 5.1 存储形式

统一形如：

```text
articles/<articleId>.json
drawboards/<boardId>.json
media/images/xxx.webp
media/files/xxx.pdf
media/videos/xxx.mp4
```

### 5.2 前缀配置

在「某一处」集中配置，切换环境只改这里：

- 本地：`/data/`（磁盘根目录）或 Express 静态根
- 线上：`/`（静态根）或 CDN 域名

前端请求资源时：`prefix + rel_path` 拼接后使用；后端读写文件时：`storageRoot + rel_path`。

> 目标：后期换目录、换域名、迁 CDN，只改配置一处，全站生效。

---

## 6. 类型（作品类型）设计与交互

- 类型是**单独字段**，维护/选用均通过**弹框**完成。
- 类型实体 = **类型名 + 类型封面**。
  - 类型名：必填，文本输入，**创建/更新时校验唯一**。
  - 类型封面：选填，**可传可不传**，可上传图片（走后端压缩、落到 `media/images/`）。
- 弹框内提供类型列表：预览封面缩略图 + 名称；支持新增、编辑、删除、选择当前类型。

---

## 7. 标签设计与交互

- 标签通过**弹框**维护/选用（多选）。
- 每个标签有独立名称；**创建/更新时校验唯一**，避免重复标签。
- 弹框具备：已有标签勾选、输入快速新增、重名拦截提示。

---

## 8. 创建 / 更新流程与唯一性校验

### 8.1 创建文章

1. 前端弹框填标题、选类型、勾标签，正文由编辑器产生 Slate JSON。
2. 提交到后端 `POST /api/articles`：
   - 校验标题唯一（查 `articles` 表 title）；
   - 生成 `articleId`，写 `articles/<id>.json`（正文 + 相对资源地址）；
   - 落库元数据（`category_id`、`created_at`），写 `article_tag`。

### 8.2 更新文章

1. 前端把最新 JSON、标题、类型、标签提交到 `PUT/PATCH /api/articles/:id`。
2. 后端校验唯一性：
   - 标题：`title` 唯一（排除自身）；
   - 类型名/标签名若在过程中新增，同样校验唯一。
3. 更新 `content_path` 内容文件 + 元数据 `updated_at`，重算 `article_tag`。

### 8.3 唯一性校验汇总

| 对象                   | 校验时机        | 规则     |
| ---------------------- | --------------- | -------- |
| 文章标题 `title`       | 创建 / 更新     | 全局唯一 |
| 类型名 `category.name` | 新建 / 编辑类型 | 全局唯一 |
| 标签名 `tag.name`      | 新建 / 编辑标签 | 全局唯一 |

---

## 9. 后端即时保存功能

- 后端负责文章**及时保存**（自动保存），避免用户手动反复点保存。
- 方案：前端编辑防抖（如停止输入 1–2 秒）后，增量/全量提交到后端 `POST /api/articles/:id/autosave`。
  - 后端把 Slate JSON 写入对应 `articles/<id>.json`；
  - 更新 `articles.updated_at`；
  - 若类型/标签有变更，一并落库。
- 可叠加「保存中 / 已保存 / 保存失败」状态提示，失败重试。

---

## 10. 画板存储

- 画板独立成 **`drawboards/` JSON 文件夹**，与文章正文分开。
- 画板数据（节点、坐标、连线等）序列化为一个 JSON 文件，路径 `drawboards/<boardId>.json`。
- 元数据入 `drawboard` 表；可选关联所属文章 `article_id`。

---

## 11. 图片 / 文件 / 视频存储

- 各类媒体资源在 `media/` 下**各建对应子目录**：`images/`、`files/`、`videos/`。
- 上传统一走后端 `multer`（限 5MB）→ `sharp` 压缩（本地环境）→ 落到对应子目录。
- 数据库/文档内存放**相对地址**（如 `media/images/xxx.webp`），展示时拼前缀。
- 建议在标题 5.1、DB 4.6 中登记到 `media` 表，便于复用与清理。

---

## 12. 本地后端模块划分

不重蹈 `demo/server/index.js` 单文件难以维护的覆辙，按模块拆分，单点改动不影响整体回归：

```
server/
├── index.js                 # 入口：装配中间件、挂载路由、启动
├── config/
│   ├── index.js             # 端口、storageRoot、上传限制、压缩参数
│   └── paths.js             # 各资源相对路径的前缀定义
├── db/
│   ├── connection.js        # sql.js 初始化、app.db 读写、export() 落盘
│   └── schema.js            # 建表语句（集中一处）
├── models/                  # 数据访问层：拼接 SQL
│   ├── article.js
│   ├── category.js
│   ├── tag.js
│   ├── drawboard.js
│   └── media.js
├── routes/                  # Express Router 分层
│   ├── articles.js
│   ├── categories.js
│   ├── tags.js
│   ├── drawboards.js
│   └── upload.js
├── controllers/             # 路由 → service 薄壳
├── services/                # 业务逻辑（唯一性校验、即时保存编排）
├── middleware/              # 错误处理、校验、静态文件服务
├── utils/
│   ├── file-path.js         # rel_path 与磁盘路径互转、前缀拼接
│   └── image.js             # sharp 压缩
└── scripts/
    └── export-readonly.js   # 导出只读 .db + 媒体到线上静态目录
```

---

## 13. 前端接入层与路径切换

- 新增数据访问抽象层（如 `src/data/` 下的 `dataAccess.ts`），暴露**同一套接口**：
  - **API 模式**（本地）：`fetch/axios` 调 `/api/...`，支持全量 CRUD + 上传 + 即时保存。
  - **Local-SQLite 模式**（线上）：用 sql.js 打开导出的 `app.db`，跑同样语义的只读查询。
- 页面/组件不感知后端是哪个，只依赖 `dataAccess`。
- **线上模式必须禁用/隐藏写入口**（线上写入刷新即丢），避免误操作。
- 资源前缀统一由配置模块注入（见第 5 节）。

---

## 14. 导出与发布到 Netlify

1. 本地用完整后台维护数据。
2. `node server/scripts/export-readonly.js`：
   - 将 `app.db` 导出为只读副本，打进 `dist/data/app.db`；
   - 将 `media/` 与 `articles/`、`drawboards/` 拷入 `dist/` 静态目录（若需离线阅读可一并内置）。
3. `netlify deploy`（静态目录 = `dist`）。
4. 上线后前端 `dataAccess` 走本地-sqlite 只读模式；零后台、零付费 DB。

> 上线即公开：发布前检查是否有隐私图片/数据。

---

## 15. 待决事项 / 开放问题

- [ ] 文章 `id` 用 UUID 还是自增整数（相对路径已按 id 命名，建议 UUID 便于迁移）。
- [ ] 类型是否需要保留现有前端 `color`/`icon`/`desc` 字段（作为扩展，非必须）。
- [ ] 线上是否也要「画板/隐私文章」只读可见，还是整体仅收录公开文章。
- [ ] 文章 JSON 中嵌入的媒体地址，是否需要「相对地址统一改写」脚本（文章内容里现在可能是绝对路径）。
- [ ] 是否需要版本/历史记录（自动保存是否覆盖旧版）。

---

## 16. 里程碑（按顺序推进）

1. 30 分钟验证：浏览器内 `sql.js` 打开 Node 生成的 `.app.db` 并查询（可行性验证）。
2. 搭建 `server/` 模块骨架 + `data/` 目录结构与建表。
3. 实现类型的弹框维护 + 唯一性校验。
4. 实现标签的弹框维护 + 唯一性校验。
5. 实现文章创建 / 更新 / 列表加载 + 相对路径存取。
6. 实现文章即时保存（autosave + 状态提示）。
7. 画板 JSON 存取与列表。
8. 图片 / 文件 / 视频上传与目录落盘。
9. `dataAccess` 接入层 + 本地/线上模式切换。
10. `export-readonly` 导出脚本 + Netlify 发布 + 端到端只读验证。
