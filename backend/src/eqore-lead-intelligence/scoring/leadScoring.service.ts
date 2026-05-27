import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { ShadowIntelligence } from '../../eqore/agents/shadowLead.schema';
import { LeadSignalProducer } from '../signals/leadSignalProducer.service';
import { LeadScoringBridge } from '../../kangqore-immp/lead-intelligence-bridge/leadScoringBridge.service';

export interface ScoreCalculationResult {
  score: number;
  confidence: number;
  scoreReasons: string[];
  confidenceReasons: string[];
  eventCandidates: { type: string; reason: string; confidence: number }[];
}

export interface LeadScoringInput {
  transcriptMetrics: {
    messageCount: number;
    userMessageCount: number;
    totalUserWords: number;
  };
  deterministicSignals: {
    pricingKeyword: boolean;
    consultationKeyword: boolean;
    emailDetected: boolean;
    phoneDetected: boolean;
    spamDetected: boolean;
  };
  semanticSignals?: {
    visitorType: string;
    buyingStage: string;
    urgency: string;
    budgetSignal: string;
    authoritySignal: string;
    scoringSignals: {
      hasSpecificBusinessProblem: boolean;
      hasServiceNeed: boolean;
      hasPricingIntent: boolean;
      hasConsultationIntent: boolean;
      hasUrgency: boolean;
      hasCompanyContext: boolean;
      hasContactReadiness: boolean;
      hasDecisionAuthority: boolean;
      hasNegativeIntent: boolean;
      hasSpamRisk: boolean;
    };
    extractionConfidence: number;
    eventCandidates?: { eventType: string; reason: string; confidence: number }[];
    primaryDepartment?: string;
    matchedServices?: { service: string; slug: string; department: string; fitScore: number; reason: string }[];
  };
}

export class EqoreLeadScoringService {
  /**
   * Calculates score and confidence using the LeadScoringInput contract.
   */
  static calculateScore(input: LeadScoringInput): ScoreCalculationResult {
    let score = 0;
    let confidence = 0;
    const scoreReasons: string[] = [];
    const confidenceReasons: string[] = [];
    const eventCandidates: { type: string; reason: string; confidence: number }[] = [];

    // --- Evidence (Confidence) Rules ---
    confidence += 10; // Base
    
    if (input.transcriptMetrics.userMessageCount >= 3) {
      confidence += 20;
      confidenceReasons.push('Transcript depth increased (3+ user messages)');
    }

    if (input.deterministicSignals.emailDetected || input.deterministicSignals.phoneDetected) {
      confidence += 20;
      confidenceReasons.push('Contact details shared');
    }

    if (input.semanticSignals?.extractionConfidence) {
      const confidenceBoost = Math.floor(input.semanticSignals.extractionConfidence * 0.2); // Up to +20
      confidence += confidenceBoost;
      confidenceReasons.push(`Semantic extraction confidence boost (+${confidenceBoost})`);
    }

    // --- Value (Score) Rules ---
    
    // Deterministic Backbone
    if (input.deterministicSignals.pricingKeyword) {
      score += 15;
      scoreReasons.push('Pricing intent detected (keyword)');
    }
    if (input.deterministicSignals.consultationKeyword) {
      score += 15;
      scoreReasons.push('Consultation intent detected (keyword)');
    }
    if (input.deterministicSignals.emailDetected) {
      score += 10;
      scoreReasons.push('Direct email captured');
    }
    if (input.deterministicSignals.spamDetected) {
      score -= 30;
      scoreReasons.push('Spam/bot pattern detected');
    }

    // Semantic Enrichment
    if (input.semanticSignals) {
      const s = input.semanticSignals.scoringSignals;

      if (s.hasSpecificBusinessProblem) {
        score += 10;
        scoreReasons.push('Specific business problem identified');
      }
      if (s.hasServiceNeed) {
        score += 10;
        scoreReasons.push('Strong service-fit detected');
      }
      if (s.hasUrgency) {
        score += 15;
        scoreReasons.push(`Urgency detected: ${input.semanticSignals.urgency}`);
      }
      if (s.hasDecisionAuthority) {
        score += 15;
        scoreReasons.push(`Authority: ${input.semanticSignals.authoritySignal}`);
      }
      if (s.hasNegativeIntent) {
        score -= 20;
        scoreReasons.push('Negative semantic intent detected');
      }

      // --- Service Match Multipliers (Phase 3) ---
      if (input.semanticSignals.matchedServices && input.semanticSignals.matchedServices.length > 0) {
        const topMatch = input.semanticSignals.matchedServices[0];
        
        if (topMatch.fitScore >= 85) {
          score += 8;
          scoreReasons.push(`Strong service match: ${topMatch.service} (Fit: ${topMatch.fitScore}%)`);
        } else if (topMatch.fitScore >= 70) {
          score += 4;
          scoreReasons.push(`Moderate service match: ${topMatch.service}`);
        }

        // Department Fit
        if (input.semanticSignals.primaryDepartment) {
          score += 5;
          scoreReasons.push(`Target Department Alignment: ${input.semanticSignals.primaryDepartment}`);
        }

        // Cross-Department Opportunity
        if (input.semanticSignals.matchedServices.length >= 2) {
          score += 4;
          scoreReasons.push('Cross-department expansion opportunity');
        }
      }
      
      // Capture candidate events from LLM
      if (input.semanticSignals.eventCandidates) {
        input.semanticSignals.eventCandidates.forEach(ec => {
          eventCandidates.push({ type: ec.eventType, reason: ec.reason, confidence: ec.confidence });
        });
      }
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      confidence: Math.max(0, Math.min(100, confidence)),
      scoreReasons,
      confidenceReasons,
      eventCandidates
    };
  }

