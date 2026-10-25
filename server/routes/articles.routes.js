// 文章路由：/api/articles
import { Router } from 'express';
import * as controller from '../controllers/articles.controller.js';

const router = Router();

router.get('/', controller.list);
// 注意：/search 必须注册在 /:id 之前，否则会被当成 id 吞掉
router.get('/search', controller.search);
router.post('/', controller.create);
router.get('/:id', controller.detail);
router.put('/:id', controller.update);
router.patch('/:id/autosave', controller.autosave);
// 阅读计数：进入文章页时 +1（只本地 API 模式生效）
router.post('/:id/reads', controller.recordRead);
router.delete('/:id', controller.remove);

export default router;
