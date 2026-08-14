import { IPredictionModelPlugin, PredictionRequest } from './contracts/types';
import { ModelRegistry } from './ModelRegistry';

export class ModelSelector {
  public selectBestModel(request: PredictionRequest): IPredictionModelPlugin | null {
    const registry = ModelRegistry.getInstance();
    const models = registry.getModelsForTarget(request.target);

    if (models.length === 0) {
      console.warn(`[ModelSelector] No active models found for target: ${request.target}`);
      return null;
    }

    // Filter by supported horizon
    const supportedModels = models.filter(m => m.getMetadata().supportedHorizons.includes(request.horizon));
    if (supportedModels.length === 0) {
      console.warn(`[ModelSelector] No active models found supporting horizon ${request.horizon} for target: ${request.target}`);
      return null;
    }

    // Sort by highest historical accuracy (could also factor in expected latency)
    supportedModels.sort((a, b) => b.getMetadata().accuracy - a.getMetadata().accuracy);

    const bestModel = supportedModels[0];
    console.log(`[ModelSelector] Selected Model: ${bestModel.getMetadata().id} v${bestModel.getMetadata().version} (Accuracy: ${(bestModel.getMetadata().accuracy * 100).toFixed(1)}%)`);
    return bestModel;
  }
}
