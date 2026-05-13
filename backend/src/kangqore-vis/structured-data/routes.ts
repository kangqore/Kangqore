import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { SchemaRegistry, DEFAULT_SCHEMAS_BY_TYPE } from './SchemaRegistry';
import { SchemaContentAuditor } from './SchemaContentAuditor';
import { prisma } from '../../lib/prisma';

export function mountStructuredDataRoutes(app: Express): void {
  const router = Router();

  router.get('/registry', requireAuth, requireRole(['ADMIN']), (_req, res) => {
    res.json({
      kinds: Object.keys(SchemaRegistry),
      defaultsByPageType: DEFAULT_SCHEMAS_BY_TYPE,
    });
  });

  router.get('/blueprint/:id', async (req, res) => {
    const records = await prisma.kangqoreVisSchemaRecord.findMany({
      where: { blueprintId: req.params.id },
    });
    res.json({ records });
  });

  router.post('/audit', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    const results = await SchemaContentAuditor.audit();
    res.json({ results });
  });

  app.use('/api/admin/kangqore-vis/structured-data', router);
}
