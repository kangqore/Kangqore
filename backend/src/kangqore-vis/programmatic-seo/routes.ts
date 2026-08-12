import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { PageTemplateService } from './PageTemplateService';

export function mountProgrammaticSeoRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json({ templates: await PageTemplateService.list() });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await PageTemplateService.create(req.body);
    res.status(201).json({ template: created });
  });

  router.patch('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ template: await PageTemplateService.update(req.params.id, req.body) });
  });

  router.post('/:id/record-generation', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const count = Number(req.body?.count) || 0;
    res.json({ template: await PageTemplateService.recordGeneration(req.params.id, count) });
  });

  router.delete('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    await PageTemplateService.remove(req.params.id);
    res.status(204).end();
  });

  app.use('/api/admin/kangqore-vis/programmatic-seo', router);
}
