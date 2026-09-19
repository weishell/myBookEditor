// 提示块容器化的编辑器扩展（withColumns 同范式）
//
// 职责：
//  1. normalizeNode：提示块 children 必须是块元素；空的补段落；
//     旧数据（children 直接是 text leaves）自动包裹为段落 —— 兼容迁移。
//  2. insertBreak：提示块内所有未被 handleEnter 接管的换行路径
//     （Shift+Enter 软换行 / 非折叠选区回车）都在容器内安全处理，绝不拆出第二个提示块。
//  3. deleteBackward：内部行行首退格 —— 列表行退列表、空行删行/退出整块、
//     首行行首吞掉（避免默认合并把内容拉出容器破坏结构）。
import { Editor, Element, Node, Path, Point, Range, Transforms } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType } from '@/enums';
import { getLilist } from '@/plugins/lilist/lilist-model';
import {
  createInnerParagraph,
  getHintBlockAtSelection,
  handleInnerEnter,
  sortInnerLilist,
} from './hint-block-container';

export const withHintBlock = (editor: Editor) => {
  const { normalizeNode, insertBreak, deleteBackward } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (Element.isElement(node) && (node as any).type === BlockElementType.HINT_BLOCK) {
      const children = ((node as any).children || []) as any[];

      // 空容器 → 补一个空段落
      if (children.length === 0) {
        Transforms.insertNodes(editor, createInnerParagraph(), { at: [...path, 0] });
        return;
      }

      // 存在非块子节点（旧数据的 text leaves / 残留行内节点）
      // → 逐个取出，以段落为壳原位插回；每次 normalize 处理一个，直到收敛
      const badIdx = children.findIndex(
        (c) => !Element.isElement(c) || !Editor.isBlock(editor, c as any),
      );
      if (badIdx !== -1) {
        const child = children[badIdx];
        Editor.withoutNormalizing(editor, () => {
          Transforms.removeNodes(editor, { at: [...path, badIdx] });
          Transforms.insertNodes(
            editor,
            { type: BlockElementType.PARAGRAPH, id: uuidv4(), children: [child] } as any,
            { at: [...path, badIdx] },
          );
        });
        return;
      }
    }
    normalizeNode([node, path]);
  };

  editor.insertBreak = () => {
    const hint = getHintBlockAtSelection(editor);
    if (!hint) {
      insertBreak();
      return;
    }
    const { selection } = editor;
    if (!selection) {
      insertBreak();
      return;
    }
    if (!Range.isCollapsed(selection)) {
      // 非折叠选区：先删选区再走容器内回车
      Transforms.delete(editor);
      handleInnerEnter(editor);
      return;
    }
    // 折叠光标直达路径（Shift+Enter 软换行等）：行内插 \n，不拆块
    Transforms.insertText(editor, '\n');
  };

  editor.deleteBackward = (unit: any) => {
    const hint = getHintBlockAtSelection(editor);
    if (!hint) {
      deleteBackward(unit);
      return;
    }
    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) {
      deleteBackward(unit);
      return;
    }
    const [hintNode, hintPath] = hint as [any, Path];
    const match = Editor.above(editor, {
      match: (n: any) => Editor.isBlock(editor, n),
      mode: 'lowest',
    });
    if (!match) {
      deleteBackward(unit);
      return;
    }
    const [block, blockPath] = match as [any, Path];
    if (blockPath.length !== hintPath.length + 1) {
      deleteBackward(unit);
      return;
    }
    if (!Point.equals(Range.start(selection), Editor.start(editor, blockPath))) {
      deleteBackward(unit);
      return;
    }

    // ---- 行首退格 ----
    const index = blockPath[blockPath.length - 1];
    const childCount = ((hintNode as any).children || []).length;

    // 列表行行首 → 退出内部列表变段落（同外部 handleLilistBackspace 语义）
    if (getLilist(block)) {
      const attrs = { ...(block as any).attrs };
      delete attrs.lilist;
      Transforms.setNodes(editor, { attrs } as any, { at: blockPath });
      sortInnerLilist(editor, hintPath);
      return;
    }

    if (Node.string(block as any).trim() === '') {
      if (childCount === 1) {
        // 唯一空行 → 整块原地转段落（退出提示块）
        Transforms.setNodes(editor, { type: BlockElementType.PARAGRAPH, attrs: {} } as any, {
          at: hintPath,
        });
        return;
      }
      // 非唯一空行 → 删掉该行，光标落到前一行行尾（无前一行则后一行行首）
      Editor.withoutNormalizing(editor, () => {
        const prevPath = index > 0 ? Path.previous(blockPath) : null;
        Transforms.removeNodes(editor, { at: blockPath });
        if (prevPath) {
          Transforms.select(editor, Editor.end(editor, prevPath));
        } else {
          Transforms.select(editor, Editor.start(editor, blockPath));
        }
      });
      return;
    }

    // 非空首行行首：默认合并会把内容拉出容器，v1 先吞掉不处理
    if (index === 0) return;
    deleteBackward(unit);
  };

  return editor;
};
