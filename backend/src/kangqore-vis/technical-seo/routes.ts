import { Express, Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/rbac';
import { SitemapService } from './SitemapService';
import { RobotsService } from './RobotsService';
import { RedirectService } from './RedirectService';
import { BrokenLinkAuditor } from './BrokenLinkAuditor';
import { botPrerenderMiddleware } from './BotPrerenderService';

export function mountTechnicalSeoRoutes(app: Express): void {
  // Must run before the SPA catch-all: serves static snapshots of service pages
  // to AI/search crawlers that do not execute JavaScript.
  app.use(botPrerenderMiddleware);

  app.get('/sitemap.xml', async (_req, res) => {
    try {
      const xml = await SitemapService.generate();
      res.set('Content-Type', 'application/xml').send(xml);
    } catch (err) {
      console.error('kangqore-vis.sitemap.error', err);
      res.status(500).send('<!-- sitemap unavailable -->');
    }
  });

  app.get('/robots.txt', (_req, res) => {
    res.set('Content-Type', 'text/plain').send(RobotsService.generate());
  });

  const admin = Router();

  admin.get('/redirects', requireAuth, requireRole(['ADMIN']), (_req, res) => {
    res.json({ rules: RedirectService.all() });
  });

  admin.post('/redirects', requireAuth, requireRole(['ADMIN']), (req, res) => {
    const { from, to, status = 301 } = req.body || {};
    if (!from || !to) return res.status(422).json({ error: 'from and to are required' });
    RedirectService.register({ from, to, status });
    res.status(201).json({ ok: true });
  });

  admin.post('/audit/broken-links', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
    const result = await BrokenLinkAuditor.run();
    res.json(result);
  });

  app.use('/api/admin/kangqore-vis/technical-seo', admin);
}
