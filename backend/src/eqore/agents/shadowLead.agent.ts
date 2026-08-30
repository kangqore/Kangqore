import Anthropic from '@anthropic-ai/sdk';
import { withKrisnam } from '../../kangqore-immp/llm/krisnamAnthropic';
import logger from '../../utils/logger';
import { prisma } from '../../lib/prisma';
import { ShadowIntelligence, ShadowLeadExtractionSchema } from './shadowLead.schema';
import { KANGQORE_SERVICES } from '../../eqore-lead-intelligence/taxonomy/kangqoreServiceTaxonomy';

const anthropic = process.env.ANTHROPIC_API_KEY ? withKrisnam(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })) : null;

export class EqoreShadowLeadAgent {
  /**
   * Analyzes the full transcript and extracts structured intelligence.
   * Strictly validates output against Zod schema.
   */
  static async analyzeTranscript(
    conversationId: string, 
    messages: { id: string; role: string; content: string }[],
    sourcePage?: string
  ): Promise<ShadowIntelligence | null> {
    if (process.env.TEST_MODE === 'true') {
      return {
        visitorType: "Enterprise Prospect",
        buyingStage: "Solution Evaluation",
        primaryIntent: "AI Automation Workflow",
        problemStatement: "Need to modernize internal workflow with AI automation",
        painPoints: ["manual internal workflow", "outdated processes"],
        buyingSignals: [
          { signal: "How much would it cost", strength: "High", evidenceMessageIds: [] },
          { signal: "can we talk tomorrow afternoon", strength: "High", evidenceMessageIds: [] }
        ],
        negativeSignals: [],
        urgency: "High",
        budgetSignal: "Quote Requested",
        authoritySignal: "Unknown",
        recommendedAction: "Offer Consultation",
        nextBestQuestion: "Which specific workflows are you looking to automate with AI first?",
        conversationSummary: "Fintech company looking to modernize internal workflows with AI automation. Requested pricing and a meeting for tomorrow afternoon.",
        extractionConfidence: 85,
        primaryDepartment: "digital-transformation-modernization",
        matchedServices: [
          { slug: "digital-transformation", service: "Digital Transformation", fitScore: 0.95, reason: "Workflow modernization" },
          { slug: "agentic-ai", service: "Agentic AI", fitScore: 0.90, reason: "AI automation requested" }
        ],
        schedulingIntent: true,
        timePreference: "tomorrow afternoon",
        scoringSignals: {
          hasSpecificBusinessProblem: true,
          hasServiceNeed: true,
          hasPricingIntent: true,
          hasConsultationIntent: true,
          hasUrgency: true,
          hasCompanyContext: false,
          hasContactReadiness: false,
          hasDecisionAuthority: false,
          hasNegativeIntent: false,
          hasSpamRisk: false
        },
        eventCandidates: []
      };
    }

    if (!anthropic) {
      logger.warn('ShadowLeadAgent: ANTHROPIC_API_KEY missing.');
      return null;
    }

    const transcript = messages.map(m => `ID: ${m.id} | ${m.role}: ${m.content}`).join('\n');

    const allowedServices = Object.values(KANGQORE_SERVICES).map(s => `${s.slug} (${s.name} in ${s.departmentName})`).join(', ');

    const systemPrompt = `
You are eQORE Shadow Lead Intelligence Agent for Kangqore.
You are invisible to the website visitor. You do not respond to the visitor. Your only job is to analyze the transcript and extract structured lead intelligence.

You must:
- Identify visitor type.
- Identify buying stage.
- Extract primary business intent.
- Extract problem statement.
- Extract pain points.
- Extract buying signals.
- Extract negative signals.
- Detect urgency, budget signal, and authority signal.
- Identify the best-fit Kangqore services and primary department.
- Recommend the next best business action.
- Detect scheduling intent: Is the visitor explicitly asking to talk, book, or meet?
- Extract time preference: If a specific time or date is mentioned, extract it exactly as written.
- Generate one next best qualifying question tailored to the matched services.
- Summarize the conversation for Kangqore’s admin/sales team.
- Return only the required JSON schema.

Service Taxonomy Rules:
- You MUST only use the following service slugs: ${allowedServices}
- Do not invent services. If none fit perfectly, use the closest ones or leave empty.
- Map the visitor's pain points to the most relevant services.
- Identify the Primary Department that owns the overall opportunity.

General Rules:
- Do not calculate final leadScore.
- Do not calculate final leadConfidence.
- Do not invent facts.
- Do not assume company size, budget, authority, or urgency unless supported by transcript evidence.
- If information is missing, use "Unknown", "Not Mentioned", or empty arrays.
- Do not classify sensitive personal attributes.
- Do not expose internal scoring logic.
- Do not include private chain-of-thought.
- Use concise enterprise language.
- Prefer evidence-backed signals over optimistic assumptions.
`;

    const userPayload = JSON.stringify({
      conversationId,
      sourcePage: sourcePage || "Unknown",
      messages
    }, null, 2);

    const executeExtraction = async (isRetry = false): Promise<ShadowIntelligence | null> => {
      try {
        const response = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 2000,
          temperature: 0.2,
          system: systemPrompt,
          messages: [{ role: "user", content: userPayload }]
        });

        const text = (response.content[0] as any).text.trim();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const rawIntelligence = JSON.parse(cleanJson);
        
        // Strict Zod Validation
        const result = ShadowLeadExtractionSchema.safeParse(rawIntelligence);
        
        if (!result.success) {
          logger.error(`Shadow Agent Validation Failed (Retry: ${isRetry}):`, result.error.format());
          if (!isRetry) return await executeExtraction(true);
          return null;
        }

        return result.data;
      } catch (error) {
        logger.error(`Shadow Agent Extraction Error (Retry: ${isRetry}):`, error);
        if (!isRetry) return await executeExtraction(true);
        return null;
      }
    };

    return await executeExtraction();
  }

  /**
   * Integrates the intelligence into the database.
   */
  static async persistIntelligence(leadId: string, intelligence: ShadowIntelligence, messageId: string) {
    try {
      await prisma.eqoreLead.update({
        where: { id: leadId },
        data: {
          visitorType: intelligence.visitorType,
          buyingStage: intelligence.buyingStage,
          primaryIntent: intelligence.primaryIntent,
          problemStatement: intelligence.problemStatement,
          painPoints: intelligence.painPoints,
          buyingSignals: intelligence.buyingSignals as any,
          negativeSignals: intelligence.negativeSignals as any,
          urgency: intelligence.urgency,
          budgetSignal: intelligence.budgetSignal,
          authoritySignal: intelligence.authoritySignal,
          recommendedAction: intelligence.recommendedAction,
          nextBestQuestion: intelligence.nextBestQuestion,
          conversationSummary: intelligence.conversationSummary,
          shadowExtractionConfidence: intelligence.extractionConfidence,
          primaryDepartment: intelligence.primaryDepartment,
          matchedServices: intelligence.matchedServices as any,
          recommendedSolutionPackage: intelligence.recommendedSolutionPackage,
          lastShadowAnalyzedAt: new Date(),
          lastShadowAnalyzedMessageId: messageId,
          shadowAnalysisStatus: 'COMPLETED',
          shadowAnalysisVersion: 'shadow-v1'
        }
      });

      // We will let the Scoring Service handle Event creation based on CTO rules
      // But we record the completion event here for audit
      await prisma.eqoreLeadEvent.create({
        data: {
          leadId,
          eventType: 'SHADOW_ANALYSIS_COMPLETED',
          reason: 'Shadow Agent completed semantic extraction',
          eventData: {
            confidence: intelligence.extractionConfidence,
            version: 'shadow-v1',
            signalsCount: (intelligence.buyingSignals?.length || 0) + (intelligence.negativeSignals?.length || 0)
          } as any
        }
      });

    } catch (error) {
      logger.error('EqoreShadowLeadAgent persistence failed:', error);
      await prisma.eqoreLead.update({
        where: { id: leadId },
        data: { 
          shadowAnalysisStatus: 'FAILED',
          lastShadowError: (error as Error).message 
        }
      });
    }
  }
}
