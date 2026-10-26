// 资源维护路由：/api/maintenance
import { Router } from 'express';
import * as controller from '../controllers/maintenance.controller.js';

const router = Router();

router.get('/orphans', controller.inspect);
router.post('/cleanup', controller.cleanup);

export default router;
