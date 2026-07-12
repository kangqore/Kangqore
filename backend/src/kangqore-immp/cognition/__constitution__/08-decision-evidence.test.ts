/**
 * Constitutional Law 8 — Decision Evidence
 * Every APPROVED KimmpDecision must have non-empty evidence.
 * Approvals without evidence are arbitrary — WAANDA must show its work.
 */

import { prisma } from '../../../lib/prisma';

describe('Constitutional Law 8 — Decision Evidence', () => {
  beforeAll(() => prisma.$connect());
  afterAll(()  => prisma.$disconnect());

  test('all APPROVED decisions must have evidence', async () => {
    const approved = await (prisma as any).kimmpDecision.findMany({
      where:  { status: 'APPROVED' },
      select: { id: true, decisionType: true, evidence: true, reasoning: true },
    });

    const noEvidence = approved.filter((d: any) => {
      const ev = d.evidence;
      if (!ev) return true;
      if (Array.isArray(ev) && ev.length === 0) return true;
      if (typeof ev === 'object' && Object.keys(ev).length === 0) return true;
      return false;
    });

    if (noEvidence.length) {
      console.error(
        '[Constitution-08] Approved decisions with no evidence:',
        noEvidence.map((d: any) => `${d.id} [${d.decisionType}]`).join(', ')
      );
    }

    expect(noEvidence).toHaveLength(0);
  });
});
