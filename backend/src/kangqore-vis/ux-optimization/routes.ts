import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { UxFindingService } from './UxFindingService';

export function mountUxOptimizationRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { resolved, blueprintId } = req.query as { resolved?: string; blueprintId?: string };
    res.json({
      findings: await UxFindingService.list({
        resolved: resolved === undefined ? undefined : resolved === 'true',
        blueprintId,
      }),
    });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await UxFindingService.create(req.body);
    res.status(201).json({ finding: created });
  });

  router.post('/:id/resolve', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ finding: await UxFindingService.resolve(req.params.id) });
  });

  app.use('/api/admin/kangqore-vis/ux-optimization', router);
}
