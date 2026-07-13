// ---------------------------------------------------------------------------
// AEGIS Action Executor — governance-gated execution of proposed actions.
//
// L0: auto-execute, silent (log only)
// L1: auto-execute + in-app notification
// L2: auto-execute + notification + email
// L3: queue to aegis_pending_actions, emit socket event, await ADMIN approval
//
// All L0-L2 executions are recorded in aegis_action_logs.
// ---------------------------------------------------------------------------

import { prisma }              from '../lib/prisma'
import { emitToAdmins }        from '../socket'
import { createNotification }  from '../services/notificationService'
import { emailService }        from '../services/email.service'
import { AegisLedger }         from './aegisLedger.service'
import { redisConnection }     from '../lib/redis'
import type { AegisAction }    from './aegisActionProposer'
import type { AegisAgentResult } from './agents/types'

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
  action:  AegisAction,
  result:  AegisAgentResult,
  status:  'SUCCESS' | 'FAILED',
  outcome: unknown = null,
): Promise<void> {
  await (prisma as any).aegisActionLog.create({
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
}

// ---------------------------------------------------------------------------
// Individual action handlers
// ---------------------------------------------------------------------------

async function execEmitSocket(action: AegisAction, result: AegisAgentResult): Promise<void> {
  const event = (action.params.event as string) ?? 'aegis:verdict'
  emitToAdmins(event, {
    agentId: result.agentId,
    engine:  result.engine,
    verdict: result.verdict,
    summary: result.summary,
    raisedAt: result.raisedAt,
    ...action.params,
  })
}

async function execEmitSignal(action: AegisAction, result: AegisAgentResult): Promise<void> {
  // Fire-and-forget import to avoid circular dep at module load time
  const { SignalLedger } = await import('../kangqore-immp/signals/signalLedger.service')
  await SignalLedger.record({
    sourceModule:    'kimmp.sentinel',
    signalType:      `AEGIS_${result.verdict}`,
    signalCategory:  (action.params.category as any) ?? 'RISK',
    signalValue:     result.summary.slice(0, 160),
    severity:        (action.params.severity as any) ?? result.verdict,
    confidence:      0.9,
    metadata:        { agentId: result.agentId, engine: result.engine, ...action.params },
  }).catch(() => {})
}

async function execCreateNotification(action: AegisAction, result: AegisAgentResult): Promise<void> {
  const admin = await getAdmin()
  if (!admin) return
  const priority = (action.params.priority as string) ?? 'NORMAL'
  await createNotification({
    userId:  admin.id,
    title:   `AEGIS ${result.verdict} — ${result.agentId}`,
    message: result.summary.slice(0, 160),
    type:    result.verdict === 'CRITICAL' ? 'ERROR' : 'WARNING',
    link:    '/kangqore-view/admin/aegis/agents',
  }).catch(() => {})

  // Also push real-time socket event
  emitToAdmins('aegis:verdict', {
    agentId:  result.agentId,
    engine:   result.engine,
    verdict:  result.verdict,
    summary:  result.summary,
    priority,
    raisedAt: result.raisedAt,
  })
}

async function execRunInvestigation(_action: AegisAction, result: AegisAgentResult): Promise<void> {
  // Lazy import to avoid circular at load time
  const { AegisEngineDispatcher } = await import('./aegisEngineDispatcher')
  await AegisEngineDispatcher.runAgent('govops.investigation', {
    trigger:   'event.CRITICAL_ACTIVATION',
    fromEvent: true,
    metadata:  { triggeredBy: result.agentId, verdict: result.verdict, summary: result.summary },
  }).catch(() => {})
}

async function execSendAlertEmail(action: AegisAction, result: AegisAgentResult): Promise<void> {
  const admin = await getAdmin()
  if (!admin) return
  const subject = (action.params.subject as string) ?? `AEGIS Alert: ${result.verdict} — ${result.agentId}`
  const body = [
    `<h2>${subject}</h2>`,
    `<p><strong>Agent:</strong> ${result.agentId} (${result.engine})</p>`,
    `<p><strong>Verdict:</strong> ${result.verdict}</p>`,
    `<p><strong>Summary:</strong> ${result.summary}</p>`,
    `<h3>Findings</h3><ul>${result.findings.map(f => `<li>${f}</li>`).join('')}</ul>`,
    result.actions.length ? `<h3>Recommended Actions</h3><ul>${result.actions.map(a => `<li>${a}</li>`).join('')}</ul>` : '',
    `<p><em>Raised at: ${result.raisedAt}</em></p>`,
    `<p><a href="https://kangqore.com/kangqore-view/admin/aegis/agents">View in AEGIS Dashboard →</a></p>`,
  ].join('\n')
  await emailService.sendEmail({ to: admin.email, subject, html: body }).catch(() => {})
}

async function execFlagActor(action: AegisAction, result: AegisAgentResult): Promise<void> {
  // Extract actor from the result metadata if available
  const actor = (result.metadata?.actor as string) ?? (action.params.source as string) ?? 'unknown'
  // Set in Redis with 24h TTL — sentinel middleware can check this set
  await (redisConnection as any).sadd('aegis:flagged-actors', actor)
  await (redisConnection as any).expire('aegis:flagged-actors', 86400)
  // Log to ledger
  await AegisLedger.logPolicyViolation({
    policy:   'AEGIS_FLAG_ACTOR',
    system:   result.engine,
    actor,
    detail:   `Flagged by ${result.agentId} (${result.verdict})`,
    severity: 'HIGH',
    metadata: { agentId: result.agentId, source: action.params.source },
  }).catch(() => {})
}

async function execEmitToWaanda(action: AegisAction, result: AegisAgentResult): Promise<void> {
  const { KeosEventBus } = await import('../os/kernel/KeosEventBus')
  KeosEventBus.publish('aegis.governance', {
    agentId:  result.agentId,
    engine:   result.engine,
    verdict:  result.verdict,
    summary:  result.summary,
    findings: result.findings,
    raisedAt: result.raisedAt,
    ...action.params,
  })
}

async function execTriggerKimmpSystem(action: AegisAction, result: AegisAgentResult): Promise<void> {
  const system = (action.params.system as string) ?? 'SENTINEL'
  const { KimmpSystemDispatcher } = await import('../kangqore-immp/agents/systemDispatcher')
  await KimmpSystemDispatcher.run(system as any, {
    trigger: 'aegis.summons',
    userId:  'AEGIS',
    params:  { agentId: result.agentId, verdict: result.verdict, summary: result.summary },
  }).catch(() => {})
}

async function execPatchLeadRiskScore(action: AegisAction, _result: AegisAgentResult): Promise<void> {
  const leadId = action.params.leadId as string
  const delta  = (action.params.delta as number) ?? 0
  if (!leadId) return
  await prisma.eqoreLead.update({
    where: { id: leadId },
    data:  { leadScore: { increment: Math.max(-100, Math.min(100, delta)) } },
  }).catch(() => {})
}

async function execRevokeSession(action: AegisAction, result: AegisAgentResult): Promise<void> {
  const userId = (action.params.userId as string) ?? (result.metadata?.userId as string)
  if (!userId) return
  const { deleteAllUserSessions } = await import('../services/session.service')
  await deleteAllUserSessions(userId).catch(() => {})
  await AegisLedger.logPolicyViolation({
    policy:   'AEGIS_SESSION_REVOKE',
    system:   result.engine,
    actor:    userId,
    detail:   `Sessions revoked by ${result.agentId} (${result.verdict})`,
    severity: 'HIGH',
    metadata: { agentId: result.agentId },
  }).catch(() => {})
}

// L3: write to pending table, notify admin via socket — await human approval
async function execQueueL3(action: AegisAction, result: AegisAgentResult): Promise<void> {
  const pending = await (prisma as any).aegisPendingAction.create({
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
    emitToAdmins('aegis:action:pending', {
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
        title:   `AEGIS: Action Requires Approval`,
        message: `${action.description} — from ${result.agentId} (${result.verdict})`,
        type:    'WARNING',
        link:    '/kangqore-view/admin/aegis/actions',
      }).catch(() => {})
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const AegisActionExecutor = {
  async execute(actions: AegisAction[], result: AegisAgentResult): Promise<void> {
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
    const pending = await (prisma as any).aegisPendingAction.findUnique({ where: { id: pendingId } }).catch(() => null)
    if (!pending) return { success: false, message: 'Pending action not found' }
    if (pending.status !== 'PENDING') return { success: false, message: `Already ${pending.status}` }

    let outcome: unknown = null
    try {
      switch (pending.actionType) {
        case 'PAUSE_KIMMP_LOOP': {
          // WAANDA is the supreme authority — AEGIS escalates, WAANDA decides and issues the directive
          const { WaandaAuthority } = await import('../waanda/WaandaAuthority')
          await WaandaAuthority.receiveEscalation({
            from:    'AEGIS',
            threat:  (pending.params as any).reason ?? 'AEGIS L3 governance action triggered',
            tier:    'CRITICAL',
            source:  (pending.params as any).source ?? pending.agentId ?? 'AEGIS',
            action:  'PAUSE_KIMMP_LOOP',
            context: { pendingId, agentId: pending.agentId, engine: pending.engine, params: pending.params },
          })
          outcome = { escalatedToWaanda: true }
          break
        }
        case 'BLOCK_ACTOR': {
          const actor = (pending.params as any).actor ?? 'unknown'
          await (redisConnection as any).sadd('aegis:blocked-actors', actor)
          outcome = { blocked: actor }
          break
        }
        case 'QUARANTINE_ASSET': {
          await (redisConnection as any).set('aegis:egress-quarantine', '1', 'EX', 3600)
          emitToAdmins('aegis:egress-quarantined', { source: (pending.params as any).source, by: adminUserId })
          outcome = { quarantined: true, expiresInSeconds: 3600 }
          break
        }
      }

      await (prisma as any).aegisPendingAction.update({
        where: { id: pendingId },
        data:  { status: 'EXECUTED', resolvedAt: new Date(), resolvedBy: adminUserId },
      }).catch(() => {})

      await (prisma as any).aegisActionLog.create({
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

      emitToAdmins('aegis:action:executed', { id: pendingId, actionType: pending.actionType, outcome })
      return { success: true, message: `${pending.actionType} executed successfully` }

    } catch (err: any) {
      await (prisma as any).aegisPendingAction.update({
        where: { id: pendingId },
        data:  { status: 'REJECTED', resolvedAt: new Date(), resolvedBy: adminUserId },
      }).catch(() => {})
      return { success: false, message: err?.message ?? 'Execution failed' }
    }
  },

  async rejectPending(pendingId: string, adminUserId: string): Promise<void> {
    await (prisma as any).aegisPendingAction.update({
      where: { id: pendingId },
      data:  { status: 'REJECTED', resolvedAt: new Date(), resolvedBy: adminUserId },
    }).catch(() => {})
    emitToAdmins('aegis:action:rejected', { id: pendingId })
  },
}
