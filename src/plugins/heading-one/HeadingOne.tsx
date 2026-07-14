import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
}

export const HeadingOne = ({ attributes, children, pluginId }: ElementProps) => (
  <ElementWrapper type={BlockElementType.HEADING_ONE} pluginId={pluginId}>
    <h1
      {...(attributes as React.HTMLAttributes<HTMLHeadingElement>)}
      style={{ fontSize: '24px', fontWeight: 'bold', margin: '16px 0 8px' }}
    >
      {children}
    </h1>
  </ElementWrapper>
);
