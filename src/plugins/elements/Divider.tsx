import { useSelected } from 'slate-react';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import styles from './Divider.module.less';

interface ElementProps {
  attributes: Record<string, unknown>;
  children?: React.ReactNode;
  pluginId?: string;
  element?: Record<string, unknown>;
}

export const Divider = ({ attributes, children, pluginId }: ElementProps) => {
  const isSelected = useSelected();

  return (
    <ElementWrapper type={BlockElementType.DIVIDER} pluginId={pluginId} attributes={attributes}>
      <div
        className={`${styles.hitArea} ${isSelected ? styles.hitAreaSelected : ''}`}
        contentEditable={false}
        suppressContentEditableWarning={true}
      >
        <div className={`${styles.line} ${isSelected ? styles.lineSelected : ''}`} />
      </div>
      {children}
    </ElementWrapper>
  );
};
