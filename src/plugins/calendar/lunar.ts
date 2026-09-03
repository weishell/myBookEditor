// 农历 / 二十四节气 / 节日 —— 纯计算，无任何依赖，可独立单测。
//
// 数据范围：1900-01-31（农历 1900 年正月初一）～ 2100-12-31。
// 超出范围的函数会返回 null，调用方需自行兜底。

// ============ 农历基础数据表 ============
// 每年一个 20 位整数（十六进制书写），从 1900 年起：
//   bit0-3   闰月月份（0 表示当年无闰月）
//   bit4-15  正月～腊月的大小月（1=30 天，0=29 天）
//   bit16    闰月天数（1=30 天，0=29 天）
const LUNAR_INFO: number[] = [
  0x04bd8,
  0x04ae0,
  0x0a570,
  0x054d5,
  0x0d260,
  0x0d950,
  0x16554,
  0x056a0,
  0x09ad0,
  0x055d2, // 1900-1909
  0x04ae0,
  0x0a5b6,
  0x0a4d0,
  0x0d250,
  0x1d255,
  0x0b540,
  0x0d6a0,
  0x0ada2,
  0x095b0,
  0x14977, // 1910-1919
  0x04970,
  0x0a4b0,
  0x0b4b5,
  0x06a50,
  0x06d40,
  0x1ab54,
  0x02b60,
  0x09570,
  0x052f2,
  0x04970, // 1920-1929
  0x06566,
  0x0d4a0,
  0x0ea50,
  0x06e95,
  0x05ad0,
  0x02b60,
  0x186e3,
  0x092e0,
  0x1c8d7,
  0x0c950, // 1930-1939
  0x0d4a0,
  0x1d8a6,
  0x0b550,
  0x056a0,
  0x1a5b4,
  0x025d0,
  0x092d0,
  0x0d2b2,
  0x0a950,
  0x0b557, // 1940-1949
  0x06ca0,
  0x0b550,
  0x15355,
  0x04da0,
  0x0a5b0,
  0x14573,
  0x052b0,
  0x0a9a8,
  0x0e950,
  0x06aa0, // 1950-1959
  0x0aea6,
  0x0ab50,
  0x04b60,
  0x0aae4,
  0x0a570,
  0x05260,
  0x0f263,
  0x0d950,
  0x05b57,
  0x056a0, // 1960-1969
  0x096d0,
  0x04dd5,
  0x04ad0,
  0x0a4d0,
  0x0d4d4,
  0x0d250,
  0x0d558,
  0x0b540,
  0x0b6a0,
  0x195a6, // 1970-1979
  0x095b0,
  0x049b0,
  0x0a974,
  0x0a4b0,
  0x0b27a,
  0x06a50,
  0x06d40,
  0x0af46,
  0x0ab60,
  0x09570, // 1980-1989
  0x04af5,
  0x04970,
  0x064b0,
  0x074a3,
  0x0ea50,
  0x06b58,
  0x055c0,
  0x0ab60,
  0x096d5,
  0x092e0, // 1990-1999
  0x0c960,
  0x0d954,
  0x0d4a0,
  0x0da50,
  0x07552,
  0x056a0,
  0x0abb7,
  0x025d0,
  0x092d0,
  0x0cab5, // 2000-2009
  0x0a950,
  0x0b4a0,
  0x0baa4,
  0x0ad50,
  0x055d9,
  0x04ba0,
  0x0a5b0,
  0x15176,
  0x052b0,
  0x0a930, // 2010-2019
  0x07954,
  0x06aa0,
  0x0ad50,
  0x05b52,
  0x04b60,
  0x0a6e6,
  0x0a4e0,
  0x0d260,
  0x0ea65,
  0x0d530, // 2020-2029
  0x05aa0,
  0x076a3,
  0x096d0,
  0x04afb,
  0x04ad0,
  0x0a4d0,
  0x1d0b6,
  0x0d250,
  0x0d520,
  0x0dd45, // 2030-2039
  0x0b5a0,
  0x056d0,
  0x055b2,
  0x049b0,
  0x0a577,
  0x0a4b0,
  0x0aa50,
  0x1b255,
  0x06d20,
  0x0ada0, // 2040-2049
  0x14b63,
  0x09370,
  0x049f8,
  0x04970,
  0x064b0,
  0x168a6,
  0x0ea50,
  0x06b20,
  0x1a6c4,
  0x0aae0, // 2050-2059
  0x0a2e0,
  0x0d2e3,
  0x0c960,
  0x0d557,
  0x0d4a0,
  0x0da50,
  0x05d55,
  0x056a0,
  0x0a6d0,
  0x055d4, // 2060-2069
  0x052d0,
  0x0a9b8,
  0x0a950,
  0x0b4a0,
  0x0b6a6,
  0x0ad50,
  0x055a0,
  0x0aba4,
  0x0a5b0,
  0x052b0, // 2070-2079
  0x0b273,
  0x06930,
  0x07337,
  0x06aa0,
  0x0ad50,
  0x14b55,
  0x04b60,
  0x0a570,
  0x054e4,
  0x0d160, // 2080-2089
  0x0e968,
  0x0d520,
  0x0daa0,
  0x16aa6,
  0x056d0,
  0x04ae0,
  0x0a9d4,
  0x0a2d0,
  0x0d150,
  0x0f252, // 2090-2099
  0x0d520, // 2100
];

