export type Intent =
  | 'pricing'
  | 'services'
  | 'company'
  | 'careers'
  | 'contact'
  | 'support'
  | 'comparison'
  | 'roadmap'
  | 'lead'
  | 'other';

interface RuleSet {
  intent: Intent;
  patterns: RegExp[];
}

const RULES: RuleSet[] = [
  {
    intent: 'pricing',
    patterns: [
      /\b(price|pricing|cost|costs|quote|rate|rates|budget|how much|fee|fees|estimate|hourly|day rate|engagement model)\b/i,
    ],
  },
  {
    intent: 'comparison',
    patterns: [
      /\bcompare|vs\.?|versus|better than|cheaper than|faster than|alternative to\b/i,
      /\b(infosys|tcs|wipro|accenture|deloitte|capgemini|cognizant|hcl|tech\s*mahindra|mindtree|mphasis|happiest\s+minds)\b/i,
    ],
  },
  {
    intent: 'careers',
    patterns: [
      /\b(career|careers|hiring|hire me|apply|job|jobs|opening|openings|recruit|recruiter|cv|resume|internship)\b/i,
    ],
  },
  {
    intent: 'roadmap',
    patterns: [
      /\b(roadmap|plan|architecture|blueprint|build me|design (a|an|the)|propose (a|an)|proposal)\b/i,
    ],
  },
  {
    intent: 'lead',
    patterns: [
      /\b(book (a )?(call|consultation|meeting|demo)|schedule (a )?(call|consultation|meeting|demo)|talk to (someone|a (consultant|sales|expert))|consultation|connect me|reach out)\b/i,
      /\bmy (name|email)\b/i,
      /[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/,
    ],
  },
  {
    intent: 'contact',
    patterns: [
      /\b(contact|phone|email|address|office|location|reach you|get in touch)\b/i,
    ],
  },
  {
    intent: 'careers',
    patterns: [/\bjoin (your )?team\b/i],
  },
  {
    intent: 'support',
    patterns: [
      /\b(support|help|broken|bug|issue|not working|cancel|refund|complaint)\b/i,
    ],
  },
  {
    intent: 'services',
    patterns: [
      /\b(service|services|department|practice|capability|offering|what do you (do|offer)|build (an?|the) (app|platform|product|system)|saas|automation|cloud|ai|machine learning|ml|analytics|data|cyber ?security|devops|salesforce|servicenow|aws|azure|gcp|sap)\b/i,
    ],
  },
  {
    intent: 'company',
    patterns: [
      /\b(about|who (are|is) (you|kangqore)|company|founded|history|leadership|founder|ceo|team|how many people)\b/i,
    ],
  },
];

export function classifyIntent(message: string): Intent {
  const text = message.trim();
  for (const rule of RULES) {
    for (const rx of rule.patterns) {
      if (rx.test(text)) return rule.intent;
    }
  }
  return 'other';
}
