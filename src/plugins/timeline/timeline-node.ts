// 时间轴块的 Slate 节点定义与写回操作。
// 节点数据直接挂在 attrs.items 上，随文档 JSON 一起序列化/持久化。

import { Editor, Element, Transforms } from 'slate';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import { v4 as uuidv4 } from 'uuid';

export interface TimelineItem {
  id: string;
  /** 标题（可编辑，任意文本） */
  title: string;
  /** 详情（可编辑） */
  detail: string;
  /** 时间（可编辑，支持中文如「第一年」或数字如「2024」） */
  time: string;
}

/** 排列方向：水平（时间轴横向）/ 垂直（时间轴纵向） */
export type TimelineDirection = 'horizontal' | 'vertical';

/** 卡片分布：交替（两侧轮换）/ 同侧（全部同一侧） */
export type TimelineSideMode = 'alternate' | 'same';

export interface TimelineAttrs {
  /** 容器宽度（px） */
  width: number;
  /** 容器高度（px），内容超出后出现滚动条 */
  height: number;
  direction: TimelineDirection;
  sideMode: TimelineSideMode;
  items: TimelineItem[];
}

export interface TimelineElement {
  type: typeof BlockElementType.TIMELINE;
  id?: string;
  attrs: TimelineAttrs;
  children: [{ text: string }];
}

export const DEFAULT_TIMELINE_WIDTH = 700;
export const DEFAULT_TIMELINE_HEIGHT = 300;

export const makeTimelineItem = (patch: Partial<Omit<TimelineItem, 'id'>> = {}): TimelineItem => ({
  id: uuidv4(),
  title: '',
  detail: '',
  time: '',
  ...patch,
});

const DEFAULT_ITEMS = (): TimelineItem[] => [
  makeTimelineItem({ title: '项目启动', detail: '完成需求调研与立项评审', time: '2023年1月' }),
  makeTimelineItem({ title: '原型设计', detail: '输出高保真原型并通过评审', time: '2023年3月' }),
  makeTimelineItem({ title: '开发阶段', detail: '核心功能模块开发与联调', time: '2023年6月' }),
  makeTimelineItem({ title: '测试上线', detail: '完成验收测试并正式发布', time: '2023年9月' }),
];

export const DEFAULT_TIMELINE_ATTRS = (): TimelineAttrs => ({
  width: DEFAULT_TIMELINE_WIDTH,
  height: DEFAULT_TIMELINE_HEIGHT,
  direction: 'horizontal',
  sideMode: 'alternate',
  items: DEFAULT_ITEMS(),
});

export const isTimelineElement = (n: unknown): n is TimelineElement =>
  !!n && typeof n === 'object' && (n as { type?: unknown }).type === BlockElementType.TIMELINE;

/** 创建一个时间轴块（void，需含单个零宽文本子节点保证结构合法） */
export const createTimelineElement = (attrs?: Partial<TimelineAttrs>): TimelineElement => ({
  type: BlockElementType.TIMELINE,
  id: uuidv4(),
  attrs: { ...DEFAULT_TIMELINE_ATTRS(), ...attrs },
  children: [{ text: ZERO_WIDTH_SPACE }],
});

/** 兜底修复非法 attrs，供 normalizeNode 使用 */
export const normalizeTimelineAttrs = (raw: unknown): TimelineAttrs => {
  const a = (raw || {}) as Partial<TimelineAttrs>;
  const width = Number.isFinite(a.width)
    ? Math.min(2000, Math.max(200, Number(a.width)))
    : DEFAULT_TIMELINE_WIDTH;
  const height = Number.isFinite(a.height)
    ? Math.min(2000, Math.max(120, Number(a.height)))
    : DEFAULT_TIMELINE_HEIGHT;
  const items = Array.isArray(a.items)
    ? a.items
        .filter((it): it is TimelineItem => !!it && typeof it.id === 'string')
        .map((it) => ({
          id: it.id,
          title: typeof it.title === 'string' ? it.title : '',
          detail: typeof it.detail === 'string' ? it.detail : '',
          time: typeof it.time === 'string' ? it.time : '',
        }))
    : [];
  return {
    width,
    height,
    direction: a.direction === 'vertical' ? 'vertical' : 'horizontal',
    sideMode: a.sideMode === 'same' ? 'same' : 'alternate',
    // 不允许空数组，保证至少有一个节点可编辑
    items: items.length ? items : [makeTimelineItem()],
  };
};

/**
 * 把新的 attrs 写回节点。
 * match 必须精确到 TIMELINE：Slate 对 Path 类型的 at 会遍历
 * 「祖先 + 自身 + 后代」，宽匹配会把上层块一起改坏。
 */
export const writeTimelineAttrs = (editor: Editor, path: number[], next: TimelineAttrs): void => {
  Transforms.setNodes(editor, { attrs: next } as any, {
    at: path,
    voids: true,
    match: (n) => Element.isElement(n) && (n as any).type === BlockElementType.TIMELINE,
  });
};

/** 更新单个节点的某个字段 */
export const updateTimelineItem = (
  editor: Editor,
  path: number[],
  attrs: TimelineAttrs,
  itemId: string,
  field: keyof Omit<TimelineItem, 'id'>,
  value: string,
): void => {
  writeTimelineAttrs(editor, path, {
    ...attrs,
    items: attrs.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)),
  });
};

/** 在指定位置插入节点（index = 插入后的下标；悬浮中间连接线时中间插入） */
export const insertTimelineItemAt = (
  editor: Editor,
  path: number[],
  attrs: TimelineAttrs,
  index: number,
): void => {
  const items = [...attrs.items];
  const at = Math.min(Math.max(0, index), items.length);
  items.splice(at, 0, makeTimelineItem());
  writeTimelineAttrs(editor, path, { ...attrs, items });
};

/** 删除节点（至少保留一个） */
export const removeTimelineItem = (
  editor: Editor,
  path: number[],
  attrs: TimelineAttrs,
  itemId: string,
): void => {
  const next = attrs.items.filter((it) => it.id !== itemId);
  writeTimelineAttrs(editor, path, {
    ...attrs,
    items: next.length ? next : [makeTimelineItem()],
  });
};
