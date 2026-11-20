import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // 生产包去掉调试日志：只删「纯打印」的调用，console.error / console.warn 一律保留
  // （线上真出问题还得靠它定位，不能一起删）。
  //
  // 为什么用 pure 而不是 drop:
  //   esbuild 的 `drop: ['console']` 是一刀切，error/warn 也一起没了 —— 不可接受。
  //   `pure` 只是告诉 esbuild「这些调用没有副作用」，最终由 minify 阶段的
  //   tree-shaking 把「返回值没人用」的裸调用语句删掉，正好精确命中 console.log(x) 这种写法。
  //   ⚠️ 光有 pure 不会删（只会打上 /* @__PURE__ */ 注释），必须配合 minify 才真正生效，
  //   所以这里只在 build 打开纯函数标记，dev 保持原样方便调试。
  esbuild:
    command === 'build'
      ? {
          pure: [
            'console.log',
            'console.debug',
            'console.info',
            'console.table',
            'console.trace',
            'console.dir',
          ],
          drop: ['debugger'],
        }
      : undefined,
  server: {
    // 本地后端（pnpm dev:server）：前端仍走同源 /api，省掉 CORS
    proxy: {
      '/api': 'http://localhost:3001',
      '/media': 'http://localhost:3001',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');

          // Vite 的运行时代码（__vitePreload 等虚拟模块）必须有自己的小块。
          // 否则默认算法会把它并进某个 manual chunk 里，而每个 chunk 都要 import 它 ——
          // 结果就是那个 chunk（之前是 drawui-vendor，726 kB）被首页无条件拉下来。
          if (
            normalizedId.includes('vite/preload-helper') ||
            normalizedId.includes('vite/modulepreload')
          ) {
            return 'vite-helper';
          }

          if (!normalizedId.includes('node_modules')) {
            return undefined;
          }

          // —— 重库单独成块 ——
          // 这几个库只有特定插件用得上，单独成块后：① 不跟业务代码一起失效，缓存命中率更高；
          // ② 配和下面的动态 import（画板编辑器 / docx 解析），没用到就完全不下载。
          if (/node_modules\/drawui-core\//.test(normalizedId)) {
            return 'drawui-core-vendor';
          }

          // 全屏画板编辑器才用 drawui-react，和 core 分开：文档里只显示缩略图时
          // 只需要 drawui-core，不该把编辑器整包拖下来。
          if (/node_modules\/drawui-react\//.test(normalizedId)) {
            return 'drawui-react-vendor';
          }

          if (/node_modules\/(echarts|echarts-wordcloud|zrender)\//.test(normalizedId)) {
            return 'chart-vendor';
          }

          if (/node_modules\/katex\//.test(normalizedId)) {
            return 'katex-vendor';
          }

          if (/node_modules\/(docx-preview|jszip)\//.test(normalizedId)) {
            return 'docx-vendor';
          }

          if (/node_modules\/(?:@emoji-mart|emoji-mart)\//.test(normalizedId)) {
            return 'emoji-vendor';
          }

          if (
            /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(
              normalizedId,
            )
          ) {
            return 'react-vendor';
          }

          if (
            /node_modules\/(antd|@ant-design|rc-[^/]+|@rc-component\/[^/]+)\//.test(normalizedId)
          ) {
            return 'antd-vendor';
          }

          if (
            /node_modules\/(slate|slate-history|slate-react|react-image-crop)\//.test(normalizedId)
          ) {
            return 'editor-vendor';
          }

          // Prism 单独成块：它只有代码块 / 文本文件预览才用得上，
          // 和 slate 绑在一起会让首页为了 slate 把语言包也一起下了。
          // 语言包（components/*）由 code-highlighter 动态 import，必须保持独立异步 chunk；
          // 如果一起归进 prism-vendor，动态加载就失去意义（核心被静态引用会把它整体拉下来）。
          if (/node_modules\/prismjs\/components\//.test(normalizedId)) {
            return undefined;
          }

          if (/node_modules\/prismjs\//.test(normalizedId)) {
            return 'prism-vendor';
          }

          if (
            /node_modules\/(i18next|react-i18next|i18next-browser-languagedetector)\//.test(
              normalizedId,
            )
          ) {
            return 'i18n-vendor';
          }

          return undefined;
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    modules: {
      // 生成类名格式：文件名_类名_哈希
      generateScopedName: '[name]_[local]_[hash:base64:5]',
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "@/styles/variables.less";`,
      },
    },
  },
}));
