// lilist 数据模型 —— 列表绑定在宿主块（段落 / 标题）的 attrs.lilist 上
// 字段语义对齐 template.md 的 olul_obj：
//  - list_type:   ol 有序 / ul 无序（枚举见 enums/block.ts）
//  - list_id:     列表分组 id，相同 id 的连续块属于同一个列表
//  - list_number: 编号数值，由 sortLilist 回写，渲染直接读取（不现算）
//  - list_custom: 是否为用户自定义锚点；锚点以 list_number 为起点，
//                 只影响其后的编号，锚点之前的项仍从组头顺序计数
import { Editor, Transforms } from 'slate';
import { BlockElementType, LilistType } from '@/enums';

export { LilistType };

/** 有序列表起始数字上限（对齐 template.md 的 MAX_OL_NUMBER，超出则从 1 开始） */
export const MAX_LIST_NUMBER = 1000;

export interface LilistAttr {
  list_type: LilistType;
  list_id: string;
  list_number: number;
  list_custom: boolean;
  /** H 标题层级编号的完整路径（如 "1.1"），由 sortLilist 回写，仅标题有序列表使用 */
  list_path?: string;
}

/** 各列表类型允许的宿主块类型（标题的有序与段落的有序互相独立；无序暂不绑定标题） */
export const LILIST_HOST_TYPES: Record<LilistType, BlockElementType[]> = {
  [LilistType.OL]: [BlockElementType.PARAGRAPH, BlockElementType.HEADING],
  [LilistType.UL]: [BlockElementType.PARAGRAPH],
};

export const isLilistHost = (type: LilistType, blockType?: BlockElementType): boolean =>
  !!blockType && LILIST_HOST_TYPES[type].includes(blockType);

export const getLilist = (node: any): LilistAttr | undefined => node?.attrs?.lilist;

/**
 * 取当前选区所在块的 lilist 属性（键盘劫持检测用）
 * 非列表块 / 无选区返回 undefined
 */
export const getLilistAtSelection = (editor: Editor): LilistAttr | undefined => {
  const { selection } = editor;
  if (!selection) return undefined;
  try {
    const match = (editor as any).above({
      match: (n: any) => (editor as any).isBlock(n),
      mode: 'lowest',
    });
    return match ? getLilist(match[0]) : undefined;
  } catch {
    return undefined;
  }
};

/* ------------------------------------------------------------------ */
/* 前缀格式转换器（对齐 template.md 的 convertNumber / OL_STRATEGY）      */
/* 编号格式随缩进层级循环交替：数字 → 英文字母 → 罗马数字                */
/* template 的缩进步进为 2（indent % 6 只定义偶数位），本项目 Tab 步进为 1， */
/* 故等价映射为 indent % 3                                                */
/* ------------------------------------------------------------------ */

type PrefixHandler = string | ((value: number) => string);

/** 转为小写罗马数字（含尾部点），对齐 template 的 intToRoman */
const intToRoman = (num: number): string => {
  const romanValues: [number, string][] = [
    [1000, 'm'],
    [900, 'cm'],
    [500, 'd'],
    [400, 'cd'],
    [100, 'c'],
    [90, 'xc'],
    [50, 'l'],
    [40, 'xl'],
    [10, 'x'],
    [9, 'ix'],
    [5, 'v'],
    [4, 'iv'],
    [1, 'i'],
  ];
  if (isNaN(num) || num < 0 || num > 3999) return `${num}.`;
  let result = '';
  let rest = num;
  for (let i = 0; i < romanValues.length; i++) {
    while (rest >= romanValues[i][0]) {
      result += romanValues[i][1];
      rest -= romanValues[i][0];
    }
  }
  return result + '.';
};

