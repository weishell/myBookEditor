import { BlockElementType } from '@/enums'
import { ElementWrapper } from '@/plugins/element-wrapper'

interface ElementProps {
  attributes: Record<string, unknown>
  children: React.ReactNode
  pluginId?: string
}

export const HeadingThree = ({ attributes, children, pluginId }: ElementProps) => (
  <ElementWrapper type={BlockElementType.HEADING_THREE} pluginId={pluginId}>
    <h3 {...attributes as React.HTMLAttributes<HTMLHeadingElement>} style={{ fontSize: '18px', fontWeight: 'bold', margin: '12px 0 8px' }}>
      {children}
    </h3>
  </ElementWrapper>
)