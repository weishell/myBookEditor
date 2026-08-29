// DocBar 块类型转换命令层
// 操作对象：单一块（由 DocBar / 右键菜单的 targetId 定位出的顶层 path）
//
// 核心规则：
//  1. 标题/段落/引用/待办/代码块 之间可互转；媒体类块（图片/表格/文件/视频/流程图）不参与转换。
//  2. 列表通过 attrs.lilist 表达，有序/无序列表的切换要注意相邻列表的合并：
//     - 别的类型 → 有序：检查上方/下方是否有同宿主类型的有序列表，存在则接入同一 list_id；
//       若上下都有且 list_id 不同，把下方整组合并进上方组，随后重排编号。
//     - 别的类型 → 无序：检查上方同宿主类型的无序列表并接入（不重排）；下方合并可选。
//  3. 有序/无序 → 其它类型：先 removeLilist，对有序列表会触发一次组内重排。
//  4. 标题不能宿主无序列表；段落转标题时若有无序列表会先取消。

import { Editor, Node, Path, Transforms } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import {
  getLilist,
  isLilistHost,
  LilistType,
  sortLilist,
  type LilistAttr,
} from '@/plugins/lilist/lilist-model';
import { removeLilist } from '@/plugins/lilist/lilist-commands';

export type DocBarConvertTarget =
  | 'text'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'h7'
  | 'h8'
  | 'h9'
  | 'numbered-list'
  | 'bulleted-list'
  | 'checkbox'
  | 'quote'
  | 'code-block';

/** 可作为 DocBar 类型转换源/目标的块类型 */
export const CONVERTIBLE_BLOCK_TYPES: BlockElementType[] = [
  BlockElementType.PARAGRAPH,
  BlockElementType.HEADING,
  BlockElementType.BLOCKQUOTE,
  BlockElementType.TODO_LIST,
  BlockElementType.CODE_BLOCK,
];

const cleanAttrsForType = (attrs: any, type: BlockElementType) => {
  const next = { ...(attrs || {}) };
  if (type !== BlockElementType.HEADING) delete next.level;
  if (type !== BlockElementType.BLOCKQUOTE) {
    delete next.type;
    delete next.label;
  }
  if (type !== BlockElementType.TODO_LIST) delete next.checked;
  if (type !== BlockElementType.CODE_BLOCK) {
    delete next.language;
    delete next.wrap;
    delete next.height;
  }
  return next;
};

const setBlockLilist = (editor: Editor, path: Path, lilist: LilistAttr) => {
  const node = Node.get(editor, path) as any;
  Transforms.setNodes(editor, { attrs: { ...(node?.attrs || {}), lilist } } as any, { at: path });
};

const collectSameListId = (editor: Editor, startIndex: number, listId: string): number[] => {
  const children = (editor as any).children as any[];
  const res: number[] = [];
  for (let i = startIndex; i < children.length; i++) {
    const cur = children[i];
    if (getLilist(cur)?.list_id !== listId) break;
    res.push(i);
  }
  return res;
};

const isCompatibleForList = (
  hostType: BlockElementType,
  otherType: BlockElementType,
  listType: LilistType,
): boolean => {
  if (listType === LilistType.OL) {
    return (
      (hostType === BlockElementType.HEADING && otherType === BlockElementType.HEADING) ||
      (hostType === BlockElementType.PARAGRAPH && otherType === BlockElementType.PARAGRAPH)
    );
  }
  return hostType === BlockElementType.PARAGRAPH && otherType === BlockElementType.PARAGRAPH;
};

