import { KimmpDigitalTwin } from './kimmpTwin.service'
import logger from '../../../utils/logger'

function notifyKoreAfterCompute(): void {
  import('../../../waanda/adapters/KoreAdapter')
    .then(({ updateKoreTwinCount }) => updateKoreTwinCount(1))
    .catch(() => {})
}

export class TwinScheduler {
  static start() {
    if (!process.env.DATABASE_URL) return

    // 150s delay at boot (after Scout/Goal/Proactive start), then every 30 min
    setTimeout(() => {
      KimmpDigitalTwin.compute()
        .then(notifyKoreAfterCompute)
        .catch(err => logger.warn(`[KIMMP:TWIN] Boot compute failed: ${err.message}`))
      setInterval(() => {
        KimmpDigitalTwin.compute()
          .then(notifyKoreAfterCompute)
          .catch(err => logger.warn(`[KIMMP:TWIN] Scheduled compute failed: ${err.message}`))
      }, 30 * 60_000)
    }, 150_000)

    logger.info('[KIMMP:TWIN] Scheduler registered — first compute in 150s')
  }
}
