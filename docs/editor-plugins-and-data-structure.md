# 编辑器插件与数据结构说明（供 AI 阅读 / 自动生成文档）

> 适用页面：文章页 `/article/:id`（含左侧目录、正文编辑器、底部全文评论）
> 阅读对象：后续需要「理解本文档结构、自动生成或改写文章 JSON」的 AI 与开发者。
> 唯一数据源：`data/articles/<articleId>.json`（正文 JSON）；SQLite（`database/mybook.db`）只是索引缓存。

> **全文最重要的一条：每篇文章都必须有「文章标题」——标题块 / 标题字段必须存在。**
> 标题文字 `children[0].text` **允许为空串**；`Article.title` 与它取同一个值。详见 §1。

---

## 0. 三条铁律（先看这里）

1. **每篇文章都必须有文章标题：第一个块 `content[0]` 必须是 `heading-title` 标题块**（代码强制）。标题**文字可以为空串**，这不是错误状态。页面上显示的大标题、左侧目录顶部标题、列表页标题都来自它。
2. **`Article.title`（索引字段）与 `heading-title.children[0].text`（正文标题文字）必须写同一个值**（两边都允许空串）。新建文章时前端会自动写入；但用户手动改正文标题时索引里的 `title` **不会自动同步**，所以 AI 生成/更新文章时必须两边一起给。
3. **每个块都必须有唯一 `id`（字符串）**；void 类块（图片/图表/日历/画板/公式/提及等）必须带一个占位文本子节点，见 §3.3。

---

## 1. 文章标题（重中之重）

> **一句话：每篇文章都必须有文章标题——标题块必须存在；标题文字允许为空。**
> 标题不是可选项、不是装饰项，它是文章的身份：页面大标题、左侧目录顶部、列表页卡片标题、搜索结果标题全部取它。

### 1.1 文章标题存在哪里（两个落点）

| 落点     | 字段                                                    | 作用                                     | 要求                                                    |
| -------- | ------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------- |
| 文章索引 | `Article.title`                                         | 列表页、搜索、面包屑、回收站识别         | 字段始终存在（缺失时服务端兜底为 `(无标题)`）；可为空串 |
| 正文     | `content[0]`（`heading-title` 块的 `children[0].text`） | 文章页顶部真正显示的大标题、目录顶部标题 | **必须是 `heading-title` 块**；文字可为空串             |

两处写的是**同一个标题值**，不是两个标题。AI 生成/更新时两处同时给、内容一致；空串也是合法值。

### 1.2 标题块 `heading-title` 是什么

- 块类型：`heading-title`（常量 `BlockElementType.HEADING_TITLE`），渲染组件 `src/plugins/heading-title/HeadingTitle.tsx`
- 位置：固定为正文第一个块 `content[0]`，顶层块，`children` 是文本叶子（标题文字本身可编辑）
- **它不等于「一级标题」**：`heading`（`attrs.level: 1-6`）是正文里的章节标题；`heading-title` 是文章标题。两者不能互相替代，**不能用 `heading` + `level:1` 来充当文章标题**。
- 支持封面图、图标（emoji）、作者、日期（attrs 见 1.3）

**代码事实（不要自行加约束）：**

- **标题块一定存在**：`src/editor-extensions/withDelete.ts` 在 `apply` 层拦截 `remove_node`/`split_node`/`merge_node`，所以标题块删不掉；块缺失时会自动在 `[0]` 补一个空标题（`children: [{ text: '' }]`，`DEFAULT_TITLE_ATTRS = { date: 今天 }`）。
- **标题文字可以为空**：编辑器允许把标题文字清空（全选删除只清空文字、保留 `attrs`）。空串是合法状态，**不存在「标题不能为空」的校验**。
- 编辑器的工具栏与 `/` 菜单不提供插入第二个标题块的入口（`toggleBlock` 对 `HEADING_TITLE` 直接 return）。
- 目录组件 `src/components/Outline/Outline.tsx` 取标题时优先读 `heading-title` 的文字，取不到才兜底找第一个 `heading(level:1)`。标题文字为空时，目录里这一项就没有文字。

### 1.3 字段表（标题块的 `attrs`）

| 字段           | 类型     | 说明                                            |
| -------------- | -------- | ----------------------------------------------- |
| `author`       | `string` | 作者名，可选                                    |
| `date`         | `string` | 日期，通常 `YYYY-MM-DD`                         |
| `icon`         | `string` | 图标（IconPicker 序列化后的 JSON 字符串，可选） |
| `coverUrl`     | `string` | 封面图地址（可选）                              |
| `coverId`      | `string` | 封面资源 id（可选）                             |
| `coverOffsetY` | `number` | 封面纵向偏移（可选）                            |

### 1.4 标准写法（AI 生成时必须照这个来）

```json
{
  "type": "heading-title",
  "id": "1b2c3d4e-0000-4000-8000-000000000001",
  "attrs": { "author": "青柠脉动", "date": "2026-10-25" },
  "children": [{ "text": "文章标题写在这里" }]
}
```

