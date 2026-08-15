// S295–S297 — Action Engine v2
// Upgrades OntologyAction from a label into a real execution engine shared by
// humans, KIMMP, and AEGIS: typed parameter validation, pre-flight validation
// rules, and declarative write-back effects applied atomically.

import { Prisma } from '@prisma/client'
import axios from 'axios'
import { prisma } from '../../lib/prisma'
import { checkPolicy } from '../esf/PolicyEngine'
import { CardinalityEngine } from '../eof/CardinalityEngine'
import { AegisBudget } from '../../kangqore-aegis/aegisBudget.service'
import { getIO } from '../../socket'
import { dispatchToConnectors } from './connectors/registry'

// ─── Typed parameters ───────────────────────────────────────────────────────

export type ParamType = 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'object-ref' | 'object-set'

export interface ActionParameterDef {
  name: string
  type: ParamType
  required?: boolean
  enum?: string[]
  min?: number
  max?: number
  regex?: string
  description?: string
}

export interface FieldError { param?: string; message: string }

export function validateTypedParams(paramDefs: ActionParameterDef[], params: Record<string, any>): { valid: boolean; errors: FieldError[] } {
  const errors: FieldError[] = []
  for (const def of paramDefs) {
    const value = params?.[def.name]
    const missing = value === undefined || value === null || value === ''
    if (missing) {
      if (def.required) errors.push({ param: def.name, message: `"${def.name}" is required` })
      continue
    }
    switch (def.type) {
      case 'string': case 'object-ref': case 'object-set':
        if (typeof value !== 'string') errors.push({ param: def.name, message: `"${def.name}" must be a string` })
        else if (def.regex && !new RegExp(def.regex).test(value)) errors.push({ param: def.name, message: `"${def.name}" does not match the required pattern` })
        break
      case 'number': {
        const n = typeof value === 'number' ? value : Number(value)
        if (Number.isNaN(n)) errors.push({ param: def.name, message: `"${def.name}" must be a number` })
        else {
          if (def.min !== undefined && n < def.min) errors.push({ param: def.name, message: `"${def.name}" must be ≥ ${def.min}` })
          if (def.max !== undefined && n > def.max) errors.push({ param: def.name, message: `"${def.name}" must be ≤ ${def.max}` })
        }
        break
      }
      case 'boolean':
        if (typeof value !== 'boolean') errors.push({ param: def.name, message: `"${def.name}" must be true/false` })
        break
      case 'date':
        if (Number.isNaN(Date.parse(value))) errors.push({ param: def.name, message: `"${def.name}" must be a valid date` })
        break
      case 'enum':
        if (!def.enum?.includes(value)) errors.push({ param: def.name, message: `"${def.name}" must be one of: ${(def.enum ?? []).join(', ')}` })
        break
    }
  }
  return { valid: errors.length === 0, errors }
}

// ─── Validation rule condition DSL ──────────────────────────────────────────

export type ConditionOp = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'exists'
export interface ConditionLeaf { source: 'param' | 'object'; field: string; op: ConditionOp; value?: any }
export interface ConditionAll { all: ConditionNode[] }
export interface ConditionAny { any: ConditionNode[] }
export type ConditionNode = ConditionLeaf | ConditionAll | ConditionAny

function readObjectField(object: any, field: string): any {
  if (!object) return undefined
  if (field === 'id' || field === 'typeId' || field === 'externalId') return object[field]
  if (field.startsWith('properties.')) {
    const path = field.slice('properties.'.length).split('.')
    let cur: any = object.properties
    for (const key of path) { if (cur == null) return undefined; cur = cur[key] }
    return cur
  }
  return object.properties?.[field]
}

