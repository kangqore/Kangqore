// ---------------------------------------------------------------------------
// KIMMP — Behavior Profile persistence
//
// Persistence is OPTIONAL and degrades gracefully: the analyze endpoint works
// fully in-memory. Storage only happens when KIMMP_PERSIST=true AND the
// `kimmp_behavior_profiles` table exists (i.e. the migration has been run).
//
// `prisma as any` is used deliberately: the `KimmpBehaviorProfile` model ships in
// a later persistence PR. The generated client only gains the typed accessor
// after that migration runs; `as any` keeps this dormant store compile-safe now.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { BehaviorProfile } from '../core/types';

export class BehaviorProfileStore {
  /** Returns the stored row id, or null when persistence is off / unavailable. */
  static async save(
    profile: BehaviorProfile,
    conversationId?: string,
    sessionId?: string
  ): Promise<string | null> {
    if (!KimmpFlags.persist()) return null;
    try {
      const row = await (prisma as any).kimmpBehaviorProfile.create({
        data: {
          id: profile.analysisId,
          conversationId: conversationId ?? null,
          sessionId: sessionId ?? null,
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
        'KIMMP profile not persisted (table missing or DB error — run the migration): ' +
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
}
