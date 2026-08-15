// ---------------------------------------------------------------------------
// AEGIS Notifier — pushes CRITICAL/WARN agent verdicts into the OS notification
// system so the ADMIN sees them in the Topbar bell without polling AEGIS directly.
// ---------------------------------------------------------------------------

import { prisma }              from '../../../lib/prisma'
import { createNotification }  from '../../awareness/notifications/NotificationService'
import { emitToAdmins }        from '../../../socket'
import type { AegisAgentResult } from './agents/types'

let cachedAdminId: string | null = null

async function getAdminUserId(): Promise<string | null> {
  if (cachedAdminId) return cachedAdminId
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { id: true } }).catch(() => null)
  if (admin) cachedAdminId = admin.id
  return admin?.id ?? null
}

const VERDICT_TYPE = {
  CRITICAL: 'ERROR',
  WARN:     'WARNING',
} as const

const ENGINE_LABEL: Record<string, string> = {
  GOVERNANCE_OPS:        'GovernanceOps',
  SOVEREIGNTY:           'Sovereignty',
  AUDIT_LEDGER:          'Audit Ledger',
  AUTONOMY_BOUNDARY:     'Autonomy Boundary',
  ACCESS_SENTINEL:       'Access Sentinel',
  INTELLIGENCE_REGISTRY: 'Intelligence Registry',
  EGRESS_CONTROL:        'Egress Control',
  POLICY:                'Policy',
  TRUST_COMPLIANCE:      'Trust & Compliance',
  RISK_INTELLIGENCE:     'Risk Intelligence',
}

export async function notifyAegisVerdict(result: AegisAgentResult): Promise<void> {
  if (result.verdict !== 'CRITICAL' && result.verdict !== 'WARN') return

  const adminId = await getAdminUserId()
  if (!adminId) return

  const engineLabel = ENGINE_LABEL[result.engine] ?? result.engine
  const title       = `AEGIS ${result.verdict} — ${engineLabel}`
  const message     = result.summary.slice(0, 160)
  const type        = VERDICT_TYPE[result.verdict]
  const link        = '/kangqore-view/admin/aegis/agents'

  await createNotification({ userId: adminId, title, message, type, link }).catch(() => {})

  // Real-time push to admin dashboard (Phase 2)
  emitToAdmins('aegis:verdict', {
    agentId:  result.agentId,
    engine:   result.engine,
    verdict:  result.verdict,
    summary:  result.summary,
    findings: result.findings,
    actions:  result.actions,
    raisedAt: result.raisedAt,
  })
}
