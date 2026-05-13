import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { CtaRegistry } from './CtaRegistry';
import { ConversionTracker } from './ConversionTracker';

export function mountSxoRoutes(app: Express): void {
  const router = Router();

  router.get('/ctas', (_req, res) => {
    res.json({ ctas: CtaRegistry.all() });
  });

  router.post('/track', async (req, res) => {
    await ConversionTracker.record(req.body || {});
    res.status(204).end();
  });

  router.get('/cta-ctr', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json({ rows: await ConversionTracker.ctaCtrByPage() });
  });

  app.use('/api/kangqore-vis/sxo', router);
}
