import { Editor, Transforms, Element, Node } from 'slate';
import type { CustomElement } from '@/core/types';
import { BlockElementType } from '@/enums';
import { v4 as uuidv4 } from 'uuid';

export interface ColumnGroupAttrs {
  [key: string]: unknown;
}

export interface ColumnAttrs {
  /** 列宽（权重，各列按比例分配容器宽度，总和无须精确为 100） */
  width?: number;
}

/** 创建一个空段落 */
export const createEmptyParagraph = (): CustomElement =>
  ({
    type: BlockElementType.PARAGRAPH,
    id: uuidv4(),
    children: [{ text: '' }],
  }) as CustomElement;

/** 创建一个分栏项。宽度存在列自身 attrs 上 —— 只有这样才能保证 setNodes 后该列必然重渲染 */
export const createColumn = (width?: number): CustomElement =>
  ({
    type: BlockElementType.COLUMN,
    id: uuidv4(),
    attrs: typeof width === 'number' ? { width } : {},
    children: [createEmptyParagraph()],
  }) as CustomElement;

/** 创建分栏组（均分宽度） */
export const createColumnGroup = (columnCount: number): CustomElement => {
  if (columnCount < 1) columnCount = 2;
  if (columnCount > 6) columnCount = 6;
  const base = Math.floor(100 / columnCount);
  const widths = Array.from({ length: columnCount }, (_, i) =>
    i === columnCount - 1 ? 100 - base * (columnCount - 1) : base,
  );
  return {
    type: BlockElementType.COLUMN_GROUP,
    id: uuidv4(),
    attrs: {},
    children: widths.map((w) => createColumn(w)),
  } as CustomElement;
};

/** 读取一组列的宽度数组 */
export const getColumnWidths = (group: CustomElement): number[] => {
  const columns = (group.children || []) as CustomElement[];
  const n = Math.max(1, columns.length);
  return columns.map((c) =>
    typeof (c.attrs as ColumnAttrs | undefined)?.width === 'number'
      ? (c.attrs as ColumnAttrs).width!
      : Math.round(100 / n),
  );
};

/** 判断节点是否为空内容（没有文本或只有空段落） */
export const isColumnEmpty = (column: CustomElement): boolean => {
  if (!column.children || column.children.length === 0) return true;
  return column.children.every((child) => {
    if (Element.isElement(child)) {
      const text = Node.string(child as any);
      return text.trim() === '';
    }
    if ((child as any).text !== undefined) {
      return (child as any).text.trim() === '';
    }
    return true;
  });
};

/** 把 widths 数组按比例缩放，使总和为 100 */
const normalizeTo100 = (widths: number[]): number[] => {
  const valid = widths.map((w) => (Number.isFinite(w) && w > 0 ? w : 1));
  const total = valid.reduce((s, w) => s + w, 0);
  if (total <= 0) return valid.map(() => Math.round(100 / valid.length));
  let scaled = valid.map((w) => Math.round((w / total) * 100));
  const diff = 100 - scaled.reduce((s, w) => s + w, 0);
  if (diff !== 0 && scaled.length > 0) {
    scaled[scaled.length - 1] += diff;
  }
  // 保证最小宽度
  scaled = scaled.map((w) => Math.max(8, w));
  return scaled;
};

/** 在指定索引处新增一列：新列取 1/n 宽度，其余列按比例压缩 */
export const insertColumnAt = (editor: Editor, groupPath: number[], at: number) => {
  try {
    const [groupNode] = Editor.node(editor, groupPath);
    const group = groupNode as CustomElement;
    const oldWidths = getColumnWidths(group);
    const childCount = (group.children || []).length;
    const clampedAt = Math.max(0, Math.min(at, childCount));

    const nextCount = childCount + 1;
    const targetNew = Math.max(12, Math.round(100 / nextCount));
    const remain = 100 - targetNew;
    const oldTotal = oldWidths.reduce((s, w) => s + w, 0) || 100;
    const compressed = oldWidths.map((w) => (w / oldTotal) * remain);

    const widthsNext = [...compressed];
    widthsNext.splice(clampedAt, 0, targetNew);
    const finalWidths = normalizeTo100(widthsNext);

    const column = createColumn(finalWidths[clampedAt]);

    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(editor, column, { at: [...groupPath, clampedAt] });
      // 逐列写入新宽度（改列节点本身，保证每列重渲染）
      for (let i = 0; i < finalWidths.length; i++) {
        if (i === clampedAt) continue;
        Transforms.setNodes(
          editor,
          { attrs: { width: finalWidths[i] } },
          { at: [...groupPath, i] },
        );
      }
    });
  } catch (err) {
    console.error('insertColumnAt failed:', (err as Error)?.message);
  }
};

/** 删除指定列，其宽度按比例分给其余列 */
export const deleteColumnAt = (editor: Editor, groupPath: number[], index: number) => {
  try {
    const [groupNode] = Editor.node(editor, groupPath);
    const group = groupNode as CustomElement;
    const children = (group.children || []) as CustomElement[];

    if (children.length <= 1) {
      // 只剩一列时删除整个分栏组
      Transforms.removeNodes(editor, { at: groupPath });
      return;
    }

    const widths = getColumnWidths(group);
    const remaining = widths.filter((_, i) => i !== index);
    const finalWidths = normalizeTo100(remaining);

    Editor.withoutNormalizing(editor, () => {
      Transforms.removeNodes(editor, { at: [...groupPath, index] });
      for (let i = 0; i < finalWidths.length; i++) {
        Transforms.setNodes(
          editor,
          { attrs: { width: finalWidths[i] } },
          { at: [...groupPath, i] },
        );
      }
    });
  } catch (err) {
    console.error('deleteColumnAt failed:', (err as Error)?.message);
  }
};

/** 调整相邻两列宽度（拖拽分隔线）。只改这两列的节点，重渲染开销最小 */
export const resizeColumnWidth = (
  editor: Editor,
  groupPath: number[],
  leftIndex: number,
  newLeftWeight: number,
) => {
  try {
    const [groupNode] = Editor.node(editor, groupPath);
    const group = groupNode as CustomElement;
    const widths = getColumnWidths(group);
    if (leftIndex < 0 || leftIndex >= widths.length - 1) return;

    const total = widths[leftIndex] + widths[leftIndex + 1];
    const min = Math.max(8, Math.min(total * 0.15, 15));
    const clampedLeft = Math.max(min, Math.min(total - min, Math.round(newLeftWeight)));

    Editor.withoutNormalizing(editor, () => {
      Transforms.setNodes(
        editor,
        { attrs: { width: clampedLeft } },
        { at: [...groupPath, leftIndex] },
      );
      Transforms.setNodes(
        editor,
        { attrs: { width: total - clampedLeft } },
        { at: [...groupPath, leftIndex + 1] },
      );
    });
  } catch (err) {
    console.error('resizeColumnWidth failed:', (err as Error)?.message);
  }
};
