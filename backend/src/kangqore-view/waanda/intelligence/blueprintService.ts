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
    maturityLevels?:      Record<string, { label: string; minComposite: number; description: string }>
    emiWeights?:          Record<string, number>
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
    rgsRules?:            string[]
  }

  // Optional enrichment fields (present in PS Pack v1.0, not required for import)
  extractedFrom?:   string
  validatedAt?:     string
  setupInstructions?: Record<string, unknown>
  dnaProfile?: {
    approvalSpeed:       string
    riskTolerance:       string
    decisionStyle:       string
    escalationThreshold: string
    meetingDensity:      string
    growthPhase:         string
    dominantPillar:      string
    weakestPillar:       string
    notes?:              string
  }
  qefGates?: Record<string, { minScore: number; rationale: string }>
}

// ─── Validation ────────────────────────────────────────────────────────────────

const VALID_EFFECTS = new Set(['ALLOW', 'DENY', 'REQUIRE_APPROVAL', 'NOTIFY'])
const VALID_PILLARS = new Set(['REVENUE', 'MARGIN', 'NPS', 'DELIVERY_SLA', 'UTILIZATION', 'CUSTOM'])

export interface BlueprintValidationSection {
  status:  'READY' | 'NEEDS_CONFIG' | 'MISSING'
  summary: string
  count?:  number
}

export interface BlueprintReadinessReport {
  valid:           boolean
  version:         string | null
  pack:            string | null
  checksum:        string
  readinessScore:  number
  errors:          Array<{ section: string; message: string }>
  warnings:        Array<{ section: string; message: string }>
  ready:           Array<{ section: string; detail: string }>
  recommendations: Array<{ section: string; action: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }>
  sections:        Record<string, BlueprintValidationSection>
}

