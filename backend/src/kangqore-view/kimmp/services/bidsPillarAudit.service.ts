import { prisma } from '../../../lib/prisma'

// ─── Pillar definitions ───────────────────────────────────────────────────────
// Each pillar lists: signal keywords, workflow categories, agent role keywords,
// and which industry packs cover it.
const PILLARS = [
  {
    id: 1,  name: 'Business Strategy Intelligence™',
    signalKeywords: ['STRATEGIC', 'STRATEGY', 'OBJECTIVE'],
    wfCategories: ['strategy', 'ops'],
    agentKeywords: ['strategy', 'planning', 'roadmap'],
    packs: ['PS Pack', 'Healthcare', 'Manufacturing'],
  },
  {
    id: 2,  name: 'Leadership Intelligence™',
    signalKeywords: ['DECISION', 'EXECUTIVE', 'LEADERSHIP'],
    wfCategories: ['hr', 'ops'],
    agentKeywords: ['executive', 'leadership', 'governance'],
    packs: ['PS Pack'],
  },
  {
    id: 3,  name: 'Financial Intelligence™',
    signalKeywords: ['FINANCIAL', 'REVENUE', 'INVOICE', 'BUDGET'],
    wfCategories: ['finance'],
    agentKeywords: ['finance', 'revenue', 'budget', 'invoice'],
    packs: ['Manufacturing'],
  },
  {
    id: 4,  name: 'Operational Intelligence™',
    signalKeywords: ['OPERATIONAL', 'EFFICIENCY', 'PROCESS'],
    wfCategories: ['ops', 'delivery'],
    agentKeywords: ['operations', 'process', 'delivery', 'ops'],
    packs: ['Healthcare', 'Manufacturing'],
  },
  {
    id: 5,  name: 'Workforce Intelligence™',
    signalKeywords: ['WORKFORCE', 'HR', 'TALENT', 'EMPLOYEE'],
    wfCategories: ['hr'],
    agentKeywords: ['hr', 'workforce', 'talent', 'employee'],
    packs: ['Healthcare'],
  },
  {
    id: 6,  name: 'Customer Intelligence™',
    signalKeywords: ['CUSTOMER', 'CLIENT', 'EXPERIENCE', 'CHURN'],
    wfCategories: ['sales', 'marketing'],
    agentKeywords: ['customer', 'client', 'crm', 'health'],
    packs: ['Healthcare'],
  },
  {
    id: 7,  name: 'Sales Intelligence™',
    signalKeywords: ['REVENUE', 'SALES', 'PIPELINE', 'LEAD', 'OPPORTUNITY'],
    wfCategories: ['sales'],
    agentKeywords: ['sales', 'revenue', 'pipeline', 'lead'],
    packs: ['PS Pack'],
  },
  {
    id: 8,  name: 'Growth Intelligence™',
    signalKeywords: ['GROWTH', 'MARKET', 'DIGITAL', 'ACQUISITION'],
    wfCategories: ['marketing'],
    agentKeywords: ['growth', 'marketing', 'digital', 'market'],
    packs: [],
  },
  {
    id: 9,  name: 'Technology Intelligence™',
    signalKeywords: ['TECHNOLOGY', 'PLATFORM', 'INTEGRATION', 'SYSTEM'],
    wfCategories: ['ops'],
    agentKeywords: ['technology', 'platform', 'integration', 'tech'],
    packs: ['PS Pack', 'Manufacturing'],
  },
  {
    id: 10, name: 'Cloud & Infrastructure Intelligence™',
    signalKeywords: ['INFRASTRUCTURE', 'CLOUD', 'DEPLOYMENT', 'TENANT'],
    wfCategories: ['ops'],
    agentKeywords: ['infrastructure', 'cloud', 'deployment', 'tenant'],
    packs: ['Manufacturing'],
  },
  {
    id: 11, name: 'Data Intelligence™',
    signalKeywords: ['DATA', 'PATTERN', 'ANOMALY', 'INSIGHT'],
    wfCategories: ['ops'],
    agentKeywords: ['data', 'analytics', 'pattern', 'ontology'],
    packs: ['PS Pack', 'Healthcare'],
  },
  {
    id: 12, name: 'AI Intelligence™',
    signalKeywords: ['AI', 'MODEL', 'KIMMP', 'WAANDA', 'AGENT'],
    wfCategories: ['ops'],
    agentKeywords: ['ai', 'model', 'training', 'intelligence'],
    packs: ['PS Pack'],
  },
  {
    id: 13, name: 'Automation Intelligence™',
    signalKeywords: ['AUTOMATION', 'WORKFLOW', 'TRIGGER', 'SCHEDULE'],
    wfCategories: ['ops', 'sales', 'marketing', 'hr', 'finance'],
    agentKeywords: ['automation', 'workflow', 'trigger', 'schedule'],
    packs: ['Manufacturing'],
  },
  {
    id: 14, name: 'Cybersecurity Intelligence™',
    signalKeywords: ['SECURITY', 'COMPLIANCE', 'THREAT', 'VULNERABILITY'],
    wfCategories: ['ops'],
    agentKeywords: ['security', 'compliance', 'shield', 'threat'],
    packs: ['PS Pack', 'Healthcare'],
  },
  {
    id: 15, name: 'Governance & Risk Intelligence™',
    signalKeywords: ['GOVERNANCE', 'RISK', 'COMPLIANCE', 'AUDIT'],
    wfCategories: ['ops'],
    agentKeywords: ['governance', 'risk', 'audit', 'control'],
    packs: ['PS Pack', 'Healthcare'],
  },
  {
    id: 16, name: 'Transformation Intelligence™',
    signalKeywords: ['TRANSFORMATION', 'STRATEGIC', 'CHANGE', 'INITIATIVE'],
    wfCategories: ['strategy', 'ops'],
    agentKeywords: ['transformation', 'change', 'initiative', 'strategic'],
    packs: ['PS Pack', 'Healthcare', 'Manufacturing'],
  },
]

