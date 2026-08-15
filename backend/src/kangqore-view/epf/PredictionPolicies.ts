import { EnterprisePrediction, PredictionPolicy } from './contracts/types';

export class PredictionPolicies {
  public static readonly MINIMUM_CONFIDENCE: PredictionPolicy = {
    policyId: 'POL_PRED_001',
    name: 'Minimum Confidence Threshold',
    description: 'Reject predictions with confidence less than 70%.',
    evaluate: (prediction: EnterprisePrediction) => {
      if (prediction.confidence < 0.70) {
        return { passed: false, reason: `Confidence ${prediction.confidence} is below 0.70 threshold.` };
      }
      return { passed: true };
    }
  };

  public static readonly REQUIRED_EXPLAINABILITY: PredictionPolicy = {
    policyId: 'POL_PRED_002',
    name: 'Required Explainability',
    description: 'Predictions must cite at least one top driver.',
    evaluate: (prediction: EnterprisePrediction) => {
      if (!prediction.explanation || prediction.explanation.topDrivers.length === 0) {
        return { passed: false, reason: 'Prediction lacks explainability (no top drivers cited).' };
      }
      return { passed: true };
    }
  };

  public static readonly FEATURE_FRESHNESS: PredictionPolicy = {
    policyId: 'POL_PRED_003',
    name: 'Feature Freshness',
    description: 'Features used in prediction must not be older than 24 hours.',
    evaluate: (prediction: EnterprisePrediction) => {
      const now = new Date().getTime();
      for (const feature of prediction.featuresUsed) {
        const ageHours = (now - feature.freshness.getTime()) / (1000 * 60 * 60);
        if (ageHours > 24) {
          return { passed: false, reason: `Feature ${feature.name} is stale (${ageHours.toFixed(1)} hours old).` };
        }
      }
      return { passed: true };
    }
  };

  public static getAllPolicies(): PredictionPolicy[] {
    return [
      this.MINIMUM_CONFIDENCE,
      this.REQUIRED_EXPLAINABILITY,
      this.FEATURE_FRESHNESS
    ];
  }
}