  /**
   * Orchestrates the update process, tracking deltas and logging explainable events.
   */
  static async updateLeadScore(leadId: string, messages: any[], intelligence?: ShadowIntelligence): Promise<void> {
    try {
      const lead = await prisma.eqoreLead.findUnique({ where: { id: leadId } });
      if (!lead) return;

      const userMessages = messages.filter(m => m.role === 'USER');
      const combinedText = userMessages.map(m => m.content.toLowerCase()).join(' ');

      const input: LeadScoringInput = {
        transcriptMetrics: {
          messageCount: messages.length,
          userMessageCount: userMessages.length,
          totalUserWords: combinedText.split(/\s+/).length
        },
        deterministicSignals: {
          pricingKeyword: /(pricing|cost|quote|how much|budget)/i.test(combinedText),
          consultationKeyword: /(consultation|call|demo|schedule|book|meeting)/i.test(combinedText),
          emailDetected: /(@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i.test(combinedText),
          phoneDetected: /(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4})/i.test(combinedText),
          spamDetected: /(seo services|buy traffic|casino|crypto|bitcoin)/i.test(combinedText)
        },
        semanticSignals: intelligence ? {
          visitorType: intelligence.visitorType,
          buyingStage: intelligence.buyingStage,
          urgency: intelligence.urgency,
          budgetSignal: intelligence.budgetSignal,
          authoritySignal: intelligence.authoritySignal,
          scoringSignals: intelligence.scoringSignals,
          extractionConfidence: intelligence.extractionConfidence,
          eventCandidates: intelligence.eventCandidates,
          primaryDepartment: (intelligence as any).primaryDepartment,
          matchedServices: (intelligence as any).matchedServices
        } : (lead.primaryDepartment ? {
          visitorType: lead.visitorType || 'Unknown',
          buyingStage: lead.buyingStage || 'Unknown',
          urgency: lead.urgency || 'Unknown',
          budgetSignal: lead.budgetSignal || 'Unknown',
          authoritySignal: lead.authoritySignal || 'Unknown',
          scoringSignals: {
            hasSpecificBusinessProblem: !!lead.problemStatement,
            hasServiceNeed: !!lead.matchedServices,
            hasPricingIntent: false,
            hasConsultationIntent: false,
            hasUrgency: lead.urgency === 'High' || lead.urgency === 'Immediate',
            hasCompanyContext: false,
            hasContactReadiness: false,
            hasDecisionAuthority: lead.authoritySignal === 'CXO/Decision Maker' || lead.authoritySignal === 'Founder/Owner',
            hasNegativeIntent: false,
            hasSpamRisk: false
          },
          extractionConfidence: lead.shadowExtractionConfidence || 50,
          primaryDepartment: lead.primaryDepartment,
          matchedServices: lead.matchedServices as any
        } : undefined)
      };

      const result = this.calculateScore(input);

      // Phase 2 — KIMMP behavior boost (flag-gated, best-effort, max +10).
      const behaviorBoost = await LeadScoringBridge.behaviorBoost(leadId);
      if (behaviorBoost > 0) {
        result.score = Math.min(100, result.score + behaviorBoost);
        result.scoreReasons.push(`+${behaviorBoost} KIMMP behavior signal`);
      }

      // Delta Tracking
      const scoreDelta = result.score - lead.leadScore;
      const confidenceDelta = result.confidence - lead.leadConfidence;

      // Only proceed if there's a change
      if (scoreDelta !== 0 || confidenceDelta !== 0) {
        const previousStatus = lead.status;
        let newStatus = previousStatus;
        
        if (result.score >= 90 && result.confidence >= 70) newStatus = 'GOLDEN';
        else if (result.score >= 85 && result.confidence >= 60) newStatus = 'HOT';
        else if (result.score >= 75 && result.confidence >= 50) newStatus = 'ESCALATED';

        // 1. Log Score Update Event with Delta Payload
        await prisma.eqoreLeadEvent.create({
          data: {
            leadId,
            eventType: 'SCORE_UPDATED',
            previousScore: lead.leadScore,
            newScore: result.score,
            previousStatus,
            newStatus,
            reason: `Score recalculated (Delta: ${scoreDelta > 0 ? '+' : ''}${scoreDelta}).`,
            eventData: {
              previousScore: lead.leadScore,
              newScore: result.score,
              scoreDelta,
              previousConfidence: lead.leadConfidence,
              newConfidence: result.confidence,
              confidenceDelta,
              scoreReasons: result.scoreReasons,
              confidenceReasons: result.confidenceReasons,
              analysisVersion: intelligence ? 'shadow-v1' : 'deterministic-v1'
            } as any
          }
        });

        // 2. Log Meaningful Semantic Events (Filtered by confidence)
        if (result.eventCandidates) {
          for (const candidate of result.eventCandidates) {
            // CTO Rule: Only create event if confidence >= 60 or meaningful change
            if (candidate.confidence >= 60) {
              await prisma.eqoreLeadEvent.create({
                data: {
                  leadId,
                  eventType: candidate.type,
                  reason: candidate.reason,
                  newScore: result.score,
                  eventData: { 
                    confidence: candidate.confidence, 
                    source: 'SHADOW_AGENT' 
                  } as any
                }
              });
            }
          }
        }

        // 3. Update Lead
        await prisma.eqoreLead.update({
          where: { id: leadId },
          data: {
            leadScore: result.score,
            leadConfidence: result.confidence,
            status: newStatus,
            updatedAt: new Date()
          }
        });

        // Phase 2 — emit signal to Signal Ledger (fire-and-forget).
        void LeadSignalProducer.onScoreChange({
          leadId,
          previousScore: lead.leadScore,
          newScore: result.score,
          previousStatus,
          newStatus,
          confidence: result.confidence,
        });
      }
    } catch (err) {
      logger.error('EqoreLeadScoringService.updateLeadScore error:', err);
    }
  }
}
