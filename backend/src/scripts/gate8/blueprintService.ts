/**
 * Enterprise Blueprint Service
 *
 * The Blueprint is the portable, versioned deployment spec that every customer owns.
 * WAANDA reads it. The customer controls it. Partners deploy it.
 *
 * Blueprint hierarchy:
 *   Pack (industry template)
 *     ↓ instantiates
 *   Blueprint (customer's versioned spec)   ← this artifact
 *     ↓ executed by
 *   WAANDA (the runtime)
 *
 * Blueprint spec structure:
 *   organization → departments → goals → ontology →
 *   policies → agents → playbooks → kpis → oisProfile → emi → coig → governance
 */

import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// ─── Blueprint spec types ──────────────────────────────────────────────────────

export interface BlueprintOrg {
  name:     string
  industry: string
  size:     string
  pack:     string
}

export interface BlueprintDepartment {
  id:   string
  name: string
  head: string | null
}

export interface BlueprintGoal {
  pillar:  string
  label:   string
  target:  number
  unit:    string
  weight:  number
}

export interface BlueprintEntityType {
  name:        string
  displayName: string
  icon?:       string
  color?:      string
  description?: string
}

export interface BlueprintPolicy {
  name:        string
  description?: string
  trigger:     string
  condition:   Record<string, unknown>
  effect:      string
  priority:    number
}

export interface BlueprintAgent {
  id:        string
  schedule?: string
  triggerOn: string[]
}

export interface BlueprintWorkflow {
  name:        string
  trigger:     string
  description: string
}

export interface BlueprintSpec {
  $blueprint:    string                          // 'kangqore-view/v1'
  version:       string
  generatedAt:   string
  pack:          string

  organization:  BlueprintOrg
  departments:   BlueprintDepartment[]
  goals:         BlueprintGoal[]

  ontology: {
    entityTypes:       BlueprintEntityType[]
    relationshipTypes: string[]
  }

  policies:  BlueprintPolicy[]
  agents:    BlueprintAgent[]

  playbooks: {
    delivery: BlueprintWorkflow[]
    finance:  BlueprintWorkflow[]
    sales:    BlueprintWorkflow[]
    custom:   BlueprintWorkflow[]
  }

  kpis: {
    pillarWeights: Record<string, number>
  }

  oisProfile: {
    baseline:             number
    target:               number
    checkpointInterval:   string
  }

  emi: {
    dimensions: string[]
  }

  coig: {
    northStar:  boolean
    dimensions: string[]
  }

  governance: {
    approvalLevels:       Record<string, string>
    auditRetentionDays:   number
    blockRecordDeletion:  boolean
  }
}

// ─── Validation ────────────────────────────────────────────────────────────────

const VALID_EFFECTS   = new Set(['ALLOW', 'DENY', 'REQUIRE_APPROVAL', 'NOTIFY'])
const VALID_PILLARS   = new Set(['REVENUE', 'MARGIN', 'NPS', 'DELIVERY_SLA', 'UTILIZATION', 'CUSTOM'])

export function validateBlueprint(spec: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const s = spec as Record<string, unknown>

  if (!s || typeof s !== 'object')              { return { valid: false, errors: ['Blueprint must be a JSON object.'] } }
  if (!s.$blueprint)                            errors.push('Missing required field: $blueprint')
  if (s.$blueprint !== 'kangqore-view/v1')      errors.push(`Unknown blueprint schema: ${s.$blueprint}. Expected 'kangqore-view/v1'.`)
  if (!s.version)                               errors.push('Missing required field: version')
  if (!s.organization)                          errors.push('Missing required section: organization')
  if (!s.goals || !Array.isArray(s.goals))      errors.push('Missing or invalid section: goals (must be array)')
  if (!s.ontology)                              errors.push('Missing required section: ontology')
  if (!s.policies || !Array.isArray(s.policies))errors.push('Missing or invalid section: policies (must be array)')

  if (Array.isArray(s.goals)) {
    (s.goals as BlueprintGoal[]).forEach((g, i) => {
      if (!VALID_PILLARS.has(g.pillar)) errors.push(`goals[${i}].pillar '${g.pillar}' is not valid. Valid: ${[...VALID_PILLARS].join(', ')}`)
      if (typeof g.target !== 'number') errors.push(`goals[${i}].target must be a number`)
    })
  }

  if (Array.isArray(s.policies)) {
    (s.policies as BlueprintPolicy[]).forEach((p, i) => {
      if (!VALID_EFFECTS.has(p.effect)) errors.push(`policies[${i}].effect '${p.effect}' is not valid. Valid: ${[...VALID_EFFECTS].join(', ')}`)
    })
  }

  return { valid: errors.length === 0, errors }
}

// ─── Generate ──────────────────────────────────────────────────────────────────
// Reads live DB state and assembles a versioned Blueprint artifact.

