import Anthropic from '@anthropic-ai/sdk';
import { withWaandax } from '../../kangqore-immp/llm/waandaxAnthropic';
import { API_KEYS } from '../../api-keys';
import logger from '../../utils/logger';
import { prisma } from '../../lib/prisma';

const CLAUDE_MODEL = 'claude-3-5-sonnet-20240620';

export class EqoreNurtureAgent {
  private static client: Anthropic | null = null;

  private static getClient(): Anthropic {
    if (!this.client) {
      if (!API_KEYS.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY missing');
      this.client = withWaandax(new Anthropic({ apiKey: API_KEYS.ANTHROPIC_API_KEY }));
    }
    return this.client;
  }

  /**
   * Generates a "Lead Brief" for the consultant and a personalized follow-up suggestion.
   */
  static async generateNurtureAssets(leadId: string) {
    const lead = await prisma.eqoreLead.findUnique({
      where: { id: leadId },
      include: { conversation: { include: { messages: true } } }
    });

    if (!lead) throw new Error(`Lead ${leadId} not found`);

    const transcript = lead.conversation.messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const intelligence = {
      visitorType: lead.visitorType,
      primaryDepartment: lead.primaryDepartment,
      matchedServices: lead.matchedServices,
      problemStatement: lead.problemStatement,
      urgency: lead.urgency,
      buyingStage: lead.buyingStage
    };

    const prompt = `
You are the eQORE Nurture Agent. Your job is to prepare a "Consultation Brief" for a Kangqore consultant who is about to meet with a high-intent lead.

[TRANSCRIPT]
${transcript}

[EXISTING INTELLIGENCE]
${JSON.stringify(intelligence, null, 2)}

[TASK]
1. Create a "Lead Brief" (Markdown format):
   - Summary of the problem.
   - Why they are a good fit for Kangqore.
   - Specific "Must-Ask" discovery questions based on the chat.
3. Estimate ROI Intelligence:
   - "projectedValue": Estimate the Annual Contract Value (ACV) in USD based on the problem scale and services (e.g., $10k - $250k+).
   - "pipelineWeight": Estimate conversion probability (0.1 to 0.9) based on urgency and authority.
   - "valueTier": Categorize as "CORE", "STRATEGIC", or "TRANSFORMATIONAL".
   - "valueReasoning": A brief explanation of the ROI estimate.

Return your response as a JSON object with keys: 
"brief" (string, markdown), 
"actions" (array of objects with {type, description}),
"projectedValue" (number),
"pipelineWeight" (number),
"valueTier" (string),
"valueReasoning" (string)
`;

    try {
      const response = await this.getClient().messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = (response.content[0] as any).text;
      const parsed = JSON.parse(content);

      await prisma.eqoreLead.update({
        where: { id: leadId },
        data: {
          nurtureBrief: parsed.brief,
          nurtureActions: parsed.actions as any,
          projectedValue: parsed.projectedValue,
          pipelineWeight: parsed.pipelineWeight,
          valueTier: parsed.valueTier,
          valueReasoning: parsed.valueReasoning
        }
      });

      logger.info(`Generated nurture and ROI assets for lead ${leadId}`);
      return parsed;
    } catch (error) {
      logger.error('EqoreNurtureAgent.generateNurtureAssets failed', error);
      throw error;
    }
  }
}
