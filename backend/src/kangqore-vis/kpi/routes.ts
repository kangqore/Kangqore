import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { KpiAggregator } from './KpiAggregator';
import { KpiSnapshotService } from './KpiSnapshotService';
import { prisma } from '../../lib/prisma';

export function mountKpiRoutes(app: Express): void {
  const router = Router();

  router.get('/overview', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json(await KpiAggregator.overview());
  });

  router.get('/snapshots', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const metric = req.query.metric as string | undefined;
    const snapshots = await prisma.kangqoreVisKpiSnapshot.findMany({
      where: { metric },
      orderBy: { capturedAt: 'desc' },
      take: 200,
    });
    res.json({ snapshots });
  });

  router.post('/snapshot', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    await KpiSnapshotService.snapshot();
    res.status(204).end();
  });

  app.use('/api/admin/kangqore-vis/kpi', router);
}
