// ---------------------------------------------------------------------------
// HANUMANAS Action Executor — governance-gated execution of proposed actions.
//
// L0: auto-execute, silent (log only)
// L1: auto-execute + in-app notification
// L2: auto-execute + notification + email
// L3: queue to hanumanas_pending_actions, emit socket event, await ADMIN approval
//
// All L0-L2 executions are recorded in hanumanas_action_logs.
// ---------------------------------------------------------------------------

import { prisma }              from '../../../lib/prisma'
import { emitToAdmins }        from '../../../socket'
import { createNotification }  from '../../awareness/notifications/NotificationService'
import { emailService }        from '../../eaf/channels/EmailService'
import { HanumanasLedger }         from './hanumanasLedger.service'
import { redisConnection }     from '../../../lib/redis'
import { ActionEngine }        from '../../automation/ActionEngine'
import type { HanumanasAction }    from './hanumanasActionProposer'
import type { HanumanasAgentResult } from './agents/types'
import { HANUMANAS } from './identity'

// S298 — governance actions (not routine telemetry like EMIT_SOCKET/CREATE_NOTIFICATION)
// also write a parallel ActionExecution row so the unified Action log genuinely
// shows "PAUSE, BLOCK, QUARANTINE, BUDGET_DENY" — everything an admin would
// actually search the audit trail for.
const GOVERNANCE_ACTION_TYPES = new Set(['PAUSE_KIMMP_LOOP', 'BLOCK_ACTOR', 'QUARANTINE_ASSET', 'FLAG_ACTOR', 'REVOKE_SESSION'])

async function recordGovernanceAction(actionType: string, level: number, params: Record<string, unknown>, result: { agentId: string; engine: string; summary: string }, outcome: unknown): Promise<void> {
  if (!GOVERNANCE_ACTION_TYPES.has(actionType)) return
  const actionId = await ActionEngine.getSystemActionId('GOVERNANCE_BLOCK')
  if (!actionId) return
  await ActionEngine.execute({
    actionId,
    params: { ...params, hanumanasActionType: actionType, level, outcome },
    actorId: result.agentId,
    actorType: HANUMANAS.name,
    agentsMixed: [result.agentId],
    sourceModule: result.engine,
    reasoning: result.summary,
  })
}

let cachedAdminId:    string | null = null
let cachedAdminEmail: string | null = null

async function getAdmin(): Promise<{ id: string; email: string } | null> {
  if (cachedAdminId && cachedAdminEmail) return { id: cachedAdminId, email: cachedAdminEmail }
  const admin = await prisma.user.findFirst({
    where:  { role: 'ADMIN' },
    select: { id: true, email: true },
  }).catch(() => null)
  if (admin) { cachedAdminId = admin.id; cachedAdminEmail = admin.email }
  return admin ?? null
}

async function logAction(
  action:  HanumanasAction,
  result:  HanumanasAgentResult,
  status:  'SUCCESS' | 'FAILED',
  outcome: unknown = null,
): Promise<void> {
  await (prisma as any).hanumanasActionLog.create({
    data: {
      actionType: action.type,
      level:      action.level,
      agentId:    result.agentId,
      engine:     result.engine,
      params:     action.params as any,
      result:     outcome as any,
      status,
    },
  }).catch(() => {})

  // S298 — fire-and-forget; a failure here must never affect HANUMANAS's own logging
  recordGovernanceAction(action.type, action.level, action.params, result, outcome).catch(() => {})
}

// ---------------------------------------------------------------------------
// Individual action handlers
// ---------------------------------------------------------------------------

async function execEmitSocket(action: HanumanasAction, result: HanumanasAgentResult): Promise<void> {
  const event = (action.params.event as string) ?? 'hanumanas:verdict'
  emitToAdmins(event, {
    agentId: result.agentId,
    engine:  result.engine,
    verdict: result.verdict,
    summary: result.summary,
    raisedAt: result.raisedAt,
    ...action.params,
  })
}

async function execEmitSignal(action: HanumanasAction, result: HanumanasAgentResult): Promise<void> {
  // Fire-and-forget import to avoid circular dep at module load time
  const { SignalLedger } = await import('../../../kangqore-immp/signals/signalLedger.service')
  await SignalLedger.record({
    sourceModule:    'kimmp.sentinel',
    signalType:      `HANUMANAS_${result.verdict}`,
    signalCategory:  (action.params.category as any) ?? 'RISK',
    signalValue:     result.summary.slice(0, 160),
    severity:        (action.params.severity as any) ?? result.verdict,
    confidence:      0.9,
    metadata:        { agentId: result.agentId, engine: result.engine, ...action.params },
  }).catch(() => {})
}

