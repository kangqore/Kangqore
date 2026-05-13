import { Express, Router } from 'express';
import { MetadataResolver } from './MetadataResolver';
import { OgImageRegistry } from './OgImageRegistry';

export function mountOnPageSeoRoutes(app: Express): void {
  const router = Router();

  router.get('/resolve', async (req, res) => {
    const url = String(req.query.url ?? '/');
    const resolved = await MetadataResolver.resolve(url);
    if (!resolved) return res.status(404).json({ error: 'no blueprint' });
    res.json(resolved);
  });

  router.get('/og-image', (req, res) => {
    const url = String(req.query.url ?? '/');
    res.json({ url, ogImage: OgImageRegistry.get(url) });
  });

  app.use('/api/kangqore-vis/on-page-seo', router);
}
