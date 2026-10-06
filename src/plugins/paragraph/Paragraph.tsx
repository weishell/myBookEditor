import React from 'react';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { getLilist, getLilistPrefixWidth, LilistPrefix } from '@/plugins/lilist';
import styles from './Paragraph.module.less';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

export const Paragraph = ({ attributes, children, pluginId, element }: ElementProps) => {
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
      type={BlockElementType.PARAGRAPH}
      pluginId={pluginId}
      attrs={element?.attrs}
      isEmpty={isEmpty}
    >
      <p
        {...(attributes as React.HTMLAttributes<HTMLParagraphElement>)}
        className={styles.paragraph}
        style={listStyle}
      >
        {hasLilist && <LilistPrefix element={element} />}
        {children}
      </p>
    </ElementWrapper>
  );
};
