import { Transforms, Editor, Element, Path } from 'slate';
import { BlockElementType } from '@/enums';

// 代码块内部无层级，Tab 用纯文本缩进。
// 为与“外面”的文档缩进幅度保持一致：外面每级 = INDENT_PX(28px)；
// 代码块等宽字体约 12px（@font-size-sm），单字符宽 ≈ 7px，
// 因此 4 个空格 ≈ 28px，和外面一个缩进级别视觉对齐。
export const CODE_TAB = '    '; // 4 个空格
const TAB = '\t';

/**
 * 选区是否位于代码块内部。
 * 代码块内部没有文档层级概念，Tab 只应操作文本本身。
 */
export function isInCodeBlock(editor: Editor): boolean {
  if (!editor.selection) return false;
  const matches = Array.from(
    Editor.nodes(editor, {
      at: editor.selection,
      match: (n) => Element.isElement(n) && (n as any).type === BlockElementType.CODE_BLOCK,
    }),
  );
  return matches.length > 0;
}

/** 取选区内涉及的 CODE_LINE（按文档顺序） */
function getCodeLines(editor: Editor): [any, number[]][] {
  const results = Editor.nodes(editor, {
    at: editor.selection!,
    match: (n) => Element.isElement(n) && (n as any).type === BlockElementType.CODE_LINE,
  });
  return Array.from(results) as [any, number[]][];
}

/** 取某行文本（children[0] 为真实内容，children[1] 为尾随零宽空格） */
function getLineText(node: any): string {
  return (node?.children?.[0]?.text as string) || '';
}

/**
 * 代码块内的 Tab / Shift+Tab。
 *
 * 代码块内部没有层级（indent）概念，因此：
 * - Tab（无 shift）：折叠选区时插入一个 CODE_TAB（4 空格，≈外面一级缩进）；
 *   选区跨多行时每行行首加一个 CODE_TAB。
 * - Shift+Tab：每行行首去掉一档缩进（一个 CODE_TAB，或兼容一个遗留 \t），
 *   与 Tab 严格对等单位，保证 Tab → Shift+Tab 可原样还原。
 */
export function handleCodeBlockTab(editor: Editor, isShift: boolean): void {
  const { selection } = editor;
  if (!selection) return;

  const lines = getCodeLines(editor);
  if (lines.length === 0) {
    // 没匹配到 CODE_LINE（极罕见空节点）：退回普通插入
    if (!isShift) Transforms.insertText(editor, CODE_TAB);
    return;
  }

  // Tab：在每行 text 子节点的行首插入一个 CODE_TAB
  // （用文本级 insertText，而非替换 children，避免 setNodes 不生效）
  if (!isShift) {
    lines.forEach(([, path]) => {
      const textPath: Path = [...path, 0];
      Transforms.insertText(editor, CODE_TAB, { at: { path: textPath, offset: 0 } });
    });
    return;
  }

  // Shift+Tab：逐行删除行首一档缩进（文本级 delete），并保持选区有效
  const anchorLinePath = selection.anchor.path.slice(0, -1); // 去掉末尾 text 子节点下标
  let anchorNewOffset = selection.anchor.offset;

  lines.forEach(([node, path]) => {
    const text = getLineText(node);
    let removed = 0;

    if (text.startsWith(TAB)) {
      // 兼容遗留的 \t（CSS 已设 tab-size:4，渲染同 4 空格）
      removed = 1;
    } else if (text.startsWith(CODE_TAB)) {
      removed = CODE_TAB.length;
    } else {
      // 行首空格不足一档：尽量删到上一档对齐（上限一档）
      let i = 0;
      while (i < CODE_TAB.length && text[i] === ' ') i++;
      removed = i;
    }

    if (removed > 0) {
      const textPath: Path = [...path, 0];
      Transforms.delete(editor, {
        at: {
          anchor: { path: textPath, offset: 0 },
          focus: { path: textPath, offset: removed },
        },
      });
    }

    // 若锚点落在当前行，记录其新偏移
    if (Path.equals(path, anchorLinePath)) {
      anchorNewOffset = Math.max(0, selection.anchor.offset - removed);
    }
  });

  // 重新定位选区，避免偏移越界（折叠到锚点新位置）
  try {
    const anchorTextPath: Path = [...anchorLinePath, 0];
    Transforms.select(editor, {
      anchor: { path: anchorTextPath, offset: anchorNewOffset },
      focus: { path: anchorTextPath, offset: anchorNewOffset },
    });
  } catch {
    /* 选区已不可用时忽略 */
  }
}