export function validateBlueprint(spec: unknown): BlueprintReadinessReport {
  const errors:          Array<{ section: string; message: string }>                        = []
  const warnings:        Array<{ section: string; message: string }>                        = []
  const ready:           Array<{ section: string; detail: string }>                         = []
  const recommendations: Array<{ section: string; action: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }> = []
  const sections:        Record<string, BlueprintValidationSection>                         = {}

  const specJson = JSON.stringify(spec ?? '')
  const checksum = crypto.createHash('sha256').update(specJson).digest('hex')

  if (!spec || typeof spec !== 'object') {
    return {
      valid: false, version: null, pack: null, checksum, readinessScore: 0,
      errors: [{ section: 'root', message: 'Blueprint must be a JSON object.' }],
      warnings: [], ready: [], recommendations: [], sections: {},
    }
  }

  const s = spec as Record<string, unknown>
  let score = 0

  // ── Schema header ──────────────────────────────────────────────────────────
  if (!s.$blueprint) {
    errors.push({ section: 'root', message: 'Missing required field: $blueprint' })
  } else if (s.$blueprint !== 'kangqore-view/v1') {
    errors.push({ section: 'root', message: `Unknown blueprint schema: ${s.$blueprint}. Expected 'kangqore-view/v1'.` })
  }
  if (!s.version) errors.push({ section: 'root', message: 'Missing required field: version' })

  // ── Organization (20 pts) ──────────────────────────────────────────────────
  const org = s.organization as Record<string, unknown> | undefined
  if (!org) {
    errors.push({ section: 'organization', message: 'Missing required section: organization' })
    sections.organization = { status: 'MISSING', summary: 'Not present' }
    recommendations.push({ section: 'organization', action: 'Add organization.name, industry, size, and pack fields.', priority: 'HIGH' })
  } else {
    const orgName = String(org.name ?? '')
    const isStub  = orgName.includes('{{') || orgName === ''
    if (isStub) {
      errors.push({ section: 'organization', message: 'organization.name is a template stub — replace with the client\'s legal entity name before import.' })
      sections.organization = { status: 'NEEDS_CONFIG', summary: 'Name not configured' }
      score += 10
    } else {
      ready.push({ section: 'organization', detail: `Configured for "${orgName}" (${org.industry ?? 'unknown industry'})` })
      sections.organization = { status: 'READY', summary: orgName }
      score += 20
    }
  }

  // ── Goals (20 pts) ─────────────────────────────────────────────────────────
  const goals = Array.isArray(s.goals) ? (s.goals as BlueprintGoal[]) : []
  if (goals.length === 0) {
    errors.push({ section: 'goals', message: 'Missing or invalid section: goals (must be a non-empty array)' })
    sections.goals = { status: 'MISSING', summary: 'No goals defined', count: 0 }
    recommendations.push({ section: 'goals', action: 'Add at least 3 goals with valid pillars and numeric targets.', priority: 'HIGH' })
  } else {
    let goalErrors = 0
    goals.forEach((g, i) => {
      if (!VALID_PILLARS.has(g.pillar)) {
        errors.push({ section: 'goals', message: `goals[${i}].pillar '${g.pillar}' is not a valid pillar. Valid: ${[...VALID_PILLARS].join(', ')}` })
        goalErrors++
      }
      if (typeof g.target !== 'number') {
        errors.push({ section: 'goals', message: `goals[${i}].target must be a number` })
        goalErrors++
      }
    })
    if (goalErrors > 0) {
      sections.goals = { status: 'NEEDS_CONFIG', summary: `${goals.length} goals — ${goalErrors} with errors`, count: goals.length }
      score += 10
    } else if (goals.length < 3) {
      warnings.push({ section: 'goals', message: `Only ${goals.length} goal(s) defined. PS Pack recommends at least 5 (REVENUE, MARGIN, NPS, DELIVERY_SLA, UTILIZATION).` })
      sections.goals = { status: 'NEEDS_CONFIG', summary: `Only ${goals.length} goal(s)`, count: goals.length }
      score += 12
    } else {
      ready.push({ section: 'goals', detail: `${goals.length} goals configured with valid pillars and targets` })
      sections.goals = { status: 'READY', summary: `${goals.length} goals`, count: goals.length }
      score += 20
    }
  }

  // ── Ontology (10 pts) ──────────────────────────────────────────────────────
  const onto = s.ontology as Record<string, unknown> | undefined
  const entityTypes = Array.isArray(onto?.entityTypes) ? onto!.entityTypes : []
  if (!onto) {
    errors.push({ section: 'ontology', message: 'Missing required section: ontology' })
    sections.ontology = { status: 'MISSING', summary: 'Not present', count: 0 }
  } else if (entityTypes.length === 0) {
    warnings.push({ section: 'ontology', message: 'ontology.entityTypes is empty — WAANDA will have no object vocabulary.' })
    sections.ontology = { status: 'NEEDS_CONFIG', summary: 'No entity types', count: 0 }
    score += 3
  } else if (entityTypes.length < 6) {
    warnings.push({ section: 'ontology', message: `Only ${entityTypes.length} entity type(s). PS Pack recommends ≥6 (Client, Project, Deliverable, Milestone, Invoice, Risk).` })
    sections.ontology = { status: 'NEEDS_CONFIG', summary: `${entityTypes.length} entity types`, count: entityTypes.length }
    score += 6
  } else {
    ready.push({ section: 'ontology', detail: `${entityTypes.length} entity types registered` })
    sections.ontology = { status: 'READY', summary: `${entityTypes.length} entity types`, count: entityTypes.length }
    score += 10
  }

  // ── Policies (15 pts) ──────────────────────────────────────────────────────
  const policies = Array.isArray(s.policies) ? (s.policies as BlueprintPolicy[]) : []
  if (policies.length === 0) {
    errors.push({ section: 'policies', message: 'Missing or invalid section: policies (must be a non-empty array)' })
    sections.policies = { status: 'MISSING', summary: 'No policies', count: 0 }
    recommendations.push({ section: 'policies', action: 'Add at least a DENY policy for record deletion and a REQUIRE_APPROVAL for large invoices.', priority: 'HIGH' })
  } else {
    let policyErrors = 0
    policies.forEach((p, i) => {
      if (!VALID_EFFECTS.has(p.effect)) {
        errors.push({ section: 'policies', message: `policies[${i}].effect '${p.effect}' is not valid. Valid: ${[...VALID_EFFECTS].join(', ')}` })
        policyErrors++
      }
    })
    const hasDeny = policies.some(p => p.effect === 'DENY')
    if (!hasDeny) {
      warnings.push({ section: 'policies', message: 'No DENY policy found. PS Pack requires at minimum one DENY policy to block record deletion.' })
      recommendations.push({ section: 'policies', action: 'Add a DENY policy on DELETE_RECORD trigger to ensure immutable audit trail.', priority: 'HIGH' })
    }
    if (policyErrors > 0) {
      sections.policies = { status: 'NEEDS_CONFIG', summary: `${policies.length} policies — ${policyErrors} with errors`, count: policies.length }
      score += 7
    } else if (!hasDeny) {
      sections.policies = { status: 'NEEDS_CONFIG', summary: `${policies.length} policies — no DENY guard`, count: policies.length }
      score += 10
    } else {
      ready.push({ section: 'policies', detail: `${policies.length} policies including DENY guard` })
      sections.policies = { status: 'READY', summary: `${policies.length} policies`, count: policies.length }
      score += 15
    }
  }

  // ── Agents (10 pts) ────────────────────────────────────────────────────────
  const agents = Array.isArray(s.agents) ? s.agents : []
  if (agents.length === 0) {
    warnings.push({ section: 'agents', message: 'No agents defined — WAANDA will run passively only.' })
    sections.agents = { status: 'MISSING', summary: 'No agents', count: 0 }
    recommendations.push({ section: 'agents', action: 'Add PS Pack agents: PROJECT_HEALTH, DELIVERY_MONITOR, INVOICE_INTELLIGENCE, DEAL_COACH, ENTERPRISE_COACH.', priority: 'MEDIUM' })
  } else if (agents.length < 5) {
    warnings.push({ section: 'agents', message: `Only ${agents.length} agent(s). PS Pack recommends 7 canonical agents.` })
    sections.agents = { status: 'NEEDS_CONFIG', summary: `${agents.length} agents`, count: agents.length }
    score += 5
  } else {
    ready.push({ section: 'agents', detail: `${agents.length} agents configured` })
    sections.agents = { status: 'READY', summary: `${agents.length} agents`, count: agents.length }
    score += 10
  }

  // ── Playbooks (10 pts) ─────────────────────────────────────────────────────
  const pb = s.playbooks as Record<string, unknown[]> | undefined
  const hasDelivery = Array.isArray(pb?.delivery) && pb!.delivery.length > 0
  const hasFinance  = Array.isArray(pb?.finance)  && pb!.finance.length > 0
  const hasSales    = Array.isArray(pb?.sales)    && pb!.sales.length > 0
  if (!pb) {
    warnings.push({ section: 'playbooks', message: 'No playbooks section — WAANDA will have no workflow templates.' })
    sections.playbooks = { status: 'MISSING', summary: 'No playbooks' }
    recommendations.push({ section: 'playbooks', action: 'Add playbooks for delivery, finance, and sales domains.', priority: 'MEDIUM' })
  } else if (!hasDelivery || !hasFinance || !hasSales) {
    const missing = [!hasDelivery && 'delivery', !hasFinance && 'finance', !hasSales && 'sales'].filter(Boolean).join(', ')
    warnings.push({ section: 'playbooks', message: `Missing playbook domains: ${missing}` })
    sections.playbooks = { status: 'NEEDS_CONFIG', summary: `Missing: ${missing}` }
    score += 5
  } else {
    const total = (pb.delivery?.length ?? 0) + (pb.finance?.length ?? 0) + (pb.sales?.length ?? 0)
    ready.push({ section: 'playbooks', detail: `${total} playbooks across delivery, finance, and sales` })
    sections.playbooks = { status: 'READY', summary: `${total} playbooks` }
    score += 10
  }

  // ── OIS Profile (5 pts) ────────────────────────────────────────────────────
  const oisProfile = s.oisProfile as Record<string, unknown> | undefined
  if (!oisProfile) {
    warnings.push({ section: 'oisProfile', message: 'No OIS profile — Gate 8 baseline will default to 0 with target 80.' })
    sections.oisProfile = { status: 'MISSING', summary: 'Using defaults' }
    recommendations.push({ section: 'oisProfile', action: 'Set oisProfile.target (recommend ≥60 for Customer Zero credibility).', priority: 'LOW' })
  } else {
    const target = typeof oisProfile.target === 'number' ? oisProfile.target : 0
    if (target < 60) {
      warnings.push({ section: 'oisProfile', message: `oisProfile.target is ${target} — below the G8 minimum of 60. Customer Zero Report requires OIS ≥ 60.` })
      sections.oisProfile = { status: 'NEEDS_CONFIG', summary: `Target: ${target}/100` }
      score += 2
    } else {
      ready.push({ section: 'oisProfile', detail: `Target ${target}/100, baseline ${oisProfile.baseline ?? 0}` })
      sections.oisProfile = { status: 'READY', summary: `Target: ${target}/100` }
      score += 5
    }
  }

  // ── DNA Profile (5 pts) ────────────────────────────────────────────────────
  const dna = s.dnaProfile as Record<string, unknown> | undefined
  if (!dna) {
    warnings.push({ section: 'dnaProfile', message: 'No DNA profile — EnterpriseDNA will not be seeded on import.' })
    sections.dnaProfile = { status: 'MISSING', summary: 'Not present' }
    recommendations.push({ section: 'dnaProfile', action: 'Add dnaProfile to seed enterprise behavioral baseline (approvalSpeed, riskTolerance, decisionStyle).', priority: 'LOW' })
  } else {
    ready.push({ section: 'dnaProfile', detail: `${dna.decisionStyle ?? 'DATA_DRIVEN'} · ${dna.riskTolerance ?? 'BALANCED'} · ${dna.growthPhase ?? 'SCALING'}` })
    sections.dnaProfile = { status: 'READY', summary: `${dna.decisionStyle} / ${dna.riskTolerance}` }
    score += 5
  }

  // ── QEF Gates (5 pts) ─────────────────────────────────────────────────────
  const qef = s.qefGates as Record<string, unknown> | undefined
  if (!qef) {
    warnings.push({ section: 'qefGates', message: 'No QEF gate thresholds — quality enforcement will use platform defaults.' })
    sections.qefGates = { status: 'MISSING', summary: 'Using platform defaults' }
    recommendations.push({ section: 'qefGates', action: 'Add qefGates (G1–G8) to enforce quality thresholds for this deployment.', priority: 'LOW' })
  } else {
    const gateCount = Object.keys(qef).length
    if (gateCount < 4) {
      warnings.push({ section: 'qefGates', message: `Only ${gateCount} QEF gates defined. PS Pack recommends all 8 (G1–G8).` })
      sections.qefGates = { status: 'NEEDS_CONFIG', summary: `${gateCount} of 8 gates`, count: gateCount }
      score += 2
    } else {
      ready.push({ section: 'qefGates', detail: `${gateCount} QEF gates configured (G1–G8)` })
      sections.qefGates = { status: 'READY', summary: `${gateCount} gates`, count: gateCount }
      score += 5
    }
  }

  const finalScore  = Math.min(100, Math.max(0, score))
  const hasErrors   = errors.length > 0

  return {
    valid:           !hasErrors,
    version:         typeof s.version === 'string' ? s.version : null,
    pack:            typeof s.pack === 'string' ? s.pack : null,
    checksum,
    readinessScore:  hasErrors ? Math.min(finalScore, 60) : finalScore,
    errors,
    warnings,
    ready,
    recommendations,
    sections,
  }
}

