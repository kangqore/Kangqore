// S295–S297 — Action Engine v2
// Upgrades OntologyAction from a label into a real execution engine shared by
// humans, KIMMP, and AEGIS: typed parameter validation, pre-flight validation
// rules, and declarative write-back effects applied atomically.

import { Prisma } from '@prisma/client'
import axios from 'axios'
import { prisma } from '../lib/prisma'

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
      const rel = await tx.ontologyRelationship.create({
        data: {
          sourceId: ctx.object.id, targetId,
          sourceType: sourceType?.name ?? 'Unknown', targetType: target?.type?.name ?? 'Unknown',
          relationshipType: config.relationshipType ?? 'RELATED_TO',
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
}

export const ActionEngine = {
  async preflight(actionId: string, params: Record<string, any>, objectId?: string | null) {
    const action = await prisma.ontologyAction.findUniqueOrThrow({
      where: { id: actionId },
      include: { validationRules: { orderBy: { order: 'asc' } } },
    })
    const object = objectId ? await prisma.ontologyObject.findUnique({ where: { id: objectId } }) : null
    const paramDefs = ((action.parameters as unknown) as ActionParameterDef[]) ?? []
    const typedCheck = validateTypedParams(paramDefs, params)
    const ruleCheck = runValidationRules(action.validationRules, { params, object })
    const errors: RuleError[] = [
      ...typedCheck.errors.map(e => ({ severity: 'BLOCK' as const, message: e.message })),
      ...ruleCheck.errors,
    ]
    return { valid: typedCheck.valid && ruleCheck.valid, errors }
  },

  async execute(input: ExecuteInput) {
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

    const paramDefs = ((action.parameters as unknown) as ActionParameterDef[]) ?? []
    const typedCheck = validateTypedParams(paramDefs, input.params ?? {})
    const ruleCheck = runValidationRules(action.validationRules, { params: input.params ?? {}, object })
    const preflightErrors: RuleError[] = [
      ...typedCheck.errors.map(e => ({ severity: 'BLOCK' as const, message: e.message })),
      ...ruleCheck.errors,
    ]

    if (!typedCheck.valid || !ruleCheck.valid) {
      return prisma.actionExecution.create({
        data: {
          actionId: input.actionId, objectId: input.objectId ?? undefined,
          actorId: input.actorId ?? undefined, actorType,
          params: input.params ?? {}, effectsApplied: [],
          status: 'BLOCKED',
          errorMessage: preflightErrors.map(e => `[${e.severity}] ${e.message}`).join('; '),
          durationMs: Date.now() - t0,
          confidence: input.confidence,
        },
      })
    }

    const effectCtx: EffectCtx = { params: input.params ?? {}, object, actorId: input.actorId, actorType }
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
    }

    const execution = await prisma.actionExecution.create({
      data: {
        actionId: input.actionId, objectId: input.objectId ?? undefined,
        actorId: input.actorId ?? undefined, actorType,
        params: input.params ?? {}, effectsApplied: applied,
        status, errorMessage,
        durationMs: Date.now() - t0,
        confidence: input.confidence,
      },
    })

    if (status === 'SUCCESS') {
      await prisma.ontologyAction.update({ where: { id: input.actionId }, data: { executions: { increment: 1 } } })
    }

    return execution
  },
}
