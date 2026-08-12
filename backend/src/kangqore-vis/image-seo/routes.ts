import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { ImageAssetService } from './ImageAssetService';

export function mountImageSeoRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { blueprintId } = req.query as { blueprintId?: string };
    res.json({ images: await ImageAssetService.list({ blueprintId }) });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await ImageAssetService.create(req.body);
    res.status(201).json({ image: created });
  });

  router.patch('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ image: await ImageAssetService.update(req.params.id, req.body) });
  });

  router.get('/missing-dimensions', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json({ images: await ImageAssetService.missingDimensions() });
  });

  app.use('/api/admin/kangqore-vis/image-seo', router);
}
