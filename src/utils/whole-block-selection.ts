// 「整块选中」的共享判定（唯一事实来源）
//
// 背景：非文本（void）块、表格、提示块这类复杂组件，被选中时应当表现为
// 「整块被选中」（一次删除键删除整块、内部文字不出现局部选区高亮）。
// 本文件集中判定「哪些类型支持整块选中」「当前选区是否覆盖了某个块」，
// 供三个地方复用：
//   1) editor-extensions/withDelete.ts      —— 先选中、再删除的删除逻辑
//   2) editor-extensions/withBlockSelection —— 跨表格选区吸附
//   3) 装饰层（ElementWrapper / Table 等）  —— data-whole-selected 选中描边
import { Editor, Element, Point, Range } from 'slate';
import type { Path } from 'slate';
import { useElementIf, useSlateSelector, ReactEditor } from 'slate-react';
import { BlockElementType } from '@/enums';
import { isNonTextType } from '@/editor-extensions/nonText';

/**
 * 可作为「整块」被整体选中的类型。
 *  - 非文本（void）块：图片/视频/附件/图表/日历/倒计时/时间轴/画板/drawio/嵌入/分割线…
 *  - 表格：单元格内可编辑，但整体是复杂组件
 *  - 提示块：内层是段落，但整体是复杂组件
 *  - 代码块：内层是 code-line，但整体是复杂组件
 * 新增这类「复杂容器」时在这里加一行即可，删除逻辑与选中描边自动生效。
 */
export const isWholeSelectableType = (type?: string | null): boolean =>
  isNonTextType(type) ||
  type === BlockElementType.TABLE ||
  type === BlockElementType.HINT_BLOCK ||
  type === BlockElementType.CODE_BLOCK;

/** 节点维度：是否支持整块选中（void 判定走 editor.isVoid，与结构层保持一致） */
export const isWholeSelectableNode = (editor: Editor, node: unknown): boolean =>
  Element.isElement(node) &&
  (editor.isVoid(node) || isWholeSelectableType((node as { type?: string }).type));

/**
 * 「复杂容器」节点：支持整块选中、且内部有可编辑文字（非 void）。
 *  - 表格 / 提示块 / 代码块。
 *  跨容器选区吸附（withBlockSelection）与「整块删除而非删内部」
 * （withDelete.removeFullyCoveredContainers）都只针对这类节点 ——
 *  void 块没有内部文字，不存在这两类问题。
 */
export const isWholeSelectableContainerNode = (editor: Editor, node: unknown): boolean =>
  Element.isElement(node) && !editor.isVoid(node) && isWholeSelectableNode(editor, node);

/**
 * 选区是否「完整覆盖」某个块。
 * 允许选区比这个块更大（例如从表格上方段落一路划到表格里 —— 外面那段文字
 * 仍然是选区的一部分，块本身则按整块处理）。
 *
 * 特例：void 块内部只有一个（多数为空/零宽的）文本节点，选中态本身就
 * 表现为 collapsed 选区，此时块首=块尾，collapsed 也算覆盖。
 */
export const isPathCoveredBySelection = (editor: Editor, path: Path): boolean => {
  const selection = editor.selection;
  if (!selection) return false;
  try {
    const blockStart = Editor.start(editor, path);
    const blockEnd = Editor.end(editor, path);
    const selStart = Range.start(selection);
    const selEnd = Range.end(selection);
    // 选区起点不晚于块首 && 选区终点不早于块尾
    const startsBefore = !Point.isAfter(selStart, blockStart);
    const endsAfter = !Point.isBefore(selEnd, blockEnd);
    return startsBefore && endsAfter;
  } catch {
    return false;
  }
};

/**
 * 组件级 Hook：当前正在渲染的这个块是否处于「整块选中」状态。
 * 只对 isWholeSelectableType 的类型返回 true —— 普通段落整段被选中时不会误判。
 */
export const useWholeBlockSelected = (): boolean => {
  const element = useElementIf();
  return useSlateSelector(
    (editor) => {
      if (!element || !isWholeSelectableType((element as { type?: string }).type)) return false;
      try {
        const path = ReactEditor.findPath(editor, element as any);
        return isPathCoveredBySelection(editor, path);
      } catch {
        return false;
      }
    },
    undefined,
    // 与 useSelected 一致：等 Editable 渲染完再取 path，避免路径过期
    { deferred: true },
  );
};
