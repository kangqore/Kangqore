// AI as a computed enterprise attribute.
//
// Seven INTELLIGENCE columns were removed from the object model because they
// were declared and nothing computed them — empty columns on every board. This
// is the half that was missing: a field definition saying what to compute, from
// which inputs, how often, at what confidence, and under which governance tier.
//
// Two compute modes, and the distinction is load-bearing:
//
//   DERIVED     arithmetic over the graph and the intelligence engine. No model
//               call, deterministic, cheap enough to run across a whole type.
//   GENERATIVE  needs a language model — a summary, a classification, sentiment.
//
// The rule that keeps this honest: **a field that cannot compute writes
// nothing**. If the model is unreachable, or an input is absent, or a
// classification comes back outside its permitted options, the run is recorded
// as SKIPPED or FAILED with a reason and the object keeps whatever it had. A
// column that shows a plausible wrong number is worse than an empty one, which
// is the whole reason those seven were deleted.

import { prisma } from '../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR, type GatewayActor } from './OntologyGateway'
import { IntelligenceEngine } from './IntelligenceEngine'
import { ModelIntrospection } from './ModelIntrospection'
import { routedCall } from '../kimmp/llm/kimmpLLMRouter'

/** The actor computed fields write as, so the audit trail separates them. */
const FIELD_ACTOR: GatewayActor = { id: 'intelligence-field', type: 'SYSTEM', clearances: [] }

export type FieldKind =
  | 'SUMMARY' | 'CLASSIFY' | 'SENTIMENT' | 'SCORE' | 'RECOMMEND' | 'FORECAST'

/**
 * Governance tiers. Tier 3 and above is advisory: the field may recommend, and
 * may never be the thing that decides. Tier 5 — a field that takes an external
 * action — is deliberately not implementable here; that path exists already and
 * runs through AgentMissionEngine's approval gate.
 */
export const TIERS: Record<number, string> = {
  // Tiers describe how much AUTHORITY a field's output carries, not which
  // technique produced it — a score and a label sit at the same tier because
  // they warrant the same scrutiny, however differently they are computed.
  0: 'Formatting — no inference',
  1: 'Descriptive — restates what is already recorded',
  2: 'Analytical — derives a value or label from existing data',
  3: 'Advisory — recommends an action; never decides',
  4: 'Decision support — informs a decision, and must state its evidence',
  5: 'External action — not available as a field; use a governed mission',
}

export interface ComputeResult {
  status: 'OK' | 'SKIPPED' | 'FAILED'
  value?: any
  confidence?: number
  evidence: string[]
  reasoning?: string
  model?: string
  error?: string
}

// ── Derived computations ─────────────────────────────────────────────────────
// Each reads the graph and the intelligence engine. No model, no invention: if
// the inference has nothing to say, the field says nothing.

async function computeDerived(field: any, objectId: string): Promise<ComputeResult> {
  const inf = await IntelligenceEngine.infer(objectId)
  if (!inf) return { status: 'SKIPPED', evidence: [], error: 'Object could not be inferred over' }

  switch (field.outputField) {
    case 'predictedRisk':
      return { status: 'OK', value: inf.predictedRisk, confidence: inf.aiConfidence, evidence: inf.evidence }
    case 'predictedCompletion':
      return inf.predictedCompletion
        ? { status: 'OK', value: inf.predictedCompletion, confidence: inf.aiConfidence, evidence: inf.evidence }
        : { status: 'SKIPPED', evidence: inf.evidence, error: 'No velocity history to forecast from' }
    case 'businessImpact':
      return inf.businessImpact !== null
        ? {
            status: 'OK', value: inf.businessImpact, confidence: inf.aiConfidence,
            evidence: [...inf.evidence, `value reached from ${inf.businessImpactSourceId}`],
          }
        // Unreachable value is not zero value — reporting 0 here would price a
        // threat at nothing.
        : { status: 'SKIPPED', evidence: inf.evidence, error: 'No priceable value is reachable in the graph' }
    case 'rootCause':
      return { status: 'OK', value: inf.rootCause, confidence: inf.aiConfidence, evidence: inf.evidence }
    case 'nextBestAction':
      return { status: 'OK', value: inf.nextBestAction, confidence: inf.aiConfidence, evidence: inf.evidence }
    case 'anomalyScore':
      return inf.anomalyScore !== null
        ? { status: 'OK', value: inf.anomalyScore, confidence: inf.aiConfidence, evidence: inf.evidence }
        : { status: 'SKIPPED', evidence: inf.evidence, error: 'Too few peers to judge an anomaly' }
    case 'aiConfidence':
      return { status: 'OK', value: inf.aiConfidence, confidence: 1, evidence: inf.evidence }
    default:
      return { status: 'FAILED', evidence: [], error: `No derived computation for "${field.outputField}"` }
  }
}

