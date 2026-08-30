/**
 * Work OS views + automations, on the ontology.
 *
 * The surface this replaces returned 500 on all 26 endpoints because it queried
 * a Prisma model that never existed, and `as any` hid that from the compiler.
 * So the assertions here are deliberately about *values*, not status codes — a
 * view that returns 200 and an empty object is the same failure wearing a
 * better hat.
 *
 * The automation section proves the thing that was missing entirely: a rule
 * that fires. The old engine had trigger/condition/action and zero callers.
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/workview-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { WorkViewService } from '../WorkViewService'
import { WorkAutomationEngine } from '../WorkAutomationEngine'
import { OntologyGateway, SYSTEM_ACTOR } from '../OntologyGateway'
import { WORK_STATES } from '../EnterpriseObjectModel'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}
const made: string[] = []
const autos: string[] = []
const DAY = 86_400_000

async function mkTask(props: any) {
  const t = await prisma.ontologyObjectType.findUnique({ where: { name: 'Task' }, select: { id: true } })
  const r = await OntologyGateway.createObject(SYSTEM_ACTOR, { typeId: t!.id, properties: props })
  made.push(r.data.id)
  return r.data
}

async function main() {
  console.log('\n1. There is no WorkItem table — and there should not be')
  const hasModel = (prisma as any).workItem !== undefined
  check('prisma.workItem does not exist', !hasModel,
    'a WorkItem table would reintroduce the dual-write this replaced')

  console.log('\n2. Items come from the ontology and carry real values')
  const a = await mkTask({ title: 'Probe alpha', status: 'IN_PROGRESS', progress: 40, priority: 'HIGH',
    dueDate: new Date(Date.now() + 10 * DAY).toISOString() })
  const b = await mkTask({ title: 'Probe beta', status: 'BLOCKED', progress: 10, priority: 'CRITICAL' })
  const c = await mkTask({ title: 'Probe gamma', status: 'COMPLETED', progress: 100 })

  const items = await WorkViewService.items({ types: ['Task'] })
  const mine = items.filter(i => made.includes(i.id))
  check('all three are returned', mine.length === 3, String(mine.length))
  check('flattened — item.status, not item.properties.status',
    mine.every(i => typeof i.status === 'string' && typeof i.progress === 'number'))
  check('titles survive the projection', mine.some(i => i.title === 'Probe alpha'))
  check('objectId is the ontology id', mine.every(i => i.objectId === i.id))

  const open = await WorkViewService.items({ types: ['Task'], openOnly: true })
  check('openOnly excludes COMPLETED',
    !open.some(i => i.id === c.id) && open.some(i => i.id === a.id))

  console.log('\n3. The board exposes all 12 states, not a collapsed 7')
  const board = await WorkViewService.board({ types: ['Task'] })
  check('twelve columns', board.groups.length === 12, String(board.groups.length))
  check('AT_RISK and ESCALATED are addressable',
    board.groups.some(g => g.id === 'AT_RISK') && board.groups.some(g => g.id === 'ESCALATED'))
  check('the blocked task is in BLOCKED',
    board.items['BLOCKED']?.some((i: any) => i.id === b.id))
  check('keyed shape and ordered shape agree',
    board.groups.every(g => g.items.length === (board.items as any)[g.id].length))

  console.log('\n4. Timeline separates dated from undated rather than dropping either')
  const tl = await WorkViewService.timeline({}, { types: ['Task'] })
  check('the dated task appears', tl.items.some(i => i.id === a.id))
  check('the undated one is counted, not silently lost', tl.undated >= 1, String(tl.undated))

  console.log('\n5. Workload reports unassigned work as its own bucket')
  const wl = await WorkViewService.workload({ types: ['Task'] })
  const un = wl.buckets.find(x => x.assigneeId === null)
  check('an unassigned bucket exists', !!un)
  check('it counts the blocked item', (un?.blocked ?? 0) >= 1, String(un?.blocked))
  check('completed work is excluded from load',
    !wl.buckets.some(x => x.items.some((i: any) => i.id === c.id)))

  console.log('\n6. Dependency graph uses real edges only')
  await OntologyGateway.createRelationship(SYSTEM_ACTOR, {
    sourceId: a.id, targetId: b.id, sourceType: 'Task', targetType: 'Task',
    relationshipType: 'dependsOn',
  })
  const g = await WorkViewService.dependencyGraph({ types: ['Task'] })
  check('the edge is present', g.edges.some(e => e.source === a.id && e.target === b.id))
  check('alpha is reported blocked by beta, which is unfinished',
    g.nodes.find(n => n.id === a.id)?.blockedBy.includes('Probe beta') === true)
  check('hierarchy edges are NOT mixed in',
    g.edges.every(e => ['dependsOn', 'blocks'].includes(e.type)),
    [...new Set(g.edges.map(e => e.type))].join(','))

  console.log('\n7. Executive summary is counted, not stored')
  const ex = await WorkViewService.executive()
  check('totals are real numbers', ex.summary.total > 0, String(ex.summary.total))
  check('blocked count includes our task', ex.summary.blocked >= 1, String(ex.summary.blocked))
  check('completion rate is derived',
    ex.summary.completionRate === Math.round((ex.summary.done / ex.summary.total) * 100))
  check('it reports how many objects have actually been scored',
    typeof ex.summary.scored === 'number')

  console.log('\n8. Writes are validated against the state machine')
  let rejected = false
  try { await WorkViewService.moveItem(a.id, 'DONE') }
  catch (e: any) { rejected = /not a work state/.test(e.message) }
  check('"DONE" is REFUSED — it is not one of the twelve', rejected)

  const moved = await WorkViewService.moveItem(a.id, 'UNDER_REVIEW')
  check('a valid state is accepted', moved.status === 'UNDER_REVIEW', moved.status)
  const reread = await prisma.ontologyObject.findUnique({ where: { id: a.id } })
  check('the object itself changed', (reread!.properties as any).status === 'UNDER_REVIEW')
  check('other properties survived — patched, not replaced',
    (reread!.properties as any).title === 'Probe alpha' && (reread!.properties as any).progress === 40)

  console.log('\n9. Automations FIRE — the thing that never worked')
  const auto = await WorkAutomationEngine.create({
    name: 'Escalate blocked criticals',
    trigger: { type: 'STATUS_CHANGE', config: { to: 'BLOCKED' } },
    conditions: [{ field: 'priority', op: 'eq', value: 'CRITICAL' }],
    actions: [{ type: 'SET_FIELD', params: { field: 'escalated', value: true } }],
    typeName: 'Task',
  })
  autos.push(auto.id)

  const target = await mkTask({ title: 'Probe delta', status: 'IN_PROGRESS', priority: 'CRITICAL', progress: 5 })
  const before = await prisma.ontologyObject.findUnique({ where: { id: target.id } })
  await OntologyGateway.patchObject(SYSTEM_ACTOR, target.id, { properties: { status: 'BLOCKED' } })
  const after = await prisma.ontologyObject.findUnique({ where: { id: target.id } })

  const fired = await WorkAutomationEngine.evaluate('UPDATE', before, after)
  check('the automation matched', fired.matched === 1, JSON.stringify(fired))
  check('it names what it applied', fired.applied.includes('Escalate blocked criticals'))

  const changed = await prisma.ontologyObject.findUnique({ where: { id: target.id } })
  check('the object was actually modified', (changed!.properties as any).escalated === true)
  check('the write is marked as automated, so it cannot re-trigger',
    (changed!.properties as any)._automated === true)

  const runs = await WorkAutomationEngine.runs(auto.id)
  check('a run was recorded', runs.length >= 1)
  check('the run says what it did', !!(runs[0].actionsApplied as any)?.escalated)

  console.log('\n10. It does NOT fire when it should not')
  const lowPriority = await mkTask({ title: 'Probe epsilon', status: 'IN_PROGRESS', priority: 'LOW' })
  const lpBefore = await prisma.ontologyObject.findUnique({ where: { id: lowPriority.id } })
  await OntologyGateway.patchObject(SYSTEM_ACTOR, lowPriority.id, { properties: { status: 'BLOCKED' } })
  const lpAfter = await prisma.ontologyObject.findUnique({ where: { id: lowPriority.id } })

  const notFired = await WorkAutomationEngine.evaluate('UPDATE', lpBefore, lpAfter)
  check('condition failed, so nothing was applied', notFired.matched === 0, JSON.stringify(notFired))
  const lpFinal = await prisma.ontologyObject.findUnique({ where: { id: lowPriority.id } })
  check('the low-priority task was untouched', (lpFinal!.properties as any).escalated === undefined)

  // A write that does not move the status is not a status change.
  const same = await WorkAutomationEngine.evaluate('UPDATE', lpAfter, lpAfter)
  check('an UPDATE that did not change status does NOT trigger', same.matched === 0)

  // An automation's own write must not cascade.
  const reentry = await WorkAutomationEngine.evaluate('UPDATE', before, changed)
  check('an automated write is skipped, so rules cannot loop',
    reentry.matched === 0 && (reentry as any).skipped === 'automated write',
    JSON.stringify(reentry))

  console.log('\n11. A disabled automation is inert')
  await WorkAutomationEngine.toggle(auto.id)
  const off = await mkTask({ title: 'Probe zeta', status: 'IN_PROGRESS', priority: 'CRITICAL' })
  const offBefore = await prisma.ontologyObject.findUnique({ where: { id: off.id } })
  await OntologyGateway.patchObject(SYSTEM_ACTOR, off.id, { properties: { status: 'BLOCKED' } })
  const offAfter = await prisma.ontologyObject.findUnique({ where: { id: off.id } })
  const offRun = await WorkAutomationEngine.evaluate('UPDATE', offBefore, offAfter)
  check('disabled rules are not evaluated', offRun.matched === 0, JSON.stringify(offRun))

  console.log('\n12. An invalid automation is rejected at creation')
  let badRejected = false
  try {
    await WorkAutomationEngine.create({
      name: 'bad', trigger: { type: 'STATUS_CHANGE' },
      actions: [{ type: 'SET_STATUS', params: { value: 'DONE' } }],
    })
  } catch (e: any) { badRejected = /not a work state/.test(e.message) }
  check('SET_STATUS to a non-existent state is refused', badRejected)

  console.log('\n13. Goals and portfolios come from the strategy tiers')
  const goals = await WorkViewService.goals()
  check('goals resolve', Array.isArray(goals.goals))
  const pf = await WorkViewService.portfolios()
  check('portfolios resolve', Array.isArray(pf.portfolios))
  check('portfolio health is rolled up, never typed in',
    pf.portfolios.every(p => p.health >= 0 && p.health <= 100))

  // ── Cleanup ────────────────────────────────────────────────────────────────
  await prisma.workAutomation.deleteMany({ where: { id: { in: autos } } })
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
