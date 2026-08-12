import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { CitationTracker } from './CitationTracker';

export function mountGeoRoutes(app: Express): void {
  const router = Router();

  router.get('/citations', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { engine, cited } = req.query as { engine?: string; cited?: string };
    res.json({
      citations: await CitationTracker.list({
        engine,
        cited: cited === undefined ? undefined : cited === 'true',
      }),
    });
  });

  router.post('/citations', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await CitationTracker.record(req.body);
    res.status(201).json({ citation: created });
  });

  router.get('/citations/summary', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json({ summary: await CitationTracker.summaryByEngine() });
  });

  app.use('/api/admin/kangqore-vis/geo', router);
}
