// 日历块的 Slate 节点定义与增删改操作。
// 日程直接挂在节点 attrs.events 上，随文档 JSON 一起序列化/持久化。

import { Editor, Transforms, Element } from 'slate';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import { v4 as uuidv4 } from 'uuid';
import {
  EVENT_COLORS,
  formatDate,
  genEventId,
  normalizeRange,
  type CalendarEvent,
} from './calendar-utils';

export type { CalendarEvent };

export interface CalendarAttrs {
  /** 当前展示的年份 */
  year: number;
  /** 当前展示的月份 1-12 */
  month: number;
  /** 日程列表 */
  events: CalendarEvent[];
  /** 是否显示农历副标题 */
  showLunar: boolean;
  /** 是否显示节气 */
  showTerm: boolean;
  /** 一周起始：1=周一（当前仅支持周一制） */
  weekStart: 1;
}

export interface CalendarElement {
  type: typeof BlockElementType.CALENDAR;
  id?: string;
  attrs: CalendarAttrs;
  children: [{ text: string }];
}

export const DEFAULT_CALENDAR_ATTRS: CalendarAttrs = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  events: [],
  showLunar: true,
  showTerm: true,
  weekStart: 1,
};

export const isCalendarElement = (n: unknown): n is CalendarElement =>
  !!n && typeof n === 'object' && (n as { type?: unknown }).type === BlockElementType.CALENDAR;

/** 创建一个日历块（void，需含单个零宽文本子节点保证结构合法） */
export const createCalendarElement = (attrs?: Partial<CalendarAttrs>): CalendarElement => ({
  type: BlockElementType.CALENDAR,
  id: uuidv4(),
  attrs: { ...DEFAULT_CALENDAR_ATTRS, ...attrs },
  children: [{ text: ZERO_WIDTH_SPACE }],
});

/** 兜底修复非法 attrs，供 normalizeNode 使用 */
export const normalizeCalendarAttrs = (raw: unknown): CalendarAttrs => {
  const a = (raw || {}) as Partial<CalendarAttrs>;
  const now = new Date();
  const year = Number.isFinite(a.year) ? Number(a.year) : now.getFullYear();
  const month = Number.isFinite(a.month)
    ? Math.min(12, Math.max(1, Number(a.month)))
    : now.getMonth() + 1;
  const events = Array.isArray(a.events)
    ? a.events.filter(
        (e): e is CalendarEvent =>
          !!e &&
          typeof e.id === 'string' &&
          typeof e.start === 'string' &&
          typeof e.end === 'string',
      )
    : [];
  return {
    year,
    month,
    events,
    showLunar: a.showLunar !== false,
    showTerm: a.showTerm !== false,
    weekStart: 1,
  };
};

/** 取下一个可用的事件颜色（按已有数量轮转） */
export const nextEventColor = (events: CalendarEvent[]): string =>
  EVENT_COLORS[events.length % EVENT_COLORS.length];

/** 创建一条日程（自动修正 start > end 的情况） */
export const createEvent = (
  start: string,
  end: string,
  title: string,
  color?: string,
): CalendarEvent => {
  const range = normalizeRange(start, end);
  return {
    id: genEventId(),
    title: title.trim() || '新日程',
    start: range.start,
    end: range.end,
    color: color || EVENT_COLORS[0],
  };
};

/** 默认日程区间：以 day 为起点，单日 */
export const defaultEventRange = (day: string): { start: string; end: string } => ({
  start: day,
  end: day,
});

/**
 * 把新的 events 数组写回节点。
 * 注意 match 必须精确到 CALENDAR：Slate 对 Path 类型的 at 会遍历
 * 「祖先 + 自身 + 后代」，宽匹配会把上层块一起改坏。
 */
export const writeCalendarEvents = (
  editor: Editor,
  path: number[],
  attrs: CalendarAttrs,
  events: CalendarEvent[],
): void => {
  Transforms.setNodes(editor, { attrs: { ...attrs, events } } as any, {
    at: path,
    voids: true,
    match: (n) => Element.isElement(n) && (n as any).type === BlockElementType.CALENDAR,
  });
};

/** 同理，写回整个 attrs（用于切月、切开关） */
export const writeCalendarAttrs = (editor: Editor, path: number[], next: CalendarAttrs): void => {
  Transforms.setNodes(editor, { attrs: next } as any, {
    at: path,
    voids: true,
    match: (n) => Element.isElement(n) && (n as any).type === BlockElementType.CALENDAR,
  });
};

/** 新增日程 */
export const addCalendarEvent = (
  editor: Editor,
  path: number[],
  attrs: CalendarAttrs,
  ev: CalendarEvent,
): void => {
  writeCalendarEvents(editor, path, attrs, [...attrs.events, ev]);
};

/** 更新日程（按 id 替换） */
export const updateCalendarEvent = (
  editor: Editor,
  path: number[],
  attrs: CalendarAttrs,
  ev: CalendarEvent,
): void => {
  writeCalendarEvents(
    editor,
    path,
    attrs,
    attrs.events.map((e) => (e.id === ev.id ? ev : e)),
  );
};

/** 删除日程 */
export const removeCalendarEvent = (
  editor: Editor,
  path: number[],
  attrs: CalendarAttrs,
  id: string,
): void => {
  writeCalendarEvents(
    editor,
    path,
    attrs,
    attrs.events.filter((e) => e.id !== id),
  );
};

/** 今天所在月份，用于「回到今天」 */
export const currentYearMonth = (): { year: number; month: number } => {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
};

/** 月份加减，返回新的 {year, month} */
export const shiftMonth = (
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } => {
  const d = new Date(year, month - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
};

/** 格式化为「2026年9月」 */
export const formatYearMonth = (year: number, month: number): string => `${year}年${month}月`;

/** 今天 */
export const todayISO = (): string => formatDate(new Date());
