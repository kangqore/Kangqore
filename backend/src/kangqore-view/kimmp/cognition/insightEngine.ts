// ---------------------------------------------------------------------------
// Insight Engine — Level 3
// What multiple lessons collectively suggest.
// Clusters lessons by domain+tags and synthesizes an Insight when ≥3 share
// sufficient tag overlap. One Haiku call per insight synthesis.
// ---------------------------------------------------------------------------

import { prisma }        from '../../../lib/prisma';
import { haiku, textOf } from '../llm/kimmpLLMRouter';
import { cognitionBus }  from './cognitionBus';

const SYSTEM_INSIGHT =
  'You are WAANDA. Given multiple enterprise lessons from the same domain, synthesize a single ' +
  'collective insight that captures what they collectively suggest. ' +
  'Reply in JSON: {"insight":"...(one sentence)"}. No markdown.';

const INSIGHT_LESSON_THRESHOLD = 3;

function tagOverlap(a: string[], b: string[]): number {
  const setA = new Set(a);
  return b.filter(t => setA.has(t)).length;
}

export class InsightEngine {
  static async checkAndSynthesize(lessonId: string): Promise<any | null> {
    const lesson = await (prisma as any).enterpriseLesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return null;

    // Find all lessons in same domain with tag overlap ≥ 2
    const candidates: any[] = await (prisma as any).enterpriseLesson.findMany({
      where: {
        domain:    lesson.domain,
        promotedAt: null,
        id:        { not: lessonId },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const related = candidates.filter(c => tagOverlap(c.tags ?? [], lesson.tags ?? []) >= 2);
    if (related.length < INSIGHT_LESSON_THRESHOLD - 1) return null; // not enough similar lessons

    const group = [lesson, ...related.slice(0, 4)];
    const userPrompt = group.map((l, i) => `Lesson ${i + 1}: ${l.lesson}`).join('\n');

    let insightText = `Multiple ${lesson.domain} events suggest a recurring pattern.`;
    try {
      const res  = await haiku(SYSTEM_INSIGHT, userPrompt, 100, { hint: 'cognition-insight' });
      const text = textOf(res).trim();
      const parsed = JSON.parse(text);
      if (parsed.insight) insightText = parsed.insight;
    } catch { /* degrade */ }

    const avgConf = group.reduce((s, l) => s + (l.confidence ?? 0.5), 0) / group.length;

    const insight = await (prisma as any).enterpriseInsight.create({
      data: {
        domain:       lesson.domain,
        insight:      insightText,
        confidence:   Math.min(avgConf + 0.05, 0.95),
        evidenceCount: group.length,
        tags:          [...new Set(group.flatMap((l: any) => l.tags ?? []))],
      },
    });

    // Wire junctions
    await Promise.all(
      group.map(l =>
        (prisma as any).enterpriseLessonInsight.upsert({
          where:  { lessonId_insightId: { lessonId: l.id, insightId: insight.id } },
          update: {},
          create: { lessonId: l.id, insightId: insight.id },
        }).catch(() => null)
      )
    );

    // Mark lessons as promoted
    await (prisma as any).enterpriseLesson.updateMany({
      where: { id: { in: group.map((l: any) => l.id) } },
      data:  { promotedAt: new Date() },
    });

    cognitionBus.publish({
      type:        'insight_created',
      artifactId:  insight.id,
      artifactType: 'EnterpriseInsight',
      domain:      insight.domain,
      payload:     insight,
      emittedAt:   new Date(),
    });

    // Gen 2 training capture
    prisma.waandaTrainingExample.create({ data: {
      exampleType:  'SYNTHESIS',
      system:       'KIMMP',
      curriculum:   'EXECUTIVE',
      trigger:      'cognition:insight_created',
      modelVersion: 'claude-haiku-4-5-20251001',
      systemPrompt: SYSTEM_INSIGHT,
      userPrompt,
      completion:   JSON.stringify({ insight: insightText }),
      alpacaFormat: { instruction: SYSTEM_INSIGHT, input: userPrompt, output: JSON.stringify({ insight: insightText }) },
    } }).catch(() => null);

    return insight;
  }

  static async listByDomain(domain: string, limit = 10): Promise<any[]> {
    return (prisma as any).enterpriseInsight.findMany({
      where:   { domain },
      orderBy: { createdAt: 'desc' },
      take:    limit,
    });
  }
}