/** 转为小写英文字母（含尾部点），对齐 template 的 initToEnglish：1→a. 26→z. 27→aa. */
const intToEnglish = (num: number): string => {
  let result = '';
  let rest = num;
  while (rest > 0) {
    rest--; // 调整为从 1 开始计数
    const remainder = rest % 26;
    result = String.fromCharCode(97 + remainder) + result;
    rest = Math.floor(rest / 26);
  }
  return result.length === 0 ? 'a.' : result + '.';
};

/** 有序列表前缀策略：层级 0 数字 / 1 英文 / 2 罗马，循环交替 */
const OL_STRATEGY: PrefixHandler[] = [(v) => `${v}.`, intToEnglish, intToRoman];

/** 无序列表前缀策略：符号按层级循环交替 */
const UL_STRATEGY: PrefixHandler[] = ['•', '◦', '▪'];

/**
 * 转换列表前缀：根据缩进层级选择格式策略，将编号数值转为最终显示文本
 * @param indent 缩进层级
 * @param value  编号数值（存储的数字，如 list_number / 渲染期计算结果）
 * @param type   列表类型 ol / ul
 */
export const convertNumber = (indent: number, value: number, type: LilistType): string => {
  const strategy = type === LilistType.OL ? OL_STRATEGY : UL_STRATEGY;
  const handler = strategy[((indent % strategy.length) + strategy.length) % strategy.length];
  if (typeof handler === 'function') return handler(value);
  return handler || '';
};

/** 无序列表符号（convertNumber 的 ul 快捷调用） */
export const getUlBullet = (indent: number): string => convertNumber(indent, 1, LilistType.UL);

/**
 * 编号回写排序（对齐 template.md 的 olulListSort，但全程同步、无 sleep）
 * 每次结构变更（回车/增删/转换/改编号/缩进）后调用：
 * 按文档顺序遍历同组（同 list_id）块，逐缩进层级顺序编号并写回 list_number。
 * 规则：
 *  - 每个缩进层级维护独立计数器，遇到更浅层级时清空更深层计数器（子编号随父重启）
 *  - 锚点（list_custom）项直接取自身 list_number 作为该层新起点，只影响其后
 *  - 仅回写数值变化的节点，避免无谓的 operation 与历史记录噪声
 * 增量优化（fromIndex）：编号只受“前方同层计数 + 锚点”影响，变更点之前的项必然不变，
 * 因此只需从变更点起跑；起跑前的计数器状态从前方成员倒序播种（见下方注释）。
 * 浅层免疫：变更发生在深层时，后方的浅层项算出来与存储值一致，差量写回自然零写入。
 * @param fromIndex 变更点顶层索引（含），默认 0 即整组重算；传入后组内位于其前的成员跳过
 */
