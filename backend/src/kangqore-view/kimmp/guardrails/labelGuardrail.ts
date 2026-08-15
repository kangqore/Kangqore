// ---------------------------------------------------------------------------
// KIMMP — Harmful-Label Guardrail
//
// Locked, non-negotiable product rule: KIMMP never outputs demeaning labels or
// clinical/psychological diagnoses about a person. The Tier-2 system prompt
// forbids them; this guardrail is the deterministic backstop that scrubs any
// human-facing text before it leaves the layer.
// ---------------------------------------------------------------------------

interface ForbiddenPattern {
  /** Case-insensitive regex matched against human-facing text. */
  re: RegExp;
  label: string;
}

const FORBIDDEN: ForbiddenPattern[] = [
  { re: /\blow[\s-]?(iq|intelligence)\b/i, label: 'intelligence-slur' },
  { re: /\b(stupid|idiot|idiotic|dumb|moron|imbecile|cretin)\b/i, label: 'demeaning-term' },
  { re: /\bmentally\s+(weak|ill|unstable|deficient)\b/i, label: 'mental-health-claim' },
  { re: /\bemotionally\s+(unstable|broken|damaged)\b/i, label: 'mental-health-claim' },
  { re: /\b(crazy|insane|lunatic|psycho|deranged|unhinged)\b/i, label: 'demeaning-term' },
  { re: /\b(incompetent|inept|worthless)\b/i, label: 'demeaning-term' },
  { re: /\b(bipolar|schizophreni\w*|neurotic|psychotic)\b/i, label: 'clinical-diagnosis' },
  { re: /\b(mental\s+(illness|disorder)|personality\s+disorder)\b/i, label: 'clinical-diagnosis' },
  { re: /\b(clinically\s+)?depress(ed|ion)\b/i, label: 'clinical-diagnosis' },
  { re: /\b(irrational|unreasonable)\s+person\b/i, label: 'demeaning-term' },
];

const REDACTION = '[removed: unsafe characterization]';

export interface GuardrailResult {
  clean: string;
  flags: string[];
}

export class LabelGuardrail {
  /** Scrub a single human-facing string. */
  static scan(text: string): GuardrailResult {
    let clean = text;
    const flags = new Set<string>();

    for (const { re, label } of FORBIDDEN) {
      const global = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
      if (global.test(clean)) {
        flags.add(label);
        clean = clean.replace(global, REDACTION);
      }
    }

    return { clean, flags: [...flags] };
  }

  /** True if the text contains any forbidden label (no mutation). */
  static isClean(text: string): boolean {
    return !FORBIDDEN.some((p) => p.re.test(text));
  }
}
