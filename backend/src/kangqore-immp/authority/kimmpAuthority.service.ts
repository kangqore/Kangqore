import { prisma } from '../../lib/prisma'
import { emitToAdmins } from '../../socket'

export const ACTION_LEVELS: Record<string, number> = {
  // L0 — auto-execute (reads + safe KIMMP-internal writes)
  QUERY_LEADS:           0,
  QUERY_PROJECTS:        0,
  QUERY_CLIENTS:         0,
  EMIT_SIGNAL:           0,
  ADD_MEMORY:            0,
  LOG_DECISION:          0,
  DISMISS_ALERT:         0,
  // L1 — auto-execute (safe writes to Kangqore data)
  CREATE_LEAD:           1,
  SCHEDULE_TASK:         1,
  COMPLETE_GOAL_TASK:    1,
  CREATE_GOAL:           1,
  CREATE_GOAL_TASK:      1,
  GENERATE_REPORT:        1,
  TRIGGER_ALIS_RESPONSE:  1,
  UPDATE_VIS_OPPORTUNITY: 1,
  // L2 — auto-execute with notification
  SEND_NOTIFICATION:     2,
  UPDATE_LEAD_STATUS:    2,
  // L3 — requires ADMIN approval
  UPDATE_PROJECT_STATUS: 3,
  DRAFT_EMAIL:           3,
  DELETE_RECORD:         3,
  SEND_EMAIL:            3,
  EXTERNAL_API_CALL:     3,
}

export const LEVEL_LABELS: Record<number, string> = {
  0: 'READ ONLY',
  1: 'SUGGEST',
  2: 'DRAFT',
  3: 'REQUEST APPROVAL',
  4: 'AUTO-EXECUTE',
}

export class KimmpAuthorityEngine {
  static getActionLevel(actionType: string): number {
    return ACTION_LEVELS[actionType] ?? 3
  }

  static async canAutoExecute(actionType: string): Promise<boolean> {
    const level = this.getActionLevel(actionType)
    return level <= 2
  }

  /** Create a persistent approval request (Level 3+). Returns the request ID. */
  static async createApprovalRequest(params: {
    tool: string
    action: string
    description: string
    input: any
    level: number
    agentId?: string
  }): Promise<string> {
    const expiresAt = new Date(Date.now() + 3_600_000) // 1 hour TTL
    const row = await (prisma as any).kimmpApprovalRequest.create({
      data: {
        agentId:     params.agentId ?? null,
        tool:        params.tool,
        action:      params.action,
        description: params.description,
        input:       params.input,
        level:       params.level,
        status:      'PENDING',
        expiresAt,
      },
    })
    // Real-time notification to ADMIN dashboard
    try {
      emitToAdmins('kimmp:approval_request', {
        id:          row.id,
        action:      params.action,
        description: params.description,
        tool:        params.tool,
        level:       params.level,
      })
    } catch {}
    return row.id as string
  }

  /** ADMIN approves — returns the stored input so caller can execute it */
  static async approve(requestId: string, adminId: string): Promise<{ input: any; action: string } | null> {
    try {
      const row = await (prisma as any).kimmpApprovalRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED', reviewedAt: new Date(), reviewedBy: adminId },
      })
      return { input: row.input, action: row.action }
    } catch {
      return null
    }
  }

  /** ADMIN denies */
  static async deny(requestId: string, adminId: string): Promise<void> {
    try {
      await (prisma as any).kimmpApprovalRequest.update({
        where: { id: requestId },
        data: { status: 'DENIED', reviewedAt: new Date(), reviewedBy: adminId },
      })
    } catch {}
  }

  /** Get all pending approvals (not expired) */
  static async getPending(): Promise<any[]> {
    try {
      return await (prisma as any).kimmpApprovalRequest.findMany({
        where: { status: 'PENDING', expiresAt: { gt: new Date() } },
        orderBy: { requestedAt: 'desc' },
        take: 50,
      })
    } catch {
      return []
    }
  }

  // ─── Agent CRUD ────────────────────────────────────────────────────────────

  static async getAllAgents(): Promise<any[]> {
    try {
      return await (prisma as any).kimmpAgent.findMany({
        orderBy: { createdAt: 'desc' },
      })
    } catch {
      return []
    }
  }

  static async createAgent(data: {
    name: string; role: string; description?: string
    maxLevel?: number; tools?: string[]; model?: string; systemPrompt?: string
  }): Promise<any> {
    return await (prisma as any).kimmpAgent.create({
      data: {
        name:         data.name,
        role:         data.role,
        description:  data.description ?? null,
        maxLevel:     data.maxLevel ?? 1,
        tools:        data.tools ?? [],
        model:        data.model ?? 'claude-sonnet-4-6',
        systemPrompt: data.systemPrompt ?? null,
        status:       'ACTIVE',
      },
    })
  }

  static async setLevel(agentId: string, maxLevel: number): Promise<any> {
    return await (prisma as any).kimmpAgent.update({
      where: { id: agentId },
      data:  { maxLevel: Math.min(4, Math.max(0, maxLevel)) },
    })
  }

  static async suspend(agentId: string): Promise<void> {
    await (prisma as any).kimmpAgent.update({ where: { id: agentId }, data: { status: 'SUSPENDED' } })
  }

  static async kill(agentId: string): Promise<void> {
    await (prisma as any).kimmpAgent.update({ where: { id: agentId }, data: { status: 'KILLED' } })
  }

  static async activate(agentId: string): Promise<void> {
    await (prisma as any).kimmpAgent.update({ where: { id: agentId }, data: { status: 'ACTIVE' } })
  }

  // ─── Tool registry ──────────────────────────────────────────────────────────

  static async getAllTools(): Promise<any[]> {
    try {
      return await (prisma as any).kimmpTool.findMany({ orderBy: { category: 'asc' } })
    } catch {
      return []
    }
  }
}
