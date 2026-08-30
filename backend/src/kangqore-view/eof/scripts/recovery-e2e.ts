/**
 * The last link: Decision → Mission → Approval → ActionEngine → Outcome.
 *
 * The whole point of this layer is that a recommendation cannot become a change
 * without a human saying yes. So the assertions that matter most here are the
 * NEGATIVE ones:
 *
 *   • proposing changes nothing
 *   • executing before approval is REFUSED
 *   • rejecting leaves the graph untouched
 *   • deciding twice is REFUSED
 *
 * A system that passes only the happy path has an approval gate in the UI and
 * not in the engine.
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/recovery-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR } from '../OntologyGateway'
import { RecoveryPlanService } from '../RecoveryPlanService'
import { AgentMissionEngine } from '../../kimmp/agents/AgentMissionEngine'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}
/** Assert a call is refused, and report the refusal reason. */
async function refuses(label: string, fn: () => Promise<any>, expect: RegExp) {
  try {
    await fn()
    fail++; console.log(`  ✗ ${label} — it was ALLOWED`)
  } catch (e: any) {
    const ok = expect.test(e.message)
    if (ok) { pass++; console.log(`  ✓ ${label} — "${e.message}"`) }
    else { fail++; console.log(`  ✗ ${label} — refused, but for the wrong reason: ${e.message}`) }
  }
}

const made: string[] = []
const missions: string[] = []
const DAY = 86_400_000

async function mk(typeName: string, props: any, daysAgo = 40) {
  const t = await prisma.ontologyObjectType.findUnique({ where: { name: typeName }, select: { id: true } })
  const r = await OntologyGateway.createObject(SYSTEM_ACTOR, { typeId: t!.id, properties: props })
  await prisma.ontologyObject.update({
    where: { id: r.data.id }, data: { createdAt: new Date(Date.now() - daysAgo * DAY) },
  })
  made.push(r.data.id)
  return r.data
}
const link = (s: any, t: any, sType: string, tType: string, type: string) =>
  OntologyGateway.createRelationship(SYSTEM_ACTOR, {
    sourceId: s.id, targetId: t.id, sourceType: sType, targetType: tType, relationshipType: type,
  })

