// 表格结构守卫（只负责 normalizeNode）
//
// 为什么单独一个文件：表格的结构自愈（补缺失的格子 / 补空表）原来写在 withTable 里，
// 但 withTable 只是插件元数据里声明了 `extensions: [withTable]`，**从未被挂到编辑器链上**
// —— 也就是说这段 normalize 从来没跑过。而 withTable 里另外那个 insertBreak 实现有缺陷
// （它假设 cell 里只有第一个段落，不看当前在哪个段落，直接往 cell 顶部插），贸然整体接入
// 会改变表格内回车行为，所以这次只把「结构」这部分摘出来单独挂。
//
// 职责：让表格在任何情况下都满足「TABLE → ROW(s) → CELL(s) → 块」这个最小合法结构。
// 只做「补」，不删，幂等。
import { Editor, Transforms } from 'slate';
import type { CustomElement } from '@/core/types';
import { BlockElementType } from '@/enums';
import { v4 as uuidv4 } from 'uuid';
import { computeGrid } from './table-grid';

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

/** 一个最小合法的表格单元格（格子 → 段落 → 空文本） */
const createCell = (): CustomElement => ({
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
});

/** 一个最小合法的表格行（按列数铺满空单元格） */
const createRow = (cols: number): CustomElement => ({
  type: BlockElementType.TABLE_ROW,
  id: uuidv4(),
  attrs: {},
  children: Array.from({ length: Math.max(1, cols) }, () => createCell()),
});

export const withTableStructure = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    const element = node as { type?: string };

    if (element.type === BlockElementType.TABLE) {
      const table = node as CustomElement;

      // 空表：必须补一整行再 return。
      // 一旦交给 Slate 默认规则，它会塞 { text: '' }，表格当场被判定成「行内容器」，
      // 之后插进去的行全被 unwrap —— 不可逆，且极难排查。
      if (!table.children || table.children.length === 0) {
        Transforms.insertNodes(editor, createRow(1) as any, { at: [...path, 0] });
        return;
      }

      // 用逻辑网格计算每行真实占用的列数：合并（colspan/rowspan）后各行的物理 cell 数
      // 会变少且不一，不能再用「首行 cell 数」当标准去补齐，否则会给合并表误加幽灵格。
      // 只对「末尾存在免费空档」的行补位，修复真正缺少单元格的非法表。
      try {
        const grid = computeGrid(table);
        const rows = table.children as CustomElement[];

        // 先把所有要补的行算出来，再统一插入。
        // ⚠️ 必须走 Transforms —— 老实现是 row.children.push(...) 直接改内存：不产生 op，
        // 补进去的格子既进不了 history（撤销撤不掉），也不会标脏路径（Slate 不知道要
        // 重新 normalize / 渲染），还破坏了「文档不可变」这个前提。
        const fixes: Array<{ rowIndex: number; startAt: number; needed: number }> = [];
        rows.forEach((row, r) => {
          const occupiedEnd = countRowOccupied(grid, r);
          const rowHasFreeTrailing =
            occupiedEnd < grid.cols && !rowHasCoveredInside(grid, r, occupiedEnd, grid.cols);
          if (!rowHasFreeTrailing) return;
          const cells = (row.children as CustomElement[]) || [];
          fixes.push({ rowIndex: r, startAt: cells.length, needed: grid.cols - occupiedEnd });
        });

        if (fixes.length > 0) {
          Editor.withoutNormalizing(editor, () => {
            // 从后往前插：同一张表里多行都要补时，前面行的插入不会顶偏后面行的 path
            for (let i = fixes.length - 1; i >= 0; i -= 1) {
              const { rowIndex, startAt, needed } = fixes[i];
              Transforms.insertNodes(
                editor,
                Array.from({ length: needed }, () => createCell()) as any,
                { at: [...path, rowIndex, startAt] },
              );
            }
          });
          return;
        }
      } catch {
        /* 网格解析失败时跳过补齐，避免破坏结构 */
      }
    }

    if (element.type === BlockElementType.TABLE_CELL) {
      const cell = node as CustomElement;
      // 空格子同样要补段落并 return，理由同上：别让默认规则塞裸文本进去
      if (!cell.children || cell.children.length === 0) {
        Transforms.insertNodes(
          editor,
          {
            type: BlockElementType.PARAGRAPH,
            id: uuidv4(),
            attrs: {},
            children: [{ text: '' }],
          } as CustomElement,
          { at: [...path, 0] },
        );
        return;
      }
    }

    normalizeNode([node, path]);
  };

  return editor;
};
