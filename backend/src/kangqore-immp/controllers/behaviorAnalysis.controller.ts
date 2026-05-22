// ---------------------------------------------------------------------------
// KIMMP — Behavior Analysis controller (admin, read-only intelligence)
// ---------------------------------------------------------------------------

import { Request, Response } from 'express';
import logger from '../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { analyzeInputSchema } from '../behavior/behaviorSchema';
import { BehaviorAnalyzer } from '../behavior/behaviorAnalyzer.service';
import { BehaviorProfileStore } from '../behavior/behaviorProfileStore.service';
import { KimmpEqoreShadowObserver } from '../eqore-bridge/eqoreShadowObserver.service';

export class BehaviorAnalysisController {
  /** POST /behavior/analyze — analyze conversation text, return a BehaviorProfile. */
  static async analyze(req: Request, res: Response) {
    if (!KimmpFlags.enabled()) {
      return res.status(503).json({ error: 'KIMMP is disabled (KIMMP_ENABLED=false)' });
    }

    const parsed = analyzeInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        error: 'Invalid request body',
        details: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
    }

    try {
      const started = Date.now();
      const profile = await BehaviorAnalyzer.analyze(parsed.data);
      const storedId = await BehaviorProfileStore.save(
        profile,
        parsed.data.conversationId,
        parsed.data.sessionId
      );

      return res.json({
        profile,
        meta: {
          latencyMs: Date.now() - started,
          persisted: storedId !== null,
        },
      });
    } catch (error) {
      logger.error('KIMMP behavior analysis failed:', error);
      return res.status(500).json({ error: 'Behavior analysis failed' });
    }
  }

  /** GET /shadow/observations — recent shadow-mode observations of live eQORE traffic. */
  static async listShadowObservations(req: Request, res: Response) {
    if (!KimmpFlags.enabled()) {
      return res.status(503).json({ error: 'KIMMP is disabled (KIMMP_ENABLED=false)' });
    }
    const raw = Number(req.query.limit);
    const limit = Number.isFinite(raw) ? Math.min(Math.max(1, raw), 500) : 50;
    const observations = KimmpEqoreShadowObserver.getRecent(limit);
    return res.json({
      observations,
      meta: {
        count: observations.length,
        shadowEnabled: KimmpFlags.eqoreShadow(),
        note: 'In-memory buffer — clears on server restart. Durable storage lands with KIMMP persistence (PR 1.5).',
      },
    });
  }

  /** GET /behavior/profiles/:id — fetch a previously stored profile. */
  static async getProfile(req: Request, res: Response) {
    const profile = await BehaviorProfileStore.get(req.params.id);
    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        hint: 'Profiles are only retrievable when KIMMP_PERSIST=true and the migration has run.',
      });
    }
    return res.json({ profile });
  }
}
