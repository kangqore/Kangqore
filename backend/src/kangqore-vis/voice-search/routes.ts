import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { VoiceQueryService } from './VoiceQueryService';

export function mountVoiceSearchRoutes(app: Express): void {
  const router = Router();

  router.get('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { answered, blueprintId } = req.query as { answered?: string; blueprintId?: string };
    res.json({
      queries: await VoiceQueryService.list({
        answered: answered === undefined ? undefined : answered === 'true',
        blueprintId,
      }),
    });
  });

  router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await VoiceQueryService.record(req.body);
    res.status(201).json({ query: created });
  });

  router.post('/:id/answer', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    res.json({ query: await VoiceQueryService.markAnswered(req.params.id, req.body?.speakableSelector) });
  });

  app.use('/api/admin/kangqore-vis/voice-search', router);
}
