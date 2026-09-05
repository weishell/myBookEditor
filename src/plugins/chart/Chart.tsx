import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { Transforms } from 'slate';
import { ReactEditor, useSelected, useSlateStatic } from 'slate-react';
import { ElementWrapper } from '../element-wrapper/ElementWrapper';
import { BlockElementType } from '@/enums';
import { useTheme } from '@/context/ThemeContext';
import ResizeHandle from '../resize-handle/ResizeHandle';
import { ChartConfigDialog } from './ChartConfigDialog';
import { buildChartOption, ChartKind, type ChartAttrs } from './chart-utils';
import styles from './Chart.module.less';

interface ChartProps {
  attributes: any;
  children?: React.ReactNode;
  pluginId: string;
  element: { attrs: ChartAttrs } & Record<string, any>;
}

export const Chart: React.FC<ChartProps> = ({ attributes, children, pluginId, element }) => {
  const editor = useSlateStatic();
  const isSelected = useSelected();
  const { attrs } = element;
  const { isDarkMode, themeColor } = useTheme();

  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const [editing, setEditing] = useState(false);

  // 缩放：拖动期间用本地尺寸预览，松开(mouseup)才写回 attrs
  const [dragSize, setDragSize] = useState<{ w: number; h: number } | null>(null);
  const draggingRef = useRef(false);
  const elementRef = useRef(element);
  elementRef.current = element;
  const editorRef = useRef(editor);
  editorRef.current = editor;

  const effW = dragSize?.w ?? attrs?.width ?? 720;
  const effH = dragSize?.h ?? attrs?.height ?? 320;

  // 仅当「图形配置」变化时才需要重建 option；宽高（缩放/自适应）变化不触发重建，
  // 否则拖一下手柄就重载 echarts，词云重新随机排版、柱状图重播动画，看起来"整个图都变了"。
  const configRef = useRef(attrs);
  configRef.current = attrs;
  const configKey = useMemo(
    () =>
      JSON.stringify([
        attrs.kind,
        attrs.variant,
        attrs.title,
        attrs.description,
        attrs.data,
        // 仪表盘数值变化也要触发重建（指针补间动画到新位置）
        attrs.gaugeValue,
        attrs.gaugeMin,
        attrs.gaugeMax,
        attrs.gaugeUnit,
      ]),
    [attrs],
  );

  const accent = isDarkMode ? '#5b8ff9' : themeColor;

  // 只在配置/主题变化时重建图表。仪表盘用 merge 模式(setOption 不置空)，
  // 以便指针从旧值平滑补间动画到新值，而不是整体重绘直接跳变。
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const isGauge = configRef.current.kind === ChartKind.GAUGE;
    if (!chartRef.current) {
      chartRef.current = echarts.init(el);
    }
    chartRef.current.setOption(
      buildChartOption(configRef.current, { accent, isDarkMode }),
      !isGauge,
    );
  }, [configKey, accent, isDarkMode]);

  // 尺寸自适应：容器变化时 resize 画布。拖动缩放手柄期间先不 relayout，
  // 让已渲染的图形随 CSS 一起伸缩（内容、布局不变），松手再清晰重建一次。
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (draggingRef.current) return;
      chartRef.current?.resize();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(
    () => () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    },
    [],
  );

  // 松开鼠标：把拖动得到的尺寸写回 attrs
  useEffect(() => {
    const onUp = () => {
      if (!draggingRef.current || !dragSize) return;
      draggingRef.current = false;
      const cur = elementRef.current;
      try {
        const path = ReactEditor.findPath(editorRef.current, cur as any);
        if (path) {
          const w = Math.min(Math.max(Math.round(dragSize.w), 320), 1200);
          const h = Math.min(Math.max(Math.round(dragSize.h), 160), 800);
          Transforms.setNodes(
            editorRef.current,
            { attrs: { ...cur.attrs, width: w, height: h } } as any,
            { at: path },
          );
        }
      } catch {
        /* ignore */
      }
      setDragSize(null);
    };
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
  }, [dragSize]);

  const getPath = useCallback(() => {
    try {
      return ReactEditor.findPath(editor, element as any);
    } catch {
      return null;
    }
  }, [editor, element]);

  const handleConfirm = useCallback(
    (next: ChartAttrs) => {
      const path = getPath();
      if (path) {
        Transforms.setNodes(editor, { attrs: next } as any, { at: path });
      }
      setEditing(false);
    },
    [editor, getPath],
  );

  const bounds = cardRef.current?.getBoundingClientRect();

  return (
    <ElementWrapper type={BlockElementType.CHART} pluginId={pluginId} attributes={attributes}>
      <div
        ref={cardRef}
        className={styles.card}
        style={{
          width: `min(${effW}px, 100%)`,
          aspectRatio: `${effW} / ${effH}`,
          borderColor: isDarkMode ? '#2b3240' : 'rgba(31,35,41,0.14)',
        }}
        contentEditable={false}
        suppressContentEditableWarning={true}
      >
        <div className={styles.chartBox}>
          <div ref={canvasRef} className={styles.chartCanvas} />
        </div>
        <button
          className={styles.editBtn}
          title="编辑图表"
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
          </svg>
        </button>

        {/* 选中时显示缩放手柄 */}
        {isSelected && bounds && (
          <ResizeHandle
            bounds={bounds}
            aspectRatio={effW / effH}
            initialWidth={effW}
            initialHeight={effH}
            onResize={(w, h) => {
              draggingRef.current = true;
              setDragSize({ w, h });
            }}
          />
        )}
      </div>

      {children}

      {editing &&
        createPortal(
          <ChartConfigDialog
            kind={attrs.kind}
            variant={attrs.variant}
            initial={attrs}
            onConfirm={handleConfirm}
            onCancel={() => setEditing(false)}
          />,
          document.body,
        )}
    </ElementWrapper>
  );
};
