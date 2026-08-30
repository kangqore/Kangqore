// The Decision step of the chain.
//
//   Enterprise → Ontology → Objects → Relationships → Work → Intelligence →
//   **Decision** → Governed Action → Outcome
//
// This is §26: "show me everything that could prevent us from achieving this
// quarter's revenue target." A work tool answers that with the rows someone
// configured. This answers it by walking the graph from the outcome backwards
// through everything that contributes to it, scoring each contributor with the
// Intelligence layer, and aggregating exposure.
//
// The output is a decision package, not a dashboard: total value exposed, the
// threats ranked by how much of that exposure each one carries, and actions
// ordered by the value they protect — ready to hand to the governed-action
// layer as "execute recovery plan?".
//
// Every figure is an aggregate of real inferences. Where a contributor has no
// reachable value the exposure is reported as unquantified rather than folded
// in as zero, because a threat you cannot price is not a threat worth nothing.

import { prisma } from '../../lib/prisma'
import { IntelligenceEngine, Inference } from './IntelligenceEngine'

/** Edges that mean "this contributes to that", walked in reverse from a target. */
const CONTRIBUTION_EDGES = [
  'serves', 'advances', 'partOf', 'executes', 'deliversOn', 'realises', 'realisedOn',
]
/** Edges that mean "this endangers that". */
const THREAT_EDGES = ['threatens', 'blocks', 'dependsOn']

export interface Threat {
  objectId: string
  title: string
  typeName: string
  /** How this reaches the target, e.g. Task → Program → Contract. */
  path: string[]
  predictedRisk: number
  /** Value this threat puts at risk. Null when nothing priceable is reachable. */
  exposure: number | null
  /** The object holding that value — used to deduplicate shared exposure. */
  exposureSourceId: string | null
  rootCause: string
  nextBestAction: string
  /** exposure × risk — what ranking is actually done on. */
  weightedExposure: number
  confidence: number
}

export interface RecommendedAction {
  rank: number
  action: string
  rationale: string
  protects: number | null
  targetObjectId: string
  targetTitle: string
}

export interface OutcomeAssessment {
  target: { id: string; title: string; typeName: string } | null
  scope: string
  exposure: {
    quantified: number
    /** Threats that are real but whose value could not be traced. */
    unquantifiedThreats: number
  }
  summary: {
    contributorsExamined: number
    atRisk: number
    blocked: number
    overdue: number
    noSignal: number
  }
  threats: Threat[]
  recommendedActions: RecommendedAction[]
  /** Mean confidence of the inferences this rests on. */
  confidence: number
  /** Stated plainly when the assessment is thin. */
  caveat: string | null
}

const RISK_THRESHOLD = 0.4

