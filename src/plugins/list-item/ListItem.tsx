import type { RenderElementProps } from 'slate-react';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { BlockElementType } from '@/enums';
import styles from './ListItem.module.less';

export const ListItem = ({
  attributes,
  children,
  pluginId,
}: RenderElementProps & { pluginId?: string }) => (
  <ElementWrapper type={BlockElementType.LIST_ITEM} pluginId={pluginId}>
    <li {...attributes} className={styles.item}>
      {children}
    </li>
  </ElementWrapper>
);
