// 字体文件加载与 IndexedDB 缓存
//
// web 字体（寒蝉锦书宋、东方大楷等）首次使用时需要下载 woff2 文件。
// 把字体 ArrayBuffer 缓存到 IndexedDB，后续直接从缓存读取。
//
// 系统字体不走这里，直接由 CSS font-family 引用。

import type { FontDefinition } from './font-list';

const DB_NAME = 'mybook-font-cache';
const STORE_NAME = 'fonts';
const DB_VERSION = 1;

const registeredFonts = new Set<string>();

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getCachedFont(id: string): Promise<ArrayBuffer | undefined> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(id);
      req.onsuccess = () => resolve(req.result as ArrayBuffer | undefined);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return undefined;
  }
}

async function putCachedFont(id: string, buffer: ArrayBuffer): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(buffer, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // 缓存失败不影响功能
  }
}

/** 加载字体并注册到 document.fonts */
export async function loadFont(font: FontDefinition): Promise<void> {
  if (font.category === 'system' || !font.url) return;
  if (registeredFonts.has(font.id)) return;

  let buffer = await getCachedFont(font.id);

  if (!buffer) {
    const res = await fetch(font.url);
    if (!res.ok) throw new Error(`Failed to load font: ${font.id} (${res.status})`);
    buffer = await res.arrayBuffer();
    await putCachedFont(font.id, buffer);
  }

  const blob = new Blob([buffer], { type: 'font/woff2' });
  const blobUrl = URL.createObjectURL(blob);
  const fontFace = new FontFace(font.family.replace(/["']/g, ''), `url(${blobUrl})`);
  await fontFace.load();
  document.fonts.add(fontFace);
  URL.revokeObjectURL(blobUrl);

  registeredFonts.add(font.id);
}

/** 判断字体是否已注册 */
export function isFontLoaded(id: string): boolean {
  return registeredFonts.has(id);
}
