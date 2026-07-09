import { SimulationLedgerEntry } from './contracts/types';

export class SimulationLedger {
  private static instance: SimulationLedger;
  private entries: SimulationLedgerEntry[] = [];

  private constructor() {}

  public static getInstance(): SimulationLedger {
    if (!SimulationLedger.instance) {
      SimulationLedger.instance = new SimulationLedger();
    }
    return SimulationLedger.instance;
  }

  public recordEntry(entry: SimulationLedgerEntry): void {
    console.log(`[SimulationLedger] Recording Run: ${entry.simulationId} (Status: ${entry.status})`);
    this.entries.push(entry);
  }

  public getEntry(simulationId: string): SimulationLedgerEntry | undefined {
    return this.entries.find(e => e.simulationId === simulationId);
  }

  public getAllEntries(): SimulationLedgerEntry[] {
    return [...this.entries];
  }
}
