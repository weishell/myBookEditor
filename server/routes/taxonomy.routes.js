// 分类 / 标签路由：/api/categories、/api/tags
import { Router } from 'express';
import * as controller from '../controllers/taxonomy.controller.js';
import { rawBody } from '../middlewares/raw-body.js';

const router = Router();

/* ---------------- 分类 ---------------- */
router.post('/categories', controller.createCategory);
router.put('/categories/:id', controller.updateCategory);
router.delete('/categories/:id', controller.deleteCategory);
router.post('/categories/:id/cover', rawBody, controller.uploadCover);

/* ---------------- 标签 ---------------- */
router.post('/tags', controller.createTag);
router.put('/tags/:id', controller.updateTag);
router.delete('/tags/:id', controller.deleteTag);

export default router;
