// ---------------------------------------------------------------------------
// KIMMP Page Factory — Page Content Generator (PR-C)
//
// Calls Claude to draft a full Kangqore-branded page (hero, sections, SEO) as
// structured content. The output is validated against the page content schema
// and the claim validator before anything is saved. The generator NEVER
// publishes — its caller saves the result as a DRAFT for admin review.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk';
import { withWaandax } from '../llm/waandaxAnthropic';
import logger from '../../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { pageContentSchema, PageContent } from './pageSchema';
import { ClaimValidator, ClaimIssue } from './claimValidator';
import { KimmpCostTracker } from '../governance/costTracker.service';

const anthropic = withWaandax(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }));

const SYSTEM_PROMPT = `You generate website page content for Kangqore, an enterprise
technology consulting company.

BRAND VOICE: enterprise-grade, clear, strategic, consultative, outcome-first.
State capability and process — never hype. Write like a senior consultant, not a
cheap agency.

FORBIDDEN — never use unsupported claims. Do not write: "#1" / "number one",
"best in class/India", "industry-leading" / "market-leading", "leading provider",
"guarantee" / "guaranteed", "100% secure", "zero downtime", "risk-free",
"Fortune 500", "award-winning", "world-class", "unmatched", or "Nx ROI/return".
Describe what Kangqore does and how — not superlatives.

Return ONLY valid JSON, no prose, in exactly this shape:
{
  "hero": { "eyebrow": "short label", "headline": "...", "subheadline": "..." },
  "sections": [
    { "type": "problem", "heading": "...", "body": "..." },
    { "type": "capabilities", "heading": "...", "items": ["...", "...", "..."] },
    { "type": "approach", "heading": "...", "body": "..." },
    { "type": "cta", "heading": "...", "buttonLabel": "..." }
  ],
  "seo": { "title": "<= 70 chars", "description": "<= 320 chars" },
  "schema": ["Service"],
  "internalLinks": ["/services"]
}`;

export interface GenerateInput {
  title: string;
  pageType: string;
  department?: string;
  primaryService?: string;
}

export interface GenerateResult {
  content: PageContent;
  model: string;
  claimIssues: ClaimIssue[];
}

export class PageGenerator {
  /** Draft page content via Claude, validated against schema + claim rules. */
  static async generate(input: GenerateInput): Promise<GenerateResult> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not set — page generation requires it');
    }
    const model = KimmpFlags.generatorModel();

    const userPrompt = [
      `Generate a Kangqore "${input.pageType}" page.`,
      `Topic / title: ${input.title}`,
      input.department ? `Department: ${input.department}` : '',
      input.primaryService ? `Primary service: ${input.primaryService}` : '',
      '',
      'Write substantive, specific content — not placeholder text.',
    ]
      .filter(Boolean)
      .join('\n');

    const response = await anthropic.messages.create({
      model,
      max_tokens: 3000,
      temperature: 0.4,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    // Phase 4 — record token cost (fire-and-forget).
    void KimmpCostTracker.record({
      operation: 'PAGE_GENERATION',
      model,
      inputTokens: response.usage?.input_tokens ?? 0,
      outputTokens: response.usage?.output_tokens ?? 0,
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.error('KIMMP page generator: no JSON in model response');
      throw new Error('Generator returned no usable content');
    }

    // Validate shape, then scan for unsupported claims.
    const content = pageContentSchema.parse(JSON.parse(jsonMatch[0]));
    const claim = ClaimValidator.scan(JSON.stringify(content));

    return { content, model, claimIssues: claim.issues };
  }
}
