// 复制工具：把指定路径的块写入系统剪贴板（多种格式）。
// 真正的"粘贴"由 editor.insertFragment 处理（解析 x-slate-fragment、逐层重生成 id）。
//
// 剪贴板同时写入：
//  - text/plain
//  - text/html
//  - application/x-slate-fragment（Slate 内部 JSON，base64 编码）
//  - files（若块内含可同步取得的二进制，如 data: URL —— 由 Slate 默认 setFragmentData 处理）
// 注意：id 重生成发生在「粘贴」时，而非此处，这样多次粘贴也不会产生重复 id。
import { Transforms, Editor } from 'slate';
import { ReactEditor } from 'slate-react';

/**
 * 选中某个块（整块）并写入系统剪贴板，携带 text/plain / text/html / application/x-slate-fragment。
 * 通过 Clipboard API 写入，确保自定义 MIME（x-slate-fragment）也能进入系统剪贴板；
 * 若不可用则回退到原生 execCommand('copy')。
 */
export const copyBlockToClipboard = async (editor: any, path: number[]): Promise<boolean> => {
  const selectBlock = () => {
    ReactEditor.focus(editor);
    Transforms.select(editor, {
      anchor: Editor.start(editor, path),
      focus: Editor.end(editor, path),
    });
  };

  try {
    selectBlock();
    // 生成多格式片段数据（text/plain / text/html / application/x-slate-fragment）
    const DT = (window as any).DataTransfer;
    const dt: any = DT ? new DT() : {};
    editor.setFragmentData(dt);

    const types: string[] = Array.from(dt.types || []);
    if (types.length && (window as any).ClipboardItem && navigator.clipboard?.write) {
      const items: Record<string, Blob> = {};
      for (const t of types) {
        const v = dt.getData(t);
        if (v != null) items[t] = new Blob([v], { type: t });
      }
      await navigator.clipboard.write([new (window as any).ClipboardItem(items)]);
      return true;
    }
  } catch {
    /* 回退到 execCommand */
  }

  // 兜底：原生 copy（至少写入 text/plain + text/html）
  try {
    selectBlock();
    return document.execCommand('copy');
  } catch {
    return false;
  }
};
