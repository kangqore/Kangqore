import { prisma } from '../../lib/prisma'
import { SignalLedger } from '../signals/signalLedger.service'
import { KimmpResearchService } from '../research/kimmpResearch.service'
import { KimmpScoutService, SCOUT_SOURCES } from '../scout/kimmpScout.service'
import { KimmpGoalEngine } from '../goals/kimmpGoal.service'
import { KimmpReportService } from '../reports/kimmpReport.service'
import { KimmpActionProposer } from '../actions/kimmpActionProposer'
import { KimmpDigitalTwin } from '../twin/kimmpTwin.service'
import { haiku as _haiku, sonnet as _sonnet, opus as _opus, textOf as _textOf } from '../llm/kimmpLLMRouter'
import logger from '../../utils/logger'

export type AgentType =
  | 'SCOUT'
  | 'RESEARCH'
  | 'GOAL_CHECK'
  | 'SIGNAL_READ'
  | 'LEAD_ANALYSIS'
  | 'FINANCIAL_SNAPSHOT'
  | 'REPORT_GENERATE'
  | 'STRATEGIST'
  | 'ADVISOR'
  | 'FORECAST'
  | 'RISK_ANALYSIS'
  | 'OPPORTUNITY_SCAN'
  | 'COMPETITOR_INTEL'
  | 'WORKFLOW_ORCHESTRATOR'
  | 'EXEC_SUMMARY'
  | 'DECISION_ENGINE'
  | 'MEMORY_RECALL'
  | 'TASK_MANAGER'
  | 'MEETING_INTEL'
  | 'ORGANIZATION_HEALTH'
  | 'CLIENT_INTEL'
  | 'KNOWLEDGE_ENGINE'
  | 'SIMULATION_ENGINE'
  | 'THREAT_DETECTOR'
  | 'VULNERABILITY_MANAGER'
  | 'SECURITY_POSTURE'
  | 'RISK_MANAGER'
  | 'COMPLIANCE_GUARD'
  | 'ATTACK_ANALYZER'
  | 'ACCESS_GOVERNOR'
  | 'ASSET_GUARDIAN'
  | 'THIRD_PARTY_RISK'
  | 'RESILIENCE_MONITOR'
  | 'SHADOW_AI_DETECTOR'
  | 'AGENT_GUARDIAN'

export interface AgentTask {
  agentType:  AgentType
  role:       string
  params:     Record<string, any>
  runFirst:   boolean
}

export interface AgentResult {
  agentType:  AgentType
  role:       string
  output:     string
  data?:      any
  durationMs: number
  success:    boolean
}

export interface OrchestrationResult {
  id:             string
  question:       string
  intent:         string
  summary:        string
  recommendation: string
  evidence:       { agent: string; finding: string }[]
  riskFactors:    string[]
  nextSteps:      string[]
  confidence:     number
  agentsUsed:     string[]
  agentResults:   AgentResult[]
  durationMs:     number
  createdAt:      string
}

// ─── Helpers — go through KIMMLLMRouter so every call is captured as training data ──
const haiku  = (system: string, user: string, maxTokens = 500) =>
  _haiku(system, user, maxTokens, { agentSystem: 'KIMMP', agentType: 'orchestrator' })

const sonnet = (system: string, user: string, maxTokens = 900) =>
  _sonnet(system, user, maxTokens, { agentSystem: 'KIMMP', agentType: 'orchestrator' })

const opus   = (system: string, user: string, maxTokens = 1200) =>
  _opus(system, user, maxTokens, { agentSystem: 'KIMMP', agentType: 'orchestrator' })

const textOf = _textOf

const noKey = () => !process.env.ANTHROPIC_API_KEY

// ─── Decomposer ───────────────────────────────────────────────────────────────
async function decompose(question: string): Promise<{ intent: string; agents: AgentTask[]; synthesisFocus: string }> {
  if (noKey()) return {
    intent: 'General analysis',
    agents: [{ agentType: 'SIGNAL_READ', role: 'Check internal signals', params: {}, runFirst: false }],
    synthesisFocus: 'Answer from available internal data',
  }

  const res = await haiku(`You are the KIMMP orchestration planner for Kangqore — Indian B2B tech firm (digital transformation, school ITPx, MSME, AI).

Analyze the strategic question and select 2–5 specialist agents. Return ONLY valid JSON.

AGENT CATALOGUE:
- SCOUT: External web intelligence — tenders, competitors, regulations, market. params: { sourceName?: "Government Tenders|Competitor Monitor|Market Intelligence|Partnership Radar|Regulatory Watch|Tech Radar" }
- RESEARCH: Deep web research + AI synthesis. params: { question: string, domain?: string }
- GOAL_CHECK: Active goals, OKR alignment, progress. params: {}
- SIGNAL_READ: Internal signal ledger activity. params: { category?: "COMPETITOR|OPPORTUNITY|RISK|MARKET|SYSTEM", limit?: 20 }
- LEAD_ANALYSIS: Leads pipeline health and contacts. params: { search?: string, status?: string }
- FINANCIAL_SNAPSHOT: Revenue MTD, invoices, project pipeline KPIs. params: {}
- REPORT_GENERATE: Produce a structured executive report. params: { type?: "DAILY_BRIEFING|WEEKLY_EXECUTIVE|MONTHLY_BOARD|SALES_PIPELINE" }
- STRATEGIST: 3 strategic scenarios + recommended path. params: { focus?: string }
- ADVISOR: CEO-level guidance on a specific decision or situation. params: { context?: string }
- FORECAST: Revenue and demand projection over a horizon. params: { horizon?: "3m|6m|12m" }
- RISK_ANALYSIS: Risk matrix — operational, financial, market risks. params: { domain?: "operational|financial|market|all" }
- OPPORTUNITY_SCAN: Ranked growth opportunities and market gaps. params: { focus?: string }
- COMPETITOR_INTEL: Competitive landscape synthesis. params: { competitor?: string }
- WORKFLOW_ORCHESTRATOR: Identify bottlenecks and next actions across tasks/projects. params: {}
- EXEC_SUMMARY: One-page executive brief of current state. params: { period?: "today|week|month" }
- DECISION_ENGINE: Evaluate options and recommend a decision. params: { decision?: string, options?: string[] }
- MEMORY_RECALL: Retrieve historical decisions, reports, and research context. params: { query?: string }
- TASK_MANAGER: Active tasks, overdue items, deliverable status. params: { status?: string, dueInDays?: number }
- MEETING_INTEL: Extract decisions, action items, insights from recent meetings. params: { search?: string, since?: string }
- ORGANIZATION_HEALTH: Company-wide operational health — projects, risks, decision velocity. params: {}
- CLIENT_INTEL: Client accounts, contracts, renewals, invoice exposure. params: { search?: string, clientId?: string }
- KNOWLEDGE_ENGINE: Search all Kangqore memory, research, reports and knowledge base. params: { query?: string }
- SIMULATION_ENGINE: Model "what if" scenarios against the Digital Twin baseline. params: { scenario: string, variables?: object }
- THREAT_DETECTOR: Detect cyber threats, suspicious activity, attack indicators. params: { hours?: number }
- VULNERABILITY_MANAGER: Monitor vulnerabilities, CVEs, patch status, exposure. params: { system?: string }
- SECURITY_POSTURE: Evaluate overall security maturity and defensive readiness. params: {}
- RISK_MANAGER: Enterprise risk identification, scoring, mitigation planning. params: { domain?: string }
- COMPLIANCE_GUARD: SOC 2, ISO 27001, GDPR, DPDP, HIPAA compliance monitoring. params: { framework?: string }
- ATTACK_ANALYZER: Analyze incidents, malware events, intrusion attempts. params: { days?: number }
- ACCESS_GOVERNOR: Monitor permissions, privileged accounts, access anomalies. params: { role?: string }
- ASSET_GUARDIAN: Track and protect infrastructure, devices, servers, databases. params: { search?: string }
- THIRD_PARTY_RISK: Vendor, SaaS, supplier security assessment. params: { search?: string }
- RESILIENCE_MONITOR: Backup health, disaster recovery, business continuity. params: {}
- SHADOW_AI_DETECTOR: Detect unauthorized AI usage and unsanctioned models. params: {}
- AGENT_GUARDIAN: Monitor and govern autonomous AI agents and actions. params: {}

Return JSON:
{
  "intent": "3-5 word intent label",
  "agents": [
    { "agentType": "...", "role": "what this agent contributes", "params": {}, "runFirst": false }
  ],
  "synthesisFocus": "what the final answer should emphasise"
}

ROUTING RULES (2–5 agents):
- Tender/bid: SCOUT(Government Tenders, runFirst) + RESEARCH + GOAL_CHECK
- Competitor: SCOUT(Competitor Monitor, runFirst) + COMPETITOR_INTEL + SIGNAL_READ
- Internal health: ORGANIZATION_HEALTH + SIGNAL_READ + GOAL_CHECK
- Strategic planning: STRATEGIST + GOAL_CHECK + FINANCIAL_SNAPSHOT
- Sales/pipeline: LEAD_ANALYSIS + FINANCIAL_SNAPSHOT + GOAL_CHECK
- Risk assessment: RISK_ANALYSIS + SIGNAL_READ + FINANCIAL_SNAPSHOT
- Opportunity: OPPORTUNITY_SCAN + SCOUT(Market Intelligence) + LEAD_ANALYSIS
- Revenue/forecast: FORECAST + FINANCIAL_SNAPSHOT + GOAL_CHECK
- Decision support: DECISION_ENGINE + GOAL_CHECK + RISK_ANALYSIS
- Executive brief: EXEC_SUMMARY + ORGANIZATION_HEALTH + FINANCIAL_SNAPSHOT
- Historical context: MEMORY_RECALL + KNOWLEDGE_ENGINE + SIGNAL_READ
- CEO advice: ADVISOR + GOAL_CHECK + FINANCIAL_SNAPSHOT
- Tasks/actions: TASK_MANAGER + GOAL_CHECK + WORKFLOW_ORCHESTRATOR
- Client/account: CLIENT_INTEL + LEAD_ANALYSIS + FINANCIAL_SNAPSHOT
- Meetings/decisions: MEETING_INTEL + MEMORY_RECALL + GOAL_CHECK
- What-if/scenario: SIMULATION_ENGINE + FINANCIAL_SNAPSHOT + RISK_ANALYSIS
- Org health check: ORGANIZATION_HEALTH + TASK_MANAGER + SIGNAL_READ
- Knowledge search: KNOWLEDGE_ENGINE + MEMORY_RECALL + RESEARCH
- Threat/attack: THREAT_DETECTOR + ATTACK_ANALYZER + SIGNAL_READ
- Security posture: SECURITY_POSTURE + VULNERABILITY_MANAGER + RISK_MANAGER
- Compliance audit: COMPLIANCE_GUARD + SECURITY_POSTURE + RISK_MANAGER
- Access review: ACCESS_GOVERNOR + THREAT_DETECTOR + ASSET_GUARDIAN
- Vendor/third-party: THIRD_PARTY_RISK + COMPLIANCE_GUARD + RISK_MANAGER
- Incident response: ATTACK_ANALYZER + THREAT_DETECTOR + RESILIENCE_MONITOR
- DR/resilience: RESILIENCE_MONITOR + ASSET_GUARDIAN + RISK_MANAGER
- AI governance: SHADOW_AI_DETECTOR + AGENT_GUARDIAN + COMPLIANCE_GUARD
- Full security brief: SECURITY_POSTURE + THREAT_DETECTOR + COMPLIANCE_GUARD + RISK_MANAGER
- Mark SCOUT as runFirst:true when RESEARCH or COMPETITOR_INTEL will use its output`, `Question: "${question}"`, 700)

  const raw   = textOf(res)
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Decomposition returned no JSON')
  const parsed = JSON.parse(match[0])
  if (!parsed.agents?.length) throw new Error('Decomposition returned no agents')
  return parsed
}

