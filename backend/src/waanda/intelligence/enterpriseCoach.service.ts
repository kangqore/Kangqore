import { PrismaClient } from '@prisma/client'
import Anthropic from '@anthropic-ai/sdk'

const prisma = new PrismaClient()

// ─── Types ────────────────────────────────────────────────────────────────────

export type CoachCategory = 'DELIVERY' | 'FINANCE' | 'PIPELINE' | 'INTELLIGENCE' | 'CROSS_DEPT'

interface PatternSignal {
  category:       CoachCategory
  pattern:        string
  evidence:       Record<string, unknown>
  rawContext:     string   // sent to LLM
  priority:       'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  oisImpact:      number
  confidence:     number
}

export interface CoachingInsightResult {
  id:             string
  category:       CoachCategory
  pattern:        string
  evidence:       Record<string, unknown>
  insight:        string
  recommendation: string
  priority:       string
  oisImpact:      number
  confidence:     number
  isActed:        boolean
  actedAt:        string | null
  generatedAt:    string
}

// ─── LLM helper ───────────────────────────────────────────────────────────────

function anthropic() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY not set')
  return new Anthropic({ apiKey: key })
}

async function coachLLM(signal: PatternSignal): Promise<{ insight: string; recommendation: string }> {
  const client = anthropic()
  const system = `You are WAANDA's Enterprise Coach — Kangqore's cross-department intelligence advisor.
You observe patterns across departments (Projects, Finance, Sales, AI Intelligence) and coach the leadership team with specific, evidence-based advice.
Be direct, concise, and commercially minded. No fluff. Two outputs:
1. INSIGHT (2 sentences max): what the pattern means for the business
2. RECOMMENDATION (1 sentence): the single most important action to take this week
Format exactly as:
INSIGHT: <text>
RECOMMENDATION: <text>`

  const user = `Category: ${signal.category}
Pattern detected: ${signal.pattern}
Evidence: ${signal.rawContext}
Priority: ${signal.priority} | OIS Impact: +${signal.oisImpact} pts | Confidence: ${signal.confidence}%

Generate the coaching insight and recommendation.`

  const res = await client.messages.create({
    model:      'claude-haiku-4-5-20251001',  // fast + cheap for pattern coaching
    max_tokens: 200,
    messages:   [{ role: 'user', content: user }],
    system,
  })

  const text = (res.content[0] as any).text ?? ''
  const insightMatch = text.match(/INSIGHT:\s*(.+?)(?=RECOMMENDATION:|$)/s)
  const recMatch     = text.match(/RECOMMENDATION:\s*(.+)/s)

  return {
    insight:        insightMatch ? insightMatch[1].trim() : text.slice(0, 200).trim(),
    recommendation: recMatch    ? recMatch[1].trim()     : 'Review this pattern with your team.',
  }
}

function fallbackCoach(signal: PatternSignal): { insight: string; recommendation: string } {
  const templates: Record<CoachCategory, { insight: string; recommendation: string }> = {
    DELIVERY: {
      insight:        `Your delivery portfolio shows a pattern that needs attention: ${signal.pattern}. This directly impacts client satisfaction and OIS Enterprise pillar.`,
      recommendation: 'Run a project health sweep and review the top at-risk project with the delivery lead this week.',
    },
    FINANCE: {
      insight:        `A financial pattern has been detected: ${signal.pattern}. Left unaddressed, this compounds into cash flow risk.`,
      recommendation: 'Review your invoice aging report and prioritise the oldest outstanding amount first.',
    },
    PIPELINE: {
      insight:        `Your sales pipeline shows: ${signal.pattern}. Pipeline patterns are leading indicators — they predict revenue 30–60 days out.`,
      recommendation: 'Focus one hour this week on the deal most likely to close and remove any blockers.',
    },
    INTELLIGENCE: {
      insight:        `WAANDA usage data shows: ${signal.pattern}. How your team uses AI intelligence directly predicts adoption ROI and COIG.`,
      recommendation: 'Identify the most-dismissed recommendation type and investigate whether it\'s a relevance or trust issue.',
    },
    CROSS_DEPT: {
      insight:        `A cross-department pattern has emerged: ${signal.pattern}. These correlations are invisible from within a single department.`,
      recommendation: 'Bring delivery and sales leads together to review this pattern — the fix likely spans both teams.',
    },
  }
  return templates[signal.category]
}

// ─── Pattern detectors ────────────────────────────────────────────────────────

