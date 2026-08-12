import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { VideoAssetService } from './VideoAssetService';

export function mountVideoSeoRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { blueprintId } = req.query as { blueprintId?: string };
    res.json({ videos: await VideoAssetService.list({ blueprintId }) });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await VideoAssetService.create(req.body);
    res.status(201).json({ video: created });
  });

  router.patch('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ video: await VideoAssetService.update(req.params.id, req.body) });
  });

  app.use('/api/admin/kangqore-vis/video-seo', router);
}
