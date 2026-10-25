// 全文评论路由：/api/comments/:articleId
import { Router } from 'express';
import * as controller from '../controllers/comments.controller.js';

const router = Router();

router.get('/:articleId', controller.list);
router.put('/:articleId', controller.save);

export default router;
