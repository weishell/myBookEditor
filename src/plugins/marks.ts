import type { Editor } from 'slate';
import { showCursorToast } from '@/components/InlineToast';

// 渐变字与背景高亮互斥：渐变字通过 background-clip 实现，会覆盖 background-color，
// 叠加时背景色必然"无效"。判断当前选区是否处于渐变字（glow/shadow 不冲突）。
const isGradientArtTextActive = (editor: Editor): boolean => {
  const marks = (editor as any).marks;
  const artTextData = marks ? (marks as Record<string, unknown>)['artText'] : undefined;
  if (typeof artTextData !== 'string' || !artTextData) return false;
  try {
    const parsed = JSON.parse(artTextData) as { type?: string };
    return parsed.type === 'gradient';
  } catch {
    return false;
  }
};

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    (editor as any).removeMark(format);
  } else {
    (editor as any).addMark(format, true);
  }
};

export const isMarkActive = (editor: Editor, format: string) => {
  const marks = (editor as any).marks;
  return marks ? marks[format as keyof typeof marks] === true : false;
};

export const setColor = (editor: Editor, color: string | null) => {
  if (color) {
    (editor as any).addMark('color', color);
  } else {
    (editor as any).removeMark('color');
  }
};

export const setBackgroundColor = (editor: Editor, backgroundColor: string | null) => {
  if (backgroundColor) {
    // 渐变字与背景高亮互斥：当前已是渐变字时禁止叠加背景色（会被渐变覆盖而"无效"），改用 toast 提示
    if (isGradientArtTextActive(editor)) {
      showCursorToast(editor, 'toast.artTextGradientConflict');
      return;
    }
    (editor as any).addMark('highlight', backgroundColor);
  } else {
    (editor as any).removeMark('highlight');
  }
};

// Text 层字体：设置选区文字的 font-family mark
// 优先级：text mark > block attrs.fontFamily > 全局 globalFont
export const setFontFamily = (editor: Editor, fontFamily: string | null) => {
  if (fontFamily) {
    (editor as any).addMark('fontFamily', fontFamily);
  } else {
    (editor as any).removeMark('fontFamily');
  }
};

export const MarkTypes = {
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  CODE: 'code',
  COLOR: 'color',
  HIGHLIGHT: 'highlight',
  ART_TEXT: 'artText',
  FONT_FAMILY: 'fontFamily',
} as const;

export type MarkTypes = (typeof MarkTypes)[keyof typeof MarkTypes];
