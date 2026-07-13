// ---------------------------------------------------------------------------
// Phase 6.9e — Strategic Narrative Generator
// WAANDA composes enterprise letters: quarterly, annual, board, investor.
// Style: Amazon shareholder letter — direct, specific, outcome-oriented.
// ---------------------------------------------------------------------------

import { prisma }           from '../../lib/prisma';
import { sonnet, textOf }   from '../llm/kimmpLLMRouter';
import { TrustEngine }      from './trustEngine';
import { CoigEvolutionService } from './coigEvolution.service';
import { computeGate8 }     from '../../waanda/intelligence/gate8.service';

type LetterType = 'QUARTERLY' | 'ANNUAL' | 'BOARD' | 'INVESTOR';

const SYSTEM_LETTER =
  'You are the voice of WAANDA, the intelligence layer of Kangqore Global. ' +
  'Write a {{TYPE}} enterprise letter for {{PERIOD}}. ' +
  'Style: Amazon shareholder letter — direct, honest, specific, outcome-oriented. ' +
  'Structure: Opening (what we set out to do), Results (what happened with specific numbers), ' +
  'Learning (what we learned as an organization), Challenges (what did not work, honestly), ' +
  'Forward (what we prioritize next and why). ' +
  'Do not hedge. Do not use phrases like "I am pleased to report". ' +
  'Reference specific data from the context. Plain text, use section headers in ALL CAPS.';

export class NarrativeGeneratorService {

  static async generate(type: LetterType, period: string): Promise<any> {
    const [coig, gate8, eti, coverage, reviews, scorecard] = await Promise.all([
      CoigEvolutionService.trend().catch(() => null),
      computeGate8().catch(() => null),
      TrustEngine.getETI().catch(() => null),
      TrustEngine.getKnowledgeCoverage().catch(() => null),
      (prisma as any).executiveReview.findMany({ orderBy: { weekOf: 'desc' }, take: 12 }),
      CoigEvolutionService.computeScorecard('quarter').catch(() => null),
    ]);

    // Gather aggregated numbers
    const totalDecisions   = reviews.reduce((s: number, r: any) => s + r.decisionCount, 0);
    const totalOutcomes    = reviews.reduce((s: number, r: any) => s + r.outcomeCount, 0);
    const totalLessons     = reviews.reduce((s: number, r: any) => s + r.lessonCount, 0);
    const totalPatterns    = reviews.reduce((s: number, r: any) => s + r.patternCount, 0);

    const context = [
      `Period: ${period}.`,
      `OIS: ${coig?.baseline?.ois ?? '?'} (baseline) → ${coig?.current ?? gate8?.oisScore ?? '?'} (current). COIG: ${coig?.coig != null ? (coig.coig >= 0 ? '+' : '') + coig.coig : '?'}.`,
      `ETI: ${eti?.overall ?? '?'}/100 (${eti?.grade ?? '?'}). Decision accuracy: ${eti?.dimensions?.decisionAccuracy?.score ?? '?'}%.`,
      `Knowledge coverage: ${coverage?.overall ?? '?'}% across ${coverage?.domains?.length ?? 8} domains.`,
      `Decisions: ${totalDecisions} approved. Outcomes: ${totalOutcomes} recorded.`,
      `Lessons: ${totalLessons}. Patterns: ${totalPatterns}.`,
      `Automation rate: ${scorecard?.automationRate ?? '?'}%.`,
      `Projected OIS in 90 days: ${coig?.projected?.ois90d ?? '?'}.`,
    ].join(' ');

    const system = SYSTEM_LETTER
      .replace('{{TYPE}}', type.toLowerCase())
      .replace('{{PERIOD}}', period);

    let content = `OPENING\nKangqore Global ${period} executive report.\n\n` +
      `RESULTS\nOIS: ${coig?.current ?? '—'}. COIG: ${coig?.coig != null ? (coig.coig >= 0 ? '+' : '') + coig.coig : '—'}.\n\n` +
      `LEARNING\n${totalLessons} lessons captured. ${totalPatterns} patterns confirmed.\n\n` +
      `CHALLENGES\nSimulationTrust remains null — Customer Zero data accumulation is the primary constraint.\n\n` +
      `FORWARD\nConstitution Compliance Suite, COIG measurement, and Customer Zero operation are the three priorities.`;

    try {
      const res  = await sonnet(system, context, 800, { hint: 'narrative-letter' });
      const text = textOf(res).trim();
      if (text && text.length > 200) content = text;
    } catch { /* use fallback */ }

    const metrics = {
      ois:             coig?.current ?? gate8?.oisScore,
      coig:            coig?.coig,
      eti:             eti?.overall,
      knowledgeCoverage: coverage?.overall,
      decisions:       totalDecisions,
      outcomes:        totalOutcomes,
      lessons:         totalLessons,
      patterns:        totalPatterns,
      generatedAt:     new Date().toISOString(),
    };

    return (prisma as any).enterpriseLetter.create({
      data: { type, period, content, metrics },
    });
  }

  static async list(type?: LetterType, limit = 10): Promise<any[]> {
    return (prisma as any).enterpriseLetter.findMany({
      where:   type ? { type } : {},
      orderBy: { createdAt: 'desc' },
      take:    limit,
    });
  }
}
