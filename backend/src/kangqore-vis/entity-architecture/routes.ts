import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { EntityService } from './EntityService';
import { EntityImporter } from './EntityImporter';

export function mountEntityArchitectureRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json({ entities: await EntityService.list() });
  });

  router.get('/:slug', async (req, res) => {
    const entity = await EntityService.getBySlug(req.params.slug);
    if (!entity) return res.status(404).json({ error: 'not found' });
    res.json({ entity });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await EntityService.create(req.body);
    res.status(201).json({ entity: created });
  });

  router.post('/link', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { fromSlug, toSlug, kind, weight } = req.body || {};
    if (!fromSlug || !toSlug || !kind) return res.status(422).json({ error: 'fromSlug/toSlug/kind required' });
    const link = await EntityService.linkEntities(fromSlug, toSlug, kind, weight);
    res.status(201).json({ link });
  });

  router.post('/import-seed', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json(await EntityImporter.importSeed());
  });

  app.use('/api/admin/kangqore-vis/entities', router);
}
