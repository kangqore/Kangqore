// ---------------------------------------------------------------------------
// Battlecard Catalog — Overshadow Roadmap P7.1 ("Sales Enablement").
//
// The playbook's Part V battlecard already existed as static analysis; this
// turns it into real, queryable, CRM-adjacent content using the exact same
// MarketplaceListing infrastructure P3's marketplace and P4's Agent Studio
// templates already run on — a `type: 'PACK'`, `category: 'competitive'`
// listing per ServiceNow module, not a bespoke content model.
//
// Every verdict here is honest about what this roadmap actually shipped:
// CSM/HR/SecOps are marked WON because P4 shipped real governed capability
// against them; App Engine stays CONTESTED because P3's own benchmark
// disclosed insufficientData; ITSM/ITOM are marked TOGETHER because no P-phase
// built anything against them — the playbook's own recommended posture for
// most modules, not a claim of victory nowhere earned.
//
// Idempotent by slug, safe to call on every read.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma'

interface BattlecardSeed {
  slug: string
  name: string
  serviceNowModule: string
  verdict: 'WON' | 'CONTESTED' | 'TOGETHER'
  objection: string
  response: string
  keyDifferentiators: string[]
  proofLink: string
  iconEmoji: string
}

const BATTLECARDS: BattlecardSeed[] = [
  {
    slug: 'battlecard-csm', name: 'Customer Service Management', serviceNowModule: 'CSM', verdict: 'WON',
    objection: '"CSM is the established customer-service platform — why would we move a support desk off it?"',
    response: 'CSM\'s own reviewers cite developer-expertise requirements, an unintuitive interface, and pricing opacity. Kangqore ships a governed CustomerCase type, three tool-callable actions, a pre-built Object Set, and an Agent Studio template — no developer expertise required, transparent pricing, no separate consumption meter.',
    keyDifferentiators: ['No developer expertise required to configure a case type', 'Transparent, non-metered pricing', 'AI-callable case actions with governed blast radius'],
    proofLink: '/kangqore-view/admin/kangqore-immp/contested-modules', iconEmoji: '🎧',
  },
  {
    slug: 'battlecard-hrsd', name: 'HR Service Delivery', serviceNowModule: 'HRSD', verdict: 'WON',
    objection: '"HRSD already handles our employee lifecycle — what does Kangqore add?"',
    response: "HRSD's per-employee pricing scales with total headcount, not HR seat count, and its own reviewers flag data quality as 'not solved by the tool itself.' Kangqore's HrCase type ships with confidentiality built in, a BIDS™ Workforce Intelligence™ diagnostic surfacing the data-quality gap upfront, and a conservative tool-callability split — logging is agent-callable, closing a case stays human-only.",
    keyDifferentiators: ['Confidentiality modeled into the case type, not bolted on', 'BIDS™ diagnostic surfaces data-quality gaps before deployment', 'Human-gated close/escalate actions'],
    proofLink: '/kangqore-view/admin/kangqore-immp/contested-modules', iconEmoji: '🧑‍💼',
  },
  {
    slug: 'battlecard-secops', name: 'Security Operations', serviceNowModule: 'SecOps', verdict: 'WON',
    objection: '"SecOps has an AI Control Tower now — isn\'t that the same AI-governance story?"',
    response: "SecOps' own AI Control Tower was retrofitted after four years of AI-agent shipping. HANUMANAS governance — every AI call logged, PII-scanned, budget-checked before it executes — was native from the first agent this platform ever ran. The AI Security View extends that same real audit/approval data into a security-team-facing lens, not a new detection engine bolted on after the fact.",
    keyDifferentiators: ['Governance-native since day one, not retrofitted', 'AI Security View built on real HANUMANAS audit + pending-approval data', 'Sequencing argument published as a whitepaper, not just asserted'],
    proofLink: '/trust/governance-native-vs-retrofitted', iconEmoji: '🛡️',
  },
  {
    slug: 'battlecard-app-engine', name: 'App Engine', serviceNowModule: 'App Engine', verdict: 'CONTESTED',
    objection: '"App Engine has been a Gartner Magic Quadrant Leader for six straight years — Agent Studio has no track record."',
    response: "That's true, and the honest answer, not a deflection: Agent Studio's own published benchmark discloses insufficientData against App Engine's Forrester-study sample size. What's real: 5 starter templates, 4 governed tool-callable actions, and a public marketplace, versus App Engine's six-year accumulated depth. This is a young catalog, not a parity claim.",
    keyDifferentiators: ['Governed, audited action execution by default', 'Public benchmark published even when the data is thin', 'Growing template/marketplace catalog, honestly small today'],
    proofLink: '/trust/agent-studio-benchmark', iconEmoji: '⚙️',
  },
  {
    slug: 'battlecard-itsm', name: 'IT Service Management', serviceNowModule: 'ITSM', verdict: 'TOGETHER',
    objection: '"We run ITSM for incident/change/problem management — are you asking us to rip it out?"',
    response: "No — this is the one case where the playbook's own recommendation is coexistence, and no Kangqore phase has built a competing capability here. The right pitch is Kangqore's ontology sitting alongside ITSM, not replacing it: import your CMDB via the Migration Accelerator (P7.2) and let HANUMANAS govern the AI layer on top, while ITSM keeps running the ticket queue it already runs well.",
    keyDifferentiators: ['No built Kangqore ITSM competitor — coexistence is the honest pitch', 'CMDB import path exists specifically to make coexistence real, not theoretical'],
    proofLink: '/kangqore-view/admin/ontology/pipelines', iconEmoji: '🎫',
  },
  {
    slug: 'battlecard-itom', name: 'IT Operations Management', serviceNowModule: 'ITOM', verdict: 'TOGETHER',
    objection: '"What does Kangqore do for infrastructure discovery and event correlation that ITOM doesn\'t?"',
    response: "Nothing built yet — said plainly rather than stretched. ITOM's discovery and correlation engine is out of scope for every phase this roadmap has shipped. The realistic position is the same as ITSM: Kangqore's ontology and governance layer sit above ITOM's existing infrastructure data, not in competition with it.",
    keyDifferentiators: ['No built Kangqore ITOM competitor — stated honestly, not hedged'],
    proofLink: '/trust', iconEmoji: '📡',
  },
]

