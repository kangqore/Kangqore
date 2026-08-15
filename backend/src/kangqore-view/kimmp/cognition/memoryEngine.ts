// ---------------------------------------------------------------------------
// Memory Engine — Enterprise Recall & Retrieval
// Owns enterprise recall, not storage. The only writer is the cognition pipeline.
// ---------------------------------------------------------------------------

import { prisma }        from '../../../lib/prisma';
import { haiku, textOf } from '../llm/kimmpLLMRouter';

export interface MemoryQuery {
  domain?:    string;
  tier?:      string;
  tags?:      string[];
  isPositive?: boolean;
  limit?:     number;
}

export interface MemorySearchResult {
  type:       'observation' | 'lesson' | 'insight' | 'principle';
  id:         string;
  domain:     string;
  content:    string;
  confidence: number;
  createdAt:  Date;
}

export class MemoryEngine {
  static async recall(query: MemoryQuery): Promise<any[]> {
    const { domain, tier, tags, limit = 20 } = query;

    const where: any = {};
    if (domain) where.domain = domain;
    if (tier)   where.tier   = tier;
    if (tags?.length) where.tags = { hasSome: tags };

    return (prisma as any).enterpriseLesson.findMany({
      where,
      orderBy: [{ confidence: 'desc' }, { createdAt: 'desc' }],
      take:    limit,
      include: { observation: true },
    });
  }

  static async search(text: string, limit = 10): Promise<MemorySearchResult[]> {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);

    const results: MemorySearchResult[] = [];

    // Search lessons
    const lessons: any[] = await (prisma as any).enterpriseLesson.findMany({
      where:   { lesson: { contains: words[0] ?? text, mode: 'insensitive' } },
      orderBy: { confidence: 'desc' },
      take:    limit,
    });
    lessons.forEach(l => results.push({
      type: 'lesson', id: l.id, domain: l.domain,
      content: l.lesson, confidence: l.confidence, createdAt: l.createdAt,
    }));

    // Search observations
    const observations: any[] = await (prisma as any).enterpriseObservation.findMany({
      where:   { whatHappened: { contains: words[0] ?? text, mode: 'insensitive' } },
      orderBy: { confidence: 'desc' },
      take:    Math.ceil(limit / 2),
    });
    observations.forEach(o => results.push({
      type: 'observation', id: o.id, domain: o.domain,
      content: o.whatHappened, confidence: o.confidence, createdAt: o.createdAt,
    }));

    // Search principles
    const principles: any[] = await (prisma as any).enterprisePrinciple.findMany({
      where:   { statement: { contains: words[0] ?? text, mode: 'insensitive' }, status: 'ACTIVE' },
      orderBy: { confidence: 'desc' },
      take:    Math.ceil(limit / 2),
    });
    principles.forEach(p => results.push({
      type: 'principle', id: p.id, domain: p.domain,
      content: p.statement, confidence: p.confidence, createdAt: p.createdAt,
    }));

    return results.sort((a, b) => b.confidence - a.confidence).slice(0, limit);
  }

  static async summarize(domain: string): Promise<string> {
    const lessons: any[] = await (prisma as any).enterpriseLesson.findMany({
      where:   { domain },
      orderBy: { confidence: 'desc' },
      take:    5,
    });

    if (!lessons.length) return `No lessons recorded for ${domain} yet.`;

    const context = lessons.map((l, i) => `${i + 1}. ${l.lesson}`).join('\n');
    const system  = 'You are WAANDA. Summarize these enterprise lessons into one paragraph for an executive. Max 60 words. No markdown.';

    try {
      const res  = await haiku(system, `Domain: ${domain}\n${context}`, 80, { hint: 'memory-summarize' });
      const text = textOf(res).trim();
      if (text) return text;
    } catch { /* degrade */ }

    return lessons[0].lesson;
  }

  static async cluster(tag: string): Promise<any[][]> {
    const lessons: any[] = await (prisma as any).enterpriseLesson.findMany({
      where:   { tags: { has: tag } },
      orderBy: { createdAt: 'desc' },
      take:    50,
    });

    // Simple domain-based clustering
    const clusters: Record<string, any[]> = {};
    for (const l of lessons) {
      if (!clusters[l.domain]) clusters[l.domain] = [];
      clusters[l.domain].push(l);
    }
    return Object.values(clusters);
  }

  static async getTimeline(
    window: 'today' | 'yesterday' | 'week' | 'month',
    lens:   'Strategic' | 'Operational' | 'Learning' | 'Evolution',
  ): Promise<any[]> {
    const now  = new Date();
    const from = new Date();
    if (window === 'today')     from.setHours(0, 0, 0, 0);
    else if (window === 'yesterday') { from.setDate(from.getDate() - 1); from.setHours(0, 0, 0, 0); }
    else if (window === 'week') from.setDate(from.getDate() - 7);
    else                        from.setMonth(from.getMonth() - 1);

    const dateFilter = { gte: from, lte: now };

    if (lens === 'Strategic') {
      const items = await (prisma as any).enterpriseLesson.findMany({
        where:   { tier: { in: ['STRATEGIC', 'CRITICAL'] }, createdAt: dateFilter },
        orderBy: [{ confidence: 'desc' }, { createdAt: 'desc' }],
        take:    30,
      });
      return items.map((l: any) => ({ ...l, _type: 'lesson' }));
    }

    if (lens === 'Operational') {
      const items = await (prisma as any).enterpriseLesson.findMany({
        where:   { tier: 'OPERATIONAL', createdAt: dateFilter },
        orderBy: { createdAt: 'desc' },
        take:    30,
      });
      return items.map((l: any) => ({ ...l, _type: 'lesson' }));
    }

    if (lens === 'Evolution') {
      const items = await (prisma as any).policyEvolution.findMany({
        where:   { createdAt: dateFilter },
        orderBy: { createdAt: 'desc' },
        take:    30,
      });
      return items.map((p: any) => ({ ...p, _type: 'policy' }));
    }

    // Learning — mix of insights + patterns + principles
    const [insights, principles] = await Promise.all([
      (prisma as any).enterpriseInsight.findMany({ where: { createdAt: dateFilter }, orderBy: { createdAt: 'desc' }, take: 15 }),
      (prisma as any).enterprisePrinciple.findMany({ where: { createdAt: dateFilter, status: 'ACTIVE' }, orderBy: { createdAt: 'desc' }, take: 10 }),
    ]);

    return [
      ...insights.map((i: any) => ({ ...i, _type: 'insight' })),
      ...principles.map((p: any) => ({ ...p, _type: 'principle' })),
    ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
