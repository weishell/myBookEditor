# myBookEditor · 项目长期记忆

## 构建 / 校验

- build: `node scripts/export-static-data.mjs && tsc -b && vite build`（Netlify 同）。tsc 报错→部署失败。
- 交付前必跑 `node node_modules/typescript/bin/tsc -b`（Git Bash 下 pnpm shim 路径会坏，直接用 node 调 tsc）。
- 本地 `vite build` 会因沙箱拦截清 `dist/assets` 失败——本地限制非代码问题，看到 `✓ N modules transformed` 即 OK。
- 按文件统计报错：`tsc -b 2>&1 | grep -oE "^src/[^(]+" | sort | uniq -c | sort -rn`

## 性能 / 分包（2026-11-15 起）

- 路由级 `React.lazy`（`App.tsx` 全部页面含 `@/core`）。`<Suspense>` **只包 `<Routes>`**，否则顶栏跟着重挂。
- `vite.config.ts` manualChunks 里 **必须**给 `vite/preload-helper` 单独切 `vite-helper`：否则 `__vitePreload`
  被打进共享 chunk（drawui-vendor），首屏为了拿 helper 把 726 kB 画板库一起下载。
- 重依赖一律动态 `import()`：drawui-react（DrawboardEditor）、emoji-mart（IconPicker）、docx-preview（renderAsync）、
  echarts（`plugins/chart/echarts-loader.ts#loadEcharts`，含 wordcloud 副作用注册）、katex CSS。
- **顶层组件（App.tsx 静态树内）一律不许静态 import slate / slate-react**。已拆：`find-replace`（slate 用法搬进
  动态加载的 `find-ops.ts`，`find-utils.ts` 只留 type + `typeof x.text==='string'`）、`InlineToast`（`manager.ts` 纯状态，
  `showCursorToast.ts` 带 slate）。再加组件时先看它在不在首页链上。
- 只要组件里静态 import 了重组件，lazy 就失效。把纯函数/类型抽成独立文件（如 `components/IconPicker/render-value.tsx`）再引。
- 实测：入口 3325 kB / gzip 993；首页 1293 → **308 kB**；无图表文章页 1158 → **783 kB**；`/demo`（真含 5 个图表）1154 → 1158。
- chart-utils.ts 里 echarts 只能用 `import type`（它只消费 `EChartsOption` 类型），改回静态 import 就把 376 kB 拉回文档页。
- App.module.less 里**不能用 `fade(@text-primary, 14%)`**：`@text-*` 是 `var(--dm-*)`，Less 求值失败。

## 生产包日志（vite.config.ts）

- `defineConfig` 是函数式，按 `command` 分支：build 时开 `esbuild.pure`（log/debug/info/table/trace/dir）+ `drop:['debugger']`，
  dev 传 `undefined` 保留调试日志。
- **`drop: ['console']` 是坑**：error/warn 一起没了；只能 `pure` 精确列出要删的那几个方法。
- **`pure` 单独不删代码**，只打 `/* @__PURE__ */` 注释，靠 minify 阶段 tree-shaking 才真删 → 依赖默认 `minify:'esbuild'`。
- `pure` 会连同参数整段删，所以 `console.log(getX())` 里的 getX() 不会执行。写日志别把有副作用的调用塞进参数。

## 文档标题块 HEADING_TITLE（重要）

- 文档默认大标题块 `type:'heading-title'`，`attrs={author,date}`，`children=[{text:标题}]`；`/demo` 的 `initial-value.ts` 有范例。
- `withDelete.ts` 强制“最后一个 HEADING_TITLE 不可被移除，只能清空文本”；编辑器本身**不自动补**，缺了就没有标题块。
- 约定：新建文章（`bootstrap.ts` createArticle 默认值）与内置示例（`demo-data.ts`）都必须带一个 HEADING_TITLE 块；
  真实文章 `data/articles/*.json` 正文顶部也应放一个（文字取元数据 `title`）。
- 渲染兜底：`attrs.author||'青柠脉动'`、`attrs.date||今天`。

## Slate 坑（高频）

