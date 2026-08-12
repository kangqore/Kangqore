import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { PriorityRegistryService } from './PriorityRegistryService';
import { PriorityRegistryImporter } from './PriorityRegistryImporter';

export function mountPriorityRegistryRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { active } = req.query as { active?: string };
    res.json({
      entries: await PriorityRegistryService.list({
        active: active === undefined ? undefined : active === 'true',
      }),
    });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await PriorityRegistryService.create(req.body);
    res.status(201).json({ entry: created });
  });

  router.patch('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ entry: await PriorityRegistryService.update(req.params.id, req.body) });
  });

  router.delete('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    await PriorityRegistryService.remove(req.params.id);
    res.status(204).end();
  });

  router.post('/import-taxonomy', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json(await PriorityRegistryImporter.importFromTaxonomy());
  });

  app.use('/api/admin/kangqore-vis/priority-registry', router);
}
