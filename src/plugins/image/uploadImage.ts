// 图片上传工具
//
// 设计目标：进度条动画只用于「渲染层」观感，不进入 Slate 文档 / 撤销历史。
// 借鉴 img.txt 的做法（进度存在独立 store，节点本身只落成功态）：
//  - 节点在拿到尺寸后，一步插入为「成功态」图片（这是唯一一条历史）；
//  - 进度条由本文件暴露的 uploadProgressStore 驱动，key 是节点的 block id，
//    它是模块级瞬态状态，完全不进历史，所以撤销/重做都只看到最终图片，没有进度条。
//  - 重做时节点被重新插入，但 store 里已没有该 id 的进度 → 直接显示图片本体。
// 接入真实后端时，只需在 simulateUploadProgress 里换成真实请求 + 回调。
import { Transforms, type Editor } from 'slate';
import { createImageElement } from '@/plugins/block-picker';

/** 图片显示宽度上限（超宽图等比缩放，避免撑满编辑区） */
const MAX_DISPLAY_WIDTH = 800;

/**
 * 瞬态上传进度 store（不进 Slate 文档，仅驱动 Image 的进度条 overlay）。
 * 用 useSyncExternalStore 接入 React：subscribe 注册监听，getVersion 触发重渲染。
 */
export const uploadProgressStore = (() => {
  const map = new Map<string, number>();
  const listeners = new Set<() => void>();
  let version = 0;

  const emit = () => {
    version += 1;
    listeners.forEach((listener) => listener());
  };

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getVersion: () => version,
    get: (id: string) => map.get(id),
    set: (id: string, value: number) => {
      map.set(id, value);
      emit();
    },
    delete: (id: string) => {
      if (map.delete(id)) emit();
    },
  };
})();

/** 读取本地图片的自然尺寸 */
const loadImageSize = (url: string): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = url;
  });

/** 弹出系统文件选择框（过滤非图片，支持多选） */
export const pickImages = (): Promise<File[]> =>
  new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.style.display = 'none';
    document.body.appendChild(input);

    input.onchange = () => {
      const files = Array.from(input.files ?? []).filter((f) => f.type.startsWith('image/'));
      input.remove();
      resolve(files);
    };
    input.oncancel = () => {
      input.remove();
      resolve([]);
    };
    input.click();
  });

/** 把进度推到 100 后删除 store 条目（overlay 随之消失，露出图片本体） */
const simulateUploadProgress = (id: string): void => {
  uploadProgressStore.set(id, 0);
  let progress = 0;
  const timer = window.setInterval(() => {
    // 递增幅度随机让进度更像真实上传；前快后慢，接近完成时放缓
    const increment = progress < 60 ? 18 : progress < 90 ? 9 : 3;
    progress = Math.min(progress + increment + Math.random() * increment, 100);
    uploadProgressStore.set(id, Math.floor(progress));
    if (progress >= 100) {
      window.clearInterval(timer);
      uploadProgressStore.delete(id);
    }
  }, 160);
};

/**
 * 在指定路径处插入一张本地图片。节点以成功态一步插入历史，
 * 进度条作为瞬态 overlay 在 store 中驱动（不进历史）。
 */
export const insertImageWithProgress = async (
  editor: Editor,
  insertPath: number[],
  file: File,
): Promise<void> => {
  const url = URL.createObjectURL(file);
  let dispWidth = 0;
  let dispHeight = 0;
  try {
    const { width, height } = await loadImageSize(url);
    dispWidth = Math.min(width, MAX_DISPLAY_WIDTH);
    dispHeight = Math.round((dispWidth / Math.max(width, 1)) * height);
  } catch {
    // 无法解码的图片：释放临时地址并静默跳过
    URL.revokeObjectURL(url);
    return;
  }

  const node = createImageElement(url, {
    width: dispWidth,
    height: dispHeight,
    name: file.name,
  });
  const id = node.id as string;

  // 唯一的、一步即成成功态的历史
  Transforms.insertNodes(editor, node as any, { at: insertPath });
  simulateUploadProgress(id);
};

/** 打开文件选择框并依次插入多张图片 */
export const openAndInsertImages = async (editor: Editor, insertPath: number[]): Promise<void> => {
  const files = await pickImages();
  let path = insertPath;
  for (const file of files) {
    // 同上一次插入让位：后续图片插到上一张之后
    await insertImageWithProgress(editor, path, file);
    path = [...path.slice(0, -1), path[path.length - 1] + 1];
  }
};
