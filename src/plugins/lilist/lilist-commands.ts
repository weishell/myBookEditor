// lilist 命令层 —— 绑定 / 解绑列表、Markdown 快捷键转换、编号设置、子树缩进
// 所有改变列表结构的命令末尾都调 sortLilist 回写编号（对齐 template olulListSort 的调用时机）
import { Editor, Element, Node, Transforms, Path, Range } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType } from '@/enums';
import { MAX_INDENT } from '@/utils/indent';
import {
  getLilist,
  isLilistHost,
  LilistType,
  MAX_LIST_NUMBER,
  sortLilist,
  type LilistAttr,
} from './lilist-model';

const setLilist = (editor: Editor, path: Path, lilist: LilistAttr) => {
  const node = Node.get(editor, path) as any;
  Transforms.setNodes(editor, { attrs: { ...(node?.attrs || {}), lilist } } as any, { at: path });
};

/** 解绑列表，恢复为普通宿主块，并从原位起重排原组编号（调用方无需再单独排序） */
export const removeLilist = (editor: Editor, path: Path) => {
  try {
    const node = Node.get(editor, path) as any;
    const oldId = getLilist(node)?.list_id;
    const attrs = { ...(node?.attrs || {}) };
    delete attrs.lilist;
    Transforms.setNodes(editor, { attrs } as any, { at: path });
    sortLilist(editor, [oldId], path[path.length - 1]);
  } catch {
    /* ignore */
  }
};

/**
 * 自动重连：取前方可承接的 list_id
 * 条件：前方块是同类型列表 + 同宿主类型（标题有序与段落有序互不连通）；
 * H 标题特例：不同 level 的标题可互相承接（层级编号 1 → 1.1 需跨层级同组）
 * crossGap：跨缝隙向后查找（仅“继续之前的编号”使用，对齐飞书支持隔段继续）：
 *  - 非列表块跳过继续找；遇到不同类型的列表（UL/OL）停止；宿主不兼容跳过继续找
 */
const getPrevConnectListId = (
  editor: Editor,
  path: Path,
  type: LilistType,
  crossGap = false,
): string | undefined => {
  const topIndex = path[path.length - 1];
  if (topIndex === 0) return undefined;
  try {
    const children = (editor as any).children as any[];
    const cur = children[topIndex];
    for (let i = topIndex - 1; i >= 0; i--) {
      const prev = children[i];
      const prevLilist = getLilist(prev);
      if (!prevLilist) {
        if (!crossGap) return undefined;
        continue; // 非列表块：跨缝隙模式继续向前找
      }
      if (prevLilist.list_type !== type) return undefined; // 先碰到不同类型列表：不可承接
      const bothHeading =
        prev?.type === BlockElementType.HEADING && cur?.type === BlockElementType.HEADING;
      if (prev?.type && (bothHeading || prev.type === cur?.type)) {
        return prevLilist.list_id;
      }
      if (!crossGap) return undefined;
      // 同类型但宿主不兼容（标题 vs 段落）：跨缝隙模式跳过继续找
    }
  } catch {
    /* ignore */
  }
  return undefined;
};

/**
 * H 标题设置 OL 时专用的"按 level + 设置状态"查找（仅看 H 标题，跳过段落等非 H 块）
 *
 * 规则：
 *  - 向上找最近的 HEADING 块
 *  - 该 H 的 level ≤ 当前 level（H1/H2 对 H2 → 同级或更高级）：
 *      设了同类型 OL → 返回其 list_id（合并）
 *      没设或不同类型 → 返回 undefined（终止，自己作为新序列锚点）
 *  - 该 H 的 level > 当前 level（H3 对 H2 → 更低级）：
 *      设了同类型 OL → 返回其 list_id（合并）
 *      没设或不同类型 → 继续向上找下一个 H
 *  - 直到文档头或遇到满足终止条件
 */
const getPrevHeadingConnectListId = (
  editor: Editor,
  path: Path,
  type: LilistType,
  curLevel: number,
): string | undefined => {
  const topIndex = path[path.length - 1];
  if (topIndex === 0) return undefined;
  try {
    const children = (editor as any).children as any[];
    for (let i = topIndex - 1; i >= 0; i--) {
      const prev = children[i];
      // 只看 H 标题；遇到非 H 块（段落、图片等）跳过
      if (prev?.type !== BlockElementType.HEADING) continue;
      const prevLevel = prev?.attrs?.level ?? 1;
      const prevLilist = getLilist(prev);
      const sameType = prevLilist?.list_type === type;
      if (prevLevel <= curLevel) {
        // 同级或更高级（H1/H2 对 H2）：看是否设了同类型 OL
        return sameType && prevLilist ? prevLilist.list_id : undefined;
      }
      // 更低级（H3 对 H2）：设了合；没设继续向上找
      if (sameType && prevLilist) return prevLilist.list_id;
    }
  } catch {
    /* ignore */
  }
  return undefined;
};

