import { PredictionLedger } from './PredictionLedger';

export class EvaluationEngine {
  public evaluate(predictionId: string, actualOutcome: any): void {
    const ledger = PredictionLedger.getInstance();
    
    // Log the actual outcome
    ledger.updateWithActual(predictionId, actualOutcome);

    const entry = ledger.getEntry(predictionId);
    if (!entry) return;

    // Calculate Error Margin
    const predictedValue = entry.prediction.outcome.forecastedValue;
    let errorMargin = 0;
    
    if (typeof predictedValue === 'number' && typeof actualOutcome === 'number') {
      errorMargin = Math.abs(predictedValue - actualOutcome) / Math.max(1, actualOutcome) * 100;
    } else if (predictedValue !== actualOutcome) {
      errorMargin = 100; // Complete miss for categorical
    }

    let driftDetected = false;
    if (errorMargin > 15) { // 15% threshold for drift
      driftDetected = true;
      console.warn(`[EvaluationEngine] HIGH ERROR DETECTED: ${errorMargin.toFixed(1)}%. Possible Model Drift.`);
    }

    ledger.updateEvaluation(predictionId, errorMargin, driftDetected);
  }
}
