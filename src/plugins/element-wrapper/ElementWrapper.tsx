import { BlockElementType } from '@/enums';

interface ElementWrapperProps {
  type: BlockElementType;
  pluginId?: string;
  children: React.ReactNode;
}

export const ElementWrapper = ({ type, pluginId, children }: ElementWrapperProps) => {
  return (
    <div data-plugin-id={pluginId} data-block-type={type} style={{ position: 'relative' }}>
      {children}
    </div>
  );
};