> - `children[0].text` 是**文章标题文字**，**可以为空串**（`""`），也允许省略成 `[{ "text": "" }]`；空标题是合法状态，代码不做非空校验。
> - 标题要短、单行可读；不要用换行符，不要把标题拆成多个块。标题块内的文字**不要**再包 `heading`。
> - 同一个标题值还要写进文章索引的 `Article.title`（见 §2.1），两处保持一致。

---

## 2. 顶层数据模型

### 2.1 文章文件 `data/articles/<id>.json`

落盘字段顺序见 `server/storage/article-files.js` 的 `toStorage()`：

```json
{
  "id": "welcome-to-mybook",
  "title": "从这里开始：MyBook 写作台",
  "summary": "一句话摘要",
  "categoryId": "tools",
  "tagIds": ["notes", "tools"],
  "createdAt": "2026-10-17T09:00:00.000Z",
  "reads": 0,
  "status": "published",
  "updatedAt": "2026-10-23T12:44:41.961Z",
  "content": [/* Slate 节点数组，见 §3 */]
}
```

| 字段                      | 类型             | 说明                                                                                                                |
| ------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `id`                      | `string`         | 文章 id，同时是文件名                                                                                               |
| `title`                   | `string`         | 文章标题值，与 `heading-title.children[0].text` 一致。**可为空串**；字段缺失时服务端兜底成 `(无标题)`，不做非空校验 |
| `summary`                 | `string`         | 摘要，可为空串                                                                                                      |
| `categoryId`              | `string \| null` | 分类 id，对应 `GET /api/meta` 返回的分类                                                                            |
| `tagIds`                  | `string[]`       | 标签 id 数组                                                                                                        |
| `createdAt` / `updatedAt` | ISO 字符串       | 时间                                                                                                                |
| `reads`                   | `number`         | 阅读数                                                                                                              |
| `status`                  | `string`         | 默认 `published`                                                                                                    |
| `content`                 | `Descendant[]`   | Slate 正文，**必须以 `heading-title` 开头**（标题文字可为空串）                                                     |

### 2.2 前端视图模型

`src/data/types.ts`：

- `ArticleIndex`：`{ id, title, summary, category, tags, date, reads, updatedAt? }`（列表页用，无正文；`category`/`tags` 是 id）
- `Article = ArticleIndex & { content: Descendant[] }`（详情页用）
- `ArticleInput`：`{ title, summary?, categoryId?, tagIds?, content? }`（新建入参）
- `Category`：`{ id, name, color, icon, desc, cover? }`
- `Tag`：`{ id, name, color }`

### 2.3 写入通道

| 操作                   | 接口                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 列表                   | `GET /api/articles`                                                                                                 |
| 搜索                   | `GET /api/articles/search`                                                                                          |
| 新建                   | `POST /api/articles`                                                                                                |
| 详情（含 content）     | `GET /api/articles/:id`                                                                                             |
| 全量更新               | `PUT /api/articles/:id`                                                                                             |
| 自动保存正文           | `PATCH /api/articles/:id/autosave`                                                                                  |
| 阅读计数 +1            | `POST /api/articles/:id/reads`（进入文章页时调用；同时写文章 JSON 的 `reads` 与 SQLite，`updatedAt` 不变）          |
| 删除（移入回收站）     | `DELETE /api/articles/:id`                                                                                          |
| 分类/标签元数据        | `GET /api/meta`（一次性返回全部分类 + 标签）                                                                        |
| 分类增删改             | `POST /api/categories`、`PUT/DELETE /api/categories/:id`、`POST /api/categories/:id/cover`                          |
| 标签增删改             | `POST /api/tags`、`PUT/DELETE /api/tags/:id`                                                                        |
| 上传图片 / 文件 / 视频 | `POST /api/upload?kind=images\|files\|videos`（请求体为原始字节，文件名放 `X-Filename`；返回 `media/...` 相对路径） |
| 保存画板数据           | `POST /api/drawboards`（body `{ data: Shape[], path?: string }`；返回 `media/drawboards/<file>.json` 相对路径）     |
| 读取 / 保存全文评论    | `GET /api/comments/:articleId`、`PUT /api/comments/:articleId`（一篇一个 `data/comments/<articleId>.json`）         |

删除不是物理删除：文件被 `rename` 到 `data/.trash/`，文件名 `<articleId>.<ISO时间>.json`；回收站接口为 `GET/POST/DELETE /api/trash`、`/api/trash/restore`。

### 2.4 附属文件目录（文章 JSON 只存相对路径）

| 类型     | 落盘位置                            | 文档/节点里保存的值                           |
| -------- | ----------------------------------- | --------------------------------------------- |
| 图片     | `data/media/images/<file>`          | `media/images/<file>`                         |
| 附件     | `data/media/files/<file>`           | `media/files/<file>`                          |
| 视频     | `data/media/videos/<file>`          | `media/videos/<file>`                         |
| 画板数据 | `data/media/drawboards/<file>.json` | `media/drawboards/<file>.json`（`attrs.src`） |
| 全文评论 | `data/comments/<articleId>.json`    | 不进正文，按 `articleId` 读写                 |