/**
 * H 标题设了 OL 后向下扫描，把符合规则的 H 标题合并进 sharedId
 * （仅 HEADING 块；遇到非 H 块停止；段落 OL/UL 不受影响）
 *
 * 规则与 getPrevHeadingConnectListId 完全对称（以当前 H 为锚点向下看）：
 *  - next level ≤ cur level（同/更高）：设了合，没设 break
 *  - next level >  cur level（更低）：设了合，没设 continue
 *
 * 已设同类型 OL 的 next H 会替换 list_id 为 sharedId（统一编号流）
 */
const extendHeadingListDown = (
  editor: Editor,
  startPath: Path,
  sharedId: string,
  type: LilistType,
  curLevel: number,
  affectedIds: Set<string>,
): void => {
  const topIndex = startPath[startPath.length - 1];
  if (topIndex < 0) return;
  const children = (editor as any).children as any[];
  for (let i = topIndex + 1; i < children.length; i++) {
    const cur = children[i];
    if (cur?.type !== BlockElementType.HEADING) break; // 非 H 块停止
    const curLvl = cur?.attrs?.level ?? 1;
    const curLilist = getLilist(cur);
    const sameType = curLilist?.list_type === type;
    if (curLvl <= curLevel) {
      if (sameType && curLilist) {
        affectedIds.add(curLilist.list_id);
        setLilist(editor, [i], {
          ...curLilist,
          list_id: sharedId,
          // 承接进来的项不是锚点（list_custom: false）；但若用户原本设了 list_custom，
          // 保留其自定义编号语义——下文 sortLilist 会基于此顺延
        });
      } else {
        break;
      }
    } else {
      if (sameType && curLilist) {
        affectedIds.add(curLilist.list_id);
        setLilist(editor, [i], {
          ...curLilist,
          list_id: sharedId,
        });
      }
      // 没设 → 继续向下
    }
  }
};

