# myBookEditor · 项目长期记忆

## 构建 / 校验（重要）

- build script = **`tsc -b && vite build`**（Netlify 也用它）。**tsc 有报错 → 部署直接失败。**
- 交付前**必须**跑 `tsc -b`，不能只跑 `vite build`（vite/esbuild 不做类型检查，会漏）。
  - 本地跑法（pnpm shim 在本机 Git Bash 里路径会坏，直接用 node 调 tsc）：
    `node node_modules/typescript/bin/tsc -b` → 看 EXIT 与报错。
  - 按文件统计报错：`... tsc -b 2>&1 | grep -oE "^src/[^(]+" | sort | uniq -c | sort -rn`
- 本地 `vite build` 最后会因**沙箱拦截 vite 清 `dist/assets`**（safe-delete，>50 文件）而失败 ——
  这是**本地环境限制，不是代码问题**；只要看到 `✓ N modules transformed` 就说明模块解析/编译 OK。

## Slate 相关坑（高频）

- **import slate 时给 `Element` / `Node` / `Text` 起别名**（如 `Element as SlateElement`）。
  直接 `import { Element } from 'slate'` 会遮蔽 **DOM 全局 `Element`**，让操作 DOM 节点树的文件
  报一片 TS2339/TS2345/TS2677（典型：`withPasteConversion.ts`）。
- 类型根在 `src/core/types.ts` 的 `declare module 'slate' { interface CustomTypes {...} }`：
  `CustomElement` / `CustomText`。**新增自定义 text mark 记得往 `CustomText` 加字段**
  （否则只能 `as Partial<Node>` 硬 cast，且会匹配到 Editor 分支报错）。
- 「自绘 + void」元素（公式/提及/图表/画板/倒计时…）：`isVoid` 让 `addMark` 进不去，
  改它们的数据要用 `Editor.nodes({ voids: true, match })` + `Transforms.setNodes({ attrs }, { at: path, voids: true })`。
- 文档结构：块统一 `{ type, id, attrs, children }`；列表是挂在段落 attrs 上的 `lilist`（不是 wrapper 类型）。
- **软换行（Shift+Enter）**：本项目 slate 0.126.2 的 `Editor.insertSoftBreak` 实现是
  `Transforms.splitNodes({ always: true })` —— **它拆块，不写 `\n`**，所以不能靠浏览器默认。
  正确做法 = `Transforms.insertText(editor, '\n')`（代码块本来就是这么做的）；
  且**必须**有 `[data-slate-editor] [data-slate-string] { white-space: pre-wrap }`（`src/index.css`），
  否则 slate-react 的文本 span 会把 `\n` 折叠成空格、表现为「没反应」。
  键盘唯一入口：`src/events/keyboard/handleKeyDown.ts`（`core/index.tsx` 的 `onKeyDown`）。
- **取「选区涉及的块」用 `Editor.nodes({ at: selection, mode: 'highest' })`，别用 `Editor.above`**：
  `above` 对**跨多块**选区返回 `undefined`（会导致面板误判为不可用 / 整片变灰）。
- **`Editor.nodes` 的 `match` 里用 `Editor.isBlock` 时必须前置 `Element.isElement(n)` 守卫**：
  否则 `mode: 'highest'` 会把**编辑器根节点**也当成块命中（path 为 `[]`），遍历直接终止、取不到子块，
  表现为「按钮亮着但点了没用」。

## i18n 约定

- i18next + react-i18next；入口 `src/i18n/index.ts`，词条 `src/i18n/locales/*.ts`（默认导出 + `as const`）。
- 支持 7 种语言：`zh` / `zh-TW` / `en` / `ja` / `ko` / `fr` / `de`；`AppLanguage`、`SUPPORTED_LANGUAGES`、
  `LANGUAGE_SHORT` 都从 `@/i18n` 导出。语言统一由设置下拉的「语言」子面板切换。
- **改 locale 文件后再 Edit 同一文件会报 "File has been modified since read"**（保存后被 prettier 重排）→ Edit 前先 Read。
- 法语字符串用弯引号 `’`（单引号字符串里别用直引号）。
- 数据类名字（品牌名、封面名）用 `t(key, { defaultValue: 原值 })` 做回退，缺翻译时自动用原名。
- 标题类文案**只维护一条** `blockPicker.heading`，用 `{ n: 中文数字, d: 阿拉伯数字 }` 双参数适配：
  zh/zh-TW 用 `{{n}}级标题`，其它语言用 `Heading {{d}}`。拼装函数在 `src/utils/block-label.ts`
  （`toChineseLevel` / `headingBlockLabel`），别在组件里各写一份。
- **块名只维护一份**：块菜单 / FloatBar 合并菜单直接复用 `blockPicker.*`；措辞确实不同的
  （任务 vs 待办事项、引用 vs 引用块）才另开 `blockMenu.todoTitle` / `blockMenu.quoteTitle`。
- **块类型图标顺序三处必须一致**（否则"同一位置摆的是不同图标"，看起来像没对齐）：
  块菜单 `ContextMenu`、块类型选择面板 `BlockTypePicker.BASIC_ITEMS`、FloatBar 合并菜单。
  当前约定：`T → H1..H9 → 有序 → 无序 → 任务 → 代码块 → 引用 → 提示块`。
  核对：三处各 `grep -n "blockTypeIcon('\|blockTypeIconComponent('"` 贴出来比。
