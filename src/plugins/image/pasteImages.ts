// 粘贴图片管线 —— 剪贴板截图 / 复制的图片文件 / 网页里的 <img> 统一走这一条路
//
// 三步（沿用 uploadImage.ts「进度条不进历史」的约定）：
//   1. 同步插入 image 块，url 先用「立刻能显示」的地址：本地文件用 blob、外链图用原地址。
//      粘贴瞬间就有图，不用干等网络；
//   2. 异步上传 / 代下载，进度条由模块级 uploadProgressStore 驱动，完全不进 Slate 文档与撤销历史；
//   3. 落盘完成后用 HistoryEditor.withoutSaving 把 attrs.url 换成 /media/... 相对路径。
//      不这么做历史里会多一条「改 url」的步骤，用户按一次撤销看起来毫无反应、
//      按第二次图才消失，会以为撤销坏了。
import {
  Editor,
  Element as SlateElement,
  Node as SlateNode,
  Path,
  Range,
  Transforms,
  type Descendant,
} from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { HistoryEditor } from 'slate-history';
import { createImageElement } from '@/plugins/block-picker';
import { BlockElementType } from '@/enums';
import { uploadBinary, uploadRemoteImage } from '@/data/media';
import { canWrite } from '@/data/store';
import { fitDisplaySize, loadImageSize, trackUpload, uploadProgressStore } from './uploadImage';

/** 一张待粘贴的图：预览地址 + 真正的落盘动作（返回 null 表示不需要/不能上传） */
export interface PastedImageSource {
  previewUrl: string;
  name?: string;
  upload: () => Promise<{ path: string; name?: string } | null>;
}

/** 只有这两种地址需要「本地化」：外链要代下载，data: 要解码后上传 */
export const isLocalizableImageUrl = (url: string): boolean =>
  /^https?:\/\//i.test(url) || /^data:image\//i.test(url);

/** 贴的是图片地址（判扩展名，避免把普通链接误当图片下载） */
export const looksLikeImageUrl = (url: string): boolean =>
  /^https?:\/\//i.test(url) && /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico)(?:[?#]|$)/i.test(url);

const createEmptyParagraph = (): Descendant =>
  ({
    type: BlockElementType.PARAGRAPH,
    id: `paste-${uuidv4()}`,
    attrs: {},
    children: [{ text: '' }],
  }) as unknown as Descendant;

/** 按 id 找图片块路径：异步期间用户可能已经删掉/撤销这张图，路径必须每次重查 */
export const findElementPathById = (editor: Editor, id: string): Path | null => {
  for (const [, path] of Editor.nodes(editor, {
    at: [],
    voids: true,
    match: (n) => SlateElement.isElement(n) && (n as { id?: string }).id === id,
  })) {
    return path;
  }
  return null;
};

/** 改图片 attrs；不进撤销历史（落盘换地址不是用户编辑动作） */
const patchImageAttrs = (editor: Editor, id: string, patch: (attrs: any) => any): void => {
  const path = findElementPathById(editor, id);
  if (!path) return;
  const node = Editor.node(editor, path)[0] as { attrs?: Record<string, unknown> };
  const attrs = patch(node.attrs || {});
  const apply = () => Transforms.setNodes(editor, { attrs } as any, { at: path, voids: true });
  // ⚠️ 必须用 HistoryEditor 的静态方法：withHistory 只往 editor 上挂了
  // history/undo/redo，没有把 withoutSaving 挂成实例方法
  HistoryEditor.withoutSaving(editor as any, apply);
};

interface InsertTarget {
  path: Path;
  /** 当前是空段落，直接顶替它（不留下一个空行） */
  replace: boolean;
  /** 嵌套块内部：交给 Slate 在光标处 split，不能往同级插 */
  nested: boolean;
}

const resolveInsertTarget = (editor: Editor): InsertTarget | null => {
  const { selection } = editor;
  if (!selection) return null;

  const entry = Editor.nodes(editor, {
    at: selection,
    mode: 'lowest',
    match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n as any),
  }).next().value as [any, Path] | undefined;

  if (!entry) return { path: [], replace: false, nested: true };
  const [node, path] = entry;

  // 表格单元格 / 分栏列 / 提示块内部行：往同级插会破坏容器结构
  if (path.length > 1) return { path, replace: false, nested: true };

  const isEmptyParagraph =
    node.type === BlockElementType.PARAGRAPH && SlateNode.string(node).trim() === '';
  // 文档只剩这一块时不能删，否则变空文档，Slate 会另补空段落、光标位置反而乱
  if (isEmptyParagraph && editor.children.length > 1) {
    return { path, replace: true, nested: false };
  }
  return { path: Path.next(path), replace: false, nested: false };
};

/**
 * 同步插入占位图片块，随后异步上传并替换地址。
 * @returns 是否已接管本次粘贴（false 时调用方要走原来的粘贴逻辑）
 */
