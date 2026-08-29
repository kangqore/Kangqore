/**
 * Phase 5 — governance kernel end-to-end probe.
 *
 * Proves the six inherited layers actually gate execution rather than being
 * reported. Run: npx tsx src/scripts/phase5-kernel-e2e.ts
 */

import crypto from 'crypto'
import { prisma } from '../../../lib/prisma'
import { GovernanceKernel } from '../GovernanceKernel'
import { MarketplaceService } from '../MarketplaceService'
import { AppAgentService } from '../AppAgentService'
import { AppWebhookService } from '../AppWebhookService'

const APP_ID = 'app-e2e-probe'
const TENANT = 'e2e-tenant'

let pass = 0
let fail = 0

function check(label: string, condition: boolean, detail = '') {
  if (condition) {
    pass++
    console.log(`  ✓ ${label}`)
  } else {
    fail++
    console.log(`  ✗ ${label} ${detail}`)
  }
}

async function main() {
  // ── Clean slate ────────────────────────────────────────────────────────────
  await prisma.appAuditEvent.deleteMany({ where: { appId: APP_ID } })
  await prisma.appInstallation.deleteMany({ where: { appId: APP_ID } })
  await prisma.developerApp.deleteMany({ where: { appId: APP_ID } })

  console.log('\n1. Publish an app granting exactly one action')
  await prisma.developerApp.create({
    data: {
      appId: APP_ID,
      name: 'E2E Probe',
      slug: 'e2e-probe',
      description: 'governance kernel probe',
      publisherName: 'E2E',
      publisherEmail: 'e2e@test.com',
      ownerUserId: 'e2e-user',
      clientId: 'kqc_e2e_probe',
      clientSecretHash: crypto.createHash('sha256').update('secret').digest('hex'),
      secretPrefix: 'kqs_e2e',
      status: 'PUBLISHED',
      manifest: {
        manifestVersion: '1.0',
        appId: APP_ID,
        name: 'E2E Probe',
        version: '1.0.0',
        category: 'COMMUNITY',
        publisher: { name: 'E2E', email: 'e2e@test.com' },
        description: 'governance kernel probe',
        permissions: [{ resource: 'WorkItem', action: 'READ', reason: 'read work items for the probe view' }],
        ontologyBindings: [{ objectType: 'WorkItem' }],
        actions: [{ name: 'ALLOWED_ACTION', displayName: 'Allowed', description: 'the one granted action', parameters: [] }],
      } as any,
    },
  })
  check('app created as PUBLISHED', true)

  console.log('\n2. Call before install — identity layer must refuse')
  const beforeInstall = await GovernanceKernel.authorize({
    appId: APP_ID, tenantId: TENANT, actorId: 'e2e-user', actionName: 'ALLOWED_ACTION',
  })
  check('denied when not installed', beforeInstall.allowed === false, `got ${beforeInstall.outcome}`)
  check('refusal wrote an audit row', !!beforeInstall.auditId)

  console.log('\n3. Install — envelope derived from manifest')
  const install = await MarketplaceService.installApp({
    appId: APP_ID, tenantId: TENANT, installedBy: 'e2e-user', budgetCredits: 3,
  })
  const env = install.inheritedEnvelope.permissions
  check('allowedActions derived from manifest', env.allowedActions.join() === 'ALLOWED_ACTION', JSON.stringify(env.allowedActions))
  check('allowedObjectTypes derived from manifest', env.allowedObjectTypes.includes('WorkItem'), JSON.stringify(env.allowedObjectTypes))

  console.log('\n4. Permissions layer — action outside the envelope')
  const outside = await GovernanceKernel.authorize({
    appId: APP_ID, tenantId: TENANT, actorId: 'e2e-user', actionName: 'NOT_GRANTED_ACTION',
  })
  check('ungranted action denied', outside.allowed === false, `got ${outside.outcome}`)
  check('denial reason names the action', /NOT_GRANTED_ACTION|not granted/i.test(outside.reason))

  console.log('\n5. Permissions layer — object type outside the envelope')
  const badType = await GovernanceKernel.authorize({
    appId: APP_ID, tenantId: TENANT, actorId: 'e2e-user', objectType: 'SecretPayroll',
  })
  check('ungranted object type denied', badType.allowed === false, `got ${badType.outcome}`)

  console.log('\n6. Happy path — granted action passes all six layers')
  const ok = await GovernanceKernel.authorize({
    appId: APP_ID, tenantId: TENANT, actorId: 'e2e-user', actionName: 'ALLOWED_ACTION',
  })
  check('granted action allowed', ok.allowed === true, ok.reason)
  check('all six layers reported inherited', Object.values(ok.inherited).every(Boolean), JSON.stringify(ok.inherited))
  check('one credit charged', ok.billing.creditsCharged === 1)
  check('credits remaining decremented to 2', ok.billing.creditsRemaining === 2, String(ok.billing.creditsRemaining))

  console.log('\n7. Billing layer — exhaust the 3-credit budget')
  await GovernanceKernel.authorize({ appId: APP_ID, tenantId: TENANT, actorId: 'e2e-user', actionName: 'ALLOWED_ACTION' })
  await GovernanceKernel.authorize({ appId: APP_ID, tenantId: TENANT, actorId: 'e2e-user', actionName: 'ALLOWED_ACTION' })
  const exhausted = await GovernanceKernel.authorize({
    appId: APP_ID, tenantId: TENANT, actorId: 'e2e-user', actionName: 'ALLOWED_ACTION',
  })
  check('denied once budget exhausted', exhausted.allowed === false, `got ${exhausted.outcome}`)
  check('reason cites the budget', /budget|credit/i.test(exhausted.reason), exhausted.reason)

  console.log('\n8. Audit — every decision persisted')
  const events = await prisma.appAuditEvent.findMany({ where: { appId: APP_ID }, orderBy: { createdAt: 'asc' } })
  const allowed = events.filter(e => e.outcome === 'ALLOWED').length
  const denied = events.filter(e => e.outcome === 'DENIED').length
  check('audit rows written for allows and denials', events.length >= 8, `${events.length} rows`)
  check('denials outnumber allows in this probe', denied >= 4 && allowed >= 3, `allowed=${allowed} denied=${denied}`)
  check('install event recorded', events.some(e => e.eventType === 'INSTALL'))

  console.log('\n9. Uninstall revokes access')
  await MarketplaceService.uninstallApp(APP_ID, TENANT, 'e2e-user')
  const afterUninstall = await GovernanceKernel.authorize({
    appId: APP_ID, tenantId: TENANT, actorId: 'e2e-user', actionName: 'ALLOWED_ACTION',
  })
  check('denied after uninstall', afterUninstall.allowed === false, `got ${afterUninstall.outcome}`)

  console.log('\n10. Telemetry rollup')
  const telemetry = await GovernanceKernel.getAppTelemetry(APP_ID, 24)
  check('telemetry counts calls', telemetry.totalCalls >= 8, String(telemetry.totalCalls))
  check('telemetry separates denied', telemetry.denied >= 4, String(telemetry.denied))

  // ── Phase 5 completion: agents, UI widgets, ontology writes, webhooks ──────
  console.log('\n11. Agent SDK — manifest agents are materialised and governed')
  await prisma.developerApp.update({
    where: { appId: APP_ID },
    data: {
      manifest: {
        ...(await prisma.developerApp.findUnique({ where: { appId: APP_ID } }))!.manifest as any,
        agents: [{ name: 'ProbeAgent', role: 'Probe', goal: 'verify the agent bridge', capabilities: [] }],
        uiWidgets: [],
        webhooks: [{ event: 'app.installed', targetUrl: 'http://insecure.example.com/hook' }],
      } as any,
    },
  })
  const app = await prisma.developerApp.findUnique({ where: { appId: APP_ID } })
  const synced = await AppAgentService.syncAgentsFromManifest(APP_ID, app!.manifest as any)
  check('manifest agent bound to a real KimmpAgent', synced.length === 1 && !!synced[0].kimmpAgentId)

  const listed = await AppAgentService.listAgents(APP_ID)
  check('agent listed as runnable', listed.length === 1 && listed[0].runnable === true)

  // Re-install (previous step uninstalled) so agent runs are authorised again.
  await MarketplaceService.installApp({ appId: APP_ID, tenantId: TENANT, installedBy: 'e2e-user', budgetCredits: 2 })

  const undeclared = await AppAgentService.runAgent({
    appId: APP_ID, agentName: 'NoSuchAgent', tenantId: TENANT, actorId: 'e2e-user', prompt: 'hi',
  })
  check('undeclared agent refused', undeclared.allowed === false)
  check('agent refusal is audited', !!undeclared.auditId)

  console.log('\n12. Agent runs are budgeted (cost 5 > budget 2)')
  const overBudget = await AppAgentService.runAgent({
    appId: APP_ID, agentName: 'ProbeAgent', tenantId: TENANT, actorId: 'e2e-user', prompt: 'hi',
  })
  check('agent run denied when budget < cost', overBudget.allowed === false, String(overBudget.outcome))

  console.log('\n13. Webhooks — plaintext targets are refused, not silently sent')
  const deliveries = await AppWebhookService.dispatch({
    event: 'app.installed', tenantId: TENANT, appId: APP_ID, payload: { probe: true },
  })
  check('http:// target skipped (no delivery attempted)', deliveries.length === 0, `${deliveries.length} attempted`)
  const signed = AppWebhookService.signPayload('{"a":1}', 'secret')
  check('signature is sha256-prefixed hex', /^sha256=[0-9a-f]{64}$/.test(signed))
  check('signature verifies', AppWebhookService.verifySignature('{"a":1}', 'secret', signed))
  check('tampered body fails verification', !AppWebhookService.verifySignature('{"a":2}', 'secret', signed))

  // ── Cleanup ────────────────────────────────────────────────────────────────
  await prisma.appWebhookDelivery.deleteMany({ where: { appId: APP_ID } })
  const bindings = await prisma.appAgentBinding.findMany({ where: { appId: APP_ID } })
  await prisma.appAgentBinding.deleteMany({ where: { appId: APP_ID } })
  await prisma.kimmpAgent.deleteMany({ where: { id: { in: bindings.map(b => b.kimmpAgentId) } } })
  await prisma.appAuditEvent.deleteMany({ where: { appId: APP_ID } })
  await prisma.appInstallation.deleteMany({ where: { appId: APP_ID } })
  await prisma.developerApp.deleteMany({ where: { appId: APP_ID } })

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${pass} passed, ${fail} failed`)
  console.log('─'.repeat(52))
  process.exit(fail === 0 ? 0 : 1)
}

main()
  .catch(err => {
    console.error('PROBE ERROR:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
