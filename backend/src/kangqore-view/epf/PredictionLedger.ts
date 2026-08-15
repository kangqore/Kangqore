import { PredictionLedgerEntry } from './contracts/types';

export class PredictionLedger {
  private static instance: PredictionLedger;
  private readonly entries: PredictionLedgerEntry[] = [];

  private constructor() {}

  public static getInstance(): PredictionLedger {
    if (!PredictionLedger.instance) {
      PredictionLedger.instance = new PredictionLedger();
    }
    return PredictionLedger.instance;
  }

  public recordEntry(entry: PredictionLedgerEntry): void {
    console.log(`[PredictionLedger] Recording Prediction ${entry.predictionId} (Target: ${entry.request.target})`);
    this.entries.push(entry);
  }

  public getEntry(predictionId: string): PredictionLedgerEntry | undefined {
    return this.entries.find(e => e.predictionId === predictionId);
  }

  public updateWithActual(predictionId: string, actualOutcome: any): void {
    const entry = this.getEntry(predictionId);
    if (entry) {
      entry.actualOutcome = actualOutcome;
      console.log(`[PredictionLedger] Appended Actual Outcome for ${predictionId}: ${actualOutcome}`);
    }
  }

  public updateEvaluation(predictionId: string, errorMargin: number, driftDetected: boolean): void {
    const entry = this.getEntry(predictionId);
    if (entry) {
      entry.errorMargin = errorMargin;
      entry.driftDetected = driftDetected;
      console.log(`[PredictionLedger] Evaluation Logged for ${predictionId} (Error: ${errorMargin}%, Drift: ${driftDetected})`);
    }
  }

  public getAllEntries(): PredictionLedgerEntry[] {
    return [...this.entries];
  }
}
