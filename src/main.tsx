import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import 'katex/dist/katex.min.css';
import './index.css';
import './i18n';
import App from './App.tsx';
import { bootstrapData } from './data/bootstrap';

// 先灌数据快照再渲染：之后页面仍用同步选择器，不需要改成异步组件。
// bootstrapData 内部已兜底（接口不可用时回退内置示例数据），所以这里只用 finally。
void bootstrapData().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
