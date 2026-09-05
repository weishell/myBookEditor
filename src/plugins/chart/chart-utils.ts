import * as echarts from 'echarts';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import { v4 as uuidv4 } from 'uuid';

/**
 * 图表大类（kind）。每一种大类下还有子类型（variant，即 attrs 里的"配置子类 type"），
 * 用于细分柱状图的方向/堆叠、饼图的样式等。后续每个大类可继续扩展子类型。
 */
export const ChartKind = {
  BAR: 'bar',
  PIE: 'pie',
  LINE: 'line',
  SCATTER: 'scatter',
  WORDCLOUD: 'wordcloud',
  GAUGE: 'gauge',
} as const;

export type ChartKind = (typeof ChartKind)[keyof typeof ChartKind];

/** 数据行为：图形的每个扇区/柱子/词条 */
export interface ChartDataRow {
  name: string;
  value: number;
}

/** 图表块 attrs：kind(大类) + variant(子类 type) 都放这里，便于后续扩展 theme/colors/data/动画 */
export interface ChartAttrs {
  kind: ChartKind;
  /** 子类 type，如柱状图的 vertical/horizontal/stack，饼图的 donut/rose/plain */
  variant: string;
  /** 标题文字 */
  title: string;
  /** 描述文字（表格/说明） */
  description: string;
  /** 数据 */
  data: ChartDataRow[];
  width: number;
  height: number;
  /** 仪表盘：当前值（指针指向，带动画） */
  gaugeValue?: number;
  /** 仪表盘：量程最小值 */
  gaugeMin?: number;
  /** 仪表盘：量程最大值 */
  gaugeMax?: number;
  /** 仪表盘：数值单位（如 %、km/h、℃） */
  gaugeUnit?: string;
}

export interface ChartElement {
  type: typeof BlockElementType.CHART;
  id?: string;
  attrs: ChartAttrs;
  children: [{ text: string }];
}

/** 子类型元信息：label 用于展示 */
export interface ChartVariantMeta {
  type: string;
  label: string;
}

/** 大类元信息：name 作为 kind 值，label/desc 用于类型选择弹框，variants 是子类型列表 */
export interface ChartKindMeta {
  kind: ChartKind;
  label: string;
  desc: string;
  icon: string;
  variants: ChartVariantMeta[];
  /** 该大类的默认数据 */
  defaultData: ChartDataRow[];
}

const DATA = {
  sales: [
    { name: '一月', value: 320 },
    { name: '二月', value: 210 },
    { name: '三月', value: 260 },
    { name: '四月', value: 180 },
    { name: '五月', value: 340 },
  ],
  share: [
    { name: '直接访问', value: 335 },
    { name: '搜索引擎', value: 246 },
    { name: '邮件营销', value: 148 },
    { name: '联盟广告', value: 102 },
  ],
  words: [
    { name: 'ECharts', value: 10000 },
    { name: '数据可视化', value: 7200 },
    { name: '柱状图', value: 6800 },
    { name: '饼图', value: 6100 },
    { name: '折线图', value: 5400 },
    { name: '词云', value: 4900 },
    { name: '散点图', value: 4300 },
    { name: '主题色', value: 3800 },
    { name: '编辑器', value: 3400 },
    { name: '飞书', value: 2900 },
  ],
};

/** 大类注册表：新增"折线/散点"等大类时在此扩展，并补 variants 子类型 */
export const CHART_KINDS: ChartKindMeta[] = [
  {
    kind: ChartKind.BAR,
    label: '柱状图',
    desc: '用柱子对比各分类的数据大小',
    icon: '📊',
    variants: [
      { type: 'vertical', label: '纵向柱状图' },
      { type: 'horizontal', label: '横向柱状图' },
      { type: 'stack', label: '堆叠柱状图' },
    ],
    defaultData: [...DATA.sales],
  },
  {
    kind: ChartKind.PIE,
    label: '饼图',
    desc: '用扇区展示整体中各部分的占比',
    icon: '🍩',
    variants: [
      { type: 'donut', label: '环形图' },
      { type: 'rose', label: '玫瑰图' },
      { type: 'plain', label: '普通饼图' },
    ],
    defaultData: [...DATA.share],
  },
  {
    kind: ChartKind.WORDCLOUD,
    label: '词云',
    desc: '按权重展示关键词的分布形态',
    icon: '☁️',
    variants: [{ type: 'plain', label: '普通词云' }],
    defaultData: [...DATA.words],
  },
  {
    kind: ChartKind.GAUGE,
    label: '仪表盘',
    desc: '指针 + 数字展示单项指标当前值',
    icon: '🧭',
    variants: [{ type: 'plain', label: '半圆仪表盘' }],
    defaultData: [{ name: '当前值', value: 82 }],
  },
];

