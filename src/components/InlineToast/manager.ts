// InlineToast 的状态管理（不含任何 slate 依赖）
//
// 为什么从这里拆出来：InlineToastHost 被 App.tsx 顶层渲染，而 showCursorToast
// 需要 slate-react 的 ReactEditor 定位光标。两者放在同一个模块里，就会让
// 「首页」为了一个 Toast 组件把整个 slate 内核（约 60 kB）也下载下来。
// 拆开后：组件侧只依赖 React，定位逻辑侧按需被编辑器代码引入。

export type ToastKey =
  'toast.indentOnlyText' | 'toast.indentMaxReached' | 'toast.artTextGradientConflict';

export interface ToastItem {
  id: number;
  messageKey: ToastKey;
  x: number;
  y: number;
}

let toastId = 0;

class InlineToastManagerClass {
  private listeners = new Set<(toasts: ToastItem[]) => void>();
  private toasts: ToastItem[] = [];
  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  show(messageKey: ToastKey, x: number, y: number): void {
    const id = ++toastId;
    this.toasts = [...this.toasts, { id, messageKey, x, y }];
    this.emit();

    const timer = setTimeout(() => this.dismiss(id), 2000);
    this.timers.set(id, timer);
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.emit();
  }

  subscribe(fn: (toasts: ToastItem[]) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit(): void {
    this.listeners.forEach((fn) => fn(this.toasts));
  }
}

export const InlineToastManager = new InlineToastManagerClass();
