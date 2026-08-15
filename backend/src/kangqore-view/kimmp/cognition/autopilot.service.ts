// ---------------------------------------------------------------------------
// Phase 6.8 — Autonomous Enterprise (Autopilot)
// Default mode: SUPERVISED (WAANDA proposes, CEO approves).
// AUTONOMOUS mode requires: ETI > 80 + explicit CEO unlock.
// Constitutional Invariant 6: all autopilot actions are logged immutably.
// ---------------------------------------------------------------------------

import { prisma }             from '../../../lib/prisma';
import { sonnet, textOf }     from '../llm/kimmpLLMRouter';
import { TrustEngine }        from './trustEngine';
import { IntentAlignmentService } from '../command-center/intentAlignment.service';
import { KimmpProactiveEngine }   from '../proactive/kimmpProactive.service';

export interface AutopilotAction {
  id:           string;
  action:       string;
  rationale:    string;
  targetModule: 'Decisions' | 'Goals' | 'CRM' | 'Projects' | 'Finance' | 'Operations' | 'Intelligence';
  targetId?:    string;
  proposedAt:   string;
  approvedAt?:  string;
  rejectedAt?:  string;
  outcome?:     string;
}

export interface AutopilotMissionInput {
  intentId?:   string;
  objectiveId?: string;
  title:       string;
  mode?:       'SUPERVISED' | 'AUTONOMOUS';
}

export interface TickResult {
  missionId: string;
  title:     string;
  action:    string;
  rationale: string;
  mode:      string;
  proposed:  boolean;
  executed:  boolean;
}

const SYSTEM_TICK =
  'You are WAANDA, the enterprise autopilot. Given a mission objective and current enterprise context, ' +
  'identify the single highest-impact action to take right now. ' +
  'Reply in JSON: {"action":"...(one clear action)","rationale":"...(one sentence why)"}. ' +
  'No markdown.';

async function canRunAutonomous(): Promise<boolean> {
  // WAANDA conservative mode blocks autonomous actions when ETI has dropped below safe threshold
  try {
    const conservativeFlag = await (prisma as any).kimmpFlag?.findFirst({ where: { key: 'WAANDA_CONSERVATIVE_MODE', value: 'true' } });
    if (conservativeFlag) return false;
  } catch { /* non-fatal */ }
  const eti = await TrustEngine.getETI().catch(() => null);
  if (!eti || eti.overall < 80) return false;
  // Check explicit CEO unlock flag
  try {
    const flag = await (prisma as any).kimmpFlag?.findFirst({ where: { key: 'AUTOPILOT_AUTONOMOUS_ENABLED', value: 'true' } });
    return !!flag;
  } catch { return false; }
}

export class AutopilotService {
  static async createMission(input: AutopilotMissionInput): Promise<any> {
    return (prisma as any).autopilotMission.create({
      data: {
        intentId:    input.intentId    ?? null,
        objectiveId: input.objectiveId ?? null,
        title:       input.title,
        mode:        input.mode ?? 'SUPERVISED',
        actions:     [],
        status:      'ACTIVE',
      },
    });
  }

  static async updateMission(id: string, updates: { status?: string; mode?: string }): Promise<any> {
    // Guard: autonomous mode requires ETI > 80
    if (updates.mode === 'AUTONOMOUS' && !(await canRunAutonomous())) {
      throw new Error('AUTONOMOUS mode requires ETI > 80 and CEO unlock flag. Current ETI is below threshold.');
    }
    return (prisma as any).autopilotMission.update({ where: { id }, data: updates });
  }

  static async listMissions(): Promise<any[]> {
    return (prisma as any).autopilotMission.findMany({
      where:   { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async tick(): Promise<TickResult[]> {
    const missions: any[] = await (prisma as any).autopilotMission.findMany({
      where: { status: 'ACTIVE' },
    });

    const results: TickResult[] = [];

    for (const mission of missions) {
      try {
        // Gather context: proactive alerts + active intents
        const [alerts, intents] = await Promise.all([
          KimmpProactiveEngine.scan().catch(() => []),
          IntentAlignmentService.getActive().catch(() => []),
        ]);

        const contextStr = [
          `Mission: ${mission.title}`,
          `Active intents: ${intents.slice(0, 3).map((i: any) => i.label).join(', ') || 'none'}`,
          `Alerts: ${alerts.slice(0, 3).map((a: any) => a.message ?? a.title).join(', ') || 'none'}`,
        ].join('\n');

        const res    = await sonnet(SYSTEM_TICK, contextStr, 100, { hint: 'autopilot-tick' });
        const parsed = JSON.parse(textOf(res).trim());
        const action   = parsed.action   ?? 'Review mission status.';
        const rationale = parsed.rationale ?? 'Routine mission progression.';

        const isAutonomous = mission.mode === 'AUTONOMOUS' && await canRunAutonomous();

        const typedAction: AutopilotAction = {
          id:           `act_${Date.now()}`,
          action,
          rationale,
          targetModule: 'Decisions',
          proposedAt:   new Date().toISOString(),
          ...(isAutonomous ? { approvedAt: new Date().toISOString() } : {}),
        };

        // Log the action immutably
        await (prisma as any).autopilotLog.create({
          data: {
            missionId: mission.id,
            action,
            rationale,
            approved:  isAutonomous ? true : null,
          },
        });

        // Append typed action to mission's action queue
        const existing: AutopilotAction[] = Array.isArray(mission.actions) ? mission.actions as AutopilotAction[] : [];
        await (prisma as any).autopilotMission.update({
          where: { id: mission.id },
          data:  { lastTickAt: new Date(), actions: [...existing.slice(-19), typedAction] },
        });

        results.push({
          missionId: mission.id,
          title:     mission.title,
          action,
          rationale,
          mode:      mission.mode,
          proposed:  !isAutonomous,
          executed:  isAutonomous,
        });
      } catch { /* mission tick failure is isolated */ }
    }

    return results;
  }

  static async getLog(missionId?: string, limit = 20): Promise<any[]> {
    return (prisma as any).autopilotLog.findMany({
      where:   missionId ? { missionId } : {},
      orderBy: { createdAt: 'desc' },
      take:    limit,
    });
  }
}
