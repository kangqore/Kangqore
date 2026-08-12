import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { ExperimentService } from './ExperimentService';

export function mountCroRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { status, blueprintId } = req.query as { status?: string; blueprintId?: string };
    res.json({ experiments: await ExperimentService.list({ status, blueprintId }) });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await ExperimentService.create(req.body);
    res.status(201).json({ experiment: created });
  });

  router.patch('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ experiment: await ExperimentService.update(req.params.id, req.body) });
  });

  router.post('/:id/conclude', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ experiment: await ExperimentService.conclude(req.params.id, req.body?.winner ?? '') });
  });

  app.use('/api/admin/kangqore-vis/cro', router);
}
