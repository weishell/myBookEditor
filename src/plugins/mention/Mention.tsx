import { useMemo } from 'react';
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
  const { isDarkMode } = useTheme();
  const { name, kind } = element.attrs;

  const icon = useMemo(() => {
    if (kind === 'category') return '📁';
    return '📄';
  }, [kind]);

  // 选中 @提及 后调「文字颜色 / 背景色」：mark 落在子文本节点上，
  // 这里取出来覆盖默认的主题色 / 蓝色底，颜色才会真正生效。
  const markStyle = getInlineMarkStyle(element, isDarkMode);

  return (
    <span
      {...attributes}
      className={`${styles.mention} ${selected ? styles.selected : ''}`}
      style={markStyle}
      contentEditable={false}
      data-mention
      data-mention-id={element.id}
    >
      <span className={styles.icon}>{icon}</span>
      <span>@{name}</span>
    </span>
  );
};
