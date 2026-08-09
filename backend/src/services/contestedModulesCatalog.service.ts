// ---------------------------------------------------------------------------
// Contested Modules Catalog — Overshadow Roadmap P4.
//
// CSM and Security Operations were the two modules the ServiceNow playbook's
// own matrix marked "Contested" rather than "Together." This file builds the
// real product capability the playbook said was winnable with tools already
// built: a CustomerCase and an HrCase ontology type, governed actions on
// each, a pre-built Object Set, and an Agent Studio starter template — using
// the same Ontology/ObjectSet/MarketplaceListing infrastructure every other
// domain in this platform runs on, not a bespoke one-off.
//
// Every seed here is idempotent by natural key (type name / action name /
// object-set name), safe to call on every read.
// ---------------------------------------------------------------------------

import { prisma } from '../lib/prisma'
import { ensureAgentTemplatesSeeded } from './agentStudioGrowth.service'

interface TypeSeed {
  name: string
  displayName: string
  icon: string
  color: string
  description: string
  schema: Record<string, { type: string; required?: boolean; description?: string }>
}

const CUSTOMER_CASE_TYPE: TypeSeed = {
  name: 'CustomerCase', displayName: 'Customer Case', icon: 'Headset', color: '#2564ea',
  description: 'A support case: who raised it, what tier they are, and how it was resolved — case, customer, entitlement, and resolution as one governed object.',
  schema: {
    customerName:       { type: 'string', required: true },
    customerEmail:       { type: 'string' },
    entitlementTier:     { type: 'select', description: 'STANDARD | PREMIUM | ENTERPRISE' },
    priority:            { type: 'select', description: 'LOW | MEDIUM | HIGH | URGENT' },
    category:            { type: 'string' },
    status:              { type: 'select', description: 'OPEN | IN_PROGRESS | ESCALATED | RESOLVED | CLOSED', required: true },
    resolutionSummary:   { type: 'string' },
    slaDeadline:         { type: 'date' },
    resolvedAt:          { type: 'date' },
  },
}

const HR_CASE_TYPE: TypeSeed = {
  name: 'HrCase', displayName: 'HR Case', icon: 'Users', color: '#7c3aed',
  description: 'An employee-lifecycle case — onboarding, offboarding, grievance, leave, performance, or benefits — tracked with confidentiality built in, not bolted on.',
  schema: {
    employeeName:      { type: 'string', required: true },
    employeeId:         { type: 'string' },
    caseType:           { type: 'select', description: 'ONBOARDING | OFFBOARDING | GRIEVANCE | LEAVE_REQUEST | PERFORMANCE | BENEFITS', required: true },
    status:             { type: 'select', description: 'OPEN | IN_PROGRESS | PENDING_MANAGER | RESOLVED | CLOSED', required: true },
    confidentiality:    { type: 'select', description: 'STANDARD | RESTRICTED' },
    openedAt:           { type: 'date' },
    resolvedAt:         { type: 'date' },
    resolutionSummary:  { type: 'string' },
  },
}

interface ActionSeed {
  name: string; displayName: string; description: string
  parameters: Array<{ name: string; type: string; required?: boolean; description?: string }>
  allowedRoles: string[]
  toolCallable: boolean
}

// Lower-stakes case actions are tool-callable; anything that closes or
// escalates an HR case stays human-only — the same conservative posture P3
// used for AEGIS enforcement actions (GOVERNANCE_BLOCK/BUDGET_DENY stayed
// off the tool-callable list). A support case being resolved by an agent is
// a much smaller blast radius than an HR case being closed by one.
const CUSTOMER_CASE_ACTIONS: ActionSeed[] = [
  { name: 'LOG_CUSTOMER_CASE_UPDATE', displayName: 'Log Case Update', description: 'Add a note or status update to a customer case.', parameters: [{ name: 'note', type: 'string', required: true }], allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true },
  { name: 'RESOLVE_CUSTOMER_CASE',    displayName: 'Resolve Case',     description: 'Mark a customer case resolved with a summary.',      parameters: [{ name: 'resolutionSummary', type: 'string', required: true }], allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true },
  { name: 'ESCALATE_CUSTOMER_CASE',   displayName: 'Escalate Case',    description: 'Escalate a customer case to a higher priority tier.', parameters: [{ name: 'reason', type: 'string', required: true }], allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true },
]

