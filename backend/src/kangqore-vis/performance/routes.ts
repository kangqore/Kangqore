import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { WebVitalsCollector } from './WebVitalsCollector';
import { CWV_THRESHOLDS } from './PerformanceBudget';

export function mountPerformanceRoutes(app: Express): void {
  app.post('/api/kangqore-vis/perf/cwv', async (req, res) => {
    try {
      await WebVitalsCollector.record(req.body || {});
    } catch (error) {
      console.error('KangqoreVis Performance Record Error:', error);
    }
    res.status(204).end();
  });

  const admin = Router();

  admin.get('/budget', requireAuth, requireRole(['ADMIN']), (_req, res) => {
    res.json({ thresholds: CWV_THRESHOLDS });
  });

  admin.get('/rollup/:metric', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json(await WebVitalsCollector.rollup(req.params.metric));
  });

  app.use('/api/admin/kangqore-vis/performance', admin);
}