- import slate 时给 `Element/Node/Text` 起别名（如 `Element as SlateElement`），否则遮蔽 DOM 全局 Element 报一片 TS 错。
- 类型根在 `src/core/types.ts` 的 `declare module 'slate'`。新增 text mark 记得往 `CustomText` 加字段。
- 自绘+void 元素（公式/提及/图表/画板/倒计时…）：改数据用 `Editor.nodes({voids:true,match})` + `Transforms.setNodes({attrs},{at:path,voids:true})`。
- 软换行：`insertSoftBreak` = `splitNodes({always:true})` 拆块不写 `\n`；正确做法 `Transforms.insertText(editor,'\n')`，且 `[data-slate-string]{white-space:pre-wrap}`（`src/index.css`）必须有。
- 跨多块选区用 `Editor.nodes({at:selection,mode:'highest'})` 别用 `Editor.above`（above 跨块返回 undefined）。
- `Editor.nodes` 的 `match` 里用 `Editor.isBlock` 必须前置 `Element.isElement(n)` 守卫，否则 `mode:'highest'` 会把根节点当块命中（path `[]`）终止遍历。
- `editor.marks` **只在折叠光标时有效**，展开选区恒为 `null`。判格式激活/决定 toggle 方向必须自己遍历选区文本节点统计（`plugins/marks.ts#isMarkActive`）。
  只读 marks 的后果：格式取消不掉（永远走 addMark）、按钮图标永不高亮。
- 浮层工具条（FloatBar / 取色器 / 字体 / 艺术字 / 对齐面板）里所有按钮必须 `onMouseDown={e=>e.preventDefault()}`。
  否则按下时 contenteditable 失焦 → Chrome 折叠 DOM 选区 → 浮栏被 `selectionchange` 关掉、格式写错位置/整段被选中。

## 列表 lilist

- 数据挂宿主块 `attrs.lilist={list_type,list_id,list_number,list_custom,list_path?}`；列表不是 wrapper 类型。
- 编号：段落按 `attrs.indent`、标题按 `attrs.level`；同组=同 `list_id`+同 `list_type`，可不连续。`sortLilist` 是唯一回写入口（增量 `fromIndex` 起算）。
- 锚点 `list_custom` 只许往后跳：≤本层计数器视为无效，顺延并清掉 `list_custom`（坏数据 `1,2,[2],3` 重排成 `1,2,3,4,5`）。别做成拒绝输入——用户要重排。
- 编号写入点 5+（`convertBlockToLilist`/`handleEnter`/`drag-sort`/`block-nodes`/`LilistSettingPopover`/`withPasteConversion`）→ 改规则先 `grep -rn "list_custom\|list_number" src` 列全。
- 不要做相邻重叠列表自动合并（与“开始新列表+改值”数据结构相同，会吃掉拆分）。向前扫描遇非本组块须 `continue`。

## 块类型语义

- `TODO_LIST`(`type:'todo-list'`) 勾选态 `attrs.checked`，不是 lilist。回车规则 `handleTodoListEnter`：空项回车→转段落；非空→拆行新项 `checked:false`。
- 回车分发顺序（`handleEnter.ts`）：代码块→hint 容器内部行→lilist→TODO_LIST→兜底 `insertBreak`。新增块类型插在容器分支之后。

## i18n

- i18next+react-i18next；词条 `src/i18n/locales/*.ts`（默认导出+`as const`）。7 语言 `zh/zh-TW/en/ja/ko/fr/de`。
- 改 locale 后不要再 Edit 同文件（prettier 重排会报 modified since read）→Edit 前先 Read。
- 法语用弯引号 `’`；数据名用 `t(key,{defaultValue:原值})` 回退。
- 标题文案只维护 `blockPicker.heading`（双参数 `{n 中文数字, d 阿拉伯}`）；块名复用 `blockPicker.*`。
- 块类型图标顺序三处一致：`ContextMenu` / `BlockTypePicker.BASIC_ITEMS` / FloatBar 合并菜单（`T→H1..H9→有序→无序→任务→代码块→引用→提示块`）。

## 代码风格 / 约定