const attachLilist = (editor: Editor, path: Path, listType: LilistType) => {
  const topIndex = path[0];
  const children = (editor as any).children as any[];
  const node = Node.get(editor, path) as any;

  // 1. 确保宿主类型合法；无序列表只能挂在段落上
  let hostType = (node?.type as BlockElementType) ?? BlockElementType.PARAGRAPH;
  if (!isLilistHost(listType, hostType)) {
    hostType = BlockElementType.PARAGRAPH;
    Transforms.setNodes(
      editor,
      {
        type: hostType,
        attrs: cleanAttrsForType(node?.attrs, hostType),
      } as any,
      { at: path },
    );
  }

  const prev = children[topIndex - 1] as any;
  const next = children[topIndex + 1] as any;
  const prevLilist = getLilist(prev);
  const nextLilist = getLilist(next);

  const affectedIds = new Set<string>();
  let listId: string | undefined;
  let listCustom = true;
  let fromIndex = topIndex;

  // 2. 检查上方是否可以承接
  if (prevLilist?.list_type === listType && isCompatibleForList(hostType, prev?.type, listType)) {
    listId = prevLilist.list_id;
    listCustom = false;
    affectedIds.add(listId);
    fromIndex = topIndex - 1;
  }

  // 3. 检查下方；若上下都有同类型列表，把下方组合并进当前/上方组
  if (nextLilist?.list_type === listType && isCompatibleForList(hostType, next?.type, listType)) {
    if (!listId) {
      listId = nextLilist.list_id;
      listCustom = false;
      affectedIds.add(listId);
    } else if (listId !== nextLilist.list_id) {
      const nextGroup = collectSameListId(editor, topIndex + 1, nextLilist.list_id);
      Editor.withoutNormalizing(editor, () => {
        nextGroup.forEach((idx) => {
          const n = children[idx];
          const nLilist = getLilist(n)!;
          Transforms.setNodes(
            editor,
            {
              attrs: {
                ...(n?.attrs || {}),
                lilist: { ...nLilist, list_id: listId, list_custom: false } as LilistAttr,
              },
            } as any,
            { at: [idx] },
          );
        });
      });
      affectedIds.add(nextLilist.list_id);
    }
  }

  if (!listId) {
    listId = uuidv4();
    affectedIds.add(listId);
  }

  setBlockLilist(editor, path, {
    list_type: listType,
    list_id: listId,
    list_number: 1,
    list_custom: listCustom,
  });

  sortLilist(editor, [...affectedIds], fromIndex);
};

const convertToCodeBlock = (editor: Editor, path: Path) => {
  const node = Node.get(editor, path) as any;
  const rawText = Node.string(node);
  const textLines = rawText.split(/\r?\n/);
  const codeLines = textLines.map((text: string) => ({
    type: BlockElementType.CODE_LINE,
    id: uuidv4(),
    children: [{ text }, { text: ZERO_WIDTH_SPACE }],
  }));
  if (codeLines.length === 0) {
    codeLines.push({
      type: BlockElementType.CODE_LINE,
      id: uuidv4(),
      children: [{ text: '' }, { text: ZERO_WIDTH_SPACE }],
    });
  }
  const newNode = {
    type: BlockElementType.CODE_BLOCK,
    id: node.id,
    attrs: cleanAttrsForType(node?.attrs, BlockElementType.CODE_BLOCK),
    children: codeLines,
  };
  Editor.withoutNormalizing(editor, () => {
    Transforms.insertNodes(editor, newNode as any, { at: path, select: false });
    Transforms.removeNodes(editor, { at: Path.next(path) });
  });
};

const convertCodeBlockToParagraph = (editor: Editor, path: Path) => {
  const node = Node.get(editor, path) as any;
  const rawLines = (node.children || []).map((line: any) => {
    if (line && Array.isArray(line.children)) {
      return line.children.map((c: any) => (c?.text ?? '').replace(/\u200B/g, '')).join('');
    }
    return '';
  });
  const rawText = rawLines.join('\n');
  const newNode = {
    type: BlockElementType.PARAGRAPH,
    id: node.id,
    attrs: cleanAttrsForType(node?.attrs, BlockElementType.PARAGRAPH),
    children: [{ text: rawText }],
  };
  Editor.withoutNormalizing(editor, () => {
    Transforms.insertNodes(editor, newNode as any, { at: path, select: false });
    Transforms.removeNodes(editor, { at: Path.next(path) });
  });
};

const ensureTextHost = (editor: Editor, path: Path) => {
  const node = Node.get(editor, path) as any;
  if (node?.type === BlockElementType.CODE_BLOCK) {
    convertCodeBlockToParagraph(editor, path);
  }
};

