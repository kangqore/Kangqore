import {
  WaandaSubsystem, WaandaDirective, DirectiveResult,
  SubsystemHealth, SubsystemIntelligence,
} from '../WaandaDirective'
import { LoopScheduler } from '../../kangqore-immp/agents/loopScheduler'
import { prisma }        from '../../lib/prisma'
import logger            from '../../utils/logger'

export const KimmpAdapter: WaandaSubsystem = {
  name: 'KIMMP',

  getHealth(): SubsystemHealth {
    const lastRun = LoopScheduler.lastRun()
    const paused  = LoopScheduler.isPaused()
    const started = LoopScheduler.isStarted()
    let status: SubsystemHealth['status']
    if (paused)       status = 'PAUSED'
    else if (started) status = 'OPTIMAL'
    else              status = 'DEGRADED'
    return {
      subsystem:  'KIMMP',
      status,
      lastActive: lastRun ?? new Date(0),
      metrics:    { loopStarted: started ? 1 : 0, loopPaused: paused ? 1 : 0 },
    }
  },

  getIntelligence(): SubsystemIntelligence {
    const lastRun    = LoopScheduler.lastRun()
    const paused     = LoopScheduler.isPaused()
    const started    = LoopScheduler.isStarted()
    const sevenHours = 7 * 3_600_000
    const idle       = lastRun ? Date.now() - lastRun.getTime() > sevenHours : true
    const lastRunSuffix = lastRun ? ` — last run ${lastRun.toISOString()}` : ' — not yet run'
    let loopState: string
    if (paused)       loopState = 'paused by WAANDA directive'
    else if (started) loopState = 'running'
    else              loopState = 'stopped'
    let health: SubsystemHealth['status']
    if (paused)       health = 'PAUSED'
    else if (started) health = 'OPTIMAL'
    else              health = 'DEGRADED'
    let topSignal: string | undefined
    if (paused)            topSignal = 'KIMMP paused by WAANDA directive — awaiting RESUME'
    else if (idle && started) topSignal = 'Loop idle >7h — next cycle pending'
    const loopRunning = started && !paused ? 1 : 0
    return {
      subsystem:  'KIMMP',
      summary:    `Cognitive loop ${loopState}${lastRunSuffix}`,
      topSignal,
      health,
      lastActive: lastRun ?? new Date(0),
      metrics:    { loopRunning, loopPaused: paused ? 1 : 0 },
    }
  },

  async receiveDirective(directive: WaandaDirective): Promise<DirectiveResult> {
    logger.info(`[KIMMP:ADAPTER] Received directive: ${directive.type} — ${directive.reason ?? ''}`)

    switch (directive.type) {
      case 'PAUSE':
        LoopScheduler.pause()
        return ok(directive, 'Loop paused by WAANDA directive')

      case 'RESUME':
        LoopScheduler.resume()
        await (prisma as any).kimmpFlag.deleteMany({ where: { key: 'WAANDA_CONSERVATIVE_MODE' } }).catch(() => {})
        return ok(directive, 'Loop resumed — conservative mode cleared')

      case 'FOCUS': {
        // Store focus domain in KimmpFlag for next loop cycle to read
        const domain = directive.payload.domain as string | undefined
        if (domain) {
          await (prisma as any).kimmpFlag.upsert({
            where:  { key: 'WAANDA_FOCUS_DOMAIN' },
            update: { value: domain, reason: directive.reason ?? null },
            create: { key: 'WAANDA_FOCUS_DOMAIN', value: domain, setBy: 'WAANDA', reason: directive.reason ?? null },
          }).catch(() => {})
        }
        return ok(directive, `Focus set to domain: ${domain ?? 'unspecified'}`)
      }

      case 'CONFIGURE': {
        // ETI fell — engage conservative mode
        if (directive.payload.criticalThresholdRaised) {
          await (prisma as any).kimmpFlag.upsert({
            where:  { key: 'WAANDA_CONSERVATIVE_MODE' },
            update: { value: 'true', reason: directive.reason ?? null },
            create: { key: 'WAANDA_CONSERVATIVE_MODE', value: 'true', setBy: 'WAANDA', reason: directive.reason ?? null },
          }).catch(() => {})
          return ok(directive, `KIMMP entering conservative mode — autonomous actions suspended (ETI: ${directive.payload.etiScore})`)
        }
        // ETI recovered — clear conservative mode without touching loop state
        if (directive.payload.conservativeModeCleared) {
          await (prisma as any).kimmpFlag.deleteMany({ where: { key: 'WAANDA_CONSERVATIVE_MODE' } }).catch(() => {})
          return ok(directive, `Conservative mode lifted — ETI recovered to ${directive.payload.etiScore}`)
        }
        return ok(directive, 'CONFIGURE acknowledged')
      }

      case 'ALIGN':
      case 'OVERRIDE':
        return ok(directive, `${directive.type} acknowledged`)

      case 'REPORT': {
        const signalCount = await (prisma as any).kimmpSignal.count({
          where: { createdAt: { gte: new Date(Date.now() - 24 * 3_600_000) } },
        }).catch(() => 0)
        const decisionCount = await (prisma as any).kimmpDecision.count({
          where: { status: 'PROPOSED' },
        }).catch(() => 0)
        return ok(directive, `24h signals: ${signalCount}, proposed decisions: ${decisionCount}`)
      }

      default:
        return ok(directive, 'Acknowledged (no specific handler)')
    }
  },

  pause():  void { LoopScheduler.pause() },
  resume(): void { LoopScheduler.resume() },
}

function ok(d: WaandaDirective, detail: string): DirectiveResult {
  return { directiveId: d.id, subsystem: 'KIMMP', accepted: true, detail, resolvedAt: new Date() }
}
