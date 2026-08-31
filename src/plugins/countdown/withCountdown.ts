import { Editor, Transforms, type NodeEntry } from 'slate';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import { DEFAULT_COUNTDOWN_ATTRS, isCountdownElement } from './countdown-utils';

/**
 * 倒计时块扩展：
 *  - isVoid：卡片整体不可编辑，内容由组件自绘
 *  - normalizeNode：保证倒计时块具备默认 attrs 且只有一个零宽文本子节点
 *    （防止异常删除/变更破坏结构后渲染崩溃）
 */
export const withCountdown = (editor: Editor) => {
  const { isVoid, normalizeNode } = editor;

  editor.isVoid = (element) => {
    if (isCountdownElement(element)) return true;
    return isVoid(element);
  };

  editor.normalizeNode = (entry: NodeEntry) => {
    const [node, path] = entry;
    if (isCountdownElement(node)) {
      const attrs = node.attrs;
      const next: typeof node.attrs = {
        mode: attrs?.mode === 'datetime' ? 'datetime' : 'duration',
        duration: {
          days: attrs?.duration?.days ?? DEFAULT_COUNTDOWN_ATTRS.duration.days,
          hours: attrs?.duration?.hours ?? DEFAULT_COUNTDOWN_ATTRS.duration.hours,
          minutes: attrs?.duration?.minutes ?? DEFAULT_COUNTDOWN_ATTRS.duration.minutes,
          seconds: attrs?.duration?.seconds ?? DEFAULT_COUNTDOWN_ATTRS.duration.seconds,
        },
        targetDate: typeof attrs?.targetDate === 'number' ? attrs.targetDate : null,
        notify: attrs?.notify === false ? false : true,
      };
      if (JSON.stringify(next) !== JSON.stringify(attrs)) {
        Transforms.setNodes(editor, { attrs: next } as any, { at: path, voids: true });
        return;
      }
      // 子节点必须是单个零宽文本
      if (node.children.length !== 1 || typeof node.children[0]?.text !== 'string') {
        Transforms.removeNodes(editor, { at: path, voids: true });
        Transforms.insertNodes(
          editor,
          {
            type: BlockElementType.COUNTDOWN,
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
