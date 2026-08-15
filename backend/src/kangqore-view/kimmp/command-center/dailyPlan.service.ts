// ---------------------------------------------------------------------------
// Phase 6.3 — Daily Operating Plan Service
//
// Generates a CEO-facing operating plan: Mission, Actions (with Executive
// Focus Score), Executive Leverage (quick wins with ROI framing), and
// Blockers. Cached per calendar day; dismissed plans regenerate fresh.
//
// Executive Focus Score = weighted composite of Impact + Urgency +
// Confidence + Intent Alignment + Objective Alignment. This answers:
// "Why does this deserve my attention over everything else?"
// ---------------------------------------------------------------------------

import { prisma }                  from '../../../lib/prisma';
import { DecisionEngine }          from '../decision/decisionEngine.service';
import { KimmpProactiveEngine }    from '../proactive/kimmpProactive.service';
import { KimmpGoalEngine }         from '../goals/kimmpGoal.service';
import { IntentAlignmentService }  from './intentAlignment.service';
import { computeGate8, computeRecommendations } from '../../../waanda/intelligence/gate8.service';
import { haiku, textOf }           from '../llm/kimmpLLMRouter';

// ── Action type constants ─────────────────────────────────────────────────────

export type ActionType = 'DECISION' | 'CRM' | 'GOAL' | 'OPERATIONS' | 'MARKET' | 'INTELLIGENCE';
export type ExecutiveTier = 'STRATEGIC' | 'CRITICAL' | 'OPERATIONAL' | 'INFORMATIONAL';

const BASE_IMMP = '/kangqore-view/admin/kangqore-immp';
const BASE_OS   = '/kangqore-view/admin';

// Default time estimate per action type (minutes)
const ESTIMATED_MINS: Record<ActionType, number> = {
  DECISION:     5,
  CRM:          10,
  GOAL:         15,
  OPERATIONS:   20,
  MARKET:       5,
  INTELLIGENCE: 5,
};

// Severity → raw impact score
const SEVERITY_IMPACT: Record<string, number> = {
  CRITICAL: 92,
  HIGH:     74,
  MODERATE: 52,
  LOW:      30,
};

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface PlanAction {
  id:             string
  title:          string
  tier:           ExecutiveTier
  type:           ActionType
  targetId:       string | null
  targetPath:     string
  done:           boolean
  source:         string
  // Executive Focus Score
  impact:         number   // 0–100: how significant is the business consequence
  urgency:        number   // 0–100: how time-sensitive
  confidence:     number   // 0–100: signal/decision confidence
  intentAlign:    number   // 0–100: alignment to active CEO intent
  objectiveAlign: number   // 0–100: alignment to enterprise objective
  dependencies:   number   // count of items blocked by this
  estimatedMins:  number
  focusScore:     number   // composite 0–100
  // Executive Leverage
  leverageOutcome: string  // "Reduces delivery risk by ~14%"
}

export interface PlanBlocker {
  title:       string
  source:      string
  since:       string      // ISO string
  impactScore: number
}

export interface PlanQuickWin {
  title:           string
  targetPath:      string
  estimatedMins:   number
  leverageOutcome: string  // "Approve this now → +N OIS points"
  oisImpact:       number
}

export interface DailyPlanResult {
  id:          string
  date:        string
  mission:     string
  actions:     PlanAction[]
  blockers:    PlanBlocker[]
  quickWins:   PlanQuickWin[]
  oisAtGen:    number | null
  generatedAt: string
  dismissed:   boolean
}

// ── Scoring helpers ───────────────────────────────────────────────────────────

function focusScore(a: Pick<PlanAction, 'impact' | 'urgency' | 'confidence' | 'intentAlign' | 'objectiveAlign'>): number {
  return Math.min(100, Math.round(
    a.impact        * 0.30 +
    a.urgency       * 0.25 +
    a.confidence    * 0.15 +
    a.intentAlign   * 0.20 +
    a.objectiveAlign * 0.10
  ));
}

function urgencyFromDate(dueAt: Date | null | undefined): number {
  if (!dueAt) return 40;
  const hoursLeft = (dueAt.getTime() - Date.now()) / 3_600_000;
  if (hoursLeft < 0)  return 100;  // overdue
  if (hoursLeft < 4)  return 95;
  if (hoursLeft < 24) return 85;
  if (hoursLeft < 72) return 65;
  return 45;
}

function tierFromScores(intentAlign: number, urgency: number, fs: number): ExecutiveTier {
  if (intentAlign >= 40) return 'STRATEGIC';
  if (urgency >= 85 || fs >= 80) return 'CRITICAL';
  if (fs >= 40) return 'OPERATIONAL';
  return 'INFORMATIONAL';
}

