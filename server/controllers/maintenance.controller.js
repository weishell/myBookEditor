// 资源维护接口：体检 + 手动清理
import * as maintenanceService from '../services/maintenance.service.js';

/** GET /api/maintenance/orphans —— 只读体检，不改任何文件 */
export function inspect(_req, res) {
  res.json(maintenanceService.inspectOrphans());
}

/** POST /api/maintenance/cleanup —— 手动触发；回收站非空会返回 409 */
export function cleanup(_req, res) {
  res.json(maintenanceService.cleanupOrphans());
}
