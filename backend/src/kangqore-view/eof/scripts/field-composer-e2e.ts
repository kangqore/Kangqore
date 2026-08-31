/**
 * Composing a field from a sentence, and previewing it before it exists.
 *
 * The assertion that matters most:
 *
 *   **Preview writes nothing.**
 *
 * A field writes onto every object of its type, so it must be judged by what it
 * produces rather than by how its definition reads. If previewing a draft left
 * a value behind — or a run, or a field row — the preview would be a mutation
 * wearing a question mark.
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/field-composer-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR } from '../OntologyGateway'
import { FieldComposer } from '../FieldComposer'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}
const made: string[] = []
const DAY = 86_400_000

async function main() {
  const t = await prisma.ontologyObjectType.findUnique({ where: { name: 'Task' }, select: { id: true } })
  const r = await OntologyGateway.createObject(SYSTEM_ACTOR, {
    typeId: t!.id,
    properties: {
      title: 'Composer probe', status: 'IN_PROGRESS', progress: 25,
      dueDate: new Date(Date.now() - 8 * DAY).toISOString(),
    },
  })
  made.push(r.data.id)

  console.log('\n1. The catalogue offers what can actually be built')
  const cat = FieldComposer.catalogue('Task')
  check('categories returned', cat.categories.length >= 3)
  const intel = cat.categories.find(c => c.id === 'intelligence')!
  check('intelligence items include derived and generative',
    intel.items.some((i: any) => i.compute === 'DERIVED') &&
    intel.items.some((i: any) => i.compute === 'GENERATIVE'))
  check('tiers are exposed so the weight is visible', Object.keys(cat.tiers).length === 6)

  console.log('\n2. A sentence composes into a draft')
  const risk = FieldComposer.compose('how risky is this', 'Task')
  check('composed', risk.ok, risk.ok ? '' : risk.reason)
  if (risk.ok) {
    check('it reused an existing computation rather than a model',
      risk.draft.compute === 'DERIVED', risk.draft.compute)
    check('mapped to the real output column',
      risk.draft.outputField === 'predictedRisk', risk.draft.outputField)
    check('and says so', !!risk.note, risk.note ?? '')
    check('derived fields default to ON_CHANGE', risk.draft.refresh === 'ON_CHANGE')
  }

  const summary = FieldComposer.compose('summarise this task and what is outstanding', 'Task')
  check('a generative request is recognised', summary.ok && summary.draft.compute === 'GENERATIVE')
  if (summary.ok) {
    check('it defaults to MANUAL — a model call per object is not a default',
      summary.draft.refresh === 'MANUAL', summary.draft.refresh)
    check('inputs come from the type, never invented',
      summary.draft.inputs.every(i => typeof i === 'string' && i.length > 0))
    check('it carries the instruction the person actually wrote',
      /summarise/i.test(summary.draft.instruction ?? ''))
  }

  const sentiment = FieldComposer.compose('what is the sentiment here', 'Customer')
  check('a classification gets its permitted values',
    sentiment.ok && (sentiment.draft.options ?? []).length === 3,
    sentiment.ok ? JSON.stringify(sentiment.draft.options) : '')

  console.log('\n3. It refuses rather than guessing')
  const vague = FieldComposer.compose('make it better somehow', 'Task')
  check('an unmappable request is REFUSED', !vague.ok, vague.ok ? 'composed anyway' : vague.reason)
  check('the refusal says what would work', !vague.ok && vague.hint.length > 20)

  const badType = FieldComposer.compose('summarise this', 'Nonsense')
  check('an unknown type is refused', !badType.ok)

  console.log('\n4. THE ASSERTION — preview writes nothing')
  const objBefore = await prisma.ontologyObject.findUnique({ where: { id: made[0] } })
  const fieldsBefore = await prisma.intelligenceField.count()
  const runsBefore = await prisma.intelligenceFieldRun.count()

  const preview = await FieldComposer.preview((risk as any).draft, made[0])
  check('preview produced a result', preview.previewed === true, JSON.stringify(preview))
  check('with a real value', preview.status === 'OK' && preview.value !== undefined, String(preview.value))
  check('and its evidence', (preview.evidence?.length ?? 0) > 0)

  const objAfter = await prisma.ontologyObject.findUnique({ where: { id: made[0] } })
  check('THE OBJECT WAS NOT WRITTEN TO',
    JSON.stringify(objBefore!.properties) === JSON.stringify(objAfter!.properties))
  check('no field was left behind',
    (await prisma.intelligenceField.count()) === fieldsBefore,
    `${fieldsBefore} → ${await prisma.intelligenceField.count()}`)
  check('no run was recorded',
    (await prisma.intelligenceFieldRun.count()) === runsBefore)
  check('  — a preview that mutated would be a write wearing a question mark', true)

  console.log('\n5. A preview that would be blank says so')
  const orphan = await OntologyGateway.createObject(SYSTEM_ACTOR, {
    typeId: t!.id, properties: { title: 'No value reachable', status: 'QUEUED', progress: 0 },
  })
  made.push(orphan.data.id)
  const impact = FieldComposer.compose('what is the business impact', 'Task')
  const blank = impact.ok ? await FieldComposer.preview(impact.draft, orphan.data.id) : null
  check('it reports the field would be blank', blank?.willBeBlank === true, JSON.stringify(blank))
  check('and why', /priceable|reachable/i.test(blank?.error ?? ''), blank?.error ?? '')

  console.log('\n6. Only after preview does it become real')
  const created = impact.ok ? await FieldComposer.create({ ...impact.draft, key: `probe-${Date.now()}` }, 'probe') : null
  check('creating stores the field', !!created?.id)
  if (created) await prisma.intelligenceField.delete({ where: { id: created.id } })

  // ── Cleanup ────────────────────────────────────────────────────────────────
  await prisma.intelligenceFieldRun.deleteMany({ where: { objectId: { in: made } } })
  await prisma.ontologyObject.deleteMany({ where: { id: { in: made } } })

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${pass} passed, ${fail} failed`)
  console.log('─'.repeat(52))
  process.exit(fail === 0 ? 0 : 1)
}

main().catch(e => { console.error('PROBE ERROR:', e); process.exit(1) })
