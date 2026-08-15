// ---------------------------------------------------------------------------
// Phase 6.12 + 6.15 — Intent Alignment Service
//
// v1: keyword + category matching (no LLM). Fast enough to run inline on
// every daily plan action and every decision brief.
//
// v2 (post Customer Zero): semantic graph traversal via KimmpMemory embeddings.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';

export interface AlignmentResult {
  intentId:       string
  intentLabel:    string
  objectiveId:    string | null
  objectiveTitle: string | null
  score:          number   // 0–1
}

// ── 5-minute in-process cache ─────────────────────────────────────────────────
let _cached: { intents: any[]; at: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

// Keyword synonyms per category — helps v1 matching surface category-level intent
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  growth:     ['lead', 'revenue', 'sales', 'pipeline', 'enterprise', 'customer', 'acquisition', 'expand', 'market'],
  efficiency: ['cost', 'ebitda', 'margin', 'process', 'automation', 'overhead', 'savings', 'optimize'],
  risk:       ['risk', 'compliance', 'security', 'delivery', 'vulnerability', 'exposure', 'critical'],
  market:     ['competitor', 'tender', 'bid', 'india', 'international', 'region', 'territory', 'segment'],
  people:     ['hire', 'team', 'engineer', 'recruit', 'attrition', 'culture', 'talent', 'hr'],
  product:    ['feature', 'product', 'roadmap', 'release', 'launch', 'platform', '../../waanda', 'kimmp'],
  financial:  ['arr', 'mrr', 'invoice', 'cash', 'overdue', 'budget', 'forecast', 'burn'],
  operational:['project', 'deliverable', 'deadline', 'milestone', 'sprint', 'ops', 'blocker'],
};

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function computeScore(text: string, intent: any): number {
  const tokens = tokenize(text);
  const intentTokens = tokenize(intent.label ?? '');
  const categoryBonus = CATEGORY_KEYWORDS[intent.category] ?? [];

  let score = 0;
  let hits  = 0;

  // Direct token overlap with intent label
  for (const t of intentTokens) {
    if (t.length < 3) continue;
    if (tokens.some(tok => tok.includes(t) || t.includes(tok))) {
      hits++;
      score += 0.3;
    }
  }

  // Category keyword match
  for (const kw of categoryBonus) {
    if (tokens.some(tok => tok.includes(kw) || kw.includes(tok))) {
      score += 0.1;
      hits++;
    }
  }

  if (hits === 0) return 0;

  // Normalise: cap at 1, small bonus when many overlapping tokens
  return Math.min(1, score + (hits >= 3 ? 0.1 : 0));
}

export class IntentAlignmentService {
  /** Return all ACTIVE intents with their parent objective, from cache. */
  static async getActive(): Promise<any[]> {
    if (_cached && Date.now() - _cached.at < CACHE_TTL_MS) return _cached.intents;

    const intents = await (prisma as any).kimmpExecutiveIntent.findMany({
      where:   { status: 'ACTIVE' },
      orderBy: { rank: 'asc' },
      include: { objective: true },
    });

    _cached = { intents, at: Date.now() };
    return intents;
  }

  /** Invalidate the cache (call after any intent write). */
  static invalidateCache(): void {
    _cached = null;
  }

  /**
   * Score `text` against active intents. Returns the best-matching AlignmentResult
   * if score >= 0.2, or null if no match found.
   */
  static async score(text: string): Promise<AlignmentResult | null> {
    const intents = await IntentAlignmentService.getActive();
    if (!intents.length) return null;

    let best: { intent: any; score: number } | null = null;

    for (const intent of intents) {
      const s = computeScore(text, intent);
      if (!best || s > best.score) best = { intent, score: s };
    }

    if (!best || best.score < 0.2) return null;

    const { intent, score } = best;
    return {
      intentId:       intent.id,
      intentLabel:    intent.label,
      objectiveId:    intent.objectiveId ?? null,
      objectiveTitle: intent.objective?.title ?? null,
      score,
    };
  }

  /**
   * Score `text` against a pre-fetched intent array (avoids extra DB roundtrip
   * when caller already has the active intents list).
   */
  static scoreSync(text: string, intents: any[]): AlignmentResult | null {
    if (!intents.length) return null;

    let best: { intent: any; score: number } | null = null;
    for (const intent of intents) {
      const s = computeScore(text, intent);
      if (!best || s > best.score) best = { intent, score: s };
    }

    if (!best || best.score < 0.2) return null;

    const { intent, score } = best;
    return {
      intentId:       intent.id,
      intentLabel:    intent.label,
      objectiveId:    intent.objectiveId ?? null,
      objectiveTitle: intent.objective?.title ?? null,
      score,
    };
  }
}
