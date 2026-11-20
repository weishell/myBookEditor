import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import './index.css';
import './i18n';
import App from './App.tsx';
import { AppErrorBoundary } from './components/ErrorBoundary';
import { bootstrapData } from './data/bootstrap';

// 先灌数据快照再渲染：之后页面仍用同步选择器，不需要改成异步组件。
// bootstrapData 内部已兜底（接口不可用时回退内置示例数据），所以这里只用 finally。
void bootstrapData().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      {/* 顶层错误边界：任一块渲染抛错时不留白屏，并给一次「导出正文」的机会 */}
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </StrictMode>,
  );
});