function evalLeaf(leaf: ConditionLeaf, ctx: { params: Record<string, any>; object: any }): boolean {
  const actual = leaf.source === 'param' ? ctx.params?.[leaf.field] : readObjectField(ctx.object, leaf.field)
  switch (leaf.op) {
    case 'eq':       return actual === leaf.value
    case 'neq':      return actual !== leaf.value
    case 'gt':       return typeof actual === 'number' && actual > leaf.value
    case 'gte':      return typeof actual === 'number' && actual >= leaf.value
    case 'lt':       return typeof actual === 'number' && actual < leaf.value
    case 'lte':      return typeof actual === 'number' && actual <= leaf.value
    case 'contains': return typeof actual === 'string' && actual.toLowerCase().includes(String(leaf.value).toLowerCase())
    case 'in':        return Array.isArray(leaf.value) && leaf.value.includes(actual)
    case 'exists':    return actual !== undefined && actual !== null && actual !== ''
    default: return false
  }
}

export function evalCondition(node: ConditionNode, ctx: { params: Record<string, any>; object: any }): boolean {
  if ('all' in node) return node.all.every(c => evalCondition(c, ctx))
  if ('any' in node) return node.any.some(c => evalCondition(c, ctx))
  return evalLeaf(node, ctx)
}

export interface RuleError { severity: 'BLOCK' | 'WARN'; message: string }

export function runValidationRules(
  rules: Array<{ condition: any; errorMessage: string; severity: string }>,
  ctx: { params: Record<string, any>; object: any },
): { valid: boolean; errors: RuleError[] } {
  const errors: RuleError[] = []
  for (const rule of rules) {
    const passes = evalCondition(rule.condition as ConditionNode, ctx)
    if (!passes) errors.push({ severity: (rule.severity as 'BLOCK' | 'WARN') ?? 'BLOCK', message: rule.errorMessage })
  }
  return { valid: !errors.some(e => e.severity === 'BLOCK'), errors }
}

// ─── Policy gate — S298 ──────────────────────────────────────────────────────
// Routes every Action through the same KimmpPolicy engine that already exists
// (policyEngine.service.ts) but, until now, was only reachable via an admin
// test route. `action.name` doubles as the policy `trigger` — the existing
// seed data (STRATEGIC_DECISION, EXTERNAL_API_CALL, DELETE_RECORD, ...) starts
// firing the moment an Action with a matching name executes.

export interface PolicyGateResult {
  effect: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL' | 'NOTIFY'
  policyId: string | null
  policyName: string | null
  reason: string
}

async function runPolicyGate(actionName: string, params: Record<string, any>, actorId?: string | null): Promise<PolicyGateResult> {
  return checkPolicy({ trigger: actionName, params, actorId: actorId ?? undefined })
}

function truncate(s: string | undefined | null, max = 500): string | undefined {
  if (!s) return undefined
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

function emitExecutionEvent(execution: any): void {
  try { getIO().to('admin').emit('action:execution', execution) } catch { /* socket not initialised (tests, scripts) */ }
}

// ─── Effects ─────────────────────────────────────────────────────────────────

export type EffectType = 'UPDATE_OBJECT' | 'CREATE_OBJECT' | 'CREATE_RELATIONSHIP' | 'WEBHOOK' | 'EMIT_EVENT'

interface EffectCtx { params: Record<string, any>; object: any; actorId?: string | null; actorType: string }

function resolveTemplate(value: any, ctx: EffectCtx): any {
  if (typeof value !== 'string') return value
  const fullMatch = value.match(/^\{\{(\w+)\}\}$/)
  if (fullMatch) return ctx.params?.[fullMatch[1]]
  if (!value.includes('{{')) return value
  return value.replace(/\{\{(\w+)\}\}/g, (_m, name) => {
    const v = ctx.params?.[name]
    return v === undefined ? '' : String(v)
  })
}

function resolveProperties(props: Record<string, any> | undefined, ctx: EffectCtx): Record<string, any> {
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(props ?? {})) out[k] = resolveTemplate(v, ctx)
  return out
}

