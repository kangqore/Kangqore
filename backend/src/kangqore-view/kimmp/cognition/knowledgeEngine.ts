// ---------------------------------------------------------------------------
// Knowledge Engine — Levels 4–6 (Pattern → Principle → Playbook)
// Promotes knowledge upward when evidence thresholds are met.
// Promotion mode: BOOTSTRAP (auto) until platform flag switches to GOVERNED.
// ---------------------------------------------------------------------------

import { prisma }        from '../../../lib/prisma';
import { haiku, textOf } from '../llm/kimmpLLMRouter';
import { cognitionBus }  from './cognitionBus';

const PATTERN_THRESHOLD   = 3;  // insights needed to form a pattern
const PRINCIPLE_THRESHOLD = 3;  // patterns needed to form a principle
const PLAYBOOK_THRESHOLD  = 3;  // principles needed to form a playbook

const SYSTEM_PATTERN =
  'You are WAANDA. Given multiple enterprise insights from the same domain, identify the measurable repeating pattern. ' +
  'Reply in JSON: {"description":"...(one sentence describing the pattern)"}. No markdown.';

const SYSTEM_PRINCIPLE =
  'You are WAANDA. Given multiple repeating patterns from the same enterprise domain, formulate an enterprise principle. ' +
  'A principle is a validated rule the enterprise should follow. ' +
  'Reply in JSON: {"statement":"...(one sentence)","rationale":"...(one sentence why)"}. No markdown.';

const SYSTEM_PLAYBOOK =
  'You are WAANDA. Given multiple enterprise principles from the same domain, write a concise playbook. ' +
  'Reply in JSON: {"title":"...(5 words max)","steps":["step 1","step 2","step 3"]}. No markdown.';

async function getPromotionMode(): Promise<'BOOTSTRAP' | 'GOVERNED'> {
  try {
    const flag = await (prisma as any).kimmpFlag?.findFirst({ where: { key: 'COGNITION_PROMOTION_MODE' } });
    return flag?.value === 'GOVERNED' ? 'GOVERNED' : 'BOOTSTRAP';
  } catch { return 'BOOTSTRAP'; }
}

export interface PromotionResult {
  pattern?:   any;
  principle?: any;
  playbook?:  any;
  promoted:   boolean;
}

export class KnowledgeEngine {
  static async checkPromotion(lessonId: string): Promise<PromotionResult> {
    const lesson = await (prisma as any).enterpriseLesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return { promoted: false };

    const result: PromotionResult = { promoted: false };
    const mode = await getPromotionMode();

    // Try to form an Insight (handled by InsightEngine), then pattern
    const insights: any[] = await (prisma as any).enterpriseInsight.findMany({
      where:   { domain: lesson.domain, promotedAt: null },
      orderBy: { createdAt: 'desc' },
      take:    20,
    });

    if (insights.length >= PATTERN_THRESHOLD) {
      const pattern = await this._detectPattern(insights.slice(0, PATTERN_THRESHOLD), mode);
      if (pattern) {
        result.pattern  = pattern;
        result.promoted = true;

        // Check if this pattern triggers a principle
        const patterns: any[] = await (prisma as any).enterprisePattern.findMany({
          where:   { domain: lesson.domain, promotedAt: null },
          orderBy: { createdAt: 'desc' },
          take:    20,
        });
        if (patterns.length >= PRINCIPLE_THRESHOLD) {
          const principle = await this._promotePrinciple(patterns.slice(0, PRINCIPLE_THRESHOLD), mode);
          if (principle) {
            result.principle = principle;

            // Check if this principle triggers a playbook
            const principles: any[] = await (prisma as any).enterprisePrinciple.findMany({
              where:   { domain: lesson.domain, status: 'ACTIVE', promotedAt: null },
              orderBy: { createdAt: 'desc' },
              take:    20,
            });
            if (principles.length >= PLAYBOOK_THRESHOLD) {
              const playbook = await this._buildPlaybook(principles.slice(0, PLAYBOOK_THRESHOLD), mode);
              if (playbook) result.playbook = playbook;
            }
          }
        }
      }
    }

    return result;
  }