// ─── Generate ──────────────────────────────────────────────────────────────────
// Reads live DB state and assembles a versioned Blueprint artifact.

export async function generateBlueprint(
  name: string,
  orgName: string,
  pack: string = 'professional-services',
  industry: string = 'professional-services',
  orgSize: string = 'SME',
): Promise<{ id: string; spec: BlueprintSpec }> {
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
    pack,

    organization: {
      name:     orgName,
      industry,
      size:     orgSize,
      pack,
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
    data: { name, version: spec.version, pack, industry, spec: spec as any, checksum, status: 'DRAFT' },
  })

  return { id: blueprint.id, spec }
}

// ─── Import ────────────────────────────────────────────────────────────────────
// Provisions an enterprise deployment from a Blueprint spec.
// Idempotent: skips entities that already exist by name.

const AGENT_ROLES: Record<string, string> = {
  PROJECT_HEALTH:       'Project health monitor',
  DELIVERY_MONITOR:     'Delivery SLA monitor',
  INVOICE_INTELLIGENCE: 'Invoice and collections intelligence',
  COLLECTIONS_AGENT:    'Collections escalation',
  DEAL_COACH:           'Sales deal coach',
  ENTERPRISE_COACH:     'Weekly enterprise intelligence synthesis',
  SENTINEL:             'System anomaly detection',
}

