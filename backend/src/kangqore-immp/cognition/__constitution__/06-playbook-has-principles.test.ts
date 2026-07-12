/**
 * Constitutional Law 6 — Playbook ← Principle Lineage
 * Every ACTIVE EnterprisePlaybook must have at least one linked principle
 * in the EnterprisePlaybookPrinciple join table.
 * A playbook not grounded in principle is an arbitrary list of steps —
 * not enterprise intelligence.
 */

import { prisma } from '../../../lib/prisma';

describe('Constitutional Law 6 — Playbook Has Principles', () => {
  beforeAll(() => prisma.$connect());
  afterAll(()  => prisma.$disconnect());

  test('all ACTIVE playbooks must have at least one linked principle', async () => {
    const playbooks = await (prisma as any).enterprisePlaybook.findMany({
      where:  { status: 'ACTIVE' },
      select: { id: true, title: true, principles: { select: { principleId: true } } },
    });

    const violated = playbooks.filter((p: any) =>
      !Array.isArray(p.principles) || p.principles.length === 0
    );

    if (violated.length) {
      console.error(
        '[Constitution-06] Playbooks with no source principles:',
        violated.map((p: any) => `${p.id}: "${p.title}"`).join('\n')
      );
    }

    expect(violated).toHaveLength(0);
  });
});