  private static async _detectPattern(insights: any[], mode: string): Promise<any | null> {
    const domain     = insights[0].domain;
    const userPrompt = insights.map((i, idx) => `Insight ${idx + 1}: ${i.insight}`).join('\n');

    let description = `Repeated pattern in ${domain}: ` + insights.map(i => i.insight).slice(0, 2).join('; ');
    try {
      const res    = await haiku(SYSTEM_PATTERN, userPrompt, 100, { hint: 'cognition-pattern' });
      const parsed = JSON.parse(textOf(res).trim());
      if (parsed.description) description = parsed.description;
    } catch { /* degrade */ }

    const avgConf = insights.reduce((s, i) => s + i.confidence, 0) / insights.length;

    const eventType = mode === 'BOOTSTRAP' ? 'pattern_created' : 'pattern_candidate' as any;
    const status    = mode === 'BOOTSTRAP' ? 'ACTIVE' : 'CANDIDATE';

    const pattern = await (prisma as any).enterprisePattern.create({
      data: {
        domain, description,
        frequency:    insights.length,
        confidence:   Math.min(avgConf + 0.05, 0.95),
        evidenceCount: insights.reduce((s: number, i: any) => s + i.evidenceCount, 0),
        tags:          [...new Set(insights.flatMap((i: any) => i.tags ?? []))],
      },
    });

    // Wire junctions
    await Promise.all(insights.map(i =>
      (prisma as any).enterpriseInsightPattern.upsert({
        where:  { insightId_patternId: { insightId: i.id, patternId: pattern.id } },
        update: {},
        create: { insightId: i.id, patternId: pattern.id },
      }).catch(() => null)
    ));

    // Mark insights promoted
    await (prisma as any).enterpriseInsight.updateMany({
      where: { id: { in: insights.map((i: any) => i.id) } },
      data:  { promotedAt: new Date() },
    });

    cognitionBus.publish({
      type: eventType, artifactId: pattern.id, artifactType: 'EnterprisePattern',
      domain, payload: pattern, emittedAt: new Date(),
    });

    prisma.waandaTrainingExample.create({ data: {
      exampleType:  'SYNTHESIS',
      system:       'KIMMP',
      curriculum:   'EXECUTIVE',
      trigger:      'cognition:pattern_created',
      modelVersion: 'claude-haiku-4-5-20251001',
      systemPrompt: SYSTEM_PATTERN,
      userPrompt,
      completion:   JSON.stringify({ description }),
      alpacaFormat: { instruction: SYSTEM_PATTERN, input: userPrompt, output: JSON.stringify({ description }) },
    } }).catch(() => null);

    return pattern;
  }

  private static async _promotePrinciple(patterns: any[], mode: string): Promise<any | null> {
    const domain     = patterns[0].domain;
    const userPrompt = patterns.map((p, i) => `Pattern ${i + 1}: ${p.description}`).join('\n');

    let statement = patterns.map(p => p.description).join('. ');
    let rationale = `Based on ${patterns.length} observed patterns in the ${domain} domain.`;

    try {
      const res    = await haiku(SYSTEM_PRINCIPLE, userPrompt, 150, { hint: 'cognition-principle' });
      const parsed = JSON.parse(textOf(res).trim());
      if (parsed.statement) statement = parsed.statement;
      if (parsed.rationale) rationale = parsed.rationale;
    } catch { /* degrade */ }

    const avgConf       = patterns.reduce((s, p) => s + p.confidence, 0) / patterns.length;
    const promotionMode = mode === 'BOOTSTRAP' ? 'BOOTSTRAP' : 'GOVERNED';
    const promotionStatus = mode === 'BOOTSTRAP' ? 'APPROVED' : 'CANDIDATE';
    const status          = mode === 'BOOTSTRAP' ? 'ACTIVE' : 'ACTIVE';
    const eventType       = mode === 'BOOTSTRAP' ? 'principle_created' : 'principle_candidate' as any;

    const principle = await (prisma as any).enterprisePrinciple.create({
      data: {
        domain, statement, rationale,
        confidence:     Math.min(avgConf + 0.05, 0.95),
        evidenceCount:  patterns.reduce((s: number, p: any) => s + p.evidenceCount, 0),
        status, promotionStatus, promotionMode,
        tags:           [...new Set(patterns.flatMap((p: any) => p.tags ?? []))],
      },
    });

    await Promise.all(patterns.map(p =>
      (prisma as any).enterprisePrinciplePattern.upsert({
        where:  { principleId_patternId: { principleId: principle.id, patternId: p.id } },
        update: {},
        create: { principleId: principle.id, patternId: p.id },
      }).catch(() => null)
    ));

    await (prisma as any).enterprisePattern.updateMany({
      where: { id: { in: patterns.map((p: any) => p.id) } },
      data:  { promotedAt: new Date() },
    });

    cognitionBus.publish({
      type: eventType, artifactId: principle.id, artifactType: 'EnterprisePrinciple',
      domain, payload: principle, emittedAt: new Date(),
    });

    prisma.waandaTrainingExample.create({ data: {
      exampleType:  'SYNTHESIS',
      system:       'KIMMP',
      curriculum:   'EXECUTIVE',
      trigger:      'cognition:principle_created',
      modelVersion: 'claude-haiku-4-5-20251001',
      systemPrompt: SYSTEM_PRINCIPLE,
      userPrompt,
      completion:   JSON.stringify({ statement, rationale }),
      alpacaFormat: { instruction: SYSTEM_PRINCIPLE, input: userPrompt, output: JSON.stringify({ statement, rationale }) },
    } }).catch(() => null);

    return principle;
  }

