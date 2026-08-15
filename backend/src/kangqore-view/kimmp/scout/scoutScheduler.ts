import logger from '../../../utils/logger'
import { KimmpScoutService, SCOUT_SOURCES } from './kimmpScout.service'

export class ScoutScheduler {
  private static timers: ReturnType<typeof setInterval>[] = []
  private static started = false

  static start(): void {
    // Don't start if no API key or already started
    if (this.started) return
    if (!process.env.ANTHROPIC_API_KEY) {
      logger.warn('[KIMMP:SCOUT] Scheduler skipped — ANTHROPIC_API_KEY not set')
      return
    }
    this.started = true

    SCOUT_SOURCES.forEach((source, idx) => {
      // Stagger initial runs 15s apart — short enough to boot quickly, long enough to avoid API burst
      const delay = (idx + 1) * 15_000

      setTimeout(async () => {
        logger.info(`[KIMMP:SCOUT] Initial scan: ${source.name}`)
        await KimmpScoutService.runSource(source).catch(err =>
          logger.warn(`[KIMMP:SCOUT] Initial scan failed (${source.name}): ${err.message}`)
        )

        // Then run on cadence
        const timer = setInterval(async () => {
          logger.info(`[KIMMP:SCOUT] Scheduled scan: ${source.name}`)
          await KimmpScoutService.runSource(source).catch(err =>
            logger.warn(`[KIMMP:SCOUT] Scheduled scan failed (${source.name}): ${err.message}`)
          )
        }, source.cadenceMinutes * 60_000)

        this.timers.push(timer)
      }, delay)
    })

    logger.info(`[KIMMP:SCOUT] Scheduler armed — ${SCOUT_SOURCES.length} sources, staggered startup`)
  }

  static stop(): void {
    this.timers.forEach(t => clearInterval(t))
    this.timers = []
    this.started = false
    logger.info('[KIMMP:SCOUT] Scheduler stopped')
  }
}
