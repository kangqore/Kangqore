/**
 * Work templates — the path from an empty graph to real work.
 *
 * The claim being tested is narrow and checkable: applying a template leaves
 * the ontology genuinely fuller, with objects the Intelligence layer can score
 * and edges the Decision layer can walk. A template that produced a board and
 * no objects would be the same facade this codebase keeps growing.
 *
 * The negative cases matter as much:
 *   • a template whose edges break the model is rejected at seed time
 *   • an unknown template key throws rather than silently doing nothing
 *   • undo keeps objects someone has since edited
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/templates-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { WorkTemplateEngine, validateTemplate } from '../WorkTemplateEngine'
import { WORK_TEMPLATES } from '../WorkTemplateLibrary'
import { IntelligenceEngine } from '../IntelligenceEngine'
import { DecisionEngine } from '../DecisionEngine'
import { SYSTEM_ACTOR, OntologyGateway } from '../OntologyGateway'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}
const runIds: string[] = []

async function main() {
  console.log('\n1. Every declared template is valid against the model')
  for (const t of WORK_TEMPLATES) {
    const problems = validateTemplate(t.nodes, t.edges)
    check(`${t.key} (${t.nodes.length} nodes, ${t.edges.length} edges)`,
      problems.length === 0, problems.join('; '))
  }

  console.log('\n2. An invalid template is REJECTED, not silently accepted')
  const bad = validateTemplate(
    [{ ref: 'root', typeName: 'Project', properties: {} },
     { ref: 'x', typeName: 'NotAType', properties: {} }],
    [{ from: 'root', to: 'x', relationshipType: 'nonsense' }],
  )
  check('unknown type is caught', bad.some(p => /unknown type NotAType/.test(p)), bad.join('; '))
  check('unruled edge is caught', bad.some(p => /no rule for/.test(p)), bad.join('; '))

  const noRoot = validateTemplate([{ ref: 'a', typeName: 'Task', properties: {} }], [])
  check('a template with no root is caught', noRoot.some(p => /root/.test(p)))

  console.log('\n3. Applying a template creates REAL objects')
  const before = await prisma.ontologyObject.count({ where: { validTo: null } })

  const r = await WorkTemplateEngine.apply({
    templateKey: 'client-onboarding',
    actorId: 'probe-operator',
    values: { title: 'Probe Ltd — onboarding' },
    createBoard: true,
  })
  runIds.push(r.runId)

  check('status is COMPLETED', r.status === 'COMPLETED', `${r.status}: ${r.notes.join('; ')}`)
  check('objects created', r.objectsCreated >= 15, String(r.objectsCreated))
  check('edges created', r.edgesCreated >= 15, String(r.edgesCreated))
  check('no notes on a clean run', r.notes.length === 0, r.notes.join('; '))
  check('a board was created', !!r.boardId)

  const after = await prisma.ontologyObject.count({ where: { validTo: null } })
  check('the ontology is genuinely fuller',
    after - before === r.objectsCreated, `${after - before} new vs ${r.objectsCreated} reported`)

  console.log('\n4. The root carries the caller\'s values; children do not')
  const root = await prisma.ontologyObject.findUnique({ where: { id: r.rootObjectId! } })
  check('root title came from the caller',
    (root!.properties as any).title === 'Probe Ltd — onboarding',
    String((root!.properties as any).title))

  const createdIds = Object.values(
    (await prisma.workTemplateRun.findUnique({ where: { id: r.runId } }))!.createdObjects as Record<string, string>,
  )
  const children = await prisma.ontologyObject.findMany({
    where: { id: { in: createdIds.filter(i => i !== r.rootObjectId) } },
  })
  check('children kept their own titles',
    !children.some(c => (c.properties as any).title === 'Probe Ltd — onboarding'))
  check('every object is stamped with the template it came from',
    children.every(c => (c.properties as any).templateKey === 'client-onboarding'))

  console.log('\n5. Dates are real, and derived from the start date')
  const withDue = children.filter(c => !!(c.properties as any).dueDate)
  check('tasks carry due dates', withDue.length >= 9, String(withDue.length))
  const dates = withDue.map(c => new Date((c.properties as any).dueDate).getTime())
  check('the dates differ — this is a schedule, not one repeated date',
    new Set(dates).size > 3, `${new Set(dates).size} distinct`)
  check('all dates are in the future', dates.every(d => d > Date.now() - 86_400_000))

  console.log('\n6. The graph is walkable — Task → Workstream → Project')
  const edges = await prisma.ontologyRelationship.findMany({
    where: { sourceId: { in: createdIds }, validTo: null },
  })
  const partOf = edges.filter(e => e.relationshipType === 'partOf')
  const depends = edges.filter(e => e.relationshipType === 'dependsOn')
  check(`${partOf.length} partOf edges link the hierarchy`, partOf.length >= 12, String(partOf.length))
  check(`${depends.length} dependsOn edges encode real ordering`, depends.length >= 5, String(depends.length))
  check('the evidence chain exists (Action executes Task, Evidence evidences Action)',
    edges.some(e => e.relationshipType === 'executes') &&
    edges.some(e => e.relationshipType === 'evidences'))

  console.log('\n7. The Intelligence layer can score what the template created')
  const aTask = children.find(c => !!(c.properties as any).dueDate)!
  const inf = await IntelligenceEngine.infer(aTask.id)
  check('a created task can be inferred over', inf !== null)
  check('it produces a real risk number',
    typeof inf!.predictedRisk === 'number' && inf!.predictedRisk >= 0 && inf!.predictedRisk <= 1,
    String(inf!.predictedRisk))
  check('a brand-new task is not spuriously flagged as high risk',
    inf!.predictedRisk < 0.7, String(inf!.predictedRisk))

  console.log('\n8. The Decision layer can walk it')
  const assessment = await DecisionEngine.assess({ targetId: r.rootObjectId! })
  check('the project is assessable', assessment.target !== null)
  check('it found the work beneath it',
    assessment.summary.contributorsExamined > 0, String(assessment.summary.contributorsExamined))

  console.log('\n9. Unknown template key throws rather than doing nothing quietly')
  let threw = false
  try { await WorkTemplateEngine.apply({ templateKey: 'no-such-template', actorId: 'probe' }) }
  catch (e: any) { threw = /No template with key/.test(e.message) }
  check('rejected with a clear message', threw)

  console.log('\n10. Undo removes what it created — but keeps edited work')
  const edited = children[0]
  await OntologyGateway.patchObject(SYSTEM_ACTOR, edited.id, { properties: { status: 'IN_PROGRESS' } })

  const undone = await WorkTemplateEngine.undo(r.runId)
  check('the edited object was KEPT', undone.keptIds.includes(edited.id),
    `kept ${undone.kept}, deleted ${undone.deleted}`)
  check('untouched objects were removed', undone.deleted >= 14, String(undone.deleted))

  const survivors = await prisma.ontologyObject.count({ where: { id: { in: createdIds } } })
  check('only the edited ones survive', survivors === undone.kept, `${survivors} vs ${undone.kept}`)

  const leftoverEdges = await prisma.ontologyRelationship.count({
    where: { sourceId: { in: createdIds.filter(i => i !== edited.id) }, validTo: null },
  })
  check('their edges went too — no dangling relationships', leftoverEdges === 0, String(leftoverEdges))

  // ── Cleanup ────────────────────────────────────────────────────────────────
  await prisma.ontologyRelationship.deleteMany({
    where: { OR: [{ sourceId: { in: createdIds } }, { targetId: { in: createdIds } }] },
  })
  await prisma.ontologyObject.deleteMany({ where: { id: { in: createdIds } } })
  await prisma.board.deleteMany({ where: { id: r.boardId ?? '__none__' } })
  await prisma.workTemplateRun.deleteMany({ where: { id: { in: runIds } } })

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${pass} passed, ${fail} failed`)
  console.log('─'.repeat(52))
  process.exit(fail === 0 ? 0 : 1)
}

main().catch(e => { console.error('PROBE ERROR:', e); process.exit(1) })