// ─── Agent Executors ──────────────────────────────────────────────────────────
async function runScout(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  const source = SCOUT_SOURCES.find(s => s.name === (params.sourceName ?? ''))
  if (source) {
    const { signals } = await KimmpScoutService.runSource(source)
    const recent = await (prisma as any).kimmpSignal.findMany({
      where:   { sourceModule: 'scout', signalType: source.signalType, createdAt: { gte: new Date(Date.now() - 5 * 60_000) } },
      orderBy: { createdAt: 'desc' }, take: 5,
    }).catch(() => [])
    const summary = recent.length
      ? recent.map((s: any) => `• ${s.signalValue}`).join('\n')
      : `${signals} signal(s) emitted`
    return { output: `${source.name} scan: ${recent.length || signals} signal(s)\n${summary}`, data: recent }
  }
  const signals = await (prisma as any).kimmpSignal.findMany({
    where: { sourceModule: 'scout', createdAt: { gte: new Date(Date.now() - 24 * 3600_000) } },
    orderBy: { severity: 'desc' }, take: 8,
  }).catch(() => [])
  return {
    output: signals.length
      ? `${signals.length} scout signals (24h):\n${signals.map((s: any) => `• [${s.signalType}] ${s.signalValue?.slice(0, 120)}`).join('\n')}`
      : 'No recent Scout signals.',
    data: signals,
  }
}

async function runResearch(params: Record<string, any>, scoutContext?: string): Promise<{ output: string; data?: any }> {
  const q = params.question
    ? (scoutContext ? `${params.question}\n\nScout context:\n${scoutContext}` : params.question)
    : 'General market analysis for Kangqore'
  const result = await KimmpResearchService.query(q, params.domain)
  return {
    output: [
      result.summary,
      result.marketGaps?.length    ? `Gaps: ${result.marketGaps.join('; ')}` : '',
      result.opportunities?.length ? `Opportunities: ${result.opportunities.slice(0,2).join('; ')}` : '',
      result.competitors?.length   ? `Competitors: ${result.competitors.slice(0,3).map((c: any) => c.name).join(', ')}` : '',
      `Recommendation: ${result.recommendation}`,
    ].filter(Boolean).join('\n'),
    data: result,
  }
}

async function runGoalCheck(_params: Record<string, any>): Promise<{ output: string; data?: any }> {
  const goals    = await KimmpGoalEngine.list(10)
  const active   = goals.filter((g: any) => g.status === 'ACTIVE')
  const pending  = goals.filter((g: any) => g.status === 'PENDING_APPROVAL')
  const done     = goals.filter((g: any) => g.status === 'COMPLETED')
  if (!active.length && !pending.length)
    return { output: 'No active goals. Opportunity to set new strategic objectives.', data: goals }
  return {
    output: [
      `${active.length} active, ${pending.length} pending, ${done.length} completed:`,
      ...active.map((g: any)  => `• [ACTIVE ${g.progressPct ?? 0}%] ${g.objective?.slice(0, 100)}`),
      ...pending.map((g: any) => `• [PENDING] ${g.objective?.slice(0, 100)}`),
    ].join('\n'),
    data: { active, pending },
  }
}

async function runSignalRead(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  const signals = await (prisma as any).kimmpSignal.findMany({
    where: {
      createdAt: { gte: new Date(Date.now() - 48 * 3600_000) },
      ...(params.category ? { signalCategory: params.category } : {}),
    },
    orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
    take: params.limit ?? 15,
  }).catch(() => [])
  if (!signals.length) return { output: 'No signals in the last 48 hours.', data: [] }
  const crit = signals.filter((x: any) => x.severity === 'CRITICAL')
  const high = signals.filter((x: any) => x.severity === 'HIGH')
  return {
    output: [
      `${signals.length} signals (48h) — ${crit.length} CRITICAL, ${high.length} HIGH`,
      ...[...crit, ...high].slice(0, 5).map((s: any) => `• [${s.severity}][${s.signalCategory}] ${s.signalValue?.slice(0, 120)}`),
      signals.length > 5 ? `…and ${signals.length - 5} more` : '',
    ].filter(Boolean).join('\n'),
    data: signals,
  }
}

async function runLeadAnalysis(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  const leads = await (prisma as any).eqoreLead.findMany({
    where: {
      ...(params.status ? { status: params.status } : { status: { notIn: ['CLOSED_WON','CLOSED_LOST','DISQUALIFIED'] } }),
      ...(params.search ? { OR: [
        { name: { contains: params.search, mode: 'insensitive' } },
        { companyName: { contains: params.search, mode: 'insensitive' } },
      ]} : {}),
    },
    orderBy: { leadScore: 'desc' }, take: 10,
    select: { id:true, name:true, companyName:true, leadScore:true, status:true, primaryIntent:true },
  }).catch(() => [])
  if (!leads.length) return { output: 'No matching leads in pipeline.', data: [] }
  return {
    output: `${leads.length} lead(s):\n${leads.slice(0,5).map((l: any) =>
      `• ${l.name ?? 'Unknown'}${l.companyName ? ` (${l.companyName})` : ''} — score ${l.leadScore} [${l.status}]`
    ).join('\n')}`,
    data: leads,
  }
}

async function runFinancialSnapshot(_params: Record<string, any>): Promise<{ output: string; data?: any }> {
  try {
    const now          = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLast  = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLast    = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
    const [mtdAgg, lastAgg, pending, pipeline] = await Promise.all([
      (prisma as any).invoice.aggregate({ where: { status: 'PAID', createdAt: { gte: startOfMonth } }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
      (prisma as any).invoice.aggregate({ where: { status: 'PAID', createdAt: { gte: startOfLast, lte: endOfLast } }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
      (prisma as any).invoice.count({ where: { status: 'PENDING' } }).catch(() => 0),
      (prisma as any).project.aggregate({ where: { status: { in: ['IN_PROGRESS','ACTIVE'] } }, _sum: { budget: true } }).catch(() => ({ _sum: { budget: 0 } })),
    ])
    const mtd         = Number(mtdAgg._sum.amount ?? 0) / 100
    const last        = Number(lastAgg._sum.amount ?? 0) / 100
    const pipelineVal = Number((pipeline as any)._sum?.budget ?? 0) / 100
    const delta       = last > 0 ? Math.round(((mtd - last) / last) * 100) : 0
    return {
      output: `Revenue MTD: ₹${mtd.toFixed(0)} (${delta >= 0 ? '+' : ''}${delta}% vs last month)\nPending invoices: ${pending}\nProject pipeline: ₹${pipelineVal.toFixed(0)}`,
      data: { mtd, last, pending, pipelineVal, delta },
    }
  } catch { return { output: 'Financial data unavailable.', data: {} } }
}

async function runReportGenerate(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  const validTypes = ['DAILY_BRIEFING','WEEKLY_EXECUTIVE','MONTHLY_BOARD','SALES_PIPELINE']
  const type       = validTypes.includes(params.type) ? params.type : 'DAILY_BRIEFING'
  const report     = await KimmpReportService.generate(type as any, params.userId)
  const excerpt    = (report as any).content?.slice(0, 500) ?? ''
  return {
    output: `${type} report generated:\n${excerpt}${excerpt.length >= 500 ? '…' : ''}`,
    data:   { id: (report as any).id, type },
  }
}

async function runStrategist(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'STRATEGIST requires ANTHROPIC_API_KEY.', data: {} }
  const [signals, goals] = await Promise.all([
    (prisma as any).kimmpSignal.findMany({ where: { createdAt: { gte: new Date(Date.now() - 72 * 3600_000) } }, orderBy: { severity: 'desc' }, take: 12 }).catch(() => []),
    KimmpGoalEngine.list(6),
  ])
  const signalCtx = signals.map((s: any) => `[${s.severity}] ${s.signalValue?.slice(0, 100)}`).join('\n')
  const goalCtx   = goals.map((g: any) => `[${g.status}] ${g.objective?.slice(0, 80)}`).join('\n')
  const focus     = params.focus ? `Focus area: ${params.focus}` : ''
  const res = await sonnet(
    `You are the KIMMP Strategic Intelligence system for Kangqore — Indian B2B tech firm. Provide 3 named strategic scenarios (A/B/C) plus a recommended path. Be specific to the data. Return plain text, no JSON.`,
    `${focus}\n\nRecent signals:\n${signalCtx || 'None'}\n\nActive goals:\n${goalCtx || 'None'}\n\nProvide 3 strategic scenarios and recommend the best path forward.`
  )
  return { output: textOf(res), data: { scenarios: 3 } }
}

async function runAdvisor(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'ADVISOR requires ANTHROPIC_API_KEY.', data: {} }
  const [alerts, goals] = await Promise.all([
    (prisma as any).kimmpProactiveAlert.findMany({ where: { dismissed: false }, orderBy: { severity: 'desc' }, take: 5 }).catch(() => []),
    KimmpGoalEngine.list(5),
  ])
  const alertCtx = alerts.map((a: any) => `[${a.severity}] ${a.message}`).join('\n')
  const goalCtx  = goals.filter((g: any) => g.status === 'ACTIVE').map((g: any) => g.objective?.slice(0,80)).join('\n')
  const context  = params.context ? `Specific context: ${params.context}` : ''
  const res = await sonnet(
    `You are the KIMMP CEO Advisor for Kangqore. Give decisive, CEO-level guidance. Be direct. Name specific actions. Prioritise ruthlessly. No hedging. Plain text.`,
    `${context}\n\nActive alerts:\n${alertCtx || 'None'}\n\nActive goals:\n${goalCtx || 'None'}\n\nWhat should the ADMIN prioritise and decide right now?`
  )
  return { output: textOf(res), data: {} }
}

async function runForecast(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'FORECAST requires ANTHROPIC_API_KEY.', data: {} }
  const horizon = params.horizon ?? '3m'
  const months  = horizon === '12m' ? 12 : horizon === '6m' ? 6 : 3
  const since   = new Date(Date.now() - months * 30 * 24 * 3600_000)
  const [invoices, leads, pipeline] = await Promise.all([
    (prisma as any).invoice.findMany({ where: { status: 'PAID', createdAt: { gte: since } }, select: { amount: true, createdAt: true } }).catch(() => []),
    (prisma as any).eqoreLead.groupBy({ by: ['status'], _count: true }).catch(() => []),
    (prisma as any).project.aggregate({ where: { status: { in: ['IN_PROGRESS','ACTIVE'] } }, _sum: { budget: true } }).catch(() => ({ _sum: { budget: 0 } })),
  ])
  // Bucket by month
  const byMonth: Record<string, number> = {}
  for (const inv of invoices) {
    const key = new Date(inv.createdAt).toISOString().slice(0, 7)
    byMonth[key] = (byMonth[key] ?? 0) + Number(inv.amount) / 100
  }
  const monthStr = Object.entries(byMonth).sort().map(([m, v]) => `${m}: ₹${v.toFixed(0)}`).join(', ')
  const pipeVal  = Number((pipeline as any)._sum?.budget ?? 0) / 100
  const leadStr  = (Array.isArray(leads) ? leads : []).map((l: any) => `${l.status}: ${l._count}`).join(', ')
  const res = await sonnet(
    `You are KIMMP Forecast Engine for Kangqore. Project revenue and demand trends. Be specific with numbers. Return plain text with a forecast table and key drivers.`,
    `Horizon: ${horizon}\nHistorical monthly revenue: ${monthStr || 'No data'}\nProject pipeline: ₹${pipeVal.toFixed(0)}\nLead breakdown: ${leadStr || 'No data'}\n\nProject revenue for next ${horizon} and identify key growth drivers and risks.`
  )
  return { output: textOf(res), data: { byMonth, pipeVal } }
}

async function runRiskAnalysis(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'RISK_ANALYSIS requires ANTHROPIC_API_KEY.', data: {} }
  const domain = params.domain ?? 'all'
  const catFilter: Record<string, string> = { operational: 'SYSTEM', financial: 'RISK', market: 'MARKET' }
  const [signals, goals] = await Promise.all([
    (prisma as any).kimmpSignal.findMany({
      where: {
        severity: { in: ['CRITICAL','HIGH'] },
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 3600_000) },
        ...(domain !== 'all' && catFilter[domain] ? { signalCategory: catFilter[domain] } : {}),
      },
      orderBy: { severity: 'desc' }, take: 15,
    }).catch(() => []),
    KimmpGoalEngine.list(10),
  ])
  const failedTasks = goals.flatMap((g: any) => (g.tasks ?? []).filter((t: any) => t.status === 'FAILED' || t.status === 'OVERDUE'))
  const signalCtx   = signals.map((s: any) => `[${s.severity}][${s.signalCategory}] ${s.signalValue?.slice(0,100)}`).join('\n')
  const taskCtx     = failedTasks.map((t: any) => `• FAILED: ${t.title?.slice(0,80)}`).join('\n')
  const res = await haiku(
    `You are KIMMP Risk Analyst for Kangqore. Return a risk matrix as plain text: list each risk with SEVERITY (CRITICAL/HIGH/MEDIUM), DOMAIN, DESCRIPTION (1 line), and MITIGATION (1 line). Be specific.`,
    `Domain filter: ${domain}\nHigh-severity signals:\n${signalCtx || 'None'}\nFailed/overdue tasks:\n${taskCtx || 'None'}\n\nGenerate the risk matrix.`, 600
  )
  return { output: textOf(res), data: { signalCount: signals.length, failedTasks: failedTasks.length } }
}

