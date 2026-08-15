/**
 * Constitutional Law 9 — ETI Reproducibility
 * computeETI() is a pure function of DB state.
 * Two consecutive calls on the same snapshot must return identical results.
 * A different result means it has a hidden side-effect or non-determinism.
 */

import { TrustEngine } from '../trustEngine';
import { prisma }      from '../../../../lib/prisma';

describe('Constitutional Law 9 — ETI Reproducibility', () => {
  beforeAll(() => prisma.$connect());
  afterAll(()  => prisma.$disconnect());

  test('TrustEngine.getETI() returns the same result on two consecutive calls', async () => {
    const r1 = await TrustEngine.getETI();
    const r2 = await TrustEngine.getETI();

    // Strip volatile timestamp fields before comparing
    const clean = (r: typeof r1) => {
      const { computedAt: _ca, ...rest } = r as any;
      return rest;
    };

    expect(clean(r1)).toEqual(clean(r2));
  });
});
