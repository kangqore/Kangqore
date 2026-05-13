import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { PublishChecklist } from './PublishChecklist';
import { PreflightService } from './PreflightService';
import { AuditLog } from './AuditLog';

export function mountGovernanceRoutes(app: Express): void {
  const router = Router();

  router.post('/checklist/:blueprintId', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ outcomes: await PublishChecklist.run(req.params.blueprintId) });
  });

  router.post('/preflight/:blueprintId', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const result = await PreflightService.canPublish(req.params.blueprintId);
    if (!result.ok) return res.status(422).json(result);
    res.json(result);
  });

  router.get('/mode', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    const { KangqoreVisFlags } = await import('../core/flags');
    res.json({ mode: KangqoreVisFlags.governanceMode() });
  });

  router.get('/audit-log', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    res.json({ entries: await AuditLog.recent(limit) });
  });

  router.post('/audit-log/:id/resolve', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ entry: await AuditLog.resolve(req.params.id) });
  });

  app.use('/api/admin/kangqore-vis/governance', router);
}
