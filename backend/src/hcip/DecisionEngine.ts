import { HumanContextObject, DecisionRecommendation } from './schemas';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

/**
 * Decision Engine
 * Produces UI-agnostic recommendations based on the HumanContextObject.
 */
export class DecisionEngine {
  public generateRecommendation(hco: HumanContextObject): DecisionRecommendation {
    const recId = crypto.randomUUID();
    const engineVersion = "2.4.0"; // Should match HCO or config

    // Default fallback
    let recommendation: DecisionRecommendation = {
      id: recId,
      objective: "Observe Visitor Behavior",
      reason: "Gathering baseline context",
      confidence: 50,
      impact: 1,
      urgency: 1,
      businessValue: 1,
      priority: 0,
      engineVersion
    };

    if (hco.riskSignals.includes('CONFUSED') || hco.riskSignals.includes('PRICING_SHOCK')) {
      recommendation = {
        id: recId,
        objective: "Reduce Pricing Shock",
        reason: "Detected frustration or pricing shock",
        confidence: 95,
        impact: 8,
        urgency: 10,
        businessValue: 7,
        priority: 0,
        suggestedAction: "OFFER_SUPPORT_INTERVENTION",
        engineVersion
      };
    } else if (hco.decisionState === 'VENDOR_SELECTION' && hco.persona === 'ENTERPRISE_BUYER') {
      recommendation = {
        id: recId,
        objective: "Increase Enterprise Conversions",
        reason: "Enterprise buyer ready for vendor selection",
        confidence: 90,
        impact: 10,
        urgency: 8,
        businessValue: 10,
        priority: 0,
        suggestedAction: "ESCALATE_TO_WAANDA_AND_OFFER_DEMO",
        engineVersion
      };
    } else if (hco.decisionState === 'EVALUATION' && hco.persona === 'DEVELOPER') {
      recommendation = {
        id: recId,
        objective: "Increase Technical Engagement",
        reason: "Developer evaluating architecture",
        confidence: 85,
        impact: 7,
        urgency: 5,
        businessValue: 6,
        priority: 0,
        suggestedAction: "SHOW_ARCHITECTURE_DOCS",
        engineVersion
      };
    } else if (hco.decisionState === 'COMPARISON') {
      recommendation = {
        id: recId,
        objective: "Accelerate Sales Qualification",
        reason: "Visitor comparing solutions",
        confidence: 75,
        impact: 6,
        urgency: 6,
        businessValue: 5,
        priority: 0,
        suggestedAction: "SHOW_COMPETITIVE_DIFFERENTIATOR",
        engineVersion
      };
    }

    // Priority = Impact × Urgency × Confidence × Business Value
    recommendation.priority = Math.round(
      recommendation.impact * recommendation.urgency * (recommendation.confidence / 100) * (recommendation.businessValue || 1)
    );

    // Persist Recommendation History as evidence
    prisma.hcipRecommendationHistory.create({
      data: {
        recommendationId: recommendation.id,
        objective: recommendation.objective,
        impact: recommendation.impact,
        urgency: recommendation.urgency,
        confidence: recommendation.confidence,
        priority: recommendation.priority,
        businessValue: recommendation.businessValue,
        engineVersion: recommendation.engineVersion,
        schemaVersion: hco.schemaVersion
      }
    }).catch((err: any) => console.error("Failed to save Recommendation History:", err));

    return recommendation;
  }
}

export const decisionEngine = new DecisionEngine();