function leverageForAlert(alert: any): string {
  switch (alert.category) {
    case 'revenue':    return 'Addresses revenue risk before it compounds';
    case 'delivery':   return 'Reduces delivery risk exposure';
    case 'market':     return 'Captures time-sensitive market signal';
    case 'people':     return 'Prevents talent gap from blocking delivery';
    case 'compliance': return 'Removes compliance risk from open accounts';
    default:           return 'Resolves an open WAANDA alert';
  }
}

function leverageForDecision(dec: any): string {
  const type = dec.decisionType ?? '';
  if (type === 'SALES_ALERT')          return `Moves a ${dec.leadId ? 'flagged lead' : 'deal'} through the pipeline`;
  if (type === 'CONTENT_OPPORTUNITY')  return 'Closes a content gap reducing visitor conversion';
  if (type === 'MARKET_ALERT')         return 'Acts on a time-sensitive market signal';
  if (type === 'HUMAN_HANDOFF')        return 'Escalates a visitor who requested personal contact';
  return 'Clears a pending WAANDA recommendation';
}

function leverageForGoal(goal: any): string {
  return `Advances goal: "${(goal.objective ?? goal.title ?? '').slice(0, 50)}"`;
}

// ── Date utilities ────────────────────────────────────────────────────────────

function toMidnightUTC(d: Date): Date {
  const out = new Date(d);
  out.setUTCHours(0, 0, 0, 0);
  return out;
}

// ── Main service ──────────────────────────────────────────────────────────────

export class DailyPlanService {

  static async getOrGenerate(date = new Date()): Promise<DailyPlanResult> {
    const normalized = toMidnightUTC(date);

    // Cache hit
    const existing = await (prisma as any).dailyOperatingPlan.findUnique({
      where: { date: normalized },
    }).catch(() => null);

    if (existing && !existing.dismissed) {
      return DailyPlanService._toResult(existing);
    }

    return DailyPlanService._generate(normalized);
  }

  static async completeAction(planId: string, actionId: string): Promise<boolean> {
    const plan = await (prisma as any).dailyOperatingPlan.findUnique({ where: { id: planId } }).catch(() => null);
    if (!plan) return false;

    const actions = (plan.actions as PlanAction[]).map(a =>
      a.id === actionId ? { ...a, done: true } : a
    );

    await (prisma as any).dailyOperatingPlan.update({
      where: { id: planId },
      data:  { actions },
    });
    return true;
  }

  static async dismiss(date = new Date()): Promise<void> {
    const normalized = toMidnightUTC(date);
    await (prisma as any).dailyOperatingPlan.updateMany({
      where: { date: normalized },
      data:  { dismissed: true },
    });
  }

  // ── Timeline ────────────────────────────────────────────────────────────────

