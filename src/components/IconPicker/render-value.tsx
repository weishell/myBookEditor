// 表情图标的最小类型 + 渲染工具。
//
// 单独成文件的原因：IconPicker 本体静态依赖 @emoji-mart 的数据包（约 500 kB），
// 而 HeadingTitle 这类地方只需要「把已选的 emoji 画出来」，不该为选择器付体积。
// 需要选择器的地方用 React.lazy(() => import('@/components/IconPicker'))。
import type { ReactNode } from 'react';

export type IconKind = 'emoji';

export interface IconPickerValue {
  kind: 'emoji';
  /** emoji 字符（native） */
  value: string;
}

/** 把 attrs 里存的图标值渲染成节点（空值返回 null，由调用方决定兜底） */
export function renderIconValue(val: IconPickerValue | null | undefined, size = 20): ReactNode {
  if (!val || val.kind !== 'emoji' || !val.value) return null;
  return (
    <span
      style={{
        fontSize: Math.round(size * 1.1),
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {val.value}
    </span>
  );
}
