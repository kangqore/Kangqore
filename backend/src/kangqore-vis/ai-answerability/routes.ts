import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { FaqBank } from './FaqBank';
import { SnippetBank } from './SnippetBank';
import { LlmsTxtGenerator } from './LlmsTxtGenerator';

export function mountAiAnswerabilityRoutes(app: Express): void {
  app.get('/llms.txt', async (_req, res) => {
    try {
      const txt = await LlmsTxtGenerator.generate();
      res.set('Content-Type', 'text/plain').send(txt);
    } catch (err) {
      console.error('kangqore-vis.llms.txt.error', err);
      res.status(500).send('# llms.txt unavailable');
    }
  });

  const router = Router();

  router.get('/faqs', async (req, res) => {
    const { category, blueprintId } = req.query as { category?: string; blueprintId?: string };
    res.json({ faqs: await FaqBank.list({ categorySlug: category, blueprintId }) });
  });

  router.post('/faqs', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    const created = await FaqBank.addFaq(req.body);
    res.status(201).json({ faq: created });
  });

  router.post('/faqs/import-kb', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    res.json(await FaqBank.importFromKB());
  });

  router.get('/snippets', (_req, res) => {
    res.json({ snippets: SnippetBank.list() });
  });

  app.use('/api/kangqore-vis/answerability', router);
}
