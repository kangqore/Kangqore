import { prisma } from '../../lib/prisma';

export interface UnansweredQuestion {
  question: string;
  conversationCount: number;
  lastAskedAt: Date;
}

export class UnansweredHarvester {
  static async topUnanswered(limit = 20): Promise<UnansweredQuestion[]> {
    const negativeFeedback = await prisma.conciergeFeedback.findMany({
      where: { rating: { in: ['negative', 'down', 'thumbs_down'] } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const conversationIds = Array.from(new Set(negativeFeedback.map((f) => f.conversationId)));
    if (conversationIds.length === 0) return [];

    const conversations = await prisma.conversation.findMany({
      where: { id: { in: conversationIds } },
    });

    const counts = new Map<string, { count: number; lastAt: Date }>();
    for (const conv of conversations) {
      const messages = (conv.messages as unknown as Array<{ role?: string; content?: string }>) ?? [];
      const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
      const text = lastUserMessage?.content?.trim();
      if (!text) continue;
      const existing = counts.get(text);
      if (existing) {
        existing.count++;
        if (conv.updatedAt > existing.lastAt) existing.lastAt = conv.updatedAt;
      } else {
        counts.set(text, { count: 1, lastAt: conv.updatedAt });
      }
    }

    return Array.from(counts.entries())
      .map(([question, v]) => ({ question, conversationCount: v.count, lastAskedAt: v.lastAt }))
      .sort((a, b) => b.conversationCount - a.conversationCount)
      .slice(0, limit);
  }
}
