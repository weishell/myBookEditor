import type { RenderLeafProps } from 'slate-react'

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let styledChildren = children

  if ((leaf as { bold?: boolean }).bold) {
    styledChildren = <strong>{styledChildren}</strong>
  }

  if ((leaf as { italic?: boolean }).italic) {
    styledChildren = <em>{styledChildren}</em>
  }

  if ((leaf as { underline?: boolean }).underline) {
    styledChildren = <u>{styledChildren}</u>
  }

  if ((leaf as { code?: boolean }).code) {
    styledChildren = (
      <code style={{ backgroundColor: '#f5f5f5', padding: '2px 4px', borderRadius: '2px', fontFamily: 'monospace', fontSize: '0.9em' }}>
        {styledChildren}
      </code>
    )
  }

  return <span {...attributes}>{styledChildren}</span>
}