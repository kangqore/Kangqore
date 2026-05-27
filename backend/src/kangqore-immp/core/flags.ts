// ---------------------------------------------------------------------------
// KIMMP — feature flags & tunables (env-driven, same convention as kangqore-vis)
// ---------------------------------------------------------------------------

function bool(name: string, defaultValue: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  const v = raw.toLowerCase().trim();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

function num(name: string, defaultValue: number): number {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  const n = Number(raw);
  return Number.isFinite(n) ? n : defaultValue;
}

export const KimmpFlags = {
  /** Master switch for the whole module. */
  enabled: () => bool('KIMMP_ENABLED', true),

  /** Allow the Tier-2 Claude reasoning pass. When false, Tier-1 only. */
  tier2Enabled: () => bool('KIMMP_TIER2_ENABLED', true),

  /** Persist behavior profiles to Postgres. Keep false until the migration runs. */
  persist: () => bool('KIMMP_PERSIST', false),

  /** Anthropic model used for the Tier-2 reasoning pass. */
  reasonerModel: () => process.env.KIMMP_REASONER_MODEL || 'claude-haiku-4-5-20251001',

  /** Anthropic model used for Page Factory content generation (PR-C). */
  generatorModel: () => process.env.KIMMP_GENERATOR_MODEL || 'claude-sonnet-4-6',

  /** Escalate to Tier-2 when Tier-1 aggregate confidence falls below this. */
  tier2ConfidenceFloor: () => num('KIMMP_TIER2_CONFIDENCE_FLOOR', 0.55),

  /** Minimum analyzed characters before Big Five traits may be estimated. */
  traitMinChars: () => num('KIMMP_TRAIT_MIN_CHARS', 600),

  /** Minimum analyzed messages before Big Five traits may be estimated. */
  traitMinMessages: () => num('KIMMP_TRAIT_MIN_MESSAGES', 4),

  /** PR 2 — observe eQORE conversations in shadow mode (analyze + log, no response change). */
  eqoreShadow: () => bool('KIMMP_EQORE_SHADOW', true),

  /** Allow the Tier-2 Claude pass during shadow observation. Off by default to bound cost. */
  shadowTier2: () => bool('KIMMP_SHADOW_TIER2', false),

  /** PR 2b — let KIMMP's behavior reading shape eQORE responses. OFF by default. */
  eqoreInfluence: () => bool('KIMMP_EQORE_INFLUENCE', false),

  /** Size of the in-memory recent-shadow-observation buffer (PR 2.5). */
  shadowBufferSize: () => num('KIMMP_SHADOW_BUFFER', 200),

  /** Phase 2 — KIMMP behavior adds bonus points to Lead Intelligence score. OFF by default.
   *  Enable only after KIMMP's behavior reading is validated on real traffic. */
  scoreBridgeEnabled: () => bool('KIMMP_SCORE_BRIDGE', false),

  /** Phase 5 — RAG: ground KIMMP reasoning in Kangqore's KB. OFF by default.
   *  Enable once VOYAGE_API_KEY is set and the KB index is populated. */
  ragEnabled: () => bool('KIMMP_RAG_ENABLED', false),

  /** Phase 5 — run and store v0 predictions per lead. OFF by default.
   *  Enable after the migration is applied. */
  predictionsEnabled: () => bool('KIMMP_PREDICTIONS_ENABLED', false),
};

export function logKimmpFlagSummary(): void {
  console.log(
    `   -> KIMMP flags: ${JSON.stringify({
      enabled: KimmpFlags.enabled(),
      tier2: KimmpFlags.tier2Enabled(),
      persist: KimmpFlags.persist(),
      reasonerModel: KimmpFlags.reasonerModel(),
    })}`
  );
}