- ⚠️ **有的源文件是 CRLF**（如 `plugins/lilist/LilistSettingPopover.tsx`），而 `.prettierrc` 是
  `endOfLine: "lf"` → 对它跑 `prettier --write` 会把整个文件行尾改掉（diff 全红）。改完手写格式即可。
  `prettier --check` 对 CRLF 文件永远报 warn，别据此判断"需要格式化"。

## 列表（lilist）约定

- 数据挂在宿主块 `attrs.lilist`：`{ list_type, list_id, list_number, list_custom, list_path? }`；
  「列表」不是 wrapper 类型，是段落/标题上的属性。
- **编号分层口径**：段落按 `attrs.indent`、标题按 `attrs.level`；同组 = 同 `list_id` + 同 `list_type`，
  同组**可以不连续**（「继续之前的编号」并入后会隔段）。`sortLilist` 是唯一的编号回写入口，
  结构变更后必须调它（增量：`fromIndex` 起算）。
- `list_custom` = 用户锚点：以自身值为起点、只影响其后。**同一列表内编号必须严格递增、不重复**
  （铁律，在 `sortLilist` 里统一强制，见下条）；想出现重复编号只能用「开始新列表」拆成两个列表。
- ⚠️ **锚点只许往后跳**：`sortLilist` 里锚点值 ≤ 本层计数器时视为**无效**，按顺序顺延并**清掉
  `list_custom`**（否则会把顺延值固化成新锚点、删掉前项后留下空号）。因此
  `1,2,[2],3,4` 这种坏数据只要被重排一次就会变成 `1,2,3,4,5`。
  ⚠️ 别做成「拒绝用户输入」——用户要的是**重排**（他还是想输 2，是让列表去迁就）；
  而且旧文档里的重复编号**必须能被自动纠正**（`core/index.tsx` 挂载时已有
  `Editor.normalize(editor, { force: true })` → 触发 `withLilist` → 批量 `sortLilist`，加载即自愈）。
- 两处编号回写要保持同一规则：顶层 `lilist-model.sortLilist` 与提示块内部的
  `hint-block-container.ts` 的 inner 排序。
- **列表编号的写入点有 5+ 个**（markdown 转换 `convertBlockToLilist` / 回车 `handleEnter` /
  拖拽 `drag-sort` / 块选择器 `block-nodes` / 编号弹框 `LilistSettingPopover` / 粘贴 `withPasteConversion`）。
  ⚠️ 改编号规则前先 `grep -rn "list_custom\|list_number" src` 列全，否则只修一个入口 = 用户视角「完全没效果」。
  ⚠️ `convertBlockToLilist` 的 startNumber（输入 `2.` + 空格的起始号）**必须也先尝试承接相邻列表**，
  否则起始号 > 1 会另起一个 uuid 组，屏幕上就会出现「重复的 2」。
- ⚠️ **不要**做「相邻且编号重叠的两个列表自动合并」：那与「开始新列表 + 改编号值」的手动拆分
  数据结构完全相同，自动合并会吃掉用户明确想要的拆分。旧坏数据只能靠「继续之前的编号」合并修。
- ⚠️ 向前扫描同组同层项时，遇到非本组块必须 **continue**（不能 break），否则会漏掉隔段同组。

## 块类型语义（备忘）

- **任务列表 = 独立块类型 `TODO_LIST`（`type: 'todo-list'`）**，勾选态在 `attrs.checked`，
  **不是 lilist**（不要和列表编号混在一起想）。回车规则在
  `src/events/keyboard/handleEnter.ts` 的 `handleTodoListEnter`：空项回车→转段落退出列表；
  非空回车→拆行且新项强制 `checked: false`（默认 `insertBreak` 会把 `checked` 一起继承）。
- 回车分发顺序（`handleEnter.ts`）：代码块 →（hint 容器内部行）→ lilist → TODO_LIST → 兜底
  `handleEnterAtBlockEnd` / `insertBreak`。**新增块类型回车规则时，注意插在容器分支之后**。

## 代码风格

- 注释用中文，倾向解释「为什么这么做」而非「做了什么」。
- 组件/插件结构：`src/plugins/<name>/`，核心渲染在 `src/core/{index,renderElement,renderLeaf}.tsx`。

## 复杂插件悬浮 FloatBar 约定

- 6 个插件（image/media/drawio/drawboard/timeline/embed）**各自内嵌**同模式工具条
  （不是共享组件；选区文字的 `components/FloatBar` 是另一套）。当前口径：
  hover **300ms 延迟显示**（`showTimerRef`，pending 时不重复起），离开 300ms 隐藏，
  **hide 时必须同时取消 pending 的 show timer**（否则鼠标已离开还会弹出）；选中态立即常显。
- 新增复杂插件工具条请照抄 Image.tsx 的 show/hide 对称模式。
- 复杂块间距已统一 `margin: @spacing-sm 0`（8px），含 blockquote/hint/media/countdown/chart/columns。

## 提示块 label 的持久化语义

- `attrs.label` 是**持久化**字段：用户自定义过（或旧文档）存的是当时的默认中文。
  显示逻辑 = `attrs.label || t('hintBlock.labels.'+type)`——只有「从未自定义」才跟随语言；
  切类型时同样 `currentAttrs.label || t(...)` 存入。别改成无脑 t()，会覆盖用户自定义。
