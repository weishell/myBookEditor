// withLilist —— 列表编号自动兜底重排
//
// 背景：sortLilist 原本只在"显式命令"（回车/删除/切换/转换/改编号/缩进）末尾被手动调用，
// 普通编辑（增删顶层块、改标题层级、段落↔标题互转等）不会触发，导致 H 标题等列表
// 出现"无法自动排序"。
//
// 方案：在 normalizeNode 钩子上，每当编辑器根节点被 normalize（即顶层块结构发生变化）
// 时，整批重算所有有序列表（OL）组的编号。sortLilist 幂等——编号未变化时零写入，
// 因此重排不会触发无限归一回溯。
import { LilistType, getLilist, sortLilist } from '@/plugins/lilist';

export const withLilist = (editor: any) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry: [any, unknown[]]) => {
    normalizeNode(entry);
    const [node] = entry;
    // 只关心编辑器根节点被 normalize（增删块 / 改层级 / 改类型等结构变化）
    if (node !== editor) return;

    try {
      const ids = new Set<string>();
      const children = (editor as any).children ?? [];
      // 顶层所有带 lilist 的有序宿主（段落 / H 标题），按 list_id 归组整批重排
      for (const block of children) {
        const lilist = getLilist(block);
        if (lilist?.list_type === LilistType.OL) ids.add(lilist.list_id);
      }
      if (ids.size) sortLilist(editor, [...ids]);
    } catch {
      /* 兜底重排失败不影响编辑，交由显式命令路径兜底 */
    }
  };

  return editor;
};
