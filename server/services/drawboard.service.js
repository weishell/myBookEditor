// 画板数据存储：一个画板一个 JSON 文件，落在 data/media/drawboards/
// 文章里只保存相对路径，和图片/视频同一套访问方式（/media/drawboards/xxx.json）
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { DRAWBOARDS_DIR } from '../config.js';
import { badRequest } from '../utils/http-error.js';

const FILE_PATTERN = /^\/?media\/drawboards\/([A-Za-z0-9_-]+\.json)$/;

/**
 * @param {{ data: unknown[], path?: string }} payload
 *   path 有值 = 覆盖原画板；没有 = 新建一个文件
 */
export function saveDrawboard(payload = {}) {
  const { data, path: relPath } = payload;
  if (!Array.isArray(data)) throw badRequest('画板数据必须是数组');

  let fileName;
  if (relPath) {
    const match = FILE_PATTERN.exec(String(relPath));
    if (!match) throw badRequest('画板路径不合法');
    fileName = match[1];
  } else {
    fileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.json`;
  }

  fs.mkdirSync(DRAWBOARDS_DIR, { recursive: true });
  fs.writeFileSync(path.join(DRAWBOARDS_DIR, fileName), JSON.stringify(data));

  return { path: `media/drawboards/${fileName}` };
}
