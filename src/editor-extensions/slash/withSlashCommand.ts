// 斜杠命令编辑器行为：检测合法 '/' 唤起菜单，并在输入/删除时实时重建过滤 query。
//
// 触发规则（对应产品要求）：
//   - 块首的 '/'(该块文本为空或紧邻块首)直接唤起；
//   - 行中前面必须是空白字符的 '/'（如 "前缀 " + '/')才唤起；
//   - "前缀" + '/'（紧贴非空白字符）不唤起，避免正文中的除号/路径误触发；
//   - 代码块 / 独立标题内不唤起（那些地方 '/' 是普通字符）。
//
// 实现：覆写 editor.apply。输入 '/' 会走一次 insert_text apply，在此检测并唤起；
// 菜单打开期间任意 insert/remove/move 都重建 query，并在此前沿兜底关闭（光标离开触发块）。
import { Editor, Node, Range } from 'slate';
import {
  slashStore,
  getCurrentBlockPath,
  getCaretRect,
  pathEquals,
  setSlashEditor,
  type SlashPoint,
} from './slash-store';

/** 是否允许这次 '/' 唤起：选区必须折叠、前面是块首或空白 */
const canTriggerSlash = (
  editor: Editor,
  blockPath: number[] | null,
  slash: SlashPoint,
): boolean => {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection) || !blockPath) return false;

  // 取 '/' 前面紧邻的字符，看是否在块首或紧跟空白。
  // prior = Editor.before(斜杠点)，其 offset 已比斜杠少 1（正指向前邻点），
  // 所以前邻字符在本节点的下标是 prior.offset（不是 prior.offset-1，会越界少读到空格）。
  const prior = Editor.before(editor, slash, { unit: 'offset' });
  if (!prior) return true; // 前面没有字符 → 块首，直接唤起
  const node = Node_getText(editor, prior.path);
  const char = node?.[prior.offset] ?? '';
  if (!char) return true;
  return /[\s\u00A0]/.test(char);
};

function Node_getText(editor: Editor, path: number[]): string | undefined {
  // 用 Transforms 无关的只读读取：拿该叶子节点文本
  const node = (editor as any).children as any[];
  let ref: any = node;
  for (let i = 0; i < path.length - 1; i++) {
    ref = ref?.[path[i]]?.children;
  }
  const leaf = ref?.[path[path.length - 1]];
  return typeof leaf?.text === 'string' ? leaf.text : undefined;
}

/** 取一个元素块的 id，用于跨结构变更稳定判断"同一块" */
const getBlockId = (editor: Editor, path: number[] | null): string | null => {
  if (!path) return null;
  try {
    const node = Node.get(editor, path) as any;
    return node?.id ?? node?.attrs?.id ?? null;
  } catch {
    return null;
  }
};

/** 菜单打开期间：光标仍落在触发块内则重建 query，否则关闭 */
const refreshQuery = (editor: Editor) => {
  const st = slashStore.get();
  if (!st.open || !st.slashPoint) return;
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) {
    slashStore.close();
    return;
  }
  const current = getCurrentBlockPath(editor);
  if (!current) {
    slashStore.close();
    return;
  }
  // 优先按块 id 判断是否仍在同一块（结构变化导致 path 漂移时仍正确）；
  // 无 id 的块回退到 path 相等。
  const currentId = getBlockId(editor, current);
  const sameBlock =
    currentId && st.blockId ? currentId === st.blockId : pathEquals(current, st.blockPath);
  if (!sameBlock) {
    slashStore.close();
    return;
  }
  const anchor = selection.anchor;
  let between = '';
  try {
    between = Editor.string(editor, { anchor: st.slashPoint, focus: anchor });
  } catch {
    slashStore.close();
    return;
  }
  if (!between.startsWith('/')) {
    slashStore.close();
    return;
  }
  const query = between.slice(1);
  slashStore.update(query, getCaretRect(), current, currentId);
};

export const withSlashCommand = <T extends Editor>(editor: T): T => {
  setSlashEditor(editor);

  const { apply } = editor;
  editor.apply = (op) => {
    // 先让 Slate 真正应用这次操作，再根据操作类型决定唤起/刷新
    const wasOpen = slashStore.get().open;
    apply(op);

    if (op.type === 'insert_text' && op.text === '/' && !!editor.selection) {
      const blockPath = getCurrentBlockPath(editor);
      if (!blockPath) return;
      const anchor = editor.selection.anchor;
      const slashPoint: SlashPoint = { path: anchor.path, offset: anchor.offset - 1 };
      if (canTriggerSlash(editor, blockPath, slashPoint)) {
        slashStore.open({
          rect: getCaretRect(),
          blockPath,
          blockId: getBlockId(editor, blockPath),
          slashPoint,
        });
      }
      return;
    }

    if (wasOpen) {
      const isTextish =
        op.type === 'insert_text' ||
        op.type === 'remove_text' ||
        op.type === 'split_node' ||
        op.type === 'merge_node' ||
        op.type === 'move_node';
      if (isTextish) {
        refreshQuery(editor);
      }
    }
  };

  return editor;
};
