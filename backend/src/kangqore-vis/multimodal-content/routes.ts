import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { ContentAssetService } from './ContentAssetService';

export function mountMultimodalContentRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { blueprintId, format } = req.query as { blueprintId?: string; format?: string };
    res.json({ assets: await ContentAssetService.list({ blueprintId, format }) });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await ContentAssetService.create(req.body);
    res.status(201).json({ asset: created });
  });

  router.get('/coverage/:blueprintId', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json(await ContentAssetService.coverageByBlueprint(req.params.blueprintId));
  });

  app.use('/api/admin/kangqore-vis/multimodal-content', router);
}
