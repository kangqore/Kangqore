// ---------------------------------------------------------------------------
// VIS Intelligence Kernel — Cross-Module Signal Layer
//
// One emitter per named capability. Each reads its own existing table, tags
// any row whose text matches a known KangqoreVisEntity (the shared theme
// backbone — see entityThemeMatcher.ts), and writes a CONTENT signal into
// the same Signal Ledger visSignalProducer.service.ts already uses. Rows
// that match no entity are skipped — an untagged signal can't contribute to
// the AUTHORITY_OPPORTUNITY correlation rule, so emitting it would just be
// noise in the ledger.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';
import { SignalLedger } from '../../kangqore-immp/signals/signalLedger.service';
import type { SignalIngestInput } from '../../kangqore-immp/signals/signalSchema';
import { matchEntitySlugs } from './entityThemeMatcher';

const LIMIT = 20;

async function emit(
  sourceModule: SignalIngestInput['sourceModule'],
  signalValue: string,
  entitySlugs: string[],
  extra: Record<string, unknown> = {},
): Promise<boolean> {
  if (entitySlugs.length === 0) return false;
  await SignalLedger.record({
    sourceModule,
    signalType: 'CAPABILITY_GAP',
    signalCategory: 'CONTENT',
    signalValue,
    confidence: 0.6,
    severity: 'LOW',
    metadata: { entitySlugs, ...extra },
  });
  return true;
}

export async function emitEntityArchitectureSignals(): Promise<number> {
  const rows = await prisma.kangqoreVisEntity.findMany({
    where: { category: { not: null } },
    take: LIMIT,
  });
  let n = 0;
  for (const r of rows) {
    const slugs = await matchEntitySlugs(r.name, r.description);
    if (await emit('vis-entity-architecture', `Entity "${r.name}" (${r.category})`, slugs, { entityId: r.id })) n++;
  }
  return n;
}

export async function emitGeoSignals(): Promise<number> {
  const rows = await prisma.kangqoreVisAiCitation.findMany({
    where: { cited: false },
    orderBy: { checkedAt: 'desc' },
    take: LIMIT,
  });
  let n = 0;
  for (const r of rows) {
    const slugs = await matchEntitySlugs(r.prompt);
    if (await emit('vis-geo', `Missed AI citation on "${r.engine}": ${r.prompt}`, slugs, { citationId: r.id })) n++;
  }
  return n;
}

export async function emitSemanticSeoSignals(): Promise<number> {
  const rows = await prisma.kangqoreVisTopicRelevance.findMany({
    where: { isGap: true },
    orderBy: { scoredAt: 'desc' },
    take: LIMIT,
  });
  let n = 0;
  for (const r of rows) {
    const slugs = await matchEntitySlugs(r.queryTerm);
    if (await emit('vis-semantic-seo', `Semantic gap: "${r.queryTerm}" (score ${r.relevanceScore})`, slugs, { relevanceId: r.id })) n++;
  }
  return n;
}

export async function emitProgrammaticSeoSignals(): Promise<number> {
  const rows = await prisma.kangqoreVisPageTemplate.findMany({
    where: { generatedCount: 0 },
    take: LIMIT,
  });
  let n = 0;
  for (const r of rows) {
    const slugs = await matchEntitySlugs(r.name, r.pageType);
    if (await emit('vis-programmatic-seo', `Unused page template "${r.name}" (0 pages generated)`, slugs, { templateId: r.id })) n++;
  }
  return n;
}

export async function emitAiAnswerabilitySignals(): Promise<number> {
  const rows = await prisma.kangqoreVisPageBlueprint.findMany({
    where: { faqRequired: true, faqs: { none: {} } },
    take: LIMIT,
  });
  let n = 0;
  for (const r of rows) {
    const slugs = await matchEntitySlugs(r.pageName, r.primaryKeyword);
    if (await emit('vis-ai-answerability', `"${r.pageName}" requires FAQs but has none`, slugs, { blueprintId: r.id })) n++;
  }
  return n;
}

export async function emitEeatSignals(): Promise<number> {
  const rows = await prisma.kangqoreVisGovernanceCheck.findMany({
    where: { checkId: { in: ['proof-visible', 'faqs-added', 'enterprise-tone'] }, passed: false },
    include: { blueprint: true },
    orderBy: { checkedAt: 'desc' },
    take: LIMIT,
  });
  let n = 0;
  for (const r of rows) {
    const slugs = await matchEntitySlugs(r.blueprint.pageName, r.blueprint.primaryKeyword);
    if (await emit('vis-eeat', `"${r.blueprint.pageName}" fails E-E-A-T check "${r.checkId}"`, slugs, { blueprintId: r.blueprintId, checkId: r.checkId })) n++;
  }
  return n;
}

export async function emitCroSignals(): Promise<number> {
  const experimentedIds = (
    await prisma.kangqoreVisExperiment.findMany({
      where: { blueprintId: { not: null } },
      select: { blueprintId: true },
    })
  ).map((e) => e.blueprintId as string);

  const rows = await prisma.kangqoreVisPageBlueprint.findMany({
    where: { pageType: 'SERVICE', id: { notIn: experimentedIds } },
    take: LIMIT,
  });
  let n = 0;
  for (const r of rows) {
    const slugs = await matchEntitySlugs(r.pageName, r.primaryKeyword);
    if (await emit('vis-cro', `"${r.pageName}" has no conversion experiments running`, slugs, { blueprintId: r.id })) n++;
  }
  return n;
}

export async function emitUxSignals(): Promise<number> {
  const rows = await prisma.kangqoreVisUxFinding.findMany({
    where: { resolved: false },
    orderBy: { foundAt: 'desc' },
    take: LIMIT,
  });
  let n = 0;
  for (const r of rows) {
    const slugs = await matchEntitySlugs(r.description, r.findingType);
    if (await emit('vis-ux', `Unresolved UX finding: ${r.findingType} — ${r.description}`, slugs, { findingId: r.id })) n++;
  }
  return n;
}

export const CAPABILITY_EMITTERS = [
  emitEntityArchitectureSignals,
  emitGeoSignals,
  emitSemanticSeoSignals,
  emitProgrammaticSeoSignals,
  emitAiAnswerabilitySignals,
  emitEeatSignals,
  emitCroSignals,
  emitUxSignals,
];
