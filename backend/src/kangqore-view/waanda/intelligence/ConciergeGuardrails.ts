import { KBIndex } from '../../kimmp/knowledge/KbLoader';

export type GuardrailRule =
  | 'prompt-injection'
  | 'self-harm'
  | 'pricing-demand'
  | 'illegal'
  | 'currency-output'
  | 'superlative'
  | 'competitor-comparison'
  | 'forbidden-claim'
  | 'unverified-factual-claim';

export interface PrefilterResult {
  blocked: boolean;
  rule?: GuardrailRule;
  cannedResponse?: string;
}

export interface PostfilterResult {
  text: string;
  trips: { rule: GuardrailRule; match?: string }[];
  rewritten: boolean;
}

const HANDOFF_FALLBACK =
  "I want to make sure I share verified information rather than guess. A Kangqore consultant can give you specifics within one business day — would you like to share your name and email so we can reach out?";

const CANNED = {
  promptInjection:
    "Let me stay focused on Kangqore. What would you like to know about our services or how we engage with clients?",
  selfHarm:
    "It sounds like you may be going through something difficult. If you're in crisis, please reach out to a local helpline — in India, iCall: +91-9152987821, Vandrevala Foundation: 1860-2662-345. I'm here to help with Kangqore questions when you're ready.",
  pricingDemand:
    "Kangqore engagements depend on scope, model (Time & Materials, Fixed Scope, or Dedicated Team), and outcomes — so I won't quote a number without that context. A Kangqore consultant can walk through pricing after a short discovery call. Would you like to share your name and email?",
  illegal:
    "I can't help with that. If there's a Kangqore service or business question I can help with instead, let me know.",
};

const PROMPT_INJECTION_RX = [
  /ignore\s+(all\s+)?(previous|prior|earlier|above)\s+(instructions|rules|messages|prompts)/i,
  /disregard\s+(all\s+)?(previous|prior|earlier|above)/i,
  /forget\s+(everything|all|prior|the\s+above)/i,
  /system\s+prompt/i,
  /you\s+are\s+(now|actually)\s+(a|an)\s+\w+/i,
  /jailbreak/i,
  /\bDAN\b\s*(mode|prompt)?/,
  /reveal\s+(your|the)\s+(prompt|instructions|rules)/i,
  /what\s+(are|were)\s+your\s+instructions/i,
];

const SELF_HARM_RX = [
  /\b(suicide|kill\s+myself|end\s+my\s+life|hurt\s+myself|self[- ]harm)\b/i,
];

const PRICING_DEMAND_RX = [
  /\b(how\s+much|what.*(price|cost)|exact\s+(price|cost)|price\s+list|quote\s+me|cheapest|rate\s+card|hourly\s+rate|day\s+rate|per\s+hour|per\s+day)\b/i,
  /\b(in\s+)?(usd|inr|rupees?|dollars?|₹|\$)\s*\d/i,
];

const ILLEGAL_RX = [
  /\bhow\s+to\s+(hack|ddos|exploit|bypass\s+(security|auth))/i,
  /\bgenerate\s+(malware|ransomware|virus|exploit)/i,
];

const CURRENCY_OUTPUT_RX = [
  /\$\s?\d/,
  /USD\s?\d/i,
  /INR\s?\d/i,
  /₹\s?\d/,
  /\d+\s?(lakhs?|crores?)/i,
  /\b\d{1,3}(,\d{3})+(\.\d+)?\s?(usd|inr|rupees?|dollars?)/i,
];

