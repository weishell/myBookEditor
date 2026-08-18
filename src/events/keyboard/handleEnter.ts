// Enter 键处理：代码块软换行、lilist 列表三分支（对齐 template.md handleOlUlListEnter）、其余走块级默认
// lilist 分支仅处理折叠光标；选区回车暂不接管，走默认 insertBreak
// 全程同步执行（withoutNormalizing + Transforms），结构变更后调 sortLilist 回写编号，无 sleep
import { Editor, Transforms, Point, Node, Path, Range } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType } from '@/enums';
import { handleEnterAtBlockEnd } from '@/utils/block-behaviors';
import { decreaseIndent } from '@/utils/indent';
import { getLilist, removeLilist, sortLilist, type LilistAttr } from '@/plugins/lilist';

const isSelectionCollapsed = (selection: any): boolean => {
  if (!selection) return false;
  return Point.equals(selection.anchor, selection.focus);
};

/**
 * 构造一个继承宿主块的空列表项（对齐 template 的 addEmptyOlUlList）
 * 类型 / attrs（含标题 level 等）随宿主，lilist 与缩进按覆盖项更新
 */
const makeEmptyLilistBlock = (
  current: any,
  lilist: LilistAttr,
  overrides?: Partial<LilistAttr> & { indent?: number },
): any => {
  const { indent, ...lilistOverrides } = overrides || {};
  return {
    type: current?.type,
    id: uuidv4(),
    attrs: {
      ...(current?.attrs || {}),
      lilist: { ...lilist, ...lilistOverrides },
      ...(indent !== undefined ? { indent } : {}),
    },
    children: [{ text: '' }],
  };
};

/**
 * 下一相邻同组项的缩进（对齐 template 的 getNextIndent）
 * 回车新增项若落在更深缩进的子列表前方，跟随其缩进；无则返回 -1
 */
const getNextIndent = (editor: Editor, path: Path, listId: string): number => {
  try {
    const next = Node.get(editor, Path.next(path)) as any;
    if (getLilist(next)?.list_id === listId) {
      return next?.attrs?.indent ?? 0;
    }
  } catch {
    /* 已是最后一项 */
  }
  return -1;
};

/** 光标落在新项行首（同步版 focusSelection，替代 template 的 sleep(50) + 移焦点） */
const focusBlockStart = (editor: Editor, path: Path) => {
  try {
    Transforms.select(editor, Editor.start(editor, path));
  } catch {
    /* ignore */
  }
};

/**
 * lilist 列表内回车（折叠光标），按光标位置三分支：
 *  - BOL：空行+无缩进 → 退出列表；空行+有缩进 → 减缩进；非空 → 上方插入空项（锚点跟随上移）
 *  - EOL：标题宿主 → 列表后补普通段落；段落 → 追加空项（缩进跟随下一相邻子列表）
 *  - MID：光标前全空白 → 清空白并在上方插空项；否则 → 拆行，新项继承列表属性（非锚点）
 */
