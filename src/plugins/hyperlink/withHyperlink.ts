import { Editor, Text, Transforms, type NodeEntry } from 'slate';
import {
  HYPERLINK_KEY,
  HYPERLINK_AUTO_KEY,
  autoLinkify,
  relinkAfterDelete,
  getUrlPrefixEnd,
  isAutoLinkText,
} from './hyperlink-utils';

/**
 * 超链接作为文本叶子上的 mark 存在：
 *  - insertText：每次输入后，把光标所在的完整合法 URL 自动识别并打上链接 mark
 *  - deleteBackward / deleteForward / deleteFragment：
 *    删除后必须重新判定！例如 www.2.comf（非法→纯文本）删掉 f 变回 www.2.com
 *    要恢复链接；www.2.coxm 删掉 x 变回 www.2.com 同样要恢复。
 *  - normalizeNode：自动识别出来的链接，按「URL 边界规则」收敛：
 *    · 链接段之后接入中文/空格等边界字符时，把尾部拆成普通文本，链接段保持链接
 *    · 链接段只有英文/数字继续连着（如删掉小数点、或 ascii 使域名非法）时，
 *      才整体降级为纯文本
 */
export const withHyperlink = (editor: Editor) => {
  const { insertText, normalizeNode, deleteBackward, deleteForward, deleteFragment } = editor;

  editor.insertText = (text) => {
    insertText(text);
    if (!text) return;
    try {
      autoLinkify(editor);
    } catch {
      /* 忽略归一化冲突 */
    }
  };

  editor.deleteBackward = (unit) => {
    deleteBackward(unit);
    relinkAfterDelete(editor);
  };

  editor.deleteForward = (unit) => {
    deleteForward(unit);
    relinkAfterDelete(editor);
  };

  editor.deleteFragment = (options) => {
    deleteFragment(options);
    relinkAfterDelete(editor);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry as NodeEntry;
    if (Text.isText(node) && node[HYPERLINK_AUTO_KEY]) {
      const text = node.text;
      const end = getUrlPrefixEnd(text);
      const urlPart = text.slice(0, end);
      if (isAutoLinkText(urlPart)) {
        if (end < text.length) {
          // 链接后跟了边界字符（中文/空格/全角标点）：
          // 把叶子替换成「链接段 + 普通段」两个相邻文本（同一行内），
          // 而非 splitNodes（那会在块级断开，把内容拆成两行/复制）。
          // 拷贝除超链接两个键之外的其余 mark（如加粗/颜色），避免 lint 未使用变量
          const restMarks: Record<string, unknown> = {};
          for (const key in node) {
            if (key !== HYPERLINK_KEY && key !== HYPERLINK_AUTO_KEY) {
              restMarks[key] = (node as any)[key];
            }
          }
          const left: any = {
            ...restMarks,
            text: text.slice(0, end),
            [HYPERLINK_KEY]: urlPart,
            [HYPERLINK_AUTO_KEY]: true,
          };
          const right: any = { ...restMarks, text: text.slice(end) };
          Editor.withoutNormalizing(editor, () => {
            Transforms.removeNodes(editor, { at: path });
            Transforms.insertNodes(editor, [left, right], { at: path });
          });
          return;
        }
        if (node[HYPERLINK_KEY] !== urlPart) {
          // 链接段合法，让地址跟随文本（如把 12 改成 132，地址同步更新）
          Transforms.setNodes(editor, { [HYPERLINK_KEY]: urlPart } as any, { at: path });
          return;
        }
      } else {
        // 链接段本身不再像合法 URL（删点、或 ascii 继续连导致域名非法）→ 整体降级
        Transforms.unsetNodes(editor, [HYPERLINK_KEY as any, HYPERLINK_AUTO_KEY as any], {
          at: path,
        });
        return;
      }
    }
    normalizeNode(entry);
  };

  return editor;
};