async function detectDeliveryPatterns(): Promise<PatternSignal[]> {
  const signals: PatternSignal[] = []

  const ops = await prisma.projectOperationalState.findMany({
    include: { project: { select: { title: true, dueDate: true, createdAt: true } } },
  }).catch(() => [])

  if (ops.length === 0) return signals

  const avgHealth    = ops.reduce((s, o) => s + o.health, 0) / ops.length
  const atRisk       = ops.filter(o => o.health < 60)
  const highConf     = ops.filter(o => o.confidence < 30)
  const withBlockers = ops.filter(o => (o.blockers as any[]).length > 0)

  if (avgHealth < 70) {
    signals.push({
      category:   'DELIVERY',
      pattern:    `Portfolio health averaging ${Math.round(avgHealth)}/100 — below the 70-point threshold`,
      evidence:   { avgHealth, projectCount: ops.length, atRiskCount: atRisk.length },
      rawContext:  `${ops.length} active projects. Average health: ${Math.round(avgHealth)}/100. ${atRisk.length} projects below 60 health: ${atRisk.map(o => o.project.title).join(', ')}.`,
      priority:   avgHealth < 50 ? 'CRITICAL' : 'HIGH',
      oisImpact:  Math.round((70 - avgHealth) * 0.18),
      confidence: Math.min(ops.length * 25, 90),
    })
  }

  if (withBlockers.length > 0) {
    const allBlockers = withBlockers.flatMap(o => (o.blockers as any[]).map(b => b.label))
    signals.push({
      category:   'DELIVERY',
      pattern:    `${withBlockers.length} of ${ops.length} projects have active blockers`,
      evidence:   { blockedProjects: withBlockers.length, totalProjects: ops.length, sampleBlockers: allBlockers.slice(0, 3) },
      rawContext:  `${withBlockers.length} projects with open blockers: ${allBlockers.slice(0, 3).join('; ')}. Blockers increase delay risk by ~30%.`,
      priority:   'MEDIUM',
      oisImpact:  4,
      confidence: 80,
    })
  }

  if (highConf.length > 0) {
    signals.push({
      category:   'DELIVERY',
      pattern:    `${highConf.length} project(s) have confidence < 30% — progress data is unreliable`,
      evidence:   { lowConfidenceCount: highConf.length, projects: highConf.map(o => o.project.title) },
      rawContext:  `Projects with confidence below 30%: ${highConf.map(o => o.project.title).join(', ')}. Low confidence means OIS Enterprise score cannot accurately reflect delivery reality.`,
      priority:   'MEDIUM',
      oisImpact:  3,
      confidence: 85,
    })
  }

  return signals
}

async function detectFinancePatterns(): Promise<PatternSignal[]> {
  const signals: PatternSignal[] = []

  const [invoices, changeRequests] = await Promise.all([
    prisma.invoice.findMany({
      select: { status: true, dueDate: true, paidAt: true, amount: true, createdAt: true },
    }).catch(() => []),
    prisma.changeRequest.count({ where: { status: { notIn: ['APPROVED', 'REJECTED'] } } }).catch(() => 0),
  ])

  if (invoices.length === 0) {
    // Blind spot insight — no invoice data
    signals.push({
      category:   'FINANCE',
      pattern:    'No invoice history — finance visibility blind spot',
      evidence:   { invoiceCount: 0 },
      rawContext:  'Zero invoices in the system. WAANDA cannot detect payment patterns, overdue risk, or cash flow trends. Finance pillar is operating without data.',
      priority:   'HIGH',
      oisImpact:  5,
      confidence: 100,
    })
    return signals
  }

  const overdue = invoices.filter(i =>
    !['PAID', 'CANCELLED'].includes(i.status) && new Date(i.dueDate) < new Date()
  )
  const paid    = invoices.filter(i => i.status === 'PAID' && i.paidAt)

  if (overdue.length > 0) {
    const overdueTotal = overdue.reduce((s, i) => s + Number(i.amount), 0)
    signals.push({
      category:   'FINANCE',
      pattern:    `${overdue.length} overdue invoice${overdue.length > 1 ? 's' : ''} — ₹${overdueTotal.toLocaleString()} at risk`,
      evidence:   { overdueCount: overdue.length, totalAtRisk: overdueTotal },
      rawContext:  `${overdue.length} unpaid invoices past due date. Total at risk: ₹${overdueTotal.toLocaleString()}. Overdue receivables damage OIS Business pillar.`,
      priority:   overdueTotal > 500000 ? 'CRITICAL' : 'HIGH',
      oisImpact:  8,
      confidence: 95,
    })
  }

  if (paid.length >= 3) {
    const payTimes = paid
      .filter(i => i.paidAt)
      .map(i => Math.ceil((new Date(i.paidAt!).getTime() - new Date(i.createdAt).getTime()) / 86400000))
    const avgDays = Math.round(payTimes.reduce((a, b) => a + b, 0) / payTimes.length)
    if (avgDays > 30) {
      signals.push({
        category:   'FINANCE',
        pattern:    `Average invoice payment time: ${avgDays} days — above 30-day target`,
        evidence:   { avgPaymentDays: avgDays, sampleSize: paid.length },
        rawContext:  `Based on ${paid.length} paid invoices, average time to payment is ${avgDays} days. Standard professional services target is 30 days.`,
        priority:   avgDays > 60 ? 'HIGH' : 'MEDIUM',
        oisImpact:  4,
        confidence: Math.min(paid.length * 20, 85),
      })
    }
  }

  if (changeRequests > 2) {
    signals.push({
      category:   'FINANCE',
      pattern:    `${changeRequests} unresolved change requests — scope creep accumulating`,
      evidence:   { openChangeRequests: changeRequests },
      rawContext:  `${changeRequests} change requests pending approval. Unresolved scope changes delay invoicing and erode margin.`,
      priority:   'MEDIUM',
      oisImpact:  3,
      confidence: 90,
    })
  }

  return signals
}