async function applyDbEffect(tx: Prisma.TransactionClient, effect: { effectType: string; configuration: any }, ctx: EffectCtx): Promise<any> {
  const config = effect.configuration ?? {}
  switch (effect.effectType as EffectType) {
    case 'UPDATE_OBJECT': {
      if (!ctx.object) throw new Error('UPDATE_OBJECT effect requires an object context')
      const patch = resolveProperties(config.properties, ctx)
      const updated = await tx.ontologyObject.update({
        where: { id: ctx.object.id },
        data: { properties: { ...((ctx.object.properties as object) ?? {}), ...patch } },
      })
      return { object: updated }
    }
    case 'CREATE_OBJECT': {
      if (!config.typeId) throw new Error('CREATE_OBJECT effect requires a typeId')
      const props = resolveProperties(config.properties, ctx)
      const created = await tx.ontologyObject.create({ data: { typeId: config.typeId, properties: props } })
      return { objectId: created.id }
    }
    case 'CREATE_RELATIONSHIP': {
      if (!ctx.object) throw new Error('CREATE_RELATIONSHIP effect requires a source object context')
      const targetId = ctx.params?.[config.targetObjectParam]
      if (!targetId) throw new Error(`CREATE_RELATIONSHIP: param "${config.targetObjectParam}" did not resolve to a target object id`)
      const [sourceType, target] = await Promise.all([
        tx.ontologyObjectType.findUnique({ where: { id: ctx.object.typeId }, select: { name: true } }),
        tx.ontologyObject.findUnique({ where: { id: targetId }, select: { type: { select: { name: true } } } }),
      ])
      const srcTypeName = sourceType?.name ?? 'Unknown'
      const tgtTypeName = target?.type?.name ?? 'Unknown'
      const relType = config.relationshipType ?? 'RELATED_TO'
      const card = await CardinalityEngine.check(srcTypeName, tgtTypeName, relType, ctx.object.id, targetId)
      if (!card.valid) throw new Error(`Cardinality violation: ${card.violation}`)
      const rel = await tx.ontologyRelationship.create({
        data: {
          sourceId: ctx.object.id, targetId,
          sourceType: srcTypeName, targetType: tgtTypeName,
          relationshipType: relType,
          label: config.label ?? undefined,
          inferredBy: ctx.actorType === 'HUMAN' ? 'USER' : ctx.actorType,
        },
      })
      return { relationshipId: rel.id }
    }
    case 'EMIT_EVENT': {
      if (!ctx.object) throw new Error('EMIT_EVENT effect requires an object context')
      const props = resolveProperties(config.properties, ctx)
      const event = await tx.ontologyEvent.create({
        data: { objectId: ctx.object.id, eventType: config.eventType ?? 'ACTION', occurredAt: new Date(), properties: props, actorId: ctx.actorId ?? undefined },
      })
      return { eventId: event.id }
    }
    default:
      throw new Error(`Unknown DB effect type: ${effect.effectType}`)
  }
}

async function applyWebhookEffect(effect: { configuration: any }, ctx: EffectCtx): Promise<any> {
  const config = effect.configuration ?? {}
  if (!config.url) throw new Error('WEBHOOK effect requires a url')
  const payload = resolveProperties(config.fieldMapping, ctx)
  const method = (config.method ?? 'POST').toUpperCase()
  const res = await axios.request({ url: config.url, method, data: payload, timeout: 10_000, validateStatus: () => true })
  if (res.status >= 400) throw new Error(`Webhook responded ${res.status}`)
  return { status: res.status }
}

// ─── Execution pipeline ──────────────────────────────────────────────────────
// Validate → apply DB-mutating effects atomically (one transaction) → fire
// WEBHOOK effects post-commit (outbox pattern — an external call must never
// hold a DB transaction open) → write the audit row.

export interface ExecuteInput {
  actionId: string
  params: Record<string, any>
  objectId?: string | null
  actorId?: string | null
  actorType?: string
  confidence?: number
  // S298 — KIMMP/AEGIS provenance, folded straight onto the audit row
  agentsMixed?: string[]
  sourceModule?: string
  reasoning?: string
  // P4 — caller-supplied dedup key; same key + actionId = return existing execution (idempotent)
  idempotencyKey?: string
}

