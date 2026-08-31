// "Assess customer risk" → a field definition, previewed before it is saved.
//
// Two problems this solves. First, creating an intelligence field currently
// requires knowing the shape of one — compute mode, kind, inputs, output
// column, governance tier — which means only whoever wrote the engine can add
// one. Second, a field that is wrong is worse than absent: it writes a value
// onto every object of its type. So composition is deliberately followed by a
// preview against a real record, and nothing is stored until someone has seen
// what it produces.
//
// Deterministic, like IntentCompiler. Every term it recognises comes from the
// model itself, and a request it cannot map is refused with the reason rather
// than turned into a plausible guess. An LLM front-end can sit on top later and
// emit the same structure; what it must not do is invent a column.

import { prisma } from '../../lib/prisma'
import { ModelIntrospection } from './ModelIntrospection'
import { IntelligenceFieldEngine, type FieldKind } from './IntelligenceFieldEngine'
import { columnsOfClass, schemaFor, ENTERPRISE_OBJECTS } from './EnterpriseObjectModel'

export interface ComposedField {
  ok: true
  draft: {
    key: string; name: string; description: string
    typeName: string
    compute: 'DERIVED' | 'GENERATIVE'
    kind: FieldKind
    inputs: string[]
    relatedTypes: string[]
    instruction?: string
    options?: string[]
    outputField: string
    refresh: string
    governanceTier: number
  }
  /** What was understood, so the person can check the reading. */
  matched: string[]
  /** Words that carried no meaning here. */
  ignored: string[]
  /** Stated when the draft reuses a computation that already exists. */
  note?: string
}
export interface FailedCompose { ok: false; reason: string; hint: string }

/**
 * Requests that map onto a computation the engine already performs. Preferring
 * these over a model call is the whole point: a derived field is deterministic,
 * free, and explains itself from real evidence.
 */
const DERIVED_INTENTS: Array<{ re: RegExp; outputField: string; kind: FieldKind; tier: number; name: string }> = [
  { re: /\b(risk|likelihood of (failure|slipping)|how risky)\b/, outputField: 'predictedRisk', kind: 'SCORE', tier: 2, name: 'Predicted risk' },
  { re: /\b(when will|predicted completion|finish date|forecast(ed)? completion|likely to (finish|complete))\b/, outputField: 'predictedCompletion', kind: 'FORECAST', tier: 2, name: 'Predicted completion' },
  { re: /\b(why|root cause|reason (it|for)|what is causing)\b/, outputField: 'rootCause', kind: 'RECOMMEND', tier: 3, name: 'Root cause' },
  { re: /\b(what should|next best action|recommend(ed)? action|what to do)\b/, outputField: 'nextBestAction', kind: 'RECOMMEND', tier: 3, name: 'Next best action' },
  { re: /\b(business impact|value at (risk|stake)|money at risk|financial exposure)\b/, outputField: 'businessImpact', kind: 'SCORE', tier: 4, name: 'Business impact' },
  { re: /\b(anomaly|outlier|unusual compared)\b/, outputField: 'anomalyScore', kind: 'SCORE', tier: 2, name: 'Anomaly score' },
]

/** Shapes that need a model, with the governance weight each carries. */
// Stems carry a trailing \w* rather than a word boundary: "summarise",
// "classification" and "prediction" are all the same request, and \bsummar\b
// matches none of them because the boundary falls mid-word.
const GENERATIVE_INTENTS: Array<{ re: RegExp; kind: FieldKind; tier: number; options?: string[]; label: string }> = [
  { re: /\b(sentiment|tone|mood|how (do|does) .* feel)\b/, kind: 'SENTIMENT', tier: 2, options: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'], label: 'Sentiment' },
  { re: /\b(classif\w*|categor\w*|what kind|what type|label)\b/, kind: 'CLASSIFY', tier: 2, label: 'Category' },
  { re: /\b(summar\w*|describ\w*|overview|brief)\b/, kind: 'SUMMARY', tier: 1, label: 'Summary' },
  { re: /\b(recommend\w*|suggest\w*|advis\w*)\b/, kind: 'RECOMMEND', tier: 3, label: 'Recommendation' },
  { re: /\b(predict\w*|forecast\w*|project(ed|ion)?)\b/, kind: 'FORECAST', tier: 2, label: 'Forecast' },
  { re: /\b(assess\w*|evaluat\w*|scor\w*|rate|rating)\b/, kind: 'SCORE', tier: 2, label: 'Assessment' },
]

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48)

