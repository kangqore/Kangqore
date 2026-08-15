import {
  WaandaSubsystem, WaandaDirective, DirectiveResult,
  SubsystemHealth, SubsystemIntelligence,
} from '../WaandaDirective'
import { prisma } from '../../../lib/prisma'
import logger     from '../../../utils/logger'

let _lastMissionAt: Date = new Date(0)
let _missionCount = 0

export function notifyKeosMissionRun(): void {
  _lastMissionAt = new Date()
  _missionCount++
}

export const KeosAdapter: WaandaSubsystem = {
  name: 'KEOS',

  getHealth(): SubsystemHealth {
    return {
      subsystem:  'KEOS',
      status:     'OPTIMAL',
      lastActive: _lastMissionAt,
      metrics:    { missionsRun: _missionCount },
    }
  },

  getIntelligence(): SubsystemIntelligence {
    return {
      subsystem:  'KEOS',
      summary:    `Mission kernel operational — ${_missionCount} missions dispatched`,
      health:     'OPTIMAL',
      lastActive: _lastMissionAt,
      metrics:    { missionsRun: _missionCount },
    }
  },

  async receiveDirective(directive: WaandaDirective): Promise<DirectiveResult> {
    logger.info(`[KEOS:ADAPTER] Received directive: ${directive.type} — ${directive.reason ?? ''}`)

    switch (directive.type) {
      case 'REPORT': {
        // Count missions by status
        const running   = await (prisma as any).mission.count({ where: { status: 'InProgress' } }).catch(() => 0)
        const completed = await (prisma as any).mission.count({ where: { status: 'Completed'  } }).catch(() => 0)
        const failed    = await (prisma as any).mission.count({ where: { status: 'Failed'     } }).catch(() => 0)
        return ok(directive, `Missions: ${running} running, ${completed} completed, ${failed} failed`)
      }

      case 'FOCUS': {
        const capability = directive.payload.capability as string | undefined
        return ok(directive, `KEOS focus capability noted: ${capability ?? 'unspecified'}`)
      }

      case 'ALIGN':
      case 'CONFIGURE':
      case 'OVERRIDE':
        return ok(directive, `${directive.type} acknowledged`)

      default:
        return ok(directive, 'Acknowledged (no specific handler)')
    }
  },
}

function ok(d: WaandaDirective, detail: string): DirectiveResult {
  return { directiveId: d.id, subsystem: 'KEOS', accepted: true, detail, resolvedAt: new Date() }
}
