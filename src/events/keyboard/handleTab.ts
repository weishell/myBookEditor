import { isHotkey } from 'is-hotkey';
import { message } from 'antd';
import type { Editor } from 'slate';
import { increaseIndent, decreaseIndent, hasNonIndentableInSelection } from '@/utils/indent';

/**
 * 处理 Tab 键缩进
 * 始终阻止默认行为，非文本块时给出提示
 */
export function handleTabIndent(editor: Editor, e: React.KeyboardEvent): void {
  // Tab 增加，Shift+Tab 减少，兼容 Mac
  if (isHotkey('shift+tab', e as any)) {
    e.preventDefault();
    if (hasNonIndentableInSelection(editor)) {
      message.warning('缩进仅针对文本类内容');
      return;
    }
    decreaseIndent(editor);
    return;
  }

  if (isHotkey('tab', e as any)) {
    e.preventDefault();
    if (hasNonIndentableInSelection(editor)) {
      message.warning('缩进仅针对文本类内容');
      return;
    }
    increaseIndent(editor);
    return;
  }
}
