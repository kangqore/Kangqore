import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { DataSourceRegistry } from './DataSourceRegistry';
import { OutcomeSyncService } from './OutcomeSyncService';

export function mountDataSourcesRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    const report = await DataSourceRegistry.report();
    res.json({ sources: report });
  });

  router.post('/sync', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json(await OutcomeSyncService.syncAll());
  });

  app.use('/api/admin/kangqore-vis/sources', router);
}
