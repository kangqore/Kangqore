// ---------------------------------------------------------------------------
// KIMMP Page Factory — Claim Validator (PR-C)
//
// Locked product rule: KIMMP must never create a page carrying unsupported
// claims ("#1", "guaranteed ROI", "Fortune 500", "100% secure", …). The
// generator's system prompt forbids them; this validator is the deterministic
// backstop that scans generated content before anything is saved.
// ---------------------------------------------------------------------------

interface ClaimPattern {
  re: RegExp;
  label: string;
}

const FORBIDDEN_CLAIMS: ClaimPattern[] = [
  { re: /#\s?1\b|\bnumber one\b|\bno\.?\s?1\b/i, label: 'rank-claim' },
  { re: /\bbest[-\s]in[-\s](class|india|the\s+world)\b/i, label: 'superlative-claim' },
  { re: /\b(industry|market)[-\s]leading\b/i, label: 'leadership-claim' },
  { re: /\bleading\s+(provider|company|firm|agency|vendor)\b/i, label: 'leadership-claim' },
  { re: /\bguarantee[ds]?\b/i, label: 'guarantee-claim' },
  { re: /\b100\s?%\s*(secure|safe|uptime|reliable|guaranteed)\b/i, label: 'absolute-claim' },
  { re: /\bzero[-\s](downtime|risk)\b/i, label: 'absolute-claim' },
  { re: /\brisk[-\s]free\b/i, label: 'absolute-claim' },
  { re: /\bfortune\s?500\b/i, label: 'authority-claim' },
  { re: /\baward[-\s]winning\b/i, label: 'authority-claim' },
  { re: /\bworld[-\s]class\b/i, label: 'superlative-claim' },
  { re: /\b(unmatched|unbeatable|unrivall?ed)\b/i, label: 'superlative-claim' },
  { re: /\b\d+\s?x\s+(roi|return|growth|faster|revenue)\b/i, label: 'metric-claim' },
];

export interface ClaimIssue {
  label: string;
  match: string;
}

export interface ClaimReport {
  clean: boolean;
  issues: ClaimIssue[];
}

export class ClaimValidator {
  /** Scan arbitrary text for unsupported marketing claims. */
  static scan(text: string): ClaimReport {
    const issues: ClaimIssue[] = [];
    for (const { re, label } of FORBIDDEN_CLAIMS) {
      const global = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
      const matches = text.match(global);
      if (matches) {
        for (const m of matches) issues.push({ label, match: m.trim() });
      }
    }
    return { clean: issues.length === 0, issues };
  }
}