- 所有路径**不带前导 `/`**；渲染、下载、拉取统一由 `src/data/media.ts#toMediaUrl()` 补成 `/media/...`。
- 上传图片会在浏览器端压缩：最长边 2560px、JPEG/WebP 质量 0.86，PNG 转 WebP（保留透明通道）；压缩后反而变大则保留原图。
- 从「文件」入口上传图片也会统一落到 `data/media/images`；服务端按内容 sha256 去重，同一内容只存一份文件。
- 文件块如果指向图片，卡片层显示缩略图、视图层内联显示图片，全屏预览页也能直接看图。
- Express 把 `data/media` 静态挂载在 `/media/*`，所以 `media/images/a.png` 对应可访问地址 `/media/images/a.png`。
- 只有本地 API 模式（`canWrite() === true`）才真实上传落盘；线上静态快照 / 内置示例为只读，上传与画板保存会回退为临时 `blob` 地址（不写文档路径）。

---

## 3. 节点的通用形状

### 3.1 块节点（`CustomElement`）

```ts
{
  type: BlockElementType;   // 见 §4 总表
  id: string;               // 全局唯一
  style?: Record<string, unknown>; // 可选，元素级 CSS，如 { lineHeight: '1.8' }
  attrs?: Record<string, unknown>; // 可选，插件业务参数（重点）
  children: CustomDescendant[];
}
```

### 3.2 文本叶子（`CustomText`）

```ts
{ text: "文字内容", bold?: true, italic?: true, color?: "#e83e8c", ... }
```

叶子只能出现在「文本类块」里（`paragraph` / `heading` / `heading-title` / `blockquote` / `hint-block` / `todo-list` / `code-line` 等），不能直接挂在 `table`、`column-group` 这类容器块下。

### 3.3 void 块的占位子节点

Slate 要求所有元素至少有一个子节点。自绘块统一这样写：

| 块                                                                            | 占位写法                                                          |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `image-block` / `file-block` / `video-block` / `divider` / `drawio`           | `children: [{ "text": "" }]`                                      |
| `inline-formula` / `mention`                                                  | `children: [{ "text": "" }]`                                      |
| `countdown` / `calendar` / `timeline` / `chart` / `embed-block` / `drawboard` | `children: [{ "text": "\u200B" }]`（零宽空格 `ZERO_WIDTH_SPACE`） |
| `code-line`                                                                   | `children: [{ "text": "代码文本" }, { "text": "\u200B" }]`        |

> `\u200B` 是零宽空格，必须保留；写成空串会导致光标/行尾定位异常。

### 3.4 `attrs` 通用约定

- `align`：`'left' | 'center' | 'right'`（文本类块用 attrs.align；`left` 等于删除该字段）
- `indent`：`number`（列表缩进层级，从 0/1 起）
- `fontFamily`：`string`（块级字体，文本叶子上的 `fontFamily` 优先级更高）
- `lilist`：列表绑定对象，见 §7

---

## 4. 块类型总表（`type` 全量）

`src/enums/block.ts` 定值，`src/core/renderElement.tsx` 负责渲染分派。

