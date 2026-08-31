/**
 * The contract between the endpoints and the screens that consume them.
 *
 * Four Work OS pages crashed with "data.filter is not a function" because the
 * rebuilt endpoints return an envelope where the pages expected a bare array.
 * Every service probe was green throughout: they tested what the services
 * RETURN, and nothing tested what the pages READ. That gap is what this closes.
 *
 * These assertions are deliberately shallow and specific — the shape and the
 * handful of field names each screen actually indexes. A richer test would not
 * have caught this; a shape test would have.
 *
 * Run: npx tsx src/kangqore-view/eof/scripts/api-contract-e2e.ts
 */

import { WorkViewService } from '../WorkViewService'
import { DashboardService } from '../DashboardService'

let pass = 0, fail = 0
const check = (l: string, c: boolean, d = '') => {
  if (c) { pass++; console.log(`  ✓ ${l}`) } else { fail++; console.log(`  ✗ ${l} ${d}`) }
}
/** The specific failure that happened: a page calling an array method on an object. */
const isArray = (v: any) => Array.isArray(v)

async function main() {
  console.log('\n1. /work/items — TableView maps over the response directly')
  const items = await WorkViewService.items({ limit: 5 })
  check('returns a bare array', isArray(items), typeof items)
  if (items.length) {
    check('carries the fields the table renders',
      ['id', 'title', 'status', 'priority', 'progress'].every(f => f in items[0]),
      Object.keys(items[0]).join(','))
  }

  console.log('\n2. /work/board — BoardView indexes data.items[state]')
  const board = await WorkViewService.board()
  check('exposes items keyed by state', typeof board.items === 'object' && !isArray(board.items))
  check('every state key holds an array',
    Object.values(board.items).every(isArray))
  check('groups carry label and colour for the column headers',
    board.groups.every((g: any) => g.id && g.label && g.color))

  console.log('\n3. /work/timeline — TimelineView maps over .items')
  const tl = await WorkViewService.timeline()
  check('items is an array', isArray(tl.items), typeof tl.items)
  check('undated is reported rather than dropped', typeof tl.undated === 'number')

  console.log('\n4. /work/workload — WorkloadView reduces over .buckets')
  const wl = await WorkViewService.workload()
  check('buckets is an array', isArray(wl.buckets), typeof wl.buckets)
  if (wl.buckets.length) {
    const b: any = wl.buckets[0]
    check('each bucket has the numeric fields the view sums',
      typeof b.activeItems === 'number' && typeof b.totalEstimatedHours === 'number',
      Object.keys(b).join(','))
    check('and the label it renders', typeof b.name === 'string')
    check('items inside a bucket is an array', isArray(b.items))
  }

  console.log('\n5. /work/goals — GoalsView filters .goals')
  const g = await WorkViewService.goals()
  check('goals is an array', isArray(g.goals), typeof g.goals)
  if (g.goals.length) {
    const x: any = g.goals[0]
    check('carries id, title, status, progress, parentId',
      ['id', 'title', 'status', 'progress', 'parentId'].every(f => f in x),
      Object.keys(x).join(','))
    check('status is a real work state, not a legacy vocabulary',
      !['ON_TRACK', 'AT_RISK_LEGACY', 'BEHIND'].includes(x.status), x.status)
  }

  console.log('\n6. /work/portfolios — PortfolioView filters .portfolios')
  const pf = await WorkViewService.portfolios()
  check('portfolios is an array', isArray(pf.portfolios), typeof pf.portfolios)
  if (pf.portfolios.length) {
    const x: any = pf.portfolios[0]
    check('carries id, name, status, progress',
      ['id', 'name', 'status', 'progress'].every(f => f in x), Object.keys(x).join(','))
    check('health is rolled up, never typed in', typeof x.health === 'number')
  }

  console.log('\n7. /work/executive — ExecutiveView reads summary and the item lists')
  const ex = await WorkViewService.executive()
  check('summary is an object of numbers',
    Object.values(ex.summary).every(v => typeof v === 'number'))
  check('atRiskItems and overdueItems are arrays',
    isArray(ex.atRiskItems) && isArray(ex.overdueItems))
  check('byStatus is a map the breakdown can enumerate',
    typeof ex.byStatus === 'object' && !isArray(ex.byStatus))

  console.log('\n8. /dashboards/executive — DashboardView groups panels by question')
  const d = await DashboardService.resolve('executive')
  check('panels is an array', isArray(d.panels))
  check('each panel has the keys the renderer switches on',
    d.panels.every(p => p.key && p.title && p.question && p.render && typeof p.span === 'number'))
  check('render is one the view implements',
    d.panels.every(p => ['stat', 'list', 'breakdown', 'timeline', 'exposure'].includes(p.render)),
    [...new Set(d.panels.map(p => p.render))].join(','))
  check('error and empty are strings when present, never objects',
    d.panels.every(p => (p.error === undefined || typeof p.error === 'string') &&
                        (p.empty === undefined || typeof p.empty === 'string')))

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${pass} passed, ${fail} failed`)
  console.log('─'.repeat(52))
  process.exit(fail === 0 ? 0 : 1)
}

main().catch(e => { console.error('PROBE ERROR:', e); process.exit(1) })
