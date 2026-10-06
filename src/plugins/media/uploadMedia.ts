// 文件 / 视频上传工具
//
// 与图片上传（uploadImage.ts）同一套设计：进度条只存在于瞬态 store，
// 节点一步插入为「成功态」（唯一一条历史），撤销/重做都不会看到进度条。
// 差别：媒体块不需要探测尺寸，objectURL 直接可用，所以流程更短。
import { Transforms, type Editor, type Element as SlateElement } from 'slate';
import { BlockElementType } from '@/enums';
import { v4 as uuidv4 } from 'uuid';
import { simulateUploadProgress } from '@/plugins/image/uploadImage';

export type MediaUploadKind = 'file' | 'video';

/** 弹出系统文件选择框（视频过滤为 video/*，文件不限类型，支持多选） */
export const pickMediaFiles = (kind: MediaUploadKind): Promise<File[]> =>
  new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    if (kind === 'video') input.accept = 'video/*';
    input.multiple = true;
    input.style.display = 'none';
    document.body.appendChild(input);

    input.onchange = () => {
      const files = Array.from(input.files ?? []).filter((f) =>
        kind === 'video' ? f.type.startsWith('video/') : true,
      );
      input.remove();
      resolve(files);
    };
    input.oncancel = () => {
      input.remove();
      resolve([]);
    };
    input.click();
  });

/** 构造文件/视频块节点（成功态；进度条由 uploadProgressStore 瞬态驱动） */
const createMediaElement = (kind: MediaUploadKind, file: File): SlateElement => ({
  type: kind === 'video' ? BlockElementType.VIDEO_BLOCK : BlockElementType.FILE_BLOCK,
  id: uuidv4(),
  attrs: {
    kind,
    src: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    mimeType: file.type || undefined,
    layer: 'card' as const,
    align: 'left' as const,
  },
  children: [{ text: '' }],
});

/** 在指定路径处插入一个本地文件/视频（含瞬态上传进度） */
export const insertMediaWithProgress = async (
  editor: Editor,
  insertPath: number[],
  file: File,
  kind: MediaUploadKind,
): Promise<void> => {
  const node = createMediaElement(kind, file);
  const id = node.id as string;
  Transforms.insertNodes(editor, node as any, { at: insertPath });
  simulateUploadProgress(id);
};

/** 打开文件选择框并依次插入多个文件/视频 */
export const openAndInsertMedia = async (
  editor: Editor,
  insertPath: number[],
  kind: MediaUploadKind,
): Promise<void> => {
  const files = await pickMediaFiles(kind);
  let path = insertPath;
  for (const file of files) {
    // 同图片：后续文件插到上一个之后
    await insertMediaWithProgress(editor, path, file, kind);
    path = [...path.slice(0, -1), path[path.length - 1] + 1];
  }
};
