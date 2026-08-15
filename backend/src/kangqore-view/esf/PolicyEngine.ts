import { prisma } from '../../lib/prisma'

export interface PolicyCheckInput {
  trigger:  string              // action type e.g. 'EXTERNAL_API_CALL'
  params:   Record<string, any> // the action params
  actorId?: string
}

export type PolicyEffect = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL' | 'NOTIFY'

export interface PolicyCheckResult {
  effect:      PolicyEffect
  policyId:    string | null
  policyName:  string | null
  reason:      string
}

// ── Condition evaluation ──────────────────────────────────────────────────────
// Condition JSON: { field, operator, value }
// field supports dot notation: "params.amount", "params.platform"

function getField(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, k) => acc?.[k], obj)
}

function evaluate(condition: any, input: PolicyCheckInput): boolean {
  if (!condition || !condition.field) return true // no condition = always matches

  // Support AND / OR arrays
  if (condition.AND) return (condition.AND as any[]).every(c => evaluate(c, input))
  if (condition.OR)  return (condition.OR  as any[]).some(c  => evaluate(c, input))

  const { field, operator, value } = condition
  const actual = getField({ trigger: input.trigger, params: input.params, actorId: input.actorId }, field)

  switch (operator) {
    case 'eq':           return actual === value
    case 'ne':           return actual !== value
    case 'gt':           return Number(actual) > Number(value)
    case 'gte':          return Number(actual) >= Number(value)
    case 'lt':           return Number(actual) < Number(value)
    case 'lte':          return Number(actual) <= Number(value)
    case 'contains':     return String(actual ?? '').toLowerCase().includes(String(value).toLowerCase())
    case 'startsWith':   return String(actual ?? '').startsWith(String(value))
    case 'in':           return Array.isArray(value) && value.includes(actual)
    case 'notIn':        return Array.isArray(value) && !value.includes(actual)
    case 'exists':       return actual !== undefined && actual !== null
    default:             return false
  }
}

// ── Main policy check ─────────────────────────────────────────────────────────
// Returns the highest-priority matching policy. Default: ALLOW.

export async function checkPolicy(input: PolicyCheckInput): Promise<PolicyCheckResult> {
  const policies = await prisma.kimmpPolicy.findMany({
    where: {
      enabled: true,
      OR: [{ trigger: input.trigger }, { trigger: '*' }],
    },
    orderBy: { priority: 'desc' },
  })

  for (const p of policies) {
    const condition = p.condition as any
    if (evaluate(condition, input)) {
      return {
        effect:     p.effect as PolicyEffect,
        policyId:   p.id,
        policyName: p.name,
        reason:     p.description ?? `Policy "${p.name}" matched`,
      }
    }
  }

  return { effect: 'ALLOW', policyId: null, policyName: null, reason: 'No matching policy — default ALLOW' }
}

// ── CRUD helpers ──────────────────────────────────────────────────────────────

export async function listPolicies() {
  return prisma.kimmpPolicy.findMany({ orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }] })
}

export async function createPolicy(data: {
  name: string; description?: string; trigger: string
  condition: object; effect: string; priority?: number
}) {
  return prisma.kimmpPolicy.create({
    data: {
      name:        data.name,
      description: data.description,
      trigger:     data.trigger,
      condition:   data.condition,
      effect:      data.effect,
      priority:    data.priority ?? 0,
    },
  })
}

export async function updatePolicy(id: string, data: Partial<{
  name: string; description: string; trigger: string
  condition: object; effect: string; priority: number; enabled: boolean
}>) {
  return prisma.kimmpPolicy.update({ where: { id }, data: { ...data, updatedAt: new Date() } })
}

export async function deletePolicy(id: string) {
  return prisma.kimmpPolicy.delete({ where: { id } })
}

// ── Seed default policies ──────────────────────────────────────────────────────

