// ─── Persona-targeted solution pages — Overshadow Roadmap P7.3 ──────────────
// "Four campaigns, mapped directly to the playbook's buying-persona chapter."
// Every proof link below points at something a P0–P6 phase actually shipped —
// no persona page claims a capability that doesn't have a real page behind it.

export const PERSONA_SOLUTIONS = [
  {
    slug: 'cio',
    persona: 'CIO',
    title: 'For the CIO evaluating platform consolidation',
    subtitle: 'ITSM/ITOM stay where they are. The AI and governance layer doesn\'t have to be retrofitted onto them.',
    icon: 'Compass',
    painPoints: [
      'Comparing App Engine\'s six-year Magic Quadrant track record against a newer no-code builder',
      'Deciding whether AI governance gets bolted onto an existing platform or built in from day one',
      'Migrating operational data without a forced rip-and-replace of ITSM/ITOM',
    ],
    proof: [
      { label: 'Read the governance-native vs. retrofitted case', to: '/trust/governance-native-vs-retrofitted' },
      { label: 'See the Agent Studio benchmark, published even when the sample size is thin', to: '/trust/agent-studio-benchmark' },
      { label: 'Browse the real template & governed-action marketplace', to: '/marketplace' },
    ],
    honestNote: 'Kangqore has not built an ITSM or ITOM competitor. The pitch here is coexistence — an ontology and governance layer sitting above the ticket queue you already run, not a replacement for it.',
  },
  {
    slug: 'ciso',
    persona: 'CISO',
    title: 'For the CISO evaluating AI risk',
    subtitle: 'Every AI call logged, PII-scanned, and budget-checked before it executes — native since the first agent ran, not four years in.',
    icon: 'ShieldCheck',
    painPoints: [
      'SecOps mindshare declined 15.7% → 9.0% in a year while its AI Control Tower was still being built out',
      'Needing an audit trail for AI-initiated actions, not just AI-assisted ones',
      'Evaluating whether "AI governance" is a real architectural commitment or a feature bolted on after the fact',
    ],
    proof: [
      { label: 'See the live governance scorecard and audit trail', to: '/trust' },
      { label: 'Read the sequencing argument for a technical evaluator', to: '/trust/governance-native-vs-retrofitted' },
    ],
    honestNote: 'This is a governance and audit story, not a SIEM/SOAR replacement — AEGIS extends risk/audit into a security-facing lens on data the platform already writes, it does not compete with detection engines.',
  },
  {
    slug: 'chro',
    persona: 'CHRO',
    title: 'For the CHRO comparing HR platforms',
    subtitle: 'Confidentiality modeled into the case type, not bolted on — and a diagnostic that surfaces data-quality gaps before deployment.',
    icon: 'Users',
    painPoints: [
      'HRSD pricing scales with total headcount, not HR seat count',
      'HRSD\'s own reviewers flag data quality as "not solved by the tool itself"',
      'Wanting AI to help log and triage cases without giving it authority to close or escalate one unsupervised',
    ],
    proof: [
      { label: 'Start with the BIDS™ Workforce Intelligence™ diagnostic', to: '/bids' },
      { label: 'See the governance model this is built on', to: '/trust' },
    ],
    honestNote: 'Close and escalate actions on an HR case are human-gated by design — not exposed as an agent tool. Only lower-stakes logging is AI-callable.',
  },
  {
    slug: 'customer-service',
    persona: 'VP Customer Service',
    title: 'For the VP of Customer Service comparing CSM',
    subtitle: 'No developer expertise required, transparent pricing, no separate consumption meter.',
    icon: 'Headset',
    painPoints: [
      'CSM\'s own reviewers cite developer-expertise requirements and an unintuitive interface',
      'Pricing opacity from a separate consumption meter on top of the base license',
      'Wanting AI-assisted case handling without losing visibility into what the AI actually did',
    ],
    proof: [
      { label: 'Browse the Customer Service Case Handler template', to: '/marketplace' },
      { label: 'See the live governance and audit trail', to: '/trust' },
    ],
    honestNote: 'The customer-case capability ships with three governed, tool-callable actions — log, resolve, escalate — every one of them audited the same way any other AEGIS-governed action is.',
  },
];
