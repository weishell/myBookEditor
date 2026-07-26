import { BlockElementType } from '@/enums';

interface ElementWrapperProps {
  type: BlockElementType;
  pluginId?: string;
  attrs?: any;
  isEmpty?: boolean;
  children: React.ReactNode;
}

export const ElementWrapper = ({
  type,
  pluginId,
  attrs,
  isEmpty,
  children,
}: ElementWrapperProps) => {
  return (
    <div
      data-plugin-id={pluginId}
      data-block-type={type}
      data-block-attrs={attrs ? JSON.stringify(attrs) : undefined}
      data-empty={isEmpty ? 'true' : undefined}
      style={{ position: 'relative' }}
    >
      {children}
    </div>
  );
};
