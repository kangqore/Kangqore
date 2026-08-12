import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { LocalListingService } from './LocalListingService';

export function mountLocalSeoRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { city, country } = req.query as { city?: string; country?: string };
    res.json({ listings: await LocalListingService.list({ city, country }) });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await LocalListingService.create(req.body);
    res.status(201).json({ listing: created });
  });

  router.patch('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ listing: await LocalListingService.update(req.params.id, req.body) });
  });

  router.post('/:id/verify', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ listing: await LocalListingService.verify(req.params.id) });
  });

  router.delete('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    await LocalListingService.remove(req.params.id);
    res.status(204).end();
  });

  app.use('/api/admin/kangqore-vis/local-seo', router);
}
