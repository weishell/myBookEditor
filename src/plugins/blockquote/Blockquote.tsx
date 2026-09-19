import { useState, useCallback } from 'react';
import { BlockElementType, BlockquoteType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { BlockquoteStatusSelector } from './BlockquoteStatusSelector';
import styles from './Blockquote.module.less';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

export const Blockquote = ({ attributes, children, pluginId, element }: ElementProps) => {
  // 类型解析：新数据直接用 type 字段；旧数据用 status 字段做兼容映射
  const rawType = element?.attrs?.type as string | undefined;
  const rawStatus = element?.attrs?.status as string | undefined;

  let type: BlockquoteType;
  if (rawType && Object.values(BlockquoteType).includes(rawType as BlockquoteType)) {
    // 新格式：直接取 type 字段
    type = rawType as BlockquoteType;
  } else if (rawStatus) {
    // 旧格式兼容映射
    type =
      rawStatus === 'danger'
        ? BlockquoteType.WARNING
        : rawStatus === 'success'
          ? BlockquoteType.TIP
          : rawStatus === 'warning'
            ? BlockquoteType.NOTE
            : rawStatus === 'normal'
              ? BlockquoteType.INFO
              : BlockquoteType.INFO;
  } else {
    type = BlockquoteType.INFO;
  }

  // 类型切换面板：点击左侧竖线展示（类型由 attrs.type 决定四色）
  const [showSelector, setShowSelector] = useState(false);

  const handleStripeClick = useCallback(() => {
    setShowSelector(true);
  }, []);

  const handleSelectorClose = useCallback(() => {
    setShowSelector(false);
  }, []);

  const typeClass =
    type === BlockquoteType.INFO
      ? styles.typeInfo
      : type === BlockquoteType.NOTE
        ? styles.typeNote
        : type === BlockquoteType.WARNING
          ? styles.typeWarning
          : styles.typeTip;

  return (
    <ElementWrapper type={BlockElementType.BLOCKQUOTE} pluginId={pluginId} attrs={element?.attrs}>
      <blockquote
        {...(attributes as React.HTMLAttributes<HTMLQuoteElement>)}
        className={`${styles.blockquote} ${typeClass}`}
        data-type={type}
      >
        <span
          className={styles.blockquoteStripe}
          aria-hidden
          title="点击切换颜色"
          contentEditable={false}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleStripeClick}
        />
        <div className={styles.content}>{children}</div>
      </blockquote>
      {pluginId && showSelector && (
        <BlockquoteStatusSelector
          pluginId={pluginId}
          currentType={type}
          onClose={handleSelectorClose}
        />
      )}
    </ElementWrapper>
  );
};
