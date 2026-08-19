// Phase 5.4 — Governance Inheritance Kernel
//
// The single chokepoint every marketplace app call passes through. An app author
// writes no security code; installing an app derives the full envelope from its
// manifest, and every execution is evaluated and recorded against that envelope.
//
// The six inherited layers, in evaluation order:
//   identity      → resolve app + installation, reject unknown/suspended
//   permissions   → action & object-type allowlists derived from the manifest
//   governance    → AEGIS policy evaluation (DENY / REQUIRE_APPROVAL / ALLOW)
//   billing       → credit envelope debited per call, exhaustion blocks
//   audit         → AppAuditEvent row written on every outcome, including denials
//   observability → duration + outcome counters surfaced to the ops console
//
// Every branch that returns writes an audit row. A caller cannot obtain an
// allow decision without a corresponding persisted record.

import { prisma } from '../../lib/prisma'
import { checkPolicy } from '../esf/PolicyEngine'
import type { AppPermission, KangqoreAppManifest } from './AppManifest'

export type InheritanceOutcome = 'ALLOWED' | 'DENIED' | 'PENDING_APPROVAL' | 'ERROR'

export interface GovernanceContext {
  appId: string
  tenantId: string
  actorId: string
  actionName?: string
  objectType?: string
  params?: Record<string, any>
  creditCost?: number
}

export interface GovernanceDecision {
  outcome: InheritanceOutcome
  allowed: boolean
  reason: string
  auditId: string
  installationId?: string
  policy: {
    checked: boolean
    policyId?: string | null
    policyName?: string | null
    effect?: string
  }
  billing: {
    creditsCharged: number
    creditsRemaining: number
  }
  /** Which of the six layers actually ran. Reported, never assumed. */
  inherited: {
    identity: boolean
    permissions: boolean
    governance: boolean
    billing: boolean
    audit: boolean
    observability: boolean
  }
}

/** Derive the executable envelope from a manifest's declared permissions. */
export function deriveEnvelopeFromManifest(manifest: KangqoreAppManifest): {
  allowedActions: string[]
  allowedObjectTypes: string[]
  grantedScopes: string[]
} {
  const permissions: AppPermission[] = Array.isArray(manifest?.permissions) ? manifest.permissions : []

  const allowedObjectTypes = Array.from(
    new Set([
      ...permissions.filter(p => p.action === 'READ' || p.action === 'WRITE').map(p => p.resource),
      ...(manifest?.ontologyBindings ?? []).map(b => b.objectType),
    ]),
  ).filter(Boolean)

  const allowedActions = Array.from(
    new Set((manifest?.actions ?? []).map(a => a.name).filter(Boolean)),
  )

  const grantedScopes = Array.from(
    new Set(permissions.map(p => `${p.action.toLowerCase()}:${p.resource}`)),
  )

  return { allowedActions, allowedObjectTypes, grantedScopes }
}

async function writeAudit(args: {
  appId: string
  installationId?: string | null
  tenantId: string
  actorId: string
  eventType: string
  actionName?: string
  outcome: InheritanceOutcome
  policyId?: string | null
  policyName?: string | null
  policyEffect?: string | null
  creditsCharged?: number
  durationMs?: number
  params?: any
  result?: any
  errorMessage?: string
}): Promise<string> {
  const row = await prisma.appAuditEvent.create({
    data: {
      appId: args.appId,
      installationId: args.installationId ?? null,
      tenantId: args.tenantId,
      actorId: args.actorId,
      actorType: 'DEVELOPER_APP',
      eventType: args.eventType,
      actionName: args.actionName ?? null,
      outcome: args.outcome,
      policyId: args.policyId ?? null,
      policyName: args.policyName ?? null,
      policyEffect: args.policyEffect ?? null,
      creditsCharged: args.creditsCharged ?? 0,
      durationMs: args.durationMs ?? null,
      params: args.params ?? undefined,
      result: args.result ?? undefined,
      errorMessage: args.errorMessage ?? null,
    },
    select: { id: true },
  })
  return row.id
}

