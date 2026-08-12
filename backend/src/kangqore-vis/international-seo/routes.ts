import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { LocaleTargetService } from './LocaleTargetService';

export function mountInternationalSeoRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { blueprintId, locale } = req.query as { blueprintId?: string; locale?: string };
    res.json({ localeTargets: await LocaleTargetService.list({ blueprintId, locale }) });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await LocaleTargetService.create(req.body);
    res.status(201).json({ localeTarget: created });
  });

  router.patch('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ localeTarget: await LocaleTargetService.update(req.params.id, req.body) });
  });

  router.delete('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    await LocaleTargetService.remove(req.params.id);
    res.status(204).end();
  });

  app.use('/api/admin/kangqore-vis/international-seo', router);
}
