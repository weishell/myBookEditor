import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import styles from './Divider.module.less';

interface ElementProps {
  attributes: Record<string, unknown>;
  pluginId?: string;
}

export const Divider = ({ attributes, pluginId }: ElementProps) => (
  <ElementWrapper type={BlockElementType.DIVIDER} pluginId={pluginId}>
    <div
      {...(attributes as React.HTMLAttributes<HTMLDivElement>)}
      className={styles.divider}
      contentEditable={false}
      suppressContentEditableWarning={true}
    />
  </ElementWrapper>
);
