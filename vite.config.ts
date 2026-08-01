import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');

          if (!normalizedId.includes('node_modules')) {
            return undefined;
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
            /node_modules\/(slate|slate-history|slate-react|prismjs|react-image-crop)\//.test(
              normalizedId,
            )
          ) {
            return 'editor-vendor';
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
});
