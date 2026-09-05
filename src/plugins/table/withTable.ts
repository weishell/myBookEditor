import { Editor, Element, Transforms, Range } from 'slate';
import type { CustomElement } from '@/core/types';
import { BlockElementType } from '@/enums';
import { v4 as uuidv4 } from 'uuid';
import { computeGrid } from './table-grid';

type NodeEntry = [CustomElement, number[]];

/** 该行从 0 起连续「有格子」（含被上方 rowspan 覆盖）的最大列数 */
const countRowOccupied = (
  grid: { originAt: (unknown | undefined)[][]; cols: number },
  r: number,
): number => {
  let last = -1;
  for (let c = 0; c < grid.cols; c++) {
    if (grid.originAt[r]?.[c]) last = c;
  }
  return last + 1;
};

/** 区间 [from,to) 内是否仍存在被占用的格子（有则说明不是尾部空档，不能补位） */
const rowHasCoveredInside = (
  grid: { originAt: (unknown | undefined)[][]; cols: number },
  r: number,
  from: number,
  to: number,
): boolean => {
  for (let c = from; c < Math.min(to, grid.cols); c++) {
    if (grid.originAt[r]?.[c]) return true;
  }
  return false;
};

const isInTable = (editor: Editor) => {
  const [table] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
    }),
  );
  return !!table;
};

const getCellPath = (editor: Editor): number[] | null => {
  const nodes: NodeEntry[] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE_CELL,
    }),
  );
  const cell = nodes[0];
  return cell ? cell[1] : null;
};

export const withTable = (editor: Editor) => {
  const { normalizeNode, insertBreak } = editor;

  editor.insertBreak = () => {
    if (!isInTable(editor)) {
      insertBreak();
      return;
    }

    const cellPath = getCellPath(editor);
    if (!cellPath) {
      insertBreak();
      return;
    }

    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) {
      insertBreak();
      return;
    }

    const [paragraph] = Editor.node(editor, [...cellPath, 0]);
    const paragraphElement = paragraph as CustomElement;

    if (paragraphElement.children.length === 0 || !paragraphElement.children[0]) {
      return;
    }

    Transforms.insertNodes(
      editor,
      {
        type: BlockElementType.PARAGRAPH,
        id: uuidv4(),
        attrs: {},
        children: [{ text: '' }],
      } as CustomElement,
      {
        at: [...cellPath, 1],
      },
    );

    Transforms.select(editor, {
      anchor: { path: [...cellPath, 1, 0], offset: 0 },
      focus: { path: [...cellPath, 1, 0], offset: 0 },
    });
  };

  editor.normalizeNode = ([node, path]) => {
    const element = node as { type?: string };

    if (element.type === BlockElementType.TABLE) {
      const table = node as CustomElement;
      if (!table.children || table.children.length === 0) {
        return;
      }

      // 用逻辑网格计算每行真实占用的列数：合并（colspan/rowspan）后各行的物理 cell 数
      // 会变少且不一，不能再用「首行 cell 数」当标准去补齐，否则会给合并表误加幽灵格。
      // 只对「末尾存在免费空档」的行补位，修复真正缺少单元格的非法表。
      try {
        const grid = computeGrid(table);
        const rowChildren = table.children as CustomElement[];
        rowChildren.forEach((row, r) => {
          const rowElement = row as CustomElement;
          const occupiedEnd = countRowOccupied(grid, r);
          const rowHasFreeTrailing =
            occupiedEnd < grid.cols && !rowHasCoveredInside(grid, r, occupiedEnd, grid.cols);
          if (rowHasFreeTrailing) {
            const needed = grid.cols - occupiedEnd;
            for (let i = 0; i < needed; i++) {
              rowElement.children.push({
                type: BlockElementType.TABLE_CELL,
                id: uuidv4(),
                attrs: {},
                children: [
                  {
                    type: BlockElementType.PARAGRAPH,
                    id: uuidv4(),
                    attrs: {},
                    children: [{ text: '' }],
                  } as CustomElement,
                ],
              } as CustomElement);
            }
          }
        });
      } catch {
        /* 网格解析失败时跳过补齐，避免破坏结构 */
      }
    }

    if (element.type === BlockElementType.TABLE_CELL) {
      const cell = node as CustomElement;
      if (!cell.children || cell.children.length === 0) {
        cell.children = [
          {
            type: BlockElementType.PARAGRAPH,
            id: uuidv4(),
            attrs: {},
            children: [{ text: '' }],
          } as CustomElement,
        ];
      }
    }

    normalizeNode([node, path]);
  };

  return editor;
};
