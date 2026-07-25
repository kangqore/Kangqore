/**
 * eQORE Phase 8A — Client Assurance Response Engine
 * 
 * Handles crisis, urgency, and complex business pain enquiries.
 * Uses a bank of 100+ expert scenarios to generate high-trust, 
 * CTO-grade technical and executive responses.
 */

import { prisma } from '../../lib/prisma';
import { EqoreAgentResult } from '../orchestrator/agentResult';
import Anthropic from '@anthropic-ai/sdk';
import { withWaandax } from '../../kangqore-immp/llm/waandaxAnthropic';
import logger from '../../utils/logger';
import { KANGQORE_DEPARTMENTS } from '../../eqore-lead-intelligence/taxonomy/kangqoreServiceTaxonomy';

const anthropic = withWaandax(new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
}));

export class EqoreAssuranceService {
  /**
   * Processes a message through the Assurance Engine.
   * Matches against the scenario bank and synthesizes a Kangqore-style executive response.
   */
  static async process(message: string): Promise<EqoreAgentResult> {
    const start = Date.now();
    try {
      // 1. Fetch relevant scenarios from the bank
      // In a full implementation, we'd use pgvector. 
      // For Phase 8A v1, we fetch the top active scenarios and let the LLM rank/select.
      const scenarios = await prisma.eqoreAssuranceScenario.findMany({
        where: { isActive: true },
        take: 100 // Fetch a representative set
      });

      const model = process.env.EQORE_ASSURANCE_MODEL || 'claude-sonnet-4-6';
      
      const departmentList = KANGQORE_DEPARTMENTS.map(d => d.name).join(', ');

      const systemPrompt = `You are the eQORE Client Assurance Response Engine, an elite technical concierge for Kangqore.
You respond like a Product Manager + Tech Lead + CTO + Kangqore Consultant.

A client has reported a messy, urgent, or crisis-style issue:
"${message}"

Your Goal:
1. Identify the closest handled scenario from our response bank.
2. Synthesize a response that demonstrates business impact awareness, technical root cause understanding, and solution ownership.
3. Use the KANGQORE MASTER TEMPLATE.
4. Return a JSON object with the following structure:
{
  "responseContent": "The full synthesized response following the template",
  "metadata": {
    "matchedScenarioId": "string",
    "matchedScenarioScore": number,
    "matchedScenarioTags": ["string"],
    "assuranceCategory": "string",
    "recommendedDepartments": ["string"],
    "recommendedServices": ["string"],
    "urgencyLevel": "NORMAL | URGENT | CRISIS"
  }
}

KANGQORE DEPARTMENTS:
${departmentList}

RESPONSE BANK SCENARIOS:
${scenarios.map((s, i) => `[SCENARIO_ID: ${s.id}] Q: ${s.question}\nA: ${s.answer}`).join('\n\n')}

MASTER TEMPLATE:
Yes, Kangqore can help you with this.

We understand that this is not just a technical issue — it affects your users, your operations, your revenue, your compliance posture, and your reputation.

Our first priority will be to stabilize the situation, understand what has gone wrong, and reduce the immediate impact on your business. After that, we will create a structured solution plan that improves reliability, user experience, scalability, security, and long-term performance.

From a product and engineering perspective, we would first identify the root cause, then separate immediate recovery from long-term modernization. This ensures we do not only fix the symptom, but also remove the structural weakness that caused the issue.

[CTO_TECHNICAL_ANALYSIS_AND_STABILIZATION_PLAN]

Based on what you described, Kangqore can support this through:
[RELEVANT_DEPARTMENTS_LIST]

Recommended starting point:
[SPECIFIC_NEXT_ACTION_OR_PACKAGE]

At Kangqore, we do not treat your problem as just another project. We treat it as our responsibility.

We are Kangqore.
We Innovate Futures.

INSTRUCTIONS:
- [CTO_TECHNICAL_ANALYSIS_AND_STABILIZATION_PLAN]: 2 paragraphs of executive-grade analysis. Mention specific technical components relevant to the problem.
- [RELEVANT_DEPARTMENTS_LIST]: Choose 3-6 most relevant departments.
- [SPECIFIC_NEXT_ACTION_OR_PACKAGE]: A specific title like "72-Hour Recovery Plan".
- Ensure the "responseContent" field contains the FULL response using the template.`;

      const response = await anthropic.messages.create({
        model,
        max_tokens: 1500,
        temperature: 0.1,
        system: systemPrompt + "\n\nCRITICAL: Return ONLY the raw JSON object. No markdown blocks, no preamble.",
        messages: [{ role: 'user', content: `Client Input: ${message}` }]
      });

      const rawJsonText = response.content[0].type === 'text' ? response.content[0].text : '{}';
      logger.info(`EqoreAssuranceService: Raw LLM response: ${rawJsonText}`);
      
      // Extract JSON in case there's markdown wrapping
      const jsonMatch = rawJsonText.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : rawJsonText;
      const parsed = JSON.parse(cleanJson);

      return {
        agentName: 'AssuranceEngine',
        status: 'SUCCESS',
        userVisibleMessage: parsed.responseContent,
        metadata: parsed.metadata,
        backendActions: ['ASSURANCE_RESPONSE_GENERATED'],
        latencyMs: Date.now() - start
      };

    } catch (error) {
      logger.error('EqoreAssuranceService: Failed to process assurance query:', error);
      return {
        agentName: 'AssuranceEngine',
        status: 'FAILED',
        error: (error as Error).message,
        latencyMs: Date.now() - start
      };
    }
  }
}