export async function importBlueprint(
  rawSpec: unknown,
  blueprintName: string,
): Promise<{
  blueprintId:              string
  created:                  Record<string, number>
  skipped:                  Record<string, number>
  deployedAt:               Date
  setupTimeEstimateMinutes: number
  nextSteps:                string[]
}> {
  const report = validateBlueprint(rawSpec)
  if (!report.valid) {
    throw new Error(`Invalid blueprint: ${report.errors.map(e => e.message).join('; ')}`)
  }

  const spec    = rawSpec as BlueprintSpec
  const created: Record<string, number> = { goals: 0, entityTypes: 0, policies: 0, workflows: 0, agents: 0, dna: 0, baseline: 0 }
  const skipped: Record<string, number> = { goals: 0, entityTypes: 0, policies: 0, workflows: 0, agents: 0, dna: 0, baseline: 0 }

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

  // 5. KimmpAgents from blueprint agents[]
  for (const a of (spec.agents ?? [])) {
    const ex = await (prisma as any).kimmpAgent.findFirst({ where: { name: a.id } })
    if (ex) { skipped.agents++; continue }
    await (prisma as any).kimmpAgent.create({
      data: {
        name:        a.id,
        role:        AGENT_ROLES[a.id] ?? a.id,
        description: `Blueprint agent — triggers on: ${(a.triggerOn ?? []).join(', ')}`,
        status:      'ACTIVE',
        tools:       ['read', 'write', 'notify'],
      },
    })
    created.agents++
  }

  // 6. EnterpriseDNA baseline from dnaProfile
  const dna = spec.dnaProfile
  if (dna) {
    const existingDna = await (prisma as any).enterpriseDNA.findFirst()
    if (existingDna) {
      skipped.dna = 1
    } else {
      await (prisma as any).enterpriseDNA.create({
        data: {
          approvalSpeed:       dna.approvalSpeed       ?? 'MODERATE',
          riskTolerance:       dna.riskTolerance       ?? 'BALANCED',
          decisionStyle:       dna.decisionStyle       ?? 'DATA_DRIVEN',
          escalationThreshold: dna.escalationThreshold ?? 'NORMAL',
          meetingDensity:      dna.meetingDensity      ?? 'MODERATE',
          growthPhase:         dna.growthPhase         ?? 'SCALING',
          dominantPillar:      dna.dominantPillar      ?? 'decision',
          weakestPillar:       dna.weakestPillar       ?? 'adoption',
        },
      })
      created.dna = 1
    }
  }

  // 7. Gate8Snapshot — Day 0 BASELINE
  const existingBaseline = await (prisma as any).gate8Snapshot.findFirst({ where: { label: 'BASELINE' } })
  if (existingBaseline) {
    skipped.baseline = 1
  } else {
    const baseScore = spec.oisProfile?.baseline ?? 0
    const frac      = baseScore / 100
    await (prisma as any).gate8Snapshot.create({
      data: {
        oisScore:        baseScore,
        decisionScore:   Math.round(frac * 80),
        workflowScore:   Math.round(frac * 70),
        aiScore:         Math.round(frac * 60),
        enterpriseScore: Math.round(frac * 80),
        goalScore:       Math.round(frac * 50),
        learningScore:   Math.round(frac * 40),
        businessScore:   Math.round(frac * 60),
        trustScore:      Math.round(frac * 70),
        adoptionScore:   Math.round(frac * 30),
        pillars:         {},
        triggeredBy:     'BLUEPRINT_IMPORT',
        label:           'BASELINE',
      },
    })
    created.baseline = 1
  }

  // 8. Record the blueprint
  const specJson   = JSON.stringify(spec, null, 2)
  const checksum   = crypto.createHash('sha256').update(specJson).digest('hex')
  const deployedAt = new Date()
  const blueprint  = await prisma.enterpriseBlueprint.create({
    data: {
      name:       blueprintName,
      version:    spec.version,
      pack:       spec.pack,
      industry:   spec.organization.industry,
      spec:       spec as any,
      checksum,
      status:     'ACTIVE',
      importedAt: deployedAt,
    },
  })

  return {
    blueprintId:              blueprint.id,
    created,
    skipped,
    deployedAt,
    setupTimeEstimateMinutes: 10,
    nextSteps: [
      'Invite team users at /admin/users',
      'Create the first project at /admin/pmo/projects',
      'Review WAANDA agent settings at /admin/kangqore-immp/agents',
      'Set COIG north-star baseline at /admin/gate8',
      'Verify policy approvals at /admin/hanumanas/policy/rules',
    ],
  }
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

// ─── Gap Capture ───────────────────────────────────────────────────────────────
// Records what the client needed that the PS Pack didn't include.
// Each gap becomes a candidate for PS Pack v1.1.

export type GapCategory = 'MISSING_ENTITY' | 'MISSING_POLICY' | 'MISSING_AGENT' | 'MISSING_WORKFLOW' | 'MISSING_CONFIG' | 'INTEGRATION' | 'OTHER'
export type GapSeverity = 'HIGH' | 'MEDIUM' | 'LOW'

export interface BlueprintGap {
  id:          string
  category:    GapCategory
  description: string
  severity:    GapSeverity
  reportedAt:  string
  packVersion: string
}

export async function addBlueprintGap(
  blueprintId: string,
  gap: Omit<BlueprintGap, 'id' | 'reportedAt'>,
): Promise<BlueprintGap[]> {
  const bp = await prisma.enterpriseBlueprint.findUnique({ where: { id: blueprintId } })
  if (!bp) throw new Error(`Blueprint ${blueprintId} not found`)

  const existing: BlueprintGap[] = Array.isArray((bp as any).gaps) ? (bp as any).gaps : []
  const newGap: BlueprintGap = {
    id:         crypto.randomUUID(),
    reportedAt: new Date().toISOString(),
    ...gap,
  }
  const updated = [...existing, newGap]
  await prisma.enterpriseBlueprint.update({ where: { id: blueprintId }, data: { gaps: updated as any } })
  return updated
}

export async function getBlueprintGaps(blueprintId: string): Promise<BlueprintGap[]> {
  const bp = await prisma.enterpriseBlueprint.findUnique({ where: { id: blueprintId } })
  if (!bp) throw new Error(`Blueprint ${blueprintId} not found`)
  return Array.isArray((bp as any).gaps) ? (bp as any).gaps : []
}

// ─── Gap Aggregation — PS Pack v1.1 Input Pipeline ────────────────────────────
// Aggregates gaps across all deployments, ranks by severity × frequency.
// The output is the direct input for generating the next pack version.

const SEVERITY_SCORE: Record<GapSeverity, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 }

