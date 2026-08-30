// ---------------------------------------------------------------------------
// KIMMP — Tier-2 Claude Reasoning Pass
//
// The "cloud brain" half of the hybrid. Only invoked when Tier-1 is unsure or
// the conversation is high-stakes (see behaviorAnalyzer). Claude refines the
// behavioral reading, recommends a response posture, and writes a safe summary.
//
// Hard rule enforced in the system prompt AND again by the label guardrail:
// no clinical diagnoses, no harmful labels ("low IQ", "unstable", etc.).
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk';
import { withKrisnam } from '../llm/krisnamAnthropic';
import logger from '../../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { Tier1Result } from './signalExtractor.service';
import { tier2ResponseSchema, Tier2ResponseParsed } from './behaviorSchema';
import { KimmpCostTracker } from '../governance/costTracker.service';
import { KimmpRag } from '../rag/kimmpRag.service';

const anthropic = withKrisnam(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }));

const SYSTEM_PROMPT = `You are the KIMMP Human Behavior Intelligence Layer for Kangqore.

Your ONLY job: read a website visitor's conversation and infer their behavioral and
emotional STATE so Kangqore can respond like a thoughtful business operator.

You analyze observable communication signals. You do NOT:
- diagnose mental health or make any medical/psychological claim;
- use harmful or demeaning labels (never "low IQ", "stupid", "mentally weak",
  "emotionally unstable", "irrational", etc.);
- judge the person's worth or intelligence.
You describe behavior in this conversation, with confidence scores, nothing more.

Detect these states (include only the ones actually present), each with
intensity 0..1 and confidence 0..1:
URGENCY, FRUSTRATION, STRESS, CONFUSION, SKEPTICISM, TRUST_NEED,
TECHNICAL_DEPTH, DECISION_READINESS, BUYING_SERIOUSNESS.

Pick one communicationStyle: DIRECT, EXPLORATORY, ANXIOUS, ANALYTICAL, NEUTRAL.

Pick one recommendedResponseMode:
- CALM_ASSURANCE_FIRST: visitor is stressed/frustrated; stabilize and reassure first.
- SIMPLIFY: visitor is confused; explain plainly.
- SHOW_PROOF: visitor is skeptical; lead with evidence and case studies.
- DISCOVERY: visitor is decision-ready; move toward next steps.
- EXECUTIVE: serious business buyer under pressure; concise, senior, outcome-led.
- STANDARD: none of the above clearly applies.

emotionalSummary: ONE or TWO plain sentences, supportive and non-clinical,
describing what the visitor seems to need. Safe for an internal dashboard.

traits: ONLY include Big Five estimates if explicitly told there is enough text.
Otherwise return traits as null. Use keys openness, conscientiousness,
extraversion, agreeableness, emotionalSensitivity (each 0..1).

Return ONLY valid JSON, no prose, in this exact shape:
{
  "states": [{ "type": "URGENCY", "intensity": 0.0, "confidence": 0.0, "evidence": [] }],
  "communicationStyle": "NEUTRAL",
  "recommendedResponseMode": "STANDARD",
  "emotionalSummary": "...",
  "traits": null
}`;

export interface Tier2Input {
  texts: string[];
  tier1: Tier1Result;
  /** True when the volume gate allows Big Five trait estimation. */
  traitsEligible: boolean;
}

export class Tier2ClaudeReasoner {
  /** Returns a refined reading, or null if Claude is unavailable / invalid. */
  static async reason(input: Tier2Input): Promise<Tier2ResponseParsed | null> {
    if (!process.env.ANTHROPIC_API_KEY) {
      logger.warn('KIMMP Tier-2 skipped: ANTHROPIC_API_KEY not set');
      return null;
    }

    const model = KimmpFlags.reasonerModel();
    const tier1Hint = input.tier1.states
      .map((s) => `${s.type}=${s.intensity.toFixed(2)}`)
      .join(', ') || 'none';

    // Phase 5 — RAG: pull relevant KB context to ground the behavioral read.
    const ragContext = await KimmpRag.query(input.texts.slice(-3).join(' '), 3);

    const userPrompt = [
      `Tier-1 (deterministic) already detected: ${tier1Hint}.`,
      `Trait estimation is ${input.traitsEligible ? 'ALLOWED — there is enough text' : 'NOT allowed — too little text, return traits: null'}.`,
      '',
      'Conversation (visitor messages only):',
      ...input.texts.map((t, i) => `[${i + 1}] ${t}`),
      ...(ragContext.contextBlock ? ['', ragContext.contextBlock] : []),
    ].join('\n');

    try {
      const response = await anthropic.messages.create({
        model,
        max_tokens: 700,
        temperature: 0.2,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      });

      // Phase 4 — record token cost (fire-and-forget).
      void KimmpCostTracker.record({
        operation: 'BEHAVIOR_TIER2',
        model,
        inputTokens: response.usage?.input_tokens ?? 0,
        outputTokens: response.usage?.output_tokens ?? 0,
      });

      const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('no JSON in Tier-2 response');

      const parsed = tier2ResponseSchema.parse(JSON.parse(jsonMatch[0]));

      // Volume gate is authoritative: drop traits if not eligible.
      if (!input.traitsEligible) parsed.traits = null;

      return parsed;
    } catch (error) {
      logger.error('KIMMP Tier-2 reasoning failed:', error);
      return null;
    }
  }
}
