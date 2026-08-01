import { Editor } from 'slate';

/**
 * 劫持删除操作（deleteBackward / deleteForward）
 * 目前仅透传原始行为，后续在此扩展自定义删除逻辑
 */
export const withDelete = (editor: Editor) => {
  const { deleteBackward, deleteForward } = editor;

  editor.deleteBackward = (unit) => {
    // TODO: 后续自定义 backward 删除逻辑
    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    // TODO: 后续自定义 forward 删除逻辑
    deleteForward(unit);
  };

  return editor;
};
