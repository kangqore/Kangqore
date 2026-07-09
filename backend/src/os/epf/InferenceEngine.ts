import { EnterprisePrediction, PredictionRequest } from './contracts/types';
import { ModelSelector } from './ModelSelector';
import { FeatureStore } from './FeatureStore';
import { PredictionPolicies } from './PredictionPolicies';
import { PredictionLedger } from './PredictionLedger';

export class InferenceEngine {
  private static instance: InferenceEngine;

  private constructor() {}

  public static getInstance(): InferenceEngine {
    if (!InferenceEngine.instance) {
      InferenceEngine.instance = new InferenceEngine();
    }
    return InferenceEngine.instance;
  }

  public async predict(request: PredictionRequest): Promise<EnterprisePrediction | null> {
    console.log(`\n[InferenceEngine] Processing Request ${request.requestId} for ${request.target}`);
    
    // 1. Model Selection
    const modelSelector = new ModelSelector();
    const model = modelSelector.selectBestModel(request);
    
    if (!model) {
      console.error(`[InferenceEngine] Request Failed. No suitable model found for ${request.target}.`);
      return null;
    }

    // 2. Feature Collection
    const featureStore = FeatureStore.getInstance();
    const features = await featureStore.getFeaturesForTarget(request.target);
    console.log(`[InferenceEngine] Collected ${features.length} features for ${model.getMetadata().id}`);

    // 3. Inference Execution
    let prediction: EnterprisePrediction;
    try {
      prediction = await model.infer(request, features);
    } catch (e) {
      console.error(`[InferenceEngine] Inference Failed:`, e);
      return null;
    }

    // 4. Policy Validation
    const policies = PredictionPolicies.getAllPolicies();
    prediction.policyValidations = [];
    
    for (const policy of policies) {
      const result = policy.evaluate(prediction);
      if (!result.passed) {
        console.warn(`[InferenceEngine] Policy Validation Failed [${policy.name}]: ${result.reason}`);
        prediction.state = 'REJECTED';
        prediction.policyValidations.push(`FAILED: ${policy.name} - ${result.reason}`);
        return prediction; // Returning rejected prediction so consumer knows why
      }
      prediction.policyValidations.push(`PASSED: ${policy.name}`);
    }

    prediction.state = 'PUBLISHED';
    console.log(`[InferenceEngine] Prediction ${prediction.predictionId} PUBLISHED (Confidence: ${(prediction.confidence * 100).toFixed(1)}%)`);

    // 5. Ledger Recording
    const ledger = PredictionLedger.getInstance();
    ledger.recordEntry({
      entryId: `ENTRY_${Date.now()}`,
      predictionId: prediction.predictionId,
      request,
      featuresUsed: features,
      modelVersion: model.getMetadata().version,
      prediction,
      loggedAt: new Date()
    });

    return prediction;
  }
}
