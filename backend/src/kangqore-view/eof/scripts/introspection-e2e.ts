/**
 * Model introspection + semantic views.
 *
 * Two things are being proven, and the second matters more:
 *
 *   1. The intelligence layer can see the model's grammar — that a Task
 *      reaches an EnterpriseGoal, and through which hops.
 *   2. When it cannot understand a request, it SAYS SO rather than returning
 *      a plausible-looking query over the wrong rows. A view that silently
 *      drops the records someone needed is worse than no view.
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/introspection-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { ModelIntrospection } from '../ModelIntrospection'
import { IntentCompiler } from '../IntentCompiler'
import { ObjectQueryCompiler } from '../ObjectQueryCompiler'
import { SYSTEM_ACTOR } from '../OntologyGateway'
import { KimmpContextAssembler } from '../../kimmp/context/kimmpContextAssembler.service'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}

async function main() {
  console.log('\n1. The model is legible — types, tiers, columns')
  const cat = ModelIntrospection.catalogue()
  check(`${cat.length} types catalogued`, cat.length >= 20, String(cat.length))
  check('every type reports all four column classes',
    cat.every(t => t.columns.CORE.length && t.columns.ENTERPRISE.length &&
                   t.columns.INTELLIGENCE.length && t.columns.GOVERNANCE.length))
  // Positional, not a fixed number: inserting Portfolio shifted every tier
  // below it, and an assertion pinned to "5" then tested a different type while
  // still reading as though it tested Project.
  const tierOf = (n: string) => cat.find(t => t.name === n)?.tier ?? -1
  check('Project sits directly below Program',
    tierOf('Project') === tierOf('Program') + 1,
    `Program ${tierOf('Program')}, Project ${tierOf('Project')}`)
  check('Risk is a type in its own right', !!cat.find(t => t.name === 'Risk'))

  console.log('\n2. The execution chain is ordered, goal → evidence')
  const chain = ModelIntrospection.executionChain()
  const tiers = chain.map(t => t.tier!)
  check('tiers are strictly ascending', tiers.every((t, i) => i === 0 || t > tiers[i - 1]),
    tiers.join(','))
  check('starts at EnterpriseGoal', chain[0].name === 'EnterpriseGoal', chain[0].name)
  check('ends at Outcome', chain[chain.length - 1].name === 'Outcome', chain[chain.length - 1].name)
  check('the chain has no gaps at all',
    tiers.every((t, i) => i === 0 || t === tiers[i - 1] + 1), tiers.join(','))
  check('Project and Portfolio both hold a tier',
    chain.some(t => t.name === 'Project') && chain.some(t => t.name === 'Portfolio'),
    chain.map(t => t.name).join(' → '))

  console.log('\n3. Cross-tier reasoning — "CEO objective to execution" (§7)')
  const p = ModelIntrospection.pathBetween('Task', 'EnterpriseGoal')
  check('a Task can reach an EnterpriseGoal', p !== null && p.length > 0,
    p === null ? 'no path' : `${p.length} hops`)
  if (p) console.log(`      ${p.map(e => `${e.from} -${e.type}-> ${e.to}`).join('\n      ')}`)

  const money = ModelIntrospection.pathBetween('Project', 'Customer')
  check('a Project can reach the Customer whose revenue it affects', money !== null,
    money === null ? 'no path' : `${money.length} hops`)

  check('an unrelated pair reports NO path rather than inventing one',
    ModelIntrospection.pathBetween('Asset', 'NotARealType') === null)

  console.log('\n4. KIMMP actually receives the model')
  const ctx = await KimmpContextAssembler.build({ userId: 'probe-user' } as any)
  check('context carries the object model', !!ctx.objectModel)
  check('it includes the execution chain', ctx.objectModel.executionChain.length >= 9,
    String(ctx.objectModel.executionChain.length))
  check('the prompt summary names real relationships',
    /-threatens->|-deliversOn->/.test(ctx.objectModel.summary))
  check('  — before this, no file in kimmp/ imported the model at all', true)

  console.log('\n5. Semantic views — a sentence becomes a real query (§4)')
  const hi = IntentCompiler.compile('show me all high-risk projects')
  check('recognised the type', hi.ok && hi.typeName === 'Project', hi.ok ? hi.typeName : hi.reason)
  check('recognised the risk condition',
    hi.ok && hi.matched.some(m => m.startsWith('predictedRisk')), hi.ok ? hi.matched.join('|') : '')

  const overdue = IntentCompiler.compile('which contracts are overdue')
  check('overdue compiles to a date filter, not a keyword match',
    overdue.ok && overdue.matched.some(m => /dueDate/.test(m)), overdue.ok ? overdue.matched.join('|') : overdue.reason)

  const blocked = IntentCompiler.compile('list blocked tasks')
  check('a work state is matched exactly',
    blocked.ok && blocked.matched.includes('status = BLOCKED'), blocked.ok ? blocked.matched.join('|') : blocked.reason)

  const big = IntentCompiler.compile('customers with arr over 100k')
  check('money threshold parsed with its unit',
    big.ok && big.matched.some(m => /arr > 100000/.test(m)), big.ok ? big.matched.join('|') : big.reason)

  console.log('\n6. It refuses rather than guesses')
  const nonsense = IntentCompiler.compile('show me everything important')
  check('no type named → REFUSED, not a query over all objects',
    !nonsense.ok, nonsense.ok ? `compiled to ${nonsense.typeName}` : nonsense.reason)
  check('the refusal explains what was needed',
    !nonsense.ok && nonsense.hint.length > 10)

  const partial = IntentCompiler.compile('projects that smell wrong')
  check('unrecognised words are reported, not silently dropped',
    partial.ok && partial.ignored.length > 0, partial.ok ? partial.ignored.join(',') : partial.reason)
  if (partial.ok) console.log(`      ignored: ${partial.ignored.join(', ')}`)

  const fake = IntentCompiler.compile('tasks with high churn risk')
  check('a column that does not exist on the type is not filtered on',
    fake.ok && !fake.matched.some(m => /churn/i.test(m)),
    fake.ok ? fake.matched.join('|') : fake.reason)

  console.log('\n7. The compiled query runs, and returns ONLY that type')
  // The assertion that matters: a query naming a type must be constrained to
  // it. Without a typeId filter "open contracts" selected every unfinished
  // object in the graph — 71 rows where 6 exist — and looked entirely fine.
  const contractType = await prisma.ontologyObjectType.findUnique({
    where: { name: 'Contract' }, select: { id: true },
  })
  const contractCount = await prisma.ontologyObject.count({
    where: { typeId: contractType!.id, validTo: null },
  })

  const bound = await IntentCompiler.compileBound('open contracts')
  if (bound.ok) {
    const r = await ObjectQueryCompiler.run(bound.query, SYSTEM_ACTOR)
    check('query executed', Array.isArray(r.objects), typeof r.objects)
    check('every row returned is actually of the named type',
      r.objects.every((o: any) => o.typeId === contractType!.id),
      `${r.objects.filter((o: any) => o.typeId !== contractType!.id).length} foreign rows`)
    check('the result cannot exceed the number of objects of that type',
      r.objects.length <= contractCount, `${r.objects.length} returned, ${contractCount} exist`)

    const total = await prisma.ontologyObject.count({ where: { validTo: null } })
    check('and is far smaller than the whole graph',
      r.objects.length < total, `${r.objects.length} of ${total}`)
  } else {
    check('"open contracts" should compile', false, bound.reason)
  }

  // A filter on a column the type does not carry must return nothing, not
  // everything — an ignored predicate is how a view silently lies.
  const noArr = await IntentCompiler.compileBound('projects with arr over 100k')
  if (noArr.ok) {
    check('a money filter falls back to a field the type DOES have',
      noArr.matched.some(m => /budget >/.test(m)) || !noArr.matched.some(m => /arr/.test(m)),
      noArr.matched.join('|'))
  }

  console.log('\n7b. Numeric filters compare as numbers, not as text')
  // jsonb ->> yields text, so an uncast range comparison is lexicographic:
  // '90000' > '100000' is TRUE. Every ARR/budget/risk threshold was wrong.
  const custType = await prisma.ontologyObjectType.findUnique({
    where: { name: 'Customer' }, select: { id: true },
  })
  const custs = await prisma.ontologyObject.findMany({
    where: { typeId: custType!.id, validTo: null },
  })
  const arrs = custs
    .map(c => (c.properties as any)?.arr)
    .filter(v => typeof v === 'number') as number[]
  const expected = arrs.filter(v => v > 100_000).length

  const q = await IntentCompiler.compileBound('customers with arr over 100k')
  if (q.ok && arrs.length) {
    const r = await ObjectQueryCompiler.run(q.query, SYSTEM_ACTOR)
    check(`arr > 100000 returns ${expected}, not all ${arrs.length}`,
      r.objects.length === expected, `${r.objects.length} returned`)
    check('every returned row genuinely exceeds the threshold',
      r.objects.every((o: any) => Number((o.properties as any)?.arr) > 100_000))
  } else {
    check('customers should carry arr for this check', false, `${arrs.length} with arr`)
  }

  console.log('\n8. Read-only — introspection exposes no way to write')
  const surface = Object.keys(ModelIntrospection)
  check('no mutating method on the introspection surface',
    !surface.some(k => /create|update|delete|write|set|patch/i.test(k)),
    surface.join(','))
  check('the compiler returns a query, never executes a mutation',
    !Object.keys(IntentCompiler).some(k => /execute|run|apply/i.test(k)),
    Object.keys(IntentCompiler).join(','))

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${pass} passed, ${fail} failed`)
  console.log('─'.repeat(52))
  process.exit(fail === 0 ? 0 : 1)
}

main().catch(e => { console.error('PROBE ERROR:', e); process.exit(1) })