export const LUNAR_MIN_YEAR = 1900;
export const LUNAR_MAX_YEAR = 2100;

/** 闰哪个月（1-12），0 表示当年无闰月 */
export const leapMonth = (y: number): number => LUNAR_INFO[y - LUNAR_MIN_YEAR] & 0xf;

/** 闰月天数，无闰月返回 0 */
export const leapDays = (y: number): number =>
  leapMonth(y) ? (LUNAR_INFO[y - LUNAR_MIN_YEAR] & 0x10000 ? 30 : 29) : 0;

/** 农历某月天数（m: 1-12） */
export const monthDays = (y: number, m: number): number =>
  LUNAR_INFO[y - LUNAR_MIN_YEAR] & (0x10000 >> m) ? 30 : 29;

/** 农历年总天数 */
export const lYearDays = (y: number): number => {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += LUNAR_INFO[y - LUNAR_MIN_YEAR] & i ? 1 : 0;
  }
  return sum + leapDays(y);
};

export interface LunarDate {
  /** 农历年 */
  year: number;
  /** 农历月 1-12 */
  month: number;
  /** 农历日 1-30 */
  day: number;
  /** 是否闰月 */
  isLeap: boolean;
  /** 农历月中文名，如「正月」「冬月」「闰二月」 */
  monthName: string;
  /** 农历日中文名，如「初一」「十五」「廿三」「三十」 */
  dayName: string;
  /** 生肖，如「龙」 */
  zodiac: string;
  /** 干支年，如「甲辰」 */
  ganZhi: string;
}

const LUNAR_MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAY_NAMES = [
  '初一',
  '初二',
  '初三',
  '初四',
  '初五',
  '初六',
  '初七',
  '初八',
  '初九',
  '初十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '廿一',
  '廿二',
  '廿三',
  '廿四',
  '廿五',
  '廿六',
  '廿七',
  '廿八',
  '廿九',
  '三十',
];
const ZODIACS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
/** 1900 年是农历庚子年（鼠年） */
const GAN_ZHI_BASE_INDEX = 36; // 庚子

/** 公历 → 农历。超出数据范围返回 null。y: 年, m: 1-12, d: 1-31 */
export const solarToLunar = (y: number, m: number, d: number): LunarDate | null => {
  if (y < LUNAR_MIN_YEAR || y > LUNAR_MAX_YEAR) return null;

  // 以 1900-01-31（农历 1900 年正月初一）为基准，算出相差天数
  let offset = Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000);
  if (offset < 0) return null;

  // 逐年扣减，定位农历年
  let i = LUNAR_MIN_YEAR;
  let temp = 0;
  for (; i <= LUNAR_MAX_YEAR && offset >= 0; i++) {
    temp = lYearDays(i);
    offset -= temp;
  }
  if (offset < 0) {
    offset += temp;
    i--;
  }
  if (i > LUNAR_MAX_YEAR) return null;
  const year = i;

  // 逐月扣减，定位农历月
  const leap = leapMonth(year);
  let isLeap = false;
  let month = 1;
  for (month = 1; month < 13 && offset > 0; month++) {
    if (leap > 0 && month === leap + 1 && !isLeap) {
      month--;
      isLeap = true;
      temp = leapDays(year);
    } else {
      temp = monthDays(year, month);
    }
    if (isLeap && month === leap + 1) isLeap = false;
    offset -= temp;
  }
  // 边界：offset 恰好为 0 且落在闰月上
  if (offset === 0 && leap > 0 && month === leap + 1) {
    if (isLeap) {
      isLeap = false;
    } else {
      isLeap = true;
      month--;
    }
  }
  if (offset < 0) {
    offset += temp;
    month--;
  }
  if (month > 12) month = 12;
  const day = offset + 1;

  return {
    year,
    month,
    day,
    isLeap,
    monthName: (isLeap ? '闰' : '') + LUNAR_MONTH_NAMES[month - 1] + '月',
    dayName: LUNAR_DAY_NAMES[day - 1] || String(day),
    // 1900 年是庚子年：干支索引 36（庚子），生肖即地支位「子」= 0。
    // 生肖与地支一一对应（子鼠丑牛…），所以两者共用同一个 12 循环偏移。
    zodiac: ZODIACS[(((year - LUNAR_MIN_YEAR) % 12) + 12) % 12],
    ganZhi:
      GAN[(((year - LUNAR_MIN_YEAR) % 10) + GAN_ZHI_BASE_INDEX + 10) % 10] +
      ZHI[(((year - LUNAR_MIN_YEAR) % 12) + GAN_ZHI_BASE_INDEX + 12) % 12],
  };
};

