import type { Editor } from 'slate'

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    (editor as any).removeMark(format)
  } else {
    (editor as any).addMark(format, true)
  }
}

export const isMarkActive = (editor: Editor, format: string) => {
  const marks = (editor as any).marks
  return marks ? marks[format as keyof typeof marks] === true : false
}

export const MarkTypes = {
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  CODE: 'code',
} as const

export type MarkTypes = typeof MarkTypes[keyof typeof MarkTypes]