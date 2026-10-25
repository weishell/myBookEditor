// 全文评论存储：一篇一个 JSON（data/comments/<articleId>.json），与文章文件解耦
import fs from 'node:fs';
import path from 'node:path';
import { COMMENTS_DIR } from '../config.js';

const fileOf = (articleId) => path.join(COMMENTS_DIR, `${articleId}.json`);

/** 读取某篇文章的全文评论；文件不存在或损坏时返回空数组 */
export function readComments(articleId) {
  const file = fileOf(articleId);
  if (!fs.existsSync(file)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

/** 覆盖写：先写临时文件再 rename，避免写一半留下坏 JSON */
export function writeComments(articleId, comments) {
  fs.mkdirSync(COMMENTS_DIR, { recursive: true });
  const file = fileOf(articleId);
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(comments, null, 2));
  fs.renameSync(tmp, file);
}