async function detectPipelinePatterns(): Promise<PatternSignal[]> {
  const signals: PatternSignal[] = []

  const leads = await prisma.eqoreLead.findMany({
    select: { status: true, leadScore: true, createdAt: true, updatedAt: true },
  }).catch(() => [])

  if (leads.length === 0) return signals

  const total        = leads.length
  const won          = leads.filter((l) => l.status === 'WON').length
  const lost         = leads.filter((l) => l.status === 'LOST').length
  const active       = leads.filter((l) => !['WON', 'LOST', 'CHURNED'].includes(l.status)).length
  const stalled      = leads.filter((l) => {
    const daysSinceUpdate = (Date.now() - new Date(l.updatedAt).getTime()) / 86400000
    return !['WON', 'LOST', 'CHURNED'].includes(l.status) && daysSinceUpdate > 7
  })
  const scoredLeads  = leads.filter((l) => l.leadScore > 0)
  const avgScore     = scoredLeads.length > 0
    ? scoredLeads.reduce((s, l) => s + l.leadScore, 0) / scoredLeads.length
    : 0
  const winRate      = (won + lost) > 0 ? Math.round((won / (won + lost)) * 100) : null

  if (stalled.length > 0) {
    signals.push({
      category:   'PIPELINE',
      pattern:    `${stalled.length} lead${stalled.length > 1 ? 's' : ''} stalled for 7+ days without a status update`,
      evidence:   { stalledCount: stalled.length, activeLeads: active },
      rawContext:  `${stalled.length} of ${active} active leads have not moved in 7+ days. Stalled pipeline is the top predictor of lost deals.`,
      priority:   stalled.length > 2 ? 'HIGH' : 'MEDIUM',
      oisImpact:  5,
      confidence: 90,
    })
  }

  if (winRate !== null && winRate < 40) {
    signals.push({
      category:   'PIPELINE',
      pattern:    `Win rate at ${winRate}% — below 40% professional services benchmark`,
      evidence:   { wonDeals: won, lostDeals: lost, winRatePct: winRate },
      rawContext:  `${won} won, ${lost} lost. Win rate: ${winRate}%. Professional services benchmark is 40–60%. Low win rate suggests ICP fit, pricing, or proposal quality issues.`,
      priority:   winRate < 25 ? 'CRITICAL' : 'HIGH',
      oisImpact:  6,
      confidence: Math.min((won + lost) * 20, 90),
    })
  }

  if (avgScore < 50 && scoredLeads.length > 2) {
    signals.push({
      category:   'PIPELINE',
      pattern:    `Average lead score ${Math.round(avgScore)}/100 — pipeline quality below threshold`,
      evidence:   { avgScore: Math.round(avgScore), scoredLeads: scoredLeads.length },
      rawContext:  `Average lead quality score: ${Math.round(avgScore)}/100 across ${scoredLeads.length} scored leads. Scores below 50 suggest ICP drift or insufficient lead qualification.`,
      priority:   'MEDIUM',
      oisImpact:  4,
      confidence: 75,
    })
  }

  return signals
}

