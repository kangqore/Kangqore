import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { AuthorRegistry } from './AuthorRegistry';
import { ProofPointService } from './ProofPointService';

export function mountEeatRoutes(app: Express): void {
  const router = Router();

  router.get('/authors', requireAuth, requireRole(['ADMIN']), (_req, res) => {
    res.json({ authors: AuthorRegistry.list() });
  });

  router.get('/proof-points', requireAuth, requireRole(['ADMIN']), (_req, res) => {
    res.json({ proofPoints: ProofPointService.list() });
  });

  app.use('/api/admin/kangqore-vis/eeat', router);
}
