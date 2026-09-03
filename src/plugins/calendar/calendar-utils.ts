// 日历纯逻辑：日期工具、月历格子生成、跨日期日程的按周分段与泳道排布。
// 不依赖 React / Slate，可独立单测。

import { getDayInfo, getDaySubLabel, type DayInfo, type Festival } from './lunar';

/** 日程事件 —— 存在 Slate 节点 attrs 里，随文档一起序列化 */
export interface CalendarEvent {
  id: string;
  title: string;
  /** 起始日，格式 YYYY-MM-DD */
  start: string;
  /** 结束日（含），跨日期时与 start 不同 */
  end: string;
  /** 主题色，形如 #3370ff */
  color: string;
  /** 备注 */
  note?: string;
}

/** 一个日期格子 */
export interface DayCell {
  /** YYYY-MM-DD */
  key: string;
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  /** 相对当前展示的月份：-1 上月补白 / 0 本月 / 1 下月补白 */
  offset: -1 | 0 | 1;
  isToday: boolean;
  weekday: number; // 0=周日 … 6=周六
  isWeekend: boolean;
  lunar: DayInfo['lunar'];
  festivals: Festival[];
  term?: string;
  /** 副标题（节日/节气/农历），null 表示不显示 */
  subLabel: { text: string; festival?: Festival; term?: string } | null;
  /** 该日的 Date（本地零点），供事件比对 */
  date: Date;
}

/** 跨日期事件在某一周内的一段 */
export interface EventSegment {
  event: CalendarEvent;
  /** 起始列 0-6 */
  startCol: number;
  /** 结束列 0-6（含） */
  endCol: number;
  /** 泳道序号，0 为最上面一条 */
  lane: number;
  /** 是否为整条事件的起点段（用于左侧圆角） */
  isStart: boolean;
  /** 是否为整条事件的终点段（用于右侧圆角） */
  isEnd: boolean;
}

export interface WeekRow {
  index: number;
  days: DayCell[]; // 固定 7 个
  segments: EventSegment[];
  /** 因超出可见泳道而未渲染的条数 */
  overflow: number;
}

// ============ 日期工具 ============

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Date → 'YYYY-MM-DD'（按本地时间，避免 UTC 时区偏移错日） */
export const formatDate = (d: Date): string =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** 'YYYY-MM-DD' → Date（本地零点）。解析失败返回 null */
export const parseDate = (s: string): Date | null => {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, mo - 1, d);
  // 排除 2 月 30 日这类被 Date 自动进位的非法日期
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  return date;
};

export const todayKey = (): string => formatDate(new Date());

/** 两个日期相差天数（b - a），按本地零点计算 */
export const diffDays = (a: Date, b: Date): number => {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcB - utcA) / 86400000);
};

export const addDays = (d: Date, n: number): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** 某月的天数 */
export const daysInMonth = (y: number, m: number): number => new Date(y, m, 0).getDate();

/** 修正 start/end 顺序，保证 start <= end */
export const normalizeRange = (start: string, end: string): { start: string; end: string } => {
  const s = parseDate(start);
  const e = parseDate(end);
  if (!s || !e) return { start, end };
  return diffDays(s, e) >= 0 ? { start, end } : { start: end, end: start };
};

/** 事件是否为跨日期（>1 天） */
export const isMultiDay = (ev: CalendarEvent): boolean => ev.start !== ev.end;

/** 事件跨越的天数（含首尾） */
export const eventSpanDays = (ev: CalendarEvent): number => {
  const s = parseDate(ev.start);
  const e = parseDate(ev.end);
  if (!s || !e) return 1;
  return Math.max(1, diffDays(s, e) + 1);
};

// ============ 月历格子 ============

export interface BuildGridOptions {
  /** 是否显示农历副标题 */
  showLunar?: boolean;
  /** 是否显示节气 */
  showTerm?: boolean;
}

/**
 * 生成 6 行 × 7 列 = 42 个日期格子（周一为一周起始）。
 * 上月/下月补白日的 offset 分别为 -1 / 1，供样式弱化。
 */
export const buildMonthGrid = (
  year: number,
  month: number,
  opts: BuildGridOptions = {},
): DayCell[] => {
  const today = todayKey();
  const first = new Date(year, month - 1, 1);
  // 周一制下标：周一=0 … 周日=6
  const firstIdx = (first.getDay() + 6) % 7;
  const startDate = addDays(first, -firstIdx);

  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = addDays(startDate, i);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const key = formatDate(d);
    const info = getDayInfo(y, m, day);
    let offset: -1 | 0 | 1 = 0;
    if (m < month || (month === 1 && m === 12)) offset = -1;
    else if (m > month || (month === 12 && m === 1)) offset = 1;
    // 同年同月但年不同的边界（12 月视图里的 1 月）已在上面处理
    if (y < year) offset = -1;
    else if (y > year) offset = 1;

    cells.push({
      key,
      year: y,
      month: m,
      day,
      offset,
      isToday: key === today,
      weekday: info.weekday,
      isWeekend: info.isWeekend,
      lunar: info.lunar,
      festivals: info.festivals,
      term: info.term,
      subLabel: getDaySubLabel(info, opts),
      date: d,
    });
  }
  return cells;
};

