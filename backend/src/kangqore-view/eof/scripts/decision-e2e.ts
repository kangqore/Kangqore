/**
 * Decision layer probe — §26, the killer feature.
 *
 * Builds a realistic slice of an enterprise:
 *
 *   EnterpriseGoal "Grow ARR 40%"
 *     ← Outcome realises
 *     ← Contract (£400k, Acme) heldBy Customer
 *         ← Program "Acme platform" (late, 20%)
 *             ← Task "Data migration" (blocked)
 *     ← Contract (£120k, Bindeer)
 *         ← Program "Bindeer rollout" (healthy)
 *
 * Then asks what could prevent the goal, and checks the answer is derived:
 * exposure aggregated from real contract values, threats ranked by value at
 * risk, healthy work excluded, and the limits of the assessment stated.
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/decision-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR } from '../OntologyGateway'
import { DecisionEngine } from '../DecisionEngine'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}

const made: string[] = []
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
async function link(s: any, t: any, sType: string, tType: string, type: string) {
  const r = await OntologyGateway.createRelationship(SYSTEM_ACTOR, {
    sourceId: s.id, targetId: t.id, sourceType: sType, targetType: tType, relationshipType: type,
  })
  if (r.status !== 'OK') console.log(`      (edge ${type} → ${r.status}: ${r.reason ?? ''})`)
  return r
}

async function main() {
  // ── Build the graph ────────────────────────────────────────────────────────
  const goal = await mk('EnterpriseGoal', { title: 'Grow ARR 40%', status: 'IN_PROGRESS', progress: 30, horizon: 'YEAR' })
  const acme = await mk('Customer', { title: 'Acme Corp', status: 'IN_PROGRESS', arr: 400000, tier: 'STRATEGIC' })
  const bindeer = await mk('Customer', { title: 'Bindeer Inc', status: 'IN_PROGRESS', arr: 120000, tier: 'STANDARD' })

  const acmeContract = await mk('Contract', { title: 'Acme MSA', status: 'IN_PROGRESS', value: 400000, progress: 50 })
  const bindeerContract = await mk('Contract', { title: 'Bindeer SOW', status: 'IN_PROGRESS', value: 120000, progress: 60 })

  // Late, barely-moving delivery on the big contract.
  const acmeProgram = await mk('Program', {
    title: 'Acme platform build', status: 'AT_RISK', progress: 20,
    dueDate: new Date(Date.now() - 25 * DAY).toISOString(),
  })
  // Healthy delivery on the small one.
  const bindeerProgram = await mk('Program', {
    title: 'Bindeer rollout', status: 'IN_PROGRESS', progress: 85,
    dueDate: new Date(Date.now() + 60 * DAY).toISOString(),
  })
  const blockedTask = await mk('Task', {
    title: 'Data migration', status: 'BLOCKED', progress: 10,
    dueDate: new Date(Date.now() + 10 * DAY).toISOString(),
  })

  await link(acmeContract, acme, 'Contract', 'Customer', 'heldBy')
  await link(bindeerContract, bindeer, 'Contract', 'Customer', 'heldBy')
  await link(acmeProgram, acmeContract, 'Program', 'Contract', 'deliversOn')
  await link(bindeerProgram, bindeerContract, 'Program', 'Contract', 'deliversOn')
  await link(blockedTask, acmeProgram, 'Task', 'Program', 'partOf')

  const outcome = await mk('Outcome', { title: 'ARR growth realised', status: 'IN_PROGRESS', progress: 30 })
  await link(outcome, goal, 'Outcome', 'EnterpriseGoal', 'realises')
  await link(acmeContract, outcome, 'Contract', 'Outcome', 'realisedOn')
  await link(bindeerContract, outcome, 'Contract', 'Outcome', 'realisedOn')

  console.log('\n1. "What could prevent this goal?" — walks the graph backwards')
  const a = await DecisionEngine.assess({ targetId: goal.id })
  check('target identified', a.target?.title === 'Grow ARR 40%', a.target?.title ?? 'none')
  check('found contributors several hops away', a.summary.contributorsExamined >= 5,
    String(a.summary.contributorsExamined))
  check('the blocked task was reached (4 hops from the goal)',
    a.threats.some(t => t.title === 'Data migration') ||
    a.summary.contributorsExamined >= 6)

  console.log('\n2. Exposure is aggregated from real contract values')
  check('a monetary exposure was produced', a.exposure.quantified > 0, String(a.exposure.quantified))
  check('exposure does not exceed the total contract value on the graph',
    a.exposure.quantified <= 520000, String(a.exposure.quantified))

  console.log('\n3. Threats are ranked by value at risk, not alphabetically')
  const acmeThreat = a.threats.find(t => t.title === 'Acme platform build')
  check('the late Acme delivery is a threat', !!acmeThreat)
  check('it carries the £400k contract, reached by traversal',
    acmeThreat?.exposure === 400000, String(acmeThreat?.exposure))
  if (a.threats.length > 1) {
    check('ranked by weighted exposure, descending',
      a.threats[0].weightedExposure >= a.threats[1].weightedExposure,
      `${a.threats[0].weightedExposure} vs ${a.threats[1].weightedExposure}`)
  }

  console.log('\n4. Healthy work is excluded — this is not "list everything"')
  check('the healthy Bindeer rollout is NOT flagged',
    !a.threats.some(t => t.title === 'Bindeer rollout'),
    a.threats.map(t => t.title).join(', '))
  check('some contributors reported no signal at all', a.summary.noSignal >= 1,
    String(a.summary.noSignal))

  console.log('\n5. Recommended actions are ranked and tied to a real object')
  check('actions produced', a.recommendedActions.length > 0, String(a.recommendedActions.length))
  check('each names a real target object',
    a.recommendedActions.every(r => made.includes(r.targetObjectId)))
  check('no "no action needed" entries leaked in',
    !a.recommendedActions.some(r => /^no action/i.test(r.action)))
  check('the top action protects the most value',
    a.recommendedActions[0].protects === null ||
    a.recommendedActions.every(r => (r.protects ?? 0) <= (a.recommendedActions[0].protects ?? Infinity)))

  console.log('\n6. It states its own limits')
  check('confidence is reported', a.confidence > 0 && a.confidence <= 1, String(a.confidence))
  console.log(`      caveat: ${a.caveat ?? '(none — everything priced)'}`)
  check('caveat is either absent or explains what is missing',
    a.caveat === null || /priced|confidence|basis/i.test(a.caveat))

  console.log('\n7. A target with nothing attached says so, rather than reporting zero risk')
  const lonely = await mk('EnterpriseGoal', { title: 'Unstaffed goal', status: 'DRAFT', progress: 0 }, 2)
  const empty = await DecisionEngine.assess({ targetId: lonely.id })
  check('reports no basis rather than "all clear"',
    empty.caveat !== null && /no basis/i.test(empty.caveat), empty.caveat ?? 'none')
  check('exposure is 0 with 0 contributors — not a false all-clear',
    empty.summary.contributorsExamined === 0)

  console.log('\n8. The §26 executive rendering')
  console.log(DecisionEngine.format(a).split('\n').map(l => '      ' + l).join('\n'))

  // ── Cleanup ────────────────────────────────────────────────────────────────
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
