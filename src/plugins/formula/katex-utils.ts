// KaTeX 渲染工具：按需加载
//
// KaTeX 体积约 255 KB（另有字体 CSS），只有文档里真的出现公式时才用得上。
// 之前这里是静态 `import * as katex`，整包被并进编辑器路由的 chunk，纯文字文档也要下载。
//
// 现在改为：
//  - loadKatex() 动态 import，首次调用时加载 JS + CSS，之后复用同一实例；
//  - renderFormulaToHtml 保持同步 API，未加载完成时返回 ''（组件显示占位）；
//  - useKatexReady() 供 React 组件订阅加载状态，加载完成后自动重渲染。
import { useEffect, useState } from 'react';

type KatexModule = typeof import('katex');

let katexInstance: KatexModule | null = null;
let loadingPromise: Promise<KatexModule | null> | null = null;
const listeners = new Set<() => void>();

// KaTeX ESM 是 export default，但 @types/katex 用的是命名导出，
// 这里做一层运行时兼容，保证能拿到真正的 katex 对象。
const pickKatex = (ns: unknown): KatexModule => {
  const module = ns as { default?: { renderToString?: unknown } };
  return (module.default?.renderToString ? module.default : ns) as KatexModule;
};

/** 同步获取已加载的 KaTeX 实例（未加载返回 null） */
export const getKatex = (): KatexModule | null => katexInstance;

/** 加载 KaTeX（幂等）；返回实例，加载失败返回 null */
export const loadKatex = (): Promise<KatexModule | null> => {
  if (katexInstance) return Promise.resolve(katexInstance);
  if (!loadingPromise) {
    loadingPromise = Promise.all([import('katex'), import('katex/dist/katex.min.css')])
      .then(([ns]) => {
        katexInstance = pickKatex(ns);
        listeners.forEach((fn) => fn());
        return katexInstance;
      })
      .catch(() => {
        // 加载失败不缓存，允许下次重试
        loadingPromise = null;
        return null;
      });
  }
  return loadingPromise;
};

/** React 组件用：返回 KaTeX 是否已就绪，挂载时自动触发加载 */
export const useKatexReady = (): boolean => {
  const [ready, setReady] = useState(() => katexInstance !== null);

  useEffect(() => {
    if (katexInstance) {
      setReady(true);
      return;
    }
    let alive = true;
    const listener = () => {
      if (alive) setReady(true);
    };
    listeners.add(listener);
    void loadKatex();
    return () => {
      alive = false;
      listeners.delete(listener);
    };
  }, []);

  return ready;
};

/** 同步渲染公式；KaTeX 尚未加载时返回空串（调用方先显示占位） */
export const renderFormulaToHtml = (tex: string): string => {
  const trimmed = tex.trim();
  if (!trimmed || !katexInstance) return '';
  try {
    return katexInstance.renderToString(trimmed, {
      throwOnError: false,
      displayMode: false,
      strict: false,
      output: 'html',
    });
  } catch {
    return '';
  }
};
