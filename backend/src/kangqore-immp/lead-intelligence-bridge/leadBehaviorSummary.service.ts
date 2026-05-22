// ---------------------------------------------------------------------------
// KIMMP → Lead Intelligence bridge (Phase 2)
//
// Surfaces KIMMP's behavioral read of a single lead, aggregated from the
// behavior profiles it already collects (kimmp_behavior_profiles, keyed by
// leadId). This is the SAFE half of the connection — advisory only. KIMMP
// exposes the intelligence; it does NOT mutate eQORE's lead score. Letting
// behavior actually move the score is a later, gated step.
//
// `prisma as any`: the generated client may lack the kimmpBehaviorProfile
// accessor on a fresh checkout.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';

export type SalesPosture = 'HIGH_INTENT' | 'NEEDS_REASSURANCE' | 'EXPLORING' | 'NEUTRAL';

export interface DominantState {
  type: string;
  occurrences: number;
  avgIntensity: number;
}

export interface LeadBehaviorSummary {
  leadId: string;
  /** False when KIMMP has no stored behavior profile for this lead. */
  available: boolean;
  profileCount: number;
  latestAt: string | null;
  latestResponseMode: string | null;
  communicationStyle: string | null;
  dominantStates: DominantState[];
  salesPosture: SalesPosture;
  recommendedApproach: string;
}

const POSTURE_APPROACH: Record<SalesPosture, string> = {
  HIGH_INTENT:
    'This lead shows decision-readiness — move toward concrete next steps and a call.',
  NEEDS_REASSURANCE:
    'This lead appears under operational pressure — lead with stability and assurance before selling.',
  EXPLORING:
    'This lead is still evaluating — provide proof and clarity, and let them explore.',
  NEUTRAL:
    'No strong behavioral signal yet — a standard, helpful approach is appropriate.',
};

export class LeadBehaviorSummaryService {
  /** KIMMP's aggregated behavioral view of one lead. */
  static async forLead(leadId: string, limit = 20): Promise<LeadBehaviorSummary> {
    let profiles: any[] = [];
    try {
      profiles = await (prisma as any).kimmpBehaviorProfile.findMany({
        where: { leadId },
        orderBy: { createdAt: 'desc' },
        take: Math.min(Math.max(1, limit), 100),
      });
    } catch {
      profiles = [];
    }

    if (profiles.length === 0) {
      return {
        leadId,
        available: false,
        profileCount: 0,
        latestAt: null,
        latestResponseMode: null,
        communicationStyle: null,
        dominantStates: [],
        salesPosture: 'NEUTRAL',
        recommendedApproach: POSTURE_APPROACH.NEUTRAL,
      };
    }

    const latest = profiles[0];

    // Tally behavioral states across every profile KIMMP has for this lead.
    const tally = new Map<string, { occ: number; sum: number }>();
    for (const p of profiles) {
      const states = Array.isArray(p.states) ? p.states : [];
      for (const s of states) {
        const t = tally.get(s.type) || { occ: 0, sum: 0 };
        t.occ += 1;
        t.sum += Number(s.intensity) || 0;
        tally.set(s.type, t);
      }
    }
    const dominantStates: DominantState[] = [...tally.entries()]
      .map(([type, v]) => ({
        type,
        occurrences: v.occ,
        avgIntensity: Number((v.sum / v.occ).toFixed(3)),
      }))
      .sort((a, b) => b.occurrences * b.avgIntensity - a.occurrences * a.avgIntensity)
      .slice(0, 5);

    const salesPosture = this.derivePosture(dominantStates);

    return {
      leadId,
      available: true,
      profileCount: profiles.length,
      latestAt: new Date(latest.createdAt).toISOString(),
      latestResponseMode: latest.recommendedResponseMode ?? null,
      communicationStyle: latest.communicationStyle ?? null,
      dominantStates,
      salesPosture,
      recommendedApproach: POSTURE_APPROACH[salesPosture],
    };
  }

  /** Map dominant behavioral states to a sales posture (advisory only). */
  private static derivePosture(states: DominantState[]): SalesPosture {
    const at = (t: string) => states.find((s) => s.type === t)?.avgIntensity ?? 0;
    if (at('DECISION_READINESS') >= 0.4 || at('BUYING_SERIOUSNESS') >= 0.5) return 'HIGH_INTENT';
    if (at('STRESS') >= 0.4 || at('FRUSTRATION') >= 0.4) return 'NEEDS_REASSURANCE';
    if (at('SKEPTICISM') >= 0.4 || at('CONFUSION') >= 0.4) return 'EXPLORING';
    return 'NEUTRAL';
  }
}