  static async timeline(
    window: 'yesterday' | 'week' | 'quarter',
    lens:   'decisions' | 'missions' | 'objectives' | 'enterprise' = 'enterprise',
  ) {
    const now   = new Date();
    const start = new Date(now);
    if (window === 'yesterday') {
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
    } else if (window === 'week') {
      start.setDate(now.getDate() - 7);
    } else {
      start.setDate(now.getDate() - 90);
    }

    // Always fetch decisions for context
    const [decisions, plans, objectives] = await Promise.all([
      (prisma as any).kimmpDecision.findMany({
        where:   { createdAt: { gte: start } },
        orderBy: { createdAt: 'desc' },
        take:    100,
        select: {
          id: true, decisionType: true, targetModule: true, status: true,
          confidence: true, outcome: true, outcomeAt: true, leadId: true, createdAt: true,
        },
      }).catch(() => []),

      (prisma as any).dailyOperatingPlan.findMany({
        where:   { date: { gte: start } },
        orderBy: { date: 'desc' },
        select: { id: true, date: true, mission: true, actions: true, generatedAt: true },
      }).catch(() => []),

      (prisma as any).kimmpEnterpriseObjective.findMany({
        where:  { status: { in: ['ACTIVE', 'ACHIEVED'] } },
        orderBy: { rank: 'asc' },
        select: { id: true, title: true, status: true, category: true, createdAt: true, updatedAt: true },
      }).catch(() => []),
    ]);

    // ── Aggregate counts ──────────────────────────────────────────────────────
    const decArr = Array.isArray(decisions) ? decisions : [];
    const planArr = Array.isArray(plans) ? plans : [];
    const objArr  = Array.isArray(objectives) ? objectives : [];

    const approved  = decArr.filter((d: any) => d.status === 'APPROVED').length;
    const dismissed = decArr.filter((d: any) => d.status === 'DISMISSED').length;
    const withOutcomes = decArr.filter((d: any) => d.outcome).length;

    const goalsCompleted = planArr.reduce((acc: number, p: any) => {
      const actions = Array.isArray(p.actions) ? p.actions as PlanAction[] : [];
      return acc + actions.filter(a => a.done).length;
    }, 0);

    // ── Build causal timeline entries ─────────────────────────────────────────
    let entries: any[] = [];

    if (lens === 'decisions' || lens === 'enterprise') {
      entries.push(...decArr.map((d: any) => ({
        id:        d.id,
        type:      'DECISION' as const,
        timestamp: d.createdAt,
        event:     `${d.decisionType} → ${d.targetModule}`,
        status:    d.status,
        consequence: d.outcome
          ? `Outcome: ${d.outcome.slice(0, 80)}`
          : d.status === 'APPROVED' ? 'Approved — awaiting outcome' : null,
        oisDelta:    null as number | null,
        intentLabel: null as string | null,
        confidence:  d.confidence,
      })));
    }

    if (lens === 'missions' || lens === 'enterprise') {
      entries.push(...planArr.map((p: any) => {
        const actions  = Array.isArray(p.actions) ? p.actions as PlanAction[] : [];
        const total    = actions.length;
        const done     = actions.filter(a => a.done).length;
        const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
        return {
          id:          p.id,
          type:        'MISSION' as const,
          timestamp:   p.date,
          event:       p.mission ?? 'Daily mission',
          status:      pct === 100 ? 'COMPLETE' : pct > 0 ? 'IN_PROGRESS' : 'OPEN',
          consequence: `${done}/${total} actions complete (${pct}%)`,
          oisDelta:    null as number | null,
          intentLabel: null as string | null,
          confidence:  null,
        };
      }));
    }

    if (lens === 'objectives' || lens === 'enterprise') {
      entries.push(...objArr.map((o: any) => ({
        id:          o.id,
        type:        'OBJECTIVE' as const,
        timestamp:   o.updatedAt ?? o.createdAt,
        event:       o.title,
        status:      o.status,
        consequence: o.status === 'ACHIEVED' ? 'Objective achieved' : 'Active — in pursuit',
        oisDelta:    null as number | null,
        intentLabel: null as string | null,
        confidence:  null,
      })));
    }

    // Sort causal: newest first
    entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    entries = entries.slice(0, 60);

    return {
      window,
      lens,
      startDate: start.toISOString(),
      decisions: { count: decArr.length, approved, dismissed, outcomes: withOutcomes },
      goalsCompleted,
      entries,
    };
  }

  // ── Internal generation ────────────────────────────────────────────────────

