// 媒体路由：POST /api/upload（原始字节上传）、GET /media/**（静态访问）
import { Router } from 'express';
import * as controller from '../controllers/media.controller.js';
import { rawBody } from '../middlewares/raw-body.js';

const router = Router();

router.post('/upload', rawBody, controller.upload);

export default router;
