// ---------------------------------------------------------------------------
// HANUMANAS Scheduler — fires schedule.1h / schedule.6h / schedule.24h cadences.
//
// Called from WaandaBootstrap Phase 2 (_bootHanumanas) — not from index.ts directly.
// ---------------------------------------------------------------------------

import { HanumanasEngineDispatcher } from './hanumanasEngineDispatcher'

let started    = false
let intervalMs = 60 * 60_000  // default: 1h

const _intervals: ReturnType<typeof setInterval>[] = []

function run(trigger: 'schedule.1h' | 'schedule.6h' | 'schedule.24h'): void {
  HanumanasEngineDispatcher.runTrigger(trigger, { userId: 'HANUMANAS_SCHEDULER' })
    .then(results => {
      const critical = results.filter(r => r.verdict === 'CRITICAL').length
      const warn     = results.filter(r => r.verdict === 'WARN').length
      console.log(`[HANUMANAS] ${trigger}: ${results.length} agents | CRITICAL:${critical} WARN:${warn}`)
      // Forward verdicts to HanumanasAdapter for WAANDA health reporting
      import('./hanumanasScheduler').then(() => {}).catch(() => {})
      try {
        const { updateHanumanasVerdicts } = require('../../waanda/adapters/HanumanasAdapter')
        updateHanumanasVerdicts({ clear: results.length - critical - warn, warn, critical })
      } catch {}
    })
    .catch(err => console.error(`[HANUMANAS] ${trigger} scheduler error:`, err))
}

export const HanumanasScheduler = {
  start(): void {
    if (started) return
    started = true

    // All agents run every hour — no slow cadences
    _intervals.push(setInterval(() => run('schedule.1h'),  intervalMs))
    _intervals.push(setInterval(() => run('schedule.6h'),  intervalMs))
    _intervals.push(setInterval(() => run('schedule.24h'), intervalMs))

    // Boot: fire all three triggers staggered to avoid a thundering herd
    setTimeout(() => run('schedule.1h'),   5_000)
    setTimeout(() => run('schedule.6h'),  15_000)
    setTimeout(() => run('schedule.24h'), 25_000)

    console.log('[HANUMANAS] Scheduler started — all 80 agents on 1h cadence')
  },

  stop(): void {
    _intervals.forEach(id => clearInterval(id))
    _intervals.length = 0
    started = false
    console.log('[HANUMANAS] Scheduler stopped by WAANDA directive')
  },

  configure(options: { intervalMs?: number }): void {
    if (options.intervalMs) {
      intervalMs = options.intervalMs
      console.log(`[HANUMANAS] Scheduler interval updated to ${intervalMs}ms by WAANDA directive`)
    }
  },
}
