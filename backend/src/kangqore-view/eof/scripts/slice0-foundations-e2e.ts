/**
 * Work OS Slice 0 — foundations probe.
 *
 * Proves the two gateway bugs that block the Board and Automation slices are
 * actually fixed, rather than asserted:
 *   1. CDC UPDATE carries a real `before` image (diff-shaped automation
 *      triggers — STATUS_CHANGE, PRIORITY_CHANGE, ASSIGNED — are underivable
 *      without it).
 *   2. A partial property patch merges instead of replacing the document.
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/slice0-foundations-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR } from '../OntologyGateway'
import { CdcService } from '../../../lib/cdc/cdcService'

let pass = 0
let fail = 0
function check(label: string, cond: boolean, detail = '') {
  if (cond) { pass++; console.log(`  ✓ ${label}`) }
  else { fail++; console.log(`  ✗ ${label} ${detail}`) }
}

const TYPE_NAME = 'Slice0Probe'

async function main() {
  // ── Setup ──────────────────────────────────────────────────────────────────
  const type = await prisma.ontologyObjectType.upsert({
    where: { name: TYPE_NAME },
    update: {},
    create: { name: TYPE_NAME, displayName: 'Slice 0 Probe' },
  })
  await prisma.ontologyObject.deleteMany({ where: { typeId: type.id } })

  // CdcService keeps a 500-event in-memory ring; read it rather than subscribing.

  console.log('\n1. patchObject MERGES rather than replacing')
  const created = await OntologyGateway.createObject(SYSTEM_ACTOR, {
    typeId: type.id,
    properties: { status: 'TODO', priority: 'HIGH', assigneeId: 'u-1', tags: ['a', 'b'] },
  })
  check('object created', created.status === 'OK', created.reason ?? '')
  const id = created.data.id

  const patched = await OntologyGateway.patchObject(SYSTEM_ACTOR, id, {
    properties: { status: 'IN_PROGRESS' },
  })
  check('patch succeeded', patched.status === 'OK', patched.reason ?? '')

  const props = patched.data.properties as any
  check('patched field changed', props.status === 'IN_PROGRESS', String(props.status))
  check('priority survived the patch', props.priority === 'HIGH', String(props.priority))
  check('assigneeId survived the patch', props.assigneeId === 'u-1', String(props.assigneeId))
  check('tags survived the patch', Array.isArray(props.tags) && props.tags.length === 2, JSON.stringify(props.tags))

  console.log('\n2. updateObject still REPLACES (documented, deliberate)')
  const replaced = await OntologyGateway.updateObject(SYSTEM_ACTOR, id, {
    properties: { status: 'DONE' },
  })
  const rprops = replaced.data.properties as any
  check('replace drops other fields, as documented', rprops.priority === undefined, JSON.stringify(rprops))

  console.log('\n3. CDC UPDATE carries a real before-image')
  // Restore a rich document, then patch one field and inspect the event.
  await OntologyGateway.updateObject(SYSTEM_ACTOR, id, {
    properties: { status: 'TODO', priority: 'LOW' },
  })
  await OntologyGateway.patchObject(SYSTEM_ACTOR, id, { properties: { status: 'BLOCKED' } })
  await new Promise(r => setTimeout(r, 200))

  const updateEvents = CdcService.getRecentEvents({ table: 'ontology_objects', op: 'UPDATE', limit: 20 })
    .filter((e: any) => e.after?.id === id)
  check('an UPDATE event was emitted', updateEvents.length > 0)

  if (updateEvents.length) {
    const ev: any = updateEvents[0]   // newest first
    const before = ev.before?.properties
    const after = ev.after?.properties
    check('before-image is present (was hardcoded null)', !!before, JSON.stringify(ev).slice(0, 120))
    check('before shows the prior status', before?.status === 'TODO', String(before?.status))
    check('after shows the new status', after?.status === 'BLOCKED', String(after?.status))
    // This is the whole point: a diff-shaped trigger is now derivable.
    check(
      'STATUS_CHANGE is derivable from the event',
      !!before && !!after && before.status !== after.status,
    )
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────
  await prisma.ontologyObject.deleteMany({ where: { typeId: type.id } })
  await prisma.ontologyObjectType.deleteMany({ where: { name: TYPE_NAME } })

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${pass} passed, ${fail} failed`)
  console.log('─'.repeat(52))
  process.exit(fail === 0 ? 0 : 1)
}

main().catch(err => { console.error('PROBE ERROR:', err); process.exit(1) })
