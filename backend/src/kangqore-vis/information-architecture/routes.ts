import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { HubSpokeService } from './HubSpokeService';
import { UrlPolicy } from './UrlPolicy';
import { InternalLinkGraph } from './InternalLinkGraph';

export function mountInformationArchitectureRoutes(app: Express): void {
  const router = Router();

  router.get('/hubs', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json({ hubs: await HubSpokeService.listHubs() });
  });

  router.post('/hubs', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await HubSpokeService.createHub(req.body);
    res.status(201).json({ hub: created });
  });

  router.post('/spokes', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await HubSpokeService.createSpoke(req.body);
    res.status(201).json({ spoke: created });
  });

  router.get('/url-policy/check', requireAuth, requireRole(['ADMIN']), (req, res) => {
    const url = String(req.query.url ?? '');
    res.json({ url, ...UrlPolicy.validate(url) });
  });

  router.get('/graph', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json(await InternalLinkGraph.build());
  });

  app.use('/api/admin/kangqore-vis/architecture', router);
}
