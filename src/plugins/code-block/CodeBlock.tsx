import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
}

export const CodeBlock = ({ attributes, children, pluginId }: ElementProps) => (
  <ElementWrapper type={BlockElementType.CODE_BLOCK} pluginId={pluginId}>
    <pre
      {...(attributes as React.HTMLAttributes<HTMLPreElement>)}
      style={{
        margin: '12px 0',
        padding: '12px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        overflowX: 'auto',
      }}
    >
      <code style={{ fontFamily: 'monospace', fontSize: '14px', color: '#333' }}>{children}</code>
    </pre>
  </ElementWrapper>
);
