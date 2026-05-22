// ---------------------------------------------------------------------------
// KIMMP — Shadow Backfill (PR 2.6)
//
// Runs the KIMMP behavior analyzer over eQORE conversations that ALREADY exist
// in the database, so an admin can review KIMMP's accuracy on real history
// immediately — instead of waiting for new shadow-mode traffic to accumulate.
//
// Read-first: it always returns the readings in the response. It also persists
// them when KIMMP_PERSIST is on (graceful no-op otherwise). Tier-2 (Claude) is
// off by default to keep a batch run free and fast.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';
import { KimmpFlags } from '../core/flags';
import { BehaviorAnalyzer } from '../behavior/behaviorAnalyzer.service';
import { BehaviorProfileStore } from '../behavior/behaviorProfileStore.service';
import { CommunicationStyle, ResponseMode, Severity } from '../core/types';

export interface BackfillObservation {
  conversationId: string;
  sessionId?: string;
  conversationUpdatedAt: string;
  messageCount: number;
  recommendedResponseMode: ResponseMode;
  communicationStyle: CommunicationStyle;
  tier1Confidence: number;
  tier2Used: boolean;
  topStates: { type: string; intensity: number; severity: Severity }[];
  traitsAvailable: boolean;
  emotionalSummary: string;
  guardrailFlags: string[];
}

export interface BackfillResult {
  analyzed: number;
  skipped: number;
  persisted: number;
  observations: BackfillObservation[];
}

export class KimmpShadowBackfill {
  /** Analyze the most recently updated eQORE conversations and return the readings. */
  static async analyzeRecent(limit: number): Promise<BackfillResult> {
    const conversations = await prisma.eqoreConversation.findMany({
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    const observations: BackfillObservation[] = [];
    let skipped = 0;
    let persisted = 0;

    for (const conv of conversations) {
      const messages = conv.messages.map((m) => ({ role: m.role, content: m.content }));
      const hasUserText = messages.some(
        (m) => m.role.toUpperCase() === 'USER' && m.content.trim().length > 0
      );
      if (!hasUserText) {
        skipped++;
        continue;
      }

      const profile = await BehaviorAnalyzer.analyze(
        {
          messages,
          conversationId: conv.id,
          sessionId: conv.sessionId,
          analyzedRole: 'USER',
        },
        // Tier-2 off by default so a batch backfill stays free and fast.
        { disableTier2: !KimmpFlags.shadowTier2() }
      );

      const storedId = await BehaviorProfileStore.save(profile, {
        conversationId: conv.id,
        sessionId: conv.sessionId,
      });
      if (storedId) persisted++;

      observations.push({
        conversationId: conv.id,
        sessionId: conv.sessionId,
        conversationUpdatedAt: conv.updatedAt.toISOString(),
        messageCount: profile.input.messageCount,
        recommendedResponseMode: profile.recommendedResponseMode,
        communicationStyle: profile.communicationStyle,
        tier1Confidence: profile.tier1Confidence,
        tier2Used: profile.tier2Used,
        topStates: profile.states.slice(0, 3).map((s) => ({
          type: s.type,
          intensity: s.intensity,
          severity: s.severity,
        })),
        traitsAvailable: profile.traits.available,
        emotionalSummary: profile.emotionalSummary,
        guardrailFlags: profile.guardrailFlags,
      });
    }

    return { analyzed: observations.length, skipped, persisted, observations };
  }
}
