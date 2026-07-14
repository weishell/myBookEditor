import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
}

export const Blockquote = ({ attributes, children, pluginId }: ElementProps) => (
  <ElementWrapper type={BlockElementType.BLOCKQUOTE} pluginId={pluginId}>
    <blockquote
      {...(attributes as React.HTMLAttributes<HTMLQuoteElement>)}
      style={{
        margin: '12px 0',
        paddingLeft: '16px',
        borderLeft: '4px solid #faad14',
        color: '#666',
        fontStyle: 'italic',
      }}
    >
      {children}
    </blockquote>
  </ElementWrapper>
);
