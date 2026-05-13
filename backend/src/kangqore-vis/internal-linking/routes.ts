import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { LinkSuggester } from './LinkSuggester';
import { LinkClickTracker } from './LinkClickTracker';

export function mountInternalLinkingRoutes(app: Express): void {
  const router = Router();

  router.get('/suggestions/:blueprintId', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    res.json({ suggestions: await LinkSuggester.suggestForBlueprint(req.params.blueprintId, limit) });
  });

  router.post('/track', async (req, res) => {
    await LinkClickTracker.record(req.body || {});
    res.status(204).end();
  });

  app.use('/api/kangqore-vis/links', router);
}
