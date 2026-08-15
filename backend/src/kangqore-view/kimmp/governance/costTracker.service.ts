// ---------------------------------------------------------------------------
// KIMMP Phase 4 — LLM Cost Tracker
//
// Records per-call token usage and estimated USD cost for every Claude API
// call KIMMP makes. Gives the admin dashboard a real view of spend and lets
// runaway cost be caught before it becomes a surprise invoice.
//
// Pricing constants are for Anthropic Claude models as of 2026-05. Update
// them when model pricing changes. All figures are per 1 million tokens.
//
// `record()` is best-effort — it never throws so a cost write failure can
// never break the call that generated it.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';
import logger from '../../../utils/logger';

export type CostOperation = 'BEHAVIOR_TIER2' | 'PAGE_GENERATION' | 'CLAIM_VALIDATION' | 'COMMAND';

/** Anthropic pricing in USD per 1 million tokens. Update when pricing changes. */
const PRICE_PER_M: Record<string, { input: number; output: number }> = {
  'claude-haiku-4-5-20251001': { input: 0.8, output: 4.0 },
  'claude-sonnet-4-6':         { input: 3.0, output: 15.0 },
  'claude-opus-4-7':           { input: 15.0, output: 75.0 },
};
const DEFAULT_PRICE = { input: 3.0, output: 15.0 };

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const p = PRICE_PER_M[model] ?? DEFAULT_PRICE;
  return (inputTokens / 1_000_000) * p.input + (outputTokens / 1_000_000) * p.output;
}

export interface CostRecordInput {
  operation: CostOperation;
  model: string;
  inputTokens: number;
  outputTokens: number;
  conversationId?: string;
  leadId?: string;
  pageId?: string;
}

export interface CostSummary {
  totalCalls: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalEstimatedUsd: number;
  byOperation: Record<string, { calls: number; estimatedUsd: number }>;
}

export class KimmpCostTracker {
  /**
   * Record one LLM call's cost. Fire-and-forget safe — never throws.
   * Returns the estimated cost in USD (useful for logging), or 0 on failure.
   */
  static async record(input: CostRecordInput): Promise<number> {
    const estimated = estimateCost(input.model, input.inputTokens, input.outputTokens);
    try {
      await (prisma as any).kimmpLlmCost.create({
        data: {
          id: crypto.randomUUID(),
          operation: input.operation,
          model: input.model,
          inputTokens: input.inputTokens,
          outputTokens: input.outputTokens,
          estimatedCostUsd: estimated,
          conversationId: input.conversationId ?? null,
          leadId: input.leadId ?? null,
          pageId: input.pageId ?? null,
        },
      });
    } catch (err) {
      logger.warn('KIMMP cost record failed: ' + (err as Error).message);
    }
    return estimated;
  }

  /** Aggregate cost summary for the given window (default: last 30 days). */
  static async summary(sinceDays = 30): Promise<CostSummary | null> {
    try {
      const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);
      const rows: any[] = await (prisma as any).kimmpLlmCost.findMany({
        where: { createdAt: { gte: since } },
        select: { operation: true, inputTokens: true, outputTokens: true, estimatedCostUsd: true },
      });

      const byOp: Record<string, { calls: number; estimatedUsd: number }> = {};
      let totalIn = 0, totalOut = 0, totalUsd = 0;

      for (const r of rows) {
        if (!byOp[r.operation]) byOp[r.operation] = { calls: 0, estimatedUsd: 0 };
        byOp[r.operation].calls++;
        byOp[r.operation].estimatedUsd += Number(r.estimatedCostUsd);
        totalIn += r.inputTokens;
        totalOut += r.outputTokens;
        totalUsd += Number(r.estimatedCostUsd);
      }

      return {
        totalCalls: rows.length,
        totalInputTokens: totalIn,
        totalOutputTokens: totalOut,
        totalEstimatedUsd: Number(totalUsd.toFixed(6)),
        byOperation: byOp,
      };
    } catch {
      return null;
    }
  }
}
