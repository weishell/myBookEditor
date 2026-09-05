import { Editor, Transforms, type NodeEntry } from 'slate';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import { DEFAULT_CHART_ATTRS, isChartElement } from './chart-utils';

/**
 * 图表块扩展：
 *  - isVoid：整块不可编辑，图表由组件内部 echarts 自绘
 *  - normalizeNode：保证图表块具备合法 attrs 且只有单个零宽文本子节点
 */
export const withChart = (editor: Editor) => {
  const { isVoid, normalizeNode } = editor;

  editor.isVoid = (element) => {
    if (isChartElement(element)) return true;
    return isVoid(element);
  };

  editor.normalizeNode = (entry: NodeEntry) => {
    const [node, path] = entry;
    if (isChartElement(node)) {
      const a = node.attrs || {};
      const meta = DEFAULT_CHART_ATTRS;
      const next = {
        // kind/variant 是图表的「类型身份」，normalize 只做兜底补齐、绝不改写：
        // 缺失时保持原样（不写回柱状图），避免一次误操作就把饼图永久变成柱状图。
        kind: a.kind,
        variant: a.variant,
        title: a.title ?? '',
        description: a.description ?? '',
        data: Array.isArray(a.data) && a.data.length ? a.data : meta.data,
        // 仪表盘字段同步保留，避免 normalize 覆盖时被清空
        gaugeValue: a.gaugeValue,
        gaugeMin: a.gaugeMin,
        gaugeMax: a.gaugeMax,
        gaugeUnit: a.gaugeUnit,
        width: a.width ?? meta.width,
        height: a.height ?? meta.height,
      };
      if (JSON.stringify(next) !== JSON.stringify(a)) {
        Transforms.setNodes(editor, { attrs: next } as any, { at: path, voids: true });
        return;
      }
      if (node.children.length !== 1 || typeof node.children[0]?.text !== 'string') {
        Transforms.removeNodes(editor, { at: path, voids: true });
        Transforms.insertNodes(
          editor,
          {
            type: BlockElementType.CHART,
            id: node.id,
            attrs: next,
            children: [{ text: ZERO_WIDTH_SPACE }],
          } as any,
          { at: path, select: false },
        );
        return;
      }
      if (node.children[0].text !== ZERO_WIDTH_SPACE) {
        Transforms.setNodes(editor, { text: ZERO_WIDTH_SPACE } as any, {
          at: [...path, 0],
          voids: true,
        });
        return;
      }
      return;
    }
    normalizeNode(entry);
  };

  return editor;
};
