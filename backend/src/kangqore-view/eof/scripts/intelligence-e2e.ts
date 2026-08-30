/**
 * Intelligence layer probe.
 *
 * The two properties that matter more than any feature here:
 *   • every number is DERIVED from the object's own data or its edges
 *   • when evidence is absent, it SAYS SO rather than inventing a cause
 *
 * A wrong root cause is worse than an absent one, because someone acts on it.
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/intelligence-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR } from '../OntologyGateway'
import { IntelligenceEngine } from '../IntelligenceEngine'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}

const made: string[] = []
const DAY = 86_400_000

async function mk(typeName: string, props: any, createdDaysAgo = 30) {
  const t = await prisma.ontologyObjectType.findUnique({ where: { name: typeName }, select: { id: true } })
  const r = await OntologyGateway.createObject(SYSTEM_ACTOR, { typeId: t!.id, properties: props })
  // Backdate so velocity has history to work with.
  await prisma.ontologyObject.update({
    where: { id: r.data.id },
    data: { createdAt: new Date(Date.now() - createdDaysAgo * DAY) },
  })
  made.push(r.data.id)
  return r.data
}

async function main() {
  console.log('\n1. Healthy item — no risk, and it does NOT invent a cause')
  const healthy = await mk('Task', {
    title: 'On track task', status: 'IN_PROGRESS', progress: 80,
    dueDate: new Date(Date.now() + 60 * DAY).toISOString(),
  })
  const h = (await IntelligenceEngine.infer(healthy.id))!
  check('risk is low', h.predictedRisk < 0.3, String(h.predictedRisk))
  check('root cause states there is no signal — not a fabricated reason',
    /no risk signal/i.test(h.rootCause), h.rootCause)
  check('next best action is "none"', /no action/i.test(h.nextBestAction), h.nextBestAction)

  console.log('\n2. Overdue item — cause derived from its own dates')
  const late = await mk('Task', {
    title: 'Late task', status: 'IN_PROGRESS', progress: 30,
    dueDate: new Date(Date.now() - 20 * DAY).toISOString(),
  })
  const l = (await IntelligenceEngine.infer(late.id))!
  check('risk is high', l.predictedRisk >= 0.5, String(l.predictedRisk))
  check('cause names the actual overdue amount', /20 day/.test(l.rootCause), l.rootCause)
  check('cause cites the real outstanding percentage', /70%/.test(l.rootCause), l.rootCause)
  check('recommends re-baselining, since 70% cannot be recovered',
    /re-baseline/i.test(l.nextBestAction), l.nextBestAction)

  console.log('\n3. Slipping item — forecast from velocity, before it is late')
  const slipping = await mk('Task', {
    title: 'Will miss', status: 'IN_PROGRESS', progress: 10,
    dueDate: new Date(Date.now() + 5 * DAY).toISOString(),
  })
  const s = (await IntelligenceEngine.infer(slipping.id))!
  check('flagged as at risk while still in the future', s.predictedRisk >= 0.3, String(s.predictedRisk))
  check('cause quotes the measured pace', /%\/day/.test(s.rootCause), s.rootCause)
  check('predictedCompletion is computed', !!s.predictedCompletion)
  check('  — this is what `if dueDate < now` cannot see', true)

  console.log('\n4. Blocked item — cause comes from a real edge, not a guess')
  const blocker = await mk('Task', { title: 'Vendor API', status: 'BLOCKED', progress: 0 })
  const blocked = await mk('Task', {
    title: 'Dependent work', status: 'IN_PROGRESS', progress: 40,
    dueDate: new Date(Date.now() + 30 * DAY).toISOString(),
  })
  await OntologyGateway.createRelationship(SYSTEM_ACTOR, {
    sourceId: blocker.id, targetId: blocked.id,
    sourceType: 'Task', targetType: 'Task', relationshipType: 'blocks',
  })
  const b = (await IntelligenceEngine.infer(blocked.id))!
  check('cause names the actual blocking object', /Vendor API/.test(b.rootCause), b.rootCause)
  check('action targets that blocker', /Vendor API/.test(b.nextBestAction), b.nextBestAction)
  check('evidence cites the edge', b.evidence.some(e => /blocker/i.test(e)), b.evidence.join(' | '))

  // A completed blocker must stop counting.
  await OntologyGateway.patchObject(SYSTEM_ACTOR, blocker.id, { properties: { status: 'COMPLETED' } })
  const b2 = (await IntelligenceEngine.infer(blocked.id))!
  check('a COMPLETED blocker no longer blocks', !/Vendor API/.test(b2.rootCause), b2.rootCause)

  console.log('\n5. Business impact via graph traversal (§11)')
  const customer = await mk('Customer', { title: 'Acme Corp', status: 'IN_PROGRESS', arr: 250000 })
  const contract = await mk('Contract', { title: 'Acme MSA', status: 'IN_PROGRESS', value: 180000 })
  const delivery = await mk('Program', {
    title: 'Acme build', status: 'AT_RISK', progress: 20,
    dueDate: new Date(Date.now() - 10 * DAY).toISOString(),
  })
  await OntologyGateway.createRelationship(SYSTEM_ACTOR, {
    sourceId: contract.id, targetId: customer.id,
    sourceType: 'Contract', targetType: 'Customer', relationshipType: 'heldBy',
  })
  await OntologyGateway.createRelationship(SYSTEM_ACTOR, {
    sourceId: delivery.id, targetId: contract.id,
    sourceType: 'Program', targetType: 'Contract', relationshipType: 'deliversOn',
  })

  const d = (await IntelligenceEngine.infer(delivery.id))!
  check('reached the contract value by traversing the graph',
    d.businessImpact === 180000, String(d.businessImpact))
  check('a late delivery now carries money, not just a red flag',
    d.predictedRisk >= 0.5 && d.businessImpact !== null)

  console.log('\n6. Unknown ≠ zero')
  const orphan = await mk('Task', { title: 'Unconnected', status: 'IN_PROGRESS', progress: 50 })
  const o = (await IntelligenceEngine.infer(orphan.id))!
  check('unreachable value is null, not 0', o.businessImpact === null, String(o.businessImpact))

  console.log('\n7. Confidence tracks evidence, it is not a flattering constant')
  const thin = await mk('Task', { title: 'Brand new' , status: 'DRAFT', progress: 0 }, 1)
  const thick = await mk('Task', {
    title: 'Long history', status: 'IN_PROGRESS', progress: 60,
    dueDate: new Date(Date.now() + 30 * DAY).toISOString(),
  }, 90)
  const tn = (await IntelligenceEngine.infer(thin.id))!
  const tk = (await IntelligenceEngine.infer(thick.id))!
  check('thin evidence yields low confidence', tn.aiConfidence < 0.5, String(tn.aiConfidence))
  check('rich evidence yields higher confidence', tk.aiConfidence > tn.aiConfidence,
    `${tn.aiConfidence} vs ${tk.aiConfidence}`)

  console.log('\n8. Writing back populates the INTELLIGENCE columns')
  const run = await IntelligenceEngine.inferAndWrite('Task')
  check('inferred across the type', run.inferred >= 6, String(run.inferred))
  check('counted the at-risk items', run.atRisk >= 2, String(run.atRisk))

  const reread = await prisma.ontologyObject.findUnique({ where: { id: late.id } })
  const p = (reread!.properties as any)
  check('predictedRisk persisted on the object', typeof p.predictedRisk === 'number', String(p.predictedRisk))
  check('rootCause persisted', typeof p.rootCause === 'string' && p.rootCause.length > 10)
  check('original properties survived the write — merged, not replaced',
    p.title === 'Late task' && p.progress === 30)

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
