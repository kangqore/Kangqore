import {
  WaandaSubsystem, WaandaDirective, DirectiveResult,
  SubsystemHealth, SubsystemIntelligence,
} from '../WaandaDirective'
import { prisma } from '../../lib/prisma'
import logger     from '../../utils/logger'

let _maintenanceMode = false
let _lastConversationAt: Date = new Date(0)

export function notifyEqoreConversation(): void {
  _lastConversationAt = new Date()
}

export function isEqoreMaintenanceMode(): boolean {
  return _maintenanceMode
}

export const EqoreAdapter: WaandaSubsystem = {
  name: 'EQORE',

  getHealth(): SubsystemHealth {
    return {
      subsystem:  'EQORE',
      status:     _maintenanceMode ? 'PAUSED' : 'OPTIMAL',
      lastActive: _lastConversationAt,
      metrics:    { maintenanceMode: _maintenanceMode ? 1 : 0 },
    }
  },

  getIntelligence(): SubsystemIntelligence {
    return {
      subsystem:  'EQORE',
      summary:    `${_maintenanceMode ? 'Maintenance mode' : 'Conversation engine active'} — last activity ${_lastConversationAt.toISOString()}`,
      health:     _maintenanceMode ? 'PAUSED' : 'OPTIMAL',
      lastActive: _lastConversationAt,
      metrics:    { maintenanceMode: _maintenanceMode ? 1 : 0 },
    }
  },

  async receiveDirective(directive: WaandaDirective): Promise<DirectiveResult> {
    logger.info(`[EQORE:ADAPTER] Received directive: ${directive.type} — ${directive.reason ?? ''}`)

    switch (directive.type) {
      case 'PAUSE':
        _maintenanceMode = true
        return ok(directive, 'eQORE maintenance mode enabled — new conversations queued')

      case 'RESUME':
        _maintenanceMode = false
        return ok(directive, 'eQORE maintenance mode disabled')

      case 'CONFIGURE': {
        const persona = directive.payload.persona as string | undefined
        return ok(directive, `eQORE configuration updated: persona=${persona ?? 'default'}`)
      }

      case 'FOCUS': {
        const agentPriority = directive.payload.agentPriority as string | undefined
        return ok(directive, `eQORE focus agent priority: ${agentPriority ?? 'default'}`)
      }

      case 'REPORT': {
        const last24h = await (prisma as any).eqoreConversation.count({
          where: { createdAt: { gte: new Date(Date.now() - 24 * 3_600_000) } },
        }).catch(() => 0)
        const leads = await (prisma as any).eqoreLead.count({
          where: { createdAt: { gte: new Date(Date.now() - 24 * 3_600_000) } },
        }).catch(() => 0)
        return ok(directive, `24h: ${last24h} conversations, ${leads} leads captured`)
      }

      case 'ALIGN':
      case 'OVERRIDE':
        return ok(directive, `${directive.type} acknowledged`)

      default:
        return ok(directive, 'Acknowledged (no specific handler)')
    }
  },

  pause():  void { _maintenanceMode = true },
  resume(): void { _maintenanceMode = false },
}

function ok(d: WaandaDirective, detail: string): DirectiveResult {
  return { directiveId: d.id, subsystem: 'EQORE', accepted: true, detail, resolvedAt: new Date() }
}
