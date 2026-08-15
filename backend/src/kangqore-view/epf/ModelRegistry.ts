import { IPredictionModelPlugin, PredictionTarget } from './contracts/types';

export class ModelRegistry {
  private static instance: ModelRegistry;
  private readonly models: IPredictionModelPlugin[] = [];

  private constructor() {}

  public static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  public registerModel(plugin: IPredictionModelPlugin): void {
    const meta = plugin.getMetadata();
    console.log(`[ModelRegistry] Technical Model Registered: ${meta.id} v${meta.version} for target ${meta.target}`);
    this.models.push(plugin);
  }

  public getModelsForTarget(target: PredictionTarget): IPredictionModelPlugin[] {
    return this.models.filter(m => m.getMetadata().target === target && m.getMetadata().status === 'ACTIVE');
  }

  public getAllModels(): IPredictionModelPlugin[] {
    return [...this.models];
  }
}
