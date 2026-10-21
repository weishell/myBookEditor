// 本地开发服务：路径与端口配置
// 所有落盘路径都由这里拼出来，避免像 demo/server 那样依赖 cwd（换个目录启动就 404）
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** 数据根目录：本地一切文件都在这下面，且全部按「相对路径」记在索引库里 */
export const DATA_DIR = path.join(ROOT, 'data');
export const ARTICLES_DIR = path.join(DATA_DIR, 'articles');
export const DRAWBOARDS_DIR = path.join(DATA_DIR, 'drawboards');
export const MEDIA_DIR = path.join(DATA_DIR, 'media');
export const IMAGES_DIR = path.join(MEDIA_DIR, 'images');
export const FILES_DIR = path.join(MEDIA_DIR, 'files');
export const VIDEOS_DIR = path.join(MEDIA_DIR, 'videos');

/** 分类/标签这类小配置直接存文本，diff 友好，不入库也能重建索引 */
export const META_FILE = path.join(DATA_DIR, 'meta.json');
/** 索引库：只存元数据，可随时由文件重建（.gitignore 掉） */
export const DB_FILE = path.join(DATA_DIR, 'index.db');

export const PORT = Number(process.env.API_PORT || 3001);

/** 单篇正文上限，防止误传大文件把内存打满 */
export const MAX_BODY_BYTES = 20 * 1024 * 1024;
