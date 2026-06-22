// ---------------------------------------------------------------------------
// AEGIS Scheduler — fires schedule.1h / schedule.6h / schedule.24h cadences.
//
// Called once from backend/src/index.ts at server boot, after all routes are
// wired (mirrors the KIMMP LoopScheduler pattern).
// ---------------------------------------------------------------------------

import { AegisEngineDispatcher } from './aegisEngineDispatcher'

let started = false

function run(trigger: 'schedule.1h' | 'schedule.6h' | 'schedule.24h'): void {
  AegisEngineDispatcher.runTrigger(trigger, { userId: 'AEGIS_SCHEDULER' })
    .then(results => {
      const critical = results.filter(r => r.verdict === 'CRITICAL').length
      const warn     = results.filter(r => r.verdict === 'WARN').length
      console.log(`[AEGIS] ${trigger}: ${results.length} agents | CRITICAL:${critical} WARN:${warn}`)
    })
    .catch(err => console.error(`[AEGIS] ${trigger} scheduler error:`, err))
}

export const AegisScheduler = {
  start(): void {
    if (started) return
    started = true

    // 1h cadence — health + alerting agents
    setInterval(() => run('schedule.1h'), 60 * 60_000)

    // 6h cadence — coordination + workflow + escalation
    setInterval(() => run('schedule.6h'), 6 * 60 * 60_000)

    // 24h cadence — analytics + reporting
    setInterval(() => run('schedule.24h'), 24 * 60 * 60_000)

    // Boot: run 1h trigger immediately to populate first snapshot
    setTimeout(() => run('schedule.1h'),  5_000)
    // Stagger the 6h run 30s after boot
    setTimeout(() => run('schedule.6h'),  30_000)

    console.log('[AEGIS] Scheduler started — cadences: 1h / 6h / 24h')
  },
}
