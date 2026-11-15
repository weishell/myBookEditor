// 跟随光标定位的行内提示：这是**唯一**需要 slate 运行时的部分（ReactEditor.toDOMRange）。
// 调用方全是编辑器内部代码（Tab 缩进提示、艺术字冲突提示），所以这里静态 import slate 是安全的。
import { ReactEditor } from 'slate-react';
import type { Editor } from 'slate';
import { InlineToastManager, type ToastKey } from './manager';

export type { ToastKey } from './manager';

export function showCursorToast(editor: Editor, messageKey: ToastKey): void {
  try {
    const domRange = ReactEditor.toDOMRange(editor as any, editor.selection as any);
    const rect = domRange.getBoundingClientRect();
    const x = rect.left + rect.width / 2 + window.scrollX;
    const y = rect.bottom + window.scrollY + 8;
    InlineToastManager.show(messageKey, x, y);
  } catch {
    const editorEl = document.querySelector('[data-slate-editor]');
    if (editorEl) {
      const r = editorEl.getBoundingClientRect();
      InlineToastManager.show(
        messageKey,
        r.left + r.width / 2 + window.scrollX,
        r.top + window.scrollY + 8,
      );
    }
  }
}