async function execCreateNotification(action: HanumanasAction, result: HanumanasAgentResult): Promise<void> {
  const admin = await getAdmin()
  if (!admin) return
  const priority = (action.params.priority as string) ?? 'NORMAL'
  await createNotification({
    userId:  admin.id,
    title:   `HANUMANAS ${result.verdict} — ${result.agentId}`,
    message: result.summary.slice(0, 160),
    type:    result.verdict === 'CRITICAL' ? 'ERROR' : 'WARNING',
    link:    '/kangqore-view/admin/hanumanas/agents',
  }).catch(() => {})

  // Also push real-time socket event
  emitToAdmins('hanumanas:verdict', {
    agentId:  result.agentId,
    engine:   result.engine,
    verdict:  result.verdict,
    summary:  result.summary,
    priority,
    raisedAt: result.raisedAt,
  })
}

async function execRunInvestigation(_action: HanumanasAction, result: HanumanasAgentResult): Promise<void> {
  // Lazy import to avoid circular at load time
  const { HanumanasEngineDispatcher } = await import('./hanumanasEngineDispatcher')
  await HanumanasEngineDispatcher.runAgent('govops.investigation', {
    trigger:   'event.CRITICAL_ACTIVATION',
    fromEvent: true,
    metadata:  { triggeredBy: result.agentId, verdict: result.verdict, summary: result.summary },
  }).catch(() => {})
}

async function execSendAlertEmail(action: HanumanasAction, result: HanumanasAgentResult): Promise<void> {
  const admin = await getAdmin()
  if (!admin) return
  const subject = (action.params.subject as string) ?? `HANUMANAS Alert: ${result.verdict} — ${result.agentId}`
  const body = [
    `<h2>${subject}</h2>`,
    `<p><strong>Agent:</strong> ${result.agentId} (${result.engine})</p>`,
    `<p><strong>Verdict:</strong> ${result.verdict}</p>`,
    `<p><strong>Summary:</strong> ${result.summary}</p>`,
    `<h3>Findings</h3><ul>${result.findings.map(f => `<li>${f}</li>`).join('')}</ul>`,
    result.actions.length ? `<h3>Recommended Actions</h3><ul>${result.actions.map(a => `<li>${a}</li>`).join('')}</ul>` : '',
    `<p><em>Raised at: ${result.raisedAt}</em></p>`,
    `<p><a href="https://kangqore.com/kangqore-view/admin/hanumanas/agents">View in HANUMANAS Dashboard →</a></p>`,
  ].join('\n')
  await emailService.sendEmail({ to: admin.email, subject, html: body }).catch(() => {})
}

async function execFlagActor(action: HanumanasAction, result: HanumanasAgentResult): Promise<void> {
  // Extract actor from the result metadata if available
  const actor = (result.metadata?.actor as string) ?? (action.params.source as string) ?? 'unknown'
  // Set in Redis with 24h TTL — sentinel middleware can check this set
  await (redisConnection as any).sadd('hanumanas:flagged-actors', actor)
  await (redisConnection as any).expire('hanumanas:flagged-actors', 86400)
  // Log to ledger
  await HanumanasLedger.logPolicyViolation({
    policy:   'HANUMANAS_FLAG_ACTOR',
    system:   result.engine,
    actor,
    detail:   `Flagged by ${result.agentId} (${result.verdict})`,
    severity: 'HIGH',
    metadata: { agentId: result.agentId, source: action.params.source },
  }).catch(() => {})
}

async function execEmitToWaanda(action: HanumanasAction, result: HanumanasAgentResult): Promise<void> {
  const { KeosEventBus } = await import('../../kernel/KeosEventBus')
  KeosEventBus.publish('hanumanas.governance', {
    agentId:  result.agentId,
    engine:   result.engine,
    verdict:  result.verdict,
    summary:  result.summary,
    findings: result.findings,
    raisedAt: result.raisedAt,
    ...action.params,
  })
}

async function execTriggerKimmpSystem(action: HanumanasAction, result: HanumanasAgentResult): Promise<void> {
  const system = (action.params.system as string) ?? 'SENTINEL'
  const { KimmpSystemDispatcher } = await import('../../../kangqore-immp/agents/systemDispatcher')
  await KimmpSystemDispatcher.run(system as any, {
    trigger: 'hanumanas.summons',
    userId:  HANUMANAS.name,
    params:  { agentId: result.agentId, verdict: result.verdict, summary: result.summary },
  }).catch(() => {})
}