async function detectIntelligencePatterns(): Promise<PatternSignal[]> {
  const signals: PatternSignal[] = []

  const [approvals, wfRuns, adoptionEvents] = await Promise.all([
    prisma.kimmpApprovalRequest.findMany({
      select: { status: true, requestedAt: true },
      orderBy: { requestedAt: 'desc' },
      take: 50,
    }).catch(() => []),
    prisma.osWorkflowRun.findMany({
      select: { status: true, startedAt: true },
      orderBy: { startedAt: 'desc' },
      take: 50,
    }).catch(() => []),
    prisma.adoptionEvent.findMany({
      select: { eventType: true, occurredAt: true },
      orderBy: { occurredAt: 'desc' },
      take: 100,
    }).catch(() => []),
  ])

  const totalApprovals = approvals.length
  const executed       = approvals.filter((a: any) => a.status === 'EXECUTED').length
  const rejected       = approvals.filter((a: any) => a.status === 'REJECTED').length
  const acceptRate     = totalApprovals > 0 ? Math.round((executed / totalApprovals) * 100) : null

  if (acceptRate !== null && acceptRate < 50 && totalApprovals >= 5) {
    signals.push({
      category:   'INTELLIGENCE',
      pattern:    `KIMMP recommendation acceptance rate at ${acceptRate}% — trust gap detected`,
      evidence:   { acceptRate, executed, rejected, total: totalApprovals },
      rawContext:  `${executed} of ${totalApprovals} KIMMP recommendations accepted (${acceptRate}%). ${rejected} explicitly rejected. Low acceptance rate signals either relevance issues or insufficient operator trust in WAANDA.`,
      priority:   acceptRate < 30 ? 'HIGH' : 'MEDIUM',
      oisImpact:  8,
      confidence: Math.min(totalApprovals * 5, 90),
    })
  }

  const failedWf = wfRuns.filter((r: any) => r.status === 'FAILED').length
  if (wfRuns.length > 0 && failedWf / wfRuns.length > 0.2) {
    signals.push({
      category:   'INTELLIGENCE',
      pattern:    `${Math.round((failedWf / wfRuns.length) * 100)}% workflow failure rate — automation reliability issue`,
      evidence:   { failedCount: failedWf, totalRuns: wfRuns.length },
      rawContext:  `${failedWf} of ${wfRuns.length} workflow runs failed. High failure rate reduces Adoption pillar score and erodes operator confidence in autonomous execution.`,
      priority:   'HIGH',
      oisImpact:  6,
      confidence: 85,
    })
  }

  const recActed   = adoptionEvents.filter((e: any) => e.eventType === 'REC_ACTED').length
  const recIgnored = adoptionEvents.filter((e: any) => e.eventType === 'REC_IGNORED').length
  if (adoptionEvents.length === 0) {
    signals.push({
      category:   'INTELLIGENCE',
      pattern:    'No adoption events recorded — WAANDA engagement is unmeasured',
      evidence:   { adoptionEventCount: 0 },
      rawContext:  'Zero adoption events in the system. WAANDA cannot distinguish between active use and passive installation. Adoption Intelligence pillar is running on proxy data only.',
      priority:   'MEDIUM',
      oisImpact:  5,
      confidence: 100,
    })
  } else if (recIgnored > recActed && recIgnored > 3) {
    signals.push({
      category:   'INTELLIGENCE',
      pattern:    `More recommendations dismissed (${recIgnored}) than acted on (${recActed})`,
      evidence:   { acted: recActed, ignored: recIgnored, ratio: Math.round(recIgnored / (recActed + recIgnored) * 100) },
      rawContext:  `${recIgnored} recommendations dismissed vs ${recActed} acted on. When dismissal exceeds action, it signals either misaligned recommendations or insufficient context for operators to trust them.`,
      priority:   'MEDIUM',
      oisImpact:  4,
      confidence: 80,
    })
  }

  return signals
}

