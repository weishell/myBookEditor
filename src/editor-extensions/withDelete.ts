// 删除/退格劫持插件（withDelete）
//
// 用途：统一拦截 Slate 编辑器的删除行为（退格 deleteBackward、
//       正向删除 deleteForward），方便后续在删除前后插入自定义逻辑，
//       例如：自定义块拆分、空块清理、回收站记录等。
// 当前：透传原行为，不做任何修改，仅占用接入点。
import { Editor } from 'slate';

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
