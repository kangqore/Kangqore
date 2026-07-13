/**
 * Constitutional Law 7 — Policy ← Lesson Lineage
 * Every ACTIVE PolicyEvolution must trace back to either a lessonId or a
 * principleId. Policies without either source are unsupported assertions.
 */

import { prisma } from '../../../lib/prisma';

describe('Constitutional Law 7 — Policy Has Lesson or Principle', () => {
  beforeAll(() => prisma.$connect());
  afterAll(()  => prisma.$disconnect());

  test('all ACTIVE policies must have a lessonId or principleId', async () => {
    const policies = await (prisma as any).policyEvolution.findMany({
      where:  { status: 'ACTIVE' },
      select: { id: true, domain: true, statement: true, lessonId: true, principleId: true },
    });

    const violated = policies.filter((p: any) => !p.lessonId && !p.principleId);

    if (violated.length) {
      console.error(
        '[Constitution-07] Policies with no source:',
        violated.map((p: any) => `${p.id} [${p.domain}]: "${p.statement?.slice(0, 60)}"`).join('\n')
      );
    }

    expect(violated).toHaveLength(0);
  });
});