async function detectCrossDeptPatterns(
  deliverySignals: PatternSignal[],
  pipelineSignals: PatternSignal[],
  financeSignals:  PatternSignal[],
): Promise<PatternSignal[]> {
  const signals: PatternSignal[] = []

  // Correlation: delivery risk + pipeline pressure
  const hasDeliveryRisk  = deliverySignals.some(s => s.priority === 'HIGH' || s.priority === 'CRITICAL')
  const hasPipelinePush  = pipelineSignals.some(s => s.pattern.includes('stalled') || s.pattern.includes('win rate'))

  if (hasDeliveryRisk && hasPipelinePush) {
    signals.push({
      category:   'CROSS_DEPT',
      pattern:    'Delivery stress coincides with pipeline pressure — capacity squeeze risk',
      evidence:   {
        deliveryAtRisk:   deliverySignals.filter(s => s.priority === 'HIGH' || s.priority === 'CRITICAL').length,
        pipelinePatterns: pipelineSignals.length,
      },
      rawContext:  'Delivery portfolio showing health issues at the same time as pipeline activity. Winning new business while existing projects are under-resourced creates a compounding capacity problem.',
      priority:   'HIGH',
      oisImpact:  7,
      confidence: 70,
    })
  }

  // Correlation: finance blind spot + active pipeline = cash flow risk
  const hasFinanceBlindSpot = financeSignals.some(s => s.pattern.includes('blind spot'))
  const hasActivePipeline   = pipelineSignals.length > 0

  if (hasFinanceBlindSpot && hasActivePipeline) {
    signals.push({
      category:   'CROSS_DEPT',
      pattern:    'Active pipeline with no invoice tracking — revenue recognition risk',
      evidence:   { activeLeadSignals: pipelineSignals.length, invoiceVisibility: 'NONE' },
      rawContext:  'Sales pipeline is active but no invoices are being tracked. Revenue from won deals cannot be confirmed without invoice records. This creates a gap between sales wins and actual cash collection.',
      priority:   'HIGH',
      oisImpact:  6,
      confidence: 95,
    })
  }

  return signals
}

// ─── Main coach function ──────────────────────────────────────────────────────

export async function computeCoachingInsights(): Promise<CoachingInsightResult[]> {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY

  // Detect patterns from all departments in parallel
  const [deliverySignals, financeSignals, pipelineSignals, intelligenceSignals] = await Promise.all([
    detectDeliveryPatterns(),
    detectFinancePatterns(),
    detectPipelinePatterns(),
    detectIntelligencePatterns(),
  ])

  const crossSignals = await detectCrossDeptPatterns(deliverySignals, pipelineSignals, financeSignals)

  const allSignals = [
    ...deliverySignals,
    ...financeSignals,
    ...pipelineSignals,
    ...intelligenceSignals,
    ...crossSignals,
  ].sort((a, b) => {
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  // Clear stale insights older than 24h
  await prisma.coachingInsight.deleteMany({
    where: { generatedAt: { lt: new Date(Date.now() - 24 * 3_600_000) }, isActed: false },
  }).catch(() => {})

  const results: CoachingInsightResult[] = []

  for (const signal of allSignals) {
    const { insight, recommendation } = hasApiKey
      ? await coachLLM(signal).catch(() => fallbackCoach(signal))
      : fallbackCoach(signal)

    const record = await prisma.coachingInsight.create({
      data: {
        category:       signal.category,
        pattern:        signal.pattern,
        evidence:       signal.evidence as any,
        insight,
        recommendation,
        priority:       signal.priority,
        oisImpact:      signal.oisImpact,
        confidence:     signal.confidence,
        generatedAt:    new Date(),
      },
    })

    results.push({
      id:             record.id,
      category:       record.category as CoachCategory,
      pattern:        record.pattern,
      evidence:       record.evidence as Record<string, unknown>,
      insight:        record.insight,
      recommendation: record.recommendation,
      priority:       record.priority,
      oisImpact:      record.oisImpact,
      confidence:     record.confidence,
      isActed:        record.isActed,
      actedAt:        record.actedAt?.toISOString() ?? null,
      generatedAt:    record.generatedAt.toISOString(),
    })
  }

  return results
}

export async function getLatestCoachingInsights(): Promise<CoachingInsightResult[]> {
  const records = await prisma.coachingInsight.findMany({
    where:   { generatedAt: { gte: new Date(Date.now() - 24 * 3_600_000) } },
    orderBy: [{ priority: 'asc' }, { oisImpact: 'desc' }],
  }).catch(() => [])

  // If stale or empty, recompute
  if (records.length === 0) return computeCoachingInsights()

  return records.map(r => ({
    id:             r.id,
    category:       r.category as CoachCategory,
    pattern:        r.pattern,
    evidence:       r.evidence as Record<string, unknown>,
    insight:        r.insight,
    recommendation: r.recommendation,
    priority:       r.priority,
    oisImpact:      r.oisImpact,
    confidence:     r.confidence,
    isActed:        r.isActed,
    actedAt:        r.actedAt?.toISOString() ?? null,
    generatedAt:    r.generatedAt.toISOString(),
  }))
}

export async function markInsightActed(id: string): Promise<void> {
  await prisma.coachingInsight.update({
    where: { id },
    data:  { isActed: true, actedAt: new Date() },
  })
}