// ─── Compute audit ────────────────────────────────────────────────────────────
export async function runBidsPillarAudit(trigger: 'nightly' | 'manual') {
  // Pull raw counts once (shared across all pillars)
  const [signalCounts, workflowsByCategory, agentRoles] = await Promise.all([
    // Signal type counts in last 90 days
    (prisma as any).kimmpSignal.groupBy({
      by: ['signalType'],
      _count: { id: true },
      where: { createdAt: { gte: new Date(Date.now() - 90 * 24 * 3600 * 1000) } },
    }).catch(() => [] as { signalType: string; _count: { id: number } }[]),

    // Workflow counts by category
    (prisma as any).osWorkflow.groupBy({
      by: ['category'],
      _count: { id: true },
    }).catch(() => [] as { category: string; _count: { id: number } }[]),

    // Agent run role keyword list (unique roles from last 30 days)
    (prisma as any).aegisAgentRun.findMany({
      select: { agentRole: true },
      distinct: ['agentRole'],
      take: 500,
    }).catch(() => [] as { agentRole: string }[]),
  ])

  const signalMap = new Map<string, number>()
  for (const s of signalCounts) {
    signalMap.set((s.signalType ?? '').toUpperCase(), s._count.id)
  }

  const wfMap = new Map<string, number>()
  for (const w of workflowsByCategory) {
    wfMap.set(w.category, w._count.id)
  }

  const agentRoleSet: string[] = agentRoles.map((a: any) => (a.agentRole ?? '').toLowerCase())

  // Score each pillar
  const scores = PILLARS.map(p => {
    // kpiCount: sum of matching signal type counts
    const kpiCount = p.signalKeywords.reduce((sum, kw) => {
      for (const [type, count] of signalMap.entries()) {
        if (type.includes(kw)) sum += count
      }
      return sum
    }, 0)

    // workflowTemplateCount: sum of workflows in matching categories
    const workflowTemplateCount = p.wfCategories.reduce((sum, cat) => sum + (wfMap.get(cat) ?? 0), 0)

    // agentsCoverage: % of known agent roles that match any keyword (0–100)
    const matchingAgents = agentRoleSet.filter(role =>
      p.agentKeywords.some(kw => role.includes(kw))
    ).length
    const agentsCoverage = agentRoleSet.length > 0
      ? Math.min(100, Math.round((matchingAgents / Math.max(agentRoleSet.length, 1)) * 100))
      : 0

    // ontologyTypes: static count based on pillar domain breadth
    const ontologyTypes = Math.min(11, p.signalKeywords.length + p.wfCategories.length)

    // Score formula (0–100):
    //   40% KPI signal presence (capped at 200 signals = 100%)
    //   30% workflow coverage (capped at 10 workflows = 100%)
    //   20% agents coverage (already 0–100)
    //   10% ontology breadth (capped at 11 types = 100%)
    const kpiScore      = Math.min(100, (kpiCount / 200) * 100)
    const wfScore       = Math.min(100, (workflowTemplateCount / 10) * 100)
    const ontologyScore = Math.min(100, (ontologyTypes / 11) * 100)
    const rawScore      = kpiScore * 0.4 + wfScore * 0.3 + agentsCoverage * 0.2 + ontologyScore * 0.1

    return {
      pillarId: p.id,
      pillarName: p.name,
      kpiCount: Math.min(kpiCount, 9999),
      workflowTemplateCount,
      agentsCoverage,
      ontologyTypes,
      industryPackCoverage: p.packs,
      score: Math.round(rawScore * 10) / 10,
    }
  })

  const overallScore = Math.round(
    (scores.reduce((s, p) => s + p.score, 0) / scores.length) * 10
  ) / 10

  // Persist
  const run = await (prisma as any).bidsPillarAuditRun.create({
    data: {
      trigger,
      overallScore,
      scores: {
        create: scores,
      },
    },
    include: { scores: true },
  })

  // Fire KIMMP signals for any pillar below 50
  const lowPillars = scores.filter(p => p.score < 50)
  for (const lp of lowPillars) {
    await (prisma as any).kimmpSignal.create({
      data: {
        signalType:  'BIDS_PILLAR_GAP',
        category:    'governance',
        priority:    'high',
        title:       `BIDS™ pillar gap: ${lp.pillarName}`,
        summary:     `${lp.pillarName} scored ${lp.score}/100 — below the 50-point coverage threshold.`,
        detail:      `KPI signals: ${lp.kpiCount} · Workflow templates: ${lp.workflowTemplateCount} · Agent coverage: ${lp.agentsCoverage}%`,
        action:      'Review BIDS™ Completeness dashboard and add workflows or agents to close the gap.',
        module:      'BIDS',
        confidence:  95,
        impact:      `Pillar ${lp.pillarId}: ${lp.pillarName}`,
        severity:    'HIGH',
        status:      'ACTIVE',
      },
    }).catch(() => {})
  }

  return run
}

