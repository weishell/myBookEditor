// 字数统计的轻量状态
//
// 为什么不用 Context：正文每次输入都会刷新字数，若放进 Context，所有消费
// useEditorMode 的页面都会跟着重渲染。这里用一个极小的外部 store，
// 只让右下角那个字数气泡订阅更新；设置页也能读写同一个开关。
import { useSyncExternalStore } from 'react';

const ENABLED_KEY = 'mybook-word-count-enabled';

function readEnabled(): boolean {
  try {
    return localStorage.getItem(ENABLED_KEY) !== '0';
  } catch {
    return true;
  }
}

let wordCount = 0;
let enabled = readEnabled();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getWordCount(): number {
  return wordCount;
}

export function setWordCount(next: number) {
  const safe = Number.isFinite(next) && next > 0 ? Math.floor(next) : 0;
  if (safe === wordCount) return;
  wordCount = safe;
  emit();
}

export function getWordCountEnabled(): boolean {
  return enabled;
}

export function setWordCountEnabled(next: boolean) {
  if (next === enabled) return;
  enabled = next;
  try {
    localStorage.setItem(ENABLED_KEY, next ? '1' : '0');
  } catch {
    /* 忽略存储异常 */
  }
  emit();
}

/** 订阅当前文档字数（编辑过程中实时变化） */
export function useWordCount(): number {
  return useSyncExternalStore(subscribe, getWordCount);
}

/** 订阅「是否显示字数」这一设置项 */
export function useWordCountEnabled(): boolean {
  return useSyncExternalStore(subscribe, getWordCountEnabled);
}
