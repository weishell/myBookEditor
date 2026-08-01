import { isHotkey } from 'is-hotkey';
import type { Editor } from 'slate';
import { increaseIndent, decreaseIndent, hasNonIndentableInSelection } from '@/utils/indent';
import { showCursorToast, type ToastKey } from '@/components/InlineToast';

export function handleTabIndent(editor: Editor, e: React.KeyboardEvent): void {
  if (isHotkey('shift+tab', e as any)) {
    e.preventDefault();
    if (hasNonIndentableInSelection(editor)) {
      showCursorToast(editor, 'toast.indentOnlyText');
      return;
    }
    decreaseIndent(editor);
    return;
  }

  if (isHotkey('tab', e as any)) {
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
