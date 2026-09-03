import { Editor, Transforms, type NodeEntry } from 'slate';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import { isCalendarElement, normalizeCalendarAttrs } from './calendar-node';

/**
 * 日历块扩展：
 *  - isVoid：整块不可编辑，内容由组件自绘
 *  - normalizeNode：保证 attrs 合法、子节点为单个零宽文本，
 *    防止异常删除/变更破坏结构后渲染崩溃
 */
export const withCalendar = (editor: Editor) => {
  const { isVoid, normalizeNode } = editor;

  editor.isVoid = (element) => {
    if (isCalendarElement(element)) return true;
    return isVoid(element);
  };

  editor.normalizeNode = (entry: NodeEntry) => {
    const [node, path] = entry;
    if (isCalendarElement(node)) {
      const next = normalizeCalendarAttrs(node.attrs);
      if (JSON.stringify(next) !== JSON.stringify(node.attrs)) {
        Transforms.setNodes(editor, { attrs: next } as any, { at: path, voids: true });
        return;
      }
      // 子节点必须是单个零宽文本
      if (node.children.length !== 1 || typeof node.children[0]?.text !== 'string') {
        Transforms.removeNodes(editor, { at: path, voids: true });
        Transforms.insertNodes(
          editor,
          {
            type: BlockElementType.CALENDAR,
            id: node.id,
            attrs: next,
            children: [{ text: ZERO_WIDTH_SPACE }],
          } as any,
          { at: path, select: false },
        );
        return;
      }
      if (node.children[0].text !== ZERO_WIDTH_SPACE) {
        Transforms.setNodes(editor, { text: ZERO_WIDTH_SPACE } as any, {
          at: [...path, 0],
          voids: true,
        });
        return;
      }
      return;
    }
    normalizeNode(entry);
  };

  return editor;
};
