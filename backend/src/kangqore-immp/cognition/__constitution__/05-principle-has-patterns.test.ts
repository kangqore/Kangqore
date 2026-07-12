/**
 * Constitutional Law 5 — Principle ← Pattern Lineage
 * Every ACTIVE EnterprisePrinciple must have at least one linked pattern
 * in the EnterprisePrinciplePattern join table.
 * Principles with no pattern evidence are architectural violations —
 * they are beliefs, not intelligence.
 */

import { prisma } from '../../../lib/prisma';

describe('Constitutional Law 5 — Principle Has Patterns', () => {
  beforeAll(() => prisma.$connect());
  afterAll(()  => prisma.$disconnect());

  test('all ACTIVE principles must have at least one linked pattern', async () => {
    const principles = await (prisma as any).enterprisePrinciple.findMany({
      where:   { status: 'ACTIVE' },
      select:  { id: true, statement: true, patterns: { select: { patternId: true } } },
    });

    const violated = principles.filter((p: any) =>
      !Array.isArray(p.patterns) || p.patterns.length === 0
    );

    if (violated.length) {
      console.error(
        '[Constitution-05] Principles with no source patterns:',
        violated.map((p: any) => `${p.id}: "${p.statement?.slice(0, 60)}"`).join('\n')
      );
    }

    expect(violated).toHaveLength(0);
  });
});
