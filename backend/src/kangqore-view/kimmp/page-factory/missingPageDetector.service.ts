// ---------------------------------------------------------------------------
// KIMMP Page Factory — Missing Page Detector (PR-B)
//
// Scans eQORE conversation history for recurring visitor questions and turns
// each cluster into a KimmpPageOpportunity — a candidate page for an admin to
// review. KIMMP never creates a page itself; it only surfaces the opportunity.
//
// Priority uses a Fibonacci-style tiering ("Growth Sequencer" idea): business
// signal is not linear, so a question asked 13× outranks one asked 3× by far
// more than 4:1.
//
// Note: this detector is signal-gated — pre-launch, with little real eQORE
// traffic, it will find few or no opportunities. That is expected; the ledger
// and scan are ready for when real conversations exist.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';
import logger from '../../../utils/logger';

const QUESTION_RE = /\?|\b(how|what|can you|do you|does|which|when|where|why|is there|are you)\b/i;

/** Normalize a question so near-identical phrasings cluster together. */
function normalizeQuestion(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Derive a candidate slug from a question. */
function slugFromQuestion(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8)
    .join('-')
    .slice(0, 80);
}

/** Fibonacci-tiered priority — signal is not linear. */
function fibPriority(count: number): { priority: number; label: string } {
  if (count >= 21) return { priority: 34, label: 'Executive priority' };
  if (count >= 13) return { priority: 21, label: 'Strategic opportunity' };
  if (count >= 8) return { priority: 13, label: 'Strong demand' };
  if (count >= 5) return { priority: 8, label: 'Active interest' };
  if (count >= 3) return { priority: 5, label: 'Emerging interest' };
  if (count >= 2) return { priority: 3, label: 'Low signal' };
  return { priority: 2, label: 'Single mention' };
}

export interface ScanResult {
  conversationsScanned: number;
  questionsClustered: number;
  opportunitiesUpserted: number;
}

export class MissingPageDetector {
  /** Scan recent eQORE conversations and upsert page opportunities. */
  static async scan(opts?: { conversationLimit?: number; minSignals?: number }): Promise<ScanResult> {
    const limit = opts?.conversationLimit ?? 500;
    const minSignals = opts?.minSignals ?? 1;

    const conversations = await prisma.eqoreConversation.findMany({
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        messages: { where: { role: 'USER' }, orderBy: { createdAt: 'asc' } },
      },
    });

    // Cluster questions across conversations by normalized text.
    const groups = new Map<string, { sample: string; count: number }>();
    for (const conv of conversations) {
      for (const m of conv.messages) {
        const text = (m.content || '').trim();
        if (text.length < 8 || !QUESTION_RE.test(text)) continue;
        const key = normalizeQuestion(text);
        if (!key) continue;
        const g = groups.get(key);
        if (g) g.count += 1;
        else groups.set(key, { sample: text, count: 1 });
      }
    }

    let upserted = 0;
    for (const group of groups.values()) {
      if (group.count < minSignals) continue;
      const slug = slugFromQuestion(group.sample);
      if (!slug) continue;
      const { priority, label } = fibPriority(group.count);

      try {
        await (prisma as any).kimmpPageOpportunity.upsert({
          where: { suggestedSlug: slug },
          // Refresh signal/priority on re-scan; never overrides admin status.
          update: {
            signalCount: group.count,
            priority,
            priorityLabel: label,
            sampleQuestion: group.sample,
            sourceReason: `Asked in ${group.count} conversation(s)`,
          },
          create: {
            title: group.sample.slice(0, 160),
            suggestedSlug: slug,
            pageType: 'faq',
            sourceModule: 'eqore',
            sourceReason: `Asked in ${group.count} conversation(s)`,
            sampleQuestion: group.sample,
            signalCount: group.count,
            priority,
            priorityLabel: label,
            status: 'OPEN',
          },
        });
        upserted += 1;
      } catch (error) {
        logger.warn(
          'KIMMP opportunity not stored (apply the migration / check the DB): ' +
            (error as Error).message
        );
      }
    }

    return {
      conversationsScanned: conversations.length,
      questionsClustered: groups.size,
      opportunitiesUpserted: upserted,
    };
  }

  /** List opportunities, most-impactful first. */
  static list(status?: string) {
    return (prisma as any).kimmpPageOpportunity.findMany({
      where: status ? { status } : {},
      orderBy: [{ priority: 'desc' }, { signalCount: 'desc' }],
    });
  }

  /** Update an opportunity's status (OPEN | DISMISSED | CONVERTED). */
  static setStatus(id: string, status: string) {
    return (prisma as any).kimmpPageOpportunity.update({
      where: { id },
      data: { status },
    });
  }
}