export const getKindMeta = (kind?: ChartKind): ChartKindMeta | undefined =>
  CHART_KINDS.find((k) => k.kind === kind);

export const getVariantMeta = (kind?: ChartKind, variant?: string): ChartVariantMeta | undefined =>
  getKindMeta(kind)?.variants.find((v) => v.type === variant);

export const DEFAULT_CHART_ATTRS: ChartAttrs = {
  kind: ChartKind.BAR,
  variant: 'vertical',
  title: '销售趋势',
  description: '近五个月销售额',
  data: [...CHART_KINDS[0].defaultData],
  width: 720,
  height: 320,
};

export const isChartElement = (n: unknown): n is ChartElement =>
  !!n && typeof n === 'object' && (n as { type?: unknown }).type === BlockElementType.CHART;

/** 创建图表块节点（void，含单个零宽文本子节点） */
export const createChartElement = (attrs?: Partial<ChartAttrs>): ChartElement => {
  const kind = (attrs?.kind as ChartKind) || DEFAULT_CHART_ATTRS.kind;
  const kindMeta = getKindMeta(kind);
  const variant = attrs?.variant || kindMeta?.variants[0]?.type || 'plain';
  const isGauge = kind === ChartKind.GAUGE;
  const base: ChartAttrs = {
    kind,
    variant,
    title: attrs?.title ?? DEFAULT_CHART_ATTRS.title,
    description: attrs?.description ?? '',
    data: attrs?.data?.length ? attrs.data : (kindMeta?.defaultData ?? []),
    width: attrs?.width ?? DEFAULT_CHART_ATTRS.width,
    height: attrs?.height ?? DEFAULT_CHART_ATTRS.height,
  };
  // 仪表盘：单独缺省当前值/量程/单位
  if (isGauge) {
    base.gaugeValue = attrs?.gaugeValue ?? 82;
    base.gaugeMin = attrs?.gaugeMin ?? 0;
    base.gaugeMax = attrs?.gaugeMax ?? 100;
    base.gaugeUnit = attrs?.gaugeUnit ?? '%';
  }
  return {
    type: BlockElementType.CHART,
    id: uuidv4(),
    attrs: base,
    children: [{ text: ZERO_WIDTH_SPACE }],
  };
};

/** 基于主题色生成一组协调的图表色板 */
const buildPalette = (accent: string): string[] => [
  accent,
  '#f6bd16',
  '#5fc09a',
  '#8d7bf0',
  '#f2766e',
  '#4aa3f2',
  '#e8a64c',
];

// ---------------------------------------------------------------------------
// ECharts option 构建
// ---------------------------------------------------------------------------

/**
 * 根据 attrs 构建对应的 echarts option。
 * 目前按 kind + variant 分支出柱状/饼图/词云；后续主题、颜色、坐标、数据来源
 * （写死 xy / JSON / 接口 / WebSocket）都会在这里消费 attrs 的扩展字段。
 */
export const buildChartOption = (
  attrs: ChartAttrs,
  opts: { accent: string; isDarkMode: boolean },
): echarts.EChartsOption => {
  const textColor = opts.isDarkMode ? '#c8cdd6' : '#4b5563';
  const subTextColor = opts.isDarkMode ? '#8b95a5' : '#9ca3af';
  const palette = buildPalette(opts.accent);

  switch (attrs.kind) {
    case ChartKind.PIE:
      return buildPieOption(attrs, palette, textColor);
    case ChartKind.WORDCLOUD:
      return buildWordCloudOption(attrs, palette, textColor);
    case ChartKind.GAUGE:
      return buildGaugeOption(attrs, subTextColor);
    case ChartKind.BAR:
      return buildBarOption(attrs, palette, textColor, subTextColor);
    default:
      // kind 缺失/非法时禁止静默按「柱状图」渲染，避免拖拽等误操作把饼图伪装成柱状图
      return buildUnsupportedOption(attrs, textColor, subTextColor);
  }
};

