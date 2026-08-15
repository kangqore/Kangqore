// ---------------------------------------------------------------------------
// Phase 6.9b — Executive Review Engine
// Weekly narrative assessment of enterprise operational quality.
// Generated Monday 07:30. Distinct from the daily briefing — this is a
// qualitative judgement of how the week changed the enterprise.
// ---------------------------------------------------------------------------

import { prisma }           from '../../../lib/prisma';
import { sonnet, textOf }   from '../llm/kimmpLLMRouter';
import { TrustEngine }      from './trustEngine';
import { computeGate8 }     from '../../waanda/intelligence/gate8.service';

const SYSTEM_REVIEW =
  'You are WAANDA. Generate a structured weekly executive review for Kangqore Global. ' +
  'Sections (each 2–3 sentences): Enterprise Health, Decision Quality, Learning Velocity, ' +
  'Strategic Progress, Risk Landscape, Recommended Focus for Next Week. ' +
  'Be direct, specific, honest. No hedging. No filler. Reference the data provided. ' +
  'Use section headers in ALL CAPS followed by a colon. Plain text only.';

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay()); // Sunday
  d.setHours(0, 0, 0, 0);
  return d;
}

export class ExecutiveReviewService {

  static async generate(weekOf?: Date): Promise<any> {
    const week    = weekOf ? startOfWeek(weekOf) : startOfWeek(new Date());
    const weekEnd = new Date(week);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const [gate8, eti, coverage] = await Promise.all([
      computeGate8().catch(() => null),
      TrustEngine.getETI().catch(() => null),
      TrustEngine.getKnowledgeCoverage().catch(() => null),
    ]);

    const [decisions, outcomes, lessons, patterns] = await Promise.all([
      (prisma as any).kimmpDecision.count({ where: { status: 'APPROVED', createdAt: { gte: week, lt: weekEnd } } }),
      (prisma as any).kimmpDecision.count({ where: { outcomeAt: { gte: week, lt: weekEnd } } }),
      (prisma as any).enterpriseLesson.count({ where: { createdAt: { gte: week, lt: weekEnd } } }),
      (prisma as any).enterprisePattern.count({ where: { createdAt: { gte: week, lt: weekEnd } } }),
    ]);

    // Previous week's snapshot for delta
    const prevWeek = new Date(week);
    prevWeek.setDate(prevWeek.getDate() - 7);
    const prevSnap = await (prisma as any).gate8Snapshot.findFirst({
      where:   { createdAt: { gte: prevWeek, lt: week } },
      orderBy: { createdAt: 'desc' },
      select:  { oisScore: true },
    });
    const prevOIS  = prevSnap?.oisScore ?? null;
    const currOIS  = gate8?.oisScore    ?? null;
    const coigDelta = prevOIS != null && currOIS != null ? Math.round((currOIS - prevOIS) * 10) / 10 : null;

    // Previous ETI
    const prevEtiSnap = await (prisma as any).eTISnapshot.findFirst({
      where:   { snapshotAt: { gte: prevWeek, lt: week } },
      orderBy: { snapshotAt: 'desc' },
    });
    const etiStart = prevEtiSnap?.overallScore ?? null;
    const etiEnd   = eti?.overall ?? null;

    const userPrompt = [
      `Week of ${week.toDateString()}.`,
      `OIS: ${prevOIS ?? '?'} → ${currOIS ?? '?'} (${coigDelta != null ? (coigDelta >= 0 ? '+' : '') + coigDelta : '?'}).`,
      `ETI: ${etiStart ?? '?'} → ${etiEnd ?? '?'}/100 (${eti?.grade ?? '?'}).`,
      `Decisions approved: ${decisions}. Outcomes recorded: ${outcomes}.`,
      `Lessons created: ${lessons}. Patterns detected: ${patterns}.`,
      `Knowledge coverage: ${coverage?.overall ?? '?'}% across ${coverage?.domains?.length ?? 8} domains.`,
      `Weakest domain: ${coverage?.domains?.[coverage.domains.length - 1]?.domain ?? 'unknown'} at ${coverage?.domains?.[coverage.domains.length - 1]?.coverage ?? 0}%.`,
    ].join(' ');

    let content = `ENTERPRISE HEALTH: OIS ${currOIS ?? '—'}/100. ${coigDelta != null ? `${coigDelta >= 0 ? '+' : ''}${coigDelta} vs last week.` : ''}\n\n` +
      `DECISION QUALITY: ${decisions} decisions approved. ${outcomes} outcomes recorded.\n\n` +
      `LEARNING VELOCITY: ${lessons} lessons created. ${patterns} patterns detected.\n\n` +
      `STRATEGIC PROGRESS: Knowledge coverage at ${coverage?.overall ?? '—'}%.\n\n` +
      `RISK LANDSCAPE: Review the knowledge domains with lowest coverage.\n\n` +
      `RECOMMENDED FOCUS FOR NEXT WEEK: Record outcomes on pending decisions to advance ETI calibration.`;

    try {
      const res  = await sonnet(SYSTEM_REVIEW, userPrompt, 500, { hint: 'executive-review' });
      const text = textOf(res).trim();
      if (text && text.length > 100) content = text;
    } catch { /* use fallback */ }

    return (prisma as any).executiveReview.create({
      data: {
        reviewType:   'WEEKLY',
        weekOf:       week,
        oisStart:     prevOIS,
        oisEnd:       currOIS,
        etiStart,
        etiEnd,
        coigDelta,
        decisionCount: decisions,
        outcomeCount:  outcomes,
        lessonCount:   lessons,
        patternCount:  patterns,
        content,
      },
    });
  }

  static async list(limit = 10): Promise<any[]> {
    return (prisma as any).executiveReview.findMany({
      orderBy: { weekOf: 'desc' },
      take:    limit,
    });
  }

  static async latest(): Promise<any | null> {
    return (prisma as any).executiveReview.findFirst({ orderBy: { weekOf: 'desc' } });
  }
}