export async function aggregateBlueprintGaps() {
  const blueprints = await prisma.enterpriseBlueprint.findMany({
    where:  { status: { in: ['ACTIVE', 'ARCHIVED'] } },
    select: { id: true, name: true, version: true, gaps: true, createdAt: true },
  })

  type EnrichedGap = BlueprintGap & { blueprintId: string; blueprintName: string }
  const allGaps: EnrichedGap[] = []
  for (const bp of blueprints) {
    const gaps: BlueprintGap[] = Array.isArray((bp as any).gaps) ? (bp as any).gaps : []
    for (const g of gaps) {
      allGaps.push({ ...g, blueprintId: bp.id, blueprintName: bp.name })
    }
  }

  // De-duplicate by category + normalised description
  const deduped = new Map<string, {
    description: string; category: GapCategory; severity: GapSeverity
    count: number; deployments: string[]; latestAt: string
  }>()
  for (const g of allGaps) {
    const key = `${g.category}::${g.description.toLowerCase().trim()}`
    if (!deduped.has(key)) {
      deduped.set(key, { description: g.description, category: g.category,
        severity: g.severity, count: 0, deployments: [], latestAt: g.reportedAt })
    }
    const entry = deduped.get(key)!
    entry.count++
    entry.deployments.push(g.blueprintId)
    if (g.severity === 'HIGH') entry.severity = 'HIGH'
    else if (g.severity === 'MEDIUM' && entry.severity === 'LOW') entry.severity = 'MEDIUM'
    if (new Date(g.reportedAt) > new Date(entry.latestAt)) entry.latestAt = g.reportedAt
  }

  const ranked = [...deduped.values()]
    .map(v => ({ ...v, score: v.count * SEVERITY_SCORE[v.severity], deployments: [...new Set(v.deployments)] }))
    .sort((a, b) => b.score - a.score)

  const highCount   = ranked.filter(g => g.severity === 'HIGH').length
  const recurring   = ranked.filter(g => g.count >= 2)
  const nextVersion = highCount > 0 ? bumpMinor(blueprints[0]?.version ?? '1.0.0') : bumpPatch(blueprints[0]?.version ?? '1.0.0')

  return {
    deploymentCount:  blueprints.length,
    totalGaps:        allGaps.length,
    uniqueIssues:     ranked.length,
    topIssues:        ranked.slice(0, 10),
    packImprovement: {
      suggestedVersion:   nextVersion,
      changeCount:        ranked.filter(g => g.score >= 2).length,
      highPriorityFixes:  ranked.filter(g => g.severity === 'HIGH').map(g => g.description),
      recurringIssues:    recurring.map(g => ({ description: g.description, count: g.count, category: g.category })),
      readyForPackUpdate: recurring.some(g => g.severity === 'HIGH'),
    },
    generatedAt: new Date().toISOString(),
  }
}

function bumpMinor(v: string): string {
  const [maj, min] = v.split('.').map(Number)
  return `${maj}.${(min ?? 0) + 1}.0`
}

function bumpPatch(v: string): string {
  const [maj, min, pat] = v.split('.').map(Number)
  return `${maj}.${min ?? 0}.${(pat ?? 0) + 1}`
}
