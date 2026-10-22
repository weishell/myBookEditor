// 后端入口：初始化目录 → 打开索引库 → 从 JSON 文件重建索引 → 启动 HTTP
// 数据分层：正文 data/articles/*.json（真相）、分类标签 data/meta.json（真相）、
//           database/mybook.db（纯索引缓存，删了会自动重建）
import fs from 'node:fs';
import {
  ARTICLES_DIR,
  COVERS_DIR,
  DB_FILE,
  FILES_DIR,
  IMAGES_DIR,
  PORT,
  TRASH_DIR,
  VIDEOS_DIR,
} from './config.js';
import { getDb, closeDb, dbFileInfo } from './db/index.js';
import { rebuildIndex } from './db/rebuild.js';
import { createApp } from './app.js';

for (const dir of [ARTICLES_DIR, TRASH_DIR, IMAGES_DIR, FILES_DIR, VIDEOS_DIR, COVERS_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

getDb();
const rebuilt = rebuildIndex();
console.log(
  `📚 索引重建完成：${rebuilt.articles} 篇 / ${rebuilt.categories} 分类 / ${rebuilt.tags} 标签`,
);
console.log(`   正文目录：${ARTICLES_DIR}`);
console.log(`   索引缓存：${DB_FILE}（${dbFileInfo().sizeBytes} 字节，可随时删除重建）`);

const app = createApp();
const server = app.listen(PORT, () => {
  console.log(`🚀 API 已启动：http://localhost:${PORT}/api/health`);
});

const shutdown = (signal) => {
  console.log(`\n${signal} 收到，正在关闭…`);
  server.close(() => {
    closeDb();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
