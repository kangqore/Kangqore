// KIMMP Learning Scheduler — runs the self-growth cycle automatically.
// Cadence: weekly (every 7 days). Boot: first run 60s after server start
// so initial decisions/dispatches are mined immediately.

import { runLearningCycle } from './kimmpLearning.service'
import logger from '../../../utils/logger'

let started = false

export const KIMMLearningScheduler = {
  start(): void {
    if (started) return
    started = true

    // Boot run — mine whatever exists right now
    setTimeout(() => {
      runLearningCycle('boot').catch(err =>
        logger.error('[KIMMP Learning Scheduler] Boot run error:', err)
      )
    }, 60_000)

    // Weekly cycle
    setInterval(() => {
      runLearningCycle('scheduled').catch(err =>
        logger.error('[KIMMP Learning Scheduler] Scheduled run error:', err)
      )
    }, 7 * 24 * 60 * 60_000)

    logger.info('[KIMMP Learning Scheduler] Started — boot run in 60s, weekly cadence')
  },
}
