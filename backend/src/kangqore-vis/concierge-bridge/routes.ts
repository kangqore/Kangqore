import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { UnansweredHarvester } from './UnansweredHarvester';
import { QuestionToContent } from './QuestionToContent';

export function mountConciergeBridgeRoutes(app: Express): void {
  const router = Router();

  router.get('/unanswered', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    res.json({ questions: await UnansweredHarvester.topUnanswered(limit) });
  });

  router.post('/convert', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const { question } = req.body || {};
    if (!question) return res.status(422).json({ error: 'question required' });
    res.status(201).json(await QuestionToContent.createBlueprintStub(question));
  });

  app.use('/api/admin/kangqore-vis/concierge', router);
}