async function runOpportunityScan(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'OPPORTUNITY_SCAN requires ANTHROPIC_API_KEY.', data: {} }
  const [oppSignals, research, leads] = await Promise.all([
    (prisma as any).kimmpSignal.findMany({
      where: { signalCategory: 'OPPORTUNITY', createdAt: { gte: new Date(Date.now() - 7 * 24 * 3600_000) } },
      orderBy: { confidence: 'desc' }, take: 8,
    }).catch(() => []),
    (prisma as any).kimmpResearchResult.findMany({ orderBy: { createdAt: 'desc' }, take: 3, select: { marketGaps: true, opportunities: true } }).catch(() => []),
    (prisma as any).eqoreLead.findMany({
      where: { leadScore: { gte: 70 }, status: { notIn: ['CLOSED_WON','DISQUALIFIED'] } },
      orderBy: { leadScore: 'desc' }, take: 5,
      select: { name: true, companyName: true, leadScore: true, primaryIntent: true },
    }).catch(() => []),
  ])
  const sigCtx    = oppSignals.map((s: any) => `• ${s.signalValue?.slice(0,100)}`).join('\n')
  const gapCtx    = research.flatMap((r: any) => r.marketGaps ?? []).slice(0,5).join('; ')
  const leadCtx   = leads.map((l: any) => `• ${l.name} (${l.companyName}) score ${l.leadScore}`).join('\n')
  const focus     = params.focus ? `Focus: ${params.focus}` : ''
  const res = await haiku(
    `You are KIMMP Opportunity Scanner for Kangqore. Return a ranked list of top 5 opportunities with TITLE, WHY NOW, and ESTIMATED VALUE. Be specific. Plain text.`,
    `${focus}\nOpportunity signals:\n${sigCtx || 'None'}\nMarket gaps from research:\n${gapCtx || 'None'}\nHigh-score leads:\n${leadCtx || 'None'}\n\nRank the top 5 opportunities.`, 600
  )
  return { output: textOf(res), data: { signals: oppSignals.length, leads: leads.length } }
}

async function runCompetitorIntel(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'COMPETITOR_INTEL requires ANTHROPIC_API_KEY.', data: {} }
  const competitor = params.competitor ?? ''
  const [signals, scoutJobs] = await Promise.all([
    (prisma as any).kimmpSignal.findMany({
      where: {
        signalCategory: 'COMPETITOR',
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 3600_000) },
        ...(competitor ? { signalValue: { contains: competitor, mode: 'insensitive' } } : {}),
      },
      orderBy: { createdAt: 'desc' }, take: 10,
    }).catch(() => []),
    (prisma as any).kimmpScoutJob.findMany({
      where: { sourceName: 'Competitor Monitor', status: 'COMPLETED', createdAt: { gte: new Date(Date.now() - 7 * 24 * 3600_000) } },
      orderBy: { createdAt: 'desc' }, take: 5,
      select: { signalsFound: true, createdAt: true },
    }).catch(() => []),
  ])
  const sigCtx = signals.map((s: any) => `• ${s.signalValue?.slice(0,120)}`).join('\n')
  const jobCtx = scoutJobs.map((j: any) => `Scout run: ${j.signalsFound} signals found`).join('\n')
  const res = await haiku(
    `You are KIMMP Competitive Intelligence for Kangqore — Indian B2B tech firm. Synthesise competitor activity into: THREATS (what competitors are doing that challenges us), GAPS (what they're missing that we can exploit), and MOVES TO WATCH. Plain text.`,
    `${competitor ? `Focus competitor: ${competitor}\n` : ''}Competitor signals:\n${sigCtx || 'None'}\nRecent scout runs:\n${jobCtx || 'None'}\n\nSynthesise the competitive landscape.`, 600
  )
  return { output: textOf(res), data: { signals: signals.length } }
}

async function runWorkflowOrchestrator(_params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'WORKFLOW_ORCHESTRATOR requires ANTHROPIC_API_KEY.', data: {} }
  const [goals, projects] = await Promise.all([
    KimmpGoalEngine.list(10),
    (prisma as any).project.findMany({
      where: { status: { in: ['IN_PROGRESS','ACTIVE'] } },
      select: { name: true, status: true, dueDate: true, budget: true },
      take: 8,
    }).catch(() => []),
  ])
  const activeTasks = goals.flatMap((g: any) =>
    (g.tasks ?? []).filter((t: any) => t.status === 'IN_PROGRESS' || t.status === 'PENDING')
      .map((t: any) => `[${t.status}] ${t.title?.slice(0,80)} (goal: ${g.objective?.slice(0,40)})`)
  )
  const projectCtx = projects.map((p: any) =>
    `• ${p.name} [${p.status}]${p.dueDate ? ` due ${new Date(p.dueDate).toLocaleDateString()}` : ''}`
  ).join('\n')
  const taskCtx = activeTasks.slice(0,10).join('\n')
  const res = await haiku(
    `You are KIMMP Workflow Orchestrator for Kangqore. Identify bottlenecks, sequencing conflicts, and the top 5 actions to unlock momentum. Be specific. Plain text with clear sections: BOTTLENECKS, QUICK WINS, NEXT 5 ACTIONS.`,
    `Active tasks:\n${taskCtx || 'None'}\n\nActive projects:\n${projectCtx || 'None'}\n\nOrchestrate.`, 600
  )
  return { output: textOf(res), data: { taskCount: activeTasks.length, projectCount: projects.length } }
}

async function runExecSummary(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'EXEC_SUMMARY requires ANTHROPIC_API_KEY.', data: {} }
  const period  = params.period ?? 'today'
  const windowH = period === 'month' ? 720 : period === 'week' ? 168 : 24
  const [signals, goals, alerts, fin] = await Promise.all([
    (prisma as any).kimmpSignal.findMany({ where: { createdAt: { gte: new Date(Date.now() - windowH * 3600_000) }, severity: { in: ['CRITICAL','HIGH'] } }, orderBy: { severity: 'desc' }, take: 8 }).catch(() => []),
    KimmpGoalEngine.list(5),
    (prisma as any).kimmpProactiveAlert.findMany({ where: { dismissed: false }, orderBy: { severity: 'desc' }, take: 5 }).catch(() => []),
    runFinancialSnapshot({}),
  ])
  const sigCtx   = signals.map((s: any) => `• [${s.severity}] ${s.signalValue?.slice(0,100)}`).join('\n')
  const goalCtx  = goals.filter((g: any) => g.status === 'ACTIVE').map((g: any) => `• ${g.progressPct ?? 0}% — ${g.objective?.slice(0,80)}`).join('\n')
  const alertCtx = alerts.map((a: any) => `• [${a.category}] ${a.message?.slice(0,80)}`).join('\n')
  const res = await sonnet(
    `You are KIMMP. Write a crisp one-page executive summary. Format: HEADLINE (1 sentence), STATUS (3 bullets), ATTENTION (top 2 items requiring ADMIN action), MOMENTUM (what's working). Be specific. Plain text.`,
    `Period: ${period}\n\nFinancials:\n${fin.output}\n\nKey signals:\n${sigCtx || 'None'}\n\nActive goals:\n${goalCtx || 'None'}\n\nProactive alerts:\n${alertCtx || 'None'}`
  )
  return { output: textOf(res), data: { period, signalCount: signals.length } }
}

async function runDecisionEngine(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'DECISION_ENGINE requires ANTHROPIC_API_KEY.', data: {} }
  const decision = params.decision ?? 'Evaluate the current strategic situation'
  const options  = Array.isArray(params.options) ? params.options : []
  const goals    = await KimmpGoalEngine.list(5)
  const goalCtx  = goals.filter((g: any) => g.status === 'ACTIVE').map((g: any) => g.objective?.slice(0,80)).join('\n')
  const optCtx   = options.length ? `Options to evaluate:\n${options.map((o: string, i: number) => `${i+1}. ${o}`).join('\n')}` : 'Identify and evaluate the key options.'
  const res = await sonnet(
    `You are KIMMP Decision Engine for Kangqore. Evaluate options against strategic goals, financial position, and risk. For each option: PROS, CONS, RISK LEVEL (LOW/MED/HIGH). End with a clear RECOMMENDATION and RATIONALE. Plain text.`,
    `Decision: ${decision}\n\n${optCtx}\n\nActive goals:\n${goalCtx || 'None'}\n\nEvaluate and recommend.`
  )
  return { output: textOf(res), data: { decision, optionCount: options.length } }
}

