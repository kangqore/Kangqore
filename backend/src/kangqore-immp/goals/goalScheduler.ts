import logger from '../../utils/logger'
import { KimmpGoalEngine } from './kimmpGoal.service'

export class GoalScheduler {
  private static timer: ReturnType<typeof setInterval> | null = null
  private static started = false

  static start(): void {
    if (this.started || !process.env.ANTHROPIC_API_KEY) return
    this.started = true

    // Initial tick after 90s (staggered after Scout's 45s*6=270s)
    setTimeout(() => {
      KimmpGoalEngine.tick().catch(err => logger.warn('[KIMMP:GOALS] Initial tick failed:', err.message))
    }, 90_000)

    // Then every 30 minutes
    this.timer = setInterval(() => {
      KimmpGoalEngine.tick().catch(err => logger.warn('[KIMMP:GOALS] Tick failed:', err.message))
    }, 30 * 60_000)

    logger.info('[KIMMP:GOALS] Scheduler armed — ticking every 30 minutes')
  }

  static stop(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null }
    this.started = false
  }
}