| type                         | 名称                   | children 形状          | 关键 attrs                                                                                             | 渲染组件                                 |
| ---------------------------- | ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `heading-title`              | 文章标题               | 文本叶子（单个）       | `author` `date` `icon` `coverUrl` `coverId` `coverOffsetY`                                             | `plugins/heading-title/HeadingTitle.tsx` |
| `paragraph`                  | 段落                   | 文本叶子 / 行内元素    | `align` `indent` `lilist` `fontFamily` + 任意自定义                                                    | `plugins/paragraph/Paragraph.tsx`        |
| `heading`                    | 标题                   | 文本叶子               | `level`(1-6) `align` `indent` `lilist` `fontFamily`                                                    | `plugins/heading/Heading.tsx`            |
| `blockquote`                 | 引用块                 | 文本叶子               | `type`: `info`/`note`/`warning`/`tip`                                                                  | `plugins/blockquote/Blockquote.tsx`      |
| `hint-block`                 | 提示块                 | 文本叶子               | `type`: `info`/`note`/`warning`/`tip`；`label` 自定义标题                                              | `plugins/hint-block/HintBlock.tsx`       |
| `code-block`                 | 代码块                 | **只允许 `code-line`** | `language` `wrap` `height`                                                                             | `plugins/code-block/CodeBlock.tsx`       |
| `code-line`                  | 代码行                 | 文本叶子 + 零宽占位    | —                                                                                                      | `plugins/code-block/CodeLine.tsx`        |
| `todo-list`                  | 待办项                 | 文本叶子               | `checked`: boolean                                                                                     | `plugins/todo-list/TodoList.tsx`         |
| `bulleted-list`              | 无序列表容器（旧模型） | `list-item`            | —                                                                                                      | `plugins/bulleted-list/BulletedList.tsx` |
| `numbered-list`              | 有序列表容器（旧模型） | `list-item`            | —                                                                                                      | `plugins/numbered-list/NumberedList.tsx` |
| `list-item`                  | 列表项（旧模型）       | 块（通常 paragraph）   | —                                                                                                      | `plugins/list-item/ListItem.tsx`         |
| `image-block`                | 图片                   | `[{ text: "" }]`       | `url` `width` `height` `align` `offsetLeft` `offsetTop` `offsetWidth` `offsetHeight` `name`            | `plugins/image/Image.tsx`                |
| `divider`                    | 分割线                 | `[{ text: "" }]`       | —                                                                                                      | `plugins/elements/Divider.tsx`           |
| `table`                      | 表格                   | `table-row`            | `borderColor` `borderWidth` `colWidths`(number[]) `headerRows`(number[]) `headerCols`(number[])        | `plugins/table/Table.tsx`                |
| `table-row`                  | 表格行                 | `table-cell`           | `bgColor`                                                                                              | `plugins/table/TableRow.tsx`             |
| `table-cell`                 | 单元格                 | 块（通常 paragraph）   | `width`(如 `"160px"`) `colspan` `rowspan` `bgColor` `vertAlign`(`top`/`middle`/`bottom`)               | `plugins/table/TableCell.tsx`            |
| `drawio`                     | draw.io 流程图         | `[{ text: "" }]`       | `content`(data-url SVG) `xml` `description` `width` `height` `align`                                   | `plugins/drawio/Drawio.tsx`              |
| `inline-formula`             | 行内公式               | `[{ text: "" }]`       | `value`(KaTeX 字符串) `color?` `highlight?`                                                            | `plugins/formula/Formula.tsx`            |
| `mention`                    | @提及                  | `[{ text: "" }]`       | `name` `kind`(`category`/`doc`) `targetId` `url?` `color?` `highlight?`                                | `plugins/mention/Mention.tsx`            |
| `file-block` / `video-block` | 文件/视频              | `[{ text: "" }]`       | `kind` `src`(相对路径) `name` `size` `mimeType` `layer`(`text`/`card`/`view`) `width` `height` `align` | `plugins/media/MediaBlock.tsx`           |
| `countdown`                  | 倒计时                 | `[{ text: "\u200B" }]` | `mode`(`duration`/`datetime`) `duration{days,hours,minutes,seconds}` `targetDate`(ms\|null) `notify`   | `plugins/countdown/Countdown.tsx`        |
| `column-group`               | 分栏容器               | `column`               | `{}`                                                                                                   | `plugins/columns/ColumnGroup.tsx`        |
| `column`                     | 分栏列                 | 块                     | `width`(百分比 number，整体和为 100)                                                                   | `plugins/columns/Column.tsx`             |
| `calendar`                   | 日历                   | `[{ text: "\u200B" }]` | `year` `month`(1-12) `events` `showLunar` `showTerm` `weekStart`(固定 1)                               | `plugins/calendar/Calendar.tsx`          |
| `timeline`                   | 时间轴                 | `[{ text: "\u200B" }]` | `width` `height` `direction` `sideMode` `items` `align`                                                | `plugins/timeline/Timeline.tsx`          |
| `chart`                      | 图表                   | `[{ text: "\u200B" }]` | `kind` `variant` `title` `description` `data` `width` `height` `gauge*` `align`                        | `plugins/chart/Chart.tsx`                |
| `embed-block`                | 内嵌网页               | `[{ text: "\u200B" }]` | `url` `height`(默认 400，120-2000) `align`                                                             | `plugins/embed/Embed.tsx`                |
| `drawboard`                  | 画板                   | `[{ text: "\u200B" }]` | `width` `height` `src`(相对路径) `ref` `align`；`data` 仅旧文档兼容                                    | `plugins/drawboard/Drawboard.tsx`        |

> 未命中任何 `type` 的节点会按 `paragraph` 兜底渲染（`renderElement.tsx` 的 `default` 分支）。

---

## 5. 各类块详解

### 5.1 文本类块

```json
{
  "type": "paragraph",
  "id": "p1",
  "attrs": { "align": "center", "indent": 0 },
  "children": [
    { "text": "一段普通文字，可以带 " },
    { "text": "加粗", "bold": true },
    { "text": " 与 " },
    { "text": "链接", "hyperlink": "https://example.com" }
  ]
}
```

- **标题层级**：`heading.attrs.level` 取值 `1`-`6`；`level: 1` 在编辑器里等价于大标题，但**不等于**文章标题块（文章标题仍是 `heading-title`）。
- **引用块**：`attrs.type` 四种，仅影响配色/图标/默认文案。
- **提示块**：`attrs.type` + `attrs.label`；`label` 缺省时按当前语言取默认标签。
- **待办**：`attrs.checked`；文本在 `children` 里。
- **对齐**：`attrs.align`；`left` 时建议直接删掉该字段。

### 5.2 代码块

```json
{
  "type": "code-block",
  "id": "code1",
  "attrs": { "language": "typescript", "wrap": true, "height": 150 },
  "children": [
    {
      "type": "code-line",
      "id": "code1-line-0",
      "children": [{ "text": "const a = 1;" }, { "text": "\u200B" }]
    },
    {
      "type": "code-line",
      "id": "code1-line-1",
      "children": [{ "text": "console.log(a);" }, { "text": "\u200B" }]
    }
  ]
}
```