/**
 * The context a generative field reasons over. This is the difference from
 * passing a handful of cells to a model: the object's own properties, plus the
 * types it is connected to and how, drawn from the relationship graph.
 */
async function buildContext(field: any, objectId: string) {
  const obj = await prisma.ontologyObject.findUnique({
    where: { id: objectId }, include: { type: { select: { name: true } } },
  })
  if (!obj) return null
  const props = (obj.properties ?? {}) as any

  const inputs = (field.inputs as string[]) ?? []
  const chosen = inputs.length
    ? Object.fromEntries(inputs.filter(k => props[k] !== undefined).map(k => [k, props[k]]))
    : props

  const lines = [
    `${obj.type.name}: ${props.title ?? props.name ?? objectId}`,
    ...Object.entries(chosen).map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`),
  ]

  // Related objects, one hop, limited to the types the field declared.
  const wantTypes = (field.relatedTypes as string[]) ?? []
  if (wantTypes.length) {
    const edges = await prisma.ontologyRelationship.findMany({
      where: { OR: [{ sourceId: objectId }, { targetId: objectId }], validTo: null },
      take: 50,
    })
    const otherIds = edges.map(e => (e.sourceId === objectId ? e.targetId : e.sourceId))
    const others = await prisma.ontologyObject.findMany({
      where: { id: { in: otherIds } }, include: { type: { select: { name: true } } },
    })
    const related = others.filter(o => wantTypes.includes(o.type.name))
    if (related.length) {
      lines.push('Related:')
      for (const r of related.slice(0, 15)) {
        const rp = (r.properties ?? {}) as any
        const edge = edges.find(e => e.sourceId === r.id || e.targetId === r.id)
        lines.push(`  ${r.type.name} "${rp.title ?? rp.name ?? r.id}" via ${edge?.relationshipType ?? 'link'}`)
      }
    }
  }

  return { text: lines.join('\n'), typeName: obj.type.name, propertyCount: Object.keys(chosen).length }
}

async function computeGenerative(field: any, objectId: string): Promise<ComputeResult> {
  const ctx = await buildContext(field, objectId)
  if (!ctx) return { status: 'SKIPPED', evidence: [], error: 'Object not found' }
  if (ctx.propertyCount === 0) {
    return { status: 'SKIPPED', evidence: [], error: 'The object carries none of the declared inputs' }
  }

  const options = (field.options as string[]) ?? []
  const constraint = options.length
    ? `\nAnswer with EXACTLY ONE of these values and nothing else: ${options.join(', ')}.`
    : '\nAnswer in at most two sentences.'

  const system =
    'You are computing one field of an enterprise record. Use only the supplied context. ' +
    'If the context does not support an answer, reply exactly: INSUFFICIENT_CONTEXT.' + constraint

  let out: any
  try {
    out = await routedCall(
      'claude-haiku-4-5-20251001',
      system,
      `${field.instruction}\n\n---\n${ctx.text}`,
      options.length ? 20 : 220,
      { agentType: 'intelligence-field', tags: ['intelligence-field', field.key] },
    )
  } catch (e: any) {
    // No model reachable is a failure to compute, never a reason to guess.
    return { status: 'FAILED', evidence: [], error: `Model unavailable: ${e?.message ?? e}` }
  }

  const text = String(out?.text ?? out?.content ?? '').trim()
  if (!text) return { status: 'FAILED', evidence: [], error: 'Model returned nothing' }
  if (/INSUFFICIENT_CONTEXT/i.test(text)) {
    return { status: 'SKIPPED', evidence: [], error: 'Model judged the context insufficient' }
  }

  // A classification outside its permitted set is rejected. This is the guard
  // that stops a "sentiment" column filling with prose.
  if (options.length) {
    const match = options.find(o => text.toUpperCase().includes(o.toUpperCase()))
    if (!match) {
      return { status: 'FAILED', evidence: [], error: `Model answered "${text}", which is not one of ${options.join(', ')}` }
    }
    return {
      status: 'OK', value: match,
      // Constrained answers are more trustworthy than free text, and the
      // confidence says so rather than being a flattering constant.
      confidence: 0.8,
      evidence: [`derived from ${ctx.propertyCount} propert(ies) of the ${ctx.typeName}`],
      model: out?._routerMeta?.provider ?? out?.model,
    }
  }

  return {
    status: 'OK', value: text, confidence: 0.6,
    evidence: [`derived from ${ctx.propertyCount} propert(ies) of the ${ctx.typeName}`],
    reasoning: 'Generated from the object and its declared related types.',
    model: out?._routerMeta?.provider ?? out?.model,
  }
}

export const IntelligenceFieldEngine = {
  tiers: () => TIERS,

  list(typeName?: string) {
    return prisma.intelligenceField.findMany({
      where: typeName ? { typeName } : {},
      orderBy: [{ typeName: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { runs: true } } },
    })
  },

  async create(input: {
    key: string; name: string; description?: string; typeName: string
    compute?: 'DERIVED' | 'GENERATIVE'; kind: FieldKind
    inputs?: string[]; relatedTypes?: string[]; instruction?: string; options?: string[]
    outputField: string; refresh?: string; governanceTier?: number
    createdBy?: string; isSystem?: boolean
  }) {
    if (!ModelIntrospection.typeNames().includes(input.typeName)) {
      throw new Error(`"${input.typeName}" is not an enterprise object type`)
    }
    const tier = input.governanceTier ?? 1
    if (tier >= 5) {
      throw new Error(
        'Tier 5 is an external action and cannot be a field. Use a governed mission, which has an approval gate.')
    }
    const compute = input.compute ?? 'DERIVED'
    if (compute === 'GENERATIVE' && !input.instruction) {
      throw new Error('A generative field needs an instruction')
    }
    // Writing over a column a human owns would silently overwrite typed data.
    const reserved = ['title', 'name', 'status', 'owner', 'approver', 'dueDate']
    if (reserved.includes(input.outputField)) {
      throw new Error(`"${input.outputField}" is entered by people; a field may not compute over it`)
    }

    return prisma.intelligenceField.create({
      data: {
        key: input.key, name: input.name, description: input.description ?? null,
        typeName: input.typeName, compute, kind: input.kind,
        inputs: (input.inputs ?? []) as any,
        relatedTypes: (input.relatedTypes ?? []) as any,
        instruction: input.instruction ?? null,
        options: (input.options ?? []) as any,
        outputField: input.outputField,
        refresh: input.refresh ?? 'MANUAL',
        governanceTier: tier,
        isSystem: input.isSystem ?? false,
        createdBy: input.createdBy ?? null,
      },
    })
  },

  /** Compute one field for one object, recording the run either way. */
  async computeOne(fieldId: string, objectId: string, actor: GatewayActor = FIELD_ACTOR): Promise<ComputeResult> {
    const field = await prisma.intelligenceField.findUnique({ where: { id: fieldId } })
    if (!field) throw new Error('No such field')
    if (!field.enabled) {
      return { status: 'SKIPPED', evidence: [], error: 'Field is disabled' } as ComputeResult
    }

    const t0 = Date.now()
    const result: ComputeResult = field.compute === 'GENERATIVE'
      ? await computeGenerative(field, objectId)
      : await computeDerived(field, objectId)

    await prisma.intelligenceFieldRun.create({
      data: {
        fieldId: field.id, objectId,
        status: result.status,
        value: result.value !== undefined ? (result.value as any) : undefined,
        confidence: result.confidence ?? null,
        evidence: (result.evidence ?? []) as any,
        reasoning: result.reasoning ?? null,
        model: result.model ?? null,
        error: result.error ?? null,
        durationMs: Date.now() - t0,
      },
    })

    // Only a successful computation touches the object.
    if (result.status === 'OK') {
      await OntologyGateway.patchObject(actor, objectId, {
        properties: {
          [field.outputField]: result.value,
          [`${field.outputField}_confidence`]: result.confidence ?? null,
        },
      })
    }
    return result
  },

  /** Run a field across every object of its type. */
  async computeAll(fieldId: string, limit = 200) {
    const field = await prisma.intelligenceField.findUnique({ where: { id: fieldId } })
    if (!field) throw new Error('No such field')

    const type = await prisma.ontologyObjectType.findUnique({
      where: { name: field.typeName }, select: { id: true },
    })
    if (!type) throw new Error(`Type ${field.typeName} is not in the ontology`)

    const objects = await prisma.ontologyObject.findMany({
      where: { typeId: type.id, validTo: null }, select: { id: true }, take: limit,
    })

    const tally = { computed: 0, skipped: 0, failed: 0 }
    const reasons = new Set<string>()
    for (const o of objects) {
      const r = await this.computeOne(fieldId, o.id)
      if (r.status === 'OK') tally.computed++
      else if (r.status === 'SKIPPED') { tally.skipped++; if (r.error) reasons.add(r.error) }
      else { tally.failed++; if (r.error) reasons.add(r.error) }
    }
    // Reporting why nothing computed is the difference between a field that is
    // broken and one that correctly had nothing to say.
    return { field: field.name, objects: objects.length, ...tally, reasons: [...reasons].slice(0, 5) }
  },

  runs(fieldId: string, limit = 50) {
    return prisma.intelligenceFieldRun.findMany({
      where: { fieldId }, orderBy: { createdAt: 'desc' }, take: limit,
    })
  },

  /** Why does this object show this value? The explanation panel's data. */
  async explain(objectId: string, outputField: string) {
    // Scope to the object's own type: several types define the same output
    // column, and matching on the name alone finds another type's field, then
    // reports "never computed" because no run exists for it.
    const obj = await prisma.ontologyObject.findUnique({
      where: { id: objectId }, include: { type: { select: { name: true } } },
    })
    if (!obj) throw new Error('No such object')

    const field = await prisma.intelligenceField.findFirst({
      where: { outputField, typeName: obj.type.name },
    })
    if (!field) {
      throw new Error(`No intelligence field writes "${outputField}" on a ${obj.type.name}`)
    }

    const run = await prisma.intelligenceFieldRun.findFirst({
      where: { fieldId: field.id, objectId }, orderBy: { createdAt: 'desc' },
    })
    if (!run) return { field: field.name, computed: false, reason: 'This field has never run for this object' }

    const previous = await prisma.intelligenceFieldRun.findFirst({
      where: { fieldId: field.id, objectId, status: 'OK', createdAt: { lt: run.createdAt } },
      orderBy: { createdAt: 'desc' },
    })

    return {
      field: field.name,
      computed: run.status === 'OK',
      value: run.value,
      confidence: run.confidence,
      evidence: run.evidence,
      reasoning: run.reasoning,
      model: run.model,
      status: run.status,
      error: run.error,
      tier: field.governanceTier,
      tierMeaning: TIERS[field.governanceTier],
      // "What changed?" — the question a number alone never answers.
      changedFrom: previous?.value ?? null,
      lastComputed: run.createdAt,
    }
  },

  async toggle(fieldId: string) {
    const f = await prisma.intelligenceField.findUnique({ where: { id: fieldId } })
    if (!f) throw new Error('No such field')
    return prisma.intelligenceField.update({ where: { id: fieldId }, data: { enabled: !f.enabled } })
  },
}
