// 媒体路由：POST /api/upload（原始字节上传）、GET /media/**（静态访问）
import { Router } from 'express';
import * as controller from '../controllers/media.controller.js';
import { rawBody } from '../middlewares/raw-body.js';

const router = Router();

router.post('/upload', rawBody, controller.upload);
// 画板：数据单独存文件，文章里只留相对路径
router.post('/drawboards', controller.saveDrawboard);

export default router;