- `children` **必须**是 `code-line` 数组，至少 1 行，否则行号与高亮无法渲染。
- 一行一个 `code-line`；行内换行用多个 `code-line` 表示，不要在 `text` 里塞 `\n`。
- `language` 用于语法高亮，已注册的 prismjs 语言：`javascript`、`typescript`、`python`、`java`、`css`、`json`、`markup`（html/xml）、`sql`、`bash`、`go`、`rust`；其他值会回落到 `javascript`。
- `wrap` 控制自动换行；`height` 为最大高度（px，超出滚动）。

### 5.3 图片

```json
{
  "type": "image-block",
  "id": "img1",
  "attrs": { "url": "media/images/xxx.png", "width": 800, "height": 450, "align": "center" },
  "children": [{ "text": "" }]
}
```

- `offsetLeft/offsetTop/offsetWidth/offsetHeight` 是裁剪结果，四个值同时存在时按裁剪区域显示；未裁剪时不写。
- `width/height` 是显示尺寸（px）；`align` 控制水平对齐。
- `url` 必须是 `media/images/...` 形式的相对路径（不带前导 `/`），渲染时经 `toMediaUrl()` 转换。

### 5.4 表格

```json
{
  "type": "table",
  "id": "t1",
  "attrs": { "borderColor": "#d9d9d9", "borderWidth": "1px", "colWidths": [160, 200, 240] },
  "children": [
    {
      "type": "table-row",
      "id": "r1",
      "attrs": { "bgColor": "#fafafa" },
      "children": [
        {
          "type": "table-cell",
          "id": "c11",
          "attrs": { "width": "160px" },
          "children": [{ "type": "paragraph", "id": "p11", "children": [{ "text": "表头" }] }]
        }
      ]
    }
  ]
}
```

- `table` 只能直接包含 `table-row`；`table-row` 只能直接包含 `table-cell`；单元格内才是普通块（推荐 `paragraph`）。
- 合并单元格用 `colspan` / `rowspan`（数字，按逻辑网格计算）。
- `colWidths` 与 `headerRows` / `headerCols` 是表格级布局信息，索引即逻辑列/行号。

### 5.5 列表（lilist 绑定模型，**推荐**）

当前版本的列表**不是**容器块，而是把列表信息挂在段落/标题的 `attrs.lilist` 上（`src/plugins/lilist/lilist-model.ts`）：

```json
{
  "type": "paragraph",
  "id": "li1",
  "attrs": {
    "lilist": { "list_type": "ol", "list_id": "list-1", "list_number": 1, "list_custom": false },
    "indent": 0
  },
  "children": [{ "text": "第一项" }]
}
```

| 字段          | 类型           | 说明                                                |
| ------------- | -------------- | --------------------------------------------------- |
| `list_type`   | `'ol' \| 'ul'` | 有序 / 无序                                         |
| `list_id`     | `string`       | 同一列表的组 id（同组连续编号）                     |
| `list_number` | `number`       | 该项显示编号（由 `sortLilist` 自动重排，上限 1000） |
| `list_custom` | `boolean`      | 是否为自定义起始编号锚点                            |
| `list_path`   | `string`       | 仅标题有序列表使用，如 `"1.1"`，由排序回写          |

- 宿主类型：`ol` 可挂在 `paragraph` **和** `heading`；`ul` 只能挂 `paragraph`。
- 缩进用 `attrs.indent`（0、1、2…）。
- 旧的 `bulleted-list` / `numbered-list` / `list-item` 仍在枚举和渲染分派里（兼容历史数据），**AI 生成新文档时请用 lilist 模型**。

### 5.6 分栏

```json
{
  "type": "column-group",
  "id": "cg1",
  "attrs": {},
  "children": [
    {
      "type": "column",
      "id": "col1",
      "attrs": { "width": 50 },
      "children": [{ "type": "paragraph", "id": "cp1", "children": [{ "text": "左栏" }] }]
    },
    {
      "type": "column",
      "id": "col2",
      "attrs": { "width": 50 },
      "children": [{ "type": "paragraph", "id": "cp2", "children": [{ "text": "右栏" }] }]
    }
  ]
}
```

- 每个 `column.attrs.width` 是**宽度权重**（各列按比例分容器宽度），习惯上写成总和 100，但不必精确；缺省时等分。
- 一组的列数范围 1-6。
- 分栏里可以放任何块（图表、图片等窄栏会自适应）。

### 5.7 日历

```json
{
  "type": "calendar",
  "id": "cal1",
  "attrs": {
    "year": 2026,
    "month": 10,
    "events": [
      {
        "id": "cal-ev-1",
        "title": "团队周会",
        "start": "2026-10-03",
        "end": "2026-10-03",
        "color": "#3370ff",
        "note": "会议室 A"
      }
    ],
    "showLunar": true,
    "showTerm": true,
    "weekStart": 1
  },
  "children": [{ "text": "\u200B" }]
}
```

- 日期一律 `YYYY-MM-DD`，`end` 为含当天；跨月/跨周由组件自行裁剪与续接。
- `events` 每项必填 `id` `title` `start` `end` `color`，`note` 为可选备注。
- `showLunar` 农历副标题、`showTerm` 节气、`weekStart` 当前仅支持 `1`（周一）。

