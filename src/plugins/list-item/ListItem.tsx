import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
}

export const ListItem = ({ attributes, children, pluginId }: ElementProps) => (
  <ElementWrapper type={BlockElementType.LIST_ITEM} pluginId={pluginId}>
    <li {...(attributes as React.HTMLAttributes<HTMLLIElement>)} style={{ margin: '4px 0' }}>
      {children}
    </li>
  </ElementWrapper>
);