// System actions are gated on the actor's own budget bucket — HUMAN actors are
// never budget-limited (a person clicking a button isn't "spend").
async function checkBudgetGate(actorType: string, actorId?: string | null): Promise<{ blocked: boolean; message?: string }> {
  if (actorType === 'HUMAN') return { blocked: false }
  return AegisBudget.gate(actorId ?? actorType.toLowerCase())
}

export const ActionEngine = {
  async preflight(actionId: string, params: Record<string, any>, objectId?: string | null, actorType: string = 'HUMAN', actorId?: string | null) {
    const action = await prisma.ontologyAction.findUniqueOrThrow({
      where: { id: actionId },
      include: { validationRules: { orderBy: { order: 'asc' } } },
    })
    const object = objectId ? await prisma.ontologyObject.findUnique({ where: { id: objectId } }) : null
    const paramDefs = ((action.parameters as unknown) as ActionParameterDef[]) ?? []
    const typedCheck = validateTypedParams(paramDefs, params)
    const ruleCheck = runValidationRules(action.validationRules, { params, object })
    const policy = await runPolicyGate(action.name, params, actorId)
    const errors: RuleError[] = [
      ...typedCheck.errors.map(e => ({ severity: 'BLOCK' as const, message: e.message })),
      ...ruleCheck.errors,
    ]
    if (policy.effect === 'DENY') errors.push({ severity: 'BLOCK', message: `Policy "${policy.policyName}": ${policy.reason}` })
    else if (policy.effect === 'REQUIRE_APPROVAL') errors.push({ severity: 'WARN', message: `Will require ADMIN approval — policy "${policy.policyName}"` })
    else if (policy.effect === 'NOTIFY') errors.push({ severity: 'WARN', message: `Policy "${policy.policyName}" will log this execution for audit` })

    if (actorType !== 'HUMAN') {
      const usage = await AegisBudget.checkUsage(actorId ?? actorType.toLowerCase())
      if (usage.overBudget && usage.hardDeny) errors.push({ severity: 'BLOCK', message: `Budget exceeded: ${usage.callCount}/${usage.budget} calls in ${usage.windowHours}h` })
    }

    return { valid: typedCheck.valid && ruleCheck.valid && !errors.some(e => e.severity === 'BLOCK'), errors }
  },

  async execute(input: ExecuteInput) {
    // Idempotency — return existing execution if caller supplied a key we've seen before
    if (input.idempotencyKey) {
      const existing = await (prisma.actionExecution as any).findUnique({
        where: { actionId_idempotencyKey: { actionId: input.actionId, idempotencyKey: input.idempotencyKey } },
      })
      if (existing) return existing
    }

    const t0 = Date.now()
    const actorType = input.actorType ?? 'HUMAN'
    const action = await prisma.ontologyAction.findUniqueOrThrow({
      where: { id: input.actionId },
      include: {
        validationRules: { orderBy: { order: 'asc' } },
        effects: { orderBy: { order: 'asc' } },
      },
    })
    const object = input.objectId ? await prisma.ontologyObject.findUnique({ where: { id: input.objectId } }) : null
    const params = input.params ?? {}

    const commonFields = {
      actionId: input.actionId, objectId: input.objectId ?? undefined,
      actorId: input.actorId ?? undefined, actorType,
      params, confidence: input.confidence,
      agentsMixed: input.agentsMixed ?? [],
      sourceModule: input.sourceModule,
      reasoning: truncate(input.reasoning),
    }

    const paramDefs = ((action.parameters as unknown) as ActionParameterDef[]) ?? []
    const typedCheck = validateTypedParams(paramDefs, params)
    const ruleCheck = runValidationRules(action.validationRules, { params, object })
    const preflightErrors: RuleError[] = [
      ...typedCheck.errors.map(e => ({ severity: 'BLOCK' as const, message: e.message })),
      ...ruleCheck.errors,
    ]

    if (!typedCheck.valid || !ruleCheck.valid) {
      const execution = await prisma.actionExecution.create({
        data: {
          ...commonFields, effectsApplied: [],
          status: 'BLOCKED',
          errorMessage: preflightErrors.map(e => `[${e.severity}] ${e.message}`).join('; '),
          durationMs: Date.now() - t0,
        },
      })
      emitExecutionEvent(execution)
      return execution
    }

    // S298 — Policy gate: the same KimmpPolicy engine humans and AI both answer to.
    const policy = await runPolicyGate(action.name, params, input.actorId)
    if (policy.effect === 'DENY') {
      const execution = await prisma.actionExecution.create({
        data: {
          ...commonFields, effectsApplied: [],
          status: 'BLOCKED', policyId: policy.policyId ?? undefined,
          errorMessage: `Policy "${policy.policyName}": ${policy.reason}`,
          durationMs: Date.now() - t0,
        },
      })
      emitExecutionEvent(execution)
      return execution
    }
    if (policy.effect === 'REQUIRE_APPROVAL') {
      await prisma.pendingApproval.create({
        data: {
          actionId: input.actionId, objectId: input.objectId ?? undefined,
          actorId: input.actorId ?? undefined, actorType,
          params, policyId: policy.policyId ?? undefined, policyName: policy.policyName ?? undefined,
          reason: policy.reason, confidence: input.confidence,
        },
      })
      const execution = await prisma.actionExecution.create({
        data: {
          ...commonFields, effectsApplied: [],
          status: 'PENDING_APPROVAL', policyId: policy.policyId ?? undefined,
          errorMessage: `Awaiting ADMIN approval — policy "${policy.policyName}": ${policy.reason}`,
          durationMs: Date.now() - t0,
        },
      })
      emitExecutionEvent(execution)
      return execution
    }

    // S298 — Budget gate (KIMMP/AEGIS only; a human clicking a button isn't "spend").
    const budget = await checkBudgetGate(actorType, input.actorId)
    if (budget.blocked) {
      const execution = await prisma.actionExecution.create({
        data: {
          ...commonFields, effectsApplied: [],
          status: 'BLOCKED',
          errorMessage: budget.message,
          durationMs: Date.now() - t0,
        },
      })
      emitExecutionEvent(execution)
      return execution
    }

    const effectCtx: EffectCtx = { params, object, actorId: input.actorId, actorType }
    const dbEffects = action.effects.filter(e => e.effectType !== 'WEBHOOK')
    const webhookEffects = action.effects.filter(e => e.effectType === 'WEBHOOK')
    const applied: any[] = []
    let status: 'SUCCESS' | 'FAILED' = 'SUCCESS'
    let errorMessage: string | null = null

    try {
      await prisma.$transaction(async (tx) => {
        for (const effect of dbEffects) {
          const result = await applyDbEffect(tx, effect, effectCtx)
          applied.push({ effectId: effect.id, effectType: effect.effectType, result })
          if (effect.effectType === 'UPDATE_OBJECT' && result?.object) effectCtx.object = result.object
        }
      })
    } catch (e: any) {
      status = 'FAILED'
      errorMessage = e.message
    }

    if (status === 'SUCCESS') {
      for (const effect of webhookEffects) {
        try {
          const result = await applyWebhookEffect(effect, effectCtx)
          applied.push({ effectId: effect.id, effectType: 'WEBHOOK', result })
        } catch (e: any) {
          // Outbox pattern: DB effects already committed. A failed webhook is
          // recorded on the audit row but does not roll back committed state.
          applied.push({ effectId: effect.id, effectType: 'WEBHOOK', error: e.message })
        }
      }

      // Connector dispatch — route action to real integrations (Slack, GitHub, email, etc.)
      const connectorResults = await dispatchToConnectors(action.name, params, input.actorId, actorType)
      for (const cr of connectorResults) {
        applied.push({ effectType: 'CONNECTOR', connector: cr.connector, status: cr.status, message: cr.message, data: cr.data })
      }
    }

    const execution = await prisma.actionExecution.create({
      data: {
        ...commonFields, effectsApplied: applied,
        status, errorMessage,
        policyId: policy.effect === 'NOTIFY' ? (policy.policyId ?? undefined) : undefined,
        idempotencyKey: input.idempotencyKey ?? undefined,
        durationMs: Date.now() - t0,
      },
    })

    if (status === 'SUCCESS') {
      await prisma.ontologyAction.update({ where: { id: input.actionId }, data: { executions: { increment: 1 } } })
    }

    emitExecutionEvent(execution)
    return execution
  },

  // ─── S299 — Human-in-the-loop ────────────────────────────────────────────────

  async resolvePendingApproval(pendingId: string, decision: 'APPROVE' | 'REJECT', resolvedBy: string) {
    const pending = await prisma.pendingApproval.findUniqueOrThrow({
      where: { id: pendingId },
      include: { action: { include: { effects: { orderBy: { order: 'asc' } } } } },
    })
    if (pending.status !== 'PENDING') throw new Error(`Already ${pending.status.toLowerCase()}`)

    const object = pending.objectId ? await prisma.ontologyObject.findUnique({ where: { id: pending.objectId } }) : null
    const params = (pending.params as Record<string, any>) ?? {}

    if (decision === 'REJECT') {
      const execution = await prisma.actionExecution.create({
        data: {
          actionId: pending.actionId, objectId: pending.objectId ?? undefined,
          actorId: pending.actorId ?? undefined, actorType: pending.actorType,
          params, effectsApplied: [], status: 'BLOCKED',
          errorMessage: `Rejected by ADMIN (${resolvedBy})`,
          policyId: pending.policyId ?? undefined, confidence: pending.confidence,
          durationMs: 0,
        },
      })
      await prisma.pendingApproval.update({
        where: { id: pendingId },
        data: { status: 'REJECTED', resolvedBy, resolvedAt: new Date(), executionId: execution.id },
      })
      emitExecutionEvent(execution)
      try { getIO().to('admin').emit('pendingapproval:resolved', { id: pendingId, decision: 'REJECT' }) } catch {}
      return execution
    }

    // APPROVE — apply effects now, bypassing the policy gate that already
    // matched (an ADMIN just overrode it for this one execution).
    const t0 = Date.now()
    const effectCtx: EffectCtx = { params, object, actorId: pending.actorId, actorType: pending.actorType }
    const dbEffects = pending.action.effects.filter(e => e.effectType !== 'WEBHOOK')
    const webhookEffects = pending.action.effects.filter(e => e.effectType === 'WEBHOOK')
    const applied: any[] = []
    let status: 'SUCCESS' | 'FAILED' = 'SUCCESS'
    let errorMessage: string | null = null

    try {
      await prisma.$transaction(async (tx) => {
        for (const effect of dbEffects) {
          const result = await applyDbEffect(tx, effect, effectCtx)
          applied.push({ effectId: effect.id, effectType: effect.effectType, result })
          if (effect.effectType === 'UPDATE_OBJECT' && result?.object) effectCtx.object = result.object
        }
      })
    } catch (e: any) {
      status = 'FAILED'
      errorMessage = e.message
    }
    if (status === 'SUCCESS') {
      for (const effect of webhookEffects) {
        try {
          const result = await applyWebhookEffect(effect, effectCtx)
          applied.push({ effectId: effect.id, effectType: 'WEBHOOK', result })
        } catch (e: any) {
          applied.push({ effectId: effect.id, effectType: 'WEBHOOK', error: e.message })
        }
      }

      // Connector dispatch — also fires on approval so approved actions reach real systems
      const connectorResults = await dispatchToConnectors(pending.action.name, params, pending.actorId, pending.actorType)
      for (const cr of connectorResults) {
        applied.push({ effectType: 'CONNECTOR', connector: cr.connector, status: cr.status, message: cr.message, data: cr.data })
      }
    }

    const execution = await prisma.actionExecution.create({
      data: {
        actionId: pending.actionId, objectId: pending.objectId ?? undefined,
        actorId: pending.actorId ?? undefined, actorType: pending.actorType,
        params, effectsApplied: applied, status, errorMessage,
        policyId: pending.policyId ?? undefined, confidence: pending.confidence,
        reasoning: truncate(`Approved by ADMIN (${resolvedBy})`),
        durationMs: Date.now() - t0,
      },
    })
    if (status === 'SUCCESS') {
      await prisma.ontologyAction.update({ where: { id: pending.actionId }, data: { executions: { increment: 1 } } })
    }
    await prisma.pendingApproval.update({
      where: { id: pendingId },
      data: { status: 'APPROVED', resolvedBy, resolvedAt: new Date(), executionId: execution.id },
    })
    emitExecutionEvent(execution)
    try { getIO().to('admin').emit('pendingapproval:resolved', { id: pendingId, decision: 'APPROVE' }) } catch {}
    return execution
  },

  // ─── S298 — Seed system Actions for KIMMP task types ─────────────────────────
  // MissionDispatcher and AegisActionExecutor resolve these by name to route
  // KIMMP/AEGIS execution through this same engine instead of a separate path.

  SYSTEM_TYPE: { name: 'System', displayName: 'System', icon: 'Cpu', color: '#64748b', description: 'Non-business-object execution surface for KIMMP and AEGIS system actions' },
  SYSTEM_ACTIONS: [
    { name: 'ANALYZE_CLIENT',      displayName: 'Analyze Client',      description: 'KIMMP client analysis task' },
    { name: 'RUN_AGENT',           displayName: 'Run Agent',           description: 'KIMMP generic agent/mission execution' },
    { name: 'GENERATE_INSIGHT',    displayName: 'Generate Insight',    description: 'KIMMP insight generation task' },
    { name: 'STRATEGIC_DECISION',  displayName: 'Strategic Decision',  description: 'KIMMP Decision Engine strategic decision' },
    { name: 'GOVERNANCE_BLOCK',    displayName: 'Governance Action',   description: 'AEGIS governance action (pause/block/quarantine/etc.)' },
    { name: 'BUDGET_DENY',         displayName: 'Budget Enforcement',  description: 'AEGIS per-tenant budget gate' },
  ] as Array<{ name: string; displayName: string; description: string }>,

  async seedSystemActions(): Promise<Array<{ created: boolean; name: string }>> {
    const type = await prisma.ontologyObjectType.upsert({
      where: { name: ActionEngine.SYSTEM_TYPE.name },
      create: ActionEngine.SYSTEM_TYPE,
      update: {},
    })
    const results: Array<{ created: boolean; name: string }> = []
    for (const def of ActionEngine.SYSTEM_ACTIONS) {
      const existing = await prisma.ontologyAction.findUnique({ where: { typeId_name: { typeId: type.id, name: def.name } } })
      if (existing) { results.push({ created: false, name: def.name }); continue }
      await prisma.ontologyAction.create({
        data: { typeId: type.id, name: def.name, displayName: def.displayName, description: def.description, parameters: [], allowedRoles: ['ADMIN'] },
      })
      results.push({ created: true, name: def.name })
    }
    return results
  },

  /** Resolve a seeded system Action's id by name — used by MissionDispatcher/AegisActionExecutor. */
  async getSystemActionId(name: string): Promise<string | null> {
    const type = await prisma.ontologyObjectType.findUnique({ where: { name: ActionEngine.SYSTEM_TYPE.name } })
    if (!type) return null
    const action = await prisma.ontologyAction.findUnique({ where: { typeId_name: { typeId: type.id, name } } })
    return action?.id ?? null
  },
}
