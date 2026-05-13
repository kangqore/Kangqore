import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { KangqoreVisCronManager } from './KangqoreVisCronManager';

export function mountCronRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), (_req, res) => {
    res.json({ jobs: KangqoreVisCronManager.list() });
  });

  router.post('/:id/enable', requireAuth, requireRole(['ADMIN']), (req, res) => {
    const ok = KangqoreVisCronManager.enable(req.params.id);
    if (!ok) return res.status(404).json({ error: 'unknown job' });
    res.json({ ok });
  });

  router.post('/:id/disable', requireAuth, requireRole(['ADMIN']), (req, res) => {
    const ok = KangqoreVisCronManager.disable(req.params.id);
    if (!ok) return res.status(404).json({ error: 'unknown job' });
    res.json({ ok });
  });

  router.post('/:id/run-now', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json(await KangqoreVisCronManager.runNow(req.params.id));
  });

  app.use('/api/admin/kangqore-vis/cron', router);
}
