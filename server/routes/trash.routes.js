// 回收站路由：/api/trash
import { Router } from 'express';
import * as controller from '../controllers/trash.controller.js';

const router = Router();

router.get('/', controller.list);
router.post('/restore', controller.restore);
router.delete('/', controller.purge);

export default router;