/** 是否判断是否应该走"H 标题按 level 合并"的入口判断 */
const shouldUseHeadingLevelRule = (type: LilistType, node: any): boolean =>
  type === LilistType.OL && node?.type === BlockElementType.HEADING;

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

  // 已全部是同类型列表 → 取消（removeLilist 内部会重排各自原组）
  // 倒序移除：后移除不影响前者的顶层索引，避免 path 失效
  const allActive = targets.every(([n]) => getLilist(n)?.list_type === type);
  if (allActive) {
    Editor.withoutNormalizing(editor, () => {
      [...targets].reverse().forEach(([, p]) => removeLilist(editor, p));
    });
    return;
  }

  // 区分入口：H 标题 OL 走"按 level + 设置状态"的新规则；
  // 段落 OL/UL 与 H 标题 UL 维持旧规则（向后逐块同类型即可承接）
  const firstNode = targets[0][0];
  const useHeadingRule = shouldUseHeadingLevelRule(type, firstNode);
  const firstLevel = useHeadingRule ? (firstNode?.attrs?.level ?? 1) : undefined;

  const resolvePrevId = (p: Path): string | undefined =>
    useHeadingRule
      ? getPrevHeadingConnectListId(editor, p, type, firstLevel!)
      : getPrevConnectListId(editor, p, type);

  let sharedId = resolvePrevId(targets[0][1]) ?? uuidv4();
  // 首块是否承接了前方列表：承接则不是锚点，否则作为新列表首项锚点
  let groupHeadCustom =
    targets[0][1][targets[0][1].length - 1] > 0 && resolvePrevId(targets[0][1]) !== undefined;
  groupHeadCustom = !groupHeadCustom;
  let prevTopIdx = -1;
  // 记录所有涉及的 list_id（含被承接的前方组），末尾统一回写编号
  const affectedIds = new Set<string>([sharedId]);

  Editor.withoutNormalizing(editor, () => {
    targets.forEach(([, path], idx) => {
      // 不相邻的选区块各自独立成组，新组首项为锚点
      let custom = false;
      if (idx === 0) {
        custom = groupHeadCustom;
      } else if (path[0] !== prevTopIdx + 1) {
        sharedId = uuidv4();
        affectedIds.add(sharedId);
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

    // H 标题 OL 设完后向下扫描，把符合 level 规则的 H 标题合并进 sharedId
    if (useHeadingRule) {
      targets.forEach(([node, path]) => {
        const lvl = node?.attrs?.level ?? 1;
        extendHeadingListDown(editor, path, sharedId, type, lvl, affectedIds);
      });
    }
  });
  sortLilist(editor, [...affectedIds]);
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

    // H 标题 OL 走"按 level + 设置状态"的新规则；其余维持旧规则
    const useHeadingRule = shouldUseHeadingLevelRule(type, node);
    const connectId =
      startNumber === 1
        ? useHeadingRule
          ? getPrevHeadingConnectListId(editor, path, type, node?.attrs?.level ?? 1)
          : getPrevConnectListId(editor, path, type)
        : undefined;

    setLilist(editor, path, {
      list_type: type,
      list_id: connectId ?? uuidv4(),
      list_number: startNumber,
      list_custom: connectId === undefined,
    });
    // 承接前方列表时需从当前位置起重排前方组；新建组只有一项无需排序
    if (connectId) sortLilist(editor, [connectId], path[path.length - 1]);

    // H 标题 OL：设完后向下扫描合并同级或更高级的 H，统一编号流
    if (useHeadingRule) {
      const sharedId = (Node.get(editor, path) as any)?.attrs?.lilist?.list_id as string;
      const affectedIds = new Set<string>([sharedId]);
      extendHeadingListDown(editor, path, sharedId, type, node?.attrs?.level ?? 1, affectedIds);
      sortLilist(editor, [...affectedIds], path[path.length - 1]);
    }
  } catch {
    /* ignore */
  }
};

/* ------------------------------------------------------------------ */
/* 编号设置弹框命令（对应飞书的 继续之前的编号 / 开始新列表 / 修改编号值）  */
/* ------------------------------------------------------------------ */

/** 是否存在可承接的前方列表（弹框中“继续之前的编号”是否可用）；前方即本组（列表中间点击）不算 */
export const canContinueLilist = (editor: Editor, path: Path): boolean => {
  const lilist = getLilist(Node.get(editor, path));
  if (!lilist) return false;
  const prevId = getPrevConnectListId(editor, path, lilist.list_type, true);
  return prevId !== undefined && prevId !== lilist.list_id;
};

/**
 * 继续之前的编号：当前项 + 后方连续同组成员整体并入前方列表（不是只改自己），
 * 编号从前组末尾顺延；成组判定与 sortLilist 一致（H 标题跨 level 同组）。
 */
export const continueLilist = (editor: Editor, path: Path): boolean => {
  try {
    const node = Node.get(editor, path) as any;
    const lilist = getLilist(node);
    if (!lilist) return false;
    const prevId = getPrevConnectListId(editor, path, lilist.list_type, true);
    // 无可承接的前方列表，或前方即本组（列表中间点击）→ 无事可做
    if (!prevId || prevId === lilist.list_id) return false;
    const topIndex = path[path.length - 1];
    const children = (editor as any).children as any[];
    // 收集需一并并入的成员：当前项 + 后方连续同组（同 list_id/类型）
    const targetIndexes: number[] = [topIndex];
    for (let i = topIndex + 1; i < children.length; i++) {
      const cur = children[i];
      const curLilist = getLilist(cur);
      const bothHeading =
        node?.type === BlockElementType.HEADING && cur?.type === BlockElementType.HEADING;
      if (
        curLilist?.list_id !== lilist.list_id ||
        curLilist?.list_type !== lilist.list_type ||
        (!bothHeading && cur?.type !== node?.type)
      ) {
        break;
      }
      targetIndexes.push(i);
    }
    Editor.withoutNormalizing(editor, () => {
      targetIndexes.forEach((i, pos) => {
        const curLilist = getLilist(children[i])!;
        // 换 list_id：首项清除锚点（通常是“开始新列表”的产物，继续的语义就是顺延），
        // 其余项保留各自锚点标记，锚点在新组内仍按自身值生效，非锚点顺延重算
        setLilist(editor, [i], {
          ...curLilist,
          list_id: prevId,
          list_custom: pos === 0 ? false : curLilist.list_custom,
        });
      });
    });
    // 并入后与前方组同属一个 list_id（可能隔着其它块），从并入点起顺延重算
    sortLilist(editor, [prevId], topIndex);
    return true;
  } catch {
    return false;
  }
};

/**
 * 开始新列表（重新编号）：当前项 + 后方连续同组成员整体剥离成新组，
 * 与原列表彻底分离；首项为锚点且编号从 1 重开，原组前面的项不受影响。
 * 成组判定与 sortLilist 一致（H 标题不同 level 仍属同组）。
 */
export const restartLilist = (editor: Editor, path: Path) => {
  try {
    const node = Node.get(editor, path) as any;
    const lilist = getLilist(node);
    if (!lilist) return;
    const oldId = lilist.list_id;
    const newId = uuidv4();
    const topIndex = path[path.length - 1];
    const children = (editor as any).children as any[];
    // 收集需一并剥离的成员：当前项 + 后方连续同组（同 list_id/类型，标题跨 level）
    const targetIndexes: number[] = [topIndex];
    for (let i = topIndex + 1; i < children.length; i++) {
      const cur = children[i];
      const curLilist = getLilist(cur);
      const bothHeading =
        node?.type === BlockElementType.HEADING && cur?.type === BlockElementType.HEADING;
      if (
        curLilist?.list_id !== oldId ||
        curLilist?.list_type !== lilist.list_type ||
        (!bothHeading && cur?.type !== node?.type)
      ) {
        break;
      }
      targetIndexes.push(i);
    }
    Editor.withoutNormalizing(editor, () => {
      targetIndexes.forEach((i, pos) => {
        const curLilist = getLilist(children[i])!;
        setLilist(editor, [i], {
          list_type: curLilist.list_type,
          list_id: newId,
          // 首项锚点从 1 重开；后续项保留原值与锚点标记，由 sortLilist 统一重算
          list_number: pos === 0 ? 1 : curLilist.list_number,
          list_custom: pos === 0 ? true : curLilist.list_custom,
        });
      });
    });
    // 新组从剥离点起重算（含标题 list_path 回写）；原组前面部分不变，无需排序
    sortLilist(editor, [newId], topIndex);
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
    sortLilist(editor, [lilist.list_id], path[path.length - 1]);
  } catch {
    /* ignore */
  }
};

/**
 * 列表子树缩进（对齐 template 的 updateIndentForTS，步进改为本项目的 1）
 * 光标在列表项时，当前项 + 后方连续同组且缩进更深的子项整体平移：
 *  - dir = 1：Tab，任一目标超 MAX_INDENT 或当前项超出“前一块缩进 + 1”约束 → 整体不动
 *  - dir = -1：Shift+Tab，当前项已无缩进 → 静默不动（对齐 template 的 SilentRollback）
 * 成功后同步 sortLilist 回写编号（缩进层级决定分组计数）
 * @returns applied 已应用 / blocked 被边界规则阻止 / noop 无需处理（非折叠选区、非顶层块等）
 */
export const indentLilistSubtree = (
  editor: Editor,
  dir: 1 | -1,
): 'applied' | 'blocked' | 'noop' => {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) return 'noop';

  try {
    const match = Editor.above(editor, {
      match: (n: any) => Editor.isBlock(editor, n),
      mode: 'lowest',
    });
    if (!match) return 'noop';
    const [node, path] = match as [any, Path];
    const lilist = getLilist(node);
    if (!lilist || path.length !== 1) return 'noop';

    const indent: number = node?.attrs?.indent ?? 0;
    const index = path[0];
    const children = (editor as any).children as any[];

    // 收集子树：后方连续同组块，直到缩进不深于当前项（或组断开）
    const targets: { path: Path; node: any }[] = [{ path, node }];
    for (let i = index + 1; i < children.length; i++) {
      const cur = children[i];
      if (getLilist(cur)?.list_id !== lilist.list_id) break;
      if ((cur?.attrs?.indent ?? 0) <= indent) break;
      targets.push({ path: [i], node: cur });
    }

    if (dir === 1) {
      if (targets.some((t) => (t.node?.attrs?.indent ?? 0) + 1 > MAX_INDENT)) return 'blocked';
      // 对齐 increaseIndent 约束：首块不可缩进，且不能超过前一块缩进 + 1
      if (index === 0) return 'blocked';
      const prevIndent: number = children[index - 1]?.attrs?.indent ?? 0;
      if (indent + 1 > prevIndent + 1) return 'blocked';
    } else if (indent === 0) {
      return 'noop';
    }

    Editor.withoutNormalizing(editor, () => {
      targets.forEach(({ path: p, node: n }) => {
        const curIndent: number = n?.attrs?.indent ?? 0;
        Transforms.setNodes(
          editor,
          { attrs: { ...(n?.attrs || {}), indent: curIndent + dir } } as any,
          { at: p },
        );
      });
    });
    sortLilist(editor, [lilist.list_id], index);
    return 'applied';
  } catch {
    return 'noop';
  }
};
