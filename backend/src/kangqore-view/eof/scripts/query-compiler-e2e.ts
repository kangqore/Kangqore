/**
 * Work OS Slice 1 — ObjectQueryCompiler probe.
 *
 * Proves the compiler does what the in-memory evaluator cannot, and fixes two
 * correctness bugs in the existing read path:
 *   • markings applied in SQL, BEFORE limit — a page of N is N readable rows
 *   • `total` counts only what the caller may see, so the pager stops lying
 *   • sort and pagination work at all
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/query-compiler-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR, type GatewayActor } from '../OntologyGateway'
import { ObjectQueryCompiler } from '../ObjectQueryCompiler'

let pass = 0
let fail = 0
function check(label: string, cond: boolean, detail = '') {
  if (cond) { pass++; console.log(`  ✓ ${label}`) }
  else { fail++; console.log(`  ✗ ${label} ${detail}`) }
}

const TYPE = 'QueryProbe'

/** An operator holding no clearances — can only see unmarked rows. */
const OPERATOR: GatewayActor = { id: 'probe-op', type: 'HUMAN', clearances: [] }

async function main() {
  const type = await prisma.ontologyObjectType.upsert({
    where: { name: TYPE },
    update: {},
    create: { name: TYPE, displayName: 'Query Probe' },
  })
  await prisma.ontologyObject.deleteMany({ where: { typeId: type.id } })

  // 6 unmarked + 4 CONFIDENTIAL, with sortable dueDates.
  for (let i = 1; i <= 10; i++) {
    await OntologyGateway.createObject(SYSTEM_ACTOR, {
      typeId: type.id,
      markings: i > 6 ? ['CONFIDENTIAL'] : [],
      properties: {
        title: `Item ${String(i).padStart(2, '0')}`,
        status: i % 2 === 0 ? 'DONE' : 'TODO',
        dueDate: `2026-09-${String(i).padStart(2, '0')}`,
        priority: i <= 3 ? 'HIGH' : 'LOW',
      },
    })
  }

  console.log('\n1. Compiles the common shape (no fallback)')
  const all = await ObjectQueryCompiler.byType(TYPE, SYSTEM_ACTOR, { limit: 100 })
  check('used the SQL path', all.compiled === true, all.reason ?? '')
  check('found all 10 objects as SYSTEM', all.total === 10, String(all.total))

  console.log('\n2. Filtering on a property')
  const done = await ObjectQueryCompiler.byType(TYPE, SYSTEM_ACTOR, { where: { status: 'DONE' } })
  check('status=DONE returns 5', done.total === 5, String(done.total))
  check('every row actually has that status',
    done.objects.every((o: any) => o.properties.status === 'DONE'))

  console.log('\n3. Sorting — impossible in the old evaluator')
  const desc = await ObjectQueryCompiler.byType(TYPE, SYSTEM_ACTOR, {
    sort: [{ field: 'dueDate', dir: 'desc' }], limit: 3,
  })
  const titles = desc.objects.map((o: any) => o.properties.title)
  check('sorted by dueDate desc', titles[0] === 'Item 10' && titles[2] === 'Item 08', titles.join(','))

  console.log('\n4. Pagination — also impossible before')
  const page1 = await ObjectQueryCompiler.byType(TYPE, SYSTEM_ACTOR, { sort: [{ field: 'dueDate' }], limit: 4, offset: 0 })
  const page2 = await ObjectQueryCompiler.byType(TYPE, SYSTEM_ACTOR, { sort: [{ field: 'dueDate' }], limit: 4, offset: 4 })
  check('page 1 has 4 rows', page1.objects.length === 4, String(page1.objects.length))
  check('page 2 has 4 different rows',
    page2.objects.length === 4 &&
    !page2.objects.some((o: any) => page1.objects.find((p: any) => p.id === o.id)))
  check('total is stable across pages', page1.total === 10 && page2.total === 10)

  console.log('\n5. Markings enforced IN SQL, before the limit')
  const asOperator = await ObjectQueryCompiler.byType(TYPE, OPERATOR, { limit: 100 })
  check('operator sees only the 6 unmarked rows', asOperator.total === 6, String(asOperator.total))
  check('no CONFIDENTIAL row leaked',
    asOperator.objects.every((o: any) => (o.markings ?? []).length === 0))

  // The bug this replaces: filter-after-limit returns a short page and a wrong
  // total. Ask for 6; a correct implementation returns exactly 6 readable rows.
  const fullPage = await ObjectQueryCompiler.byType(TYPE, OPERATOR, { limit: 6 })
  check('asking for 6 returns a FULL page of 6 readable rows', fullPage.objects.length === 6,
    String(fullPage.objects.length))
  check('total reflects what the operator may see, not the raw count',
    fullPage.total === 6, `${fullPage.total} (raw table holds 10)`)

  console.log('\n6. Falls back honestly for shapes SQL cannot express')
  const union = await ObjectQueryCompiler.run(
    {
      root: {
        type: 'union',
        sets: [
          { type: 'filter', field: 'typeId', op: 'eq', value: type.id },
          { type: 'filter', field: 'typeId', op: 'eq', value: type.id },
        ],
      } as any,
      limit: 100,
    },
    SYSTEM_ACTOR,
  )
  check('union fell back rather than failing', union.compiled === false)
  check('fallback still returns correct rows', union.total === 10, String(union.total))
  check('fallback states its reason', !!union.reason)

  console.log('\n7. Field whitelist blocks injection attempts')
  const inject = await ObjectQueryCompiler.run(
    { root: { type: 'filter', field: "id\"; DROP TABLE ontology_objects; --", op: 'eq', value: 'x' } as any },
    SYSTEM_ACTOR,
  )
  check('malformed field name did not compile to SQL', inject.compiled === false)
  const stillThere = await prisma.ontologyObject.count({ where: { typeId: type.id } })
  check('table intact', stillThere === 10, String(stillThere))

  await prisma.ontologyObject.deleteMany({ where: { typeId: type.id } })
  await prisma.ontologyObjectType.deleteMany({ where: { name: TYPE } })

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${pass} passed, ${fail} failed`)
  console.log('─'.repeat(52))
  process.exit(fail === 0 ? 0 : 1)
}

main().catch(err => { console.error('PROBE ERROR:', err); process.exit(1) })