export const sortLilist = (
  editor: Editor,
  listIds: (string | undefined)[],
  fromIndex = 0,
): void => {
  const ids = [...new Set(listIds.filter(Boolean))] as string[];
  if (!ids.length) return;

  Editor.withoutNormalizing(editor, () => {
    const children = (editor as any).children as any[];
    const visited = new Set<number>();
    children.forEach((block: any, index: number) => {
      if (visited.has(index)) return;
      const lilist = getLilist(block);
      if (!lilist || lilist.list_type !== LilistType.OL) return;
      if (!ids.includes(lilist.list_id)) return;

      // 收集同组连续块：向后延伸直到 list_id / 类型断开
      // H 标题特例：不同 level 的标题仍属同一编号流（层级编号 1.1 / 1.1.1 需跨层级联动）
      const group: { index: number; node: any }[] = [{ index, node: block }];
      for (let i = index + 1; i < children.length; i++) {
        const cur = children[i];
        const curLilist = getLilist(cur);
        const bothHeading =
          block?.type === BlockElementType.HEADING && cur?.type === BlockElementType.HEADING;
        if (
          curLilist?.list_id !== lilist.list_id ||
          curLilist?.list_type !== lilist.list_type ||
          (!bothHeading && cur?.type !== block?.type)
        ) {
          break;
        }
        group.push({ index: i, node: cur });
      }
      group.forEach(({ index: i }) => visited.add(i));

      // 逐层顺序编号并回写：段落按 attrs.indent 分层，H 标题按 attrs.level 分层
      const isHeadingGroup = block?.type === BlockElementType.HEADING;
      const levelOf = (n: any): number =>
        isHeadingGroup ? (n?.attrs?.level ?? 1) : (n?.attrs?.indent ?? 0);
      const minLevel = isHeadingGroup ? 1 : 0;

      // 增量起跑点：默认组头；fromIndex 落在组内时定位第一个 >= fromIndex 的成员
      let firstPos = 0;
      if (fromIndex > group[0].index) {
        firstPos = group.findIndex((g) => g.index >= fromIndex);
        if (firstPos === -1) return; // 整组都在变更点之前，不受影响
      }

      // 计数器播种：从 firstPos 向前倒序扫描，只取“层级单调变浅链”上的项——
      // 其存储值（变更前算好回写的）就是该层当前计数器状态；比当前边界更深的项
      // 其计数器早已被链上那个浅层项清空，不能用作状态。锚点影响已烘进存储值。
      // 段内扫到段头仍未达最浅层级时，继续跨非列表缝隙向前找同 list_id 的块
      // （同一 list_id 可分布在不连续多段，如“继续之前的编号”隔段并入后）
      const counters = new Map<number, number>();
      let seedBoundary = Infinity;
      const seedOne = (n: any): boolean => {
        const l = levelOf(n);
        if (l < seedBoundary) {
          const prevLilist = getLilist(n)!;
          counters.set(l, Math.min(Math.max(prevLilist.list_number || 1, 1), MAX_LIST_NUMBER));
          seedBoundary = l;
          return l <= minLevel; // 到达最浅层级，状态已完备
        }
        return false;
      };
      let seeded = false;
      for (let i = firstPos - 1; i >= 0 && !seeded; i--) {
        seeded = seedOne(group[i].node);
      }
      for (let i = group[0].index - 1; i >= 0 && !seeded; i--) {
        if (getLilist(children[i])?.list_id !== lilist.list_id) continue;
        seeded = seedOne(children[i]);
      }

      group.slice(firstPos).forEach(({ index: idx, node }) => {
        const nodeLilist = getLilist(node)!;
        const indent = isHeadingGroup ? (node?.attrs?.level ?? 1) : (node?.attrs?.indent ?? 0);
        // 回到更浅层级时，更深层的子编号重新开始
        for (const key of [...counters.keys()]) {
          if (key > indent) counters.delete(key);
        }
        const number = nodeLilist.list_custom
          ? Math.min(Math.max(nodeLilist.list_number || 1, 1), MAX_LIST_NUMBER)
          : (counters.get(indent) ?? 0) + 1;
        counters.set(indent, number);
        if (isHeadingGroup) {
          // 层级编号：list_number 存自身所在 level 的序号，list_path 存完整路径（如 1.1），
          // 两者均由此处回写，渲染直接读，祖先变更时子项也能同步重渲染
          const segments: string[] = [];
          for (let l = 1; l <= indent; l++) {
            const c = counters.get(l);
            if (c !== undefined) segments.push(String(c));
          }
          const listPath = segments.join('.');
          if (nodeLilist.list_number !== number || nodeLilist.list_path !== listPath) {
            Transforms.setNodes(
              editor,
              {
                attrs: {
                  ...(node?.attrs || {}),
                  lilist: { ...nodeLilist, list_number: number, list_path: listPath },
                },
              } as any,
              { at: [idx] },
            );
          }
          return;
        }
        if (nodeLilist.list_number !== number) {
          Transforms.setNodes(
            editor,
            {
              attrs: {
                ...(node?.attrs || {}),
                lilist: { ...nodeLilist, list_number: number },
              },
            } as any,
            { at: [idx] },
          );
        }
      });
    });
  });
};
