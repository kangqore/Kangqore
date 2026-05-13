import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { PageBlueprintService } from './PageBlueprintService';
import { BlueprintValidator } from './BlueprintValidator';
import { BlueprintImporter } from './BlueprintImporter';

export function mountContentMappingRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { status, pageType } = req.query as { status?: string; pageType?: string };
    const items = await PageBlueprintService.list({ status, pageType });
    res.json({ blueprints: items });
  });

  router.get('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const item = await PageBlueprintService.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'not found' });
    res.json({ blueprint: item });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const validation = BlueprintValidator.validate(req.body, 'draft');
    if (!validation.passed) return res.status(422).json({ failures: validation.failures });
    const created = await PageBlueprintService.create(req.body);
    res.status(201).json({ blueprint: created });
  });

  router.patch('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const updated = await PageBlueprintService.update(req.params.id, req.body);
    res.json({ blueprint: updated });
  });

  router.delete('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    await PageBlueprintService.remove(req.params.id);
    res.status(204).end();
  });

  router.post('/import-seed', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    const result = await BlueprintImporter.importSeed();
    res.json(result);
  });

  app.use('/api/admin/kangqore-vis/blueprints', router);
}