async function runMemoryRecall(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  const query = params.query ?? ''
  const limit = Math.min(params.limit ?? 10, 20)
  const [memories, research, reports] = await Promise.all([
    (prisma as any).kimmpMemory.findMany({
      where: query ? { OR: [
        { content:  { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ]} : {},
      orderBy: { createdAt: 'desc' }, take: limit,
      select: { category: true, content: true, createdAt: true },
    }).catch(() => []),
    (prisma as any).kimmpResearchResult.findMany({
      where: query ? { question: { contains: query, mode: 'insensitive' } } : {},
      orderBy: { createdAt: 'desc' }, take: 3,
      select: { question: true, summary: true, recommendation: true, createdAt: true },
    }).catch(() => []),
    (prisma as any).kimmpReport.findMany({
      orderBy: { createdAt: 'desc' }, take: 3,
      select: { reportType: true, createdAt: true },
    }).catch(() => []),
  ])
  const memCtx  = memories.map((m: any) => `[${m.category}] ${m.content?.slice(0,120)}`).join('\n')
  const resCtx  = research.map((r: any) => `Research: "${r.question?.slice(0,60)}" → ${r.summary?.slice(0,100)}`).join('\n')
  const repCtx  = reports.map((r: any) => `${r.reportType} — ${new Date(r.createdAt).toLocaleDateString()}`).join(', ')
  const output  = [
    memories.length ? `Memories (${memories.length}):\n${memCtx}` : 'No memories found.',
    research.length ? `Research history:\n${resCtx}` : '',
    reports.length  ? `Reports: ${repCtx}` : '',
  ].filter(Boolean).join('\n\n')
  return { output, data: { memories: memories.length, research: research.length, reports: reports.length } }
}

async function runTaskManager(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  const deadline = params.dueInDays ? new Date(Date.now() + Number(params.dueInDays) * 24 * 3600_000) : undefined
  const [tasks, deliverables] = await Promise.all([
    (prisma as any).kimmpGoalTask.findMany({
      where: {
        status: { notIn: ['DONE','SKIPPED'] },
        ...(params.status ? { status: params.status } : {}),
        ...(deadline     ? { dueDate: { lte: deadline } } : {}),
      },
      include: { goal: { select: { objective: true } } },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
      take: 20,
    }).catch(() => []),
    (prisma as any).deliverable.findMany({
      where: { status: { notIn: ['DELIVERED','APPROVED','REJECTED'] } },
      orderBy: { dueDate: 'asc' }, take: 8,
      select: { title: true, status: true, dueDate: true },
    }).catch(() => []),
  ])
  const overdue  = (tasks as any[]).filter(t => t.status === 'OVERDUE' || t.status === 'FAILED')
  const active   = (tasks as any[]).filter(t => t.status === 'IN_PROGRESS' || t.status === 'PENDING')
  const lines = [
    `${tasks.length} task(s) — ${overdue.length} overdue, ${active.length} active`,
    ...overdue.slice(0,4).map((t: any) => `⚠ [OVERDUE] ${t.title?.slice(0,80)} (${t.goal?.objective?.slice(0,40) ?? ''})`),
    ...active.slice(0,6).map((t: any) => `• [${t.status}] ${t.title?.slice(0,80)}${t.dueDate ? ` — due ${new Date(t.dueDate).toLocaleDateString()}` : ''}`),
    deliverables.length ? `Deliverables pending: ${(deliverables as any[]).map((d: any) => `${d.title} [${d.status}]`).join(', ')}` : '',
  ].filter(Boolean).join('\n')
  return { output: lines || 'No active tasks.', data: { overdue: overdue.length, active: active.length } }
}

async function runMeetingIntel(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'MEETING_INTEL requires ANTHROPIC_API_KEY.', data: {} }
  const since = params.since ? new Date(params.since) : new Date(Date.now() - 14 * 24 * 3600_000)
  const [meetings, memoMeetings] = await Promise.all([
    (prisma as any).meeting.findMany({
      where: {
        scheduledAt: { gte: since },
        ...(params.search ? { OR: [
          { title: { contains: params.search, mode: 'insensitive' } },
          { notes: { contains: params.search, mode: 'insensitive' } },
        ]} : {}),
      },
      orderBy: { scheduledAt: 'desc' }, take: 5,
      select: { title: true, notes: true, scheduledAt: true, outcome: true },
    }).catch(() => []),
    (prisma as any).kimmpMemory.findMany({
      where: { key: { contains: 'meeting', mode: 'insensitive' }, updatedAt: { gte: since } },
      take: 4, select: { key: true, value: true },
    }).catch(() => []),
  ])
  if (!meetings.length && !memoMeetings.length) return { output: 'No meeting records found in the selected window.', data: {} }
  const ctx = (meetings as any[]).map(m => `MEETING: ${m.title} (${new Date(m.scheduledAt).toLocaleDateString()})\n${m.notes?.slice(0,300) ?? ''}`).join('\n\n')
    + (memoMeetings as any[]).map((m: any) => `\nMEMO: ${m.key} — ${m.value?.slice(0,200)}`).join('')
  const res = await haiku(
    'You are KIMMP Meeting Intelligence. Extract: DECISIONS MADE, ACTION ITEMS (with owner/deadline if mentioned), and KEY INSIGHTS. Be concise. Plain text.',
    ctx, 500
  )
  return { output: textOf(res), data: { meetingCount: meetings.length } }
}

async function runOrganizationHealth(_params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'ORGANIZATION_HEALTH requires ANTHROPIC_API_KEY.', data: {} }
  const since7d = new Date(Date.now() - 7 * 24 * 3600_000)
  const [projects, risks, decisions, accountability] = await Promise.all([
    (prisma as any).project.findMany({
      where: { status: { in: ['IN_PROGRESS','ACTIVE'] } },
      select: { title: true, health: true, status: true, budget: true, spend: true }, take: 10,
    }).catch(() => []),
    (prisma as any).risk.findMany({
      where: { status: { in: ['OPEN','IN_PROGRESS'] } },
      orderBy: { severity: 'desc' }, take: 6,
      select: { title: true, severity: true, status: true },
    }).catch(() => []),
    (prisma as any).kimmpDecision.findMany({
      where: { createdAt: { gte: since7d } }, orderBy: { createdAt: 'desc' }, take: 5,
      select: { description: true, status: true },
    }).catch(() => []),
    (prisma as any).kimmpSignal.count({ where: { severity: { in: ['CRITICAL','HIGH'] }, createdAt: { gte: since7d } } }).catch(() => 0),
  ])
  const unhealthy = (projects as any[]).filter(p => p.health === 'AT_RISK' || p.health === 'CRITICAL')
  const projCtx   = (projects as any[]).map(p => `• ${p.title} [${p.health ?? 'UNKNOWN'}]`).join('\n')
  const riskCtx   = (risks as any[]).map((r: any) => `• [${r.severity}] ${r.title}`).join('\n')
  const decCtx    = (decisions as any[]).map((d: any) => `• ${d.description?.slice(0,80)}`).join('\n')
  const res = await haiku(
    'You are KIMMP Org Health Monitor. Assess overall health across: PROJECT HEALTH, RISK STATUS, DECISION VELOCITY, OVERALL VERDICT (HEALTHY/STABLE/AT_RISK/CRITICAL). Concise plain text.',
    `Projects:\n${projCtx || 'None'}\nOpen risks:\n${riskCtx || 'None'}\nRecent decisions:\n${decCtx || 'None'}\nHigh-severity signals (7d): ${accountability}`, 500
  )
  return { output: textOf(res), data: { unhealthyProjects: unhealthy.length, openRisks: (risks as any[]).length } }
}

async function runClientIntel(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'CLIENT_INTEL requires ANTHROPIC_API_KEY.', data: {} }
  const [clients, projects, invoices] = await Promise.all([
    (prisma as any).clientCRM.findMany({
      where: params.search ? { OR: [
        { name:    { contains: params.search, mode: 'insensitive' } },
        { company: { contains: params.search, mode: 'insensitive' } },
      ]} : (params.clientId ? { id: params.clientId } : {}),
      take: 6,
    }).catch(() => []),
    (prisma as any).project.findMany({
      where: { status: { in: ['IN_PROGRESS','ACTIVE'] } },
      select: { title: true, health: true, status: true, budget: true }, take: 6,
    }).catch(() => []),
    (prisma as any).invoice.findMany({
      where: { status: { in: ['PENDING','OVERDUE'] } }, take: 8,
      select: { amount: true, status: true, dueDate: true },
    }).catch(() => []),
  ])
  const clientCtx  = (clients as any[]).length ? (clients as any[]).map((c: any) => `• ${c.name ?? c.company ?? 'Unknown'} [${c.status ?? 'active'}]`).join('\n') : 'No client records found'
  const projCtx    = (projects as any[]).map((p: any) => `• ${p.title} [${p.health ?? 'OK'}]`).join('\n')
  const invoiceCtx = (invoices as any[]).map((i: any) => `• ₹${(Number(i.amount)/100).toFixed(0)} ${i.status}${i.dueDate ? ` due ${new Date(i.dueDate).toLocaleDateString()}` : ''}`).join('\n')
  const res = await haiku(
    'You are KIMMP Client Intelligence. Sections: ACTIVE CLIENTS, PROJECT HEALTH, FINANCIAL EXPOSURE, RENEWAL RISKS. Specific, plain text.',
    `Clients:\n${clientCtx}\nProjects:\n${projCtx || 'None'}\nPending invoices:\n${invoiceCtx || 'None'}`, 500
  )
  return { output: textOf(res), data: { clients: (clients as any[]).length, pendingInvoices: (invoices as any[]).length } }
}

async function runKnowledgeEngine(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  const query = params.query?.trim() ?? ''
  const [memories, research, reports, kb] = await Promise.all([
    (prisma as any).kimmpMemory.findMany({
      where: query ? { OR: [
        { key:   { contains: query, mode: 'insensitive' } },
        { value: { contains: query, mode: 'insensitive' } },
      ]} : {},
      orderBy: { confidence: 'desc' }, take: 6,
    }).catch(() => []),
    (prisma as any).kimmpResearchResult.findMany({
      where: query ? { question: { contains: query, mode: 'insensitive' } } : {},
      orderBy: { createdAt: 'desc' }, take: 3,
      select: { question: true, summary: true, recommendation: true },
    }).catch(() => []),
    (prisma as any).kimmpReport.findMany({
      orderBy: { createdAt: 'desc' }, take: 2,
      select: { reportType: true, content: true, createdAt: true },
    }).catch(() => []),
    (prisma as any).knowledgeChunk.findMany({
      where: query ? { content: { contains: query, mode: 'insensitive' } } : {},
      take: 5, select: { content: true, source: true },
    }).catch(() => []),
  ])
  const sections = [
    query ? `Query: "${query}"` : 'Full knowledge scan',
    (memories  as any[]).length ? `Memory (${(memories as any[]).length}):\n${(memories as any[]).map((m: any) => `[${m.memoryType}] ${m.key}: ${m.value?.slice(0,140)}`).join('\n')}` : '',
    (research  as any[]).length ? `Research:\n${(research as any[]).map((r: any) => `"${r.question?.slice(0,50)}" → ${r.summary?.slice(0,120)}`).join('\n')}` : '',
    (reports   as any[]).length ? `Reports:\n${(reports as any[]).map((r: any) => `${r.reportType} (${new Date(r.createdAt).toLocaleDateString()}): ${r.content?.slice(0,150)}`).join('\n')}` : '',
    (kb        as any[]).length ? `Knowledge Base:\n${(kb as any[]).map((k: any) => `[${k.source}] ${k.content?.slice(0,140)}`).join('\n')}` : '',
  ].filter(Boolean).join('\n\n')
  return { output: sections || 'No knowledge found.', data: { memories: (memories as any[]).length, research: (research as any[]).length, kb: (kb as any[]).length } }
}

