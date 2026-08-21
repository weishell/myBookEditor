import { isHotkey, type KeyboardEventLike } from 'is-hotkey';
import { Range, type Editor } from 'slate';
import { increaseIndent, decreaseIndent, hasNonIndentableInSelection } from '@/utils/indent';
import { isInCodeBlock, handleCodeBlockTab } from '@/utils/code-tab';
import { showCursorToast, type ToastKey } from '@/components/InlineToast';
import { getLilistAtSelection, indentLilistSubtree, sortLilist } from '@/plugins/lilist';

export function handleTabIndent(editor: Editor, e: React.KeyboardEvent): void {
  // 显式断言为 KeyboardEventLike，避免 any 命中 is-hotkey 的柯里化重载导致 isShift 被推成函数
  // isHotkey 内部已区分 mac/win 修饰键，跨平台无需手写判断
  const event = e as unknown as KeyboardEventLike;
  const isShift = isHotkey('shift+tab', event);
  const isTab = isHotkey('tab', event) || isShift;

  // 代码块内部没有层级概念：Tab 只操作文本（插入/删除制表符），不走文档缩进逻辑
  if (isTab && isInCodeBlock(editor)) {
    e.preventDefault();
    handleCodeBlockTab(editor, isShift);
    return;
  }

  const lilist = getLilistAtSelection(editor);
  // 回退通用缩进只在多块选区走到，编号起跑点 = 选区起始块
  const fromIndex = editor.selection ? ((Range.start(editor.selection).path[0] as number) ?? 0) : 0;

  if (isShift) {
    e.preventDefault();
    if (hasNonIndentableInSelection(editor)) {
      showCursorToast(editor, 'toast.indentOnlyText');
      return;
    }
    // 列表内折叠光标：当前项 + 子项整体减缩进（含编号回写）
    if (lilist && indentLilistSubtree(editor, -1) === 'applied') return;
    decreaseIndent(editor);
    if (lilist) sortLilist(editor, [lilist.list_id], fromIndex);
    return;
  }

  if (isHotkey('tab', event)) {
    e.preventDefault();
    if (hasNonIndentableInSelection(editor)) {
      showCursorToast(editor, 'toast.indentOnlyText');
      return;
    }
    // 列表内折叠光标：当前项 + 子项整体加缩进（含编号回写）
    if (lilist) {
      const result = indentLilistSubtree(editor, 1);
      if (result === 'applied') return;
      if (result === 'blocked') {
        // 子树任一目标超限则整体不动，不回退通用缩进（避免只动父项拆散子树）
        showCursorToast(editor, 'toast.indentMaxReached' as ToastKey);
        return;
      }
    }
    const ok = increaseIndent(editor);
    if (!ok) {
      showCursorToast(editor, 'toast.indentMaxReached' as ToastKey);
    }
    if (lilist) sortLilist(editor, [lilist.list_id], fromIndex);
    return;
  }
}
