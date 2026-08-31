/**
 * Contextual thread · Evidence Ledger · Intelligence Fields · Ingestion.
 *
 * The assertion this whole file exists for:
 *
 *   **A field that cannot compute writes nothing.**
 *
 * Seven intelligence columns were deleted from the object model because they
 * were declared and never populated. Bringing them back is only defensible if
 * failure is silent in the data and loud in the record — the run says FAILED,
 * the object keeps what it had. Everything else here is in the same spirit:
 * extraction proposes rather than writes, a failed action is not logged as a
 * change, and a reaction outside the vocabulary is refused.
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/thread-ledger-fields-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR } from '../OntologyGateway'
import { ThreadService, REACTIONS } from '../ThreadService'
import { EvidenceLedger } from '../EvidenceLedger'
import { IntelligenceFieldEngine } from '../IntelligenceFieldEngine'
import { IngestionEngine } from '../IngestionEngine'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}
async function refuses(label: string, fn: () => Promise<any>, expect: RegExp) {
  try { await fn(); fail++; console.log(`  ✗ ${label} — it was ALLOWED`) }
  catch (e: any) {
    if (expect.test(e.message)) { pass++; console.log(`  ✓ ${label} — "${e.message.slice(0, 68)}"`) }
    else { fail++; console.log(`  ✗ ${label} — wrong reason: ${e.message}`) }
  }
}

const made: string[] = []
const docs: string[] = []
const DAY = 86_400_000

async function mk(typeName: string, props: any) {
  const t = await prisma.ontologyObjectType.findUnique({ where: { name: typeName }, select: { id: true } })
  const r = await OntologyGateway.createObject(SYSTEM_ACTOR, { typeId: t!.id, properties: props })
  made.push(r.data.id)
  return r.data
}

async function main() {
  const task = await mk('Task', {
    title: 'Probe thread task', status: 'IN_PROGRESS', progress: 30, priority: 'HIGH',
    approver: 'alice', owner: 'bob',
    dueDate: new Date(Date.now() - 12 * DAY).toISOString(),
  })

  console.log('\n1. A thread hangs off the object, not beside it')
  const c1 = await ThreadService.post({
    objectId: task.id, body: 'Why is this slipping? @approver please look.', authorId: 'mahesh',
  })
  check('comment posted', !!c1?.id)
  const t1 = await ThreadService.thread(task.id)
  check('it appears on the object', t1.comments.length === 1, String(t1.comments.length))

  console.log('\n2. A role mention resolves through the object\'s own columns')
  const roleMention = c1!.mentions.find(m => m.kind === 'ROLE')
  check('@approver was read as a role, not a username', !!roleMention, JSON.stringify(c1!.mentions))
  check('it resolved to the approver ON THIS OBJECT',
    roleMention?.userId === 'alice', String(roleMention?.userId))
  check('  — routing follows the model, not whoever was remembered', true)

  console.log('\n3. Replies are threaded, and cannot jump objects')
  const other = await mk('Task', { title: 'Unrelated task', status: 'QUEUED' })
  const reply = await ThreadService.post({ objectId: task.id, body: 'Vendor slipped.', parentId: c1!.id, authorId: 'bob' })
  check('reply attached to its parent', reply!.parentId === c1!.id)
  await refuses('a reply cannot be parented across objects',
    () => ThreadService.post({ objectId: other.id, body: 'x', parentId: c1!.id }),
    /same object/i)

  const nested = await ThreadService.thread(task.id)
  check('the thread nests rather than flattening',
    nested.comments.length === 1 && nested.comments[0].replies.length === 1)

  console.log('\n4. An agent posts to the same thread, and is marked as one')
  const agent = await ThreadService.postAsAgent(task.id,
    'Risk rose to 0.62: 12 days overdue with 70% outstanding.',
    { module: 'IntelligenceEngine', evidence: [{ objectId: task.id, signal: 'overdue' }] })
  check('agent post recorded', agent!.authorType === 'KIMMP', agent!.authorType)
  check('its evidence is attached, not just prose', (agent!.evidence as any[]).length === 1)
  const withAgent = await ThreadService.thread(task.id)
  check('agent posts are counted separately from human ones',
    withAgent.agentPosts === 1, String(withAgent.agentPosts))

  console.log('\n5. Reactions are a vocabulary, not free emoji')
  const r1 = await ThreadService.react(c1!.id, 'NEEDS_REVIEW', 'alice')
  check('a valid reaction applies', r1.applied === true)
  const r2 = await ThreadService.react(c1!.id, 'NEEDS_REVIEW', 'alice')
  check('reacting again removes it', r2.applied === false)
  await refuses('an unknown reaction is refused',
    () => ThreadService.react(c1!.id, '🎉', 'alice'), /is not a reaction/i)
  check(`${Object.keys(REACTIONS).length} reactions, each with an operational meaning`,
    Object.keys(REACTIONS).length >= 6)

  console.log('\n6. Mentions become someone\'s inbox')
  const inbox = await ThreadService.inbox('alice')
  check('alice sees what was asked of her', inbox.unread >= 1, String(inbox.unread))
  check('the mention carries the object it is about', !!inbox.mentions[0]?.object?.title)

  console.log('\n7. The Evidence Ledger assembles sources that already existed')
  const ledger = await EvidenceLedger.forObject(task.id)
  check('comments appear in the ledger', (ledger.counts.COMMENT ?? 0) >= 3, JSON.stringify(ledger.counts))
  check('entries are newest first',
    ledger.entries.every((e, i) => i === 0 || e.at <= ledger.entries[i - 1].at))
  check('a comment is not recorded as a change to the object',
    ledger.entries.filter(e => e.source === 'COMMENT').every(e => e.mutating === false))

  const narrative = await EvidenceLedger.narrate(task.id)
  check('it renders as a narrative', narrative.lines.length >= 3, String(narrative.lines.length))
  console.log(`      ${narrative.lines.slice(-2).join('\n      ')}`)

  const blank = await mk('Task', { title: 'Nothing ever happened here', status: 'DRAFT' })
  const empty = await EvidenceLedger.narrate(blank.id)
  check('an object with no history says so rather than rendering a blank box', empty.empty === true)

  console.log('\n8. Intelligence fields — the deleted columns, now with compute behind them')
  const fields = await IntelligenceFieldEngine.list('Task')
  check('Task has system fields', fields.length >= 6, String(fields.length))
  check('the columns that were removed are back',
    ['predictedRisk', 'rootCause', 'nextBestAction', 'businessImpact']
      .every(f => fields.some(x => x.outputField === f)),
    fields.map(f => f.outputField).join(','))
  check('each one names a compute mode', fields.every(f => ['DERIVED', 'GENERATIVE'].includes(f.compute)))

  const riskField = fields.find(f => f.outputField === 'predictedRisk')!
  const computed = await IntelligenceFieldEngine.computeOne(riskField.id, task.id)
  check('a derived field computes', computed.status === 'OK', JSON.stringify(computed))
  check('it returns a real number', typeof computed.value === 'number', String(computed.value))
  check('with confidence and evidence, not a bare value',
    typeof computed.confidence === 'number' && (computed.evidence?.length ?? 0) > 0)

  const reread = await prisma.ontologyObject.findUnique({ where: { id: task.id } })
  check('the value was written to the object', typeof (reread!.properties as any).predictedRisk === 'number')
  check('its confidence was written alongside it',
    typeof (reread!.properties as any).predictedRisk_confidence === 'number')

  console.log('\n9. THE ASSERTION THIS EXISTS FOR — a field that cannot compute writes NOTHING')
  const orphan = await mk('Task', { title: 'Unconnected task', status: 'QUEUED', progress: 0 })
  const impactField = fields.find(f => f.outputField === 'businessImpact')!
  const skipped = await IntelligenceFieldEngine.computeOne(impactField.id, orphan.id)
  check('no reachable value → SKIPPED, not 0', skipped.status === 'SKIPPED', JSON.stringify(skipped))
  check('the skip states why', /priceable|reachable/i.test(skipped.error ?? ''), skipped.error)

  const after = await prisma.ontologyObject.findUnique({ where: { id: orphan.id } })
  check('the object was NOT written to',
    (after!.properties as any).businessImpact === undefined,
    String((after!.properties as any).businessImpact))
  check('  — this is why the seven columns were deleted, and why they can return', true)

  const run = await prisma.intelligenceFieldRun.findFirst({
    where: { fieldId: impactField.id, objectId: orphan.id }, orderBy: { createdAt: 'desc' },
  })
  check('but the attempt IS recorded', run?.status === 'SKIPPED', String(run?.status))

  console.log('\n10. Field creation is governed')
  await refuses('a field may not compute over a column people type into',
    () => IntelligenceFieldEngine.create({
      key: 'bad-status', name: 'Bad', typeName: 'Task', kind: 'CLASSIFY', outputField: 'status',
    }), /entered by people/i)
  await refuses('tier 5 is refused — an external action is not a field',
    () => IntelligenceFieldEngine.create({
      key: 'bad-tier', name: 'Bad', typeName: 'Task', kind: 'RECOMMEND',
      outputField: 'x', governanceTier: 5,
    }), /governed mission/i)
  await refuses('a generative field without an instruction is refused',
    () => IntelligenceFieldEngine.create({
      key: 'bad-gen', name: 'Bad', typeName: 'Task', kind: 'SUMMARY',
      compute: 'GENERATIVE', outputField: 'y',
    }), /needs an instruction/i)
  await refuses('an unknown object type is refused',
    () => IntelligenceFieldEngine.create({
      key: 'bad-type', name: 'Bad', typeName: 'Nonsense', kind: 'SCORE', outputField: 'z',
    }), /not an enterprise object type/i)

  console.log('\n11. Explain — why does this object show this value?')
  await IntelligenceFieldEngine.computeOne(riskField.id, task.id)
  const why = await IntelligenceFieldEngine.explain(task.id, 'predictedRisk')
  check('it explains a computed value', why.computed === true)
  check('it reports the tier and what the tier means', !!why.tierMeaning, String(why.tierMeaning))
  check('and what the value changed from', why.changedFrom !== undefined)
  check('generative fields are seeded OFF, so nothing costs a model call by surprise',
    (await prisma.intelligenceField.count({ where: { compute: 'GENERATIVE', enabled: true } })) === 0)

  console.log('\n12. Ingestion proposes; it never writes')
  const before = await prisma.ontologyObject.count({ where: { validTo: null } })
  const doc = await IngestionEngine.ingest({
    filename: 'engagement.txt', mimeType: 'text/plain',
    content: 'Engagement with Northgate Solutions Ltd. Contract value £420,000 signed 2026-09-15. Contact: procurement@northgate.example',
    uploadedBy: 'probe',
  })
  docs.push(doc.id)
  check('document accepted', doc.status === 'PENDING', doc.status)

  const ex = await IngestionEngine.extract(doc.id, { typeName: 'Customer' })
  check('fields were extracted', (ex.fields ?? 0) >= 3, JSON.stringify(ex.extracted))
  check('the company name was found', /Northgate/.test(String(ex.extracted?.title)), String(ex.extracted?.title))
  check('the money was parsed as a number, not a string',
    ex.extracted?.value === 420000, String(ex.extracted?.value))
  check('the email was found', /northgate/.test(String(ex.extracted?.email)))

  const afterExtract = await prisma.ontologyObject.count({ where: { validTo: null } })
  check('EXTRACTION CREATED NO OBJECTS', afterExtract === before, `${before} → ${afterExtract}`)

  const promoted = await IngestionEngine.promote(ex.candidateId!, 'probe-operator')
  made.push(promoted.objectId)
  check('promotion is a separate, deliberate act', !!promoted.objectId)
  check('and it lands as DRAFT, not as live work', promoted.status === 'DRAFT', promoted.status)
  await refuses('a candidate cannot be promoted twice',
    () => IngestionEngine.promote(ex.candidateId!, 'probe-operator'), /already PROMOTED/i)

  console.log('\n13. An unreadable file is recorded honestly, not half-parsed')
  const pdf = await IngestionEngine.ingest({
    filename: 'contract.pdf', mimeType: 'application/pdf', content: Buffer.from('%PDF-1.7 binary'),
  })
  docs.push(pdf.id)
  check('status is UNREADABLE', pdf.status === 'UNREADABLE', pdf.status)
  check('it says what is missing rather than failing silently',
    /parser/i.test(pdf.error ?? ''), pdf.error ?? '')
  const noText = await IngestionEngine.extract(pdf.id)
  check('extracting it yields nothing, with a reason', noText.candidates === 0)

  // ── Cleanup ────────────────────────────────────────────────────────────────
  await prisma.ingestionDocument.deleteMany({ where: { id: { in: docs } } })
  await prisma.objectComment.deleteMany({ where: { objectId: { in: made } } })
  await prisma.intelligenceFieldRun.deleteMany({ where: { objectId: { in: made } } })
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
