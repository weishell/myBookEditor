import { BlockElementType } from '@/enums'
import { ElementWrapper } from '@/plugins/element-wrapper'

interface ElementProps {
  attributes: Record<string, unknown>
  children: React.ReactNode
  pluginId?: string
}

export const HeadingTwo = ({ attributes, children, pluginId }: ElementProps) => (
  <ElementWrapper type={BlockElementType.HEADING_TWO} pluginId={pluginId}>
    <h2 {...attributes as React.HTMLAttributes<HTMLHeadingElement>} style={{ fontSize: '20px', fontWeight: 'bold', margin: '14px 0 8px' }}>
      {children}
    </h2>
  </ElementWrapper>
)