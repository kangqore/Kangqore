import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

export async function runApprovalAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start = Date.now()

  // Approval = every KNOWLEDGE_ASSET ingest was triggered through an ADMIN-approved ACTIVATION
  // Proxy: assets where dispatchId is set (came through a proper KIMMP dispatch)
  const [total, withDispatch, withoutDispatch] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET' } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', NOT: { dispatchId: null } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', dispatchId: null } }).catch(() => 0),
  ])

  const approvalRate = total > 0 ? Math.round((withDispatch / total) * 100) : 100
  const verdict      = withoutDispatch > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:   'sovereignty.approval',
    engine:    'SOVEREIGNTY',
    verdict,
    summary:   `Approval rate: ${approvalRate}%. ${withDispatch}/${total} assets registered via approved KIMMP dispatches.`,
    findings: [
      `Total assets: ${total}`,
      `With dispatch approval: ${withDispatch} (${approvalRate}%)`,
      `Without dispatch link: ${withoutDispatch}`,
    ],
    actions:   withoutDispatch > 0
      ? ['Investigate assets without dispatchId — may be manually injected outside KIMMP pipeline']
      : [],
    metadata:  { total, withDispatch, withoutDispatch, approvalRate },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