async function execPatchLeadRiskScore(action: HanumanasAction, _result: HanumanasAgentResult): Promise<void> {
  const leadId = action.params.leadId as string
  const delta  = (action.params.delta as number) ?? 0
  if (!leadId) return
  await prisma.eqoreLead.update({
    where: { id: leadId },
    data:  { leadScore: { increment: Math.max(-100, Math.min(100, delta)) } },
  }).catch(() => {})
}

async function execRevokeSession(action: HanumanasAction, result: HanumanasAgentResult): Promise<void> {
  const userId = (action.params.userId as string) ?? (result.metadata?.userId as string)
  if (!userId) return
  const { deleteAllUserSessions } = await import('../../kernel/auth/SessionService')
  await deleteAllUserSessions(userId).catch(() => {})
  await HanumanasLedger.logPolicyViolation({
    policy:   'HANUMANAS_SESSION_REVOKE',
    system:   result.engine,
    actor:    userId,
    detail:   `Sessions revoked by ${result.agentId} (${result.verdict})`,
    severity: 'HIGH',
    metadata: { agentId: result.agentId },
  }).catch(() => {})
}

// S112: Rollback checkpoint — snapshot agent state before any L3 action
async function createRollbackCheckpoint(action: HanumanasAction, result: HanumanasAgentResult): Promise<void> {
  await (prisma as any).kimmpSignal.create({
    data: {
      type:     'HANUMANAS_ROLLBACK_CHECKPOINT',
      priority: 'critical',
      title:    `HANUMANAS Rollback Checkpoint — ${action.type}`,
      summary:  `Pre-L3 snapshot before ${action.type} on ${result.agentId} (${result.verdict}). Checkpoint captures agent state for recovery if action is rejected.`,
      module:   HANUMANAS.name,
      confidence: 100,
      metadata: {
        actionType:  action.type,
        agentId:     result.agentId,
        engine:      result.engine,
        verdict:     result.verdict,
        summary:     result.summary,
        params:      action.params,
        checkpointAt: new Date().toISOString(),
      } as any,
    },
  }).catch(() => {})
}

