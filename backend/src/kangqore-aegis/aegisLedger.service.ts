// ---------------------------------------------------------------------------
// AEGIS Ledger — immutable audit service for all four governance domains.
//
// All methods are best-effort: they never throw so a ledger write failure
// never blocks the operation being recorded.
// ---------------------------------------------------------------------------

import { prisma } from '../lib/prisma'
import logger from '../utils/logger'

export type AegisEventType =
  | 'ACTIVATION'
  | 'AUTONOMOUS'
  | 'ACCESS_DENIED'
  | 'KNOWLEDGE_ASSET'
  | 'EGRESS'
  | 'POLICY_VIOLATION'

export interface ActivationInput {
  system: string
  trigger: string
  actor: string
  autonomous?: boolean
  dispatchId?: string
  agentsRun?: string[]
  priority?: string
  confidence?: number
  durationMs?: number
  userId?: string
  metadata?: Record<string, unknown>
}

export interface AccessDeniedInput {
  endpoint: string
  method: string
  userId?: string
  userRole?: string
  ip?: string
}

export interface KnowledgeAssetInput {
  system: string
  assetId: string
  assetType: string
  assetSource?: string
  dispatchId?: string
  metadata?: Record<string, unknown>
}

export class AegisLedger {
  private static async write(data: {
    eventType: AegisEventType
    system?: string
    trigger?: string
    actor: string
    autonomous?: boolean
    endpoint?: string
    method?: string
    userRole?: string
    userId?: string
    dispatchId?: string
    agentsRun?: string[]
    priority?: string
    confidence?: number
    durationMs?: number
    assetId?: string
    assetType?: string
    assetSource?: string
    metadata?: Record<string, unknown>
  }): Promise<string | null> {
    try {
      const row = await (prisma as any).aegisAuditLog.create({ data })
      return row.id as string
    } catch (err) {
      logger.warn('[AEGIS] Ledger write failed: ' + (err as Error).message)
      return null
    }
  }

  static async logActivation(input: ActivationInput): Promise<string | null> {
    return AegisLedger.write({
      eventType:  input.autonomous ? 'AUTONOMOUS' : 'ACTIVATION',
      system:     input.system,
      trigger:    input.trigger,
      actor:      input.actor,
      autonomous: input.autonomous ?? false,
      dispatchId: input.dispatchId,
      agentsRun:  input.agentsRun ?? [],
      priority:   input.priority,
      confidence: input.confidence,
      durationMs: input.durationMs,
      userId:     input.userId,
      metadata:   input.metadata,
    })
  }

  static async logAccessDenied(input: AccessDeniedInput): Promise<string | null> {
    return AegisLedger.write({
      eventType: 'ACCESS_DENIED',
      actor:     input.userId ?? 'anonymous',
      endpoint:  input.endpoint,
      method:    input.method,
      userId:    input.userId,
      userRole:  input.userRole,
      metadata:  { ip: input.ip },
    })
  }

  static async logEgress(input: {
    endpoint:  string
    method:    string
    userId?:   string
    userRole?: string
    ip?:       string
    assetType?: string
    payloadSize?: number
    responseStatus?: number
  }): Promise<string | null> {
    return AegisLedger.write({
      eventType: 'EGRESS',
      actor:     input.userId ?? 'ADMIN',
      endpoint:  input.endpoint,
      method:    input.method,
      userId:    input.userId,
      userRole:  input.userRole,
      assetType: input.assetType,
      metadata:  { ip: input.ip, payloadSize: input.payloadSize, responseStatus: input.responseStatus },
    })
  }

  static async logPolicyViolation(input: {
    policy:   string
    actor?:   string
    system?:  string
    detail:   string
    severity: string
    metadata?: Record<string, unknown>
  }): Promise<string | null> {
    return AegisLedger.write({
      eventType: 'POLICY_VIOLATION',
      system:    input.system,
      actor:     input.actor ?? 'UNKNOWN',
      priority:  input.severity,
      trigger:   input.policy,
      metadata:  { detail: input.detail, ...input.metadata },
    })
  }

  static async logKnowledgeAsset(input: KnowledgeAssetInput): Promise<string | null> {
    return AegisLedger.write({
      eventType:   'KNOWLEDGE_ASSET',
      system:      input.system,
      actor:       'KIMMP',
      assetId:     input.assetId,
      assetType:   input.assetType,
      assetSource: input.assetSource,
      dispatchId:  input.dispatchId,
      metadata:    input.metadata,
    })
  }

  static async query(opts: {
    eventType?: AegisEventType
    autonomous?: boolean
    system?: string
    limit?: number
    offset?: number
    from?: Date
    to?: Date
  } = {}): Promise<{ rows: unknown[]; total: number }> {
    try {
      const where: Record<string, unknown> = {}
      if (opts.eventType)  where.eventType  = opts.eventType
      if (opts.autonomous !== undefined) where.autonomous = opts.autonomous
      if (opts.system)     where.system     = opts.system
      if (opts.from || opts.to) {
        where.createdAt = {}
        if (opts.from) (where.createdAt as any).gte = opts.from
        if (opts.to)   (where.createdAt as any).lte = opts.to
      }

      const take   = Math.min(Math.max(1, opts.limit  ?? 50), 200)
      const skip   = Math.max(0, opts.offset ?? 0)

      const [rows, total] = await Promise.all([
        (prisma as any).aegisAuditLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take,
          skip,
        }),
        (prisma as any).aegisAuditLog.count({ where }),
      ])
      return { rows, total }
    } catch (err) {
      logger.warn('[AEGIS] Ledger query failed: ' + (err as Error).message)
      return { rows: [], total: 0 }
    }
  }

  static async stats(): Promise<{
    totalActivations: number
    totalAutonomous: number
    totalDenied: number
    totalAssets: number
    systemBreakdown: Record<string, number>
  }> {
    try {
      const [activations, autonomous, denied, assets, systemRows] = await Promise.all([
        (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION' } }),
        (prisma as any).aegisAuditLog.count({ where: { autonomous: true } }),
        (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACCESS_DENIED' } }),
        (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET' } }),
        (prisma as any).aegisAuditLog.groupBy({
          by: ['system'],
          _count: { _all: true },
          where: { eventType: { in: ['ACTIVATION', 'AUTONOMOUS'] } },
        }),
      ])

      const systemBreakdown: Record<string, number> = {}
      for (const row of systemRows as any[]) {
        if (row.system) systemBreakdown[row.system] = row._count._all
      }

      return { totalActivations: activations, totalAutonomous: autonomous, totalDenied: denied, totalAssets: assets, systemBreakdown }
    } catch {
      return { totalActivations: 0, totalAutonomous: 0, totalDenied: 0, totalAssets: 0, systemBreakdown: {} }
    }
  }
}
