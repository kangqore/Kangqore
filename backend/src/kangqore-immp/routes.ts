// ---------------------------------------------------------------------------
// KIMMP — route registry
//
// PR 1 is a passive, read-only intelligence layer: it analyzes text on demand
// and is NOT yet wired into the live eQORE conversation flow.
// Mounted by backend/src/index.ts at /api/admin/kangqore-immp.
// ---------------------------------------------------------------------------

import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/rbac';
import { KIMMP_VERSION } from './core/types';
import { KimmpFlags } from './core/flags';
import { BehaviorAnalysisController } from './controllers/behaviorAnalysis.controller';

const kangqoreImmpRoutes = Router();

// Health — unauthenticated, mirrors the eQORE health route style.
kangqoreImmpRoutes.get('/health', (_req, res) => {
  res.json({
    module: 'kangqore-immp',
    layer: 'human-behavior-intelligence',
    version: KIMMP_VERSION,
    status: KimmpFlags.enabled() ? 'OK' : 'DISABLED',
    tier2: KimmpFlags.tier2Enabled() ? 'ENABLED' : 'DISABLED',
    reasonerModel: KimmpFlags.reasonerModel(),
    persistence: KimmpFlags.persist() ? 'ENABLED' : 'DISABLED',
  });
});

// Behavior Intelligence — admin only.
kangqoreImmpRoutes.post(
  '/behavior/analyze',
  requireAuth,
  requireRole(['ADMIN']),
  BehaviorAnalysisController.analyze
);

kangqoreImmpRoutes.get(
  '/behavior/profiles/:id',
  requireAuth,
  requireRole(['ADMIN']),
  BehaviorAnalysisController.getProfile
);

// Shadow-mode review (PR 2.5) — recent observations of live eQORE traffic.
kangqoreImmpRoutes.get(
  '/shadow/observations',
  requireAuth,
  requireRole(['ADMIN']),
  BehaviorAnalysisController.listShadowObservations
);

export { kangqoreImmpRoutes };
