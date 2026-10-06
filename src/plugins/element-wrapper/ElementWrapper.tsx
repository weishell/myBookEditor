import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BlockElementType } from '@/enums';
import { INDENT_PX } from '@/utils/indent';
import { useWholeBlockSelected } from '@/utils/whole-block-selection';

interface ElementWrapperProps {
  type: BlockElementType;
  pluginId?: string;
  attrs?: any;
  isEmpty?: boolean;
  attributes?: Record<string, unknown>;
  className?: string;
  children: React.ReactNode;
}

/**
 * 选中描边要「贴身」的类型：这些 void 块的视觉内容通常比块本身窄
 * （图片居中 / 附件卡片 / 流程图…），若把描边画在整行 wrapper 上，
 * 会圈出一大片空白。改为测量插件标记的视觉根（data-visual-root），
 * 把描边画成贴合内容的覆盖层。
 * 分割线本身就是通栏的，不需要贴身；表格/提示块/代码块是通栏容器，也不需要。
 */
const FIT_OUTLINE_TYPES = new Set<string>([
  BlockElementType.IMAGE_BLOCK,
  BlockElementType.FILE_BLOCK,
  BlockElementType.VIDEO_BLOCK,
  BlockElementType.DRAWIO,
  BlockElementType.COUNTDOWN,
  BlockElementType.CALENDAR,
  BlockElementType.CHART,
  BlockElementType.EMBED,
  BlockElementType.TIMELINE,
  BlockElementType.DRAWBOARD,
]);

interface FitBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const ElementWrapper = ({
  type,
  pluginId,
  attrs,
  isEmpty,
  attributes,
  className,
  children,
}: ElementWrapperProps) => {
  // 「整块选中」：非文本块 / 表格 / 提示块等复杂组件整体被选中时，
  // 统一在包裹层打标（全局样式：选中描边 + 隐藏内部文字原生选区）。
  // 普通段落/标题等类型永不命中（判定按类型白名单）。
  const isWholeSelected = useWholeBlockSelected();
  // void 块用「贴身描边」：描边画到视觉根上，而不是整行 wrapper
  const wantsFitOutline = FIT_OUTLINE_TYPES.has(String(type));

  const rawAttrs = (attributes as Record<string, any>) || {};
  const slateRef = rawAttrs.ref;
  const restAttributes: Record<string, unknown> = { ...rawAttrs };
  delete restAttributes.ref;

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [fitBox, setFitBox] = useState<FitBox | null>(null);

  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      wrapRef.current = node;
      if (!slateRef) return;
      if (typeof slateRef === 'function') {
        slateRef(node);
      } else if (slateRef && typeof slateRef === 'object' && 'current' in slateRef) {
        (slateRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    [slateRef],
  );

  // 测量视觉根相对 wrapper 的偏移，供贴身描边定位。
  // 视觉根由插件用 data-visual-root 标记；未标记时退化为第一个子元素
  // （此时描边位置 = 旧行为，不会更差）。
  const measureFit = useCallback(() => {
    const node = wrapRef.current;
    if (!node) return;
    const root =
      node.querySelector<HTMLElement>('[data-visual-root]') ??
      (node.firstElementChild as HTMLElement | null);
    if (!root) {
      setFitBox(null);
      return;
    }
    const wrapRect = node.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    // 尚未布局完成（宽高为 0）时不画，避免描边缩成一点
    if (rootRect.width === 0 && rootRect.height === 0) {
      setFitBox(null);
      return;
    }
    setFitBox({
      left: rootRect.left - wrapRect.left,
      top: rootRect.top - wrapRect.top,
      width: rootRect.width,
      height: rootRect.height,
    });
  }, []);

  // 选中态开启 / 内容尺寸变化（图片加载、拖拽改尺寸、media 换层…）时重测。
  // wrapper 的 ResizeObserver 兜底覆盖「视觉根节点被整体换掉」的场景
  // （如 media 卡片层/文本层切换会改变 wrapper 高度）。
  useEffect(() => {
    if (!wantsFitOutline || !isWholeSelected) {
      setFitBox(null);
      return;
    }
    measureFit();
    const raf = requestAnimationFrame(measureFit);
    const node = wrapRef.current;
    const ro =
      typeof ResizeObserver !== 'undefined' && node ? new ResizeObserver(measureFit) : null;
    if (ro && node) ro.observe(node);
    window.addEventListener('resize', measureFit);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener('resize', measureFit);
    };
  }, [wantsFitOutline, isWholeSelected, measureFit]);

  // 缩进样式
  const indent = attrs?.indent ?? 0;
  const indentStyle = indent > 0 ? { marginLeft: `${indent * INDENT_PX}px` } : undefined;

  // 对齐样式（对齐文本类块内容；非本文块无 align 字段，不生效）
  const align = attrs?.align;
  const alignStyle =
    align && ['left', 'center', 'right'].includes(align) ? { textAlign: align } : undefined;

  // 字体样式（插件层 attrs.fontFamily，覆盖全局层，被 text 层 mark 覆盖）
  const fontFamily = attrs?.fontFamily;
  const fontStyle = fontFamily && fontFamily !== 'inherit' ? { fontFamily } : undefined;

  return (
    <div
      ref={handleRef}
      {...restAttributes}
      data-plugin-id={pluginId}
      data-block-type={type}
      data-block-attrs={attrs ? JSON.stringify(attrs) : undefined}
      data-empty={isEmpty ? 'true' : undefined}
      data-whole-selected={isWholeSelected ? 'true' : undefined}
      data-fit-outline={wantsFitOutline && isWholeSelected ? 'true' : undefined}
      className={className}
      style={{ position: 'relative', ...indentStyle, ...fontStyle, ...alignStyle }}
    >
      {children}
      {/* 贴身选中描边：与视觉根边框重合成「一层」框（不再外扩留缝） */}
      {wantsFitOutline && isWholeSelected && fitBox && (
        <div
          aria-hidden
          className="whole-block-fit-outline"
          style={{
            left: fitBox.left,
            top: fitBox.top,
            width: fitBox.width,
            height: fitBox.height,
          }}
        />
      )}
    </div>
  );
};
