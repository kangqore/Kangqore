import logger from '../../../utils/logger'
import { KimmpProactiveEngine } from './kimmpProactive.service'

export class ProactiveScheduler {
  private static timer: ReturnType<typeof setInterval> | null = null
  private static started = false

  static start(): void {
    if (this.started) return
    this.started = true

    // Initial scan after 2 minutes (after Scout + Goal schedulers settle)
    setTimeout(() => {
      KimmpProactiveEngine.scan().catch(err =>
        logger.warn('[KIMMP:PROACTIVE] Initial scan failed:', err.message)
      )
    }, 120_000)

    // Every 15 minutes thereafter
    this.timer = setInterval(() => {
      KimmpProactiveEngine.scan().catch(err =>
        logger.warn('[KIMMP:PROACTIVE] Scheduled scan failed:', err.message)
      )
    }, 15 * 60_000)

    logger.info('[KIMMP:PROACTIVE] Scheduler armed — scanning every 15 minutes')
  }

  static stop(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null }
    this.started = false
  }
}