/** 42 格切成 6 个周行 */
export const toWeekRows = (cells: DayCell[]): DayCell[][] => {
  const rows: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
};

// ============ 跨日期日程分段 ============

/**
 * 把事件按周行切段，并分配泳道（lane）避免重叠。
 *
 * 关键点：同一条跨日期事件在相邻周会被切成多段，但它们在各自周行内独立占
 * 一条连续横条，视觉上跨周断开、周内连续。lane 用贪心分配（按 startCol 升序，
 * 找第一条不与已占用区间重叠的泳道），保证同一周内的事件不会互相压盖。
 */
export const layoutWeekRow = (
  rowDays: DayCell[],
  events: CalendarEvent[],
  maxLanes: number,
): { segments: EventSegment[]; overflow: number } => {
  if (rowDays.length === 0) return { segments: [], overflow: 0 };
  const rowStart = rowDays[0].date;
  const rowEnd = rowDays[rowDays.length - 1].date;

  const segs: EventSegment[] = [];
  for (const ev of events) {
    const s = parseDate(ev.start);
    const e = parseDate(ev.end);
    if (!s || !e) continue;
    // 与该周无交集
    if (diffDays(rowEnd, s) > 0 || diffDays(e, rowStart) > 0) continue;
    const startCol = Math.max(0, diffDays(rowStart, s));
    const endCol = Math.min(rowDays.length - 1, diffDays(rowStart, e));
    if (startCol > endCol) continue;
    segs.push({
      event: ev,
      startCol,
      endCol,
      lane: 0,
      isStart: diffDays(rowStart, s) >= 0,
      isEnd: diffDays(e, rowEnd) >= 0,
    });
  }

  // 稳定排序：起点靠前优先；同起点时长长的优先（长条更该排上面）
  segs.sort(
    (a, b) =>
      a.startCol - b.startCol ||
      b.endCol - b.startCol - (a.endCol - a.startCol) ||
      a.event.title.localeCompare(b.event.title),
  );

  // 贪心分配泳道
  const laneEnds: number[] = [];
  for (const seg of segs) {
    let lane = 0;
    while (lane < laneEnds.length && laneEnds[lane] >= seg.startCol) lane++;
    if (lane < maxLanes) {
      laneEnds[lane] = seg.endCol;
      seg.lane = lane;
    } else {
      // 超出可见泳道，稍后计入 overflow
      laneEnds[lane] = seg.endCol;
      seg.lane = lane;
    }
  }

  const visible = segs.filter((s) => s.lane < maxLanes);
  const overflow = segs.length - visible.length;
  return { segments: visible, overflow };
};

/** 一次性算好整个月的周行布局 */
export const buildWeekLayout = (
  cells: DayCell[],
  events: CalendarEvent[],
  maxLanes: number,
): WeekRow[] =>
  toWeekRows(cells).map((days, index) => {
    const { segments, overflow } = layoutWeekRow(days, events, maxLanes);
    return { index, days, segments, overflow };
  });

// ============ 事件辅助 ============

export const EVENT_COLORS = [
  '#3370ff', // 主题蓝
  '#41b584', // 绿
  '#f2a54a', // 橙
  '#e85a71', // 红
  '#7b6cf0', // 紫
  '#3aa0c9', // 青
];

export const genEventId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `ev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/** 事件是否覆盖某一天 */
export const eventCoversDay = (ev: CalendarEvent, key: string): boolean => {
  const s = parseDate(ev.start);
  const e = parseDate(ev.end);
  const d = parseDate(key);
  if (!s || !e || !d) return false;
  return diffDays(s, d) >= 0 && diffDays(d, e) >= 0;
};

/** 取某天的全部事件，按「跨日期优先、起点早优先」排序，保证渲染稳定 */
export const eventsOfDay = (events: CalendarEvent[], key: string): CalendarEvent[] =>
  events
    .filter((ev) => eventCoversDay(ev, key))
    .sort((a, b) => {
      const aMulti = isMultiDay(a) ? 0 : 1;
      const bMulti = isMultiDay(b) ? 0 : 1;
      if (aMulti !== bMulti) return aMulti - bMulti;
      if (a.start !== b.start) return a.start < b.start ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