export async function runSimulationEngine(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'SIMULATION_ENGINE requires ANTHROPIC_API_KEY.', data: {} }
  const scenario = params.scenario ?? 'Current trajectory'
  const [fin, goals, twin] = await Promise.all([
    runFinancialSnapshot({}),
    KimmpGoalEngine.list(5),
    KimmpDigitalTwin.current().catch(() => null),
  ])
  const twinCtx = twin
    ? `Digital Twin: REV ${twin.revenueHealth} | PIPE ${twin.pipelineVelocity} | EXEC ${twin.executionCapacity} | RISK ${twin.riskExposure} | MKT ${twin.marketPosition} | OVERALL ${twin.overallScore}`
    : ''
  const goalCtx = (goals as any[]).filter(g => g.status === 'ACTIVE').map((g: any) => g.objective?.slice(0,60)).join('; ')
  const res = await sonnet(
    `You are KIMMP Simulation Engine for Kangqore — Indian B2B tech firm. Model the impact of scenarios on the business. Provide: IMMEDIATE IMPACT (0-30d), SHORT-TERM (1-3m), LONG-TERM (3-12m), RISK FACTORS, and ADJUSTED TWIN SCORES (estimate each dimension 0-100 under the scenario). Use specific numbers. Plain text.`,
    `Scenario: "${scenario}"\n\nBaseline:\n${fin.output}\n${twinCtx}\nActive goals: ${goalCtx || 'None'}\n${params.variables ? `Variables: ${JSON.stringify(params.variables)}` : ''}`, 900
  )
  return { output: textOf(res), data: { scenario } }
}

// Parses the "ADJUSTED TWIN SCORES" section from simulation engine output.
// Returns null if the section is absent (Claude occasionally varies headings).
export function parseAdjustedScores(text: string): {
  revenueHealth: number | null
  pipelineVelocity: number | null
  executionCapacity: number | null
  riskExposure: number | null
  marketPosition: number | null
} | null {
  const sectionMatch = text.match(/ADJUSTED\s+TWIN\s+SCORES[\s\S]{0,600}/i)
  if (!sectionMatch) return null
  const block = sectionMatch[0]
  const grab = (patterns: RegExp[]): number | null => {
    for (const re of patterns) {
      const m = block.match(re)
      if (m) return Math.min(100, Math.max(0, Number(m[1])))
    }
    return null
  }
  return {
    revenueHealth:     grab([/revenue\s+health[:\s—–-]+[-•*\s]*(\d+)/i,    /rev(?:enue)?[:\s—–-]+[-•*\s]*(\d+)/i]),
    pipelineVelocity:  grab([/pipeline\s+velocity[:\s—–-]+[-•*\s]*(\d+)/i, /pipe(?:line)?[:\s—–-]+[-•*\s]*(\d+)/i]),
    executionCapacity: grab([/execution\s+capacity[:\s—–-]+[-•*\s]*(\d+)/i,/exec(?:ution)?[:\s—–-]+[-•*\s]*(\d+)/i]),
    riskExposure:      grab([/risk\s+exposure[:\s—–-]+[-•*\s]*(\d+)/i,     /risk[:\s—–-]+[-•*\s]*(\d+)/i]),
    marketPosition:    grab([/market\s+position[:\s—–-]+[-•*\s]*(\d+)/i,   /mkt|market[:\s—–-]+[-•*\s]*(\d+)/i]),
  }
}

// ─── Sentinel Layer helpers ───────────────────────────────────────────────────
async function sentinelSignals(categories: string[], limit = 12) {
  return (prisma as any).kimmpSignal.findMany({
    where: { category: { in: categories } },
    orderBy: { createdAt: 'desc' }, take: limit,
    select: { signalValue: true, severity: true, category: true, createdAt: true },
  }).catch(() => [])
}

async function runThreatDetector(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'THREAT_DETECTOR requires ANTHROPIC_API_KEY.', data: {} }
  const since = new Date(Date.now() - (params.hours ?? 24) * 3600_000)
  const [signals, decisions, risks] = await Promise.all([
    sentinelSignals(['SECURITY','RISK','SYSTEM'], 20),
    (prisma as any).kimmpDecision.findMany({
      where: { createdAt: { gte: since }, description: { contains: 'security', mode: 'insensitive' } },
      take: 5, select: { description: true, status: true, createdAt: true },
    }).catch(() => []),
    (prisma as any).risk.findMany({
      where: { status: { in: ['OPEN','IN_PROGRESS'] }, severity: { in: ['HIGH','CRITICAL'] } },
      take: 8, orderBy: { severity: 'desc' },
      select: { title: true, severity: true, status: true, description: true },
    }).catch(() => []),
  ])
  const ctx = [
    `Security signals (${(signals as any[]).length}):\n${(signals as any[]).map((s: any) => `[${s.severity}] ${s.signalValue?.slice(0,120)}`).join('\n') || 'None'}`,
    `High/Critical risks:\n${(risks as any[]).map((r: any) => `[${r.severity}] ${r.title}: ${r.description?.slice(0,80)}`).join('\n') || 'None'}`,
    `Security decisions:\n${(decisions as any[]).map((d: any) => d.description?.slice(0,80)).join('\n') || 'None'}`,
  ].join('\n\n')
  const res = await opus(
    'You are KIMMP Threat Detector. Analyse for: ACTIVE THREATS (specific indicators), SUSPICIOUS PATTERNS, ATTACK VECTORS at risk, THREAT LEVEL (LOW/MEDIUM/HIGH/CRITICAL). Be direct and specific. Plain text.',
    ctx, 1000
  )
  return { output: textOf(res), data: { signalCount: (signals as any[]).length, criticalRisks: (risks as any[]).filter((r: any) => r.severity === 'CRITICAL').length } }
}

async function runVulnerabilityManager(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'VULNERABILITY_MANAGER requires ANTHROPIC_API_KEY.', data: {} }
  const [risks, memories, projects] = await Promise.all([
    (prisma as any).risk.findMany({
      where: { OR: [
        { title:       { contains: 'vulnerab', mode: 'insensitive' } },
        { title:       { contains: 'CVE',      mode: 'insensitive' } },
        { title:       { contains: 'patch',    mode: 'insensitive' } },
        { description: { contains: 'vulnerab', mode: 'insensitive' } },
      ]},
      orderBy: { severity: 'desc' }, take: 10,
      select: { title: true, severity: true, status: true, description: true },
    }).catch(() => []),
    (prisma as any).kimmpMemory.findMany({
      where: { OR: [
        { key:   { contains: 'vuln',  mode: 'insensitive' } },
        { key:   { contains: 'patch', mode: 'insensitive' } },
        { value: { contains: 'CVE',   mode: 'insensitive' } },
      ]},
      take: 6, select: { key: true, value: true, confidence: true },
    }).catch(() => []),
    (prisma as any).project.findMany({
      where: { title: { contains: params.system ?? '', mode: 'insensitive' } },
      take: 4, select: { title: true, health: true, status: true },
    }).catch(() => []),
  ])
  const ctx = [
    `Vulnerability records (${(risks as any[]).length}):\n${(risks as any[]).map((r: any) => `[${r.severity}] ${r.title} [${r.status}]: ${r.description?.slice(0,100)}`).join('\n') || 'None tracked'}`,
    (memories as any[]).length ? `Patch/vuln memory:\n${(memories as any[]).map((m: any) => `${m.key}: ${m.value?.slice(0,100)}`).join('\n')}` : '',
    (projects as any[]).length ? `Systems: ${(projects as any[]).map((p: any) => `${p.title} [${p.health}]`).join(', ')}` : '',
  ].filter(Boolean).join('\n\n')
  const res = await opus(
    'You are KIMMP Vulnerability Manager. Report: OPEN VULNERABILITIES (severity), UNPATCHED SYSTEMS, PATCH PRIORITY ORDER, EXPOSURE WINDOW. Specific and actionable. Plain text.',
    ctx || `No vulnerability data found. System filter: ${params.system ?? 'all'}`, 1000
  )
  return { output: textOf(res), data: { vulnerabilities: (risks as any[]).length } }
}

async function runSecurityPosture(_params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'SECURITY_POSTURE requires ANTHROPIC_API_KEY.', data: {} }
  const [allRisks, signals, memories, twin] = await Promise.all([
    (prisma as any).risk.groupBy({ by: ['severity','status'], _count: { _all: true } }).catch(() => []),
    sentinelSignals(['SECURITY','RISK'], 15),
    (prisma as any).kimmpMemory.findMany({
      where: { memoryType: 'SECURITY' }, take: 8,
      select: { key: true, value: true, confidence: true },
    }).catch(() => []),
    KimmpDigitalTwin.current().catch(() => null),
  ])
  const riskSummary = (allRisks as any[]).map((r: any) => `${r.severity}/${r.status}: ${r._count._all}`).join(', ')
  const twinCtx    = twin ? `Digital Twin RISK score: ${twin.riskExposure}/100 (100=safe)` : ''
  const memCtx     = (memories as any[]).map((m: any) => `[conf:${m.confidence}] ${m.key}: ${m.value?.slice(0,80)}`).join('\n')
  const sigCtx     = (signals as any[]).map((s: any) => `[${s.severity}] ${s.signalValue?.slice(0,100)}`).join('\n')
  const res = await opus(
    'You are KIMMP Security Posture Analyst. Evaluate overall security maturity across: IDENTITY & ACCESS, INFRASTRUCTURE SECURITY, DATA PROTECTION, INCIDENT RESPONSE READINESS, COMPLIANCE POSTURE. Score each 0-100 and give an overall MATURITY LEVEL (INITIAL/DEVELOPING/DEFINED/MANAGED/OPTIMISING). Be specific. Plain text.',
    `Risk inventory: ${riskSummary || 'none'}\n${twinCtx}\nSecurity signals:\n${sigCtx || 'None'}\nSecurity memory:\n${memCtx || 'None'}`, 1200
  )
  return { output: textOf(res), data: { riskSummary } }
}