- 注释用中文，解释“为什么”。组件/插件结构 `src/plugins/<name>/`，核心渲染 `src/core/{index,renderElement,renderLeaf}.tsx`。
- 6 个复杂插件(image/media/drawio/drawboard/timeline/embed)各自内嵌同模式悬浮工具条：hover 300ms 延迟、离开 300ms 隐藏、hide 必须取消 pending show timer、选中态常显。照抄 `Image.tsx`。
- 提示块 `attrs.label` 持久化：显示 = `attrs.label || t('hintBlock.labels.'+type)`；只有从未自定义才跟随语言。
- **视觉块只读态 = 只留「评论」**（2026-11-14）：chart/drawio/image/media/timeline/embed 统一用 `_shared/useBlockComment.tsx`
  （`useVisualBlockReadOnly` / `useBlockComment` / `BlockCommentButton`）。只读下必须给块 wrapper 加 `pointerEvents:'auto'`
  （`data-paper` 只读时是 `pointer-events:none`），`hideToolbarHandler` 的选中常显要判 `!readOnly`，否则工具条挂住。
  块级评论会话 key = `block:<element.id>`，编辑态工具条也要有评论按钮。
- ⚠️ 有的源文件是 CRLF（`plugins/lilist/LilistSettingPopover.tsx`），`.prettierrc` 是 `lf` → 对它跑 `prettier --write` 会整文件改行尾。改完手写格式即可。

## 图片 / 粘贴（2026-11-14 起）

- 粘贴图片管线 `src/plugins/image/pasteImages.ts`：同步插入 image 块（url 先给 blob 或原外链，粘完立刻可见）→
  异步上传（`trackUpload` 驱动 `uploadProgressStore` 进度条）→ 落盘后把 `attrs.url` 换成 `/media/...` 相对路径。
- ⚠️ 换 url 必须 `HistoryEditor.withoutSaving(editor, fn)`（slate-history 静态方法）。`withHistory` 只挂了
  history/undo/redo，**没有 withoutSaving 实例方法**，写成 `editor.withoutSaving(fn)` 会静默失效 →
  用户按一次撤销「没反应」、第二次图才消失。
- `insertData` 优先级：内部 `application/x-slate-fragment` → 原逻辑；图片 files → 纯图片粘贴；
  `text/uri-list`（Firefox）；`text/html`。**有 files 但 html 有可读文字**时不能当纯图片（会吞掉文字）。
- `htmlToBlocks` 里 `<img>` → image 块（保留原地址），插完按 **url** 匹配异步本地化（`insertFragment` 会重建 id，别用 id 追踪）；
  `<p>文字<img></p>` 由 `runsToBlocks` 拆成段落 + 图片块。
- 外链图走服务端 `POST /api/upload/remote` 代下载（浏览器 fetch 会被 CORS / 防盗链挡）：只允许 http(s)、拒内网地址、
  15s 超时、25MB 上限、content-type 白名单。

## 数据层（2026-10-17 架构，别倒退）

- 文件唯一真相：`data/articles/<id>.json` 一篇一文件（元数据+Slate 正文，进 git）；`data/index.db`(`node:sqlite`,gitignore) 启动时由文件全量重建，丢了不影响数据。索引只存元数据，**正文永不入库**。
- 目录分开：`data/articles` / `data/drawboards` / `data/media/{images,files,videos}`，库与文档只存相对地址。
- 后端 `server/` 用 express（routes/controllers/services/repositories/storage 分层）+ `node:sqlite`，端口 3001，vite 代理 `/api` 与 `/media`；文章正文每次请求现读文件（`article-files.js`），改完不用重启服务端。
- ⚠️ `pnpm dev` = `node scripts/dev.mjs`，**同时**起后端(3001)+vite(5173)，任一退出整体关闭。只跑 `vite` 会静默回退内置示例数据 → 只读（新建/管理分类标签入口直接消失）、搜索只剩 1 篇示例 → 用户会以为功能是摆设。排查「按钮不见 / 搜不到文章」先看 `getDataState().source` 是否 `api`。
- 搜索：`GET /api/articles/search?q=`（`services/articles.service.js#searchArticles`）扫 `data/articles/*.json` 全文，**含正文**（递归抽 Slate text），返回带 `snippet`/`matchedIn`；路由必须注册在 `/:id` 之前。前端 `Search.tsx` 在 api 源走该接口，再把「分类名/标签名命中」的本地结果合并进去；static/demo 退回本地过滤。
- 删除必须 `rename` 到 `data/.trash/`，不要 `unlink`（本机 safe-delete shim 拦截 unlink，**且裸 Node 脚本 `fs.writeFileSync` 覆盖写已有文件也会被 shim 先移进 `.trash` 且不保证写回**）。⚠️ 批量改文章 JSON 请用 Edit/Write 工具，别用裸脚本覆盖写。写文件用 `.tmp`+`rename` 原子替换。
- 前端 `src/data/{types,store,demo-data,bootstrap,articles}.ts`。`main.tsx` 先 `bootstrapData()` 再 render。
- 底部评论按文档隔离：CommentSection 接 `{storageKey, seed?}`，键 `mybook-document-comments:<文章id>`；
  种子评论（`@/data/comments` 的 SEED_COMMENTS）**只由 `/demo` 路由注入**，真实文档不传 seed、从空评论开始。
