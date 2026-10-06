// 块文案的公共拼装（块类型选择面板 / FloatBar 合并菜单共用）
//
// 标题类文案要把层级塞进词条，而中文用中文数字（一级标题）、其它语言用阿拉伯数字（Heading 1），
// 所以词条只维护一条 `blockPicker.heading`，靠 n / d 两个参数适配：
//   zh / zh-TW → '{{n}}级标题'（一/二/三…）    其它 → 'Heading {{d}}'
// 单源放在这里，避免两个面板各写一份转换逻辑。
import type { TFunction } from 'i18next';

/** 1-9 → 一/二/…/九，10+ 回退为阿拉伯数字 */
export const toChineseLevel = (n: number): string =>
  ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'][n] || String(n);

/** H1..H9 的展示文案（用于块类型面板与 FloatBar 合并菜单） */
export const headingBlockLabel = (t: TFunction, level: number): string =>
  String(t('blockPicker.heading', { n: toChineseLevel(level), d: level }));
