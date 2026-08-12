import type { ScoredDimension } from '../types';
import { DIMENSION_WEIGHTS } from '../weights';
import { prisma } from '../../../../lib/prisma';
import { PageBlueprintService } from '../../../content-mapping/PageBlueprintService';
import { candidateUrl } from '../candidateUrl';

/**
 * VIS 3.4 — reads real KangqoreVisOutcome rows (SESSIONS/CONVERSIONS)
 * synced from a connected data-source adapter (see OutcomeSyncService).
 * As of this build no adapter has credentials configured, so this will
 * stay UNAVAILABLE in practice — the read path is real and testable
 * (seed a KangqoreVisOutcome row directly to prove it), but nothing
 * currently populates that table. Never estimates from page existence
 * alone; that would be fabricating a conversion signal from a signal
 * that has nothing to do with conversion.
 */
export async function scoreConversionPotential(entitySlugs: string[]): Promise<ScoredDimension> {
  const url = candidateUrl(entitySlugs);
  const blueprint = url ? await PageBlueprintService.getByUrl(url) : null;

  if (!blueprint) {
    return {
      status: 'UNAVAILABLE',
      weight: DIMENSION_WEIGHTS.conversionPotential,
      detail: 'NOT_AVAILABLE — no page exists yet for this opportunity, so there is nothing to measure.',
    };
  }

  const outcomes = await prisma.kangqoreVisOutcome.findMany({
    where: { blueprintId: blueprint.id, metric: { in: ['SESSIONS', 'CONVERSIONS'] } },
    orderBy: { measuredAt: 'desc' },
    take: 90,
  });

  if (outcomes.length === 0) {
    return {
      status: 'UNAVAILABLE',
      weight: DIMENSION_WEIGHTS.conversionPotential,
      detail: 'NOT_AVAILABLE — page exists but no conversion telemetry has been synced yet (see VIS 3.4 / POST .../sources/sync).',
    };
  }

  const sessions = outcomes.filter((o) => o.metric === 'SESSIONS').reduce((sum, o) => sum + o.value, 0);
  const conversions = outcomes.filter((o) => o.metric === 'CONVERSIONS').reduce((sum, o) => sum + o.value, 0);

  // Real, simple, documented formula: conversion rate if there are enough
  // sessions to trust a rate, otherwise raw session volume as a coarser
  // proxy for demand. Both capped at 100.
  const score =
    sessions >= 20
      ? Math.min(100, Math.round((conversions / sessions) * 1000))
      : Math.min(100, Math.round(sessions * 2));

  return {
    status: 'AVAILABLE',
    score,
    weight: DIMENSION_WEIGHTS.conversionPotential,
    detail: `${sessions} sessions, ${conversions} conversions over ${outcomes.length} synced data points.`,
  };
}
