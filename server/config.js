// 全局配置：路径、端口、请求体上限集中在此，其它模块只从这里取，不各自拼路径
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 项目根目录（server/ 的上一级） */
export const ROOT_DIR = path.resolve(__dirname, '..');

/* ---------------- 正文：一篇一个 JSON 文件（真相层） ---------------- */
export const DATA_DIR = path.join(ROOT_DIR, 'data');
/** 文章正文目录：data/articles/<id>.json */
export const ARTICLES_DIR = path.join(DATA_DIR, 'articles');
/** 删除的文章移到 here，可人工恢复 */
export const TRASH_DIR = path.join(DATA_DIR, '.trash');
/** 分类 / 标签（站点元数据） */
export const META_FILE = path.join(DATA_DIR, 'meta.json');

/* ---------------- 媒体文件（图片 / 附件 / 视频） ---------------- */
export const MEDIA_DIR = path.join(DATA_DIR, 'media');
export const IMAGES_DIR = path.join(MEDIA_DIR, 'images');
export const FILES_DIR = path.join(MEDIA_DIR, 'files');
export const VIDEOS_DIR = path.join(MEDIA_DIR, 'videos');
export const COVERS_DIR = path.join(IMAGES_DIR, 'covers');
/** 画板数据：data/media/drawboards/<file>.json，文章里只存相对路径 */
export const DRAWBOARDS_DIR = path.join(MEDIA_DIR, 'drawboards');

/* ---------------- 全文评论：一篇一个 JSON（data/comments/<articleId>.json） ---------------- */
export const COMMENTS_DIR = path.join(DATA_DIR, 'comments');

/* ---------------- 索引库（缓存层，可随时删除重建） ---------------- */
export const DATABASE_DIR = path.join(ROOT_DIR, 'database');
export const DB_FILE = path.join(DATABASE_DIR, 'mybook.db');

/* ---------------- 构建产物：线上静态快照 ---------------- */
export const PUBLIC_DATA_DIR = path.join(ROOT_DIR, 'public', 'data');

/* ---------------- 服务 ---------------- */
export const PORT = Number(process.env.PORT || 3001);
/** 单次请求体上限 20MB（正文 / 图片 / 附件共用） */
export const MAX_BODY_BYTES = 20 * 1024 * 1024;