export const GovernanceKernel = {
  deriveEnvelopeFromManifest,

  /**
   * Evaluate a single app call against all six inherited layers.
   * Returns a decision; callers must refuse to proceed unless `allowed` is true.
   */
  async authorize(ctx: GovernanceContext): Promise<GovernanceDecision> {
    const started = Date.now()
    const creditCost = ctx.creditCost ?? 1

    const base = {
      identity: false,
      permissions: false,
      governance: false,
      billing: false,
      audit: true, // every path below writes a row before returning
      observability: true,
    }

    // ── 1. IDENTITY ──────────────────────────────────────────────────────────
    const installation = await prisma.appInstallation.findUnique({
      where: { appId_tenantId: { appId: ctx.appId, tenantId: ctx.tenantId } },
      include: { app: true },
    })

    if (!installation || installation.status !== 'ACTIVE') {
      const auditId = await writeAudit({
        appId: ctx.appId,
        tenantId: ctx.tenantId,
        actorId: ctx.actorId,
        eventType: 'ACTION_EXECUTE',
        actionName: ctx.actionName,
        outcome: 'DENIED',
        durationMs: Date.now() - started,
        errorMessage: installation
          ? `Installation status is ${installation.status}`
          : `App "${ctx.appId}" is not installed for tenant "${ctx.tenantId}"`,
      })
      return {
        outcome: 'DENIED',
        allowed: false,
        reason: installation
          ? `App installation is ${installation.status}, not ACTIVE.`
          : 'App is not installed for this tenant.',
        auditId,
        policy: { checked: false },
        billing: { creditsCharged: 0, creditsRemaining: installation?.budgetCredits ?? 0 },
        inherited: base,
      }
    }

    if (installation.app.status === 'SUSPENDED') {
      const auditId = await writeAudit({
        appId: ctx.appId,
        installationId: installation.id,
        tenantId: ctx.tenantId,
        actorId: ctx.actorId,
        eventType: 'ACTION_EXECUTE',
        actionName: ctx.actionName,
        outcome: 'DENIED',
        durationMs: Date.now() - started,
        errorMessage: 'App is suspended platform-wide',
      })
      return {
        outcome: 'DENIED',
        allowed: false,
        reason: 'App is suspended platform-wide.',
        auditId,
        installationId: installation.id,
        policy: { checked: false },
        billing: { creditsCharged: 0, creditsRemaining: installation.budgetCredits - installation.creditsUsed },
        inherited: { ...base, identity: true },
      }
    }

    const remainingBefore = installation.budgetCredits - installation.creditsUsed

    // ── 2. PERMISSIONS ───────────────────────────────────────────────────────
    if (ctx.actionName && installation.allowedActions.length > 0) {
      if (!installation.allowedActions.includes(ctx.actionName)) {
        const auditId = await writeAudit({
          appId: ctx.appId,
          installationId: installation.id,
          tenantId: ctx.tenantId,
          actorId: ctx.actorId,
          eventType: 'ACTION_EXECUTE',
          actionName: ctx.actionName,
          outcome: 'DENIED',
          durationMs: Date.now() - started,
          errorMessage: `Action "${ctx.actionName}" is outside the installed permission envelope`,
        })
        return {
          outcome: 'DENIED',
          allowed: false,
          reason: `Action "${ctx.actionName}" was not granted at install time.`,
          auditId,
          installationId: installation.id,
          policy: { checked: false },
          billing: { creditsCharged: 0, creditsRemaining: remainingBefore },
          inherited: { ...base, identity: true },
        }
      }
    }

    if (ctx.objectType && installation.allowedObjectTypes.length > 0) {
      if (!installation.allowedObjectTypes.includes(ctx.objectType)) {
        const auditId = await writeAudit({
          appId: ctx.appId,
          installationId: installation.id,
          tenantId: ctx.tenantId,
          actorId: ctx.actorId,
          eventType: 'ACTION_EXECUTE',
          actionName: ctx.actionName,
          outcome: 'DENIED',
          durationMs: Date.now() - started,
          errorMessage: `Object type "${ctx.objectType}" is outside the installed permission envelope`,
        })
        return {
          outcome: 'DENIED',
          allowed: false,
          reason: `Object type "${ctx.objectType}" was not granted at install time.`,
          auditId,
          installationId: installation.id,
          policy: { checked: false },
          billing: { creditsCharged: 0, creditsRemaining: remainingBefore },
          inherited: { ...base, identity: true },
        }
      }
    }

    // ── 3. GOVERNANCE (AEGIS policy) ─────────────────────────────────────────
    const policyResult = await checkPolicy({
      trigger: `APP_ACTION:${ctx.appId}:${ctx.actionName ?? '*'}`,
      params: ctx.params ?? {},
      actorId: ctx.actorId,
    })

    if (policyResult.effect === 'DENY') {
      const auditId = await writeAudit({
        appId: ctx.appId,
        installationId: installation.id,
        tenantId: ctx.tenantId,
        actorId: ctx.actorId,
        eventType: 'POLICY_DENY',
        actionName: ctx.actionName,
        outcome: 'DENIED',
        policyId: policyResult.policyId,
        policyName: policyResult.policyName,
        policyEffect: policyResult.effect,
        durationMs: Date.now() - started,
        params: ctx.params,
        errorMessage: policyResult.reason,
      })
      return {
        outcome: 'DENIED',
        allowed: false,
        reason: `AEGIS policy denied execution: ${policyResult.reason}`,
        auditId,
        installationId: installation.id,
        policy: {
          checked: true,
          policyId: policyResult.policyId,
          policyName: policyResult.policyName,
          effect: policyResult.effect,
        },
        billing: { creditsCharged: 0, creditsRemaining: remainingBefore },
        inherited: { ...base, identity: true, permissions: true, governance: true },
      }
    }

    // REQUIRE_APPROVAL genuinely halts execution and parks a PendingApproval.
    // PendingApproval.actionId is a required FK, so the row can only be created
    // for actions that exist in the ontology. When it cannot be, the audit row
    // below remains the authoritative record that execution was held.
    if (policyResult.effect === 'REQUIRE_APPROVAL') {
      if (ctx.actionName) {
        const ontologyAction = await prisma.ontologyAction.findFirst({
          where: { name: ctx.actionName },
          select: { id: true },
        })
        if (ontologyAction) {
          await prisma.pendingApproval.create({
            data: {
              actionId: ontologyAction.id,
              actorId: ctx.actorId,
              actorType: 'DEVELOPER_APP',
              params: (ctx.params ?? {}) as any,
              policyId: policyResult.policyId,
              policyName: policyResult.policyName,
              reason: `App "${ctx.appId}" requires approval under policy "${policyResult.policyName}"`,
              status: 'PENDING',
            },
          })
        }
      }

      const auditId = await writeAudit({
        appId: ctx.appId,
        installationId: installation.id,
        tenantId: ctx.tenantId,
        actorId: ctx.actorId,
        eventType: 'APPROVAL_REQUIRED',
        actionName: ctx.actionName,
        outcome: 'PENDING_APPROVAL',
        policyId: policyResult.policyId,
        policyName: policyResult.policyName,
        policyEffect: policyResult.effect,
        durationMs: Date.now() - started,
        params: ctx.params,
      })
      return {
        outcome: 'PENDING_APPROVAL',
        allowed: false,
        reason: `Execution held for human approval under policy "${policyResult.policyName}".`,
        auditId,
        installationId: installation.id,
        policy: {
          checked: true,
          policyId: policyResult.policyId,
          policyName: policyResult.policyName,
          effect: policyResult.effect,
        },
        billing: { creditsCharged: 0, creditsRemaining: remainingBefore },
        inherited: { ...base, identity: true, permissions: true, governance: true },
      }
    }

    // ── 4. BILLING ───────────────────────────────────────────────────────────
    if (remainingBefore < creditCost) {
      const auditId = await writeAudit({
        appId: ctx.appId,
        installationId: installation.id,
        tenantId: ctx.tenantId,
        actorId: ctx.actorId,
        eventType: 'ACTION_EXECUTE',
        actionName: ctx.actionName,
        outcome: 'DENIED',
        policyId: policyResult.policyId,
        policyName: policyResult.policyName,
        policyEffect: policyResult.effect,
        durationMs: Date.now() - started,
        errorMessage: `Credit budget exhausted (${remainingBefore} remaining, ${creditCost} required)`,
      })
      return {
        outcome: 'DENIED',
        allowed: false,
        reason: `Credit budget exhausted: ${remainingBefore} remaining, ${creditCost} required.`,
        auditId,
        installationId: installation.id,
        policy: {
          checked: true,
          policyId: policyResult.policyId,
          policyName: policyResult.policyName,
          effect: policyResult.effect,
        },
        billing: { creditsCharged: 0, creditsRemaining: remainingBefore },
        inherited: { ...base, identity: true, permissions: true, governance: true, billing: true },
      }
    }

    const debited = await prisma.appInstallation.update({
      where: { id: installation.id },
      data: { creditsUsed: { increment: creditCost } },
      select: { budgetCredits: true, creditsUsed: true },
    })

    // ── 5 & 6. AUDIT + OBSERVABILITY ─────────────────────────────────────────
    const auditId = await writeAudit({
      appId: ctx.appId,
      installationId: installation.id,
      tenantId: ctx.tenantId,
      actorId: ctx.actorId,
      eventType: 'ACTION_EXECUTE',
      actionName: ctx.actionName,
      outcome: 'ALLOWED',
      policyId: policyResult.policyId,
      policyName: policyResult.policyName,
      policyEffect: policyResult.effect,
      creditsCharged: creditCost,
      durationMs: Date.now() - started,
      params: ctx.params,
    })

    return {
      outcome: 'ALLOWED',
      allowed: true,
      reason: 'All six inherited layers passed.',
      auditId,
      installationId: installation.id,
      policy: {
        checked: true,
        policyId: policyResult.policyId,
        policyName: policyResult.policyName,
        effect: policyResult.effect,
      },
      billing: {
        creditsCharged: creditCost,
        creditsRemaining: debited.budgetCredits - debited.creditsUsed,
      },
      inherited: {
        identity: true,
        permissions: true,
        governance: true,
        billing: true,
        audit: true,
        observability: true,
      },
    }
  },

  /** Attach the execution result to the audit row opened by `authorize`. */
  async recordResult(auditId: string, result: any, errorMessage?: string): Promise<void> {
    await prisma.appAuditEvent
      .update({
        where: { id: auditId },
        data: {
          result: result ?? undefined,
          errorMessage: errorMessage ?? null,
          outcome: errorMessage ? 'ERROR' : undefined,
        },
      })
      .catch(() => null)
  },

  /** Observability rollup for the AI Operations Console. */
  async getAppTelemetry(appId: string, sinceHours = 24) {
    const since = new Date(Date.now() - sinceHours * 3600_000)
    const events = await prisma.appAuditEvent.findMany({
      where: { appId, createdAt: { gte: since } },
      select: { outcome: true, durationMs: true, creditsCharged: true },
    })

    const durations = events.map(e => e.durationMs ?? 0).filter(d => d > 0).sort((a, b) => a - b)
    const p95 = durations.length ? durations[Math.min(durations.length - 1, Math.floor(durations.length * 0.95))] : 0

    return {
      appId,
      windowHours: sinceHours,
      totalCalls: events.length,
      allowed: events.filter(e => e.outcome === 'ALLOWED').length,
      denied: events.filter(e => e.outcome === 'DENIED').length,
      pendingApproval: events.filter(e => e.outcome === 'PENDING_APPROVAL').length,
      errors: events.filter(e => e.outcome === 'ERROR').length,
      creditsCharged: events.reduce((s, e) => s + (e.creditsCharged ?? 0), 0),
      avgDurationMs: durations.length ? Math.round(durations.reduce((s, d) => s + d, 0) / durations.length) : 0,
      p95DurationMs: p95,
    }
  },
}