export async function generateBlueprint(name: string, orgName: string): Promise<{ id: string; spec: BlueprintSpec }> {
  const [def, types, policies, workflows] = await Promise.all([
    prisma.enterpriseDefinition.findFirst({ where: { isActive: true }, include: { goals: true } }),
    prisma.ontologyObjectType.findMany({ orderBy: { name: 'asc' } }),
    prisma.enterprisePolicy.findMany({ where: { enabled: true }, orderBy: { priority: 'desc' } }),
    prisma.kimmpWorkflow.findMany({ where: { status: 'ACTIVE' }, orderBy: { name: 'asc' } }),
  ])

  const goals: BlueprintGoal[] = (def?.goals ?? []).map(g => ({
    pillar:  g.pillar,
    label:   g.label,
    target:  g.target,
    unit:    g.unit,
    weight:  g.weight,
  }))

  const entityTypes: BlueprintEntityType[] = types.map(t => ({
    name:        t.name,
    displayName: t.displayName,
    icon:        t.icon ?? undefined,
    color:       t.color ?? undefined,
    description: t.description ?? undefined,
  }))

  const policySpecs: BlueprintPolicy[] = policies.map(p => ({
    name:        p.name,
    description: p.description ?? undefined,
    trigger:     p.trigger,
    condition:   p.condition as Record<string, unknown>,
    effect:      p.effect,
    priority:    p.priority,
  }))

  const allWorkflows: BlueprintWorkflow[] = workflows.map(w => ({
    name:        w.name,
    trigger:     w.trigger,
    description: w.description ?? '',
  }))

  // Bucket workflows by domain
  const deliveryNames = new Set(['Project Kick-off', 'Milestone Review', 'Risk Escalation', 'Project Closure'])
  const financeNames  = new Set(['Invoice Approval', 'Collections Escalation', 'Budget Variance Alert'])
  const salesNames    = new Set(['Lead Qualification Flow', 'Proposal Follow-up'])

  const spec: BlueprintSpec = {
    $blueprint:   'kangqore-view/v1',
    version:      '1.0.0',
    generatedAt:  new Date().toISOString(),
    pack:         'professional-services',

    organization: {
      name:     orgName,
      industry: 'professional-services',
      size:     'SME',
      pack:     'professional-services',
    },

    departments: [
      { id: 'delivery', name: 'Delivery',    head: null },
      { id: 'finance',  name: 'Finance',     head: null },
      { id: 'sales',    name: 'Sales',       head: null },
      { id: 'ops',      name: 'Operations',  head: null },
    ],

    goals,

    ontology: {
      entityTypes,
      relationshipTypes: [
        'HAS_PROJECT', 'OWNS_INVOICE', 'CREATES_RISK', 'PRODUCES_DELIVERABLE',
        'HAS_MILESTONE', 'ASSIGNED_TO', 'SUBMITTED_TO', 'GOVERNS',
        'DEPENDS_ON', 'RESOLVES',
      ],
    },

    policies: policySpecs,

    agents: [
      { id: 'PROJECT_HEALTH',       schedule: '0 9 * * 1-5',  triggerOn: ['project.created', 'milestone.due_soon', 'risk.created'] },
      { id: 'DELIVERY_MONITOR',     schedule: '0 8 * * 1-5',  triggerOn: ['milestone.overdue', 'deliverable.at_risk'] },
      { id: 'INVOICE_INTELLIGENCE', schedule: '0 10 * * 1-5', triggerOn: ['invoice.created', 'invoice.overdue'] },
      { id: 'COLLECTIONS_AGENT',    schedule: '0 11 * * 1,4', triggerOn: ['invoice.overdue_14d'] },
      { id: 'DEAL_COACH',           schedule: '0 9 * * 1-5',  triggerOn: ['lead.created', 'proposal.no_response'] },
      { id: 'ENTERPRISE_COACH',     schedule: '0 7 * * 1',    triggerOn: ['weekly.summary'] },
      { id: 'SENTINEL',             schedule: '*/15 * * * *', triggerOn: ['system.anomaly', 'risk.critical'] },
    ],

    playbooks: {
      delivery: allWorkflows.filter(w => deliveryNames.has(w.name)),
      finance:  allWorkflows.filter(w => financeNames.has(w.name)),
      sales:    allWorkflows.filter(w => salesNames.has(w.name)),
      custom:   allWorkflows.filter(w => !deliveryNames.has(w.name) && !financeNames.has(w.name) && !salesNames.has(w.name)),
    },

    kpis: {
      pillarWeights: {
        decision:   0.20,
        enterprise: 0.18,
        workflow:   0.15,
        goal:       0.14,
        ai:         0.10,
        business:   0.10,
        trust:      0.08,
        adoption:   0.05,
      },
    },

    oisProfile: {
      baseline:           0,
      target:             80,
      checkpointInterval: 'weekly',
    },

    emi: {
      dimensions: ['REVENUE', 'MARGIN', 'NPS', 'DELIVERY_SLA', 'UTILIZATION'],
    },

    coig: {
      northStar:  true,
      dimensions: ['ois', 'adoption', 'ttv', 'retention'],
    },

    governance: {
      approvalLevels:      { L1: 'self', L2: 'manager', L3: 'senior' },
      auditRetentionDays:  90,
      blockRecordDeletion: true,
    },
  }

  const specJson     = JSON.stringify(spec, null, 2)
  const checksum     = crypto.createHash('sha256').update(specJson).digest('hex')

  const blueprint = await prisma.enterpriseBlueprint.create({
    data: { name, version: spec.version, pack: spec.pack, industry: spec.organization.industry, spec: spec as any, checksum, status: 'DRAFT' },
  })

  return { id: blueprint.id, spec }
}

