// ---------------------------------------------------------------------------
// KIMMP Page Factory — routes (PR-A1)
// Mounted by the KIMMP router at /api/admin/kangqore-immp/page-factory.
// ---------------------------------------------------------------------------

import { Router } from 'express';
import { requireAuth, requireRole } from '../../../middleware/rbac';
import { PageFactoryController } from './pageFactory.controller';

const pageFactoryRoutes = Router();

// Public — the dynamic renderer (PR-A2) fetches PUBLISHED pages by slug.
// `*slug` captures multi-segment slugs (e.g. solutions/ai-governance) in Express 5.
pageFactoryRoutes.get('/rendered/*slug', PageFactoryController.rendered);

// Admin — page authoring & lifecycle.
pageFactoryRoutes.get('/meta', requireAuth, requireRole(['ADMIN']), PageFactoryController.meta);
pageFactoryRoutes.get('/pages', requireAuth, requireRole(['ADMIN']), PageFactoryController.list);
pageFactoryRoutes.post('/pages', requireAuth, requireRole(['ADMIN']), PageFactoryController.create);
pageFactoryRoutes.get('/pages/:id', requireAuth, requireRole(['ADMIN']), PageFactoryController.getById);
pageFactoryRoutes.patch('/pages/:id', requireAuth, requireRole(['ADMIN']), PageFactoryController.update);
pageFactoryRoutes.post('/pages/:id/publish', requireAuth, requireRole(['ADMIN']), PageFactoryController.publish);
pageFactoryRoutes.post('/pages/:id/unpublish', requireAuth, requireRole(['ADMIN']), PageFactoryController.unpublish);

// Content generation (PR-C) — KIMMP drafts a page via Claude.
pageFactoryRoutes.post('/generate', requireAuth, requireRole(['ADMIN']), PageFactoryController.generate);

// Missing-page detection (PR-B).
pageFactoryRoutes.post('/opportunities/scan', requireAuth, requireRole(['ADMIN']), PageFactoryController.scanOpportunities);
pageFactoryRoutes.get('/opportunities', requireAuth, requireRole(['ADMIN']), PageFactoryController.listOpportunities);
pageFactoryRoutes.patch('/opportunities/:id', requireAuth, requireRole(['ADMIN']), PageFactoryController.updateOpportunity);

// Publish workflow (PR-D) — page lifecycle audit trail.
pageFactoryRoutes.get('/audit', requireAuth, requireRole(['ADMIN']), PageFactoryController.audit);

export { pageFactoryRoutes };
