import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { A11yAuditService } from './A11yAuditService';

export function mountAccessibilityRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { resolved, url } = req.query as { resolved?: string; url?: string };
    res.json({
      issues: await A11yAuditService.list({
        resolved: resolved === undefined ? undefined : resolved === 'true',
        url,
      }),
    });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await A11yAuditService.record(req.body);
    res.status(201).json({ issue: created });
  });

  router.post('/:id/resolve', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ issue: await A11yAuditService.resolve(req.params.id) });
  });

  app.use('/api/admin/kangqore-vis/accessibility', router);
}
