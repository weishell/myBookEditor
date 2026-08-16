import { Editor, Transforms, Point, Node, Path } from 'slate';
import { BlockElementType } from '@/enums';
import { handleEnterAtBlockEnd } from '@/utils/block-behaviors';
import { getLilist, removeLilist } from '@/plugins/lilist';

const isSelectionCollapsed = (selection: any): boolean => {
  if (!selection) return false;
  return Point.equals(selection.anchor, selection.focus);
};

export const handleEnter = (editor: Editor) => {
  const { selection } = editor;
  if (!selection || !isSelectionCollapsed(selection)) {
    editor.insertBreak();
    return;
  }

  const match = Editor.above(editor, {
    match: (n: any) => Editor.isBlock(editor, n),
    mode: 'lowest',
  });

  if (match) {
    const [blockNode, blockPath] = match;
    const blockType = (blockNode as any)?.type as BlockElementType;

    if (blockType === BlockElementType.CODE_BLOCK) {
      Transforms.insertText(editor, '\n');
      return;
    }

    // lilist 列表行为
    const lilist = getLilist(blockNode);
    if (lilist) {
      // 空列表项回车 → 退出列表
      if (Node.string(blockNode as any).trim() === '') {
        removeLilist(editor, blockPath);
        return;
      }
      // 非空 → 拆分延续，新项为延续项：四字段完整写入，编号从 1 占位（渲染期重算）、非锚点
      editor.insertBreak();
      try {
        const newPath = Path.next(blockPath);
        const newNode = Node.get(editor, newPath) as any;
        if (newNode?.attrs?.lilist) {
          Transforms.setNodes(
            editor,
            {
              attrs: {
                ...newNode.attrs,
                lilist: {
                  list_type: lilist.list_type,
                  list_id: lilist.list_id,
                  list_number: 1,
                  list_custom: false,
                },
              },
            } as any,
            { at: newPath },
          );
        }
      } catch {
        /* ignore */
      }
      return;
    }
  }

  if (!handleEnterAtBlockEnd(editor)) {
    editor.insertBreak();
  }
};
