// ─── Data Architecture Invariants Test ─────────────────────────────────────────
// Guards the 6-Practices × 61-Services canonical architecture.
//
// These tests must pass in CI. If they fail, the data files have drifted —
// fix the data, not the test.
//
// See: /Users/maheshkumar/.claude/plans/act-as-the-lead-curious-starlight.md
//      Section 19.5 for the invariants engineering must enforce.
// ────────────────────────────────────────────────────────────────────────────────

import {
  practicesData,
  practicesList,
} from '../practicesData';

import {
  servicesData,
  servicesList,
  servicesByPractice,
} from '../servicesData';

const EXPECTED_TOTAL_SERVICES = 61;
const EXPECTED_PRACTICES = 6;

const EXPECTED_COUNTS = {
  cognition: 11,
  foundry: 17,
  reimagine: 12,
  shield: 5,
  platforms: 8,
  growth: 8,
};

describe('Data architecture — 6 Practices × 61 Services', () => {

  test('practicesList has exactly 6 practices', () => {
    expect(practicesList).toHaveLength(EXPECTED_PRACTICES);
  });

  test('every practice slug in practicesList exists in practicesData', () => {
    practicesList.forEach((slug) => {
      expect(practicesData[slug]).toBeDefined();
      expect(practicesData[slug].slug).toBe(slug);
    });
  });

  test('servicesList has exactly 61 services', () => {
    expect(servicesList).toHaveLength(EXPECTED_TOTAL_SERVICES);
  });

  test('every service has a valid practiceSlug pointing to a known practice', () => {
    servicesList.forEach((slug) => {
      const svc = servicesData[slug];
      expect(svc).toBeDefined();
      expect(svc.slug).toBe(slug);
      expect(practicesList).toContain(svc.practiceSlug);
    });
  });

  test('each practice.serviceCount matches its serviceSlugs.length', () => {
    practicesList.forEach((practiceSlug) => {
      const practice = practicesData[practiceSlug];
      expect(practice.serviceCount).toBe(practice.serviceSlugs.length);
    });
  });

  test('each practice has the expected service count', () => {
    Object.entries(EXPECTED_COUNTS).forEach(([practiceSlug, expectedCount]) => {
      expect(practicesData[practiceSlug].serviceCount).toBe(expectedCount);
    });
  });

  test('sum of all practice service counts equals 61', () => {
    const sum = practicesList.reduce(
      (total, slug) => total + practicesData[slug].serviceCount,
      0
    );
    expect(sum).toBe(EXPECTED_TOTAL_SERVICES);
  });

  test('every serviceSlug in a practice exists in servicesData', () => {
    practicesList.forEach((practiceSlug) => {
      practicesData[practiceSlug].serviceSlugs.forEach((svcSlug) => {
        expect(servicesData[svcSlug]).toBeDefined();
      });
    });
  });

  test('every service in servicesByPractice matches its canonical practiceSlug', () => {
    Object.entries(servicesByPractice).forEach(([practiceSlug, svcSlugs]) => {
      svcSlugs.forEach((svcSlug) => {
        expect(servicesData[svcSlug].practiceSlug).toBe(practiceSlug);
      });
    });
  });

  test('servicesByPractice counts match practicesData counts', () => {
    practicesList.forEach((practiceSlug) => {
      const expected = practicesData[practiceSlug].serviceCount;
      const actual = servicesByPractice[practiceSlug].length;
      expect(actual).toBe(expected);
    });
  });

  test('practicesData.serviceSlugs is a permutation of servicesByPractice (same set, order may differ)', () => {
    practicesList.forEach((practiceSlug) => {
      const fromPractices = [...practicesData[practiceSlug].serviceSlugs].sort();
      const fromServices = [...servicesByPractice[practiceSlug]].sort();
      expect(fromServices).toEqual(fromPractices);
    });
  });

  test('every relatedServiceSlugs entry references a real service', () => {
    servicesList.forEach((svcSlug) => {
      const svc = servicesData[svcSlug];
      (svc.relatedServiceSlugs || []).forEach((relatedSlug) => {
        expect(servicesData[relatedSlug]).toBeDefined();
      });
    });
  });

  test('no service references itself in relatedServiceSlugs', () => {
    servicesList.forEach((svcSlug) => {
      const related = servicesData[svcSlug].relatedServiceSlugs || [];
      expect(related).not.toContain(svcSlug);
    });
  });

  test('every service has the required core fields', () => {
    const required = [
      'slug',
      'name',
      'practiceSlug',
      'bannerBrand',
      'shortDescription',
      'fullDescription',
      'keyFeatures',
    ];
    servicesList.forEach((svcSlug) => {
      const svc = servicesData[svcSlug];
      required.forEach((field) => {
        expect(svc[field]).toBeDefined();
        if (typeof svc[field] === 'string') {
          expect(svc[field].length).toBeGreaterThan(0);
        }
      });
      expect(Array.isArray(svc.keyFeatures)).toBe(true);
      expect(svc.keyFeatures.length).toBeGreaterThan(0);
    });
  });

  test('every practice has the required core fields', () => {
    const required = [
      'slug',
      'name',
      'shortName',
      'tagline',
      'description',
      'bannerBrand',
      'icon',
      'accentColor',
      'serviceCount',
      'serviceSlugs',
    ];
    practicesList.forEach((practiceSlug) => {
      const practice = practicesData[practiceSlug];
      required.forEach((field) => {
        expect(practice[field]).toBeDefined();
      });
      expect(Array.isArray(practice.serviceSlugs)).toBe(true);
    });
  });

  test('each service inherits its practice bannerBrand', () => {
    servicesList.forEach((svcSlug) => {
      const svc = servicesData[svcSlug];
      const practice = practicesData[svc.practiceSlug];
      expect(svc.bannerBrand).toBe(practice.bannerBrand);
    });
  });

  test('all service slugs are kebab-case (lowercase letters, digits, hyphens only)', () => {
    const kebabRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    servicesList.forEach((slug) => {
      expect(slug).toMatch(kebabRe);
    });
  });

  test('all practice slugs are kebab-case', () => {
    const kebabRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    practicesList.forEach((slug) => {
      expect(slug).toMatch(kebabRe);
    });
  });
});
