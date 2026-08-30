/**
 * Board layer probe — boards as projections of the ontology.
 *
 * Proves the payoff of doing the object model first:
 *   • a board over ANY type derives its columns from that type's schema
 *   • intelligence and governance columns come along, making it a decision surface
 *   • the same object appears on two boards at once (Board = view, not container)
 *   • moving a card writes through the gateway, so the graph is the source of truth
 *   • per-board ordering is independent, which container-boards cannot do
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/board-layer-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR } from '../OntologyGateway'
import { BoardService } from '../BoardService'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}

const boards: string[] = []
const objs: string[] = []

async function main() {
  const type = await prisma.ontologyObjectType.findUnique({ where: { name: 'Task' }, select: { id: true } })
  if (!type) throw new Error('Task type missing — run the enterprise model seeder first')

  // Three tasks in different states.
  for (const [title, status, priority] of [
    ['Migrate database', 'IN_PROGRESS', 'HIGH'],
    ['Cutover rehearsal', 'BLOCKED', 'CRITICAL'],
    ['Write runbook', 'READY', 'MEDIUM'],
  ]) {
    const r = await OntologyGateway.createObject(SYSTEM_ACTOR, {
      typeId: type.id,
      properties: { title, status, priority, progress: 20, predictedRisk: 0.4 },
    })
    objs.push(r.data.id)
  }

  console.log('\n1. A board over a type configures itself from the schema')
  const b1 = await BoardService.createBoard({ name: 'Delivery', rootTypeName: 'Task', ownerId: 'probe' })
  boards.push(b1.board.id)
  check('board created over Task', !!b1.board.id)
  check('columns derived, none hand-written', b1.columns.length > 0, `${b1.columns.length} visible`)
  check('groups derived from the status options', b1.groups.length === 12, `${b1.groups.length}`)
  check('status column carries its colour map',
    !!b1.columns.find(c => c.field === 'status' && Object.keys(c.colorMap ?? {}).length > 0))

  console.log('\n2. Intelligence + governance columns exist on the board')
  const classes = new Set([...b1.columns, ...b1.hiddenColumns].map((c: any) => c.columnClass))
  check('all four column classes present',
    ['CORE', 'ENTERPRISE', 'INTELLIGENCE', 'GOVERNANCE'].every(c => classes.has(c)),
    [...classes].join(','))
  check('intelligence columns available but not forced on by default',
    b1.hiddenColumns.some((c: any) => c.columnClass === 'INTELLIGENCE'))

  const b2 = await BoardService.createBoard({
    name: 'Risk review', rootTypeName: 'Task', ownerId: 'probe',
    showClasses: ['CORE', 'INTELLIGENCE', 'GOVERNANCE'],
  })
  boards.push(b2.board.id)
  check('a board can opt into intelligence + governance columns',
    b2.columns.some((c: any) => c.columnClass === 'INTELLIGENCE') &&
    b2.columns.some((c: any) => c.columnClass === 'GOVERNANCE'))

  console.log('\n3. Board = view, not container — one object, two boards')
  const inB1 = b1.items.length
  const inB2 = b2.items.length
  check('both boards show the same 3 objects', inB1 === 3 && inB2 === 3, `${inB1}/${inB2}`)
  const ids1 = new Set(b1.items.map((i: any) => i.id))
  check('they are literally the same object ids',
    b2.items.every((i: any) => ids1.has(i.id)))

  console.log('\n4. Items are grouped by real state')
  const blocked = b1.groups.find(g => g.id === 'BLOCKED')
  check('BLOCKED group holds the blocked task',
    blocked?.items.length === 1 && blocked.items[0].title === 'Cutover rehearsal',
    JSON.stringify(blocked?.items.map((i: any) => i.title)))
  check('items are flattened — item.status, not item.properties.status',
    b1.items.every((i: any) => typeof i.status === 'string'))

  console.log('\n5. Moving a card writes to the graph, not the board')
  const target = b1.items.find((i: any) => i.title === 'Write runbook')
  const moved = await BoardService.moveItem(b1.board.id, target.id, 'IN_PROGRESS', SYSTEM_ACTOR)
  check('move succeeded', moved.status === 'OK', moved.reason ?? '')

  const raw = await prisma.ontologyObject.findUnique({ where: { id: target.id } })
  check('the OntologyObject itself changed state',
    (raw!.properties as any).status === 'IN_PROGRESS', String((raw!.properties as any).status))
  check('other properties survived the move — patch merged, not replaced',
    (raw!.properties as any).priority === 'MEDIUM' && (raw!.properties as any).predictedRisk === 0.4)

  const b2after = await BoardService.resolve(b2.board.id, SYSTEM_ACTOR)
  const inProgB2 = b2after.groups.find(g => g.id === 'IN_PROGRESS')
  check('the OTHER board sees the change immediately — one graph',
    inProgB2!.items.some((i: any) => i.id === target.id))

  console.log('\n6. Per-board ordering is independent')
  await BoardService.moveItem(b1.board.id, objs[0], 'IN_PROGRESS', SYSTEM_ACTOR, 0)
  await BoardService.moveItem(b2.board.id, objs[0], 'IN_PROGRESS', SYSTEM_ACTOR, 99)
  const p1 = await prisma.boardItemPosition.findUnique({ where: { boardId_objectId: { boardId: b1.board.id, objectId: objs[0] } } })
  const p2 = await prisma.boardItemPosition.findUnique({ where: { boardId_objectId: { boardId: b2.board.id, objectId: objs[0] } } })
  check('same object holds a different position on each board',
    !!p1 && !!p2 && p1.position !== p2.position, `${p1?.position} vs ${p2?.position}`)

  console.log('\n7. A board over a completely different type — no new code')
  const bc = await BoardService.createBoard({ name: 'Accounts', rootTypeName: 'Customer', ownerId: 'probe' })
  boards.push(bc.board.id)
  check('board over Customer works with zero configuration', bc.columns.length > 0, `${bc.columns.length} columns`)
  check('it picked up Customer-specific columns',
    [...bc.columns, ...bc.hiddenColumns].some((c: any) => c.id === 'arr'))

  // ── Cleanup ────────────────────────────────────────────────────────────────
  await prisma.board.deleteMany({ where: { id: { in: boards } } })
  await prisma.ontologyObject.deleteMany({ where: { id: { in: objs } } })

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${pass} passed, ${fail} failed`)
  console.log('─'.repeat(52))
  process.exit(fail === 0 ? 0 : 1)
}

main().catch(e => { console.error('PROBE ERROR:', e); process.exit(1) })
