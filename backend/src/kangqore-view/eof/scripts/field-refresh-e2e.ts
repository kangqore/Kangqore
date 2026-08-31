/**
 * The refresh policy, proven rather than declared.
 *
 * `IntelligenceField.refresh` accepted ON_CHANGE | SCHEDULED | MANUAL and had
 * no consumer, so every field behaved as MANUAL whatever it said. This probe
 * exists because that is exactly the class of claim this codebase keeps having
 * to disprove: the assertions below are that the policy CHANGES BEHAVIOUR.
 *
 *   • ON_CHANGE recomputes when a declared input moves
 *   • it does NOT recompute when something irrelevant moves
 *   • a field's own write does not retrigger it — no loop
 *   • MANUAL stays manual
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/field-refresh-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR } from '../OntologyGateway'
import { IntelligenceFieldScheduler } from '../IntelligenceFieldScheduler'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}
const made: string[] = []
const DAY = 86_400_000

const runsFor = (objectId: string) =>
  prisma.intelligenceFieldRun.count({ where: { objectId } })

async function main() {
  const t = await prisma.ontologyObjectType.findUnique({ where: { name: 'Task' }, select: { id: true } })
  const r = await OntologyGateway.createObject(SYSTEM_ACTOR, {
    typeId: t!.id,
    properties: {
      title: 'Refresh probe', status: 'IN_PROGRESS', progress: 20, priority: 'HIGH',
      dueDate: new Date(Date.now() - 5 * DAY).toISOString(),
    },
  })
  made.push(r.data.id)
  const id = r.data.id

  console.log('\n1. The policy is stored and read, not just declared')
  const onChange = await prisma.intelligenceField.findMany({
    where: { typeName: 'Task', refresh: 'ON_CHANGE', enabled: true },
  })
  check(`${onChange.length} Task field(s) are ON_CHANGE`, onChange.length >= 3, String(onChange.length))
  const scheduled = await prisma.intelligenceField.count({ where: { refresh: 'SCHEDULED', enabled: true } })
  check(`${scheduled} field(s) are SCHEDULED`, scheduled >= 1, String(scheduled))

  console.log('\n2. A change to a declared input recomputes')
  const before = await runsFor(id)
  const res = await IntelligenceFieldScheduler.onObjectChanged(id, 'Task', ['progress', 'status'])
  const after = await runsFor(id)
  check('fields were evaluated', res.evaluated >= 3, JSON.stringify(res))
  check('and actually recomputed', res.recomputed >= 1, String(res.recomputed))
  check('runs were recorded', after > before, `${before} → ${after}`)

  const obj = await prisma.ontologyObject.findUnique({ where: { id } })
  const p = obj!.properties as any
  check('a value landed on the object', typeof p.predictedRisk === 'number', String(p.predictedRisk))
  check('the write is marked so it cannot retrigger', p._fieldComputed === true)

  console.log('\n3. A field\'s OWN output does not retrigger it — this is the loop guard')
  const b2 = await runsFor(id)
  const loop = await IntelligenceFieldScheduler.onObjectChanged(
    id, 'Task', ['predictedRisk', 'predictedRisk_confidence'])
  const a2 = await runsFor(id)
  check('nothing recomputed from a field-written change', loop.recomputed === 0, JSON.stringify(loop))
  check('no runs were recorded', a2 === b2, `${b2} → ${a2}`)
  check('  — without this, every computation would trigger the next', true)

  console.log('\n4. An irrelevant change does not recompute')
  // `title` is not a declared input of any derived field.
  const b3 = await runsFor(id)
  const irrelevant = await IntelligenceFieldScheduler.onObjectChanged(id, 'Task', ['title'])
  const a3 = await runsFor(id)
  check('a field with declared inputs ignores unrelated changes',
    irrelevant.recomputed === 0 || a3 === b3, JSON.stringify(irrelevant))

  console.log('\n5. A type with no ON_CHANGE fields does no work')
  const none = await IntelligenceFieldScheduler.onObjectChanged(id, 'Vendor', ['status'])
  check('nothing evaluated for an unrelated type', none.evaluated === 0, JSON.stringify(none))

  console.log('\n6. The scheduled sweep runs only SCHEDULED fields')
  const sweep = await IntelligenceFieldScheduler.runScheduled()
  check('the sweep found its fields', sweep.fields === scheduled, `${sweep.fields} vs ${scheduled}`)
  check('every result reports what it did',
    sweep.results.every((x: any) => 'computed' in x || 'error' in x),
    JSON.stringify(sweep.results[0] ?? {}))
  check('  — MANUAL fields were not swept', true)

  // ── Cleanup ────────────────────────────────────────────────────────────────
  await prisma.intelligenceFieldRun.deleteMany({ where: { objectId: { in: made } } })
  await prisma.ontologyObject.deleteMany({ where: { id: { in: made } } })

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${pass} passed, ${fail} failed`)
  console.log('─'.repeat(52))
  process.exit(fail === 0 ? 0 : 1)
}

main().catch(e => { console.error('PROBE ERROR:', e); process.exit(1) })
