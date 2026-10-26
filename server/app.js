// Express 应用装配：中间件 → 静态媒体 → API 路由 → 404 → 错误处理
// 只负责「组装」，不含任何业务逻辑；业务在 services/，HTTP 细节在 controllers/
import express, { Router } from 'express';
import cors from 'cors';
import { MAX_BODY_BYTES } from './config.js';
import apiRoutes from './routes/index.js';
import * as mediaController from './controllers/media.controller.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');

  // 本地前端跑在 5173，跨端口访问 /api 需要允许；生产是静态站，不走这里
  app.use(cors());

  // JSON 正文（文章内容可能较大，上限与上传共用）
  app.use(express.json({ limit: MAX_BODY_BYTES }));

  // /media/** → data/media/ 下的文件（图片、附件、视频）
  // HEAD 也要挂：播放器/浏览器会先探测 Content-Length 与 Range 支持
  const mediaStatic = Router();
  mediaStatic.get('/*splat', mediaController.serve);
  mediaStatic.head('/*splat', mediaController.serve);
  app.use('/media', mediaStatic);

  // 所有接口
  app.use('/api', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