- 文章页 `persistKey=""` 关 localStorage 只走服务端；`/demo` 仍用 localStorage。`canWrite()`=数据源 api 才可写，static 自动只读。
- 导出 `pnpm export:data` → `public/data/{meta.json,articles.json,articles/<id>.json}`（只导 published）；`public/data`、`public/media` 产物 gitignore。
- Netlify 必须有 `/* → /index.html 200`；`/data/*` 短缓存。本地开发直接 `pnpm dev`（已含后端，不用再单独 `dev:server`）。

## 分类 / 标签（2026-10-17 起可编辑）

- 真相 `data/meta.json`（`categories[]`+`tags[]`），写操作走 `server/meta.mjs`：名称唯一（忽略大小写/空格），被引用时禁删（409 带篇数）。改名不影响引用。
- 分类封面 `POST /api/categories/:id/cover` → `data/media/images/covers/`；没封面前端用 `/covers/category-default.svg`。拼前缀统一 `src/data/assets.ts` 的 `assetUrl()`。
- 写接口返回完整 meta，前端 `applyTaxonomy` 直接覆盖 store。
- `TaxonomyManager` 的 `onChanged` 由 Home 内联传入→组件内用 ref 持有、`refresh` 稳定，否则 `refresh↔setState` 死循环。
- `public/_redirects`（`/* /index.html 200`）与 `netlify.toml` 的 redirect 是两份（前者随构建进 `dist`，给拖拽部署用），改规则两处一起改。

## 站点外壳 / 路由（2026-10-24 起）

- 顶栏 = logo + `首页 / 全部文章 / 回收站 / 设置` 四个 NavLink + 搜索。**没有设置下拉**（原 `SettingsSwitcher` 已删，别再加回来）。
- 顶栏组件在 `src/components/AppHeader/`（2026-11-14 从 App.tsx 拆出，含滚动折叠）：
  顶栏滚出视口 → 右上角浮出圆形 ≡ 按钮 → 点开是 fixed 浮层（右侧 ×、12% 遮罩、Esc/点遮罩收起）；
  **展开后一滚动就收起**，换路由也收起。浮起时 header 脱离文档流，靠一个等高空 div 占位，防止内容上跳。
  坑：滚动监听的 effect 会随 `headerHeight` 重绑，重绑时的初始化**只能算位置不能走 onScroll**，否则刚点开就被自己关掉；
  另加 260ms「刚打开」保护窗口，忽略布局重排带出的 scroll 抖动。
  窄屏（≤720px）展开态换两行：第一行 logo+导航+右上角 ×（fixed，与折叠按钮同位置），第二行通栏搜索。
- 设置是独立路由 `/settings`（`src/pages/Settings.tsx`）：左侧分组导航 + 右侧单页切换（背景/主题色/字体/光标/语言/阅读模式）。`/appearance` 只是 `<Navigate>` 兜底。
- `.main` 的 240px 左栏留白只属于文档路由（`.mainDoc`，`/article/:id` 与 `/demo`）；首页/列表页不要留，否则像目录没消失。
- 首页 Hero 用 `src/pages/home/scenes.tsx` 的 6 套场景（自带 light/dark 色调）+ `useHeroScene`（`mybook:home-scene:v1`），与全局壁纸是两套独立偏好。
- 视觉自验：`pnpm shot --url … --size 1440x900 --out x.png`（`scripts/shot.mjs`，CDP；验证持久化加 `--reload`）。
