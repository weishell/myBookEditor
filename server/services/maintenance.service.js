// 资源维护：找出「没有任何文档引用」的媒体 / 画板 / 评论，并按需清理
//
// 为什么需要它：删除文档时只删了 data/articles/<id>.json，
// 它引用的图片 / 视频 / 画板文件和 data/comments/<id>.json 会留在磁盘上，
// 时间长了就是一堆谁也看不见的垃圾。
//
// 安全前提（都是硬约束，不做妥协）：
//   1. 只能手动触发，不在任何自动流程里调用；
//   2. 回收站（data/.trash）必须为空 —— 还有待恢复的文档时不允许清理，
//      否则可能把「即将恢复的文档」所引用的资源删掉；
//   3. 只删 data/media 与 data/comments 下、确实没有任何引用指向的文件，
//      文档正文、meta.json、索引库一律不碰。
import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES_DIR, COMMENTS_DIR, DATA_DIR, MEDIA_DIR, TRASH_DIR } from '../config.js';
import { readMetaFile } from '../storage/meta-file.js';
import { conflict } from '../utils/http-error.js';

/** 把一段字符串里出现的 media/... 路径都抓出来 */
function extractMediaPaths(text, out) {
  if (typeof text !== 'string' || !text.includes('media/')) return;

  const trimmed = text.trim();
  if (/^\/?media\//.test(trimmed)) {
    out.add(trimmed.replace(/^\//, '').split(/[?#]/)[0]);
    return;
  }
  // 正文里可能是 markdown / html 片段，全局扫一遍
  for (const match of trimmed.matchAll(/(?:^|[\s"'(=])(\/?media\/[^\s"')<>]+)/g)) {
    out.add(match[1].replace(/^\//, '').split(/[?#]/)[0]);
  }
}

/** 递归遍历 JSON 里的所有字符串 */
function walkStrings(value, out) {
  if (typeof value === 'string') {
    extractMediaPaths(value, out);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) walkStrings(item, out);
    return;
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) walkStrings(item, out);
  }
}

/** 磁盘上某个目录下的所有文件（递归），返回相对 DATA_DIR 的路径 */
function listFiles(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listFiles(full, base));
    } else if (entry.isFile()) {
      const rel = path.relative(DATA_DIR, full).replace(/\\/g, '/');
      const stat = fs.statSync(full);
      result.push({ rel, abs: full, size: stat.size });
    }
  }
  return result;
}

/** 收集所有被引用的路径（文档正文 + 分类封面） */
function collectReferences() {
  const refs = new Set();

  for (const file of fs.existsSync(ARTICLES_DIR) ? fs.readdirSync(ARTICLES_DIR) : []) {
    if (!file.endsWith('.json') || file.endsWith('.tmp')) continue;
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8'));
      walkStrings(raw, refs);
    } catch (err) {
      console.warn(`[maintenance] 跳过无法解析的文章 ${file}：${err.message}`);
    }
  }

  // 分类封面：meta.json 里是 media/images/covers/xxx
  const meta = readMetaFile();
  for (const category of meta.categories) {
    if (category.cover) walkStrings(category.cover, refs);
  }

  // 画板 JSON 内部可能内嵌图片/视频路径（data/media/drawboards/*.json），
  // 这些路径不经过文章正文，必须单独扫，否则会把画板用到的图误判成孤儿。
  // 这里宁可保守：所有画板文件都扫，即使画板本身是孤儿，也先保住它引用的素材。
  for (const file of listFiles(MEDIA_DIR)) {
    if (!file.rel.endsWith('.json')) continue;
    try {
      const raw = JSON.parse(fs.readFileSync(file.abs, 'utf8'));
      walkStrings(raw, refs);
    } catch {
      /* 不是合法 JSON（比如别的 .json 附件）就跳过 */
    }
  }

  return refs;
}

/**
 * 体检：回收站状态 + 孤儿资源清单（不删除任何东西）
 */
export function inspectOrphans() {
  const refs = collectReferences();
  const trashFiles = listFiles(TRASH_DIR);

  const mediaFiles = listFiles(MEDIA_DIR);
  const orphanMedia = mediaFiles
    .filter((file) => !refs.has(file.rel))
    .map(({ rel, size }) => ({ path: rel, size }));

  // 评论按 articleId 存：文章文件没了，评论就是孤儿
  const articleIds = new Set(
    (fs.existsSync(ARTICLES_DIR) ? fs.readdirSync(ARTICLES_DIR) : [])
      .filter((f) => f.endsWith('.json') && !f.endsWith('.tmp'))
      .map((f) => path.basename(f, '.json')),
  );
  const orphanComments = listFiles(COMMENTS_DIR)
    .filter((file) => !articleIds.has(path.basename(file.rel, '.json')))
    .map(({ rel, size }) => ({ path: rel, size }));

  const totalBytes = [...orphanMedia, ...orphanComments].reduce((sum, f) => sum + f.size, 0);

  return {
    trashCount: trashFiles.length,
    canCleanup: trashFiles.length === 0,
    referencedCount: refs.size,
    mediaFileCount: mediaFiles.length,
    orphanMedia,
    orphanComments,
    totalBytes,
  };
}

/**
 * 执行清理（删除孤儿资源）
 * @throws 409 回收站不为空时
 */
export function cleanupOrphans() {
  const info = inspectOrphans();
  if (!info.canCleanup) {
    throw conflict(`回收站里还有 ${info.trashCount} 个文件，请先恢复或清空回收站再清理`);
  }

  const removed = [];
  let freedBytes = 0;
  let failed = 0;

  for (const file of [...info.orphanMedia, ...info.orphanComments]) {
    const abs = path.join(DATA_DIR, file.path);
    try {
      fs.unlinkSync(abs);
      removed.push(file.path);
      freedBytes += file.size;
    } catch (err) {
      // 某些环境的删除钩子会「删成功但抛错」，所以以「文件是否真的还在」为准
      if (!fs.existsSync(abs)) {
        removed.push(file.path);
        freedBytes += file.size;
      } else {
        failed += 1;
        console.warn(`[maintenance] 删除失败 ${file.path}：${err.message}`);
      }
    }
  }

  return {
    ok: true,
    removed: removed.length,
    removedMedia: removed.filter((p) => p.startsWith('media/')).length,
    removedComments: removed.filter((p) => p.startsWith('comments/')).length,
    failed,
    freedBytes,
    files: removed,
  };
}