// ─── Training corpus curation (S78) ──────────────────────────────────────────
export async function runWaandaFMCuration(qualityThreshold = 0.85) {
  const sources = await Promise.all([
    // Strategic decisions → DECIDE phase
    (prisma as any).kimmpStrategicDecision.findMany({
      where: { confidence: { gte: qualityThreshold * 100 } },
      select: { id: true, question: true, reasoning: true, selectedOption: true, confidence: true },
      take: 500,
    }).catch(() => []),

    // Plan decompositions → PLAN phase
    (prisma as any).planDecompositionTree.findMany({
      where: { status: 'DONE' },
      select: { id: true, goal: true, subtasks: true },
      take: 200,
    }).catch(() => []),
  ])

  const [decisions, plans] = sources
  const examples: Array<{
    phase: string; prompt: string; completion: string
    sourceType: string; sourceId: string; quality: number; included: boolean
  }> = []

  for (const d of decisions as any[]) {
    if (!d.question || !d.reasoning) continue
    const quality = Math.min(1, (d.confidence ?? 0) / 100)
    examples.push({
      phase: 'DECIDE',
      prompt: `Enterprise decision required: ${d.question}`,
      completion: d.reasoning,
      sourceType: 'strategic_decision',
      sourceId: d.id,
      quality,
      included: quality >= qualityThreshold,
    })
  }

  for (const p of plans as any[]) {
    if (!p.goal || !p.subtasks) continue
    const subtasks = Array.isArray(p.subtasks) ? p.subtasks : []
    if (!subtasks.length) continue
    examples.push({
      phase: 'PLAN',
      prompt: `Decompose this goal into sequential subtasks: ${p.goal}`,
      completion: JSON.stringify(subtasks.map((t: any) => ({ label: t.label, agentRole: t.agentRole, steps: t.steps })), null, 2),
      sourceType: 'plan',
      sourceId: p.id,
      quality: 0.9,
      included: true,
    })
  }

  const byPhase: Record<string, number> = {}
  for (const ex of examples) {
    byPhase[ex.phase] = (byPhase[ex.phase] ?? 0) + (ex.included ? 1 : 0)
  }

  const scan = await (prisma as any).waandaFMCorpusScan.create({
    data: {
      qualityThreshold,
      totalScanned: examples.length,
      totalIncluded: examples.filter(e => e.included).length,
      byPhase,
    },
  })

  if (examples.length > 0) {
    await (prisma as any).waandaFMTrainingExample.createMany({
      data: examples.map(e => ({ ...e, scanId: scan.id })),
      skipDuplicates: false,
    })
  }

  return scan
}
