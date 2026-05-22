// ---------------------------------------------------------------------------
// KIMMP — Behavior Analysis controller (admin, read-only intelligence)
// ---------------------------------------------------------------------------

import { Request, Response } from 'express';
import logger from '../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { analyzeInputSchema } from '../behavior/behaviorSchema';
import { BehaviorAnalyzer } from '../behavior/behaviorAnalyzer.service';
import { BehaviorProfileStore } from '../behavior/behaviorProfileStore.service';
import {
  KimmpEqoreShadowObserver,
  ShadowObservation,
} from '../eqore-bridge/eqoreShadowObserver.service';
import { KimmpShadowBackfill } from '../eqore-bridge/shadowBackfill.service';
import { LeadBehaviorSummaryService } from '../lead-intelligence-bridge/leadBehaviorSummary.service';

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
      const storedId = await BehaviorProfileStore.save(profile, {
        conversationId: parsed.data.conversationId,
        sessionId: parsed.data.sessionId,
      });

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

    // Prefer durable storage when persistence is on; fall back to the in-memory buffer.
    if (KimmpFlags.persist()) {
      const rows = await BehaviorProfileStore.recent(limit);
      if (rows) {
        return res.json({
          observations: rows.map((r) => this.mapRowToObservation(r)),
          meta: {
            count: rows.length,
            source: 'database',
            shadowEnabled: KimmpFlags.eqoreShadow(),
          },
        });
      }
    }

    const observations = KimmpEqoreShadowObserver.getRecent(limit);
    return res.json({
      observations,
      meta: {
        count: observations.length,
        source: 'memory',
        shadowEnabled: KimmpFlags.eqoreShadow(),
        note: 'In-memory buffer — clears on restart. Set KIMMP_PERSIST=true (after the migration) for durable storage.',
      },
    });
  }

  /** Map a stored kimmp_behavior_profiles row into the compact ShadowObservation shape. */
  private static mapRowToObservation(row: any): ShadowObservation {
    const states = Array.isArray(row.states) ? row.states : [];
    const observedAt =
      row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt);
    return {
      observedAt,
      conversationId: row.conversationId ?? '',
      leadId: row.leadId ?? undefined,
      sessionId: row.sessionId ?? undefined,
      messageCount: row.messageCount ?? 0,
      recommendedResponseMode: row.recommendedResponseMode,
      communicationStyle: row.communicationStyle,
      tier1Confidence: row.tier1Confidence,
      tier2Used: !!row.tier2Used,
      topStates: states.slice(0, 3).map((s: any) => ({
        type: s.type,
        intensity: s.intensity,
        severity: s.severity,
      })),
      traitsAvailable: !!(row.traits && row.traits.available),
      emotionalSummary: row.emotionalSummary ?? '',
      guardrailFlags: Array.isArray(row.guardrailFlags) ? row.guardrailFlags : [],
    };
  }

  /** GET /shadow/backfill — run KIMMP over recent existing eQORE conversations. */
  static async backfill(req: Request, res: Response) {
    if (!KimmpFlags.enabled()) {
      return res.status(503).json({ error: 'KIMMP is disabled (KIMMP_ENABLED=false)' });
    }
    const raw = Number(req.query.limit);
    const limit = Number.isFinite(raw) ? Math.min(Math.max(1, raw), 100) : 25;

    try {
      const started = Date.now();
      const result = await KimmpShadowBackfill.analyzeRecent(limit);
      return res.json({
        ...result,
        meta: {
          latencyMs: Date.now() - started,
          requestedLimit: limit,
          tier2: KimmpFlags.shadowTier2(),
          note:
            result.persisted > 0
              ? `${result.persisted} observation(s) also persisted to the database.`
              : 'Read-only — observations not persisted (KIMMP_PERSIST off or table absent).',
        },
      });
    } catch (error) {
      logger.error('KIMMP shadow backfill failed:', error);
      return res.status(500).json({ error: 'Backfill failed' });
    }
  }

  /** GET /leads/:leadId/behavior — KIMMP's aggregated behavioral read of a lead. */
  static async leadBehavior(req: Request, res: Response) {
    if (!KimmpFlags.enabled()) {
      return res.status(503).json({ error: 'KIMMP is disabled (KIMMP_ENABLED=false)' });
    }
    const summary = await LeadBehaviorSummaryService.forLead(req.params.leadId);
    return res.json({ summary });
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
