// 非文本（原子类）元素的统一约束
//
// 背景：非文本插件（图片/图表/日历/倒计时/drawio/公式/提及/时间轴/嵌入/音视频/分割线…）
// 内部没有可编辑文本，但 Slate 仍会保留一个隐藏 text 子节点。于是"随便点点"就可能把光标
// 放到这些区域，表现为莫名其妙的闪烁光标、后续打字打到看不见的地方、方向键行为异常。
//
// 三层约束（缺一不可）：
//   1) 结构层 void：isVoid() 对这些类型返回 true，Slate 从模型上不允许光标进入。
//      见 withEditorBehaviors.isVoid（已改为使用本文件的 NON_TEXT_TYPES）。
//   2) 行为层 全局守卫：useNonEditableCaretGuard() 在捕获阶段拦截 mousedown，
//      落在非可编辑区域内的按下直接 preventDefault —— 浏览器不会移动光标也不会起选区。
//      这一层对已有/将来的插件自动生效，插件本身不改代码也能受益（前提是标了 CE=false）。
//   3) 编写层 约定：装饰层统一用 nonEditableProps()，不要只写 contentEditable={false}。
//      只写 CE=false 只能防"输入"，防不住"光标落位"，这正是历史 bug 的来源。
import type { MouseEventHandler } from 'react';
import { BlockElementType } from '@/enums';

/** 需要真实焦点/光标的控件：即使在非可编辑区域内也必须放行 */
export const FOCUSABLE_CONTROLS = 'input, textarea, select, [contenteditable="true"]';

/** 非可编辑区域的判定选择器（DOM 层） */
export const NON_EDITABLE_SELECTOR =
  '[contenteditable="false"], [data-non-editable], [data-slate-void]';

/** 装饰层统一标记：带上后全局守卫一定能识别，不依赖浏览器对 contenteditable 的解析 */
export const NON_EDITABLE_ATTR = 'data-non-editable';

/**
 * 非文本（原子）元素类型总表 —— 唯一事实来源。
 * 新增非文本插件时，只需在这里加一行，void 判定与若干行为自动生效。
 * 注意：表格（table/table-row/table-cell）不是非文本元素，单元格内有可编辑文本。
 */
export const NON_TEXT_TYPES: BlockElementType[] = [
  BlockElementType.IMAGE_BLOCK, // 图片
  BlockElementType.DIVIDER, // 分割线
  BlockElementType.FILE_BLOCK, // 附件
  BlockElementType.VIDEO_BLOCK, // 视频
  BlockElementType.DRAWIO, // drawio 图（原先漏了 void 声明）
  BlockElementType.COUNTDOWN, // 倒计时
  BlockElementType.CALENDAR, // 日历
  BlockElementType.CHART, // 图表
  BlockElementType.EMBED, // 嵌入
  BlockElementType.FORMULA, // 行内公式（inline void）
  BlockElementType.MENTION, // 提及（inline void）
  BlockElementType.TIMELINE, // 时间轴
];

const NON_TEXT_TYPE_SET: Set<string> = new Set(NON_TEXT_TYPES as string[]);

/** 是否为非文本（原子）元素类型 */
export const isNonTextType = (type?: string | null): boolean =>
  !!type && NON_TEXT_TYPE_SET.has(type);

/**
 * 装饰层/UI 浮层的标准属性。
 *
 * 用法（替代只写 contentEditable={false} 的旧写法）：
 *   <div {...nonEditableProps()}>…</div>
 *   <div {...nonEditableProps({ className: styles.toolbar })}>…</div>
 *
 * 自带三件事：
 *   - contentEditable={false}      不可输入
 *   - data-non-editable            全局守卫可识别
 *   - onMouseDown 里 preventDefault 浏览器不会把光标/选区放到这里
 * 表单控件（input/textarea/select）上的按下会自动放行，保证还能聚焦输入。
 */
export function nonEditableProps<T extends Record<string, any>>(extra?: T) {
  const extraOnMouseDown = extra?.onMouseDown as MouseEventHandler<any> | undefined;
  // 先摘出调用方的 onMouseDown，避免展开 extra 时把下面的包装版本覆盖掉
  const rest: Record<string, any> = { ...(extra || {}) };
  delete rest.onMouseDown;

  return {
    contentEditable: false,
    suppressContentEditableWarning: true,
    [NON_EDITABLE_ATTR]: true,
    ...rest,
    onMouseDown: ((e: any) => {
      const t = e.target as HTMLElement | null;
      // 表单控件需要真实焦点 → 放行
      if (t && t.closest && t.closest(FOCUSABLE_CONTROLS)) return;
      // 阻止浏览器把光标/选区落到非可编辑区域（不影响事件继续冒泡给 React 的 onClick）
      e.preventDefault();
      extraOnMouseDown?.(e);
    }) as MouseEventHandler<any>,
  } as unknown as Record<string, any> & Omit<T, 'onMouseDown'>;
}
