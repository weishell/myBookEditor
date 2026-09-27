// 跨表格选区吸附（withBlockSelection）
//
// 需求：从表格外部拖选、划入表格内部时，不出现「单元格内文字的局部选区」，
// 而是像飞书/Notion 一样把整个表格当作一个块选中；同时**表格外面的选区必须保留**。
//
// 实现方式：在 apply 层拦截 set_selection 操作。
//  - 候选选区（当前 selection 合并 newProperties）为展开选区
//  - 且恰好只有一端落在某个顶层 TABLE 内（另一端在表格外）
//  → 只把「落在表格内的那一端」吸附到表格边缘，另一端原样保留：
//      外部端点在表格之前 → 内部端点吸附到表格末尾
//      外部端点在表格之后 → 内部端点吸附到表格开头
//    这样选区 = 外部内容 + 整个表格（表格内部不再有文字的局部选区）。
//
// 为什么不能把选区直接改写为「整表范围」：那样会把表格外面的选区整段丢掉
//（表现为从上方段落一路拖进表格后，上方那段文字的选区凭空消失、Ctrl+C 也只复制到表格）。
//
// 稳定性：吸附后内部端点落在表格边界上，再次经过本拦截得到相同结果（幂等），不会递归。
import { Editor, Element, Point, Range } from 'slate';
import { BlockElementType } from '@/enums';

/** 点是否严格落在顶层第 i 个块内部（path 深于 [i]） */
const isInsideTopBlock = (path: number[], i: number): boolean => path.length > 1 && path[0] === i;

export const withBlockSelection = (editor: Editor) => {
  const { apply } = editor;

  editor.apply = (op: any) => {
    if (op?.type === 'set_selection' && op.newProperties) {
      try {
        // set_selection 的 newProperties 可能只带 anchor 或 focus 一端，
        // 与当前 selection 合并后才是完整候选选区
        const merged: any = { ...(editor.selection || {}), ...op.newProperties };
        if (merged.anchor?.path && merged.focus?.path && Range.isExpanded(merged)) {
          const { anchor, focus } = merged;
          const children: any[] = (editor as any).children;
          for (let i = 0; i < children.length; i++) {
            const node = children[i];
            if (!Element.isElement(node) || (node as any).type !== BlockElementType.TABLE) {
              continue;
            }
            const aIn = isInsideTopBlock(anchor.path, i);
            const fIn = isInsideTopBlock(focus.path, i);
            // 恰好一端在表格内、一端在外 → 跨表格选区
            if (aIn !== fIn) {
              const outsidePoint = aIn ? focus : anchor;
              const tableStart = Editor.start(editor, [i]);
              const tableEnd = Editor.end(editor, [i]);
              // 外部端点在表格之前 → 内部端点吸附到表格末尾；否则吸附到表格开头
              const snapped = Point.isBefore(outsidePoint, tableStart) ? tableEnd : tableStart;
              if (aIn) {
                op = { ...op, newProperties: { ...op.newProperties, anchor: snapped } };
              } else {
                op = { ...op, newProperties: { ...op.newProperties, focus: snapped } };
              }
              break;
            }
          }
        }
      } catch {
        /* 选区结构异常时放行原 op，交给 Slate 自行处理 */
      }
    }
    apply(op);
  };

  return editor;
};
