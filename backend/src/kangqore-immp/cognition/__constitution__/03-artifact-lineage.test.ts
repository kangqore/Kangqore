/**
 * Constitutional Law 3 — Artifact Lineage
 * Every EnterpriseLesson must trace back to a CognitionEvent via an
 * EnterpriseObservation. The chain is:
 *   EvidenceLedger → EnterpriseObservation → EnterpriseLesson (via observationId)
 *
 * Lessons without an observationId are orphaned — they cannot be traced
 * to any decision or operational event that caused them.
 */

import { prisma } from '../../../lib/prisma';

describe('Constitutional Law 3 — Artifact Lineage', () => {
  beforeAll(() => prisma.$connect());
  afterAll(()  => prisma.$disconnect());

  test('all EnterpriseLesson rows must have an observationId (tracing back to a decision)', async () => {
    const orphans = await (prisma as any).enterpriseLesson.findMany({
      where:  { observationId: null },
      select: { id: true, domain: true, createdAt: true },
    });

    if (orphans.length > 0) {
      console.error(
        '[Constitution-03] Orphaned lessons (no observationId):',
        orphans.map((o: any) => `${o.id} (${o.domain})`).join(', ')
      );
    }

    expect(orphans.length).toBe(0);
  });
});