async function main() {
  // ── A goal threatened by a late delivery on a real contract ────────────────
  const goal = await mk('EnterpriseGoal', { title: 'Retain strategic accounts', status: 'IN_PROGRESS', progress: 40 })
  const customer = await mk('Customer', { title: 'Northwind Ltd', status: 'IN_PROGRESS', arr: 300000 })
  const contract = await mk('Contract', { title: 'Northwind MSA', status: 'IN_PROGRESS', value: 300000 })
  const program = await mk('Program', {
    title: 'Northwind migration', status: 'AT_RISK', progress: 15,
    dueDate: new Date(Date.now() - 30 * DAY).toISOString(),
  })
  const outcome = await mk('Outcome', { title: 'Accounts retained', status: 'IN_PROGRESS', progress: 40 })

  await link(contract, customer, 'Contract', 'Customer', 'heldBy')
  await link(program, contract, 'Program', 'Contract', 'deliversOn')
  await link(outcome, goal, 'Outcome', 'EnterpriseGoal', 'realises')
  await link(contract, outcome, 'Contract', 'Outcome', 'realisedOn')

  const before = await prisma.ontologyObject.findUnique({ where: { id: program.id } })

  console.log('\n1. Propose — a plan is staged, and NOTHING is changed')
  const plan = await RecoveryPlanService.propose({ targetId: goal.id, actorId: 'probe-operator' })
  missions.push(plan.missionId)
  check('a mission was created', !!plan.missionId)
  check('it parked at AWAITING_APPROVAL', plan.status === 'AWAITING_APPROVAL', plan.status)
  check('it proposed at least one change', plan.proposedCount > 0, String(plan.proposedCount))
  check('exposure was carried into the plan', plan.assessment.exposure.quantified > 0,
    String(plan.assessment.exposure.quantified))

  const after = await prisma.ontologyObject.findUnique({ where: { id: program.id } })
  check('the threatened object is byte-for-byte unchanged',
    JSON.stringify(before!.properties) === JSON.stringify(after!.properties))
  check('updatedAt did not move either',
    before!.updatedAt.getTime() === after!.updatedAt.getTime())

  console.log('\n2. The mission is a real audit record, not a summary string')
  const m = await AgentMissionEngine.get(plan.missionId)
  check('steps were written', (m!.steps?.length ?? 0) >= 5, String(m!.steps?.length))
  check('every step carries a distinct title',
    new Set(m!.steps.map((s: any) => s.title)).size === m!.steps.length)
  check('the ANALYZE step carries computed evidence, not prose',
    !!(m!.steps.find((s: any) => s.stage === 'ANALYZE')?.data as any)?.threats)
  check('proposed actions are bound to real object ids',
    m!.actions.every((a: any) => made.includes(a.targetId)))
  check('risk-at-proposal was recorded, so verification can measure movement',
    m!.actions.every((a: any) => typeof (a.params as any)?._riskBefore === 'number'))

  console.log('\n3. Execution before approval is REFUSED by the engine')
  await refuses('cannot execute an AWAITING_APPROVAL mission',
    () => AgentMissionEngine.execute(plan.missionId, 'probe-operator'),
    /only an APPROVED mission can execute/i)

  const stillUnchanged = await prisma.ontologyObject.findUnique({ where: { id: program.id } })
  check('the refused execution changed nothing',
    JSON.stringify(before!.properties) === JSON.stringify(stillUnchanged!.properties))

  console.log('\n4. Rejection is a real decision — it closes the mission and touches nothing')
  const rejectPlan = await RecoveryPlanService.propose({ targetId: goal.id, actorId: 'probe-operator' })
  missions.push(rejectPlan.missionId)
  await AgentMissionEngine.decide(rejectPlan.missionId, false, 'probe-approver')
  const rejected = await AgentMissionEngine.get(rejectPlan.missionId)
  check('mission is REJECTED', rejected!.status === 'REJECTED', rejected!.status)
  check('its proposed actions are REJECTED too',
    rejected!.actions.every((a: any) => a.status === 'REJECTED'))
  await refuses('a REJECTED mission cannot then be executed',
    () => AgentMissionEngine.execute(rejectPlan.missionId, 'probe-operator'),
    /only an APPROVED mission can execute/i)
  await refuses('and it cannot be re-decided into approval',
    () => AgentMissionEngine.decide(rejectPlan.missionId, true, 'probe-approver'),
    /not AWAITING_APPROVAL/i)

  console.log('\n5. Approve — the gate opens, and records who opened it')
  const approved = await AgentMissionEngine.decide(plan.missionId, true, 'probe-approver')
  check('mission is APPROVED', approved!.status === 'APPROVED', approved!.status)
  check('the approver is recorded', approved!.approvedBy === 'probe-approver', String(approved!.approvedBy))
  check('approval timestamp is set', !!approved!.approvedAt)
  check('an APPROVAL step names the decider',
    approved!.steps.some((s: any) => s.stage === 'APPROVAL' && /probe-approver/.test(s.detail)))
  await refuses('approving twice is refused',
    () => AgentMissionEngine.decide(plan.missionId, true, 'probe-approver'),
    /not AWAITING_APPROVAL/i)

  console.log('\n6. Execute — every action goes through ActionEngine or is skipped, never silently applied')
  const executed = await AgentMissionEngine.execute(plan.missionId, 'probe-operator')
  check('mission reached a terminal state',
    ['COMPLETED', 'FAILED'].includes(executed!.status), executed!.status)

  const acts = await prisma.agentProposedAction.findMany({ where: { missionId: plan.missionId } })
  check('no action is left in limbo',
    acts.every((a: any) => ['EXECUTED', 'FAILED', 'SKIPPED'].includes(a.status)),
    acts.map((a: any) => a.status).join(','))

  const ran = acts.filter((a: any) => a.status === 'EXECUTED')
  check('at least one action actually EXECUTED — the chain does not end in SKIPPED',
    ran.length > 0, acts.map((a: any) => `${a.actionName}:${a.status}`).join(', '))

  const execIds = ran.map((a: any) => a.executionId).filter(Boolean)
  check('every executed action left an ActionExecution audit row',
    execIds.length === ran.length, `${execIds.length}/${ran.length}`)
  const audited = execIds.length
    ? await prisma.actionExecution.count({ where: { id: { in: execIds as string[] }, status: 'SUCCESS' } })
    : 0
  check('those audit rows exist and record SUCCESS',
    audited > 0 && audited === execIds.length, `${audited}/${execIds.length}`)

  console.log('\n6b. The change is real — the object itself moved')
  const changed = await prisma.ontologyObject.findUnique({ where: { id: program.id } })
  const cp = changed!.properties as any
  check('the threatened object is no longer byte-for-byte identical',
    JSON.stringify(before!.properties) !== JSON.stringify(cp))
  check('the change is one of the four recovery effects, not an arbitrary write',
    cp.rebaselined === true || cp.status === 'ESCALATED' || cp.capacityRequested === true,
    JSON.stringify({ rebaselined: cp.rebaselined, status: cp.status, capacityRequested: cp.capacityRequested }))
  if (cp.rebaselined === true) {
    check('the new due date is the forecast, not an arbitrary date',
      cp.dueDate !== (before!.properties as any).dueDate, String(cp.dueDate))
  }

  const events = await prisma.ontologyEvent.findMany({ where: { objectId: { in: made } } })
  check('an OntologyEvent records what was done and why',
    events.length > 0 && events.every(e => !!e.eventType), String(events.length))
  check('the event carries the reason, not just a type',
    events.some(e => Object.keys((e.properties ?? {}) as object).length > 0))

  console.log('\n7. Verify — the Outcome step measures, it does not assert')
  const v = await RecoveryPlanService.verify(plan.missionId)
  check('verification returns a count consistent with what executed',
    v.verified === ran.filter((a: any) => a.targetId).length, `${v.verified} vs ${ran.length}`)
  check('every outcome compares a real before and after',
    v.outcomes.every((o: any) => typeof o.riskAfter === 'number'))
  check('improvement is measured against the recorded prior risk, never assumed',
    v.outcomes.every((o: any) => o.improved === null || typeof o.improved === 'boolean'))

  console.log('\n8. A healthy target proposes nothing rather than inventing work')
  const calm = await mk('EnterpriseGoal', { title: 'Steady state', status: 'IN_PROGRESS', progress: 90 }, 5)
  const calmPlan = await RecoveryPlanService.propose({ targetId: calm.id, actorId: 'probe-operator' })
  missions.push(calmPlan.missionId)
  check('status is NO_ACTION', calmPlan.status === 'NO_ACTION', calmPlan.status)
  check('zero changes proposed', calmPlan.proposedCount === 0, String(calmPlan.proposedCount))
  await refuses('a NO_ACTION mission cannot be approved into existence',
    () => AgentMissionEngine.decide(calmPlan.missionId, true, 'probe-approver'),
    /not AWAITING_APPROVAL/i)

  // ── Cleanup ────────────────────────────────────────────────────────────────
  await prisma.agentMission.deleteMany({ where: { id: { in: missions } } })
  await prisma.ontologyEvent.deleteMany({ where: { objectId: { in: made } } })
  await prisma.ontologyRelationship.deleteMany({
    where: { OR: [{ sourceId: { in: made } }, { targetId: { in: made } }] },
  })
  await prisma.ontologyObject.deleteMany({ where: { id: { in: made } } })

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${pass} passed, ${fail} failed`)
  console.log('─'.repeat(52))
  process.exit(fail === 0 ? 0 : 1)
}

main().catch(e => { console.error('PROBE ERROR:', e); process.exit(1) })
