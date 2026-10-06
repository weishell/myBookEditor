import React from 'react';
import { useSelected } from 'slate-react';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { getLilist, getLilistPrefixWidth, LilistPrefix } from '@/plugins/lilist';
import styles from './Heading.module.less';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

// H1-H9 样式配置，参考飞书文档编辑器
const HEADING_STYLES: Record<
  number,
  { fontSize: string; lineHeight: number; marginBottom: number }
> = {
  1: { fontSize: '32px', lineHeight: 1.4, marginBottom: 16 },
  2: { fontSize: '24px', lineHeight: 1.5, marginBottom: 14 },
  3: { fontSize: '20px', lineHeight: 1.5, marginBottom: 12 },
  4: { fontSize: '18px', lineHeight: 1.6, marginBottom: 10 },
  5: { fontSize: '16px', lineHeight: 1.6, marginBottom: 8 },
  6: { fontSize: '14px', lineHeight: 1.6, marginBottom: 8 },
  7: { fontSize: '13px', lineHeight: 1.7, marginBottom: 6 },
  8: { fontSize: '12px', lineHeight: 1.7, marginBottom: 6 },
  9: { fontSize: '11px', lineHeight: 1.7, marginBottom: 6 },
};

export const Heading = ({ attributes, children, pluginId, element }: ElementProps) => {
  const isSelected = useSelected();
  const level = element?.attrs?.level || 1;
  const style = HEADING_STYLES[level] || HEADING_STYLES[1];

  const isEmpty = element?.children?.[0]?.text === '' || element?.children?.[0]?.text === undefined;
  const hasLilist = !!getLilist(element);

  // 列表项悬挂缩进：左侧留出「序号槽位」，换行后的文字与首行文字左对齐，
  // 而不是回到块左缘、压到序号下面（槽位宽度与 LilistPrefix 的占位宽度同源）。
  const listStyle = hasLilist
    ? {
        paddingLeft: `calc(${getLilistPrefixWidth(element)} + 6px)`,
        textIndent: `calc(-1 * (${getLilistPrefixWidth(element)} + 6px))`,
      }
    : undefined;

  return (
    <ElementWrapper
      type={BlockElementType.HEADING}
      pluginId={pluginId}
      attrs={element?.attrs}
      isEmpty={isEmpty}
    >
      <h1
        {...(attributes as React.HTMLAttributes<HTMLHeadingElement>)}
        className={`${styles.heading} ${isEmpty ? styles.empty : ''}`}
        style={{
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          marginBottom: style.marginBottom,
          ...listStyle,
        }}
      >
        {isEmpty && isSelected && (
          <span
            className={styles.placeholder}
            contentEditable={false}
            suppressContentEditableWarning={true}
          >
            H{level}
          </span>
        )}
        {hasLilist && <LilistPrefix element={element} />}
        {children}
      </h1>
    </ElementWrapper>
  );
};
