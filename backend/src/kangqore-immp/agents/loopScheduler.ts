import { KimmpSystemDispatcher } from './systemDispatcher'
import logger from '../../utils/logger'

// Default: run LOOPS cascade once every 6 hours.
// Override via KIMMP_LOOP_CADENCE_HOURS env var.
const CADENCE_HOURS = Math.max(1, Number(process.env.KIMMP_LOOP_CADENCE_HOURS ?? 6))

export class LoopScheduler {
  private static timer: ReturnType<typeof setInterval> | null = null
  private static started = false

  static start(): void {
    if (this.started) return
    if (!process.env.ANTHROPIC_API_KEY) {
      logger.warn('[KIMMP:LOOPS] Scheduler skipped — ANTHROPIC_API_KEY not set')
      return
    }
    this.started = true

    // First run: 3 min after boot — let Scout/Twin/Proactive initialise first
    setTimeout(async () => {
      logger.info('[KIMMP:LOOPS] Scheduled cascade starting (boot trigger)')
      await KimmpSystemDispatcher.triggerLoop({
        trigger: 'schedule.boot',
        input:   'Scheduled intelligence sweep — synthesise all system signals.',
        userId:  'SCHEDULER',
      }).catch(err => logger.warn(`[KIMMP:LOOPS] Boot cascade failed: ${err.message}`))

      // Then run on cadence
      LoopScheduler.timer = setInterval(async () => {
        logger.info(`[KIMMP:LOOPS] Scheduled cascade starting (every ${CADENCE_HOURS}h)`)
        await KimmpSystemDispatcher.triggerLoop({
          trigger: 'schedule.daily',
          input:   'Scheduled intelligence sweep — synthesise all system signals.',
          userId:  'SCHEDULER',
        }).catch(err => logger.warn(`[KIMMP:LOOPS] Scheduled cascade failed: ${err.message}`))
      }, CADENCE_HOURS * 60 * 60_000)

    }, 3 * 60_000)

    logger.info(`[KIMMP:LOOPS] Scheduler armed — first run in 3 min, then every ${CADENCE_HOURS}h`)
  }

  static stop(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null }
    this.started = false
    logger.info('[KIMMP:LOOPS] Scheduler stopped')
  }
}
