import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { VisIntelligenceKernel } from './VisIntelligenceKernel';
import { VisOpportunityReader } from './VisOpportunityReader';

export function mountIntelligenceRoutes(app: Express): void {
  const router = Router();

  router.post('/scan', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json(await VisIntelligenceKernel.scanAndCorrelate());
  });

  router.get('/opportunities', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { status } = req.query as { status?: string };
    res.json({ opportunities: await VisOpportunityReader.list(status) });
  });

  router.get('/opportunities/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const opportunity = await VisOpportunityReader.getById(req.params.id);
    if (!opportunity) return res.status(404).json({ error: 'not found' });
    res.json({ opportunity });
  });

  app.use('/api/admin/kangqore-vis/intelligence', router);
}
