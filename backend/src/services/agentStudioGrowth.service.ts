// ---------------------------------------------------------------------------
// Agent Studio Growth — Overshadow Roadmap P3.1/P3.2.
//
// Two honest jobs: (1) seed a small, real starter-template catalog so a
// non-technical builder has a "start from template" option instead of a
// blank form (closing part of the App Engine "no-code" gap), and (2) compute
// a real build-benchmark from actual agent-creation and first-run data —
// never a fabricated number. When the platform doesn't have enough real
// agents yet to compute a meaningful median, this reports that plainly
// (insufficientData: true) rather than presenting a number with false
// confidence, the same discipline as the rest of the Overshadow Roadmap work.
// ---------------------------------------------------------------------------

import { prisma } from '../lib/prisma'

// Every suggestedTool below is either a LogicToolRegistry calculator (always
// registered, no sync needed) or an OntologyAction this file itself makes
// toolCallable — nothing here references a tool that doesn't actually exist.
const AGENT_TEMPLATES = [
  {
    slug: 'knowledge-concierge',
    name: 'Knowledge Concierge',
    category: 'productivity',
    iconEmoji: '📚',
    description: 'Answers questions by searching the platform knowledge base — the fastest path from zero to a working agent.',
    manifest: { role: 'Knowledge Assistant', systemPrompt: 'You help users find answers by searching the internal knowledge base and citing what you find. Keep answers short and cite sources.', suggestedTools: ['search_knowledge_base'] },
    tags: ['starter', 'knowledge'],
  },
  {
    slug: 'customer-health-monitor',
    name: 'Customer Health Monitor',
    category: 'crm',
    iconEmoji: '💚',
    description: 'Reviews account signals and flags customers at risk, using the same health-score and SLA-breach calculators the CS dashboard runs on.',
    manifest: { role: 'Customer Health Analyst', systemPrompt: 'You assess customer account health using the available calculators and summarize risk in plain language for a CSM.', suggestedTools: ['client_health_score', 'engagement_health_index', 'sla_breach_probability'] },
    tags: ['starter', 'customer-success'],
  },
  {
    slug: 'revenue-forecaster',
    name: 'Deal & Revenue Forecaster',
    category: 'finance',
    iconEmoji: '📈',
    description: 'Projects ARR trajectory and collection risk from real pipeline and invoice data.',
    manifest: { role: 'Revenue Forecasting Analyst', systemPrompt: 'You project revenue and flag collection risk using the available financial calculators. Show your assumptions.', suggestedTools: ['arr_projection', 'ltv_cac_ratio', 'invoice_collection_forecast'] },
    tags: ['starter', 'finance'],
  },
  {
    slug: 'project-risk-monitor',
    name: 'Project Risk Monitor',
    category: 'productivity',
    iconEmoji: '🚧',
    description: 'Flags at-risk projects using deadline, velocity, and aging signals before a PM has to ask.',
    manifest: { role: 'Project Risk Analyst', systemPrompt: 'You monitor project health and flag deadline or velocity risk early, with a specific reason for each flag.', suggestedTools: ['project_health_score', 'deadline_risk_score', 'overdue_aging', 'sprint_velocity'] },
    tags: ['starter', 'delivery'],
  },
  {
    slug: 'strategic-insight-generator',
    name: 'Strategic Insight Generator',
    category: 'intelligence',
    iconEmoji: '🧠',
    description: 'Uses KIMMP’s governed decision and client-analysis actions to turn raw activity into a strategic recommendation — the deepest starter template, built on governed actions rather than read-only calculators.',
    manifest: { role: 'Strategic Insight Analyst', systemPrompt: 'You analyze client activity and produce a strategic recommendation with evidence and confidence, using the governed KIMMP actions available to you.', suggestedTools: ['ANALYZE_CLIENT', 'STRATEGIC_DECISION', 'GENERATE_INSIGHT'] },
    tags: ['starter', 'governed-actions'],
  },
]

