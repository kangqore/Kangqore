// ─── Data Architecture Invariants Test ─────────────────────────────────────────
// Guards the 6-Departments × 61-Services canonical architecture.
//
// These tests must pass in CI. If they fail, the data files have drifted —
// fix the data, not the test.
//
// See: /Users/maheshkumar/.claude/plans/act-as-the-lead-curious-starlight.md
//      Section 19.5 for the invariants engineering must enforce.
// ────────────────────────────────────────────────────────────────────────────────

import {
  departmentsData,
  departmentsList,
} from '../departmentsData';

import {
  servicesData,
  servicesList,
  servicesByDepartment,
} from '../servicesData';

const EXPECTED_TOTAL_SERVICES = 61;
const EXPECTED_DEPARTMENTS = 6;

const EXPECTED_COUNTS = {
  cognition: 11,
  foundry: 17,
  reimagine: 12,
  shield: 5,
  platforms: 8,
  growth: 8,
};

describe('Data architecture — 6 Departments × 61 Services', () => {

  test('departmentsList has exactly 6 departments', () => {
    expect(departmentsList).toHaveLength(EXPECTED_DEPARTMENTS);
  });

  test('every department slug in departmentsList exists in departmentsData', () => {
    departmentsList.forEach((slug) => {
      expect(departmentsData[slug]).toBeDefined();
      expect(departmentsData[slug].slug).toBe(slug);
    });
  });

  test('servicesList has exactly 61 services', () => {
    expect(servicesList).toHaveLength(EXPECTED_TOTAL_SERVICES);
  });

  test('every service has a valid departmentSlug pointing to a known department', () => {
    servicesList.forEach((slug) => {
      const svc = servicesData[slug];
      expect(svc).toBeDefined();
      expect(svc.slug).toBe(slug);
      expect(departmentsList).toContain(svc.departmentSlug);
    });
  });

  test('each department.serviceCount matches its serviceSlugs.length', () => {
    departmentsList.forEach((departmentSlug) => {
      const department = departmentsData[departmentSlug];
      expect(department.serviceCount).toBe(department.serviceSlugs.length);
    });
  });

  test('each department has the expected service count', () => {
    Object.entries(EXPECTED_COUNTS).forEach(([departmentSlug, expectedCount]) => {
      expect(departmentsData[departmentSlug].serviceCount).toBe(expectedCount);
    });
  });

  test('sum of all department service counts equals 61', () => {
    const sum = departmentsList.reduce(
      (total, slug) => total + departmentsData[slug].serviceCount,
      0
    );
    expect(sum).toBe(EXPECTED_TOTAL_SERVICES);
  });

  test('every serviceSlug in a department exists in servicesData', () => {
    departmentsList.forEach((departmentSlug) => {
      departmentsData[departmentSlug].serviceSlugs.forEach((svcSlug) => {
        expect(servicesData[svcSlug]).toBeDefined();
      });
    });
  });

  test('every service in servicesByDepartment matches its canonical departmentSlug', () => {
    Object.entries(servicesByDepartment).forEach(([departmentSlug, svcSlugs]) => {
      svcSlugs.forEach((svcSlug) => {
        expect(servicesData[svcSlug].departmentSlug).toBe(departmentSlug);
      });
    });
  });

  test('servicesByDepartment counts match departmentsData counts', () => {
    departmentsList.forEach((departmentSlug) => {
      const expected = departmentsData[departmentSlug].serviceCount;
      const actual = servicesByDepartment[departmentSlug].length;
      expect(actual).toBe(expected);
    });
  });

  test('departmentsData.serviceSlugs is a permutation of servicesByDepartment (same set, order may differ)', () => {
    departmentsList.forEach((departmentSlug) => {
      const fromDepartments = [...departmentsData[departmentSlug].serviceSlugs].sort();
      const fromServices = [...servicesByDepartment[departmentSlug]].sort();
      expect(fromServices).toEqual(fromDepartments);
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
      'departmentSlug',
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

  test('every department has the required core fields', () => {
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
    departmentsList.forEach((departmentSlug) => {
      const department = departmentsData[departmentSlug];
      required.forEach((field) => {
        expect(department[field]).toBeDefined();
      });
      expect(Array.isArray(department.serviceSlugs)).toBe(true);
    });
  });

  test('each service inherits its department bannerBrand', () => {
    servicesList.forEach((svcSlug) => {
      const svc = servicesData[svcSlug];
      const department = departmentsData[svc.departmentSlug];
      expect(svc.bannerBrand).toBe(department.bannerBrand);
    });
  });

  test('all service slugs are kebab-case (lowercase letters, digits, hyphens only)', () => {
    const kebabRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    servicesList.forEach((slug) => {
      expect(slug).toMatch(kebabRe);
    });
  });

  test('all department slugs are kebab-case', () => {
    const kebabRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    departmentsList.forEach((slug) => {
      expect(slug).toMatch(kebabRe);
    });
  });
});
