/**
 * Constitutional Law 10 — Brief Explainability
 * Every MorningBriefing generated must have all 6 content sections non-empty.
 * An unexplained briefing is a black box — WAANDA must always show its reasoning.
 *
 * MorningBriefing stores columns directly: para1Health, para2Focus, para3Trust,
 * para4Learning, para5Policy, para6Actions — not a JSON content blob.
 */

import { prisma } from '../../../../lib/prisma';

const REQUIRED_COLUMNS = [
  'para1Health',
  'para2Focus',
  'para3Trust',
  'para4Learning',
  'para5Policy',
  'para6Actions',
] as const;

describe('Constitutional Law 10 — Brief Explainability', () => {
  beforeAll(() => prisma.$connect());
  afterAll(()  => prisma.$disconnect());

  test('the most recent MorningBriefing must have all 6 paragraphs non-empty', async () => {
    const brief = await (prisma as any).morningBriefing.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    // No brief yet — vacuously pass (Customer Zero hasn't generated one)
    if (!brief) return;

    const empty: string[] = [];
    for (const col of REQUIRED_COLUMNS) {
      const val: string = brief[col] ?? '';
      if (val.trim().length < 10) empty.push(col);
    }

    if (empty.length) {
      console.error(`[Constitution-10] Briefing ${brief.id} has empty paragraphs: ${empty.join(', ')}`);
    }

    expect(empty).toHaveLength(0);
  });
});
