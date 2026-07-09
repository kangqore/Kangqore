import { PredictionTarget } from './contracts/types';

export class PredictionRegistry {
  private static instance: PredictionRegistry;
  private targets: Set<PredictionTarget> = new Set();

  private constructor() {}

  public static getInstance(): PredictionRegistry {
    if (!PredictionRegistry.instance) {
      PredictionRegistry.instance = new PredictionRegistry();
    }
    return PredictionRegistry.instance;
  }

  public registerTarget(target: PredictionTarget): void {
    console.log(`[PredictionRegistry] Business Target Registered: ${target}`);
    this.targets.add(target);
  }

  public getSupportedTargets(): PredictionTarget[] {
    return Array.from(this.targets);
  }

  public isSupported(target: PredictionTarget): boolean {
    return this.targets.has(target);
  }
}