async function ensureListing(seed: BattlecardSeed) {
  const existing = await (prisma as any).marketplaceListing.findUnique({ where: { slug: seed.slug } })
  if (existing) return existing
  return (prisma as any).marketplaceListing.create({
    data: {
      type: 'PACK', name: seed.name, slug: seed.slug, author: 'Kangqore', category: 'competitive',
      description: seed.objection, longDesc: seed.response, iconEmoji: seed.iconEmoji,
      tags: [seed.serviceNowModule, seed.verdict],
      manifest: {
        serviceNowModule: seed.serviceNowModule, verdict: seed.verdict,
        objection: seed.objection, response: seed.response,
        keyDifferentiators: seed.keyDifferentiators, proofLink: seed.proofLink,
      },
      status: 'PUBLISHED', publishedAt: new Date(),
    },
  })
}

export async function ensureBattlecardsSeeded(): Promise<void> {
  for (const seed of BATTLECARDS) await ensureListing(seed)
}

export async function getBattlecards() {
  await ensureBattlecardsSeeded()
  const listings = await (prisma as any).marketplaceListing.findMany({
    where: { type: 'PACK', category: 'competitive', status: 'PUBLISHED' },
    select: { id: true, name: true, slug: true, description: true, longDesc: true, iconEmoji: true, tags: true, manifest: true, publishedAt: true },
    orderBy: { name: 'asc' },
  })
  const won = listings.filter((l: any) => l.manifest?.verdict === 'WON').length
  const contested = listings.filter((l: any) => l.manifest?.verdict === 'CONTESTED').length
  const together = listings.filter((l: any) => l.manifest?.verdict === 'TOGETHER').length
  return {
    battlecards: listings,
    summary: { won, contested, together, total: listings.length },
    disclaimer: 'Every objection/response pair is authored content grounded in what this roadmap actually shipped, not fabricated case data — WON means a real P-phase built governed capability against that module; CONTESTED and TOGETHER are stated as honestly as the WON entries.',
    computedAt: new Date().toISOString(),
  }
}