const camel = (s: string) => {
  const parts = s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
  return parts[0] + parts.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join('')
}

export const FieldComposer = {
  /**
   * The catalogue behind "+ Add field": what can be created, grouped the way
   * someone thinks about it rather than the way it is stored.
   */
  catalogue(typeName?: string) {
    const derived = DERIVED_INTENTS.map(d => ({
      name: d.name, kind: d.kind, compute: 'DERIVED', tier: d.tier,
      outputField: d.outputField,
      example: d.name === 'Predicted risk' ? 'How likely is this to slip?' : undefined,
    }))
    const generative = GENERATIVE_INTENTS.map(g => ({
      name: g.label, kind: g.kind, compute: 'GENERATIVE', tier: g.tier,
      options: g.options,
    }))

    const type = typeName ? ModelIntrospection.catalogue().find(t => t.name === typeName) : null

    return {
      categories: [
        {
          id: 'intelligence', label: 'Intelligence',
          description: 'Computed from the record and the graph around it.',
          items: [...derived, ...generative],
        },
        {
          id: 'governance', label: 'Governance',
          description: 'Policy, approval and audit columns. Declared on every type already.',
          items: type ? type.columns.GOVERNANCE.map(f => ({ name: f, existing: true })) : [],
        },
        {
          id: 'enterprise', label: 'Enterprise',
          description: 'Typed business columns already on this type.',
          items: type ? type.columns.ENTERPRISE.map(f => ({ name: f, existing: true })) : [],
        },
      ],
      tiers: IntelligenceFieldEngine.tiers(),
      types: ModelIntrospection.typeNames(),
    }
  },

  /**
   * Compose a draft from a sentence. Refuses rather than guesses: a field
   * nobody asked for, writing onto every record of a type, is expensive to
   * discover and awkward to undo.
   */
  compose(text: string, typeName: string): ComposedField | FailedCompose {
    if (!ModelIntrospection.typeNames().includes(typeName)) {
      return { ok: false, reason: `"${typeName}" is not an enterprise object type`, hint: `Try one of: ${ModelIntrospection.typeNames().slice(0, 8).join(', ')}` }
    }
    const lower = ' ' + text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ') + ' '
    const matched: string[] = []

    const def = ENTERPRISE_OBJECTS.find(o => o.name === typeName)!
    const schema = schemaFor(def)
    const enterpriseCols = columnsOfClass(schema, 'ENTERPRISE').map(c => c.field)
    const coreCols = columnsOfClass(schema, 'CORE').map(c => c.field)

    // ── Prefer an existing derived computation ────────────────────────────────
    const derived = DERIVED_INTENTS.find(d => d.re.test(lower))
    if (derived) {
      const already = ModelIntrospection.hasColumn(typeName, derived.outputField)
      matched.push(`derived: ${derived.name}`)
      return {
        ok: true,
        draft: {
          key: `${slug(typeName)}-${slug(derived.name)}`,
          name: derived.name,
          description: `${derived.name} for ${typeName}, computed from the record and its edges.`,
          typeName, compute: 'DERIVED', kind: derived.kind,
          inputs: ['status', 'progress', 'dueDate', 'startDate'].filter(f => f in schema),
          relatedTypes: [],
          outputField: derived.outputField,
          refresh: 'ON_CHANGE',
          governanceTier: derived.tier,
        },
        matched,
        ignored: [],
        note: already
          ? 'This reuses a computation the engine already performs, so it needs no model and explains itself from real evidence.'
          : undefined,
      }
    }

    // ── Otherwise, a generative field ────────────────────────────────────────
    const gen = GENERATIVE_INTENTS.find(g => g.re.test(lower))
    if (!gen) {
      return {
        ok: false,
        reason: 'Could not tell what kind of field this is.',
        hint: 'Say what you want it to do — summarise, classify, assess, predict, recommend — for example "assess renewal risk" or "classify the request type".',
      }
    }
    matched.push(`kind: ${gen.kind}`)

    // Inputs: columns the type actually has. Never invent a column name.
    const mentioned = enterpriseCols.filter(c =>
      lower.includes(' ' + c.toLowerCase()) ||
      lower.includes(' ' + c.replace(/([A-Z])/g, ' $1').toLowerCase().trim()))
    const inputs = mentioned.length
      ? [...new Set(['title', ...mentioned])].filter(f => f in schema)
      : [...coreCols, ...enterpriseCols].filter(f => f in schema).slice(0, 8)
    if (mentioned.length) matched.push(`inputs named: ${mentioned.join(', ')}`)

    // Related types it can reason over, from the real relationship graph.
    const relatedTypes = ModelIntrospection.edgesFrom(typeName)
      .map(e => e.to)
      .concat(ModelIntrospection.edgesTo(typeName).map(e => e.from))
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 4)

    const name = gen.label
    const outputField = camel(`ai ${gen.label}`)

    const understood = new Set(matched.join(' ').toLowerCase().split(/[^a-z0-9]+/))
    const stop = new Set(['a','an','the','of','for','to','on','in','this','that','and','me','my','is','are','it','add','field','show','which','what','how'])
    const ignored = [...new Set(lower.trim().split(' ').filter(w =>
      w && !stop.has(w) && !understood.has(w) && !inputs.includes(w) && w !== typeName.toLowerCase()))]

    return {
      ok: true,
      draft: {
        key: `${slug(typeName)}-${slug(gen.label)}`,
        name,
        description: text.trim().slice(0, 180),
        typeName, compute: 'GENERATIVE', kind: gen.kind,
        inputs, relatedTypes,
        instruction: text.trim(),
        options: gen.options,
        outputField,
        // Generative fields cost a model call per object, so a new one starts
        // manual rather than firing on every write.
        refresh: 'MANUAL',
        governanceTier: gen.tier,
      },
      matched,
      ignored,
    }
  },

  /**
   * Run a draft against one real record WITHOUT storing anything. This is the
   * step that makes composing safe: a field is judged by what it produces, not
   * by how its definition reads.
   */
  async preview(draft: ComposedField['draft'], objectId?: string) {
    const type = await prisma.ontologyObjectType.findUnique({
      where: { name: draft.typeName }, select: { id: true },
    })
    if (!type) throw new Error(`${draft.typeName} is not in the ontology`)

    const target = objectId
      ? await prisma.ontologyObject.findUnique({ where: { id: objectId } })
      : await prisma.ontologyObject.findFirst({
          where: { typeId: type.id, validTo: null }, orderBy: { updatedAt: 'desc' },
        })
    if (!target) {
      return {
        previewed: false,
        reason: `There are no ${draft.typeName} objects to preview against yet.`,
      }
    }

    // Create, run once, delete. The field never persists, and neither does the
    // value: preview must not write to the object it is previewing on.
    const temp = await prisma.intelligenceField.create({
      data: {
        key: `__preview_${Date.now()}`,
        name: draft.name, description: draft.description ?? null,
        typeName: draft.typeName, compute: draft.compute, kind: draft.kind,
        inputs: draft.inputs as any, relatedTypes: draft.relatedTypes as any,
        instruction: draft.instruction ?? null, options: (draft.options ?? []) as any,
        outputField: draft.outputField,
        refresh: 'MANUAL', governanceTier: draft.governanceTier, enabled: true,
      },
    })

    try {
      // dryRun: compute the answer, write nothing to the object, record no run.
      const result = await IntelligenceFieldEngine.computeOne(
        temp.id, target.id, undefined, { dryRun: true })
      const props = (target.properties ?? {}) as any
      return {
        previewed: true,
        object: { id: target.id, title: String(props.title ?? props.name ?? target.id) },
        status: result.status,
        value: result.value,
        confidence: result.confidence,
        evidence: result.evidence,
        reasoning: result.reasoning,
        error: result.error,
        // Said plainly, because a skip during preview is the useful signal that
        // this field would be blank on most records.
        willBeBlank: result.status !== 'OK',
      }
    } finally {
      // Only the temporary definition needs removing — the dry run neither
      // wrote to the object nor recorded anything.
      await prisma.intelligenceField.delete({ where: { id: temp.id } })
    }
  },

  /** Commit a previewed draft. */
  create(draft: ComposedField['draft'], createdBy?: string) {
    return IntelligenceFieldEngine.create({ ...draft, createdBy })
  },
}