### 5.8 时间轴

```json
{
  "type": "timeline",
  "id": "tl1",
  "attrs": {
    "width": 700,
    "height": 300,
    "direction": "horizontal",
    "sideMode": "alternate",
    "items": [{ "id": "it1", "title": "项目启动", "detail": "完成需求调研", "time": "2023年1月" }]
  },
  "children": [{ "text": "\u200B" }]
}
```

- `direction`: `horizontal` / `vertical`；`sideMode`: `alternate`（两侧交替）/ `same`（同侧）。
- `time` 是自由文本（支持「第一年」「2024」等）。

### 5.9 图表（ECharts）

```json
{
  "type": "chart",
  "id": "ch1",
  "attrs": {
    "kind": "bar",
    "variant": "vertical",
    "title": "月度销售趋势",
    "description": "单位：万元",
    "data": [
      { "name": "一月", "value": 320 },
      { "name": "二月", "value": 210 }
    ],
    "width": 720,
    "height": 320
  },
  "children": [{ "text": "\u200B" }]
}
```

- `kind`（当前已实现、可选）：`bar` / `pie` / `wordcloud` / `gauge`（枚举里另有 `line` / `scatter`，尚未实现，不要使用）
- `variant`（子类型）：柱状 `vertical`/`horizontal`/`stack`；饼图 `donut`/`rose`/`plain`；词云与仪表盘为 `plain`
- `data` 每项固定 `{ name: string, value: number }`
- 仪表盘额外字段：`gaugeValue`（当前值，带动画）、`gaugeMin`、`gaugeMax`、`gaugeUnit`

### 5.10 内嵌网页 / 画板 / draw.io

```json
{
  "type": "embed-block",
  "id": "e1",
  "attrs": { "url": "https://example.com", "height": 400, "align": "center" },
  "children": [{ "text": "\u200B" }]
}
```

```json
{
  "type": "drawboard",
  "id": "db1",
  "attrs": { "width": 720, "height": 400, "src": "media/drawboards/1690000000000-xxx.json" },
  "children": [{ "text": "\u200B" }]
}
```

```json
{
  "type": "drawio",
  "id": "d1",
  "attrs": {
    "content": "data:image/svg+xml;charset=utf-8,...",
    "xml": "",
    "description": "流程图",
    "width": 520,
    "height": 220
  },
  "children": [{ "text": "" }]
}
```

- 画板的图形数据（drawui `Shape[]`）**不再内联在节点里**：关闭全屏编辑器时 `POST /api/drawboards` 写成 `data/media/drawboards/<file>.json`，节点只保留相对路径 `attrs.src`；渲染时按 `src` 懒加载。
- `attrs.data` 仅用于读取旧文档（内联数据）；新写入一律清掉 `data`。
- `attrs.src` 与图片/文件一样是**不带前导 `/` 的相对路径**（`media/drawboards/...`），前端通过 `toMediaUrl()` 拼成可访问地址。
- `embed-block.url` 为空表示未配置，页面显示占位。

### 5.11 文件 / 视频

```json
{
  "type": "file-block",
  "id": "f1",
  "attrs": {
    "kind": "file",
    "src": "media/files/a.pdf",
    "name": "a.pdf",
    "size": 11233,
    "mimeType": "application/pdf",
    "layer": "card"
  },
  "children": [{ "text": "" }]
}
```

- `layer`：`text`（紧凑行内）/ `card`（卡片）/ `view`（展开预览）
- `kind` 必须与块类型一致：`file-block` → `file`，`video-block` → `video`
- `src` 是 `media/files/...` 或 `media/videos/...` 形式的相对路径（不带前导 `/`）

### 5.12 倒计时

```json
{
  "type": "countdown",
  "id": "cd1",
  "attrs": {
    "mode": "datetime",
    "duration": { "days": 2, "hours": 0, "minutes": 0, "seconds": 0 },
    "targetDate": 1793000000000,
    "notify": true
  },
  "children": [{ "text": "\u200B" }]
}
```

- 两种模式最终都落到 `targetDate`（毫秒时间戳）；`duration` 仅用于回填输入框。

---

## 6. 行内元素与文本 mark

### 6.1 行内自绘元素

| 元素  | type             | 关键 attrs                      | 备注                                                         |
| ----- | ---------------- | ------------------------------- | ------------------------------------------------------------ |
| 公式  | `inline-formula` | `value`（KaTeX 源串）           | 点选后按 ESC 完成输入；颜色通过 attrs 的 `color`/`highlight` |
| @提及 | `mention`        | `name` `kind` `targetId` `url?` | `kind: 'doc'` 跳文章，`'category'` 跳分类                    |

两者都是 void，`children: [{ "text": "" }]`；它们**不会**使用文本叶子的 mark，颜色需要写在 `attrs.color` / `attrs.highlight` 上。

### 6.2 文本叶子 mark 全表（`src/core/types.ts`）

