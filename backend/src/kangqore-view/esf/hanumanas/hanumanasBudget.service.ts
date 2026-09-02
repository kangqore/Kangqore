// AEGIS Per-Tenant Budget Enforcement — extracted from hanumanasRoutes.ts (S112) so
// it can be called as a pre-validation gate from the Action Engine (S298)
// instead of only being checkable on demand via GET /budget/:tenantId/usage.

import { prisma } from '../../../lib/prisma'

export interface TenantBudgetConfig {
  callLimit: number
  windowHours: number
  hardDeny: boolean
}

// In-memory budget store (persisted as KIMMP signals for audit trail) —
// unchanged from the original S112 implementation.
const tenantBudgets: Record<string, TenantBudgetConfig> = {}

export const HanumanasBudget = {
  setBudget(tenantId: string, cfg: Partial<TenantBudgetConfig>): TenantBudgetConfig {
    tenantBudgets[tenantId] = {
      callLimit:   cfg.callLimit   ?? 500,
      windowHours: cfg.windowHours ?? 24,
      hardDeny:    cfg.hardDeny    ?? true,
    }
    return tenantBudgets[tenantId]
  },

  getConfig(tenantId: string): TenantBudgetConfig | undefined {
    return tenantBudgets[tenantId]
  },

  listConfigs(): Array<{ tenantId: string } & TenantBudgetConfig> {
    return Object.entries(tenantBudgets).map(([tenantId, cfg]) => ({ tenantId, ...cfg }))
  },

  /** Usage check — same logic GET /budget/:tenantId/usage exposed, now reusable. */
  async checkUsage(tenantId: string): Promise<{
    callCount: number; budget: number | null; windowHours: number
    overBudget: boolean; hardDeny: boolean; since: Date
  }> {
    const cfg = tenantBudgets[tenantId]
    const since = new Date(Date.now() - (cfg?.windowHours ?? 24) * 3_600_000)

    const callCount = await (prisma as any).hanumanasActionLog.count({
      where: { agentId: { contains: tenantId }, executedAt: { gte: since } },
    }).catch(() => 0)

    const budget = cfg?.callLimit ?? null
    const overBudget = budget !== null && callCount > budget

    return { callCount, budget, windowHours: cfg?.windowHours ?? 24, overBudget, hardDeny: cfg?.hardDeny ?? false, since }
  },

  /** S298 — Action Engine pre-validation gate. Returns a BLOCK-style error when over hard-deny budget. */
  async gate(tenantId: string): Promise<{ blocked: boolean; message?: string }> {
    const usage = await this.checkUsage(tenantId)
    if (usage.overBudget && usage.hardDeny) {
      await (prisma as any).hanumanasActionLog.create({
        data: {
          actionType: 'LOG_AUDIT_ENTRY', level: 0,
          agentId: 'aegis.budget-enforcer', engine: 'AUTONOMY_BOUNDARY',
          params: { tenantId, callCount: usage.callCount, limit: usage.budget },
          result: { blocked: true }, status: 'SUCCESS',
        },
      }).catch(() => {})
      return { blocked: true, message: `Tenant "${tenantId}" exceeded budget: ${usage.callCount}/${usage.budget} calls in the last ${usage.windowHours}h` }
    }
    return { blocked: false }
  },
}
