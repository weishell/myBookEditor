// 路由总装：所有 /api 下的子路由在此挂载，app.js 只认这一个入口
import { Router } from 'express';
import articlesRoutes from './articles.routes.js';
import trashRoutes from './trash.routes.js';
import taxonomyRoutes from './taxonomy.routes.js';
import mediaRoutes from './media.routes.js';
import commentsRoutes from './comments.routes.js';
import systemRoutes from './system.routes.js';
import * as taxonomyController from '../controllers/taxonomy.controller.js';

const router = Router();

// 站点元数据（分类 + 标签），前端启动时第一个请求
router.get('/meta', taxonomyController.meta);

router.use('/articles', articlesRoutes);
router.use('/trash', trashRoutes);
router.use('/comments', commentsRoutes);
router.use('/', taxonomyRoutes);
router.use('/', mediaRoutes);
router.use('/', systemRoutes);

export default router;
