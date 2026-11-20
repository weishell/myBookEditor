// 代码高亮：语言包按需加载
//
// prismjs 主包（`import Prism from 'prismjs'`）已内置 markup / css / clike / javascript
// 四种基础语法，其余语言都是独立的 component 文件。之前这里一次性静态引入 10 种语言，
// 于是「文档里没有代码块」的首屏也要把全部语法包下载/解析一遍。
//
// 现在改成：先同步检查 `Prism.languages[language]`，未加载则触发动态 import，
// 加载完成后通知订阅者（编辑器重算 decoration、文件预览组件重渲染）。
import { useEffect, useState } from 'react';
import Prism from 'prismjs';

type PrismLoader = () => Promise<unknown>;

// javascript / css / markup 由 prismjs 主包自带，不需要在这里重复声明。
// 其余语言之间没有互相依赖，可以并行加载。
const LANGUAGE_LOADERS: Record<string, PrismLoader> = {
  typescript: () => import('prismjs/components/prism-typescript'),
  python: () => import('prismjs/components/prism-python'),
  java: () => import('prismjs/components/prism-java'),
  json: () => import('prismjs/components/prism-json'),
  sql: () => import('prismjs/components/prism-sql'),
  bash: () => import('prismjs/components/prism-bash'),
  go: () => import('prismjs/components/prism-go'),
  rust: () => import('prismjs/components/prism-rust'),
};

/** 正在加载中的语言 → Promise，保证同一语言只请求一次 */
const pending = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();

/** 订阅「有语言包加载完成」，返回取消订阅函数 */
export const subscribePrismLanguages = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** 当前语言是否已可用于分词 */
export const isPrismLanguageReady = (language: string): boolean => !!Prism.languages[language];

/**
 * 同步检查语言是否就绪；未就绪时触发动态加载（幂等）。
 * 返回「本次调用时」是否可用，调用方据此决定先降级还是直接高亮。
 */
export const ensurePrismLanguage = (language: string): boolean => {
  if (Prism.languages[language]) return true;

  const loader = LANGUAGE_LOADERS[language];
  if (!loader) return false;

  if (!pending.has(language)) {
    const task = loader()
      .then(() => {
        // 语言包注册到全局 Prism 后，通知所有订阅者重渲染
        listeners.forEach((fn) => fn());
      })
      .catch(() => {
        // 加载失败保持 plaintext 降级；不缓存失败结果，下次渲染可重试
      })
      .finally(() => {
        pending.delete(language);
      });
    pending.set(language, task);
  }
  return false;
};

/** React 组件用：返回语言是否就绪，并自动触发加载 / 订阅加载完成 */
export const usePrismLanguageReady = (language: string): boolean => {
  const [ready, setReady] = useState(() => isPrismLanguageReady(language));

  useEffect(() => {
    if (isPrismLanguageReady(language)) {
      setReady(true);
      return;
    }
    setReady(false);
    const unsubscribe = subscribePrismLanguages(() => {
      setReady(isPrismLanguageReady(language));
    });
    ensurePrismLanguage(language);
    return unsubscribe;
  }, [language]);

  return ready;
};

export const SUPPORTED_LANGUAGES = [
  { id: 'plaintext', name: 'Plain Text' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'css', name: 'CSS' },
  { id: 'json', name: 'JSON' },
  { id: 'markup', name: 'HTML' },
  { id: 'sql', name: 'SQL' },
  { id: 'bash', name: 'Bash' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
];

export const highlightCode = (code: string, language: string): string => {
  ensurePrismLanguage(language);
  const lang = Prism.languages[language] ? language : 'plaintext';
  try {
    return Prism.highlight(code, Prism.languages[lang], lang);
  } catch {
    return Prism.highlight(code, Prism.languages.plaintext, 'plaintext');
  }
};

export const getLanguageName = (languageId: string): string => {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.id === languageId);
  return lang ? lang.name : 'Plain Text';
};