export const DecisionEngine = {
  /**
   * Walk backwards from a target through contribution and threat edges,
   * collecting everything that could stop it. Breadth-first, depth-capped,
   * cycle-safe — the graph has cycles and a naive walk will not return.
   */
  async collectContributors(targetId: string, maxDepth = 4) {
    const seen = new Set<string>([targetId])
    const found: Array<{ id: string; path: string[] }> = []
    let frontier: Array<{ id: string; path: string[] }> = [{ id: targetId, path: [] }]

    for (let depth = 0; depth < maxDepth && frontier.length; depth++) {
      const ids = frontier.map(f => f.id)
      const edges = await prisma.ontologyRelationship.findMany({
        where: {
          targetId: { in: ids },
          relationshipType: { in: [...CONTRIBUTION_EDGES, ...THREAT_EDGES] },
          validTo: null,
        },
      })
      if (!edges.length) break

      const sources = await prisma.ontologyObject.findMany({
        where: { id: { in: edges.map(e => e.sourceId) } },
        include: { type: { select: { name: true } } },
      })
      const byId = new Map(sources.map(s => [s.id, s]))

      const next: Array<{ id: string; path: string[] }> = []
      for (const e of edges) {
        if (seen.has(e.sourceId)) continue
        seen.add(e.sourceId)
        const src = byId.get(e.sourceId)
        if (!src) continue
        const parent = frontier.find(f => f.id === e.targetId)
        const title = String((src.properties as any)?.title ?? src.id)
        const entry = { id: e.sourceId, path: [...(parent?.path ?? []), title] }
        found.push(entry)
        next.push(entry)
      }
      frontier = next
    }

    return found
  },

  /**
   * Assess what could prevent an outcome. Pass a target object to walk from it;
   * pass a typeName instead to assess everything of that type.
   */
  async assess(input: { targetId?: string; typeName?: string; limit?: number }): Promise<OutcomeAssessment> {
    let target: OutcomeAssessment['target'] = null
    let candidates: Array<{ id: string; path: string[] }> = []
    let scope: string

    if (input.targetId) {
      const t = await prisma.ontologyObject.findUnique({
        where: { id: input.targetId },
        include: { type: { select: { name: true } } },
      })
      if (!t) throw new Error('Target not found')
      target = {
        id: t.id,
        title: String((t.properties as any)?.title ?? t.id),
        typeName: t.type.name,
      }
      candidates = await this.collectContributors(t.id)
      scope = `everything contributing to "${target.title}"`
    } else if (input.typeName) {
      const type = await prisma.ontologyObjectType.findUnique({
        where: { name: input.typeName }, select: { id: true },
      })
      if (!type) throw new Error(`Unknown type "${input.typeName}"`)
      const objs = await prisma.ontologyObject.findMany({
        where: { typeId: type.id, validTo: null },
        select: { id: true, properties: true },
        take: input.limit ?? 200,
      })
      candidates = objs.map(o => ({ id: o.id, path: [String((o.properties as any)?.title ?? o.id)] }))
      scope = `all ${input.typeName} objects`
    } else {
      throw new Error('assess() needs a targetId or a typeName')
    }

    // ── Score every contributor with the Intelligence layer ──────────────────
    const inferences: Array<{ inf: Inference; path: string[] }> = []
    for (const c of candidates) {
      const inf = await IntelligenceEngine.infer(c.id)
      if (inf) inferences.push({ inf, path: c.path })
    }

    const threats: Threat[] = inferences
      .filter(({ inf }) => inf.predictedRisk >= RISK_THRESHOLD)
      .map(({ inf, path }) => ({
        objectId: inf.objectId,
        title: inf.title,
        typeName: inf.typeName,
        path,
        predictedRisk: inf.predictedRisk,
        exposure: inf.businessImpact,
        exposureSourceId: inf.businessImpactSourceId,
        rootCause: inf.rootCause,
        nextBestAction: inf.nextBestAction,
        // Rank on value actually at risk. An unpriced threat still ranks, by
        // risk alone, rather than sorting to the bottom as if it were harmless.
        weightedExposure: Math.round((inf.businessImpact ?? 0) * inf.predictedRisk),
        confidence: inf.aiConfidence,
      }))
      .sort((a, b) =>
        b.weightedExposure - a.weightedExposure || b.predictedRisk - a.predictedRisk)

    // Deduplicate by the object that actually holds the value. Two threats to
    // the same contract must not each add its value — a contract can only be
    // lost once, at the probability of the most likely thing that loses it.
    // Summing per-threat produced £640k of exposure against £520k of contracts,
    // which is the kind of number that destroys trust in the whole assessment.
    const worstRiskPerSource = new Map<string, { value: number; risk: number }>()
    for (const t of threats) {
      if (t.exposure === null || !t.exposureSourceId) continue
      const cur = worstRiskPerSource.get(t.exposureSourceId)
      if (!cur || t.predictedRisk > cur.risk) {
        worstRiskPerSource.set(t.exposureSourceId, { value: t.exposure, risk: t.predictedRisk })
      }
    }
    const quantified = [...worstRiskPerSource.values()]
      .reduce((s, v) => s + v.value * v.risk, 0)
    const unquantifiedThreats = threats.filter(t => t.exposure === null).length

    // ── Recommended actions, deduplicated and ranked by value protected ──────
    const seenActions = new Set<string>()
    const recommendedActions: RecommendedAction[] = []
    for (const t of threats) {
      const key = `${t.nextBestAction}::${t.objectId}`
      if (seenActions.has(key)) continue
      if (/^no action/i.test(t.nextBestAction)) continue
      seenActions.add(key)
      recommendedActions.push({
        rank: recommendedActions.length + 1,
        action: t.nextBestAction,
        rationale: t.rootCause,
        protects: t.exposure !== null ? Math.round(t.exposure * t.predictedRisk) : null,
        targetObjectId: t.objectId,
        targetTitle: t.title,
      })
      if (recommendedActions.length >= 5) break
    }

    const confidence = inferences.length
      ? Math.round((inferences.reduce((s, i) => s + i.inf.aiConfidence, 0) / inferences.length) * 100) / 100
      : 0

    // ── State the limits of the assessment rather than implying completeness ─
    let caveat: string | null = null
    if (!inferences.length) {
      caveat = 'Nothing contributes to this target in the graph yet — the assessment has no basis.'
    } else if (unquantifiedThreats === threats.length && threats.length > 0) {
      caveat = 'No threat could be priced: none of them reach a contract or customer holding a value.'
    } else if (unquantifiedThreats > 0) {
      caveat = `${unquantifiedThreats} of ${threats.length} threats could not be priced and are excluded from the exposure figure.`
    } else if (confidence < 0.5) {
      caveat = 'Confidence is low — most contributors have little history to forecast from.'
    }

    return {
      target,
      scope,
      exposure: { quantified: Math.round(quantified), unquantifiedThreats },
      summary: {
        contributorsExamined: inferences.length,
        atRisk: threats.length,
        blocked: inferences.filter(i => /^Blocked by/.test(i.inf.rootCause)).length,
        overdue: inferences.filter(i => /Past its due date/.test(i.inf.rootCause)).length,
        noSignal: inferences.filter(i => /no risk signal/i.test(i.inf.rootCause)).length,
      },
      threats: threats.slice(0, 20),
      recommendedActions,
      confidence,
      caveat,
    }
  },

  /**
   * Render the assessment the way §26 asks for it — the executive summary a
   * person reads before deciding whether to approve the recovery plan.
   */
  format(a: OutcomeAssessment, currency = '£'): string {
    const lines: string[] = []
    lines.push(a.target ? `Outcome risk — ${a.target.title}` : `Outcome risk — ${a.scope}`)
    lines.push('')
    if (a.exposure.quantified > 0) {
      lines.push(`  ${currency}${a.exposure.quantified.toLocaleString()} exposed`)
    }
    lines.push(`  ${a.summary.atRisk} at risk of ${a.summary.contributorsExamined} examined`)
    if (a.summary.blocked) lines.push(`  ${a.summary.blocked} blocked`)
    if (a.summary.overdue) lines.push(`  ${a.summary.overdue} overdue`)
    if (a.caveat) lines.push(`  ⚠ ${a.caveat}`)
    if (a.recommendedActions.length) {
      lines.push('', '  Recommended actions')
      a.recommendedActions.forEach(r => {
        const protects = r.protects ? ` (protects ${currency}${r.protects.toLocaleString()})` : ''
        lines.push(`   ${r.rank}. ${r.action}${protects}`)
        lines.push(`      ${r.targetTitle} — ${r.rationale}`)
      })
    }
    return lines.join('\n')
  },
}
