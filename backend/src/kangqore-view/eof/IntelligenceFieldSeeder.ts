// The system intelligence fields.
//
// These are the columns removed from EnterpriseObjectModel earlier — brought
// back, but each one now points at a computation. The difference is the whole
// point: previously the schema declared `predictedRisk` and nothing produced it;
// now a field definition says it is DERIVED from IntelligenceEngine, records a
// run every time it is computed, and writes nothing when it has nothing to say.
//
// Generative fields are seeded DISABLED. They cost a model call per object, and
// turning them on should be a decision someone makes rather than a side effect
// of deploying.

import { prisma } from '../../lib/prisma'
import { IntelligenceFieldEngine, type FieldKind } from './IntelligenceFieldEngine'

interface SystemField {
  key: string; name: string; description: string
  refresh?: string
  typeName: string; compute: 'DERIVED' | 'GENERATIVE'; kind: FieldKind
  outputField: string; governanceTier: number
  inputs?: string[]; relatedTypes?: string[]; instruction?: string; options?: string[]
  enabled?: boolean
}

const WORK_TYPES = ['Project', 'Task']

export const SYSTEM_FIELDS: SystemField[] = [
  // ── Derived: no model, deterministic, safe to run across a whole type ──────
  ...WORK_TYPES.flatMap((t): SystemField[] => [
    {
      key: `${t.toLowerCase()}-predicted-risk`, name: 'Predicted risk',
      description: 'Likelihood this slips, from observed velocity, blockers and its own dates.',
      typeName: t, compute: 'DERIVED', kind: 'SCORE',
      inputs: ['status', 'progress', 'dueDate', 'startDate'], outputField: 'predictedRisk', governanceTier: 2, refresh: 'ON_CHANGE',
    },
    {
      key: `${t.toLowerCase()}-predicted-completion`, name: 'Predicted completion',
      description: 'Forecast finish date from measured pace. Absent where there is no history.',
      typeName: t, compute: 'DERIVED', kind: 'FORECAST',
      inputs: ['status', 'progress', 'dueDate', 'startDate'], outputField: 'predictedCompletion', governanceTier: 2, refresh: 'ON_CHANGE',
    },
    {
      key: `${t.toLowerCase()}-root-cause`, name: 'Root cause',
      description: 'Why this is at risk, from its own dates and its blocking edges.',
      typeName: t, compute: 'DERIVED', kind: 'RECOMMEND',
      inputs: ['status', 'progress', 'dueDate', 'startDate'], outputField: 'rootCause', governanceTier: 3, refresh: 'ON_CHANGE',
    },
    {
      key: `${t.toLowerCase()}-next-best-action`, name: 'Next best action',
      description: 'What to do about it. Advisory: the field recommends, it never decides.',
      typeName: t, compute: 'DERIVED', kind: 'RECOMMEND',
      inputs: ['status', 'progress', 'dueDate', 'startDate'], outputField: 'nextBestAction', governanceTier: 3,
    },
    {
      key: `${t.toLowerCase()}-business-impact`, name: 'Business impact',
      description: 'Value at stake, reached by traversing the graph. Blank when nothing priceable is reachable.',
      typeName: t, compute: 'DERIVED', kind: 'SCORE',
      inputs: ['status', 'progress', 'dueDate', 'startDate'], outputField: 'businessImpact', governanceTier: 4,
    },
    {
      key: `${t.toLowerCase()}-anomaly`, name: 'Anomaly score',
      description: 'Distance from peers of the same type. Needs at least three peers.',
      typeName: t, compute: 'DERIVED', kind: 'SCORE',
      inputs: ['status', 'progress', 'dueDate', 'startDate'], outputField: 'anomalyScore', governanceTier: 2, refresh: 'SCHEDULED',
    },
  ]),

  // ── Generative: seeded off, because each costs a model call per object ─────
  {
    key: 'project-summary', name: 'AI summary',
    description: 'Two-sentence summary of the project and its related work.',
    typeName: 'Project', compute: 'GENERATIVE', kind: 'SUMMARY',
    outputField: 'aiSummary', governanceTier: 1, enabled: false,
    inputs: ['title', 'description', 'status', 'progress', 'dueDate', 'budget'],
    relatedTypes: ['Workstream', 'Task', 'Contract'],
    instruction: 'Summarise this project: what it is, where it stands, and what is outstanding.',
  },
  {
    key: 'customer-sentiment', name: 'Sentiment',
    description: 'Tone of the record and its recent interactions.',
    typeName: 'Customer', compute: 'GENERATIVE', kind: 'SENTIMENT',
    outputField: 'sentiment', governanceTier: 2, enabled: false,
    inputs: ['title', 'health', 'status', 'tier', 'industry'],
    options: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'],
    instruction: 'Judge the overall sentiment of this customer relationship.',
  },
  {
    key: 'case-classification', name: 'Category',
    description: 'Classifies incoming work so it can be routed without a human reading every one.',
    typeName: 'Case', compute: 'GENERATIVE', kind: 'CLASSIFY',
    outputField: 'category', governanceTier: 2, enabled: false,
    inputs: ['title', 'description', 'status'],
    options: ['BUG', 'REQUEST', 'FEEDBACK', 'INCIDENT', 'QUESTION'],
    instruction: 'Classify this case.',
  },
]

export async function seedIntelligenceFields() {
  let created = 0, updated = 0
  for (const f of SYSTEM_FIELDS) {
    const existing = await prisma.intelligenceField.findUnique({ where: { key: f.key }, select: { id: true } })
    if (existing) {
      await prisma.intelligenceField.update({
        where: { id: existing.id },
        data: {
          name: f.name, description: f.description, kind: f.kind, compute: f.compute,
          inputs: (f.inputs ?? []) as any, relatedTypes: (f.relatedTypes ?? []) as any,
          instruction: f.instruction ?? null, options: (f.options ?? []) as any,
          governanceTier: f.governanceTier, isSystem: true,
          refresh: f.refresh ?? 'MANUAL',
        },
      })
      updated++
      continue
    }
    await IntelligenceFieldEngine.create({ ...f, isSystem: true })
    if (f.enabled === false) {
      await prisma.intelligenceField.update({ where: { key: f.key }, data: { enabled: false } })
    }
    created++
  }
  const off = await prisma.intelligenceField.count({ where: { enabled: false } })
  return { created, updated, disabled: off }
}