  private static async _generate(date: Date): Promise<DailyPlanResult> {
    const [alerts, proposed, goals, gate8, recommendations, activeIntents] = await Promise.all([
      KimmpProactiveEngine.scan().catch(() => [] as any[]),
      DecisionEngine.list('PROPOSED').catch(() => [] as any[]),
      KimmpGoalEngine.list(30).catch(() => [] as any[]),
      computeGate8().catch(() => null),
      computeRecommendations().catch(() => [] as any[]),
      IntentAlignmentService.getActive().catch(() => [] as any[]),
    ]);

    const alertArr  = Array.isArray(alerts)   ? alerts   : [];
    const decArr    = Array.isArray(proposed)  ? proposed  : [];
    const goalArr   = Array.isArray(goals)     ? goals     : [];
    const recArr    = Array.isArray(recommendations) ? recommendations : [];

    const oisAtGen: number | null = gate8 ? Math.round(gate8.oisScore) : null;

    // ── Build actions from all sources ────────────────────────────────────────
    const actionMap = new Map<string, PlanAction>(); // key = leadId or entityId to deduplicate

    // 1. CRITICAL proactive alerts → HIGH / potential STRATEGIC actions
    for (const alert of alertArr) {
      if (alert.dismissed) continue;
      const dedupeKey = alert.entityId ?? alert.id;
      if (actionMap.has(dedupeKey)) continue;

      const impact    = SEVERITY_IMPACT[alert.severity] ?? 52;
      const urgency   = alert.severity === 'CRITICAL' ? 95 : alert.severity === 'HIGH' ? 75 : 50;
      const confidence = 80;
      const alignment  = IntentAlignmentService.scoreSync(
        `${alert.title} ${alert.description} ${alert.category}`, activeIntents
      );
      const iAlign    = alignment ? Math.round(alignment.score * 100) : 0;
      const oAlign    = alignment?.objectiveId ? 15 : 0;
      const fs        = focusScore({ impact, urgency, confidence, intentAlign: iAlign, objectiveAlign: oAlign });

      const action: PlanAction = {
        id:             `alert-${alert.id}`,
        title:          alert.title,
        tier:           tierFromScores(iAlign, urgency, fs),
        type:           (alert.actionType === 'NAVIGATE' ? 'MARKET' : 'OPERATIONS') as ActionType,
        targetId:       alert.entityId ?? null,
        targetPath:     alert.actionPayload?.path ?? `${BASE_IMMP}/alerts`,
        done:           false,
        source:         'proactive',
        impact, urgency, confidence,
        intentAlign:    iAlign,
        objectiveAlign: oAlign,
        dependencies:   0,
        estimatedMins:  ESTIMATED_MINS.OPERATIONS,
        focusScore:     fs,
        leverageOutcome: leverageForAlert(alert),
      };

      actionMap.set(dedupeKey, action);
    }

    // 2. PROPOSED decisions
    for (const dec of decArr) {
      const dedupeKey = dec.leadId ?? `dec-${dec.id}`;

      // If a proactive alert already captured this leadId, upgrade rather than duplicate
      if (dec.leadId && actionMap.has(dec.leadId)) {
        const existing = actionMap.get(dec.leadId)!;
        // Attach the decision id so targetPath is more specific
        actionMap.set(dec.leadId, {
          ...existing,
          targetId:   dec.id,
          targetPath: `${BASE_IMMP}/decision-engine`,
          type:       'DECISION',
          title:      existing.title,
        });
        continue;
      }

      const impact    = SEVERITY_IMPACT[dec.severity ?? 'MODERATE'] ?? Math.min(100, dec.priority ?? 52);
      const urgency   = dec.priority >= 34 ? 90 : dec.priority >= 21 ? 72 : 50;
      const confidence = dec.confidence ?? 70;
      const alignment  = IntentAlignmentService.scoreSync(
        `${dec.recommendedAction ?? ''} ${dec.targetModule ?? ''} ${dec.decisionType ?? ''}`, activeIntents
      );
      const iAlign    = alignment ? Math.round(alignment.score * 100) : 0;
      const oAlign    = alignment?.objectiveId ? 15 : 0;
      const fs        = focusScore({ impact, urgency, confidence, intentAlign: iAlign, objectiveAlign: oAlign });

      const action: PlanAction = {
        id:             `dec-${dec.id}`,
        title:          dec.recommendedAction?.slice(0, 80) ?? dec.decisionType,
        tier:           tierFromScores(iAlign, urgency, fs),
        type:           'DECISION',
        targetId:       dec.id,
        targetPath:     `${BASE_IMMP}/decision-engine`,
        done:           false,
        source:         'decision-engine',
        impact, urgency, confidence,
        intentAlign:    iAlign,
        objectiveAlign: oAlign,
        dependencies:   0,
        estimatedMins:  ESTIMATED_MINS.DECISION,
        focusScore:     fs,
        leverageOutcome: leverageForDecision(dec),
      };

      actionMap.set(dedupeKey, action);
    }

    // 3. Goals needing attention (approaching deadline or stalled tasks)
    const today  = new Date();
    const in3d   = new Date(today.getTime() + 3 * 86_400_000);
    for (const goal of goalArr) {
      if (goal.status !== 'ACTIVE' && goal.status !== 'IN_PROGRESS') continue;
      const deadline = goal.deadline ? new Date(goal.deadline) : null;
      const isUrgent = deadline && deadline <= in3d;
      if (!isUrgent) continue;

      const impact    = 60;
      const urgency   = urgencyFromDate(deadline);
      const confidence = 70;
      const alignment  = IntentAlignmentService.scoreSync(
        `${goal.objective ?? goal.title ?? ''}`, activeIntents
      );
      const iAlign    = alignment ? Math.round(alignment.score * 100) : 0;
      const oAlign    = alignment?.objectiveId ? 15 : 0;
      const fs        = focusScore({ impact, urgency, confidence, intentAlign: iAlign, objectiveAlign: oAlign });

      actionMap.set(`goal-${goal.id}`, {
        id:             `goal-${goal.id}`,
        title:          `Review goal: ${(goal.objective ?? '').slice(0, 60)}`,
        tier:           tierFromScores(iAlign, urgency, fs),
        type:           'GOAL',
        targetId:       goal.id,
        targetPath:     `${BASE_IMMP}/goals`,
        done:           false,
        source:         'goals',
        impact, urgency, confidence,
        intentAlign:    iAlign,
        objectiveAlign: oAlign,
        dependencies:   goal.tasks?.filter((t: any) => t.status !== 'DONE').length ?? 0,
        estimatedMins:  ESTIMATED_MINS.GOAL,
        focusScore:     fs,
        leverageOutcome: leverageForGoal(goal),
      });
    }

    // ── Sort: STRATEGIC > CRITICAL > OPERATIONAL by focusScore desc ──────────
    const TIER_ORDER: Record<ExecutiveTier, number> = { STRATEGIC: 0, CRITICAL: 1, OPERATIONAL: 2, INFORMATIONAL: 3 };
    const actions: PlanAction[] = [...actionMap.values()]
      .sort((a, b) =>
        TIER_ORDER[a.tier] - TIER_ORDER[b.tier] ||
        b.focusScore - a.focusScore
      )
      .slice(0, 12);

    // ── Blockers ──────────────────────────────────────────────────────────────
    const blockers: PlanBlocker[] = decArr
      .filter((d: any) => d.priority >= 21 && d.status === 'PROPOSED')
      .slice(0, 3)
      .map((d: any) => ({
        title:       `${d.decisionType} — awaiting approval`,
        source:      'Decision Engine',
        since:       d.createdAt ?? new Date().toISOString(),
        impactScore: Math.min(100, d.priority ?? 50),
      }));

    // ── Executive Leverage (Quick Wins from Gate 8 recommendations) ───────────
    const quickWins: PlanQuickWin[] = recArr
      .filter((r: any) => r.effort === 'LOW')
      .slice(0, 3)
      .map((r: any) => ({
        title:           r.action,
        targetPath:      `${BASE_IMMP}/operational-intel`,
        estimatedMins:   5,
        leverageOutcome: `+${r.oisImpact ?? '?'} OIS points → closer to ${r.targetValue}`,
        oisImpact:       r.oisImpact ?? 0,
      }));

    // ── Mission sentence (Haiku) ─────────────────────────────────────────────
    const topAlert  = alertArr.filter((a: any) => a.severity === 'CRITICAL')[0] ?? alertArr[0];
    const topDec    = decArr[0];
    const weakPillar = gate8
      ? Object.entries(gate8.pillars as Record<string, any>)
          .sort((a, b) => (a[1]?.score ?? 0) - (b[1]?.score ?? 0))[0]?.[0]
      : null;

    const systemP = 'You are WAANDA. Write ONE sentence — the single most important business focus for the CEO today. Concrete, specific, urgent. Do not start with "I" or "Today". No markdown.';
    const userP   = [
      topAlert   ? `Critical alert: ${topAlert.title}` : '',
      topDec     ? `Top decision: ${topDec.recommendedAction ?? topDec.decisionType}` : '',
      weakPillar ? `Weakest enterprise pillar: ${weakPillar}` : '',
      oisAtGen   ? `Current OIS: ${oisAtGen}` : '',
      activeIntents.length > 0 ? `CEO's top intent: ${activeIntents[0].label}` : '',
    ].filter(Boolean).join('\n');

    let mission = 'Execute the highest-focus decision in the queue and clear any critical blockers.';
    try {
      const result = await haiku(systemP, userP, 40, { hint: 'daily-mission' });
      const text   = textOf(result).trim();
      if (text) mission = text;
    } catch { /* degrade gracefully */ }

    // ── Persist ───────────────────────────────────────────────────────────────
    const row = await (prisma as any).dailyOperatingPlan.upsert({
      where:  { date },
      create: { date, mission, actions, blockers, quickWins, oisAtGen, dismissed: false },
      update: { mission, actions, blockers, quickWins, oisAtGen, dismissed: false, generatedAt: new Date() },
    });

    return DailyPlanService._toResult(row);
  }

  private static _toResult(row: any): DailyPlanResult {
    return {
      id:          row.id,
      date:        (row.date instanceof Date ? row.date : new Date(row.date)).toISOString(),
      mission:     row.mission,
      actions:     (row.actions as PlanAction[]) ?? [],
      blockers:    (row.blockers as PlanBlocker[]) ?? [],
      quickWins:   (row.quickWins as PlanQuickWin[]) ?? [],
      oisAtGen:    row.oisAtGen ?? null,
      generatedAt: (row.generatedAt instanceof Date ? row.generatedAt : new Date(row.generatedAt)).toISOString(),
      dismissed:   row.dismissed ?? false,
    };
  }
}