const handleLilistEnter = (editor: Editor, node: any, path: Path, lilist: LilistAttr) => {
  const { selection } = editor;
  if (!selection) return;

  const start = Editor.start(editor, path);
  const end = Editor.end(editor, path);
  const cursor = Range.start(selection);
  const isEmpty = Node.string(node as any).trim() === '';
  const indent: number = node?.attrs?.indent ?? 0;

  /* ---------------- 行首 ---------------- */
  if (Point.equals(cursor, start)) {
    if (isEmpty && indent === 0) {
      // 空行回车 → 退出列表（removeLilist 内部已重排原组编号）
      removeLilist(editor, path);
      return;
    }
    if (isEmpty && indent > 0) {
      // 空行有缩进 → 只减缩进，留在列表内
      decreaseIndent(editor);
      sortLilist(editor, [lilist.list_id], path[0]);
      return;
    }
    // 非空行首 → 在上方插入空列表项，原项下移；锚点随空项上移（对齐 template）
    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(
        editor,
        makeEmptyLilistBlock(node, lilist, { list_custom: lilist.list_custom }),
        { at: path },
      );
      if (lilist.list_custom) {
        const movedPath = Path.next(path);
        const moved = Node.get(editor, movedPath) as any;
        Transforms.setNodes(
          editor,
          {
            attrs: {
              ...(moved?.attrs || {}),
              lilist: { ...lilist, list_custom: false },
            },
          } as any,
          { at: movedPath },
        );
      }
    });
    sortLilist(editor, [lilist.list_id], path[0]);
    focusBlockStart(editor, Path.next(path));
    return;
  }

  /* ---------------- 行尾 ---------------- */
  if (Point.equals(cursor, end)) {
    // 标题宿主：行尾回车结束列表段，在其后补普通段落（对齐 template 的非 PARAGRAPH 分支）
    if (node?.type !== BlockElementType.PARAGRAPH) {
      const newPath = Path.next(path);
      Transforms.insertNodes(
        editor,
        { type: BlockElementType.PARAGRAPH, id: uuidv4(), children: [{ text: '' }] } as any,
        { at: newPath },
      );
      focusBlockStart(editor, newPath);
      return;
    }
    // 段落 → 追加空列表项；下一相邻是更深的同组子列表时，新项跟随其缩进
    const nextIndent = getNextIndent(editor, path, lilist.list_id);
    const newIndent = nextIndent !== -1 && indent < nextIndent ? nextIndent : indent;
    const newPath = Path.next(path);
    Transforms.insertNodes(
      editor,
      makeEmptyLilistBlock(node, lilist, { list_custom: false, indent: newIndent }),
      { at: newPath },
    );
    sortLilist(editor, [lilist.list_id], path[0]);
    focusBlockStart(editor, newPath);
    return;
  }

  /* ---------------- 行中 ---------------- */
  const beforeText = Editor.string(editor, { anchor: start, focus: cursor }, { voids: true });
  if (/^\s*$/.test(beforeText)) {
    // 光标前全空白：清掉前导空白，在上方插入空列表项（保留原项文字与缩进）
    Editor.withoutNormalizing(editor, () => {
      Transforms.delete(editor, { at: { anchor: start, focus: cursor } });
      Transforms.insertNodes(
        editor,
        makeEmptyLilistBlock(node, lilist, { list_custom: lilist.list_custom, indent }),
        { at: path },
      );
      if (lilist.list_custom) {
        const movedPath = Path.next(path);
        const moved = Node.get(editor, movedPath) as any;
        Transforms.setNodes(
          editor,
          {
            attrs: {
              ...(moved?.attrs || {}),
              lilist: { ...lilist, list_custom: false },
            },
          } as any,
          { at: movedPath },
        );
      }
    });
    sortLilist(editor, [lilist.list_id], path[0]);
    focusBlockStart(editor, path);
    return;
  }

  // 常规拆分：splitNodes 后新项继承列表属性（非锚点），编号由 sortLilist 回写
  const nextIndent = getNextIndent(editor, path, lilist.list_id);
  const newIndent = nextIndent !== -1 && indent < nextIndent ? nextIndent : indent;
  Editor.withoutNormalizing(editor, () => {
    Transforms.splitNodes(editor, { always: true });
    const newPath = Path.next(path);
    const newNode = Node.get(editor, newPath) as any;
    Transforms.setNodes(
      editor,
      {
        attrs: {
          ...(newNode?.attrs || {}),
          lilist: { ...lilist, list_custom: false },
          indent: newIndent,
        },
      } as any,
      { at: newPath },
    );
  });
  sortLilist(editor, [lilist.list_id], path[0]);
  focusBlockStart(editor, Path.next(path));
};

export const handleEnter = (editor: Editor) => {
  const { selection } = editor;
  if (!selection || !isSelectionCollapsed(selection)) {
    // 选区回车暂不做列表专属处理，走默认
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

    const lilist = getLilist(blockNode);
    if (lilist) {
      console.log('[lilist] Enter 已劫持', {
        list_type: lilist.list_type,
        list_id: lilist.list_id,
        path: blockPath,
      });
      handleLilistEnter(editor, blockNode, blockPath, lilist);
      return;
    }
  }

  if (!handleEnterAtBlockEnd(editor)) {
    editor.insertBreak();
  }
};
