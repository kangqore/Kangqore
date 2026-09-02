import {
  WaandaSubsystem, WaandaDirective, DirectiveResult,
  SubsystemHealth, SubsystemIntelligence,
} from '../WaandaDirective'
import { AegisScheduler } from '../../esf/aegis'
import logger             from '../../../utils/logger'

// Track last known verdict counts (updated by the scheduler on each run)
let _lastVerdicts = { clear: 0, warn: 0, critical: 0 }
let _lastRunAt: Date = new Date(0)
let _paused    = false

export function updateAegisVerdicts(counts: { clear: number; warn: number; critical: number }): void {
  _lastVerdicts = counts
  _lastRunAt    = new Date()
}

export const AegisAdapter: WaandaSubsystem = {
  name: 'AEGIS',

  getHealth(): SubsystemHealth {
    return {
      subsystem:  'AEGIS',
      status:     _paused ? 'PAUSED' : 'OPTIMAL',
      lastActive: _lastRunAt,
      metrics: {
        clear:    _lastVerdicts.clear,
        warn:     _lastVerdicts.warn,
        critical: _lastVerdicts.critical,
      },
    }
  },

  getIntelligence(): SubsystemIntelligence {
    const { clear, warn, critical } = _lastVerdicts
    return {
      subsystem:  'AEGIS',
      summary:    `${_paused ? 'PAUSED' : 'Running'} — last cycle: ${clear} clear, ${warn} warn, ${critical} critical`,
      topSignal:  critical > 0 ? `${critical} CRITICAL verdict(s) in last AEGIS cycle` : undefined,
      health:     _paused ? 'PAUSED' : critical > 0 ? 'DEGRADED' : 'OPTIMAL',
      lastActive: _lastRunAt,
      metrics:    { clear, warn, critical },
    }
  },

  async receiveDirective(directive: WaandaDirective): Promise<DirectiveResult> {
    logger.info(`[AEGIS:ADAPTER] Received directive: ${directive.type} — ${directive.reason ?? ''}`)

    switch (directive.type) {
      case 'PAUSE':
        AegisScheduler.stop()
        _paused = true
        return ok(directive, 'AEGIS scheduler suspended by WAANDA directive')

      case 'RESUME':
        AegisScheduler.start()
        _paused = false
        return ok(directive, 'AEGIS scheduler resumed by WAANDA directive')

      case 'CONFIGURE': {
        // AEGIS configuration override (e.g., interval, thresholds)
        const interval = directive.payload.intervalMs as number | undefined
        if (interval) {
          AegisScheduler.configure({ intervalMs: interval })
        }
        return ok(directive, `AEGIS configured: ${JSON.stringify(directive.payload)}`)
      }

      case 'REPORT':
        return ok(directive,
          `AEGIS state: ${_paused ? 'PAUSED' : 'RUNNING'} | ` +
          `Last verdicts: clear=${_lastVerdicts.clear} warn=${_lastVerdicts.warn} critical=${_lastVerdicts.critical}`
        )

      case 'ALIGN':
      case 'FOCUS':
      case 'OVERRIDE':
        return ok(directive, `${directive.type} acknowledged`)

      default:
        return ok(directive, 'Acknowledged (no specific handler)')
    }
  },

  pause():  void { AegisScheduler.stop();  _paused = true },
  resume(): void { AegisScheduler.start(); _paused = false },
}

function ok(d: WaandaDirective, detail: string): DirectiveResult {
  return { directiveId: d.id, subsystem: 'AEGIS', accepted: true, detail, resolvedAt: new Date() }
}
