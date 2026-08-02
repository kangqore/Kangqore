// Gate 3 — Golden Prompt Set
// 12 prompts across 5 categories. Each defines what a correct response must contain.

export type BenchmarkCategory =
  | 'decision'        // triggers Decision Engine; must return structured decision
  | 'factual'         // general Q&A; must return coherent response + confidence
  | 'navigation'      // intent to navigate; must set navigate field
  | 'explainability'  // decision must include evidence + reasoning + policies
  | 'confidence'      // sanity check; very simple prompts should score > 85
  | 'tool-use'        // S320 — must invoke a specific tool via the S313-S318 tool-calling bridge

export interface BenchmarkExpect {
  hasDecision?:      boolean   // response must (or must not) include a decision object
  hasNavigate?:      boolean   // response must include a navigate path
  hasResponse?:      boolean   // response text must be non-empty
  minConfidence?:    number    // response.confidence must be >= this
  maxConfidence?:    number    // response.confidence must be <= this (sanity)
  minOptions?:       number    // decision.options.length >= this
  minEvidence?:      number    // decision.evidence.length >= this
  hasSituation?:     boolean   // decision.situation must be non-empty
  hasRecommendation?: boolean  // decision.recommendation must be non-empty
  navigateTo?:       string    // navigate field must contain this substring
  expectedTool?:     string    // S320 — response.toolsUsed must include this tool name
}

export interface GoldenPrompt {
  id:          string
  category:    BenchmarkCategory
  prompt:      string
  description: string
  expect:      BenchmarkExpect
  weight:      number   // relative importance in overall gate score (1–3)
}

export const GOLDEN_PROMPTS: GoldenPrompt[] = [

  // ── Category: Decision (must route to Decision Engine) ──────────────────

  {
    id: 'D1', category: 'decision', weight: 3,
    description: 'Hire senior vs junior — classic strategic trade-off',
    prompt: 'Should we hire a senior developer or two junior developers?',
    expect: { hasDecision: true, minOptions: 2, minEvidence: 0, minConfidence: 20 },
  },
  {
    id: 'D2', category: 'decision', weight: 3,
    description: 'Pricing pivot — strategic business decision',
    prompt: 'Should we pivot our pricing model to monthly subscriptions?',
    expect: { hasDecision: true, minOptions: 2, minConfidence: 20 },
  },
  {
    id: 'D3', category: 'decision', weight: 2,
    description: 'Cut vs expand — resource decision',
    prompt: 'Should we cut the marketing budget or expand into a new channel?',
    expect: { hasDecision: true, minOptions: 2, minConfidence: 20 },
  },

  // ── Category: Factual (general Q&A; no decision engine needed) ──────────

  {
    id: 'F1', category: 'factual', weight: 2,
    description: 'Platform status summary — should give coherent overview',
    prompt: 'Give me a status summary of the Kangqore platform.',
    expect: { hasDecision: false, hasResponse: true, minConfidence: 40 },
  },
  {
    id: 'F2', category: 'factual', weight: 1,
    description: 'Open-ended technical question',
    prompt: 'What is the difference between a monolith and microservices architecture?',
    expect: { hasDecision: false, hasResponse: true, minConfidence: 70 },
  },
  {
    id: 'F3', category: 'factual', weight: 1,
    description: 'Business terminology',
    prompt: 'What is ARR and why does it matter for a SaaS business?',
    expect: { hasDecision: false, hasResponse: true, minConfidence: 75 },
  },

  // ── Category: Navigation (must return a navigate path) ───────────────────

  {
    id: 'N1', category: 'navigation', weight: 2,
    description: 'Finance navigation intent',
    prompt: 'Take me to the finance section.',
    expect: { hasNavigate: true, navigateTo: 'finance' },
  },
  {
    id: 'N2', category: 'navigation', weight: 2,
    description: 'Clients navigation intent',
    prompt: 'I want to see the clients dashboard.',
    expect: { hasNavigate: true, navigateTo: 'client' },
  },

  // ── Category: Explainability (decision must be fully structured) ─────────

  {
    id: 'E1', category: 'explainability', weight: 3,
    description: 'Strategic expansion — full decision with situation + recommendation + evidence',
    prompt: 'Evaluate whether we should expand into the US market.',
    expect: {
      hasDecision: true,
      hasSituation: true,
      hasRecommendation: true,
      minOptions: 2,
      minConfidence: 20,
    },
  },
  {
    id: 'E2', category: 'explainability', weight: 3,
    description: 'Risk evaluation — must cite evidence',
    prompt: 'What are the trade-offs of dropping our lowest-revenue client?',
    expect: {
      hasDecision: true,
      hasSituation: true,
      hasRecommendation: true,
      minOptions: 2,
    },
  },

  // ── Category: Confidence Sanity (trivial prompts → high confidence) ──────

  {
    id: 'C1', category: 'confidence', weight: 1,
    description: 'Trivial factual — should score near 100% confidence',
    prompt: 'What is 2 + 2?',
    expect: { hasResponse: true, minConfidence: 85 },
  },
  {
    id: 'C2', category: 'confidence', weight: 1,
    description: 'Self-identity — WAANDA should know who it is',
    prompt: 'Who are you and what can you do?',
    expect: { hasResponse: true, minConfidence: 80 },
  },

  // ── Category: Tool Use (S313-S318 tool-calling bridge) ───────────────────
  // S320 — added from real LlmCallLog traffic analysis: the two highest-volume
  // production paths (orchestrator, KIMMP_SPEAK — ~475 calls combined) are
  // autonomous background dispatches with no golden-prompt-reachable interface,
  // so this expansion targets the genuinely testable gap instead — the S313-S315
  // ontology-action tool bridge and the S318 knowledge-search tool, both live
  // and user-facing via /command but previously at zero eval coverage.

  {
    id: 'T1', category: 'tool-use', weight: 2,
    description: 'Ontology action tool call — GENERATE_INSIGHT (toolCallable, zero-effect, ADMIN-only)',
    prompt: 'Use your tools to generate a system insight right now.',
    expect: { hasResponse: true, expectedTool: 'GENERATE_INSIGHT' },
  },
  {
    id: 'T2', category: 'tool-use', weight: 2,
    description: 'Knowledge-search tool call — S318 search_knowledge_base over the pgvector index',
    prompt: 'Search the knowledge base for information about the BIDS scoring engagement pillars.',
    expect: { hasResponse: true, expectedTool: 'search_knowledge_base' },
  },
]
