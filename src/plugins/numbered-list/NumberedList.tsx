import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
}

export const NumberedList = ({ attributes, children, pluginId }: ElementProps) => (
  <ElementWrapper type={BlockElementType.NUMBERED_LIST} pluginId={pluginId}>
    <ol
      {...(attributes as React.HTMLAttributes<HTMLOListElement>)}
      style={{ margin: '8px 0', paddingLeft: '24px' }}
    >
      {children}
    </ol>
  </ElementWrapper>
);