// ============ 二十四节气 ============
// 基于 1900-01-06 02:05（小寒）起算，每年 365.2422 天，
// 各节气相对该基准的偏移（单位：分钟）。
const TERM_OFFSETS: number[] = [
  0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343,
  285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758,
];

export const TERM_NAMES: string[] = [
  '小寒',
  '大寒',
  '立春',
  '雨水',
  '惊蛰',
  '春分',
  '清明',
  '谷雨',
  '立夏',
  '小满',
  '芒种',
  '夏至',
  '小暑',
  '大暑',
  '立秋',
  '处暑',
  '白露',
  '秋分',
  '寒露',
  '霜降',
  '立冬',
  '小雪',
  '大雪',
  '冬至',
];

const MS_PER_TROPICAL_YEAR = 31556925974.7;
const TERM_BASE_UTC = Date.UTC(1900, 0, 6, 2, 5);

/**
 * 第 n 个节气（0=小寒 … 23=冬至）在 y 年落在几号。
 * 所在月份恒为 floor(n/2)+1（小寒/大寒在 1 月，立春/雨水在 2 月……）。
 */
export const solarTermDay = (y: number, n: number): number | null => {
  if (y < LUNAR_MIN_YEAR || y > LUNAR_MAX_YEAR) return null;
  if (n < 0 || n > 23) return null;
  const ms = (y - LUNAR_MIN_YEAR) * MS_PER_TROPICAL_YEAR + TERM_OFFSETS[n] * 60000 + TERM_BASE_UTC;
  return new Date(ms).getUTCDate();
};

/** 该年所有节气的 {name, month, day} 映射，供 O(1) 查询 */
export interface TermInfo {
  name: string;
  month: number;
  day: number;
  index: number;
}

const termCache = new Map<number, Map<string, TermInfo>>();

export const getYearTerms = (y: number): Map<string, TermInfo> => {
  const cached = termCache.get(y);
  if (cached) return cached;
  const map = new Map<string, TermInfo>();
  for (let n = 0; n < 24; n++) {
    const day = solarTermDay(y, n);
    if (day == null) continue;
    const month = Math.floor(n / 2) + 1;
    map.set(`${month}-${day}`, { name: TERM_NAMES[n], month, day, index: n });
  }
  termCache.set(y, map);
  return map;
};

// ============ 节日 ============
export type FestivalKind = 'solar' | 'lunar' | 'term';

export interface Festival {
  name: string;
  kind: FestivalKind;
  /** 用于渲染的装饰 emoji，没有则留空 */
  emoji?: string;
  /** 是否属于法定节假日（可用于后续调休补班扩展） */
  legal?: boolean;
}

// 公历固定节日（月-日）
const SOLAR_FESTIVALS: Record<string, Festival> = {
  '1-1': { name: '元旦', kind: 'solar', emoji: '🎆', legal: true },
  '2-14': { name: '情人节', kind: 'solar', emoji: '💝' },
  '3-8': { name: '妇女节', kind: 'solar', emoji: '🌸' },
  '3-12': { name: '植树节', kind: 'solar', emoji: '🌳' },
  '4-1': { name: '愚人节', kind: 'solar', emoji: '🤡' },
  '5-1': { name: '劳动节', kind: 'solar', emoji: '🏅', legal: true },
  '5-4': { name: '青年节', kind: 'solar', emoji: '🎓' },
  '6-1': { name: '儿童节', kind: 'solar', emoji: '🎈' },
  '7-1': { name: '建党节', kind: 'solar', emoji: '🚩' },
  '8-1': { name: '建军节', kind: 'solar', emoji: '⭐' },
  '9-10': { name: '教师节', kind: 'solar', emoji: '🍎' },
  '10-1': { name: '国庆节', kind: 'solar', emoji: '🇨🇳', legal: true },
  '11-1': { name: '万圣节', kind: 'solar', emoji: '🎃' },
  '12-24': { name: '平安夜', kind: 'solar', emoji: '🔔' },
  '12-25': { name: '圣诞节', kind: 'solar', emoji: '🎄' },
};

