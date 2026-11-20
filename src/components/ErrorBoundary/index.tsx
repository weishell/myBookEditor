import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { Descendant } from 'slate';
import { loadDraft } from '@/data/draft';
import styles from './ErrorBoundary.module.less';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  /** 崩溃瞬间抓到的正文，供「导出」按钮使用（不放进渲染树，避免二次崩溃） */
  snapshot: Descendant[] | null;
}

/**
 * 部署新版本后，老页面引用的 chunk 文件名已经不存在，动态 import 会 reject →
 * React.lazy 把它抛成渲染错误，表现就是「点进页面白屏」。这不是真崩溃，刷新一下就好，
 * 值得给一句能读懂的话，而不是让用户以为数据丢了。
 */
const CHUNK_ERROR_RE =
  /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk .* failed|error loading dynamically imported module/i;

/**
 * 崩溃时抢救正文，两条来源按可靠性排序：
 *   1. 编辑器实例（window.editor）—— 只在这一刻还在，之后 React 卸载子树，core 的 cleanup 会 delete 掉
 *   2. 本机草稿（/article/:id 路由）—— 上次保存动作写下的，崩溃前没保存过就没有
 * 所以必须在 getDerivedStateFromError 里抓（render 阶段，旧树尚未卸载），不能等到 componentDidCatch。
 */
function captureSnapshot(): Descendant[] | null {
  const live = (window as unknown as { editor?: { children?: Descendant[] } }).editor?.children;
  if (Array.isArray(live) && live.length > 0) return live;

  const matched = /^\/article\/([^/]+)/.exec(window.location.pathname);
  if (!matched) return null;
  return loadDraft(decodeURIComponent(matched[1]))?.content ?? null;
}

/**
 * 顶层错误边界。
 *
 * 只兜「渲染期」异常：事件处理器里的错误、未捕获的 Promise rejection 都到不了这里
 * （前者由 window.onerror 接、后者在各自调用方 catch）。目的单一——
 * 别让一次渲染抛错把整棵树卸载成白屏，至少留一条出口和一份能导出的数据。
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null, snapshot: null };

  static getDerivedStateFromError(error: Error): State {
    return { error, snapshot: captureSnapshot() };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // 生产包保留了 console.error（vite 只 strip 了 log/debug/info），
    // 白屏时把组件栈打出来，能直接定位到是哪个插件/块渲染炸了
    console.error('[app] 渲染崩溃：', error, info.componentStack);
  }

  private reload = (): void => {
    window.location.reload();
  };

  private exportSnapshot = (): void => {
    const snapshot = this.state.snapshot;
    if (!snapshot) return;
    try {
      const blob = new Blob(
        [JSON.stringify({ savedAt: new Date().toISOString(), content: snapshot }, null, 2)],
        { type: 'application/json' },
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mybook-snapshot-${Date.now()}.json`;
      a.click();
      // 立即 revoke 会让 Safari 拿不到数据，延后一拍
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.warn('[app] 导出当前正文失败：', err);
    }
  };

  render(): ReactNode {
    const { error, snapshot } = this.state;
    if (!error) return this.props.children;

    const chunkFailed = CHUNK_ERROR_RE.test(error.message);

    return (
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>{chunkFailed ? '页面已更新' : '页面出错了'}</h1>
          <p className={styles.desc}>
            {chunkFailed
              ? '当前打开的是旧版本的页面，需要刷新后加载新代码。'
              : snapshot
                ? '渲染过程中断，但正文已经抓到了。先点「导出当前正文」存一份，再刷新。'
                : '渲染过程中断。刷新后重新打开这篇文档即可，服务器上的内容没有受影响。'}
          </p>

          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={this.reload}>
              刷新页面
            </button>
            {snapshot && (
              <button type="button" className={styles.ghost} onClick={this.exportSnapshot}>
                导出当前正文
              </button>
            )}
            <a className={styles.ghost} href="/">
              返回首页
            </a>
          </div>

          {/* 技术细节默认收起：普通用户不需要看，排查时展开即可 */}
          <details className={styles.detail}>
            <summary>错误详情</summary>
            <pre className={styles.pre}>{error.stack || error.message}</pre>
          </details>
        </div>
      </div>
    );
  }
}