  private static async _buildPlaybook(principles: any[], mode: string): Promise<any | null> {
    const domain     = principles[0].domain;
    const userPrompt = principles.map((p, i) => `Principle ${i + 1}: ${p.statement}`).join('\n');

    let title = `${domain.charAt(0).toUpperCase() + domain.slice(1)} Playbook`;
    let steps: string[] = principles.map(p => p.statement);

    try {
      const res    = await haiku(SYSTEM_PLAYBOOK, userPrompt, 200, { hint: 'cognition-playbook' });
      const parsed = JSON.parse(textOf(res).trim());
      if (parsed.title) title = parsed.title;
      if (Array.isArray(parsed.steps)) steps = parsed.steps;
    } catch { /* degrade */ }

    const avgConf       = principles.reduce((s, p) => s + p.confidence, 0) / principles.length;
    const promotionMode = mode === 'BOOTSTRAP' ? 'BOOTSTRAP' : 'GOVERNED';
    const promotionStatus = mode === 'BOOTSTRAP' ? 'APPROVED' : 'CANDIDATE';
    const eventType     = mode === 'BOOTSTRAP' ? 'playbook_created' : 'playbook_candidate' as any;

    const playbook = await (prisma as any).enterprisePlaybook.create({
      data: {
        domain, title, steps,
        confidence:    Math.min(avgConf + 0.05, 0.95),
        evidenceCount: principles.reduce((s: number, p: any) => s + p.evidenceCount, 0),
        promotionMode, promotionStatus, status: 'ACTIVE',
      },
    });

    await Promise.all(principles.map(p =>
      (prisma as any).enterprisePlaybookPrinciple.upsert({
        where:  { playbookId_principleId: { playbookId: playbook.id, principleId: p.id } },
        update: {},
        create: { playbookId: playbook.id, principleId: p.id },
      }).catch(() => null)
    ));

    await (prisma as any).enterprisePrinciple.updateMany({
      where: { id: { in: principles.map((p: any) => p.id) } },
      data:  { promotedAt: new Date() },
    });

    cognitionBus.publish({
      type: eventType, artifactId: playbook.id, artifactType: 'EnterprisePlaybook',
      domain, payload: playbook, emittedAt: new Date(),
    });

    prisma.waandaTrainingExample.create({ data: {
      exampleType:  'SYNTHESIS',
      system:       'KIMMP',
      curriculum:   'EXECUTIVE',
      trigger:      'cognition:playbook_created',
      modelVersion: 'claude-haiku-4-5-20251001',
      systemPrompt: SYSTEM_PLAYBOOK,
      userPrompt,
      completion:   JSON.stringify({ title, steps }),
      alpacaFormat: { instruction: SYSTEM_PLAYBOOK, input: userPrompt, output: JSON.stringify({ title, steps }) },
    } }).catch(() => null);

    return playbook;
  }

  static async tree(domain: string): Promise<any> {
    const [evidence, observations, lessons, insights, patterns, principles, playbooks] =
      await Promise.all([
        (prisma as any).enterpriseEvidence.findMany({ where: { domain }, orderBy: { createdAt: 'desc' }, take: 20 }),
        (prisma as any).enterpriseObservation.findMany({ where: { domain }, orderBy: { createdAt: 'desc' }, take: 20 }),
        (prisma as any).enterpriseLesson.findMany({ where: { domain }, orderBy: { confidence: 'desc' }, take: 20 }),
        (prisma as any).enterpriseInsight.findMany({ where: { domain }, orderBy: { confidence: 'desc' }, take: 10 }),
        (prisma as any).enterprisePattern.findMany({ where: { domain }, orderBy: { frequency: 'desc' }, take: 10 }),
        (prisma as any).enterprisePrinciple.findMany({ where: { domain, status: 'ACTIVE' }, orderBy: { confidence: 'desc' }, take: 10 }),
        (prisma as any).enterprisePlaybook.findMany({ where: { domain, status: 'ACTIVE' }, orderBy: { confidence: 'desc' }, take: 5 }),
      ]);

    return { domain, evidence, observations, lessons, insights, patterns, principles, playbooks };
  }
}