| 字段            | 类型       | 说明                                                                 |
| --------------- | ---------- | -------------------------------------------------------------------- |
| `text`          | `string`   | 必填，叶子文本                                                       |
| `bold`          | `boolean`  | 加粗                                                                 |
| `italic`        | `boolean`  | 斜体                                                                 |
| `underline`     | `boolean`  | 下划线                                                               |
| `strikethrough` | `boolean`  | 删除线                                                               |
| `code`          | `boolean`  | 行内代码（渲染为 `<code>`）                                          |
| `color`         | `string`   | 文字色（CSS 颜色）                                                   |
| `highlight`     | `string`   | 背景高亮色                                                           |
| `fontFamily`    | `string`   | 字体族（优先级高于块级 `attrs.fontFamily`）                          |
| `artText`       | `string`   | 艺术字样式，**JSON 字符串**                                          |
| `hyperlink`     | `string`   | 超链接地址                                                           |
| `hyperlinkAuto` | `boolean`  | 是否由输入自动识别（其文字必须始终是合法 URL，否则会被自动取消链接） |
| `comments`      | `string[]` | 行内评论线程 id 列表（见 §9.2）                                      |

**艺术字 `artText`** 的 JSON 结构（`src/plugins/art-text/art-text-marks.ts`）：

```ts
{ type: 'gradient', colors: string[], direction: 'left-to-right'|'right-to-left'|'top-to-bottom'|'bottom-to-top'|'diagonal' }
{ type: 'glow', glowColor: string, glowIntensity: number }
{ type: 'shadow', shadowColor: string, shadowOffsetX: number, shadowOffsetY: number, shadowBlur: number }
```

> 渐变字与 `highlight` 互斥（渐变会覆盖背景色）。

代码高亮的 token mark（`keyword`、`string`、`number` 等）由渲染期的 decoration 动态注入，**不需要也不应该写进 JSON**。

---

## 7. 渲染与注册位置（改代码时看这里）

| 职责                               | 文件                                                               |
| ---------------------------------- | ------------------------------------------------------------------ |
| `type` 枚举                        | `src/enums/block.ts`                                               |
| 节点 TS 类型                       | `src/core/types.ts`                                                |
| 块渲染分派                         | `src/core/renderElement.tsx`（switch，默认 paragraph）             |
| 叶子渲染                           | `src/core/renderLeaf.tsx`（mark → 样式、链接、行内代码、评论高亮） |
| 插件总出口                         | `src/plugins/index.ts`                                             |
| 编辑器组装 + `with*` 链            | `src/core/index.tsx`                                               |
| 块切换 / 高亮判断                  | `src/plugins/blocks.ts`                                            |
| 通用 wrapper（选中、工具栏、拖拽） | `src/plugins/element-wrapper/ElementWrapper.tsx`                   |

`with*` 编辑器扩展链（由外到内，外层先拦截）：

`withDelete` → `withPasteConversion` → `withEmbed` → `withChart` → `withTimeline` → `withCalendar` → `withCountdown` → `withEditorBehaviors` → `withSlashCommand` → `withBlockSelection` → `withLilist` → `withHyperlink` → `withColumns` → `withHintBlock` → `withMention` → `withInlineFormula` → `withMarkdownShortcuts` → `withCodeBlock` → `withHistory` → `withReact`。

### 7.1 页面上的交互层插件（非块类型）

| 组件                                                   | 作用                                                   |
| ------------------------------------------------------ | ------------------------------------------------------ |
| `components/FloatBar`                                  | 选中文字后的浮动工具栏（加粗、颜色、对齐、块类型转换） |
| `plugins/docbar/DocBar` + `TrailingAddZone`            | 块左侧「⋮⋮ / ＋」操作条，插入块                        |
| `editor-extensions/slash/SlashMenu`                    | 输入 `/` 的块选择菜单                                  |
| `plugins/context-menu/ContextMenu`                     | 右键菜单（表格行列、复制块等）                         |
| `plugins/block-picker/BlockTypePicker`                 | 块类型选择面板                                         |
| `components/AlignIndentPanel`                          | 对齐 / 缩进面板                                        |
| `components/ColorPicker`、`FontPicker`、`IconPicker`   | 颜色、字体、图标选择器                                 |
| `components/Outline`                                   | 左侧目录（数据来自 `heading`/`heading-title`）         |
| `components/find-replace`                              | 查找替换（`searchDecorate` 注入高亮 mark）             |
| `components/comments/CommentSection`                   | 页面底部「全文评论」                                   |
| `plugins/inline-comment`                               | 正文行内评论（角标 + 气泡）                            |
| `components/BackToTop`、`components/CursorSwitcher` 等 | 页面级辅助组件                                         |

---

## 8. 校验清单（AI 生成 JSON 前后逐条核对）