// L3: write to pending table, notify admin via socket — await human approval
async function execQueueL3(action: HanumanasAction, result: HanumanasAgentResult): Promise<void> {
  // Phase 3: create rollback checkpoint before queuing the L3 action
  await createRollbackCheckpoint(action, result)

  const pending = await (prisma as any).hanumanasPendingAction.create({
    data: {
      actionType:  action.type,
      level:       3,
      agentId:     result.agentId,
      engine:      result.engine,
      verdict:     result.verdict,
      params:      action.params as any,
      description: action.description,
      status:      'PENDING',
    },
  }).catch(() => null)

  if (pending) {
    emitToAdmins('hanumanas:action:pending', {
      id:          pending.id,
      actionType:  action.type,
      agentId:     result.agentId,
      engine:      result.engine,
      verdict:     result.verdict,
      description: action.description,
      requestedAt: pending.requestedAt,
    })

    const admin = await getAdmin()
    if (admin) {
      await createNotification({
        userId:  admin.id,
        title:   `HANUMANAS: Action Requires Approval`,
        message: `${action.description} — from ${result.agentId} (${result.verdict})`,
        type:    'WARNING',
        link:    '/kangqore-view/admin/hanumanas/actions',
      }).catch(() => {})
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const HanumanasActionExecutor = {
  async execute(actions: HanumanasAction[], result: HanumanasAgentResult): Promise<void> {
    for (const action of actions) {
      try {
        if (action.level === 3) {
          await execQueueL3(action, result)
          await logAction(action, result, 'SUCCESS', { queued: true, status: 'PENDING' })
          continue
        }

        switch (action.type) {
          case 'EMIT_SOCKET':           await execEmitSocket(action, result);           break
          case 'EMIT_SIGNAL':           await execEmitSignal(action, result);           break
          case 'LOG_AUDIT_ENTRY':       /* ledger writes happen elsewhere */            break
          case 'EMIT_TO_WAANDA':        await execEmitToWaanda(action, result);         break
          case 'CREATE_NOTIFICATION':   await execCreateNotification(action, result);   break
          case 'RUN_INVESTIGATION':     await execRunInvestigation(action, result);     break
          case 'TRIGGER_CASCADE':       /* handled by eventEmitter after runOne */      break
          case 'TRIGGER_KIMMP_SYSTEM':  await execTriggerKimmpSystem(action, result);  break
          case 'PATCH_LEAD_RISK_SCORE': await execPatchLeadRiskScore(action, result);  break
          case 'SEND_ALERT_EMAIL':      await execSendAlertEmail(action, result);       break
          case 'FLAG_ACTOR':            await execFlagActor(action, result);            break
          case 'REVOKE_SESSION':        await execRevokeSession(action, result);        break
        }

        await logAction(action, result, 'SUCCESS')
      } catch (err: any) {
        await logAction(action, result, 'FAILED', { error: err?.message })
      }
    }
  },

  // Approve a pending L3 action and execute it
  async approveAndExecute(pendingId: string, adminUserId: string): Promise<{ success: boolean; message: string }> {
    const pending = await (prisma as any).hanumanasPendingAction.findUnique({ where: { id: pendingId } }).catch(() => null)
    if (!pending) return { success: false, message: 'Pending action not found' }
    if (pending.status !== 'PENDING') return { success: false, message: `Already ${pending.status}` }

    let outcome: unknown = null
    try {
      switch (pending.actionType) {
        case 'PAUSE_KIMMP_LOOP': {
          // WAANDA is the supreme authority — HANUMANAS escalates, WAANDA decides and issues the directive
          const { WaandaAuthority } = await import('../../waanda/WaandaAuthority')
          await WaandaAuthority.receiveEscalation({
            from:    HANUMANAS.name,
            threat:  (pending.params as any).reason ?? 'HANUMANAS L3 governance action triggered',
            tier:    'CRITICAL',
            source:  (pending.params as any).source ?? pending.agentId ?? HANUMANAS.name,
            action:  'PAUSE_KIMMP_LOOP',
            context: { pendingId, agentId: pending.agentId, engine: pending.engine, params: pending.params },
          })
          outcome = { escalatedToWaanda: true }
          break
        }
        case 'BLOCK_ACTOR': {
          const actor = (pending.params as any).actor ?? 'unknown'
          await (redisConnection as any).sadd('hanumanas:blocked-actors', actor)
          outcome = { blocked: actor }
          break
        }
        case 'QUARANTINE_ASSET': {
          await (redisConnection as any).set('hanumanas:egress-quarantine', '1', 'EX', 3600)
          emitToAdmins('hanumanas:egress-quarantined', { source: (pending.params as any).source, by: adminUserId })
          outcome = { quarantined: true, expiresInSeconds: 3600 }
          break
        }
      }

      await (prisma as any).hanumanasPendingAction.update({
        where: { id: pendingId },
        data:  { status: 'EXECUTED', resolvedAt: new Date(), resolvedBy: adminUserId },
      }).catch(() => {})

      await (prisma as any).hanumanasActionLog.create({
        data: {
          actionType: pending.actionType,
          level:      3,
          agentId:    pending.agentId,
          engine:     pending.engine,
          params:     pending.params,
          result:     outcome as any,
          status:     'SUCCESS',
        },
      }).catch(() => {})

      // S298 — L3 approved actions are the most severe governance events; always mirror them
      recordGovernanceAction(pending.actionType, 3, pending.params as Record<string, unknown>, {
        agentId: pending.agentId ?? HANUMANAS.channel, engine: pending.engine ?? HANUMANAS.name, summary: `L3 action approved by ADMIN ${adminUserId}`,
      }, outcome).catch(() => {})

      emitToAdmins('hanumanas:action:executed', { id: pendingId, actionType: pending.actionType, outcome })
      return { success: true, message: `${pending.actionType} executed successfully` }

    } catch (err: any) {
      await (prisma as any).hanumanasPendingAction.update({
        where: { id: pendingId },
        data:  { status: 'REJECTED', resolvedAt: new Date(), resolvedBy: adminUserId },
      }).catch(() => {})
      return { success: false, message: err?.message ?? 'Execution failed' }
    }
  },

  async rejectPending(pendingId: string, adminUserId: string): Promise<void> {
    await (prisma as any).hanumanasPendingAction.update({
      where: { id: pendingId },
      data:  { status: 'REJECTED', resolvedAt: new Date(), resolvedBy: adminUserId },
    }).catch(() => {})
    emitToAdmins('hanumanas:action:rejected', { id: pendingId })
  },
}
