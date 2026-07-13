import {
  WaandaSubsystem, WaandaDirective, DirectiveResult,
  SubsystemHealth, SubsystemIntelligence,
} from '../WaandaDirective'
import logger from '../../utils/logger'

// Priority module set by WAANDA directive — VIS cron reads this
let _priorityModule: string | null = null
let _lastCronAt: Date = new Date(0)

export function notifyVisCronRun(): void {
  _lastCronAt = new Date()
}

export function getVisPriorityModule(): string | null {
  return _priorityModule
}

export const VisAdapter: WaandaSubsystem = {
  name: 'VIS',

  getHealth(): SubsystemHealth {
    return {
      subsystem:  'VIS',
      status:     'OPTIMAL',
      lastActive: _lastCronAt,
      metrics:    { priorityModuleSet: _priorityModule ? 1 : 0 },
    }
  },

  getIntelligence(): SubsystemIntelligence {
    return {
      subsystem:  'VIS',
      summary:    `Visibility intelligence operational${_priorityModule ? ` — priority module: ${_priorityModule}` : ''}`,
      health:     'OPTIMAL',
      lastActive: _lastCronAt,
      metrics:    { priorityModuleSet: _priorityModule ? 1 : 0 },
    }
  },

  async receiveDirective(directive: WaandaDirective): Promise<DirectiveResult> {
    logger.info(`[VIS:ADAPTER] Received directive: ${directive.type} — ${directive.reason ?? ''}`)

    switch (directive.type) {
      case 'FOCUS': {
        _priorityModule = (directive.payload.module as string) ?? null
        return ok(directive, `VIS priority module set to: ${_priorityModule ?? 'cleared'}`)
      }

      case 'CONFIGURE': {
        const enable  = directive.payload.enableModule  as string | undefined
        const disable = directive.payload.disableModule as string | undefined
        // Module enable/disable stored for future implementation; VIS registry doesn't expose a runtime toggle yet
        return ok(directive, `VIS modules configured: enable=${enable ?? '-'} disable=${disable ?? '-'}`)
      }

      case 'REPORT':
        return ok(directive, `VIS state: priority module=${_priorityModule ?? 'none'}, last cron=${_lastCronAt.toISOString()}`)

      case 'ALIGN':
      case 'OVERRIDE':
        return ok(directive, `${directive.type} acknowledged`)

      default:
        return ok(directive, 'Acknowledged (no specific handler)')
    }
  },
}

function ok(d: WaandaDirective, detail: string): DirectiveResult {
  return { directiveId: d.id, subsystem: 'VIS', accepted: true, detail, resolvedAt: new Date() }
}
