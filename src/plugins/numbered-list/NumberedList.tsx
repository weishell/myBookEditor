import type { RenderElementProps } from 'slate-react';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { BlockElementType } from '@/enums';
import styles from './NumberedList.module.less';

export const NumberedList = ({
  attributes,
  children,
  pluginId,
}: RenderElementProps & { pluginId?: string }) => (
  <ElementWrapper type={BlockElementType.NUMBERED_LIST} pluginId={pluginId}>
    <ol {...attributes} className={styles.list}>
      {children}
    </ol>
  </ElementWrapper>
);