const buildUnsupportedOption = (
  attrs: ChartAttrs,
  textColor: string,
  subTextColor: string,
): echarts.EChartsOption => ({
  title: commonTitle(attrs, textColor, subTextColor),
  graphic: {
    type: 'text',
    left: 'center',
    top: 'middle',
    style: {
      text: '图表类型异常，请重新编辑配置',
      fill: subTextColor,
      fontSize: 13,
    },
  },
});

const commonTitle = (attrs: ChartAttrs, textColor: string, subTextColor: string) => ({
  text: attrs.title || undefined,
  subtext: attrs.description || undefined,
  left: 'center',
  textStyle: { color: textColor, fontSize: 15, fontWeight: 600 as const },
  subtextStyle: { color: subTextColor, fontSize: 12 },
});

const buildBarOption = (
  attrs: ChartAttrs,
  palette: string[],
  textColor: string,
  subTextColor: string,
): echarts.EChartsOption => {
  const isHorizontal = attrs.variant === 'horizontal';
  const isStack = attrs.variant === 'stack';
  const rows = attrs.data?.length ? attrs.data : DEFAULT_CHART_ATTRS.data;

  if (isStack) {
    // 堆叠：预览阶段把单组数据拆成两个系列演示堆叠效果
    return {
      title: commonTitle(attrs, textColor, subTextColor),
      tooltip: { trigger: 'axis' },
      legend: { data: ['A', 'B'], top: 4, textStyle: { color: textColor } },
      xAxis: {
        type: 'category',
        data: rows.map((r) => r.name),
        axisLine: { lineStyle: { color: subTextColor } },
        axisLabel: { color: textColor },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: subTextColor } },
        axisLabel: { color: textColor },
      },
      series: [
        {
          type: 'bar',
          name: 'A',
          stack: 'total',
          itemStyle: { color: palette[0] },
          data: rows.map((r) => r.value),
        },
        {
          type: 'bar',
          name: 'B',
          stack: 'total',
          itemStyle: { color: palette[1] },
          data: rows.map((r) => Math.round(r.value * 0.6)),
        },
      ],
    };
  }

  return {
    title: commonTitle(attrs, textColor, subTextColor),
    tooltip: { trigger: 'axis' },
    grid: { top: isHorizontal ? 48 : 56, left: 8, right: 16, bottom: 8, containLabel: true },
    xAxis: {
      type: isHorizontal ? 'value' : 'category',
      data: isHorizontal ? undefined : rows.map((r) => r.name),
      axisLine: { lineStyle: { color: subTextColor } },
      axisLabel: { color: textColor },
      splitLine: isHorizontal ? { lineStyle: { color: subTextColor } } : undefined,
    },
    yAxis: {
      type: isHorizontal ? 'category' : 'value',
      data: isHorizontal ? rows.map((r) => r.name) : undefined,
      axisLabel: { color: textColor },
      splitLine: isHorizontal ? undefined : { lineStyle: { color: subTextColor } },
    },
    series: [
      {
        type: 'bar',
        name: '数据',
        barMaxWidth: 34,
        itemStyle: {
          color: palette[0],
          borderRadius: isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
        },
        data: rows.map((r) => r.value),
      },
    ],
  };
};

