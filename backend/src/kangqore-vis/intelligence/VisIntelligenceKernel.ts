// ---------------------------------------------------------------------------
// VIS Intelligence Kernel
//
// Entry point for the cross-module reasoning loop: emit signals from each
// VIS capability → correlate them (KimmpCorrelationEngine, Rule 5 =
// AUTHORITY_OPPORTUNITY) → propose decisions (DecisionEngine). Decisions
// land as PROPOSED KimmpDecision rows for an admin to review — this never
// auto-executes anything.
// ---------------------------------------------------------------------------

import { CAPABILITY_EMITTERS } from './emitters';
import { KimmpCorrelationEngine } from '../../kangqore-immp/correlation/kimmpCorrelation.service';
import { DecisionEngine } from '../../kangqore-immp/decision/decisionEngine.service';
import { OpportunityScoringEngine } from './scoring/OpportunityScoringEngine';
import logger from '../../utils/logger';

export interface ScanResult {
  signalsEmitted: number;
  patternsDetected: number;
  opportunitiesScored: number;
  decisionsProposed: number;
}

export class VisIntelligenceKernel {
  static async scanAndCorrelate(): Promise<ScanResult> {
    let signalsEmitted = 0;
    for (const emitter of CAPABILITY_EMITTERS) {
      try {
        signalsEmitted += await emitter();
      } catch (err) {
        logger.warn(`[VIS:KERNEL] emitter failed: ${(err as Error).message}`);
      }
    }

    const patterns = await KimmpCorrelationEngine.analyze();

    // VIS 3.1 — score every AUTHORITY_OPPORTUNITY pattern before the
    // generic decision engine runs, so the scored record exists regardless
    // of where that pattern lands in the decision queue.
    const opportunityIds: string[] = [];
    for (const pattern of patterns.filter((p) => p.name === 'AUTHORITY_OPPORTUNITY')) {
      const id = await OpportunityScoringEngine.scoreAndPersist(pattern);
      if (id) opportunityIds.push(id);
    }

    const decisionResult = await DecisionEngine.evaluate();

    // Best-effort back-link now that decisions exist.
    for (const id of opportunityIds) {
      await OpportunityScoringEngine.linkRecentDecision(id);
    }

    return {
      signalsEmitted,
      patternsDetected: patterns.length,
      opportunitiesScored: opportunityIds.length,
      decisionsProposed: decisionResult.decisionsProposed,
    };
  }
}
