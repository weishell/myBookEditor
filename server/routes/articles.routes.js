// 文章路由：/api/articles
import { Router } from 'express';
import * as controller from '../controllers/articles.controller.js';

const router = Router();

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.detail);
router.put('/:id', controller.update);
router.patch('/:id/autosave', controller.autosave);
router.delete('/:id', controller.remove);

export default router;
