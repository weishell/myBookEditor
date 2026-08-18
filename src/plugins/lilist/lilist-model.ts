// lilist 数据模型 —— 列表绑定在宿主块（段落 / 标题）的 attrs.lilist 上
// 字段语义对齐 template.md 的 olul_obj：
//  - list_type:   ol 有序 / ul 无序（枚举见 enums/block.ts）
//  - list_id:     列表分组 id，相同 id 的连续块属于同一个列表
//  - list_number: 编号数值（四个字段均为必填，创建时必须完整写入）
//  - list_custom: 是否为用户自定义锚点；新列表首项为 true，其余为 false，
//                 编号计算到锚点即截止、不再向前传播
import { Editor, Node, Path } from 'slate';
import { BlockElementType, LilistType } from '@/enums';

export { LilistType };

/** 有序列表起始数字上限（对齐 template.md 的 MAX_OL_NUMBER，超出则从 1 开始） */
export const MAX_LIST_NUMBER = 1000;

export interface LilistAttr {
  list_type: LilistType;
  list_id: string;
  list_number: number;
  list_custom: boolean;
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
 * 计算有序列表编号（渲染期纯计算，不持久化依赖）
 * 从当前块向前遍历同组（同 list_id）块：
 *  - 同缩进：累计计数；若命中自定义锚点（list_custom），则以 list_number 为基准返回
 *  - 更深缩进：跳过（嵌套子列表不影响父级计数）
 *  - 更浅缩进：停止（到达子编号流边界）
 *  - 非同组：停止
 */
export const computeListNumber = (editor: Editor, path: Path): number => {
  try {
    const node = Node.get(editor, path) as any;
    const lilist = getLilist(node);
    if (!lilist || lilist.list_type !== LilistType.OL) return 0;

    const indent = node?.attrs?.indent ?? 0;
    let count = 0;
    let p = path;

    for (;;) {
      const cur = Node.get(editor, p) as any;
      const curLilist = getLilist(cur);
      if (curLilist?.list_id !== lilist.list_id) break;

      const curIndent = cur?.attrs?.indent ?? 0;
      if (curIndent === indent) {
        count += 1;
        if (curLilist.list_custom) {
          return count - 1 + curLilist.list_number;
        }
      } else if (curIndent < indent) {
        break;
      }

      if (p[p.length - 1] === 0) break;
      p = Path.previous(p);
    }

    return count > 0 ? count : 1;
  } catch {
    return 1;
  }
};