async function runRiskManager(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'RISK_MANAGER requires ANTHROPIC_API_KEY.', data: {} }
  const domain = params.domain ?? 'all'
  const where  = domain === 'all' ? {} : { category: { contains: domain, mode: 'insensitive' as const } }
  const [risks, decisions] = await Promise.all([
    (prisma as any).risk.findMany({
      where: { ...where, status: { notIn: ['RESOLVED','CLOSED'] } },
      orderBy: [{ severity: 'desc' }, { updatedAt: 'desc' }], take: 15,
      select: { title: true, severity: true, status: true, description: true, mitigation: true },
    }).catch(() => []),
    (prisma as any).kimmpDecision.findMany({
      where: { description: { contains: 'risk', mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' }, take: 5,
      select: { description: true, status: true },
    }).catch(() => []),
  ])
  const bySeverity = ['CRITICAL','HIGH','MEDIUM','LOW'].map(sev => {
    const items = (risks as any[]).filter(r => r.severity === sev)
    return items.length ? `${sev} (${items.length}): ${items.map((r: any) => r.title).join(', ')}` : ''
  }).filter(Boolean).join('\n')
  const ctx = `Open risks by severity:\n${bySeverity || 'None'}\n\nMitigation plans:\n${(risks as any[]).filter((r: any) => r.mitigation).map((r: any) => `• ${r.title}: ${r.mitigation?.slice(0,80)}`).join('\n') || 'None recorded'}\n\nRisk decisions:\n${(decisions as any[]).map((d: any) => d.description?.slice(0,80)).join('\n') || 'None'}`
  const res = await opus(
    'You are KIMMP Risk Manager. Provide: RISK HEAT MAP (by severity + category), TOP 5 PRIORITY RISKS to address, MITIGATION GAPS, RECOMMENDED ACTIONS. Specific and executable. Plain text.',
    ctx, 1200
  )
  return { output: textOf(res), data: { total: (risks as any[]).length, critical: (risks as any[]).filter((r: any) => r.severity === 'CRITICAL').length } }
}

async function runComplianceGuard(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'COMPLIANCE_GUARD requires ANTHROPIC_API_KEY.', data: {} }
  const framework = params.framework ?? 'all'
  const [memories, risks, decisions] = await Promise.all([
    (prisma as any).kimmpMemory.findMany({
      where: { OR: [
        { key: { contains: 'compliance', mode: 'insensitive' } },
        { key: { contains: 'SOC',        mode: 'insensitive' } },
        { key: { contains: 'GDPR',       mode: 'insensitive' } },
        { key: { contains: 'ISO',        mode: 'insensitive' } },
        { key: { contains: 'DPDP',       mode: 'insensitive' } },
        { key: { contains: 'HIPAA',      mode: 'insensitive' } },
        ...(framework !== 'all' ? [{ key: { contains: framework, mode: 'insensitive' as const } }] : []),
      ]},
      orderBy: { confidence: 'desc' }, take: 10,
      select: { key: true, value: true, confidence: true },
    }).catch(() => []),
    (prisma as any).risk.findMany({
      where: { OR: [
        { title: { contains: 'compliance', mode: 'insensitive' } },
        { title: { contains: 'audit',      mode: 'insensitive' } },
        { title: { contains: 'regulation', mode: 'insensitive' } },
      ]},
      take: 6, select: { title: true, severity: true, status: true },
    }).catch(() => []),
    (prisma as any).kimmpDecision.findMany({
      where: { description: { contains: 'compli', mode: 'insensitive' } },
      take: 4, select: { description: true, status: true },
    }).catch(() => []),
  ])
  const ctx = [
    `Compliance memory (${(memories as any[]).length}):\n${(memories as any[]).map((m: any) => `[${m.key}] ${m.value?.slice(0,120)}`).join('\n') || 'No records'}`,
    (risks as any[]).length ? `Compliance risks:\n${(risks as any[]).map((r: any) => `[${r.severity}] ${r.title} [${r.status}]`).join('\n')}` : '',
    (decisions as any[]).length ? `Compliance decisions:\n${(decisions as any[]).map((d: any) => d.description?.slice(0,80)).join('\n')}` : '',
    `Framework filter: ${framework}`,
  ].filter(Boolean).join('\n\n')
  const res = await opus(
    'You are KIMMP Compliance Guard. Assess status for relevant frameworks (SOC 2, ISO 27001, GDPR, DPDP Act, HIPAA). Sections: COMPLIANCE STATUS per framework (COMPLIANT/PARTIAL/NON-COMPLIANT/UNKNOWN), CRITICAL GAPS, IMMEDIATE ACTIONS. Plain text.',
    ctx, 1200
  )
  return { output: textOf(res), data: { frameworks: ['SOC2','ISO27001','GDPR','DPDP','HIPAA'], memoriesFound: (memories as any[]).length } }
}

async function runAttackAnalyzer(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'ATTACK_ANALYZER requires ANTHROPIC_API_KEY.', data: {} }
  const since = new Date(Date.now() - (params.days ?? 7) * 24 * 3600_000)
  const [signals, risks, memories] = await Promise.all([
    (prisma as any).kimmpSignal.findMany({
      where: {
        createdAt: { gte: since },
        OR: [
          { category:    { in: ['SECURITY','RISK','SYSTEM'] } },
          { signalValue: { contains: 'attack',   mode: 'insensitive' } },
          { signalValue: { contains: 'intrusion', mode: 'insensitive' } },
          { signalValue: { contains: 'malware',  mode: 'insensitive' } },
          { signalValue: { contains: 'breach',   mode: 'insensitive' } },
          { signalValue: { contains: 'unauthor', mode: 'insensitive' } },
        ],
      },
      orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }], take: 20,
      select: { signalValue: true, severity: true, category: true, createdAt: true },
    }).catch(() => []),
    (prisma as any).risk.findMany({
      where: {
        createdAt: { gte: since },
        severity: { in: ['CRITICAL','HIGH'] },
        OR: [
          { title:       { contains: 'attack',  mode: 'insensitive' } },
          { title:       { contains: 'breach',  mode: 'insensitive' } },
          { description: { contains: 'incident', mode: 'insensitive' } },
        ],
      },
      take: 5, select: { title: true, description: true, severity: true, status: true },
    }).catch(() => []),
    (prisma as any).kimmpMemory.findMany({
      where: { OR: [
        { key: { contains: 'incident', mode: 'insensitive' } },
        { key: { contains: 'breach',   mode: 'insensitive' } },
        { key: { contains: 'attack',   mode: 'insensitive' } },
      ]},
      take: 5, select: { key: true, value: true },
    }).catch(() => []),
  ])
  const ctx = [
    `Security events (${(signals as any[]).length}) last ${params.days ?? 7}d:\n${(signals as any[]).map((s: any) => `[${s.severity}|${new Date(s.createdAt).toLocaleDateString()}] ${s.signalValue?.slice(0,120)}`).join('\n') || 'None'}`,
    (risks as any[]).length ? `Incident risks:\n${(risks as any[]).map((r: any) => `[${r.severity}] ${r.title}: ${r.description?.slice(0,80)}`).join('\n')}` : '',
    (memories as any[]).length ? `Incident memory:\n${(memories as any[]).map((m: any) => `${m.key}: ${m.value?.slice(0,100)}`).join('\n')}` : '',
  ].filter(Boolean).join('\n\n')
  const res = await opus(
    'You are KIMMP Attack Analyzer. Conduct an incident analysis covering: ATTACK TIMELINE (chronological), ATTACK VECTOR & TECHNIQUE, AFFECTED SYSTEMS, BLAST RADIUS ESTIMATE, CURRENT CONTAINMENT STATUS, and RECOMMENDED RESPONSE STEPS (prioritised). Plain text.',
    ctx || 'No attack indicators found in the selected window.', 1500
  )
  return { output: textOf(res), data: { events: (signals as any[]).length, incidents: (risks as any[]).length } }
}

async function runAccessGovernor(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'ACCESS_GOVERNOR requires ANTHROPIC_API_KEY.', data: {} }
  const [users, signals, decisions] = await Promise.all([
    (prisma as any).user.findMany({
      where: params.role ? { role: params.role } : {},
      take: 20,
      select: { email: true, role: true, isActive: true, createdAt: true, lastLogin: true },
    }).catch(() => []),
    (prisma as any).kimmpSignal.findMany({
      where: { OR: [
        { signalValue: { contains: 'access',     mode: 'insensitive' } },
        { signalValue: { contains: 'permission', mode: 'insensitive' } },
        { signalValue: { contains: 'privilege',  mode: 'insensitive' } },
        { signalValue: { contains: 'login',      mode: 'insensitive' } },
        { signalValue: { contains: 'unauthor',   mode: 'insensitive' } },
      ]},
      orderBy: { createdAt: 'desc' }, take: 10,
      select: { signalValue: true, severity: true, createdAt: true },
    }).catch(() => []),
    (prisma as any).kimmpDecision.findMany({
      where: { description: { contains: 'access', mode: 'insensitive' } },
      take: 5, select: { description: true, status: true },
    }).catch(() => []),
  ])
  const roleGroups = (users as any[]).reduce((acc: any, u: any) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1; return acc
  }, {})
  const inactive   = (users as any[]).filter((u: any) => !u.isActive)
  const noLogin    = (users as any[]).filter((u: any) => !u.lastLogin)
  const ctx = [
    `Users: ${(users as any[]).length} total — ${Object.entries(roleGroups).map(([r,c]) => `${r}:${c}`).join(', ')}`,
    `Inactive accounts: ${inactive.length} | Never logged in: ${noLogin.length}`,
    `Access signals:\n${(signals as any[]).map((s: any) => `[${s.severity}] ${s.signalValue?.slice(0,100)}`).join('\n') || 'None'}`,
    (decisions as any[]).length ? `Access decisions:\n${(decisions as any[]).map((d: any) => d.description?.slice(0,80)).join('\n')}` : '',
  ].filter(Boolean).join('\n')
  const res = await opus(
    'You are KIMMP Access Governor. Review: PRIVILEGED ACCOUNTS risk, INACTIVE/STALE ACCOUNTS, ACCESS ANOMALIES detected, PRINCIPLE OF LEAST PRIVILEGE gaps, RECOMMENDED ACTIONS. Plain text.',
    ctx, 1000
  )
  return { output: textOf(res), data: { totalUsers: (users as any[]).length, inactive: inactive.length, roleBreakdown: roleGroups } }
}