// ─── Import ────────────────────────────────────────────────────────────────────
// Provisions an enterprise deployment from a Blueprint spec.
// Idempotent: skips entities that already exist by name.

export async function importBlueprint(
  rawSpec: unknown,
  blueprintName: string,
): Promise<{ blueprintId: string; created: Record<string, number>; skipped: Record<string, number> }> {
  const validation = validateBlueprint(rawSpec)
  if (!validation.valid) throw new Error(`Invalid blueprint: ${validation.errors.join('; ')}`)

  const spec    = rawSpec as BlueprintSpec
  const created: Record<string, number> = { goals: 0, entityTypes: 0, policies: 0, workflows: 0 }
  const skipped: Record<string, number> = { goals: 0, entityTypes: 0, policies: 0, workflows: 0 }

  // 1. Enterprise definition + goals
  const existing = await prisma.enterpriseDefinition.findFirst({ where: { isActive: true } })
  if (!existing) {
    await prisma.enterpriseDefinition.create({
      data: {
        name:     `${blueprintName} — ${spec.organization.name}`,
        isActive: true,
        goals:    { create: spec.goals.map(g => ({ pillar: g.pillar, label: g.label, target: g.target, unit: g.unit, weight: g.weight })) },
      },
    })
    created.goals = spec.goals.length
  } else {
    skipped.goals = spec.goals.length
  }

  // 2. Ontology entity types
  for (const t of spec.ontology.entityTypes) {
    const ex = await prisma.ontologyObjectType.findFirst({ where: { name: t.name } })
    if (ex) { skipped.entityTypes++; continue }
    await prisma.ontologyObjectType.create({ data: { name: t.name, displayName: t.displayName, icon: t.icon, color: t.color, description: t.description } })
    created.entityTypes++
  }

  // 3. Policies
  for (const p of spec.policies) {
    const ex = await prisma.enterprisePolicy.findFirst({ where: { name: p.name } })
    if (ex) { skipped.policies++; continue }
    await prisma.enterprisePolicy.create({ data: { name: p.name, description: p.description, trigger: p.trigger, condition: p.condition as any, effect: p.effect, priority: p.priority } })
    created.policies++
  }

  // 4. Workflows (all playbook domains)
  const allWorkflows = [
    ...spec.playbooks.delivery,
    ...spec.playbooks.finance,
    ...spec.playbooks.sales,
    ...spec.playbooks.custom,
  ]
  for (const w of allWorkflows) {
    const ex = await prisma.kimmpWorkflow.findFirst({ where: { name: w.name } })
    if (ex) { skipped.workflows++; continue }
    await prisma.kimmpWorkflow.create({
      data: { name: w.name, description: w.description, trigger: w.trigger, dag: { nodes: [], edges: [] }, status: 'ACTIVE', createdBy: 'BLUEPRINT_IMPORT' },
    })
    created.workflows++
  }

  // 5. Record the blueprint
  const specJson  = JSON.stringify(spec, null, 2)
  const checksum  = crypto.createHash('sha256').update(specJson).digest('hex')
  const blueprint = await prisma.enterpriseBlueprint.create({
    data: {
      name:       blueprintName,
      version:    spec.version,
      pack:       spec.pack,
      industry:   spec.organization.industry,
      spec:       spec as any,
      checksum,
      status:     'ACTIVE',
      importedAt: new Date(),
    },
  })

  return { blueprintId: blueprint.id, created, skipped }
}

// ─── List / Get ────────────────────────────────────────────────────────────────

export async function listBlueprints() {
  return prisma.enterpriseBlueprint.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, version: true, pack: true, industry: true, status: true, checksum: true, deployedAt: true, importedAt: true, createdAt: true },
  })
}

export async function getBlueprint(id: string) {
  return prisma.enterpriseBlueprint.findUnique({ where: { id } })
}

export async function archiveBlueprint(id: string) {
  return prisma.enterpriseBlueprint.update({ where: { id }, data: { status: 'ARCHIVED' } })
}

export async function activateBlueprint(id: string) {
  return prisma.enterpriseBlueprint.update({ where: { id }, data: { status: 'ACTIVE', deployedAt: new Date() } })
}
