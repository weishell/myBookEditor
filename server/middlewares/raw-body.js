// 原始字节体解析：上传封面 / 附件时请求体直接是文件内容，文件名放在 X-Filename 头里
// 这样前端不需要 multipart，后端也不用为它引第三方依赖
import express from 'express';
import { MAX_BODY_BYTES } from '../config.js';

/** type: () => true —— 不论 Content-Type 是 image/png 还是 application/octet-stream 都按 Buffer 收 */
export const rawBody = express.raw({ type: () => true, limit: MAX_BODY_BYTES });