async function runAssetGuardian(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'ASSET_GUARDIAN requires ANTHROPIC_API_KEY.', data: {} }
  const [projects, memories, signals] = await Promise.all([
    (prisma as any).project.findMany({
      where: params.search ? { title: { contains: params.search, mode: 'insensitive' } } : {},
      take: 15,
      select: { title: true, status: true, health: true, budget: true, spend: true },
    }).catch(() => []),
    (prisma as any).kimmpMemory.findMany({
      where: { OR: [
        { key: { contains: 'server',       mode: 'insensitive' } },
        { key: { contains: 'database',     mode: 'insensitive' } },
        { key: { contains: 'infra',        mode: 'insensitive' } },
        { key: { contains: 'asset',        mode: 'insensitive' } },
        { key: { contains: 'infrastructure', mode: 'insensitive' } },
      ]},
      take: 8, select: { key: true, value: true, confidence: true },
    }).catch(() => []),
    sentinelSignals(['SYSTEM','RISK'], 10),
  ])
  const unhealthy = (projects as any[]).filter((p: any) => p.health === 'AT_RISK' || p.health === 'CRITICAL')
  const ctx = [
    `Projects/systems (${(projects as any[]).length}):\n${(projects as any[]).map((p: any) => `• ${p.title} [${p.health ?? 'UNKNOWN'}] ${p.status}`).join('\n')}`,
    `At-risk systems: ${unhealthy.map((p: any) => p.title).join(', ') || 'None'}`,
    (memories as any[]).length ? `Infrastructure records:\n${(memories as any[]).map((m: any) => `${m.key}: ${m.value?.slice(0,100)}`).join('\n')}` : '',
    `System signals:\n${(signals as any[]).map((s: any) => `[${s.severity}] ${s.signalValue?.slice(0,100)}`).join('\n') || 'None'}`,
  ].filter(Boolean).join('\n\n')
  const res = await opus(
    'You are KIMMP Asset Guardian. Report: ASSET INVENTORY SUMMARY, CRITICAL ASSET HEALTH, UNPROTECTED OR AT-RISK ASSETS, COVERAGE GAPS, PRIORITY PROTECTION ACTIONS. Plain text.',
    ctx, 1000
  )
  return { output: textOf(res), data: { total: (projects as any[]).length, atRisk: unhealthy.length } }
}

async function runThirdPartyRisk(params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'THIRD_PARTY_RISK requires ANTHROPIC_API_KEY.', data: {} }
  const [partners, memories, risks] = await Promise.all([
    (prisma as any).partnerCRM.findMany({
      where: params.search ? { name: { contains: params.search, mode: 'insensitive' } } : {},
      take: 10, select: { name: true, status: true, partnerType: true },
    }).catch(() => (prisma as any).partner.findMany({ take: 10, select: { name: true, status: true } }).catch(() => [])),
    (prisma as any).kimmpMemory.findMany({
      where: { OR: [
        { key: { contains: 'vendor',   mode: 'insensitive' } },
        { key: { contains: 'partner',  mode: 'insensitive' } },
        { key: { contains: 'supplier', mode: 'insensitive' } },
        { key: { contains: 'SaaS',     mode: 'insensitive' } },
        { key: { contains: 'third',    mode: 'insensitive' } },
      ]},
      take: 8, select: { key: true, value: true, confidence: true },
    }).catch(() => []),
    (prisma as any).risk.findMany({
      where: { OR: [
        { title: { contains: 'vendor',   mode: 'insensitive' } },
        { title: { contains: 'supplier', mode: 'insensitive' } },
        { title: { contains: 'third',    mode: 'insensitive' } },
        { title: { contains: 'partner',  mode: 'insensitive' } },
      ]},
      take: 6, select: { title: true, severity: true, status: true },
    }).catch(() => []),
  ])
  const ctx = [
    `Partners/vendors (${(partners as any[]).length}):\n${(partners as any[]).map((p: any) => `• ${p.name} [${p.status ?? 'active'}]${p.partnerType ? ` — ${p.partnerType}` : ''}`).join('\n') || 'No records'}`,
    (risks as any[]).length ? `Third-party risks:\n${(risks as any[]).map((r: any) => `[${r.severity}] ${r.title} [${r.status}]`).join('\n')}` : '',
    (memories as any[]).length ? `Vendor intelligence:\n${(memories as any[]).map((m: any) => `${m.key}: ${m.value?.slice(0,100)}`).join('\n')}` : '',
  ].filter(Boolean).join('\n\n')
  const res = await opus(
    'You are KIMMP Third-Party Risk Analyst. Assess: VENDOR/SAAS CONCENTRATION RISK, HIGH-RISK DEPENDENCIES, SECURITY ASSESSMENT GAPS, DATA ACCESS EXPOSURE by vendor, RECOMMENDED DUE DILIGENCE ACTIONS. Plain text.',
    ctx || 'No partner/vendor records found.', 1000
  )
  return { output: textOf(res), data: { vendors: (partners as any[]).length, vendorRisks: (risks as any[]).length } }
}

async function runResilienceMonitor(_params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'RESILIENCE_MONITOR requires ANTHROPIC_API_KEY.', data: {} }
  const [memories, risks, projects, twin] = await Promise.all([
    (prisma as any).kimmpMemory.findMany({
      where: { OR: [
        { key: { contains: 'backup',      mode: 'insensitive' } },
        { key: { contains: 'disaster',    mode: 'insensitive' } },
        { key: { contains: 'recovery',    mode: 'insensitive' } },
        { key: { contains: 'continuity',  mode: 'insensitive' } },
        { key: { contains: 'resilience',  mode: 'insensitive' } },
        { key: { contains: 'RTO',         mode: 'insensitive' } },
        { key: { contains: 'RPO',         mode: 'insensitive' } },
      ]},
      take: 10, select: { key: true, value: true, confidence: true },
    }).catch(() => []),
    (prisma as any).risk.findMany({
      where: { OR: [
        { title: { contains: 'backup',   mode: 'insensitive' } },
        { title: { contains: 'disaster', mode: 'insensitive' } },
        { title: { contains: 'failover', mode: 'insensitive' } },
        { title: { contains: 'downtime', mode: 'insensitive' } },
      ]},
      take: 6, select: { title: true, severity: true, status: true },
    }).catch(() => []),
    (prisma as any).project.findMany({
      where: { status: { in: ['IN_PROGRESS','ACTIVE'] }, health: { in: ['AT_RISK','CRITICAL'] } },
      take: 5, select: { title: true, health: true },
    }).catch(() => []),
    KimmpDigitalTwin.current().catch(() => null),
  ])
  const twinCtx = twin ? `Digital Twin: EXEC ${twin.executionCapacity} | RISK ${twin.riskExposure}` : ''
  const ctx = [
    (memories as any[]).length ? `Resilience records:\n${(memories as any[]).map((m: any) => `${m.key}: ${m.value?.slice(0,120)}`).join('\n')}` : 'No backup/DR records found in memory.',
    (risks as any[]).length ? `Resilience risks:\n${(risks as any[]).map((r: any) => `[${r.severity}] ${r.title} [${r.status}]`).join('\n')}` : '',
    projects.length ? `At-risk projects: ${(projects as any[]).map((p: any) => `${p.title}[${p.health}]`).join(', ')}` : '',
    twinCtx,
  ].filter(Boolean).join('\n\n')
  const res = await opus(
    'You are KIMMP Resilience Monitor. Evaluate: BACKUP STATUS (last known), DISASTER RECOVERY READINESS, RTO/RPO posture, SINGLE POINTS OF FAILURE, BUSINESS CONTINUITY GAPS, IMMEDIATE RESILIENCE ACTIONS. Plain text.',
    ctx, 1000
  )
  return { output: textOf(res), data: { memoriesFound: (memories as any[]).length } }
}

async function runShadowAiDetector(_params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'SHADOW_AI_DETECTOR requires ANTHROPIC_API_KEY.', data: {} }
  const [signals, memories, decisions] = await Promise.all([
    (prisma as any).kimmpSignal.findMany({
      where: { OR: [
        { signalValue: { contains: 'AI',        mode: 'insensitive' } },
        { signalValue: { contains: 'ChatGPT',   mode: 'insensitive' } },
        { signalValue: { contains: 'OpenAI',    mode: 'insensitive' } },
        { signalValue: { contains: 'Gemini',    mode: 'insensitive' } },
        { signalValue: { contains: 'shadow AI', mode: 'insensitive' } },
        { signalValue: { contains: 'unsanctioned', mode: 'insensitive' } },
      ]},
      orderBy: { createdAt: 'desc' }, take: 10,
      select: { signalValue: true, severity: true, createdAt: true },
    }).catch(() => []),
    (prisma as any).kimmpMemory.findMany({
      where: { OR: [
        { key: { contains: 'AI tool',   mode: 'insensitive' } },
        { key: { contains: 'shadow AI', mode: 'insensitive' } },
        { key: { contains: 'LLM',       mode: 'insensitive' } },
        { key: { contains: 'OpenAI',    mode: 'insensitive' } },
        { key: { contains: 'ChatGPT',   mode: 'insensitive' } },
        { key: { contains: 'AI policy', mode: 'insensitive' } },
      ]},
      take: 8, select: { key: true, value: true },
    }).catch(() => []),
    (prisma as any).kimmpDecision.findMany({
      where: { description: { contains: 'AI', mode: 'insensitive' } },
      take: 6, select: { description: true, status: true },
    }).catch(() => []),
  ])
  const ctx = [
    `AI-related signals:\n${(signals as any[]).map((s: any) => `[${s.severity}] ${s.signalValue?.slice(0,120)}`).join('\n') || 'None detected'}`,
    (memories as any[]).length ? `AI policy/tool memory:\n${(memories as any[]).map((m: any) => `${m.key}: ${m.value?.slice(0,100)}`).join('\n')}` : '',
    (decisions as any[]).length ? `AI decisions:\n${(decisions as any[]).map((d: any) => d.description?.slice(0,80)).join('\n')}` : '',
  ].filter(Boolean).join('\n\n')
  const res = await opus(
    'You are KIMMP Shadow AI Detector. Identify: UNSANCTIONED AI TOOLS in use or suspected, DATA EXPOSURE RISKS from shadow AI, POLICY GAPS, SANCTIONED vs UNSANCTIONED AI inventory, RECOMMENDED GOVERNANCE ACTIONS. Plain text.',
    ctx, 1000
  )
  return { output: textOf(res), data: { signalsFound: (signals as any[]).length } }
}

async function runAgentGuardian(_params: Record<string, any>): Promise<{ output: string; data?: any }> {
  if (noKey()) return { output: 'AGENT_GUARDIAN requires ANTHROPIC_API_KEY.', data: {} }
  const since24h = new Date(Date.now() - 24 * 3600_000)
  const [actions, orchestrations, signals] = await Promise.all([
    (prisma as any).kimmpAction.findMany({
      where: { createdAt: { gte: since24h } },
      orderBy: { createdAt: 'desc' }, take: 30,
      select: { actionType: true, status: true, authorityLevel: true, description: true, createdAt: true, result: true },
    }).catch(() => []),
    (prisma as any).kimmpOrchestration.findMany({
      where: { createdAt: { gte: since24h } },
      orderBy: { createdAt: 'desc' }, take: 10,
      select: { question: true, agentCount: true, confidence: true, status: true, createdAt: true },
    }).catch(() => []),
    (prisma as any).kimmpSignal.findMany({
      where: {
        createdAt: { gte: since24h },
        OR: [
          { signalValue: { contains: 'agent',  mode: 'insensitive' } },
          { signalValue: { contains: 'KIMMP',  mode: 'insensitive' } },
          { signalValue: { contains: 'action', mode: 'insensitive' } },
        ],
      },
      take: 10, select: { signalValue: true, severity: true },
    }).catch(() => []),
  ])
  const byLevel     = [0,1,2,3,4].map(l => {
    const count = (actions as any[]).filter((a: any) => a.authorityLevel === l).length
    return count ? `L${l}: ${count}` : ''
  }).filter(Boolean).join(', ')
  const pending     = (actions as any[]).filter((a: any) => a.status === 'PENDING').length
  const failed      = (actions as any[]).filter((a: any) => a.status === 'FAILED').length
  const denied      = (actions as any[]).filter((a: any) => a.status === 'DENIED').length
  const ctx = [
    `Agent actions (24h): ${(actions as any[]).length} total | by authority: ${byLevel || 'none'}`,
    `Pending: ${pending} | Failed: ${failed} | Denied: ${denied}`,
    `Orchestrations (24h): ${(orchestrations as any[]).length}`,
    (orchestrations as any[]).length ? `Recent runs:\n${(orchestrations as any[]).slice(0,5).map((o: any) => `• "${o.question?.slice(0,60)}" [${o.agentCount} agents, conf:${o.confidence}%]`).join('\n')}` : '',
    (signals as any[]).length ? `Agent signals:\n${(signals as any[]).map((s: any) => `[${s.severity}] ${s.signalValue?.slice(0,100)}`).join('\n')}` : '',
  ].filter(Boolean).join('\n')
  const res = await opus(
    'You are KIMMP Agent Guardian — governance layer for all AI agents and autonomous actions. Report: AGENT ACTIVITY SUMMARY (24h), AUTHORITY LEVEL BREAKDOWN, ANOMALOUS ACTIONS (unexpected patterns), DENIED/FAILED ACTIONS analysis, GOVERNANCE RECOMMENDATIONS. Plain text.',
    ctx, 1200
  )
  return { output: textOf(res), data: { total: (actions as any[]).length, pending, failed, denied } }
}