// Blast-radius policies — always upserted (independent of seedDefaultPolicies guard)
export async function seedBlastRadiusPolicies(): Promise<{ upserted: number }> {
  const policies = [
    {
      id: 'blast-deploy-service',
      name: 'Require approval for service deployments',
      description: 'DEPLOY_SERVICE has irreversible blast radius — always gates on human approval before connector fires',
      trigger: 'DEPLOY_SERVICE',
      condition: {},
      effect: 'REQUIRE_APPROVAL',
      priority: 100,
    },
    {
      id: 'blast-rollback-deployment',
      name: 'Require approval for rollbacks',
      description: 'Rolling back a deployment changes live traffic — requires human sign-off',
      trigger: 'ROLLBACK_DEPLOYMENT',
      condition: {},
      effect: 'REQUIRE_APPROVAL',
      priority: 100,
    },
    {
      id: 'blast-rotate-secret',
      name: 'Require approval for secret rotation',
      description: 'Rotating a secret invalidates existing consumers — requires explicit approval',
      trigger: 'ROTATE_SECRET',
      condition: {},
      effect: 'REQUIRE_APPROVAL',
      priority: 100,
    },
    {
      id: 'blast-change-employee',
      name: 'Require approval for employee changes',
      description: 'CHANGE_EMPLOYEE (role, termination, access) has legal and HR implications — always approved',
      trigger: 'CHANGE_EMPLOYEE',
      condition: {},
      effect: 'REQUIRE_APPROVAL',
      priority: 100,
    },
    {
      id: 'blast-approve-purchase',
      name: 'Require approval for purchase orders',
      description: 'All APPROVE_PURCHASE actions require a second human to confirm before committing spend',
      trigger: 'APPROVE_PURCHASE',
      condition: {},
      effect: 'REQUIRE_APPROVAL',
      priority: 100,
    },
    {
      id: 'blast-create-enterprise-invoice',
      name: 'Require approval for enterprise invoices',
      description: 'Enterprise invoices represent financial commitments — must be human-approved',
      trigger: 'CREATE_ENTERPRISE_INVOICE',
      condition: {},
      effect: 'REQUIRE_APPROVAL',
      priority: 100,
    },
    {
      id: 'blast-modify-configuration',
      name: 'Audit all configuration changes',
      description: 'Config changes affect live systems — always logged for audit even when auto-approved',
      trigger: 'MODIFY_CONFIGURATION',
      condition: {},
      effect: 'NOTIFY',
      priority: 90,
    },
  ]

  let upserted = 0
  for (const p of policies) {
    await prisma.kimmpPolicy.upsert({
      where: { id: p.id },
      create: p as any,
      update: { effect: p.effect, priority: p.priority, description: p.description },
    })
    upserted++
  }
  return { upserted }
}

export async function seedDefaultPolicies() {
  const count = await prisma.kimmpPolicy.count()
  if (count > 0) return

  const defaults = [
    // ── Decision Engine policies ───────────────────────────────────────────
    {
      name:        'Flag low-confidence decisions',
      description: 'Notify when KIMMP Decision Engine confidence is below 55% — human review recommended',
      trigger:     'STRATEGIC_DECISION',
      condition:   { field: 'params.confidence', operator: 'lt', value: 55 },
      effect:      'NOTIFY',
      priority:    90,
    },
    {
      name:        'Require approval for high-impact strategic decisions',
      description: 'Any decision involving revenue, hiring, or client termination requires admin sign-off',
      trigger:     'STRATEGIC_DECISION',
      condition:   { field: 'params.question', operator: 'contains', value: 'client' },
      effect:      'REQUIRE_APPROVAL',
      priority:    80,
    },
    {
      name:        'Block decisions with no evidence',
      description: 'Deny any decision that has zero evidence entries — unsupported decisions are not allowed',
      trigger:     'STRATEGIC_DECISION',
      condition:   { field: 'params.evidenceCount', operator: 'eq', value: 0 },
      effect:      'DENY',
      priority:    95,
    },
    // ── Data mutation policies ─────────────────────────────────────────────
    {
      name:        'Require approval for all record deletions',
      description: 'KIMMP cannot auto-delete any record — all deletes require human approval',
      trigger:     'DELETE_RECORD',
      condition:   {},
      effect:      'REQUIRE_APPROVAL',
      priority:    100,
    },
    {
      name:        'Block high-value Salesforce updates',
      description: 'Deny Salesforce opportunity updates above £100,000 without KIMMP review',
      trigger:     'EXTERNAL_API_CALL',
      condition:   { AND: [{ field: 'params.platform', operator: 'eq', value: 'salesforce' }, { field: 'params.params.amount', operator: 'gt', value: 100000 }] },
      effect:      'REQUIRE_APPROVAL',
      priority:    75,
    },
    {
      name:        'Require approval for all Salesforce writes',
      description: 'All KIMMP writes to Salesforce must be human-approved',
      trigger:     'EXTERNAL_API_CALL',
      condition:   { field: 'params.platform', operator: 'eq', value: 'salesforce' },
      effect:      'REQUIRE_APPROVAL',
      priority:    50,
    },
    // ── Audit policies ────────────────────────────────────────────────────
    {
      name:        'Notify on new lead creation',
      description: 'Log every KIMMP-created lead for audit',
      trigger:     'CREATE_LEAD',
      condition:   {},
      effect:      'NOTIFY',
      priority:    10,
    },
    {
      name:        'Audit all KIMMP external writes',
      description: 'Every external system write is logged to AegisAuditLog automatically',
      trigger:     '*',
      condition:   {},
      effect:      'NOTIFY',
      priority:    1,
    },
  ]

  for (const p of defaults) {
    await prisma.kimmpPolicy.upsert({
      where: { id: `seed-${p.name.replace(/\s+/g, '-').toLowerCase()}` },
      create: { id: `seed-${p.name.replace(/\s+/g, '-').toLowerCase()}`, ...p },
      update: {},
    }).catch(() => {})
  }
}
