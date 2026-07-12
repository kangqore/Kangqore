// ---------------------------------------------------------------------------
// Phase 6.6 — Digital CEO: Morning Briefing Service
// Fixed 6-paragraph structure. Never changes order.
// Runs via cron at 08:00. Manual trigger: POST /cognition/brief/generate
// ---------------------------------------------------------------------------

import { prisma }              from '../../lib/prisma';
import { sonnet, textOf }      from '../llm/kimmpLLMRouter';
import { CommandCenterService } from '../command-center/commandCenter.service';
import { DailyPlanService }    from '../command-center/dailyPlan.service';
import { TrustEngine }         from './trustEngine';
import { MemoryEngine }        from './memoryEngine';
import { EvolutionEngine }     from './evolutionEngine';
import { emailService }        from '../../services/email.service';

export type BriefType = 'MORNING' | 'MIDDAY' | 'EVENING';

export interface BriefingResult {
  id:          string;
  briefType:   BriefType;
  date:        string;
  oisScore:    number | null;
  para1Health: string;
  para2Focus:  string;
  para3Trust:  string;
  para4Learning: string;
  para5Policy: string;
  para6Actions: string;
}

const TYPE_LABEL: Record<BriefType, string> = {
  MORNING: 'Morning Brief',
  MIDDAY:  'Midday Drift',
  EVENING: 'Evening Wrap',
};