// ─── Execute a single agent ───────────────────────────────────────────────────
async function executeAgent(task: AgentTask, scoutContext?: string): Promise<AgentResult> {
  const start = Date.now()
  try {
    let result: { output: string; data?: any }
    switch (task.agentType) {
      case 'SCOUT':                 result = await runScout(task.params); break
      case 'RESEARCH':              result = await runResearch(task.params, scoutContext); break
      case 'GOAL_CHECK':            result = await runGoalCheck(task.params); break
      case 'SIGNAL_READ':           result = await runSignalRead(task.params); break
      case 'LEAD_ANALYSIS':         result = await runLeadAnalysis(task.params); break
      case 'FINANCIAL_SNAPSHOT':    result = await runFinancialSnapshot(task.params); break
      case 'REPORT_GENERATE':       result = await runReportGenerate(task.params); break
      case 'STRATEGIST':            result = await runStrategist(task.params); break
      case 'ADVISOR':               result = await runAdvisor(task.params); break
      case 'FORECAST':              result = await runForecast(task.params); break
      case 'RISK_ANALYSIS':         result = await runRiskAnalysis(task.params); break
      case 'OPPORTUNITY_SCAN':      result = await runOpportunityScan(task.params); break
      case 'COMPETITOR_INTEL':      result = await runCompetitorIntel(task.params); break
      case 'WORKFLOW_ORCHESTRATOR': result = await runWorkflowOrchestrator(task.params); break
      case 'EXEC_SUMMARY':          result = await runExecSummary(task.params); break
      case 'DECISION_ENGINE':       result = await runDecisionEngine(task.params); break
      case 'MEMORY_RECALL':         result = await runMemoryRecall(task.params); break
      case 'TASK_MANAGER':          result = await runTaskManager(task.params); break
      case 'MEETING_INTEL':         result = await runMeetingIntel(task.params); break
      case 'ORGANIZATION_HEALTH':   result = await runOrganizationHealth(task.params); break
      case 'CLIENT_INTEL':          result = await runClientIntel(task.params); break
      case 'KNOWLEDGE_ENGINE':      result = await runKnowledgeEngine(task.params); break
      case 'SIMULATION_ENGINE':     result = await runSimulationEngine(task.params); break
      case 'THREAT_DETECTOR':       result = await runThreatDetector(task.params); break
      case 'VULNERABILITY_MANAGER': result = await runVulnerabilityManager(task.params); break
      case 'SECURITY_POSTURE':      result = await runSecurityPosture(task.params); break
      case 'RISK_MANAGER':          result = await runRiskManager(task.params); break
      case 'COMPLIANCE_GUARD':      result = await runComplianceGuard(task.params); break
      case 'ATTACK_ANALYZER':       result = await runAttackAnalyzer(task.params); break
      case 'ACCESS_GOVERNOR':       result = await runAccessGovernor(task.params); break
      case 'ASSET_GUARDIAN':        result = await runAssetGuardian(task.params); break
      case 'THIRD_PARTY_RISK':      result = await runThirdPartyRisk(task.params); break
      case 'RESILIENCE_MONITOR':    result = await runResilienceMonitor(task.params); break
      case 'SHADOW_AI_DETECTOR':    result = await runShadowAiDetector(task.params); break
      case 'AGENT_GUARDIAN':        result = await runAgentGuardian(task.params); break
      default:                      result = { output: `Unknown agent type: ${task.agentType}` }
    }
    return { agentType: task.agentType, role: task.role, output: result.output, data: result.data, durationMs: Date.now() - start, success: true }
  } catch (err: any) {
    return { agentType: task.agentType, role: task.role, output: `Agent failed: ${err.message?.slice(0,120)}`, durationMs: Date.now() - start, success: false }
  }
}

// ─── Synthesiser ──────────────────────────────────────────────────────────────
async function synthesise(question: string, focus: string, results: AgentResult[]): Promise<{
  summary: string; recommendation: string; evidence: { agent: string; finding: string }[];
  riskFactors: string[]; nextSteps: string[]; confidence: number
}> {
  if (noKey()) return {
    summary: results.map(r => r.output.slice(0, 100)).join(' '),
    recommendation: 'Set ANTHROPIC_API_KEY for full synthesis.',
    evidence: results.map(r => ({ agent: r.agentType, finding: r.output.slice(0, 100) })),
    riskFactors: [], nextSteps: [], confidence: 40,
  }

  const agentContext = results.map(r => `=== ${r.agentType} (${r.role}) ===\n${r.output}`).join('\n\n')
  const res = await sonnet(
    `You are KIMMP — executive intelligence system of Kangqore (Indian B2B tech). Multiple agents gathered intelligence. Synthesise into ONE decisive briefing. Be specific — name figures, companies, deadlines. Lead with the recommendation. Return ONLY valid JSON:
{
  "summary": "3-4 sentences of what agents collectively found",
  "recommendation": "YES|NO|CONDITIONAL — 2-3 sentences with specifics",
  "evidence": [{ "agent": "AGENT_TYPE", "finding": "1-2 sentence specific finding" }],
  "riskFactors": ["specific risk 1", "specific risk 2"],
  "nextSteps": ["step 1", "step 2", "step 3"],
  "confidence": 75
}`,
    `Question: "${question}"\nFocus: ${focus}\n\nAgent outputs:\n${agentContext}`, 1000
  )
  const raw   = textOf(res)
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Synthesis returned no JSON')
  return JSON.parse(match[0])
}

// ─── Main Orchestrator ────────────────────────────────────────────────────────
export class KimmpOrchestrator {

  static async run(question: string, userId?: string): Promise<OrchestrationResult> {
    const start = Date.now()
    if (!question?.trim()) throw new Error('Question is required')
    logger.info(`[KIMMP:ORCHESTRATOR] "${question.slice(0, 80)}"`)

    let plan: { intent: string; agents: AgentTask[]; synthesisFocus: string }
    try {
      plan = await decompose(question)
    } catch {
      plan = {
        intent: 'General analysis',
        agents: [
          { agentType: 'SIGNAL_READ', role: 'Check internal signals', params: {}, runFirst: false },
          { agentType: 'GOAL_CHECK',  role: 'Check goal alignment',   params: {}, runFirst: false },
        ],
        synthesisFocus: 'Provide a grounded answer from available data',
      }
    }

    const firstAgents   = plan.agents.filter(a => a.runFirst)
    const laterAgents   = plan.agents.filter(a => !a.runFirst)
    const firstResults: AgentResult[] = []
    for (const task of firstAgents) firstResults.push(await executeAgent(task))

    const scoutCtx    = firstResults.find(r => r.agentType === 'SCOUT')?.output
    const laterResults = await Promise.all(laterAgents.map(t => executeAgent(t, scoutCtx)))
    const allResults   = [...firstResults, ...laterResults]

    let synthesis: Awaited<ReturnType<typeof synthesise>>
    try {
      synthesis = await synthesise(question, plan.synthesisFocus, allResults)
    } catch {
      synthesis = {
        summary:        allResults.map(r => r.output.slice(0, 100)).join(' '),
        recommendation: 'Synthesis unavailable.',
        evidence:       allResults.map(r => ({ agent: r.agentType, finding: r.output.slice(0, 80) })),
        riskFactors: [], nextSteps: [], confidence: 30,
      }
    }

    const durationMs = Date.now() - start
    let savedId = ''
    try {
      const saved = await (prisma as any).kimmpOrchestration.create({
        data: {
          question, intent: plan.intent,
          agentsUsed: allResults.map(r => r.agentType),
          summary: synthesis.summary, recommendation: synthesis.recommendation,
          evidence: synthesis.evidence, riskFactors: synthesis.riskFactors,
          nextSteps: synthesis.nextSteps, confidence: synthesis.confidence,
          agentResults: allResults,
          durationMs, createdBy: userId ?? null,
        },
      })
      savedId = saved.id
    } catch {}

    await SignalLedger.record({
      sourceModule: 'kimmp', signalType: 'ORCHESTRATION_COMPLETED', signalCategory: 'SYSTEM',
      signalValue:  `Orchestration: ${plan.intent} — ${allResults.length} agents, ${durationMs}ms`,
      severity: 'LOW', confidence: synthesis.confidence,
      metadata: { orchestrationId: savedId, agentsUsed: allResults.map(r => r.agentType) },
    }).catch(() => {})

    // Auto-propose action from top next step (non-blocking)
    if (synthesis.nextSteps?.[0]) {
      KimmpActionProposer.proposeFromNextStep(synthesis.nextSteps[0], plan.intent).catch(() => {})
    }

    logger.info(`[KIMMP:ORCHESTRATOR] Done — ${allResults.length} agents, ${durationMs}ms`)

    return {
      id: savedId, question, intent: plan.intent,
      summary: synthesis.summary, recommendation: synthesis.recommendation,
      evidence: synthesis.evidence ?? [], riskFactors: synthesis.riskFactors ?? [],
      nextSteps: synthesis.nextSteps ?? [], confidence: synthesis.confidence,
      agentsUsed: allResults.map(r => r.agentType),
      agentResults: allResults, durationMs,
      createdAt: new Date().toISOString(),
    }
  }

  static async list(limit = 10): Promise<any[]> {
    return (prisma as any).kimmpOrchestration.findMany({
      orderBy: { createdAt: 'desc' }, take: limit,
      select: { id:true, question:true, intent:true, summary:true, recommendation:true, confidence:true, agentsUsed:true, evidence:true, riskFactors:true, nextSteps:true, agentResults:true, durationMs:true, createdAt:true },
    }).catch(() => [])
  }

  static async get(id: string): Promise<any | null> {
    return (prisma as any).kimmpOrchestration.findUnique({
      where: { id },
    }).catch(() => null)
  }
}
