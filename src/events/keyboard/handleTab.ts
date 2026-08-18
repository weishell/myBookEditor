import { isHotkey, type KeyboardEventLike } from 'is-hotkey';
import type { Editor } from 'slate';
import { increaseIndent, decreaseIndent, hasNonIndentableInSelection } from '@/utils/indent';
import { showCursorToast, type ToastKey } from '@/components/InlineToast';
import { getLilistAtSelection } from '@/plugins/lilist';

export function handleTabIndent(editor: Editor, e: React.KeyboardEvent): void {
  // 显式断言为 KeyboardEventLike，避免 any 命中 is-hotkey 的柯里化重载导致 isShift 被推成函数
  const event = e as unknown as KeyboardEventLike;
  const isShift = isHotkey('shift+tab', event);
  // lilist 劫持点：列表内的 Tab/Shift+Tab 已被接管，暂不做列表专属处理（先打 log 占位）
  if (getLilistAtSelection(editor)) {
    console.log(`[lilist] ${isShift ? 'Shift+Tab' : 'Tab'} 已劫持（暂走通用缩进，待列表专属处理）`);
  }

  if (isShift) {
    e.preventDefault();
    if (hasNonIndentableInSelection(editor)) {
      showCursorToast(editor, 'toast.indentOnlyText');
      return;
    }
    decreaseIndent(editor);
    return;
  }

  if (isHotkey('tab', event)) {
    e.preventDefault();
    if (hasNonIndentableInSelection(editor)) {
      showCursorToast(editor, 'toast.indentOnlyText');
      return;
    }
    const ok = increaseIndent(editor);
    if (!ok) {
      showCursorToast(editor, 'toast.indentMaxReached' as ToastKey);
    }
    return;
  }
}