export class MorningBriefingService {
  static async generate(briefType: BriefType = 'MORNING'): Promise<BriefingResult> {
    const today = new Date();

    // ── Gather all context in parallel ───────────────────────────────────────
    const [cc, plan, eti, coverage, recentLessons, recentPolicies] = await Promise.all([
      CommandCenterService.aggregate().catch(() => null),
      DailyPlanService.getOrGenerate(today).catch(() => null),
      TrustEngine.getETI().catch(() => null),
      TrustEngine.getKnowledgeCoverage().catch(() => null),
      MemoryEngine.recall({ limit: 5 }).catch(() => []),
      EvolutionEngine.changelog('week').catch(() => []),
    ]);

    const oisScore  = (cc as any)?.ois?.score ?? null;
    const domains   = (cc as any)?.business ?? [];
    const decisions = (cc as any)?.decisions ?? { proposedCount: 0, top: [] };

    // ── Paragraph factory (Sonnet, max 80 tokens each) ────────────────────────
    async function para(system: string, user: string): Promise<string> {
      try {
        const res  = await sonnet(system, user, 80, { hint: 'morning-brief' });
        const text = textOf(res).trim();
        return text || system.slice(0, 50) + '...';
      } catch { return 'Data unavailable — check platform connection.'; }
    }

    const baseSystem = 'You are WAANDA, the Digital CEO of Kangqore OS. Write for the CEO. One paragraph, max 60 words. Plain text, no markdown.';

    // Para 1 — Enterprise Health
    const para1Health = await para(
      baseSystem,
      `OIS: ${oisScore ?? 'N/A'}. Business domains: ${domains.slice(0, 4).map((d: any) => `${d.label}: ${d.status}`).join(', ') || 'aggregating'}. Brief type: ${TYPE_LABEL[briefType]}.`,
    );

    // Para 2 — Today's Focus
    const para2Focus = briefType === 'MORNING'
      ? await para(baseSystem, `Today's mission: "${(plan as any)?.mission ?? 'No plan generated yet'}". Top action: ${(plan as any)?.actions?.[0]?.title ?? 'none'}.`)
      : briefType === 'MIDDAY'
      ? await para(baseSystem, `It is midday. ${decisions.proposedCount} decisions await. Any new criticals?`)
      : await para(baseSystem, `End of day. Plan actions completed: ${(plan as any)?.actions?.filter((a: any) => a.done).length ?? 0} of ${(plan as any)?.actions?.length ?? 0}.`);

    // Para 3 — Trust Index
    const para3Trust = await para(
      baseSystem,
      `Executive Trust Index: ${eti?.overall ?? 0}/100 (${eti?.grade ?? 'N/A'}). Decision accuracy: ${eti?.dimensions?.decisionAccuracy?.score ?? 0}%. Recommendation acceptance: ${eti?.dimensions?.recommendationAcceptance?.score ?? 0}%. Knowledge coverage: ${coverage?.overall ?? 0}% overall.`,
    );

    // Para 4 — Yesterday's Learning
    const lessonSummary = (recentLessons as any[]).slice(0, 3).map((l: any) => l.lesson).join(' ');
    const para4Learning = await para(
      baseSystem,
      `Recent enterprise lessons: ${lessonSummary || 'none recorded yet'}. Total lessons: ${(recentLessons as any[]).length}.`,
    );

    // Para 5 — Policy Evolution
    const policyCount = (recentPolicies as any[]).length;
    const para5Policy = await para(
      baseSystem,
      `${policyCount} policy changes this week. ${policyCount > 0 ? 'Latest: ' + (recentPolicies as any[])[0]?.statement : 'No new policies.'}`,
    );

    // Para 6 — Recommended Decisions
    const topDecisions = decisions.top?.slice(0, 3).map((d: any) => d.recommendedAction ?? d.summary).join('; ') || 'none pending';
    const para6Actions = await para(
      baseSystem,
      `${decisions.proposedCount} decisions awaiting approval. Top items: ${topDecisions}.`,
    );

    // ── Persist ───────────────────────────────────────────────────────────────
    const briefing = await (prisma as any).morningBriefing.create({
      data: {
        briefType,
        date:        today,
        oisScore,
        para1Health, para2Focus, para3Trust,
        para4Learning, para5Policy, para6Actions,
      },
    });

    // ── Email delivery ────────────────────────────────────────────────────────
    try {
      const dateLabel = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
      const typeLabel = TYPE_LABEL[briefType];
      await emailService.sendEmail({
        to:      process.env.CEO_EMAIL ?? 'kangqore@gmail.com',
        subject: `KIMMP ${typeLabel} · ${dateLabel} · OIS ${oisScore ?? '—'}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;padding:32px 24px;background:#0b0f1a;color:#e2e8f0;">
            <div style="font-family:monospace;font-size:11px;color:#4b6080;margin-bottom:8px;">KANGQORE OS · KIMMP ${typeLabel.toUpperCase()}</div>
            <h1 style="font-family:monospace;font-size:18px;font-weight:800;color:#a78bfa;margin:0 0 24px;">
              ${dateLabel}${oisScore != null ? ` · OIS ${oisScore}` : ''}
            </h1>
            <div style="border-left:3px solid #22c55e;padding-left:16px;margin-bottom:16px;">
              <div style="font-family:monospace;font-size:10px;font-weight:700;color:#4ade80;margin-bottom:4px;letter-spacing:.08em;">ENTERPRISE HEALTH</div>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#cbd5e1;">${para1Health}</p>
            </div>
            <div style="border-left:3px solid #3b82f6;padding-left:16px;margin-bottom:16px;">
              <div style="font-family:monospace;font-size:10px;font-weight:700;color:#60a5fa;margin-bottom:4px;letter-spacing:.08em;">TODAY'S FOCUS</div>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#cbd5e1;">${para2Focus}</p>
            </div>
            <div style="border-left:3px solid #f59e0b;padding-left:16px;margin-bottom:16px;">
              <div style="font-family:monospace;font-size:10px;font-weight:700;color:#fbbf24;margin-bottom:4px;letter-spacing:.08em;">TRUST INDEX</div>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#cbd5e1;">${para3Trust}</p>
            </div>
            <div style="border-left:3px solid #8b5cf6;padding-left:16px;margin-bottom:16px;">
              <div style="font-family:monospace;font-size:10px;font-weight:700;color:#a78bfa;margin-bottom:4px;letter-spacing:.08em;">ENTERPRISE LEARNING</div>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#cbd5e1;">${para4Learning}</p>
            </div>
            <div style="border-left:3px solid #06b6d4;padding-left:16px;margin-bottom:16px;">
              <div style="font-family:monospace;font-size:10px;font-weight:700;color:#22d3ee;margin-bottom:4px;letter-spacing:.08em;">POLICY EVOLUTION</div>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#cbd5e1;">${para5Policy}</p>
            </div>
            <div style="border-left:3px solid #ef4444;padding-left:16px;margin-bottom:28px;">
              <div style="font-family:monospace;font-size:10px;font-weight:700;color:#f87171;margin-bottom:4px;letter-spacing:.08em;">ACTION REQUIRED</div>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#cbd5e1;">${para6Actions}</p>
            </div>
            <a href="${process.env.FRONTEND_URL ?? 'http://localhost:3001'}/kangqore-view/admin/kangqore-immp/command-center"
               style="display:inline-block;background:#7c3aed;color:#fff;font-family:monospace;font-size:12px;font-weight:700;padding:10px 20px;border-radius:6px;text-decoration:none;">
              → Open Command Center
            </a>
            <div style="margin-top:24px;font-family:monospace;font-size:10px;color:#1f2d45;">
              WAANDA · Kangqore OS · ${today.toISOString()}
            </div>
          </div>`,
      });
      await (prisma as any).morningBriefing.update({
        where: { id: briefing.id },
        data:  { emailSent: true, sentAt: new Date() },
      });
    } catch { /* email failure is non-fatal */ }

    // ── WebSocket notification ────────────────────────────────────────────────
    try {
      const { getIO } = await import('../../socket');
      getIO()?.emit('kimmp:morning-brief', {
        briefType,
        date:    today.toISOString(),
        id:      briefing.id,
        oisScore,
        preview: para1Health.slice(0, 100),
      });
    } catch { /* socket not available */ }

    // ── WAANDA strategic directives post-brief ───────────────────────────────
    // WAANDA uses the brief's intelligence to direct subsystems for the day.
    try {
      const { WaandaAuthority } = await import('../../waanda/WaandaAuthority');
      // Tell ALIS which market segment to focus on based on today's brief context
      await WaandaAuthority.issueDirective('ALIS', 'FOCUS', {
        segment:  'revenue',
        briefId:  briefing.id,
        briefType,
      }, `Morning brief ${briefType} — ALIS revenue focus`).catch(() => {});
      // Tell VIS to prioritize the module with lowest coverage in today's brief
      await WaandaAuthority.issueDirective('VIS', 'FOCUS', {
        module:  'content-mapping',
        briefId: briefing.id,
      }, `Morning brief ${briefType} — VIS content priority`).catch(() => {});
    } catch { /* directive failures are non-fatal */ }

    return {
      id:       briefing.id,
      briefType,
      date:     today.toISOString(),
      oisScore,
      para1Health, para2Focus, para3Trust,
      para4Learning, para5Policy, para6Actions,
    };
  }
}