- [ ] **文章标题存在**：`content[0]` 是 `heading-title` 块（标题文字可为空串，不做非空校验）
- [ ] `Article.title` 与 `heading-title.children[0].text` 一致（两边同时给，允许空串）
- [ ] 所有块都有唯一 `id`（UUID 或稳定短 id，不要重复）
- [ ] `code-block` 的 `children` 全部是 `code-line`，且每行含 `{ "text": "\u200B" }`
- [ ] `table` → `table-row` → `table-cell` 三层结构正确，单元格内是块，不是裸文本
- [ ] `column-group.children` 全是 `column`，列数 1-6（`width` 是权重，建议总和 100）
- [ ] void 块带占位子节点（见 §3.3）
- [ ] `chart.data`、`timeline.items`、`calendar.events` 字段齐全（见 §5）
- [ ] 链接叶子同时有 `hyperlink`（自动链接再加 `hyperlinkAuto: true`）
- [ ] 不要在文本里写 `\n` 换行（软换行符仅用于特殊场景；普通换行请拆成新块）
- [ ] `attrs` 只放插件认识的字段，不要塞渲染无关的杂物（`paragraph` 的自定义字段除外）

---

## 9. 评论存储（补充）

### 9.1 页面底部「全文评论」

- 组件：`src/components/comments/CommentSection.tsx`
- 存储（本地 API 模式）：`data/comments/<articleId>.json`，整篇数组覆盖写；接口 `GET/PUT /api/comments/:articleId`
- 只读模式（线上静态快照 / 示例文档）：回退 `localStorage`，key = `mybook-document-comments:<articleId>`
- 结构：

```ts
{
  id: string;
  author: string;
  color: string;
  content: string;
  createTime: number;
}
[];
```

### 9.2 正文行内评论

- 锚点写在正文叶子上：`comments: ["cmt-xxx", ...]`（mark 名 `comments`）
- 评论正文单独存 `localStorage`，key = `mybook-inline-comment-threads-v2`
- 线程结构：

```ts
{
  id: string;
  quotedText: string;        // 被评文字快照
  messages: { id, author, color, content, createTime }[];
  resolved?: boolean;
  rangeKey: string;          // 选区区间标识，用于「再选同一段 = 追加」
}
```

> 新增/改动正文时，若删除了带 `comments` 的叶子，对应线程会成为孤儿（正文里不再有引用），这是预期行为。

---

## 10. 最小完整示例（可直接作为 AI 输出模板）

```json
{
  "title": "示例文章标题",
  "summary": "这是一段摘要。",
  "categoryId": "frontend",
  "tagIds": ["notes"],
  "content": [
    {
      "type": "heading-title",
      "id": "t-1",
      "attrs": { "author": "青柠脉动", "date": "2026-10-25" },
      "children": [{ "text": "示例文章标题" }]
    },
    {
      "type": "paragraph",
      "id": "p-1",
      "children": [{ "text": "开头段落，介绍这篇文章要讲什么。" }]
    },
    {
      "type": "heading",
      "id": "h-1",
      "attrs": { "level": 2 },
      "children": [{ "text": "一、小节标题" }]
    },
    {
      "type": "paragraph",
      "id": "p-2",
      "attrs": {
        "lilist": { "list_type": "ul", "list_id": "l-1", "list_number": 1, "list_custom": false }
      },
      "children": [{ "text": "列表项一" }]
    },
    {
      "type": "paragraph",
      "id": "p-3",
      "attrs": {
        "lilist": { "list_type": "ul", "list_id": "l-1", "list_number": 2, "list_custom": false }
      },
      "children": [{ "text": "列表项二" }]
    },
    {
      "type": "hint-block",
      "id": "hb-1",
      "attrs": { "type": "tip", "label": "提示" },
      "children": [{ "text": "这里是一条提示。" }]
    },
    {
      "type": "code-block",
      "id": "code-1",
      "attrs": { "language": "javascript", "wrap": true },
      "children": [
        {
          "type": "code-line",
          "id": "code-1-line-0",
          "children": [{ "text": "console.log('hello');" }, { "text": "\u200B" }]
        }
      ]
    }
  ]
}
```

---

## 11. 常见坑

| 现象                        | 原因                                                  | 处理                                                                                  |
| --------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 页面顶部没有文章标题        | `content[0]` 不是 `heading-title` 块                  | 文章标题必须有：`content[0]` 用 `heading-title`（文字可为空，编辑器也会兜底补空标题） |
| 用「一级标题」当文章标题    | 用 `heading` + `level:1` 顶替 `heading-title`         | 两者不同，文章标题只能用 `heading-title`                                              |
| 列表页标题与正文标题不一致  | 只改了 `Article.title` 或只改了正文标题块             | 两边同时更新                                                                          |
| 代码块没有行号/高亮         | `code-block` 下直接放了文本或段落                     | 改成 `code-line` 数组                                                                 |
| 表格显示成一片文字          | 单元格里直接写了文本节点                              | 单元格内先放 `paragraph`                                                              |
| 分栏宽度错乱                | 只有一列写 `width`，或列数超出 1-6                    | 给每列写权重（建议合计 100）                                                          |
| 图片/图表无法选中或光标乱跳 | void 块缺少占位子节点                                 | 补 `children: [{ text: "\u200B" }]`                                                   |
| 链接点击无效                | 只有 `hyperlinkAuto` 没有 `hyperlink`                 | 两个都写，或只写 `hyperlink`                                                          |
| 目录里标题项是空白          | 标题文字为空串（合法状态）；或没有 `heading-title` 块 | 没有块就补 `heading-title`；文字为空不是错误，需要显示再填文字                        |