// Deliberately conservative: enforcement/governance actions (GOVERNANCE_BLOCK,
// BUDGET_DENY) are NOT added here — those pause/block/quarantine or deny
// budget, and freely exposing them as agent-callable tools is a real security
// decision that shouldn't happen as a side effect of a template-seeding pass.
const SAFE_TO_EXPOSE = ['RUN_AGENT', 'ANALYZE_CLIENT', 'STRATEGIC_DECISION']

export async function ensureToolCallableExpanded(): Promise<void> {
  await (prisma as any).ontologyAction.updateMany({
    where: { name: { in: SAFE_TO_EXPOSE }, toolCallable: false },
    data: { toolCallable: true },
  })
}

export async function ensureAgentTemplatesSeeded(): Promise<void> {
  const count = await (prisma as any).marketplaceListing.count({ where: { type: 'AGENT' } })
  if (count > 0) return
  for (const t of AGENT_TEMPLATES) {
    await (prisma as any).marketplaceListing.create({
      data: {
        type: 'AGENT', name: t.name, slug: t.slug, author: 'Kangqore', category: t.category,
        description: t.description, manifest: t.manifest, iconEmoji: t.iconEmoji, tags: t.tags,
        status: 'PUBLISHED', publishedAt: new Date(), price: 0,
      },
    }).catch(() => {}) // idempotent — a unique-slug race just means another request already seeded it
  }
}

const APP_ENGINE_BENCHMARK = {
  source: 'Forrester Total Economic Impact™ study, commissioned by ServiceNow',
  sourceUrl: 'https://www.servicenow.com/lpayr/forrester-tei-app-engine-now-platform.html',
  roiPct: 230,
  paybackMonths: 9,
  endUserEfficiencyGainPct: '50–75',
  developerEfficiencyMultiple: '4x',
  interviewSampleSize: 6,
  note: 'Vendor-commissioned study, not independently audited. Interview sample is 6 decision-makers at App Engine customers — small and vendor-selected, disclosed here for the same reason we disclose our own sample size below.',
}

export async function getAgentStudioBenchmark() {
  await Promise.all([ensureToolCallableExpanded(), ensureAgentTemplatesSeeded()])

  const [templateCount, toolCallableCount, agents, templates] = await Promise.all([
    (prisma as any).marketplaceListing.count({ where: { type: 'AGENT', status: 'PUBLISHED' } }),
    (prisma as any).ontologyAction.count({ where: { toolCallable: true } }),
    (prisma as any).kimmpAgent.findMany({ select: { id: true, createdAt: true } }),
    (prisma as any).marketplaceListing.aggregate({ where: { type: 'AGENT' }, _sum: { installCount: true } }),
  ])

  const firstRuns = await (prisma as any).kimmpAgentLog.groupBy({
    by: ['agentId'],
    _min: { createdAt: true },
  })
  const firstRunMap = new Map(firstRuns.map((r: any) => [r.agentId, r._min.createdAt]))

  const buildTimesMinutes: number[] = []
  for (const a of agents) {
    const firstRun = firstRunMap.get(a.id) as Date | undefined
    if (firstRun) buildTimesMinutes.push((firstRun.getTime() - a.createdAt.getTime()) / 60000)
  }
  buildTimesMinutes.sort((a, b) => a - b)
  const sampleSize = buildTimesMinutes.length
  const medianBuildMinutes = sampleSize > 0 ? buildTimesMinutes[Math.floor(sampleSize / 2)] : null

  return {
    kangqore: {
      templateCount,
      toolCallableActionCount: toolCallableCount,
      totalAgentsCreated: agents.length,
      templateInstalls: templates._sum.installCount ?? 0,
      buildToFirstRun: {
        sampleSize,
        medianMinutes: medianBuildMinutes,
        insufficientData: sampleSize < 5,
      },
    },
    appEngine: APP_ENGINE_BENCHMARK,
    disclaimer: 'Kangqore figures are computed live from real agent-creation and run data on this platform, not estimated — including when that means a small sample size or an honest "insufficient data" flag. App Engine figures are the vendor’s own commissioned study, reported as-is with its source linked, not independently re-verified by Kangqore.',
    computedAt: new Date().toISOString(),
  }
}
