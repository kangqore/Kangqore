// ---------------------------------------------------------------------------
// KIMMP → ALIS bridge (Phase 2)
//
// Aggregates KIMMP's behavior profiles ACROSS all leads/conversations into a
// market-level behavioral snapshot — the kind of signal ALIS (executive
// intelligence) wants: "what is the dominant behavioral driver of demand right
// now?". Advisory only: KIMMP exposes the snapshot; ALIS consumes it. KIMMP
// does not write into ALIS's aggregations.
//
// `prisma as any`: the generated client may lack the kimmpBehaviorProfile
// accessor on a fresh checkout.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';

export interface BehaviorMixEntry {
  state: string;
  occurrences: number;
  avgIntensity: number;
  prevalencePct: number;
}

export interface MixEntry {
  key: string;
  count: number;
  pct: number;
}

export interface MarketBehaviorSnapshot {
  windowDays: number;
  profilesAnalyzed: number;
  /** False when KIMMP has no behavior data in the window. */
  available: boolean;
  behaviorMix: BehaviorMixEntry[];
  communicationStyleMix: MixEntry[];
  responseModeMix: MixEntry[];
  /** A derived executive headline for ALIS. */
  marketSignal: string;
  generatedAt: string;
}

/** Maps the dominant behavioral state to an executive demand read. */
const MARKET_SIGNAL: Record<string, string> = {
  URGENCY: 'Buyers are arriving with time pressure — demand is urgency-driven.',
  FRUSTRATION: 'Operational frustration is the dominant driver — demand is pain-led.',
  STRESS: 'Buyers are under operational pressure — assurance-led positioning will resonate.',
  CONFUSION: 'Buyers need clearer explanation — simplified messaging is an opportunity.',
  SKEPTICISM: 'Buyers are evaluating critically — proof and case studies are the gap.',
  TRUST_NEED: 'Trust is the dominant concern — credibility content is the lever.',
  TECHNICAL_DEPTH: 'Buyers are technical — architecture-led content will land.',
  DECISION_READINESS: 'Buyers are decision-ready — conversion capacity is the constraint.',
  BUYING_SERIOUSNESS: 'Serious business buyers dominate — enterprise positioning is warranted.',
};

export class MarketBehaviorSignals {
  /** A market-level behavioral snapshot over the last `windowDays`. */
  static async snapshot(windowDays = 30): Promise<MarketBehaviorSnapshot> {
    const since = new Date(Date.now() - windowDays * 86_400_000);
    let profiles: any[] = [];
    try {
      profiles = await (prisma as any).kimmpBehaviorProfile.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 2000,
      });
    } catch {
      profiles = [];
    }

    const generatedAt = new Date().toISOString();
    if (profiles.length === 0) {
      return {
        windowDays,
        profilesAnalyzed: 0,
        available: false,
        behaviorMix: [],
        communicationStyleMix: [],
        responseModeMix: [],
        marketSignal: 'No behavioral data in this window yet.',
        generatedAt,
      };
    }

    const stateTally = new Map<string, { occ: number; sum: number }>();
    const styleTally = new Map<string, number>();
    const modeTally = new Map<string, number>();
    for (const p of profiles) {
      const states = Array.isArray(p.states) ? p.states : [];
      for (const s of states) {
        const t = stateTally.get(s.type) || { occ: 0, sum: 0 };
        t.occ += 1;
        t.sum += Number(s.intensity) || 0;
        stateTally.set(s.type, t);
      }
      if (p.communicationStyle) {
        styleTally.set(p.communicationStyle, (styleTally.get(p.communicationStyle) || 0) + 1);
      }
      if (p.recommendedResponseMode) {
        modeTally.set(p.recommendedResponseMode, (modeTally.get(p.recommendedResponseMode) || 0) + 1);
      }
    }

    const n = profiles.length;
    const behaviorMix: BehaviorMixEntry[] = [...stateTally.entries()]
      .map(([state, v]) => ({
        state,
        occurrences: v.occ,
        avgIntensity: Number((v.sum / v.occ).toFixed(3)),
        prevalencePct: Number(((v.occ / n) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.occurrences - a.occurrences);

    const toMix = (m: Map<string, number>): MixEntry[] =>
      [...m.entries()]
        .map(([key, count]) => ({ key, count, pct: Number(((count / n) * 100).toFixed(1)) }))
        .sort((a, b) => b.count - a.count);

    return {
      windowDays,
      profilesAnalyzed: n,
      available: true,
      behaviorMix,
      communicationStyleMix: toMix(styleTally),
      responseModeMix: toMix(modeTally),
      marketSignal: behaviorMix[0]
        ? MARKET_SIGNAL[behaviorMix[0].state] || 'Mixed behavioral demand — no single dominant driver.'
        : 'No dominant behavioral pattern.',
      generatedAt,
    };
  }
}