const buildPieOption = (
  attrs: ChartAttrs,
  palette: string[],
  textColor: string,
): echarts.EChartsOption => {
  const rows = attrs.data?.length ? attrs.data : DEFAULT_CHART_ATTRS.data;
  const isDonut = attrs.variant === 'donut';
  const isRose = attrs.variant === 'rose';
  return {
    title: commonTitle(attrs, textColor, '#9ca3af'),
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: {
      orient: 'vertical',
      right: 8,
      top: 'middle',
      textStyle: { color: textColor },
      itemGap: 10,
    },
    series: [
      {
        type: 'pie',
        radius: isDonut ? ['42%', '66%'] : isRose ? ['18%', '66%'] : '66%',
        roseType: isRose ? 'radius' : undefined,
        center: ['36%', '54%'],
        itemStyle: { borderColor: 'transparent', borderWidth: 1 },
        label: { color: isDonut ? '#fff' : textColor, fontSize: 12 },
        labelLine: { length: 12, length2: 10 },
        data: rows.map((r, i) => ({
          name: r.name,
          value: r.value,
          itemStyle: { color: palette[i % palette.length] },
        })),
      },
    ],
  };
};

const buildWordCloudOption = (
  attrs: ChartAttrs,
  palette: string[],
  textColor: string,
): echarts.EChartsOption => {
  const rows = attrs.data?.length ? attrs.data : DEFAULT_CHART_ATTRS.data;
  return {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'wordCloud',
        gridSize: 8,
        sizeRange: [14, 42],
        rotationRange: [0, 0],
        textStyle: {
          color: () => palette[Math.floor(Math.random() * palette.length)],
        },
        data: rows.map((r) => ({ name: r.name, value: r.value })),
      } as any,
    ],
    textStyle: { color: textColor },
  } as echarts.EChartsOption;
};

/**
 * 仪表盘：半圆弧 + 三色刻度段 + 白色指针 + 数字。value 用 detail 同步修改，
 * 指针与数字默认带补间动画（初始从起点滑到目标；改数值后平滑移动而非跳变）。
 */
const buildGaugeOption = (attrs: ChartAttrs, subTextColor: string): echarts.EChartsOption => {
  const min = attrs.gaugeMin ?? 0;
  const max = attrs.gaugeMax ?? 100;
  const unit = attrs.gaugeUnit ?? '%';
  let value = attrs.gaugeValue ?? 0;
  if (Number.isNaN(value)) value = 0;
  value = Math.min(Math.max(value, min), max);

  // 色段按占比划分：0~40% 蓝（安全）、40~80% 青（注意）、80~100% 红（危险）
  const zones =
    max > min
      ? [
          [0.4, '#0ea5e9'],
          [0.8, '#06b6d4'],
          [1, '#f87171'],
        ]
      : [[1, '#0ea5e9']];

  return {
    title: {
      show: false,
    },
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min,
        max,
        radius: '100%',
        center: ['50%', '82%'],
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 14,
            color: zones as unknown as [number, string][],
          },
        },
        pointer: {
          icon: 'arrow',
          length: '60%',
          width: 5,
          itemStyle: { color: '#ffffff', shadowColor: 'rgba(0,0,0,0.25)', shadowBlur: 6 },
        },
        anchor: {
          show: true,
          size: 8,
          itemStyle: {
            color: '#ffffff',
            borderColor: subTextColor,
            borderWidth: 1,
            shadowColor: 'rgba(0,0,0,0.3)',
            shadowBlur: 6,
          },
        },
        axisTick: {
          distance: -16,
          length: 5,
          splitNumber: 2,
          lineStyle: { color: 'rgba(255,255,255,0.5)', width: 1 },
        },
        splitLine: {
          distance: -22,
          length: 12,
          lineStyle: { color: 'rgba(255,255,255,0.85)', width: 2 },
        },
        axisLabel: {
          distance: 16,
          color: subTextColor,
          fontSize: 11,
        },
        progress: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '26%'],
          formatter: (v: unknown) => `${Math.round(Number(v))}${unit}`,
          color: '#ffffff',
          fontSize: 26,
          fontWeight: 700,
        },
        data: [{ value, name: '' }],
        // 指针 + 数字的补间动画：初值从起点滑到目标，改值后平滑过渡
        animation: true,
        animationDuration: 900,
        animationEasing: 'quadraticOut',
        animationDurationUpdate: 900,
        animationEasingUpdate: 'quadraticOut',
        silent: true,
      } as any,
    ],
  };
};