export const convertDocBarBlock = (
  editor: Editor,
  target: DocBarConvertTarget,
  path: Path,
): void => {
  if (!path || !path.length) return;
  try {
    const node = Node.get(editor, path) as any;
    if (!node) return;
    if (node.type === BlockElementType.HEADING_TITLE) return;

    const curLilist = getLilist(node);
    const currentAttrs = () => (Node.get(editor, path) as any)?.attrs;

    switch (target) {
      case 'numbered-list': {
        if (curLilist?.list_type === LilistType.OL) {
          removeLilist(editor, path);
          return;
        }
        if (curLilist) removeLilist(editor, path);
        attachLilist(editor, path, LilistType.OL);
        return;
      }
      case 'bulleted-list': {
        if (curLilist?.list_type === LilistType.UL) {
          removeLilist(editor, path);
          return;
        }
        if (curLilist) removeLilist(editor, path);
        attachLilist(editor, path, LilistType.UL);
        return;
      }
      case 'checkbox': {
        if (curLilist) removeLilist(editor, path);
        if (node.type === BlockElementType.TODO_LIST) {
          Transforms.setNodes(
            editor,
            {
              type: BlockElementType.PARAGRAPH,
              attrs: cleanAttrsForType(currentAttrs(), BlockElementType.PARAGRAPH),
            } as any,
            { at: path },
          );
        } else {
          ensureTextHost(editor, path);
          Transforms.setNodes(
            editor,
            {
              type: BlockElementType.TODO_LIST,
              attrs: {
                ...cleanAttrsForType(currentAttrs(), BlockElementType.TODO_LIST),
                checked: false,
              },
            } as any,
            { at: path },
          );
        }
        return;
      }
      case 'quote': {
        if (curLilist) removeLilist(editor, path);
        if (node.type === BlockElementType.BLOCKQUOTE) {
          Transforms.setNodes(
            editor,
            {
              type: BlockElementType.PARAGRAPH,
              attrs: cleanAttrsForType(currentAttrs(), BlockElementType.PARAGRAPH),
            } as any,
            { at: path },
          );
        } else {
          ensureTextHost(editor, path);
          Transforms.setNodes(
            editor,
            {
              type: BlockElementType.BLOCKQUOTE,
              attrs: {
                ...cleanAttrsForType(currentAttrs(), BlockElementType.BLOCKQUOTE),
                type: 'info',
                label: '说明',
              },
            } as any,
            { at: path },
          );
        }
        return;
      }
      case 'code-block': {
        if (curLilist) removeLilist(editor, path);
        if (node.type === BlockElementType.CODE_BLOCK) {
          convertCodeBlockToParagraph(editor, path);
        } else {
          convertToCodeBlock(editor, path);
        }
        return;
      }
      case 'text': {
        if (node.type === BlockElementType.PARAGRAPH && !curLilist) return;
        if (curLilist) removeLilist(editor, path);
        ensureTextHost(editor, path);
        Transforms.setNodes(
          editor,
          {
            type: BlockElementType.PARAGRAPH,
            attrs: cleanAttrsForType(currentAttrs(), BlockElementType.PARAGRAPH),
          } as any,
          { at: path },
        );
        return;
      }
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'h7':
      case 'h8':
      case 'h9': {
        const level = Number(target.slice(1)); // 'h1' -> 1, 'h9' -> 9
        if (node.type === BlockElementType.HEADING && node.attrs?.level === level) {
          if (curLilist?.list_type === LilistType.UL) removeLilist(editor, path);
          Transforms.setNodes(
            editor,
            {
              type: BlockElementType.PARAGRAPH,
              attrs: cleanAttrsForType(currentAttrs(), BlockElementType.PARAGRAPH),
            } as any,
            { at: path },
          );
          return;
        }
        if (curLilist?.list_type === LilistType.UL) removeLilist(editor, path);
        ensureTextHost(editor, path);
        Transforms.setNodes(
          editor,
          {
            type: BlockElementType.HEADING,
            attrs: { ...cleanAttrsForType(currentAttrs(), BlockElementType.HEADING), level },
          } as any,
          { at: path },
        );
        return;
      }
    }
  } catch {
    /* ignore */
  }
};
