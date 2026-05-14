import { z } from 'zod';

export const ShadowLeadExtractionSchema = z.object({
  visitorType: z.enum([
    "Casual Visitor",
    "Student",
    "Researcher",
    "Competitor",
    "Job Seeker",
    "Partner Prospect",
    "Startup Founder",
    "Serious Buyer",
    "Enterprise Prospect",
    "Golden Lead",
    "Unknown"
  ]),

  buyingStage: z.enum([
    "No Intent",
    "Awareness",
    "Research",
    "Problem Exploration",
    "Solution Evaluation",
    "Vendor Evaluation",
    "Pricing Evaluation",
    "Ready To Talk",
    "Unknown"
  ]),

  primaryIntent: z.string().max(240),
  problemStatement: z.string().max(600),
  
  painPoints: z.array(z.string().max(160)).max(8).default([]),

  buyingSignals: z.array(z.object({
    signal: z.string().max(160),
    strength: z.enum(["Low", "Medium", "High"]),
    evidenceMessageIds: z.array(z.string())
  })).max(10).default([]),

  negativeSignals: z.array(z.object({
    signal: z.string().max(160),
    severity: z.enum(["Low", "Medium", "High"]),
    evidenceMessageIds: z.array(z.string())
  })).max(10).default([]),

  urgency: z.enum(["None", "Low", "Medium", "High", "Immediate", "Unknown"]),

  budgetSignal: z.enum([
    "Not Mentioned",
    "Pricing Curious",
    "Budget Exploring",
    "Budget Available",
    "Quote Requested",
    "Unknown"
  ]),

  authoritySignal: z.enum([
    "Unknown",
    "Student/Individual",
    "Influencer",
    "Evaluator",
    "Manager",
    "Founder/Owner",
    "CXO/Decision Maker"
  ]),

  recommendedAction: z.enum([
    "Continue Conversation",
    "Ask Qualification Question",
    "Offer Login/Register",
    "Offer Consultation",
    "Route To Careers",
    "Route To Partnership",
    "Sales Review",
    "Live Sales Alert",
    "Senior Handoff",
    "Ignore/Archive"
  ]),

  nextBestQuestion: z.string().max(260),
  conversationSummary: z.string().max(900),
  
  extractionConfidence: z.number().min(0).max(100),

  // Service Intelligence Refinement (Phase 3)
  primaryDepartment: z.string().optional(),
  matchedServices: z.array(z.object({
    slug: z.string(),
    service: z.string(),
    fitScore: z.number(),
    reason: z.string()
  })).optional(),
  recommendedSolutionPackage: z.string().optional(),
  
  // Scheduling Intelligence (Phase 4)
  schedulingIntent: z.boolean().optional(),
  timePreference: z.string().max(160).optional(),

  scoringSignals: z.object({
    hasSpecificBusinessProblem: z.boolean(),
    hasServiceNeed: z.boolean(),
    hasPricingIntent: z.boolean(),
    hasConsultationIntent: z.boolean(),
    hasUrgency: z.boolean(),
    hasCompanyContext: z.boolean(),
    hasContactReadiness: z.boolean(),
    hasDecisionAuthority: z.boolean(),
    hasNegativeIntent: z.boolean(),
    hasSpamRisk: z.boolean()
  }).strict(),

  eventCandidates: z.array(z.object({
    eventType: z.enum([
      "INTENT_EXTRACTED",
      "BUYING_SIGNAL_DETECTED",
      "NEGATIVE_SIGNAL_DETECTED",
      "URGENCY_DETECTED",
      "BUDGET_SIGNAL_DETECTED",
      "AUTHORITY_SIGNAL_DETECTED",
      "NEXT_BEST_QUESTION_GENERATED",
      "SHADOW_ANALYSIS_COMPLETED"
    ]),
    reason: z.string().max(240),
    confidence: z.number().min(0).max(100)
  })).max(12).default([])
}).strict();

export type ShadowIntelligence = z.infer<typeof ShadowLeadExtractionSchema>;
