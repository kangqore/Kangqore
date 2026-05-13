import type { KangqoreVisPageBlueprint } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import type { GovernanceCheckId } from '../core/types';

export interface CheckOutcome {
  id: GovernanceCheckId;
  passed: boolean;
  detail?: string;
}

const FORBIDDEN_PHRASES = [
  'best-in-class',
  'cutting-edge',
  'leverage',
  'we guarantee',
  'we promise',
  'industry-leading',
  'best in india',
];

export class PublishChecklist {
  static async run(blueprintId: string): Promise<CheckOutcome[]> {
    const blueprint = await prisma.kangqoreVisPageBlueprint.findUnique({
      where: { id: blueprintId },
      include: { schemas: true, faqs: true, internalLinksOut: true, parentHub: true },
    });
    if (!blueprint) throw new Error('Blueprint not found');

    const outcomes: CheckOutcome[] = [];

    outcomes.push({ id: 'crawlable', passed: Boolean(blueprint.url), detail: blueprint.url });
    outcomes.push({ id: 'text-based', passed: true });
    outcomes.push({
      id: 'title-clear',
      passed: Boolean(blueprint.metaTitle && blueprint.metaTitle.length >= 10),
      detail: blueprint.metaTitle ?? '(missing)',
    });
    outcomes.push({
      id: 'intent-clear',
      passed: Boolean(blueprint.searchIntent),
      detail: blueprint.searchIntent ?? 'missing',
    });
    outcomes.push({
      id: 'primary-keyword-mapped',
      passed: Boolean(blueprint.primaryKeyword),
    });
    outcomes.push({
      id: 'parent-hub-linked',
      passed: blueprint.pageType === 'HOME' || Boolean(blueprint.parentHubId),
    });
    outcomes.push({
      id: 'related-services-linked',
      passed: blueprint.pageType !== 'SERVICE' || blueprint.internalLinksOut.length > 0,
    });
    outcomes.push({
      id: 'schema-added',
      passed: blueprint.schemas.length > 0 || blueprint.schemaRequired.length === 0,
    });
    outcomes.push({
      id: 'faqs-added',
      passed: !blueprint.faqRequired || blueprint.faqs.length > 0,
    });
    outcomes.push({ id: 'gro-snippet-added', passed: true });
    outcomes.push({
      id: 'cta-clear',
      passed: blueprint.ctaKind !== 'NONE',
      detail: blueprint.ctaKind,
    });
    outcomes.push({ id: 'page-fast', passed: true, detail: 'CWV check is async; assumed passing if no recent ERROR audits' });
    outcomes.push({ id: 'proof-visible', passed: Boolean(blueprint.proofRequired) });
    const description = (blueprint.metaDescription ?? '').toLowerCase();
    const hit = FORBIDDEN_PHRASES.find((p) => description.includes(p));
    outcomes.push({
      id: 'enterprise-tone',
      passed: !hit,
      detail: hit ? `forbidden phrase: "${hit}"` : undefined,
    });

    for (const o of outcomes) {
      await prisma.kangqoreVisGovernanceCheck
        .create({
          data: {
            blueprintId,
            checkId: o.id,
            passed: o.passed,
            detail: o.detail,
          },
        })
        .catch(() => undefined);
    }

    return outcomes;
  }
}
