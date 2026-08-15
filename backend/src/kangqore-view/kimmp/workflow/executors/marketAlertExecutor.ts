// ---------------------------------------------------------------------------
// KIMMP Workflow — Market Alert executor (targetModule: alis)
//
// ALIS is a read-only aggregation layer — there is no write surface to push to.
// The executor emits a SYSTEM signal back into the Signal Ledger confirming the
// market alert has been actioned by a human. This keeps the audit trail complete
// without mutating ALIS data.
// ---------------------------------------------------------------------------

import { SignalLedger } from '../../signals/signalLedger.service';
import logger from '../../../../utils/logger';
import { ExecutorInput, ExecutorResult } from './salesAlertExecutor';

export async function runMarketAlert(input: ExecutorInput & { signalValue?: string | null }): Promise<ExecutorResult> {
  await SignalLedger.record({
    sourceModule: 'kimmp',
    signalType: 'MARKET_ALERT_ACTIONED',
    signalCategory: 'SYSTEM',
    signalValue: input.signalValue ?? 'UNKNOWN',
    confidence: 1,
    severity: 'LOW',
    metadata: {
      decisionId: input.decisionId,
      recommendedAction: input.recommendedAction,
      source: 'KIMMP_WORKFLOW',
    },
  });

  logger.info(`[KIMMP:WORKFLOW] MARKET_ALERT actioned decisionId=${input.decisionId}`);

  return {
    action: 'MARKET_ALERT_SIGNAL_EMITTED',
    detail: { signalValue: input.signalValue },
  };
}
