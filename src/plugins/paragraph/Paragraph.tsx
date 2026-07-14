import { BlockElementType } from '@/enums'
import { ElementWrapper } from '@/plugins/element-wrapper'

interface ElementProps {
  attributes: Record<string, unknown>
  children: React.ReactNode
  pluginId?: string
}

export const Paragraph = ({ attributes, children, pluginId }: ElementProps) => (
  <ElementWrapper type={BlockElementType.PARAGRAPH} pluginId={pluginId}>
    <p {...attributes as React.HTMLAttributes<HTMLParagraphElement>} style={{ margin: '8px 0', lineHeight: '1.8' }}>
      {children}
    </p>
  </ElementWrapper>
)