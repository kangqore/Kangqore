import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { SemanticRelevanceService } from './SemanticRelevanceService';

export function mountSemanticSeoRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { blueprintId, isGap } = req.query as { blueprintId?: string; isGap?: string };
    res.json({
      relevance: await SemanticRelevanceService.list({
        blueprintId,
        isGap: isGap === undefined ? undefined : isGap === 'true',
      }),
    });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await SemanticRelevanceService.record(req.body);
    res.status(201).json({ relevance: created });
  });

  router.get('/gaps', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json({ gaps: await SemanticRelevanceService.gaps() });
  });

  app.use('/api/admin/kangqore-vis/semantic-seo', router);
}
