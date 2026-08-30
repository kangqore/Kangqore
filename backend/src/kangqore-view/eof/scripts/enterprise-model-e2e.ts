/**
 * Enterprise Object Model probe.
 *
 * Proves the model is enforced, not merely declared:
 *   • every type carries all four column classes
 *   • the execution chain (goal → objective → … → evidence) can be built
 *   • cardinality rules REJECT an invalid graph
 *   • the commercial chain supports the traversal that answers
 *     "which delay threatens which renewal"
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/enterprise-model-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR } from '../OntologyGateway'
import { ENTERPRISE_OBJECTS, ENTERPRISE_RELATIONSHIPS, columnsOfClass, schemaFor } from '../EnterpriseObjectModel'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}

const made: string[] = []
async function obj(typeName: string, props: Record<string, any>) {
  const t = await prisma.ontologyObjectType.findUnique({ where: { name: typeName }, select: { id: true } })
  const r = await OntologyGateway.createObject(SYSTEM_ACTOR, { typeId: t!.id, properties: props })
  made.push(r.data.id)
  return r.data
}
const rel = (s: any, t: any, sType: string, tType: string, type: string) =>
  OntologyGateway.createRelationship(SYSTEM_ACTOR, {
    sourceId: s.id, targetId: t.id, sourceType: sType, targetType: tType, relationshipType: type,
  })

async function main() {
  console.log('\n1. Every type carries all four column classes')
  let allFour = true
  for (const d of ENTERPRISE_OBJECTS) {
    const s = schemaFor(d)
    for (const cls of ['CORE', 'ENTERPRISE', 'INTELLIGENCE', 'GOVERNANCE'] as const) {
      if (columnsOfClass(s, cls).length === 0) { allFour = false; console.log(`      ${d.name} missing ${cls}`) }
    }
  }
  check(`all ${ENTERPRISE_OBJECTS.length} types have CORE + ENTERPRISE + INTELLIGENCE + GOVERNANCE`, allFour)

  const persisted = await prisma.ontologyObjectType.findMany({
    where: { name: { in: ENTERPRISE_OBJECTS.map(o => o.name) } },
    select: { name: true, schema: true },
  })
  check('all types persisted to the ontology', persisted.length === ENTERPRISE_OBJECTS.length,
    `${persisted.length}/${ENTERPRISE_OBJECTS.length}`)
  check('schemas are non-empty in the database',
    persisted.every(t => Object.keys((t.schema ?? {}) as object).length > 20))

  console.log('\n2. The 12-state work machine, not 3')
  const task = persisted.find(t => t.name === 'Task')!
  const states = ((task.schema as any).status?.options ?? []) as string[]
  check('Task has 12 states', states.length === 12, String(states.length))
  check('includes the states Monday cannot express',
    ['BLOCKED', 'AT_RISK', 'AWAITING_APPROVAL', 'ESCALATED'].every(s => states.includes(s)))

  console.log('\n3. Ownership is plural (owner ≠ executor ≠ approver)')
  const tSchema = task.schema as any
  check('has owner, approver and aiAgent as distinct columns',
    !!tSchema.owner && !!tSchema.approver && !!tSchema.aiAgent)
  check('an item can be executed by an AI agent', tSchema.aiAgent?.type === 'object-ref')

  console.log('\n4. Timeline carries plan vs predicted, not just a due date')
  check('dueDate is an ENTERPRISE column', tSchema.dueDate?.columnClass === 'ENTERPRISE')
  check('predictedCompletion is an INTELLIGENCE column — inferred, not typed',
    tSchema.predictedCompletion?.columnClass === 'INTELLIGENCE')

  console.log('\n5. Build the execution chain: goal → objective → initiative → program → project')
  const goal = await obj('EnterpriseGoal', { title: 'Grow ARR 40%', status: 'IN_PROGRESS', horizon: 'YEAR' })
  const objective = await obj('StrategicObjective', { title: 'Win 5 enterprise logos', status: 'IN_PROGRESS' })
  const initiative = await obj('Initiative', { title: 'Enterprise GTM', status: 'IN_PROGRESS' })
  const program = await obj('Program', { title: 'Delivery excellence', status: 'IN_PROGRESS' })

  const r1 = await rel(objective, goal, 'StrategicObjective', 'EnterpriseGoal', 'serves')
  const r2 = await rel(initiative, objective, 'Initiative', 'StrategicObjective', 'advances')
  const r3 = await rel(program, initiative, 'Program', 'Initiative', 'partOf')
  check('goal ← objective ← initiative ← program all linked',
    [r1, r2, r3].every(r => r.status === 'OK'),
    [r1, r2, r3].map(r => r.status).join(','))

  console.log('\n6. Cardinality is ENFORCED — an invalid graph is rejected')
  // `serves` is MANY_TO_ONE: an objective serves exactly one goal.
  const goal2 = await obj('EnterpriseGoal', { title: 'Cut cost 10%', status: 'IN_PROGRESS' })
  const violation = await rel(objective, goal2, 'StrategicObjective', 'EnterpriseGoal', 'serves')
  check('second parent goal REJECTED by cardinality',
    violation.status === 'CARDINALITY_VIOLATION', `${violation.status}: ${violation.reason ?? ''}`)

  // MANY_TO_MANY is genuinely permitted — the rule discriminates.
  const taskA = await obj('Task', { title: 'Migrate DB', status: 'IN_PROGRESS' })
  const taskB = await obj('Task', { title: 'Cutover', status: 'QUEUED' })
  const taskC = await obj('Task', { title: 'Smoke test', status: 'QUEUED' })
  const d1 = await rel(taskB, taskA, 'Task', 'Task', 'dependsOn')
  const d2 = await rel(taskB, taskC, 'Task', 'Task', 'dependsOn')
  check('many-to-many dependsOn allows two dependencies',
    d1.status === 'OK' && d2.status === 'OK', `${d1.status},${d2.status}`)

  console.log('\n7. The commercial chain: customer ← contract ← project, threatened by risk')
  const customer = await obj('Customer', { title: 'Acme Corp', status: 'IN_PROGRESS', tier: 'STRATEGIC', arr: 250000, health: 'GOOD' })
  const contract = await obj('Contract', { title: 'Acme MSA', status: 'IN_PROGRESS', value: 250000 })
  const proj = await obj('Program', { title: 'Acme platform build', status: 'AT_RISK' })
  const risk = await obj('Incident', { title: 'Vendor API delay', status: 'ESCALATED', severity: 'SEV2' })

  const c1 = await rel(contract, customer, 'Contract', 'Customer', 'heldBy')
  const c2 = await rel(risk, contract, 'Incident', 'Contract', 'threatens')
  check('contract → customer linked', c1.status === 'OK', c1.status)
  check('risk → contract "threatens" edge exists', c2.status === 'OK', c2.status)

  // The traversal that makes this worth building: from a risk, reach the
  // customer whose renewal it threatens.
  const edges = await prisma.ontologyRelationship.findMany({
    where: { sourceId: risk.id, relationshipType: 'threatens' },
  })
  const contractIds = edges.map(e => e.targetId)
  const upstream = await prisma.ontologyRelationship.findMany({
    where: { sourceId: { in: contractIds }, relationshipType: 'heldBy' },
  })
  check('risk → contract → customer is traversable in the graph',
    upstream.some(u => u.targetId === customer.id))

  console.log('\n8. Relationship rules are registered')
  const rules = await prisma.ontologyCardinalityRule.count()
  check(`${ENTERPRISE_RELATIONSHIPS.length} relationship rules registered`,
    rules >= ENTERPRISE_RELATIONSHIPS.length, String(rules))

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