const HR_CASE_ACTIONS: ActionSeed[] = [
  { name: 'LOG_HR_CASE_UPDATE', displayName: 'Log HR Case Update', description: 'Add a note or status update to an HR case.', parameters: [{ name: 'note', type: 'string', required: true }], allowedRoles: ['ADMIN'], toolCallable: true },
  { name: 'ESCALATE_HR_CASE',   displayName: 'Escalate HR Case',   description: 'Escalate an HR case to a manager or HRBP. Human-gated — not exposed as an agent tool.', parameters: [{ name: 'reason', type: 'string', required: true }], allowedRoles: ['ADMIN'], toolCallable: false },
  { name: 'CLOSE_HR_CASE',      displayName: 'Close HR Case',      description: 'Close an HR case with a resolution summary. Human-gated — not exposed as an agent tool.', parameters: [{ name: 'resolutionSummary', type: 'string', required: true }], allowedRoles: ['ADMIN'], toolCallable: false },
]

async function ensureType(seed: TypeSeed) {
  const existing = await (prisma as any).ontologyObjectType.findUnique({ where: { name: seed.name } })
  if (existing) return existing
  return (prisma as any).ontologyObjectType.create({ data: seed })
}

async function ensureActions(typeId: string, seeds: ActionSeed[]) {
  for (const a of seeds) {
    const existing = await (prisma as any).ontologyAction.findFirst({ where: { typeId, name: a.name } })
    if (existing) continue
    await (prisma as any).ontologyAction.create({
      data: { typeId, name: a.name, displayName: a.displayName, description: a.description, parameters: a.parameters, allowedRoles: a.allowedRoles, toolCallable: a.toolCallable },
    })
  }
}

async function ensureObjectSet(name: string, description: string, rootTypeId: string) {
  const existing = await (prisma as any).objectSet.findFirst({ where: { name } })
  if (existing) return existing
  return (prisma as any).objectSet.create({
    data: { name, description, rootTypeId, query: {}, tags: ['starter', 'contested-modules'], isPublic: false, isSystem: true },
  })
}

export async function ensureContestedModulesSeeded(): Promise<void> {
  const csType = await ensureType(CUSTOMER_CASE_TYPE)
  await ensureActions(csType.id, CUSTOMER_CASE_ACTIONS)
  await ensureObjectSet('Customer Service Cases', 'Pre-built Object Set over all Customer Case instances — the CSM-contest starter set (Overshadow Roadmap P4.1).', csType.id)

  const hrType = await ensureType(HR_CASE_TYPE)
  await ensureActions(hrType.id, HR_CASE_ACTIONS)
  await ensureObjectSet('HR Cases', 'Pre-built Object Set over all HR Case instances — the HRSD-contest starter set (Overshadow Roadmap P4.3).', hrType.id)
}

export async function getContestedModulesStatus() {
  // Object types/actions/sets first, then the templates that reference their
  // action names — order matters for the story even if not for creation.
  await ensureContestedModulesSeeded()
  await ensureAgentTemplatesSeeded()

  const [csType, hrType] = await Promise.all([
    (prisma as any).ontologyObjectType.findUnique({ where: { name: 'CustomerCase' } }),
    (prisma as any).ontologyObjectType.findUnique({ where: { name: 'HrCase' } }),
  ])
  const [csActionCount, hrActionCount, csSet, hrSet, csTemplate, hrTemplate, csInstances, hrInstances] = await Promise.all([
    (prisma as any).ontologyAction.count({ where: { typeId: csType.id } }),
    (prisma as any).ontologyAction.count({ where: { typeId: hrType.id } }),
    (prisma as any).objectSet.findFirst({ where: { name: 'Customer Service Cases' } }),
    (prisma as any).objectSet.findFirst({ where: { name: 'HR Cases' } }),
    (prisma as any).marketplaceListing.findFirst({ where: { type: 'AGENT', slug: 'customer-service-case-handler' } }),
    (prisma as any).marketplaceListing.findFirst({ where: { type: 'AGENT', slug: 'hr-case-assistant' } }),
    (prisma as any).ontologyObject.count({ where: { typeId: csType.id } }),
    (prisma as any).ontologyObject.count({ where: { typeId: hrType.id } }),
  ])

  return {
    customerService: {
      objectType: { live: true, name: csType.displayName },
      governedActions: csActionCount,
      objectSet: { live: !!csSet, name: csSet?.name ?? null, instanceCount: csInstances },
      agentTemplate: { live: !!csTemplate, name: csTemplate?.name ?? null },
      bidsPillar: 'Customer Intelligence™ (Pillar 6)',
    },
    hr: {
      objectType: { live: true, name: hrType.displayName },
      governedActions: hrActionCount,
      objectSet: { live: !!hrSet, name: hrSet?.name ?? null, instanceCount: hrInstances },
      agentTemplate: { live: !!hrTemplate, name: hrTemplate?.name ?? null },
      bidsPillar: 'Workforce Intelligence™ (Pillar 5)',
    },
    disclaimer: 'Object type, governed actions, and Object Set are real and queryable — instance counts are 0 until a real customer populates them. That is expected: this is a pre-built capability, not staged demo data.',
    computedAt: new Date().toISOString(),
  }
}