// 农历固定节日（月-日），除夕需特殊处理（腊月最后一天）
const LUNAR_FESTIVALS: Record<string, Festival> = {
  '1-1': { name: '春节', kind: 'lunar', emoji: '🧧', legal: true },
  '1-15': { name: '元宵节', kind: 'lunar', emoji: '🏮' },
  '2-2': { name: '龙抬头', kind: 'lunar', emoji: '🐉' },
  '5-5': { name: '端午节', kind: 'lunar', emoji: '🐲', legal: true },
  '7-7': { name: '七夕', kind: 'lunar', emoji: '💕' },
  '7-15': { name: '中元节', kind: 'lunar', emoji: '🕯️' },
  '8-15': { name: '中秋节', kind: 'lunar', emoji: '🥮', legal: true },
  '9-9': { name: '重阳节', kind: 'lunar', emoji: '🍂' },
  '12-8': { name: '腊八节', kind: 'lunar', emoji: '🍲' },
};

/** 需要高亮的节气（全部 24 个太密，只标有存在感的几个） */
const HIGHLIGHT_TERMS: Record<string, string> = {
  立春: '🌱',
  清明: '🌿',
  立夏: '🌞',
  夏至: '🍉',
  立秋: '🍁',
  冬至: '🥟',
};

export interface DayInfo {
  /** 公历日 1-31 */
  day: number;
  /** 0=周日 1=周一 … 6=周六 */
  weekday: number;
  /** 是否周末 */
  isWeekend: boolean;
  /** 农历信息（超出范围或计算失败为 null） */
  lunar: LunarDate | null;
  /** 当天节日（可能多个，按优先级排序） */
  festivals: Festival[];
  /** 当天节气名（无则 undefined） */
  term?: string;
}

/**
 * 取某一天的完整信息（农历 + 节日 + 节气）。
 * 优先级：农历节日 > 公历节日 > 节气 > 农历日名。
 */
export const getDayInfo = (y: number, m: number, d: number): DayInfo => {
  const date = new Date(y, m - 1, d);
  const weekday = date.getDay();
  const lunar = solarToLunar(y, m, d);
  const festivals: Festival[] = [];

  // 农历节日（含除夕：腊月最后一天）
  if (lunar) {
    if (lunar.month === 12 && !lunar.isLeap) {
      const daysInMonth = monthDays(lunar.year, 12);
      const isLastDay = lunar.day === daysInMonth;
      if (isLastDay) {
        festivals.push({ name: '除夕', kind: 'lunar', emoji: '🧨', legal: true });
      } else if (lunar.day === daysInMonth - 1) {
        // 部分地区以腊月廿九为小除夕，这里不强加，避免与廿三/廿四小年冲突
      }
    }
    const key = `${lunar.month}-${lunar.day}`;
    const f = LUNAR_FESTIVALS[key];
    if (f && !lunar.isLeap) festivals.push(f);
    // 小年：北方腊月廿三 / 南方腊月廿四
    if (lunar.month === 12 && (lunar.day === 23 || lunar.day === 24)) {
      festivals.push({ name: '小年', kind: 'lunar', emoji: '🧹' });
    }
  }

  // 公历节日
  const solarKey = `${m}-${d}`;
  const sf = SOLAR_FESTIVALS[solarKey];
  if (sf) festivals.push(sf);

  // 节气
  const term = getYearTerms(y).get(solarKey);

  return {
    day: d,
    weekday,
    isWeekend: weekday === 0 || weekday === 6,
    lunar,
    festivals,
    term: term?.name,
  };
};

/**
 * 日期格子副标题：优先节日名，其次节气，最后农历日名。
 * 返回 null 表示不显示副标题。
 */
export const getDaySubLabel = (
  info: DayInfo,
  opts: { showLunar?: boolean; showTerm?: boolean } = {},
): { text: string; festival?: Festival; term?: string } | null => {
  const { showLunar = true, showTerm = true } = opts;
  const first = info.festivals[0];
  if (first) return { text: first.name, festival: first };
  if (showTerm && info.term && HIGHLIGHT_TERMS[info.term]) {
    return { text: info.term, term: info.term };
  }
  if (showLunar && info.lunar) {
    // 初一显示月份名（如「正月」），其余显示日名（如「十五」）
    return { text: info.lunar.day === 1 ? info.lunar.monthName : info.lunar.dayName };
  }
  return null;
};