const SUPERLATIVE_RX = [
  /\b(best|leading|number\s+one|#\s?1|top)\s+(in|for|of|across)\s+(india|asia|the\s+world|the\s+industry|the\s+market)/i,
  /\bindustry[- ]leading\b/i,
  /\bworld[- ]class\b/i,
  /\bbest[- ]in[- ]class\b/i,
  /\bcutting[- ]edge\b/i,
  /\bbest[- ]in[- ](india|asia)\b/i,
  /\bonly\s+company\s+(that|in)/i,
  /\b(market|industry)\s+leader\b/i,
];

const COMPETITOR_NAMES =
  '(infosys|tcs|tata\\s+consultancy|wipro|accenture|deloitte|capgemini|cognizant|hcl|tech\\s*mahindra|mindtree|mphasis|happiest\\s+minds|persistent|ltimindtree|epam|globant|thoughtworks|zensar|coforge)';

const COMPETITOR_COMPARISON_RX = [
  new RegExp(
    `(better|faster|cheaper|superior|stronger|more\\s+\\w+\\s+than|outperform[s]?|beat[s]?)[\\s\\S]{0,80}${COMPETITOR_NAMES}`,
    'i'
  ),
  new RegExp(`${COMPETITOR_NAMES}[\\s\\S]{0,40}(can[' ]?t|cannot|doesn[' ]?t|fails?|inferior)`, 'i'),
];

// Tight triggers — fire only on ASSERTIVE forms, not generic descriptors.
// "customer-facing platform" is fine; "our customer Acme Corp" is a claim.
const FACTUAL_CLAIM_TRIGGERS = [
  /\bour\s+(clients?|customers?|partners?)\b/i,
  /\b(we|kangqore)\s+(work(ed)?|partnered)\s+with\s+[A-Z]/,
  /\bclient[\s:]+[A-Z][a-z]/,
  /\bcase\s+stud(y|ies)\s+(of|on|with|for|about|involving)\b/i,
  /\b(in|from)\s+our\s+(case\s+stud(y|ies)|engagement\s+with)\b/i,
  /\bawarded\s+(by|the)\b/i,
  /\branked\s+(no|first|second|third|in|by|among|#?\d)/i,
  /\b\d+\s?%\s+(reduction|increase|improvement|faster|slower|of|more|less)/i,
  /\b\d+x\s+(faster|slower|more|less|improvement)/i,
  /\bheadquartered\s+in\b/i,
  /\bfounded\s+in\s+\d{4}/,
  /\b\d+\s+(employees|consultants|engineers|offices|countries|years\s+of)/i,
  /\bover\s+\d+\s+(clients?|customers?|projects?|years)/i,
];

const NEGATION_EXEMPTIONS = [
  /\b(don'?t|do not|cannot|can'?t|haven'?t|have not|won'?t|will not|no specific|no verified|no public|no named)\b/i,
  /\b(without|lack|lacking)\b/i,
  /\bI (?:cannot|can'?t|don'?t|haven'?t)\b/i,
];

export function prefilter(message: string): PrefilterResult {
  const text = message.trim();

  for (const rx of SELF_HARM_RX) {
    if (rx.test(text)) {
      return { blocked: true, rule: 'self-harm', cannedResponse: CANNED.selfHarm };
    }
  }

  for (const rx of PROMPT_INJECTION_RX) {
    if (rx.test(text)) {
      return { blocked: true, rule: 'prompt-injection', cannedResponse: CANNED.promptInjection };
    }
  }

  for (const rx of ILLEGAL_RX) {
    if (rx.test(text)) {
      return { blocked: true, rule: 'illegal', cannedResponse: CANNED.illegal };
    }
  }

  for (const rx of PRICING_DEMAND_RX) {
    if (rx.test(text)) {
      return { blocked: true, rule: 'pricing-demand', cannedResponse: CANNED.pricingDemand };
    }
  }

  return { blocked: false };
}

export function postfilter(rawText: string, kb: KBIndex): PostfilterResult {
  const trips: { rule: GuardrailRule; match?: string }[] = [];
  let text = rawText;

  for (const rx of CURRENCY_OUTPUT_RX) {
    const m = text.match(rx);
    if (m) {
      trips.push({ rule: 'currency-output', match: m[0] });
      return { text: HANDOFF_FALLBACK, trips, rewritten: true };
    }
  }

  for (const sub of kb.forbiddenSubstrings) {
    if (sub.length < 3) continue;
    const idx = text.toLowerCase().indexOf(sub.toLowerCase());
    if (idx >= 0) {
      trips.push({ rule: 'forbidden-claim', match: sub });
      return { text: HANDOFF_FALLBACK, trips, rewritten: true };
    }
  }

  for (const rx of COMPETITOR_COMPARISON_RX) {
    const m = text.match(rx);
    if (m) {
      trips.push({ rule: 'competitor-comparison', match: m[0].slice(0, 80) });
      return { text: HANDOFF_FALLBACK, trips, rewritten: true };
    }
  }

  let superlativeStripped = text;
  let stripped = false;
  for (const rx of SUPERLATIVE_RX) {
    if (rx.test(superlativeStripped)) {
      const m = superlativeStripped.match(rx);
      trips.push({ rule: 'superlative', match: m?.[0] });
      superlativeStripped = superlativeStripped.replace(rx, '');
      stripped = true;
    }
  }
  if (stripped) {
    text = superlativeStripped.replace(/\s{2,}/g, ' ').trim();
  }

  const sentences = text.split(/(?<=[.!?])\s+/);
  let rewroteForCitation = false;
  for (const sent of sentences) {
    const triggersHit = FACTUAL_CLAIM_TRIGGERS.some((rx) => rx.test(sent));
    const hasCitation = /\[CHUNK:[A-Za-z0-9_\-#]+\]/.test(sent);
    const negated = NEGATION_EXEMPTIONS.some((rx) => rx.test(sent));
    if (triggersHit && !hasCitation && !negated) {
      trips.push({ rule: 'unverified-factual-claim', match: sent.slice(0, 80) });
      rewroteForCitation = true;
      break;
    }
  }
  if (rewroteForCitation) {
    return { text: HANDOFF_FALLBACK, trips, rewritten: true };
  }

  return { text, trips, rewritten: stripped };
}

export const HANDOFF_MESSAGE = HANDOFF_FALLBACK;
