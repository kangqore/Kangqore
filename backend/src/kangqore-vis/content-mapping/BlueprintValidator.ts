import type { KangqoreVisPageBlueprint } from '@prisma/client';

export interface ValidationFailure {
  field: string;
  message: string;
}

const REQUIRED_FOR_PUBLISH: Array<keyof KangqoreVisPageBlueprint> = [
  'pageName',
  'url',
  'pageType',
  'primaryKeyword',
  'metaTitle',
  'metaDescription',
  'targetBuyer',
  'searchIntent',
  'problemSolved',
  'businessOutcome',
];

export class BlueprintValidator {
  static validate(blueprint: Partial<KangqoreVisPageBlueprint>, target: 'draft' | 'publish' = 'publish') {
    const failures: ValidationFailure[] = [];
    if (target === 'draft') {
      if (!blueprint.pageName) failures.push({ field: 'pageName', message: 'pageName required' });
      if (!blueprint.url) failures.push({ field: 'url', message: 'url required' });
      return { passed: failures.length === 0, failures };
    }

    for (const field of REQUIRED_FOR_PUBLISH) {
      const v = blueprint[field];
      if (v === undefined || v === null || v === '') {
        failures.push({ field: String(field), message: `${String(field)} required for publish` });
      }
    }

    return { passed: failures.length === 0, failures };
  }
}
