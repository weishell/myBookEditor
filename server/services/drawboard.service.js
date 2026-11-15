// 画板数据存储：一个画板一个 JSON 文件，落在 data/media/drawboards/
// 文章里只保存相对路径，和图片/视频同一套访问方式（/media/drawboards/xxx.json）
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { DRAWBOARDS_DIR } from '../config.js';
import { badRequest } from '../utils/http-error.js';

const FILE_PATTERN = /^\/?media\/drawboards\/([A-Za-z0-9_-]+\.json)$/;

/**
 * @param {{ data?: unknown[], path?: string, copyFrom?: string }} payload
 *   path 有值 = 覆盖原画板；没有 = 新建一个文件
 *   copyFrom 有值 = 复制一份已有画板到新文件（粘贴画板块时用）
 */
export function saveDrawboard(payload = {}) {
  const { data, path: relPath, copyFrom } = payload;

  fs.mkdirSync(DRAWBOARDS_DIR, { recursive: true });

  // 复制模式：文档里粘贴画板块时，原块和副本绝不能共用同一个 json ——
  // 保存语义是「有 path 就覆盖」，共用意味着编辑副本会把原图数据覆盖掉。
  if (copyFrom) {
    const match = FILE_PATTERN.exec(String(copyFrom));
    if (!match) throw badRequest('画板路径不合法');
    const source = path.join(DRAWBOARDS_DIR, match[1]);
    if (!fs.existsSync(source)) throw badRequest('原画板不存在');
    const copied = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.json`;
    fs.copyFileSync(source, path.join(DRAWBOARDS_DIR, copied));
    return { path: `media/drawboards/${copied}` };
  }

  if (!Array.isArray(data)) throw badRequest('画板数据必须是数组');

  let fileName;
  if (relPath) {
    const match = FILE_PATTERN.exec(String(relPath));
    if (!match) throw badRequest('画板路径不合法');
    fileName = match[1];
  } else {
    fileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.json`;
  }

  fs.writeFileSync(path.join(DRAWBOARDS_DIR, fileName), JSON.stringify(data));

  return { path: `media/drawboards/${fileName}` };
}
