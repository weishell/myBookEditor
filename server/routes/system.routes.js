// 系统路由：/api/health、/api/rebuild（从 JSON 文件重建索引）
import { Router } from 'express';
import * as controller from '../controllers/system.controller.js';

const router = Router();

router.get('/health', controller.health);
router.post('/rebuild', controller.rebuild);

export default router;
