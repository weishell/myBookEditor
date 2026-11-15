// 媒体路由：POST /api/upload（原始字节上传）、GET /media/**（静态访问）
import { Router } from 'express';
import * as controller from '../controllers/media.controller.js';
import { rawBody } from '../middlewares/raw-body.js';

const router = Router();

router.post('/upload', rawBody, controller.upload);
// 外链图片代下载：粘贴网页图片时由服务端抓取落盘（绕过 CORS / 防盗链）
router.post('/upload/remote', controller.uploadRemote);
// 画板：数据单独存文件，文章里只留相对路径
router.post('/drawboards', controller.saveDrawboard);

export default router;
