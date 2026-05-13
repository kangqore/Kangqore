import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { BacklinkService } from './BacklinkService';
import { OutreachTracker } from './OutreachTracker';
import { DisavowList } from './DisavowList';

export function mountAuthorityRoutes(app: Express): void {
  const router = Router();

  router.get('/backlinks', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const status = req.query.status as string | undefined;
    res.json({ backlinks: await BacklinkService.list({ status }) });
  });

  router.post('/backlinks', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await BacklinkService.record(req.body);
    res.status(201).json({ backlink: created });
  });

  router.post('/backlinks/:id/disavow', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ backlink: await BacklinkService.disavow(req.params.id) });
  });

  router.get('/disavow', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json({ disavowed: await DisavowList.list() });
  });

  router.get('/outreach', requireAuth, requireRole(['ADMIN']), (_req, res) => {
    res.json({ campaigns: OutreachTracker.list() });
  });

  app.use('/api/admin/kangqore-vis/authority', router);
}
