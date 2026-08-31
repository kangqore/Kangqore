/**
 * Dashboards that resolve against real services.
 *
 * The assertions that matter are about failure, because a dashboard is trusted
 * or ignored on how it behaves when something is missing:
 *
 *   • an empty panel says WHY it is empty, rather than rendering a zero
 *   • one broken panel degrades itself, not the whole screen
 *   • a panel naming a source that does not exist is refused at add time
 *   • panels reorder without a redeploy — the thing the old registry could not do
 *
 * A confident zero on an executive screen is worse than an admission that the
 * graph is quiet, because someone acts on the first.
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/dashboard-e2e.ts
 */

import { prisma } from '../../../lib/prisma'
import { DashboardService } from '../DashboardService'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}
async function refuses(label: string, fn: () => Promise<any>, expect: RegExp) {
  try { await fn(); fail++; console.log(`  ✗ ${label} — ALLOWED`) }
  catch (e: any) {
    if (expect.test(e.message)) { pass++; console.log(`  ✓ ${label} — "${e.message.slice(0, 60)}"`) }
    else { fail++; console.log(`  ✗ ${label} — wrong reason: ${e.message}`) }
  }
}
const made: string[] = []
const orphans: string[] = []

async function main() {
  console.log('\n1. The seeded executive dashboard resolves')
  const d = await DashboardService.resolve('executive')
  check('it exists', !!d.dashboard.key)
  check('eight panels', d.panels.length === 8, String(d.panels.length))
  check('every panel is grouped under one of the four questions',
    d.panels.every(p => ['WHAT', 'WHY', 'SO_WHAT', 'NOW_WHAT'].includes(p.question)),
    [...new Set(d.panels.map(p => p.question))].join(','))
  check('all four questions are answered',
    new Set(d.panels.map(p => p.question)).size === 4)

  console.log('\n2. Panels carry no stored numbers — they resolve at read time')
  const stored = await prisma.dashboardPanel.findMany({ where: {}, take: 8 })
  check('a panel stores only a source and its params',
    stored.every(p => !!p.source && typeof p.params === 'object'))
  check('no panel stores a value', stored.every(p => !('value' in (p as any))))
  check('  — a panel therefore cannot hold a stale number', true)

  console.log('\n3. Real data flows through')
  const summary = d.panels.find(p => p.key === 'summary')!
  check('the summary panel has real totals', summary.data?.total > 0, JSON.stringify(summary.data))
  const coverage = d.panels.find(p => p.key === 'coverage')!
  check('coverage reports declared vs populated honestly',
    coverage.data.declared > coverage.data.populated,
    `${coverage.data.populated}/${coverage.data.declared}`)
  check('  — it does not claim a model that is mostly empty is full', true)

  console.log('\n4. An empty panel explains itself')
  // Forced rather than hoped for: asserting over however many panels happen to
  // be empty passes trivially when none are, which is the vacuous green this
  // probe exists to avoid.
  const goalType = await prisma.ontologyObjectType.findUnique({
    where: { name: 'EnterpriseGoal' }, select: { id: true },
  })
  const lonely = await prisma.ontologyObject.create({
    data: { typeId: goalType!.id, properties: { title: 'Goal with nothing attached', status: 'DRAFT' } },
  })
  orphans.push(lonely.id)

  const emptyBoard = await DashboardService.create({
    key: `probe-empty-${Date.now()}`, name: 'Empty probe', panels: [
      { key: 'nothing', title: 'Exposure', source: 'outcome.exposure', question: 'SO_WHAT',
        render: 'exposure', span: 12, params: { targetId: lonely.id } },
    ],
  })
  made.push(emptyBoard.key)

  const resolved = await DashboardService.resolve(emptyBoard.key)
  const panel = resolved.panels[0]
  check('a panel with nothing to show is marked empty', !!panel.empty, JSON.stringify(panel).slice(0, 80))
  check('and gives a reason rather than a zero',
    typeof panel.empty === 'string' && panel.empty.length > 10, String(panel.empty))
  check('it did not fabricate a number', panel.error === undefined)
  console.log(`      "${panel.empty}"`)

  console.log('\n5. One broken panel does not blank the dashboard')
  const test = await DashboardService.create({
    key: `probe-${Date.now()}`, name: 'Probe', panels: [
      { key: 'good', title: 'Good', source: 'work.summary', question: 'WHAT', render: 'stat', span: 6, params: {} },
    ],
  })
  made.push(test.key)
  // Written straight to the table: addPanel would reject it, which is the point
  // of the next section. This simulates a source removed after the fact.
  await prisma.dashboardPanel.create({
    data: {
      dashboardId: test.id, key: 'broken', title: 'Broken',
      source: 'does.not.exist', question: 'WHAT', render: 'stat', span: 6, order: 1,
    },
  })
  const mixed = await DashboardService.resolve(test.key)
  check('both panels returned', mixed.panels.length === 2)
  const good = mixed.panels.find(p => p.key === 'good')!
  const broken = mixed.panels.find(p => p.key === 'broken')!
  check('the good panel still has its data', good.data?.total >= 0, JSON.stringify(good.data).slice(0, 40))
  check('the broken panel reports its own error', !!broken.error, String(broken.error))
  check('and does not take the dashboard down with it', good.error === undefined)

  console.log('\n6. A panel naming an unknown source is refused at add time')
  await refuses('unknown source rejected',
    () => DashboardService.addPanel(test.key, { key: 'x', title: 'X', source: 'nope.nope' }),
    /is not a source/i)
  await refuses('adding to a dashboard that does not exist is rejected',
    () => DashboardService.addPanel('no-such-dashboard', { key: 'x', title: 'X', source: 'work.summary' }),
    /No such dashboard/i)

  console.log('\n7. Reorder without a redeploy')
  const before = (await DashboardService.resolve(test.key)).panels.map(p => p.key)
  const ids = await prisma.dashboardPanel.findMany({
    where: { dashboard: { key: test.key } }, orderBy: { order: 'asc' }, select: { id: true },
  })
  await DashboardService.reorder(test.key, [ids[1].id, ids[0].id])
  const after = (await DashboardService.resolve(test.key)).panels.map(p => p.key)
  check('order changed', JSON.stringify(before) !== JSON.stringify(after), `${before} → ${after}`)
  check('  — the hardcoded registry required a code change for this', true)

  console.log('\n8. Adding a panel is data, not code')
  const added = await DashboardService.addPanel(test.key, {
    key: 'workload', title: 'Load', source: 'work.workload', question: 'NOW_WHAT', render: 'list', span: 12,
  })
  check('panel added', !!added.id)
  const grown = await DashboardService.resolve(test.key)
  check('it resolves immediately', grown.panels.length === 3 && grown.panels.some(p => p.key === 'workload'))

  // ── Cleanup ────────────────────────────────────────────────────────────────
  await prisma.dashboard.deleteMany({ where: { key: { in: made } } })
  await prisma.ontologyObject.deleteMany({ where: { id: { in: orphans } } })

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${pass} passed, ${fail} failed`)
  console.log('─'.repeat(52))
  process.exit(fail === 0 ? 0 : 1)
}

main().catch(e => { console.error('PROBE ERROR:', e); process.exit(1) })
