// 复杂插件间隙双击插入空段落
//
// 背景：复杂插件（图片/表格/提示块/流程图…）相邻排列时，中间只剩一条窄缝，
// 用户没有落点可以把光标放到两块之间（想在两块之间补段说明文字都没地方打）。
// 双击这条缝隙 → 在两块之间插入一个空段落并落焦。
//
// 判定（缺一不可）：
//  1. 双击目标不在任何块内部（target 没有 [data-block-type] 祖先）——
//     落在块里就交还原生双击行为（选词等），不抢；
//  2. 双击纵坐标恰好落在「相邻两个复杂块」之间的竖向空隙内
//     （上块 rect.bottom ≤ Y ≤ 下块 rect.top）；
//  3. 非只读（由调用方保证）。
import { Editor, Element as SlateElement, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { BlockElementType } from '@/enums';
import { createBlockNode } from '@/plugins/block-picker';

/**
 * 支持「缝隙双击插段落」的复杂块类型（用户圈定集合）：
 * 提示块/代码块/画板/流程图/日历/时间轴/分栏/表格/图表/图片/视频/文件。
 * 之后要放开别的类型（倒计时/嵌入/分割线…）在这里加一行即可。
 */
export const COMPLEX_GAP_BLOCK_TYPES = new Set<string>([
  BlockElementType.HINT_BLOCK,
  BlockElementType.CODE_BLOCK,
  BlockElementType.DRAWBOARD,
  BlockElementType.DRAWIO,
  BlockElementType.CALENDAR,
  BlockElementType.TIMELINE,
  BlockElementType.COLUMN_GROUP,
  BlockElementType.TABLE,
  BlockElementType.CHART,
  BlockElementType.IMAGE_BLOCK,
  BlockElementType.VIDEO_BLOCK,
  BlockElementType.FILE_BLOCK,
]);

const isComplexBlockNode = (node: unknown): boolean =>
  SlateElement.isElement(node) &&
  COMPLEX_GAP_BLOCK_TYPES.has((node as { type?: string }).type ?? '');

/**
 * 处理「双击复杂块间隙」：命中则插入空段落并落焦，返回 true（调用方应
 * preventDefault + stopPropagation）；未命中返回 false，交还默认行为。
 */
export const handleGapDoubleClick = (editor: Editor, e: ReactMouseEvent): boolean => {
  const target = e.target as HTMLElement | null;
  // 落在某个块内部 → 不是缝隙，交还原生双击行为
  if (target?.closest?.('[data-block-type]')) return false;

  const { children } = editor;
  // 逐对顶层块找「上块 bottom ≤ 双击Y ≤ 下块 top」的竖向缝隙
  for (let i = 0; i < children.length - 1; i++) {
    const upper = children[i];
    const lower = children[i + 1];
    if (!isComplexBlockNode(upper) || !isComplexBlockNode(lower)) continue;
    let upperRect: DOMRect;
    let lowerRect: DOMRect;
    try {
      upperRect = ReactEditor.toDOMNode(editor, upper).getBoundingClientRect();
      lowerRect = ReactEditor.toDOMNode(editor, lower).getBoundingClientRect();
    } catch {
      continue; // DOM 尚未挂载（极罕见），跳过这一对
    }
    if (e.clientY >= upperRect.bottom && e.clientY <= lowerRect.top) {
      // 与「在下方插入」同源：走 createBlockNode(PARAGRAPH)，插入后光标落进新段落
      Transforms.insertNodes(editor, createBlockNode(BlockElementType.PARAGRAPH) as any, {
        at: [i + 1],
      });
      Transforms.select(editor, Editor.start(editor, [i + 1]));
      ReactEditor.focus(editor);
      return true;
    }
  }
  return false;
};
