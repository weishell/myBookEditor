import { useMemo } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelected } from 'slate-react';
import type { MentionElement as MentionElementT } from './mention-utils';
import { useTheme } from '@/context/ThemeContext';
import { getInlineMarkStyle } from '@/utils/inline-mark-style';
import styles from './Mention.module.less';

interface MentionProps {
  attributes: Record<string, any>;
  element: MentionElementT;
  readOnly?: boolean;
}

export const Mention = ({ attributes, element }: MentionProps) => {
  const selected = useSelected();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { name, kind, targetId, icon: attrIcon, color } = element.attrs;

  const icon = useMemo(() => {
    if (attrIcon) return attrIcon;
    if (kind === 'category') return '📁';
    if (kind === 'tag') return '#';
    return '📄';
  }, [attrIcon, kind]);

  // 老文档里的艾特可能没存 url，这里按类型兜底拼出跳转地址
  const url = useMemo(() => {
    if (element.attrs.url) return element.attrs.url;
    if (kind === 'category') return `/category/${encodeURIComponent(targetId)}`;
    if (kind === 'tag') return `/tag/${encodeURIComponent(targetId)}`;
    return `/article/${encodeURIComponent(targetId)}`;
  }, [element.attrs.url, kind, targetId]);

  // 选中 @提及 后调「文字颜色 / 背景色」：mark 落在子文本节点上，
  // 这里取出来覆盖默认的主题色 / 蓝色底，颜色才会真正生效。
  const markStyle = getInlineMarkStyle(element, isDarkMode);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(url);
  };

  return (
    <span
      {...attributes}
      className={`${styles.mention} ${selected ? styles.selected : ''}`}
      style={markStyle}
      contentEditable={false}
      data-mention
      data-mention-id={element.id}
      onClick={handleClick}
    >
      <span className={styles.icon} style={color ? { color } : undefined}>
        {icon}
      </span>
      <span>@{name}</span>
    </span>
  );
};
