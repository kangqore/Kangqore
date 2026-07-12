import {
  WaandaSubsystem, WaandaDirective, DirectiveResult,
  SubsystemHealth, SubsystemIntelligence,
} from '../WaandaDirective'
import { prisma } from '../../lib/prisma'
import logger     from '../../utils/logger'

// WAANDA-set focus segment — AlisAdminController reads this
let _focusSegment: string | null = null
let _lastEmitAt: Date = new Date(0)

export function notifyAlisSignalEmit(): void {
  _lastEmitAt = new Date()
}

export function getAlisFocusSegment(): string | null {
  return _focusSegment
}

export const AlisAdapter: WaandaSubsystem = {
  name: 'ALIS',

  getHealth(): SubsystemHealth {
    return {
      subsystem:  'ALIS',
      status:     'OPTIMAL',
      lastActive: _lastEmitAt,
      metrics:    { focusSegmentSet: _focusSegment ? 1 : 0 },
    }
  },

  getIntelligence(): SubsystemIntelligence {
    return {
      subsystem:  'ALIS',
      summary:    `Demand intelligence operational${_focusSegment ? ` — focused on: ${_focusSegment}` : ''}`,
      health:     'OPTIMAL',
      lastActive: _lastEmitAt,
      metrics:    { focusSegmentSet: _focusSegment ? 1 : 0 },
    }
  },

  async receiveDirective(directive: WaandaDirective): Promise<DirectiveResult> {
    logger.info(`[ALIS:ADAPTER] Received directive: ${directive.type} — ${directive.reason ?? ''}`)

    switch (directive.type) {
      case 'FOCUS': {
        _focusSegment = (directive.payload.segment as string) ?? null
        return ok(directive, `ALIS focus segment set to: ${_focusSegment ?? 'cleared'}`)
      }

      case 'ALIGN': {
        _focusSegment = (directive.payload.market as string) ?? _focusSegment
        return ok(directive, `ALIS aligned to market: ${_focusSegment ?? 'default'}`)
      }

      case 'REPORT': {
        const alertCount = await (prisma as any).kimmpSignal.count({
          where: {
            signalType: { contains: 'MARKET' },
            createdAt:  { gte: new Date(Date.now() - 24 * 3_600_000) },
          },
        }).catch(() => 0)
        return ok(directive, `24h market signals: ${alertCount}${_focusSegment ? ` | Focus: ${_focusSegment}` : ''}`)
      }

      case 'CONFIGURE':
      case 'OVERRIDE':
        return ok(directive, `${directive.type} acknowledged`)

      default:
        return ok(directive, 'Acknowledged (no specific handler)')
    }
  },
}

function ok(d: WaandaDirective, detail: string): DirectiveResult {
  return { directiveId: d.id, subsystem: 'ALIS', accepted: true, detail, resolvedAt: new Date() }
}
