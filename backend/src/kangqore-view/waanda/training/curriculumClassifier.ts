// ---------------------------------------------------------------------------
// WAANDA Curriculum Classifier
//
// Every training example belongs to a curriculum domain. This classifier
// assigns it at write time using signal priority (system → trigger → tags).
// No LLM call — pure deterministic rule engine. Fast enough to run inline.
//
// Curriculum domains map to the six KIMMP system domains + concierge layer:
//   SALES        — lead intel, pipeline, conversion, competitive
//   REVENUE      — pricing, deal structure, commercial
//   OPERATIONS   — project delivery, workflow, tasks, resource
//   FINANCE      — budget, forecast, spend, P&L
//   GOVERNANCE   — audit, access control, policy, compliance
//   SECURITY     — threat, vulnerability, HANUMANAS, risk
//   EXECUTIVE    — cross-system synthesis, strategic decisions, COIG
//   CONCIERGE    — visitor Q&A that doesn't map to a clear domain
//   PLATFORM     — infrastructure, training, benchmarks, system health
// ---------------------------------------------------------------------------

export type Curriculum =
  | 'SALES'
  | 'REVENUE'
  | 'OPERATIONS'
  | 'GOVERNANCE'
  | 'SECURITY'
  | 'FINANCE'
  | 'EXECUTIVE'
  | 'CONCIERGE'
  | 'PLATFORM'

interface ClassifyParams {
  system?:      string
  trigger?:     string
  source?:      string
  tags?:        string[]
  exampleType?: string
  intent?:      string   // concierge intent label
}

// ─── Concierge intent → curriculum ───────────────────────────────────────────

function fromConciergeIntent(intent?: string, text?: string): Curriculum {
  if (!intent && !text) return 'CONCIERGE'
  const t = String((intent || '') + ' ' + (text || '')).slice(0, 300).toLowerCase()
  if (/(?:pric|cost|fee|package|tier|plan)/.test(t)) return 'REVENUE'
  if (/(?:compet|vs\s|versus|alternativ|better than)/.test(t)) return 'SALES'
  if (t.includes('bids') || t.includes('diagnostic') || t.includes('service') || t.includes('offering') || (t.includes('what') && t.includes('do'))) return 'SALES'
  if (/(?:schedul|meeting|call|book|demo)/.test(t)) return 'SALES'
  if (/(?:deploy|implement|rollout|onboard)/.test(t)) return 'OPERATIONS'
  if (/(?:govern|audit|compliance|policy)/.test(t)) return 'GOVERNANCE'
  return 'CONCIERGE'
}

// ─── System name → curriculum ─────────────────────────────────────────────

const SYSTEM_MAP: Record<string, Curriculum> = {
  ALIS:          'SALES',
  LEAD_INTEL:    'SALES',
  EQORE:         'SALES',
  CONCIERGE:     'CONCIERGE',
  VIS:           'FINANCE',
  SENTINEL:      'SECURITY',
  KIMMP:         'EXECUTIVE',
  ENTERPRISE_TWIN: 'OPERATIONS',
}

// ─── Keyword → curriculum (applied to trigger + tags joined) ──────────────

const KEYWORD_RULES: Array<[RegExp, Curriculum]> = [
  [/lead|pipeline|prospect|sales|conversion|deal|crm|account/i,        'SALES'],
  [/pric|revenue|arr|mrr|forecast|budget|spend|p&l|invoice|billing/i,  'FINANCE'],
  [/project|workflow|task|delivery|milestone|resource|capacity/i,       'OPERATIONS'],
  [/audit|compliance|policy|access|permission|gdpr|kyc|regul/i,         'GOVERNANCE'],
  [/risk|threat|vuln|security|breach|attack|sentinel|hanumanas/i,           'SECURITY'],
  [/strategy|executive|ceo|board|synthesis|decision|coig|ois/i,         'EXECUTIVE'],
  [/benchmark|train|fine.?tune|model|corpus|platform|infra/i,           'PLATFORM'],
  [/simulation|scenario|twin|projection/i,                               'OPERATIONS'],
  [/debate|arbitration|bull|bear/i,                                      'EXECUTIVE'],
  [/hiring|recruit|people|hr|headcount/i,                                'OPERATIONS'],
]

// ─── Public classifier ────────────────────────────────────────────────────

export function classifyCurriculum(params: ClassifyParams): Curriculum {
  const { system, trigger, source, tags = [], exampleType, intent } = params

  // Concierge source → use intent-aware subclassifier
  if (system === 'CONCIERGE' || source === 'concierge') {
    const textForIntent = [trigger, ...(tags ?? [])].filter(Boolean).join(' ')
    return fromConciergeIntent(intent || trigger, textForIntent)
  }

  // Exact system match
  if (system) {
    const sys = system.replace(/^HANUMANAS:/, 'HANUMANAS_')
    if (sys.startsWith('HANUMANAS')) return 'GOVERNANCE'
    if (SYSTEM_MAP[system]) return SYSTEM_MAP[system]
  }

  // SYNTHESIS type is always executive
  if (exampleType === 'SYNTHESIS') return 'EXECUTIVE'

  // Keyword scan over trigger + tags
  const corpus = [trigger, ...(tags ?? [])].filter(Boolean).join(' ')
  for (const [pattern, curriculum] of KEYWORD_RULES) {
    if (pattern.test(corpus)) return curriculum
  }

  // Source-level fallback
  if (source === 'debate')     return 'EXECUTIVE'
  if (source === 'simulation') return 'OPERATIONS'
  if (source === 'decision')   return 'EXECUTIVE'
  if (source === 'memory')     return 'PLATFORM'
  if (source === 'synthetic')  return 'PLATFORM'

  return 'PLATFORM'
}
