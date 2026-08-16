// lilist 命令层 —— 绑定 / 解绑列表、Markdown 快捷键转换、编号设置
import { Editor, Element, Node, Transforms, Path } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import {
  computeListNumber,
  getLilist,
  isLilistHost,
  LilistType,
  MAX_LIST_NUMBER,
  type LilistAttr,
} from './lilist-model';

const setLilist = (editor: Editor, path: Path, lilist: LilistAttr) => {
  const node = Node.get(editor, path) as any;
  Transforms.setNodes(editor, { attrs: { ...(node?.attrs || {}), lilist } } as any, { at: path });
};

/** 解绑列表，恢复为普通宿主块 */
export const removeLilist = (editor: Editor, path: Path) => {
  try {
    const node = Node.get(editor, path) as any;
    const attrs = { ...(node?.attrs || {}) };
    delete attrs.lilist;
    Transforms.setNodes(editor, { attrs } as any, { at: path });
  } catch {
    /* ignore */
  }
};

/**
 * 自动重连：取上一相邻块可承接的 list_id
 * 条件：上一块是同类型列表 + 同宿主类型（标题有序与段落有序互不连通）
 */
const getPrevConnectListId = (editor: Editor, path: Path, type: LilistType): string | undefined => {
  if (path[path.length - 1] === 0) return undefined;
  try {
    const prev = Node.get(editor, Path.previous(path)) as any;
    const cur = Node.get(editor, path) as any;
    const prevLilist = getLilist(prev);
    if (prevLilist?.list_type === type && prev?.type && prev.type === cur?.type) {
      return prevLilist.list_id;
    }
  } catch {
    /* ignore */
  }
  return undefined;
};

/** 切换列表 / 取消列表（FloatBar、块选择器入口） */
export const toggleLilist = (editor: Editor, type: LilistType) => {
  const { selection } = editor;
  if (!selection) return;

  const targets = Array.from(
    (editor as any).nodes({
      at: (editor as any).unhangRange(selection),
      match: (n: any) =>
        !(n as any).isEditor &&
        Element.isElement(n) &&
        (editor as any).isBlock(n) &&
        isLilistHost(type, n.type),
      mode: 'highest',
    }),
  ) as [any, Path][];

  if (!targets.length) return;

  // 已全部是同类型列表 → 取消
  const allActive = targets.every(([n]) => getLilist(n)?.list_type === type);
  if (allActive) {
    Editor.withoutNormalizing(editor, () => {
      targets.forEach(([, p]) => removeLilist(editor, p));
    });
    return;
  }

  let sharedId = getPrevConnectListId(editor, targets[0][1], type) ?? uuidv4();
  // 首块是否承接了前方列表：承接则不是锚点，否则作为新列表首项锚点
  let groupHeadCustom =
    targets[0][1][targets[0][1].length - 1] > 0 &&
    getPrevConnectListId(editor, targets[0][1], type) !== undefined;
  groupHeadCustom = !groupHeadCustom;
  let prevTopIdx = -1;

  Editor.withoutNormalizing(editor, () => {
    targets.forEach(([, path], idx) => {
      // 不相邻的选区块各自独立成组，新组首项为锚点
      let custom = false;
      if (idx === 0) {
        custom = groupHeadCustom;
      } else if (path[0] !== prevTopIdx + 1) {
        sharedId = uuidv4();
        custom = true;
      }
      prevTopIdx = path[0];
      setLilist(editor, path, {
        list_type: type,
        list_id: sharedId,
        list_number: 1,
        list_custom: custom,
      });
    });
  });
};

/**
 * 将单个块转换为列表（Markdown 快捷键入口）
 * 规则对齐 template.md：
 *  - 起始数字为 1 且前方相邻是同类型列表 → 承接（list_custom: false）
 *  - 否则新建列表，首项作为锚点（list_custom: true）
 * @param startNumber 用户输入的起始数字（调用方已按 MAX_LIST_NUMBER 处理）
 */
export const convertBlockToLilist = (
  editor: Editor,
  path: Path,
  type: LilistType,
  startNumber = 1,
) => {
  try {
    const node = Node.get(editor, path) as any;
    if (!isLilistHost(type, node?.type)) return;

    const connectId = startNumber === 1 ? getPrevConnectListId(editor, path, type) : undefined;

    setLilist(editor, path, {
      list_type: type,
      list_id: connectId ?? uuidv4(),
      list_number: startNumber,
      list_custom: connectId === undefined,
    });
  } catch {
    /* ignore */
  }
};

/* ------------------------------------------------------------------ */
/* 编号设置弹框命令（对应飞书的 继续之前的编号 / 开始新列表 / 修改编号值）  */
/* ------------------------------------------------------------------ */

/** 是否存在可承接的前方列表（弹框中"继续之前的编号"是否可用） */
export const canContinueLilist = (editor: Editor, path: Path): boolean => {
  const lilist = getLilist(Node.get(editor, path));
  if (!lilist) return false;
  return getPrevConnectListId(editor, path, lilist.list_type) !== undefined;
};

/** 继续之前的编号：承接前方同类型列表（list_custom 置 false，编号由组内重算） */
export const continueLilist = (editor: Editor, path: Path): boolean => {
  try {
    const lilist = getLilist(Node.get(editor, path));
    if (!lilist) return false;
    const prevId = getPrevConnectListId(editor, path, lilist.list_type);
    if (!prevId) return false;
    setLilist(editor, path, {
      list_type: lilist.list_type,
      list_id: prevId,
      list_number: 1,
      list_custom: false,
    });
    return true;
  } catch {
    return false;
  }
};

/** 开始新列表：独立成新组，首项为锚点，编号保持当前显示值 */
export const restartLilist = (editor: Editor, path: Path) => {
  try {
    const lilist = getLilist(Node.get(editor, path));
    if (!lilist) return;
    const displayNumber = lilist.list_type === LilistType.OL ? computeListNumber(editor, path) : 1;
    setLilist(editor, path, {
      list_type: lilist.list_type,
      list_id: uuidv4(),
      list_number: displayNumber || 1,
      list_custom: true,
    });
  } catch {
    /* ignore */
  }
};

/** 修改编号值：写入自定义锚点（对齐 template 的 btnOlChangeNumber，超限截断到 MAX_LIST_NUMBER） */
export const changeLilistNumber = (editor: Editor, path: Path, value: number) => {
  try {
    const lilist = getLilist(Node.get(editor, path));
    if (!lilist) return;
    const safeValue = Math.min(Math.max(Math.floor(value) || 1, 1), MAX_LIST_NUMBER);
    setLilist(editor, path, {
      list_type: lilist.list_type,
      list_id: lilist.list_id,
      list_number: safeValue,
      list_custom: true,
    });
  } catch {
    /* ignore */
  }
};
