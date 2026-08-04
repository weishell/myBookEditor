import { Node, Element, type Editor, type Descendant } from 'slate';
import { BlockElementType } from '@/enums';
import { ensureHeadingTitle } from './withDelete';

/**
 * 把一段 Fragment 中所有的 HEADING_TITLE 独立标题过滤掉，
 * 用于 copy/cut 对外导出时，或粘贴导入时避免出现双标题。
 *
 * 注意：为避免 Fragment 全空，过滤完后如果什么都不剩了，
 *       则把所有 HEADING_TITLE 的 children 保留（仅把标题降级为段落）。
 */
const stripHeadingTitles = (nodes: Descendant[]): Descendant[] => {
  const stripped: Descendant[] = [];
  for (const n of nodes) {
    if (!Element.isElement(n)) {
      stripped.push(n);
      continue;
    }
    if ((n as any).type === BlockElementType.HEADING_TITLE) {
      // 降级为普通段落
      stripped.push({
        type: BlockElementType.PARAGRAPH,
        id: (n as any).id,
        children: n.children as any,
      });
      continue;
    }
    // 递归处理嵌套（如表格、列表内部）
    if (Array.isArray(n.children) && n.children.length > 0) {
      const newChildren = stripHeadingTitles(n.children as any);
      stripped.push({ ...(n as any), children: newChildren });
    } else {
      stripped.push(n as any);
    }
  }
  return stripped;
};

/**
 * 集中管理 Slate 编辑器行为：
 * - isVoid：声明 void 元素（divider / image）
 * - setFragmentData / getFragmentData：复制/剪切时过滤掉 HEADING_TITLE，防止跨文章粘贴出现双标题
 * - insertFragmentData：粘贴时忽略外部传入的 HEADING_TITLE
 */
export const withEditorBehaviors = (editor: Editor) => {
  const { isVoid, setFragmentData, insertFragment } = editor;

  editor.isVoid = (element) => {
    switch (element.type) {
      case BlockElementType.DIVIDER:
      case BlockElementType.IMAGE_BLOCK:
        return true;
      default:
        return isVoid(element);
    }
  };

  // 复制 / 剪切：把选区中包含的 HEADING_TITLE 去掉再写入剪贴板
  editor.setFragmentData = (data: DataTransfer) => {
    const { selection } = editor;
    if (!selection) {
      setFragmentData(data);
      return;
    }

    // 先拿原始 fragment
    try {
      const tmp = window.DataTransfer ? new (window as any).DataTransfer() : ({} as DataTransfer);
      setFragmentData(tmp);

      // 如果用户跨选了整段，可能直接包含 HEADING_TITLE：
      // 我们手动取整个选区 Fragment 然后再过滤写回去
      const fragmentRaw = (editor as any).getFragment ? (editor as any).getFragment() : null;
      let fragment: Descendant[] = fragmentRaw || [];
      if (!fragment || fragment.length === 0) {
        // fallback：用 data 里的 slate 内容尝试解析
        const slateData = tmp.getData && tmp.getData('application/x-slate-fragment');
        if (slateData) {
          try {
            const decoded = decodeURIComponent(window.atob(slateData));
            fragment = JSON.parse(decoded);
          } catch {
            fragment = [];
          }
        }
      }
      if (fragment && fragment.length > 0) {
        const filtered = stripHeadingTitles(fragment);
        // 写回：application/x-slate-fragment + text/plain
        try {
          const encoded = window.btoa(encodeURIComponent(JSON.stringify(filtered)));
          data.setData('application/x-slate-fragment', encoded);
        } catch {
          /* ignore */
        }
        // plaintext：所有叶子文本拼起来
        const plain = filtered
          .map((n) => Node.string(n as any))
          .filter((s) => s.length > 0)
          .join('\n');
        data.setData('text/plain', plain);
        // HTML：简单兜底
        const html = filtered
          .map((n) => {
            const txt = Node.string(n as any);
            const type = (n as any).type;
            if (type === BlockElementType.HEADING) {
              const lv = ((n as any).attrs?.level as number) || 1;
              return `<h${lv}>${txt}</h${lv}>`;
            }
            if (type === BlockElementType.BLOCKQUOTE) return `<blockquote>${txt}</blockquote>`;
            if (type === BlockElementType.CODE_BLOCK) return `<pre><code>${txt}</code></pre>`;
            return `<p>${txt}</p>`;
          })
          .join('');
        data.setData('text/html', html);
        return;
      }
    } catch {
      /* ignore, fallback */
    }
    setFragmentData(data);
  };

  // 粘贴：插入时再次过滤粘贴进来的 HEADING_TITLE，并确保最终仍有标题
  editor.insertFragment = (fragment: any) => {
    const cleaned = stripHeadingTitles(fragment as Descendant[]);
    insertFragment(cleaned as any);
    // 粘贴兜底：极端场景若粘贴把仅存的标题挤掉了 → 再确保一次
    try {
      ensureHeadingTitle(editor);
    } catch {
      /* ignore */
    }
  };

  return editor;
};