export const insertPastedImages = (editor: Editor, sources: PastedImageSource[]): boolean => {
  if (!sources.length) return false;

  // 有选区时先删掉再插图：粘一张图盖掉选中的文字，是粘贴的通用语义
  const { selection } = editor;
  if (selection && !Range.isCollapsed(selection)) {
    Transforms.delete(editor, { at: selection });
  }

  const target = resolveInsertTarget(editor);
  if (!target) return false;

  const imageNodes = sources.map((s) => createImageElement(s.previewUrl, { name: s.name }));
  // 末尾补空段落：粘完图能直接接着写，void 块后面本来没有可落光标的位置
  const nodes = [...(imageNodes as any[]), createEmptyParagraph() as any];

  if (target.nested) {
    Transforms.insertNodes(editor, nodes, { at: editor.selection as any });
  } else {
    if (target.replace) Transforms.removeNodes(editor, { at: target.path });
    Transforms.insertNodes(editor, nodes, { at: target.path });
    const tailPath = [
      ...target.path.slice(0, -1),
      target.path[target.path.length - 1] + sources.length,
    ];
    try {
      Transforms.select(editor, Editor.start(editor, tailPath));
    } catch {
      /* 光标落位失败不影响图片插入 */
    }
  }

  imageNodes.forEach((node, i) => {
    const id = node.id as string;
    void finalizePastedImage(editor, id, sources[i].previewUrl, sources[i].upload());
  });
  return true;
};

/** 剪贴板里直接带图片文件（截图 / 右键复制图片 / 从资源管理器拖入） */
export const insertPastedFiles = (editor: Editor, files: File[]): boolean => {
  if (!files.length) return false;
  const sources: PastedImageSource[] = files.map((file) => ({
    previewUrl: URL.createObjectURL(file),
    name: file.name,
    upload: async () => {
      // 只读模式（线上静态站）没有上传接口：blob 地址本会话内可看，不写进文档也没意义
      if (!canWrite()) return null;
      const uploaded = await uploadBinary(file, 'images');
      return { path: uploaded.path, name: uploaded.file.name };
    },
  }));
  return insertPastedImages(editor, sources);
};

/** 外链 / data: 图片落盘；同一地址只下载一次 */
const downloadToLibrary = async (
  url: string,
  name?: string,
): Promise<{ path: string; name?: string } | null> => {
  if (/^data:image\//i.test(url)) {
    const blob = await (await fetch(url)).blob();
    const ext = (blob.type.split('/')[1] || 'png').replace('jpeg', 'jpg');
    const file = new File([blob], name || `image.${ext}`, { type: blob.type });
    const uploaded = await uploadBinary(file, 'images');
    return { path: uploaded.path, name };
  }
  const remote = await uploadRemoteImage(url, name);
  return { path: remote.path, name: remote.originalName || name };
};

/** 上传落地后把 url 换成相对路径（失败就保持原地址，至少内容没丢） */
const finalizePastedImage = async (
  editor: Editor,
  id: string,
  previewUrl: string,
  task: Promise<{ path: string; name?: string } | null>,
): Promise<void> => {
  uploadProgressStore.set(id, 0);

  // 尺寸通常比上传先到位：先修好长宽比，别让图在 16:9 的占位框里躺很久
  void loadImageSize(previewUrl)
    .then((size) =>
      patchImageAttrs(editor, id, (attrs) => ({
        ...attrs,
        ...fitDisplaySize(size.width, size.height),
      })),
    )
    .catch(() => undefined);

  let result: { path: string; name?: string } | null = null;
  try {
    result = await trackUpload(id, task);
  } catch (err) {
    console.warn('[paste] 图片上传失败，保留原始地址', err);
    uploadProgressStore.delete(id);
    return;
  }

  if (!result?.path || result.path === previewUrl) {
    uploadProgressStore.delete(id);
    return;
  }

  patchImageAttrs(editor, id, (attrs) => ({
    ...attrs,
    url: result!.path,
    ...(result!.name ? { name: result!.name } : null),
  }));
};

/** 收集一批块里所有「需要本地化」的图片地址 */
export const collectImageUrls = (nodes: unknown[]): string[] => {
  const urls: string[] = [];
  const walk = (n: any): void => {
    if (!n) return;
    if (n.type === BlockElementType.IMAGE_BLOCK && n.attrs?.url) {
      if (isLocalizableImageUrl(n.attrs.url)) urls.push(n.attrs.url);
      return;
    }
    if (Array.isArray(n.children)) n.children.forEach(walk);
  };
  nodes.forEach(walk);
  return urls;
};

/**
 * 粘贴 HTML 之后调用：把里面带过来的外链图逐个本地化。
 * 用 url 匹配而不是节点 id —— insertFragment 会重新生成 id，url 是唯一稳定的线索。
 */
export const localizePastedRemoteImages = (editor: Editor, urls: string[]): void => {
  // 线上静态站没有 /api/upload/remote，保留外链地址即可
  if (!canWrite()) return;
  const wanted = new Set(urls.filter(isLocalizableImageUrl));
  if (wanted.size === 0) return;

  const targets: { id: string; url: string; name?: string }[] = [];
  for (const [node] of Editor.nodes(editor, {
    at: [],
    voids: true,
    match: (n) =>
      SlateElement.isElement(n) &&
      (n as any).type === BlockElementType.IMAGE_BLOCK &&
      wanted.has((n as any).attrs?.url),
  })) {
    const attrs = (node as any).attrs || {};
    targets.push({ id: (node as any).id, url: attrs.url, name: attrs.name });
  }

  const cache = new Map<string, Promise<{ path: string; name?: string } | null>>();
  targets.forEach((target) => {
    if (!cache.has(target.url)) cache.set(target.url, downloadToLibrary(target.url, target.name));
    void finalizePastedImage(editor, target.id, target.url, cache.get(target.url)!);
  });
};
