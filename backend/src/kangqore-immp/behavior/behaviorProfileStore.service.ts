// ---------------------------------------------------------------------------
// KIMMP — Behavior Profile persistence (PR 1.5)
//
// Persistence is OPTIONAL and degrades gracefully: behavior analysis works
// fully in-memory. Storage only happens when KIMMP_PERSIST=true AND the
// `kimmp_behavior_profiles` table exists (apply the migration with
// `prisma migrate deploy`).
//
// `prisma as any` is used deliberately: the repo has no postinstall
// `prisma generate`, so the generated client may not yet carry the typed
// `kimmpBehaviorProfile` accessor on a fresh checkout. `as any` keeps this
// compile-safe regardless; persistence is a graceful, flag-gated boundary.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { BehaviorProfile } from '../core/types';

/** Optional linkage attached to a stored profile. */
export interface ProfileLink {
  conversationId?: string;
  leadId?: string;
  sessionId?: string;
}

export class BehaviorProfileStore {
  /** Returns the stored row id, or null when persistence is off / unavailable. */
  static async save(profile: BehaviorProfile, link: ProfileLink = {}): Promise<string | null> {
    if (!KimmpFlags.persist()) return null;
    try {
      const row = await (prisma as any).kimmpBehaviorProfile.create({
        data: {
          id: profile.analysisId,
          conversationId: link.conversationId ?? null,
          leadId: link.leadId ?? null,
          sessionId: link.sessionId ?? null,
          analyzedRole: profile.input.analyzedRole,
          messageCount: profile.input.messageCount,
          totalChars: profile.input.totalChars,
          states: profile.states as any,
          communicationStyle: profile.communicationStyle,
          traits: profile.traits as any,
          recommendedResponseMode: profile.recommendedResponseMode,
          emotionalSummary: profile.emotionalSummary,
          tier1Confidence: profile.tier1Confidence,
          tier2Used: profile.tier2Used,
          guardrailFlags: profile.guardrailFlags as any,
          version: profile.version,
        },
      });
      return row.id as string;
    } catch (error) {
      logger.warn(
        'KIMMP profile not persisted (apply the migration or check the DB): ' +
          (error as Error).message
      );
      return null;
    }
  }

  /** Fetch a stored profile by id, or null if not found / persistence unavailable. */
  static async get(id: string): Promise<unknown | null> {
    try {
      return await (prisma as any).kimmpBehaviorProfile.findUnique({ where: { id } });
    } catch {
      return null;
    }
  }

  /**
   * Most-recent-first stored profiles, for shadow-observation review.
   * Returns null if the table is unavailable (migration not yet applied).
   */
  static async recent(limit = 50): Promise<any[] | null> {
    try {
      return await (prisma as any).kimmpBehaviorProfile.findMany({
        orderBy: { createdAt: 'desc' },
        take: Math.min(Math.max(1, limit), 500),
      });
    } catch {
      return null;
    }
  }
}
