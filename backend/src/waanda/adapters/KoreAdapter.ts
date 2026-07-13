import {
  WaandaSubsystem, WaandaDirective, DirectiveResult,
  SubsystemHealth, SubsystemIntelligence,
} from '../WaandaDirective'
import logger from '../../utils/logger'

let _twinCount      = 0
let _lastComputedAt: Date = new Date(0)

export function updateKoreTwinCount(count: number): void {
  _twinCount      = count
  _lastComputedAt = new Date()
}

export const KoreAdapter: WaandaSubsystem = {
  name: 'KORE',

  getHealth(): SubsystemHealth {
    return {
      subsystem:  'KORE',
      status:     'OPTIMAL',
      lastActive: _lastComputedAt,
      metrics:    { activeTwins: _twinCount },
    }
  },

  getIntelligence(): SubsystemIntelligence {
    return {
      subsystem:  'KORE',
      summary:    `Digital twin runtime operational — ${_twinCount} active twins`,
      health:     'OPTIMAL',
      lastActive: _lastComputedAt,
      metrics:    { activeTwins: _twinCount },
    }
  },

  async receiveDirective(directive: WaandaDirective): Promise<DirectiveResult> {
    logger.info(`[KORE:ADAPTER] Received directive: ${directive.type} — ${directive.reason ?? ''}`)

    switch (directive.type) {
      case 'FOCUS': {
        // Request a refresh for a specific entity type
        const entityType = directive.payload.entityType as string | undefined
        try {
          const { KimmpDigitalTwin } = await import('../../kangqore-immp/twin/kimmpTwin.service')
          await KimmpDigitalTwin.compute().catch(() => {})
        } catch {}
        return ok(directive, `Twin refresh triggered for: ${entityType ?? 'all'}`)
      }

      case 'REPORT':
        return ok(directive, `KORE state: ${_twinCount} active twins in registry`)

      case 'CONFIGURE':
      case 'ALIGN':
      case 'OVERRIDE':
        return ok(directive, `${directive.type} acknowledged`)

      default:
        return ok(directive, 'Acknowledged (no specific handler)')
    }
  },
}

function ok(d: WaandaDirective, detail: string): DirectiveResult {
  return { directiveId: d.id, subsystem: 'KORE', accepted: true, detail, resolvedAt: new Date() }
}
