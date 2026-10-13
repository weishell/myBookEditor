// 块级视觉插件通用的对齐工具（图表 / 视频 / 文件 / 内嵌网页 / 画板 / 流程图 / 时间轴）。
//
// 设计：
//  - 对齐状态写回 Slate attrs.align: 'left' | 'center' | 'right'（默认 left）。
//  - 渲染层在 ElementWrapper 内套一个 flex wrapper div，
//    通过 justify-content 让视觉根（data-visual-root 子元素）整体左/居中/居右。
//  - 这是给 Image / MediaBlock 同款方案的复用：它们各自维护一份 wrapper+按钮，
//    这里把"对齐"按钮做成单源，工具条样式由各插件自己定义（按钮外观跟现有 toolbar 保持一致）。

import { useCallback, useMemo } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { AlignIcon } from '@/components/AlignIndentPanel';

export type BlockAlign = 'left' | 'center' | 'right';

/**
 * align → flex 容器的 justify-content（用于 Chart/Embed 这类容器内只一个视觉根的场景）。
 * 父容器用 flex row，justify-content 决定 row 内视觉根的左/居中/右。
 */
export const alignToJustify = (
  align: BlockAlign | undefined,
): 'flex-start' | 'center' | 'flex-end' =>
  align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';

/**
 * align → flex item 的 align-self（用于 Drawio/Drawboard/Timeline 这类
 * wrapper 是 flex column、需要让视觉根在水平交叉轴上做对齐、且不能影响其他子节点堆叠的场景）。
 *
 * - left  → align-self: flex-start
 * - center → align-self: center
 * - right → align-self: flex-end
 *
 * align-self 只对当前 item 生效，不影响 sibling 子节点（descriptionArea 等仍通栏）。
 */
export const alignToAlignSelf = (
  align: BlockAlign | undefined,
): 'flex-start' | 'center' | 'flex-end' =>
  align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';

/** 把任意值规整成 left/center/right（缺省视为 left） */
export const normalizeAlign = (v: unknown): BlockAlign =>
  v === 'center' || v === 'right' ? v : 'left';

interface UseBlockAlignOptions {
  editor: ReturnType<typeof useSlateStatic>;
  element: { attrs?: Record<string, any> } & Record<string, any>;
  /** 允许修改的字段集合：从 document.attrs 里读 + 对齐写。 */
  attrsRef: React.MutableRefObject<Record<string, any>>;
}

/** 提供对齐当前值 + 切换方法。各插件不再各自写 setNodes。 */
export const useBlockAlign = ({ editor, element, attrsRef }: UseBlockAlignOptions) => {
  const align = normalizeAlign(element?.attrs?.align);
  const setAlign = useCallback(
    (next: BlockAlign) => {
      try {
        const path = ReactEditor.findPath(editor, element as any);
        if (!path) return;
        Transforms.setNodes(editor, { attrs: { ...attrsRef.current, align: next } } as any, {
          at: path,
        });
      } catch {
        /* 节点被删除 / 文档不在选中态时忽略 */
      }
    },
    [editor, element, attrsRef],
  );
  return useMemo(() => ({ align, setAlign }), [align, setAlign]);
};

interface BlockAlignButtonsProps {
  align: BlockAlign;
  onAlign: (next: BlockAlign) => void;
  /** 按钮的 className（active / 默认两种），由消费方传入与自身 toolbar 视觉统一 */
  btnClass: string;
  btnActiveClass: string;
  size?: number;
}

/** 三个对齐按钮：左 / 居中 / 右。配套 setAlign 用。 */
export const BlockAlignButtons = ({
  align,
  onAlign,
  btnClass,
  btnActiveClass,
  size = 16,
}: BlockAlignButtonsProps) => {
  const buttons: { value: BlockAlign; titleKey: string }[] = [
    { value: 'left', titleKey: 'alignIndent.left' },
    { value: 'center', titleKey: 'alignIndent.center' },
    { value: 'right', titleKey: 'alignIndent.right' },
  ];
  return (
    <>
      {buttons.map((b) => (
        <button
          key={b.value}
          type="button"
          title={b.titleKey}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            onAlign(b.value);
          }}
          className={align === b.value ? btnActiveClass : btnClass}
        >
          <AlignIcon align={b.value} active={align === b.value} size={size} />
        </button>
      ))}
    </>
  );
};
