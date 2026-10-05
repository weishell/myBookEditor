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

## i18n 约定

- i18next + react-i18next；入口 `src/i18n/index.ts`，词条 `src/i18n/locales/*.ts`（默认导出 + `as const`）。
- 支持 7 种语言：`zh` / `zh-TW` / `en` / `ja` / `ko` / `fr` / `de`；`AppLanguage`、`SUPPORTED_LANGUAGES`、
  `LANGUAGE_SHORT` 都从 `@/i18n` 导出。语言统一由设置下拉的「语言」子面板切换。
- **改 locale 文件后再 Edit 同一文件会报 "File has been modified since read"**（保存后被 prettier 重排）→ Edit 前先 Read。
- 法语字符串用弯引号 `’`（单引号字符串里别用直引号）。
- 数据类名字（品牌名、封面名）用 `t(key, { defaultValue: 原值 })` 做回退，缺翻译时自动用原名。

## 代码风格

- 注释用中文，倾向解释「为什么这么做」而非「做了什么」。
- 组件/插件结构：`src/plugins/<name>/`，核心渲染在 `src/core/{index,renderElement,renderLeaf}.tsx`。
