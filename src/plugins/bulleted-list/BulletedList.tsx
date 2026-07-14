import { BlockElementType } from '@/enums'
import { ElementWrapper } from '@/plugins/element-wrapper'

interface ElementProps {
  attributes: Record<string, unknown>
  children: React.ReactNode
  pluginId?: string
}

export const BulletedList = ({ attributes, children, pluginId }: ElementProps) => (
  <ElementWrapper type={BlockElementType.BULLETED_LIST} pluginId={pluginId}>
    <ul {...attributes as React.HTMLAttributes<HTMLUListElement>} style={{ margin: '8px 0', paddingLeft: '24px', listStyleType: 'disc' }}>
      {children}
    </ul>
  </ElementWrapper>
)