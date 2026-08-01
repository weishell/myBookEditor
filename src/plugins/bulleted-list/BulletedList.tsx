import type { RenderElementProps } from 'slate-react';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { BlockElementType } from '@/enums';
import styles from './BulletedList.module.less';

export const BulletedList = ({
  attributes,
  children,
  pluginId,
  element,
}: RenderElementProps & { pluginId?: string }) => (
  <ElementWrapper type={BlockElementType.BULLETED_LIST} pluginId={pluginId} attrs={element?.attrs}>
    <ul {...attributes} className={styles.list}>
      {children}
    </ul>
  </ElementWrapper>
);
