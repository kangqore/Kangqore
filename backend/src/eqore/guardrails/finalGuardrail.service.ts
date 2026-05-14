/**
 * eQORE Phase 7 — Final Guardrail Service
 *
 * The last gate before a response reaches the user.
 * Blocks fake pricing, internal data leaks, unverified claims, and prompt injection effects.
 */

import logger from '../../utils/logger';

interface GuardrailResult {
  status: 'PASSED' | 'MODIFIED' | 'BLOCKED';
  sanitizedResponse: string;
  notes: string[];
}

export class FinalGuardrailService {
  // Patterns that must never appear in user-facing responses
  private static readonly BLOCKED_PATTERNS = [
    // Internal data leakage
    { pattern: /lead\s*score/i, reason: 'Internal lead score leakage' },
    { pattern: /shadow\s*lead\s*agent|shadow\s*agent|eqoreshadowleadagent/i, reason: 'Internal agent name exposure' },
    { pattern: /extraction\s*confidence/i, reason: 'Internal confidence leakage' },
    { pattern: /graph\s*enrichment/i, reason: 'Internal pipeline name exposure' },
    { pattern: /bullmq|redis|prisma/i, reason: 'Internal infrastructure exposure' },
    // Fake pricing
    { pattern: /\$\d{1,3}(,\d{3})+/i, reason: 'Unauthorized specific pricing' },
    { pattern: /starting\s*(at|from)\s*\$\d+/i, reason: 'Unauthorized pricing anchor' },
    // Competitor baiting
    { pattern: /(better|cheaper|faster)\s+than\s+(mckinsey|accenture|deloitte|infosys|tcs|wipro|cognizant)/i, reason: 'Competitor comparison claim' },
    // Prompt injection effects
    { pattern: /system\s*prompt/i, reason: 'System prompt reference in response' },
    { pattern: /ignore\s+previous/i, reason: 'Prompt injection echo' },
    { pattern: /developer\s*mode/i, reason: 'Developer mode reference' },
    // Unverified claims (Moved to blocked per red-team requirements)
    { pattern: /guarantee[sd]?\s+(we\s+will|roi|return|savings|results)/i, reason: 'Unverified ROI guarantee' }
  ];

  // Phrases that indicate unverified claims (that only need modification)
  private static readonly UNVERIFIED_CLAIM_PATTERNS = [
    { pattern: /100%\s+(uptime|success|satisfaction)/i, reason: 'Unrealistic 100% claim' },
    { pattern: /patent(ed|s)?\s+(technology|solution|method)/i, reason: 'Unverified patent claim' },
  ];

  // SEED_EXAMPLE case study protection
  private static readonly SEED_EXAMPLE_NAMES = [
    'Major US Bank', 'Series B SaaS Company', 'Regional Healthcare Network',
    'D2C Fashion Brand', 'Industrial Manufacturer', 'Series A Fintech', 'SEED_EXAMPLE_CLIENT'
  ];

  static evaluate(response: string): GuardrailResult {
    const notes: string[] = [];
    let sanitized = response;
    let status: 'PASSED' | 'MODIFIED' | 'BLOCKED' = 'PASSED';

    // 1. Check blocked patterns
    for (const { pattern, reason } of this.BLOCKED_PATTERNS) {
      if (pattern.test(sanitized)) {
        notes.push(`BLOCKED: ${reason}`);
        status = 'BLOCKED';
      }
    }

    if (status === 'BLOCKED') {
      logger.warn(`FinalGuardrail BLOCKED response: ${notes.join(', ')}`);
      return {
        status: 'BLOCKED',
        sanitizedResponse: 'I can help with that! For detailed pricing and specifics, our team would love to discuss your requirements in a personalized consultation. Would you like to schedule one?',
        notes
      };
    }

    // 2. Check unverified claims — modify, don't block
    for (const { pattern, reason } of this.UNVERIFIED_CLAIM_PATTERNS) {
      if (pattern.test(sanitized)) {
        notes.push(`MODIFIED: ${reason}`);
        status = 'MODIFIED';
      }
    }

    // 3. Redact SEED_EXAMPLE case study client names from user-facing responses
    for (const name of this.SEED_EXAMPLE_NAMES) {
      if (sanitized.includes(name)) {
        sanitized = sanitized.replace(new RegExp(name, 'g'), 'a leading enterprise client');
        notes.push(`MODIFIED: Redacted SEED_EXAMPLE client name "${name}"`);
        status = status === 'PASSED' ? 'MODIFIED' : status;
      }
    }

    // 4. Length safety
    if (sanitized.length > 2000) {
      sanitized = sanitized.substring(0, 1950) + '...';
      notes.push('MODIFIED: Response truncated to 2000 characters');
      status = 'MODIFIED';
    }

    if (notes.length > 0) {
      logger.info(`FinalGuardrail ${status}: ${notes.join(', ')}`);
    }

    return { status, sanitizedResponse: sanitized, notes };
  }
}
