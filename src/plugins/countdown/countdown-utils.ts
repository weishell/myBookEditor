import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import { v4 as uuidv4 } from 'uuid';

/** 倒计时配置模式：时长（相对）/ 日期（绝对到点） */
export type CountdownMode = 'duration' | 'datetime';

/** 时长模式的四段输入 */
export interface CountdownDuration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CountdownAttrs {
  /** 当前编辑模式 */
  mode: CountdownMode;
  /** 时长模式输入值（用于回填/再次编辑） */
  duration: CountdownDuration;
  /** 绝对结束时间戳(ms)；两种模式确认后都落到它，倒计时据此运行 */
  targetDate: number | null;
  /** 倒计时结束时是否显示气泡提醒 */
  notify: boolean;
}

export interface CountdownElement {
  type: typeof BlockElementType.COUNTDOWN;
  id?: string;
  attrs: CountdownAttrs;
  children: [{ text: string }];
}

export const DEFAULT_COUNTDOWN_DURATION: CountdownDuration = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export const DEFAULT_COUNTDOWN_ATTRS: CountdownAttrs = {
  mode: 'duration',
  duration: { ...DEFAULT_COUNTDOWN_DURATION },
  targetDate: null,
  notify: true,
};

export const isCountdownElement = (n: unknown): n is CountdownElement =>
  !!n && typeof n === 'object' && (n as { type?: unknown }).type === BlockElementType.COUNTDOWN;

/** 创建一个倒计时块节点（void，需含单个零宽文本子节点保证结构合法） */
export const createCountdownElement = (attrs?: Partial<CountdownAttrs>): CountdownElement => ({
  type: BlockElementType.COUNTDOWN,
  id: uuidv4(),
  attrs: {
    ...DEFAULT_COUNTDOWN_ATTRS,
    duration: { ...DEFAULT_COUNTDOWN_ATTRS.duration, ...attrs?.duration },
    ...attrs,
  },
  children: [{ text: ZERO_WIDTH_SPACE }],
});

export interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  finished: boolean;
}

/** 由绝对结束时间戳计算剩余时间；未配置或已结束返回 0，finished 标识状态 */
export const computeRemaining = (
  targetDate: number | null | undefined,
  nowMs: number,
): RemainingTime => {
  if (!targetDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, finished: false };
  }
  const diff = targetDate - nowMs;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, finished: true };
  }
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    totalMs: diff,
    finished: false,
  };
};

const pad = (n: number) => String(n).padStart(2, '0');

export const formatRemaining = (t: RemainingTime) => ({
  days: pad(t.days),
  hours: pad(t.hours),
  minutes: pad(t.minutes),
  seconds: pad(t.seconds),
});

/** 将时长模式的四段换算为毫秒 */
export const durationToMs = (d: CountdownDuration): number =>
  d.days * 86400000 + d.hours * 3600000 + d.minutes * 60000 + d.seconds * 1000;
