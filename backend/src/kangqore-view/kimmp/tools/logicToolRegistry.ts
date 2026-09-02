// ---------------------------------------------------------------------------
// WAANDA Logic Tool Registry
//
// 20 deterministic computation tools that WAANDA delegates exact math to
// via Claude's tool_use API. The LLM decides WHAT to compute; these
// functions compute it — hallucination-free.
//
// Domains:
//   Financial Intelligence  — ARR, burn, LTV:CAC, margins, growth
//   Temporal Reasoning      — date deltas, deadline risk, sprint velocity
//   Entity Scoring          — client health, project health, weighted scores
//   Operational             — capacity, SLA breach, invoice recovery
//   Business Intelligence   — benchmarks, BIDS™ scoring, engagement index
// ---------------------------------------------------------------------------

import type Anthropic from '@anthropic-ai/sdk'
import { ObjectRegistry } from '../../kore/language/ObjectRegistry'

// ─── Result envelope ──────────────────────────────────────────────────────────

export interface ToolResult {
  result:   number | string | object
  unit?:    string
  label?:   string
  detail?:  string
}

// ─── Tool implementations ─────────────────────────────────────────────────────

// Financial Intelligence ─────────────────────────────────────────────────────

function arr_projection(input: { mrr: number; growth_rate_pct: number; months: number }): ToolResult {
  const { mrr, growth_rate_pct, months } = input
  const rate = growth_rate_pct / 100
  const futureArr = mrr * Math.pow(1 + rate, months) * 12
  return {
    result: Math.round(futureArr),
    unit:   'GBP/year',
    label:  `Projected ARR in ${months} months`,
    detail: `Starting MRR £${mrr.toLocaleString()} at ${growth_rate_pct}% monthly growth`,
  }
}

function payback_days(input: { current_balance: number; monthly_burn: number }): ToolResult {
  const { current_balance, monthly_burn } = input
  if (monthly_burn <= 0) return { result: Infinity, label: 'Cash flow positive', unit: 'days' }
  const days = Math.round((current_balance / monthly_burn) * 30)
  const severity = days < 60 ? 'CRITICAL' : days < 120 ? 'HIGH' : days < 180 ? 'MODERATE' : 'HEALTHY'
  return {
    result: days,
    unit:   'days',
    label:  `${severity} — ${Math.round(days / 30)} months runway`,
    detail: `Balance £${current_balance.toLocaleString()} / burn £${monthly_burn.toLocaleString()}/mo`,
  }
}

function ltv_cac_ratio(input: { ltv: number; cac: number }): ToolResult {
  const { ltv, cac } = input
  if (cac <= 0) return { result: 0, label: 'CAC not defined', unit: 'ratio' }
  const ratio = Number((ltv / cac).toFixed(2))
  const label = ratio >= 5 ? 'EXCELLENT (>5x)' : ratio >= 3 ? 'HEALTHY (3–5x)' : ratio >= 1 ? 'MARGINAL (1–3x)' : 'UNSUSTAINABLE (<1x)'
  return { result: ratio, unit: 'x', label, detail: `LTV £${ltv} / CAC £${cac}` }
}

function margin_calculator(input: { revenue: number; costs: number }): ToolResult {
  const { revenue, costs } = input
  if (revenue <= 0) return { result: 0, unit: '%', label: 'No revenue' }
  const grossPct = Number(((revenue - costs) / revenue * 100).toFixed(1))
  const label = grossPct >= 60 ? 'STRONG' : grossPct >= 40 ? 'HEALTHY' : grossPct >= 20 ? 'THIN' : 'BELOW BENCHMARK'
  return {
    result: grossPct,
    unit:   '%',
    label:  `${label} gross margin`,
    detail: `Revenue £${revenue.toLocaleString()} / Costs £${costs.toLocaleString()} / Profit £${(revenue - costs).toLocaleString()}`,
  }
}

function compound_growth(input: { base: number; rate_pct: number; periods: number }): ToolResult {
  const { base, rate_pct, periods } = input
  const future = base * Math.pow(1 + rate_pct / 100, periods)
  const gain = future - base
  return {
    result: Math.round(future * 100) / 100,
    unit:   'same as input',
    label:  `+${Math.round(gain)} over ${periods} periods at ${rate_pct}%`,
  }
}

// Temporal Reasoning ─────────────────────────────────────────────────────────

function days_between(input: { date_a: string; date_b: string }): ToolResult {
  const a = new Date(input.date_a)
  const b = new Date(input.date_b)
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return { result: 0, unit: 'days', label: 'Invalid date' }
  const days = Math.round((b.getTime() - a.getTime()) / 86_400_000)
  return { result: days, unit: 'days', label: days >= 0 ? `${days} days until ${input.date_b}` : `${Math.abs(days)} days past ${input.date_b}` }
}

function deadline_risk_score(input: { deadline: string; today: string; progress_pct: number }): ToolResult {
  const daysLeft  = Math.round((new Date(input.deadline).getTime() - new Date(input.today).getTime()) / 86_400_000)
  const progress  = Math.min(100, Math.max(0, input.progress_pct))
  const expected  = daysLeft <= 0 ? 100 : Math.max(0, 100 - (daysLeft / 90 * 100))
  const gap       = expected - progress
  const raw       = Math.min(100, Math.max(0, 50 + gap))
  const score     = Math.round(raw)
  const label     = score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 40 ? 'MODERATE' : 'LOW'
  return {
    result: score,
    unit:   '/100',
    label:  `${label} deadline risk`,
    detail: `${daysLeft} days left, ${progress}% complete (expected ~${Math.round(expected)}%)`,
  }
}

function sprint_velocity(input: { completed_points: number; planned_points: number; sprint_count: number }): ToolResult {
  const { completed_points, planned_points, sprint_count } = input
  const velocity   = sprint_count > 0 ? Number((completed_points / sprint_count).toFixed(1)) : 0
  const completion = planned_points > 0 ? Math.round(completed_points / planned_points * 100) : 0
  const trend      = completion >= 90 ? 'ON_TRACK' : completion >= 70 ? 'SLIPPING' : 'AT_RISK'
  return {
    result: velocity,
    unit:   'points/sprint',
    label:  `${trend} — ${completion}% completion rate`,
    detail: `${completed_points} of ${planned_points} planned points across ${sprint_count} sprints`,
  }
}

function overdue_aging(input: { due_date: string; today: string }): ToolResult {
  const days = Math.round((new Date(input.today).getTime() - new Date(input.due_date).getTime()) / 86_400_000)
  if (days <= 0) return { result: 0, unit: 'days', label: 'Not yet overdue' }
  const bracket = days >= 90 ? 'SEVERELY_OVERDUE' : days >= 30 ? 'OVERDUE' : days >= 7 ? 'RECENTLY_OVERDUE' : 'JUST_OVERDUE'
  return { result: days, unit: 'days overdue', label: bracket }
}

// Entity Scoring ─────────────────────────────────────────────────────────────

function client_health_score(input: { at_risk_tasks: number; overdue_invoices: number; project_health_avg: number }): ToolResult {
  const { at_risk_tasks, overdue_invoices, project_health_avg } = input
  const taskPenalty    = Math.min(30, at_risk_tasks * 5)
  const invoicePenalty = Math.min(25, overdue_invoices * 8)
  const projectScore   = Math.min(100, Math.max(0, project_health_avg))
  const score = Math.round(Math.max(0, projectScore - taskPenalty - invoicePenalty))
  const label = score >= 80 ? 'HEALTHY' : score >= 60 ? 'AMBER' : score >= 40 ? 'AT_RISK' : 'CRITICAL'
  return {
    result: score,
    unit:   '/100',
    label:  `${label} client health`,
    detail: `Project avg ${project_health_avg}% − task penalty ${taskPenalty} − invoice penalty ${invoicePenalty}`,
  }
}

function project_health_score(input: { on_time_pct: number; budget_pct: number; completion_pct: number }): ToolResult {
  const { on_time_pct, budget_pct, completion_pct } = input
  const score = Math.round((on_time_pct * 0.4) + (budget_pct * 0.35) + (completion_pct * 0.25))
  const rag = score >= 75 ? 'GREEN' : score >= 50 ? 'AMBER' : 'RED'
  return {
    result: score,
    unit:   '/100',
    label:  `${rag} — ${score}/100`,
    detail: `On-time ${on_time_pct}% (×0.4) + Budget ${budget_pct}% (×0.35) + Completion ${completion_pct}% (×0.25)`,
  }
}

function weighted_score(input: { items: Array<{ score: number; weight: number }> }): ToolResult {
  const { items } = input
  const totalWeight = items.reduce((s, i) => s + i.weight, 0)
  if (totalWeight === 0) return { result: 0, label: 'Zero total weight' }
  const weighted = items.reduce((s, i) => s + (i.score * i.weight), 0) / totalWeight
  return { result: Number(weighted.toFixed(2)), unit: 'weighted avg', label: `${items.length} items` }
}

function percentile_rank(input: { value: number; dataset: number[] }): ToolResult {
  const { value, dataset } = input
  if (dataset.length === 0) return { result: 0, label: 'Empty dataset' }
  const below = dataset.filter(d => d < value).length
  const pct = Math.round(below / dataset.length * 100)
  return {
    result: pct,
    unit:   'th percentile',
    label:  `Higher than ${pct}% of the dataset`,
    detail: `n=${dataset.length}, min=${Math.min(...dataset)}, max=${Math.max(...dataset)}, mean=${Math.round(dataset.reduce((a, b) => a + b, 0) / dataset.length)}`,
  }
}

// Operational ─────────────────────────────────────────────────────────────────

function capacity_utilization(input: { allocated_hours: number; available_hours: number }): ToolResult {
  const { allocated_hours, available_hours } = input
  if (available_hours <= 0) return { result: 0, unit: '%', label: 'No capacity defined' }
  const pct   = Math.round(allocated_hours / available_hours * 100)
  const label = pct >= 95 ? 'OVER_CAPACITY' : pct >= 85 ? 'HIGH_UTILIZATION' : pct >= 70 ? 'OPTIMAL' : pct >= 50 ? 'UNDER_UTILIZED' : 'LOW_UTILIZATION'
  return {
    result: pct,
    unit:   '%',
    label:  label.replace(/_/g, ' '),
    detail: `${allocated_hours}h allocated / ${available_hours}h available`,
  }
}

function sla_breach_probability(input: { time_remaining_hours: number; avg_resolution_hours: number; current_load: number }): ToolResult {
  const { time_remaining_hours, avg_resolution_hours, current_load } = input
  const loadFactor = Math.max(1, current_load / 10)
  const adjustedResolution = avg_resolution_hours * loadFactor
  const margin = time_remaining_hours - adjustedResolution
  const raw = margin <= 0 ? 0.95 : Math.max(0.05, 1 - (margin / avg_resolution_hours))
  const prob = Number(Math.min(0.99, raw).toFixed(2))
  const label = prob >= 0.8 ? 'BREACH_LIKELY' : prob >= 0.5 ? 'BREACH_POSSIBLE' : 'ON_TRACK'
  return {
    result: prob,
    unit:   'probability (0–1)',
    label:  `${label} — ${Math.round(prob * 100)}% breach risk`,
    detail: `${time_remaining_hours}h remaining vs ${Math.round(adjustedResolution)}h expected (load factor ×${loadFactor.toFixed(1)})`,
  }
}

function invoice_collection_forecast(input: { invoices: Array<{ amount: number; days_overdue: number }> }): ToolResult {
  const { invoices } = input
  if (invoices.length === 0) return { result: 1, unit: 'recovery rate', label: 'No invoices' }
  const totalAmount = invoices.reduce((s, i) => s + i.amount, 0)
  let expectedRecovery = 0
  for (const inv of invoices) {
    // Recovery probability decays with age: 95% at <30d, 80% at 30-60d, 60% at 60-90d, 35% at >90d
    const recRate = inv.days_overdue < 30 ? 0.95 : inv.days_overdue < 60 ? 0.80 : inv.days_overdue < 90 ? 0.60 : 0.35
    expectedRecovery += inv.amount * recRate
  }
  const rate = totalAmount > 0 ? Number((expectedRecovery / totalAmount).toFixed(2)) : 0
  return {
    result: rate,
    unit:   'expected recovery rate',
    label:  `£${Math.round(expectedRecovery).toLocaleString()} of £${totalAmount.toLocaleString()} expected`,
    detail: `${invoices.length} overdue invoices analysed`,
  }
}

// Business Intelligence ───────────────────────────────────────────────────────

function industry_benchmark_compare(input: { metric: string; value: number; industry: string }): ToolResult {
  const { metric, value, industry } = input
  // Benchmark library — industry × metric
  const benchmarks: Record<string, Record<string, number>> = {
    'tech':          { gross_margin: 65, ltv_cac: 4.5, arr_growth: 35, nps: 45, churn_pct: 8 },
    'consulting':    { gross_margin: 40, ltv_cac: 3.0, arr_growth: 15, nps: 38, churn_pct: 15 },
    'saas':          { gross_margin: 72, ltv_cac: 5.0, arr_growth: 40, nps: 42, churn_pct: 6 },
    'manufacturing': { gross_margin: 30, ltv_cac: 2.5, arr_growth: 8,  nps: 30, churn_pct: 12 },
    'retail':        { gross_margin: 35, ltv_cac: 2.0, arr_growth: 10, nps: 25, churn_pct: 20 },
    'healthcare':    { gross_margin: 45, ltv_cac: 3.5, arr_growth: 12, nps: 50, churn_pct: 10 },
    'financial':     { gross_margin: 55, ltv_cac: 4.0, arr_growth: 12, nps: 35, churn_pct: 10 },
    'default':       { gross_margin: 45, ltv_cac: 3.5, arr_growth: 20, nps: 35, churn_pct: 12 },
  }
  const industryKey = industry.toLowerCase().split(' ')[0]
  const benchmarkSet = benchmarks[industryKey] ?? benchmarks['default']
  const metricKey = metric.toLowerCase().replace(/\s+/g, '_')
  const benchmark = benchmarkSet[metricKey]
  if (benchmark === undefined) return { result: value, label: `No benchmark for "${metric}" in ${industry}` }
  const delta    = input.value - benchmark
  const deltaPct = Number(((delta / benchmark) * 100).toFixed(1))
  const position = deltaPct >= 15 ? 'ABOVE_BENCHMARK' : deltaPct >= -5 ? 'AT_BENCHMARK' : deltaPct >= -20 ? 'BELOW_BENCHMARK' : 'SIGNIFICANTLY_BELOW'
  return {
    result: { value: input.value, benchmark, delta: Number(delta.toFixed(2)), delta_pct: deltaPct },
    label:  `${position.replace(/_/g, ' ')} for ${industry} ${input.metric}`,
    detail: `Industry median: ${benchmark} / Your value: ${input.value}`,
  }
}

function bids_engine_scores(input: { pillar_scores: Array<{ pillar_id: number; score: number }> }): ToolResult {
  // Map 16 BIDS pillars to 6 engines
  const engineMap: Record<string, number[]> = {
    'Growth Engine™':    [2, 3, 5, 6, 7, 8],
    'Reimagine Engine™': [1, 4, 16],
    'Foundry Engine™':   [9, 10],
    'Shield Engine™':    [14, 15],
    'Platforms Engine™': [11, 12, 13],
    'Cognition Engine™': [11, 12, 13],
  }
  const scores   = new Map(input.pillar_scores.map(p => [p.pillar_id, p.score]))
  const engines  = Object.entries(engineMap).map(([name, ids]) => {
    const applicable = ids.filter(id => scores.has(id))
    const avg = applicable.length > 0
      ? Math.round(applicable.reduce((s, id) => s + (scores.get(id) ?? 0), 0) / applicable.length)
      : 0
    return { engine: name, score: avg, pillars: applicable.length }
  })
  const overall = engines.length > 0 ? Math.round(engines.reduce((s, e) => s + e.score, 0) / engines.length) : 0
  return {
    result:  { engines, overall },
    unit:    '/100',
    label:   `Overall BIDS™ maturity: ${overall}/100`,
    detail:  `16 pillars → 6 engines aggregated`,
  }
}

function engagement_health_index(input: { nps: number; support_tickets: number; project_health: number; payment_health: number }): ToolResult {
  const { nps, support_tickets, project_health, payment_health } = input
  const npsNorm    = Math.min(100, Math.max(0, (nps + 100) / 2))
  const ticketPen  = Math.min(40, support_tickets * 4)
  const score      = Math.round((npsNorm * 0.25) + (project_health * 0.40) + (payment_health * 0.35) - ticketPen * 0.1)
  const clamped    = Math.min(100, Math.max(0, score))
  const label      = clamped >= 80 ? 'THRIVING' : clamped >= 60 ? 'ENGAGED' : clamped >= 40 ? 'AT_RISK' : 'DISENGAGED'
  return {
    result: clamped,
    unit:   '/100',
    label:  `${label} — ${clamped}/100 engagement health`,
    detail: `NPS: ${nps} / Project health: ${project_health}% / Payment health: ${payment_health}% / Tickets: ${support_tickets}`,
  }
}

function growth_index(input: { revenue_growth: number; headcount_growth: number; customer_count_growth: number }): ToolResult {
  const { revenue_growth, headcount_growth, customer_count_growth } = input
  const composite = Number(((revenue_growth * 0.5) + (customer_count_growth * 0.35) + (headcount_growth * 0.15)).toFixed(1))
  const label = composite >= 30 ? 'HYPER_GROWTH' : composite >= 15 ? 'FAST_GROWTH' : composite >= 5 ? 'STEADY_GROWTH' : composite >= 0 ? 'FLAT' : 'CONTRACTING'
  return {
    result: composite,
    unit:   '% composite growth index',
    label:  label.replace(/_/g, ' '),
    detail: `Revenue ×0.5 + Customers ×0.35 + Headcount ×0.15`,
  }
}

// Enterprise Ontology & Knowledge ────────────────────────────────────────────────────────

import { KeosKernel } from '../../kernel/KeosKernel';
import { EnterpriseProvenanceService } from '../../kernel/EnterpriseProvenanceService';
import { EnterpriseKnowledgeService } from '../../knowledge/EnterpriseKnowledgeService';

async function query_enterprise_knowledge(input: { queryType: 'ontology' | 'history' | 'lessons' | 'concept', param?: string }): Promise<ToolResult> {
  try {
    let result;
    switch(input.queryType) {
      case 'ontology':
        result = await EnterpriseKnowledgeService.queryOntology(input.param);
        break;
      case 'history':
        result = await EnterpriseKnowledgeService.queryOperationalHistory(input.param);
        break;
      case 'lessons':
        result = await EnterpriseKnowledgeService.queryStrategicLessons(input.param || '');
        break;
      case 'concept':
        result = await EnterpriseKnowledgeService.queryEnterpriseKnowledge(input.param || '');
        break;
      default:
        throw new Error("Invalid query type");
    }
    return {
      result,
      label: `Enterprise Knowledge: ${input.queryType}`,
      detail: input.param || 'all'
    };
  } catch (error: any) {
    return {
      result: { error: error.message },
      label: 'Knowledge Query Failed',
      detail: error.message
    };
  }
}

async function execute_keos_mission(input: { goal: string, description?: string, requiredCapability?: string }): Promise<ToolResult> {
  try {
    const mission = await KeosKernel.executeMission({
      goal: input.goal,
      description: input.description,
      requester: 'WAANDA', // Executed by the AI
      requiredCapability: input.requiredCapability
    });
    
    return {
      result: mission,
      label: `Mission Completed: ${mission.id}`,
      detail: `Goal: ${mission.goal} | Outcome: ${mission.currentState}`
    };
  } catch (error: any) {
    return {
      result: { error: error.message },
      label: 'Mission Failed',
      detail: error.message
    };
  }
}

async function explain_keos_decision(input: { missionId: string }): Promise<ToolResult> {
  try {
    const trace = await EnterpriseProvenanceService.getMissionTrace(input.missionId);
    return {
      result: trace,
      label: `Provenance Trace: ${input.missionId}`,
      detail: `Decisions: ${trace.decisions.length}`
    };
  } catch (error: any) {
    return {
      result: { error: error.message },
      label: 'Provenance Failed',
      detail: error.message
    };
  }
}

// ─── Registry ─────────────────────────────────────────────────────────────────

const TOOL_IMPLS: Record<string, (input: any) => ToolResult | Promise<ToolResult>> = {
  arr_projection,
  payback_days,
  ltv_cac_ratio,
  margin_calculator,
  compound_growth,
  days_between,
  deadline_risk_score,
  sprint_velocity,
  overdue_aging,
  client_health_score,
  project_health_score,
  weighted_score,
  percentile_rank,
  capacity_utilization,
  sla_breach_probability,
  invoice_collection_forecast,
  industry_benchmark_compare,
  bids_engine_scores,
  engagement_health_index,
  growth_index,
  execute_keos_mission,
  explain_keos_decision,
  query_enterprise_knowledge,
}

// Anthropic tool definitions (schema declarations for the tool_use API)
const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: 'arr_projection',
    description: 'Project Annual Recurring Revenue given current MRR and a monthly growth rate over a number of months.',
    input_schema: { type: 'object', properties: { mrr: { type: 'number', description: 'Current Monthly Recurring Revenue in £' }, growth_rate_pct: { type: 'number', description: 'Expected monthly growth rate as a percentage (e.g. 5 = 5%)' }, months: { type: 'number', description: 'Projection horizon in months' } }, required: ['mrr', 'growth_rate_pct', 'months'] },
  },
  {
    name: 'payback_days',
    description: 'Calculate how many days of runway remain given a current balance and monthly burn rate.',
    input_schema: { type: 'object', properties: { current_balance: { type: 'number', description: 'Current cash / receivables balance in £' }, monthly_burn: { type: 'number', description: 'Monthly operating costs / burn in £' } }, required: ['current_balance', 'monthly_burn'] },
  },
  {
    name: 'ltv_cac_ratio',
    description: 'Calculate the LTV:CAC ratio and determine if it is healthy.',
    input_schema: { type: 'object', properties: { ltv: { type: 'number', description: 'Customer Lifetime Value in £' }, cac: { type: 'number', description: 'Customer Acquisition Cost in £' } }, required: ['ltv', 'cac'] },
  },
  {
    name: 'margin_calculator',
    description: 'Calculate gross margin percentage from revenue and total costs.',
    input_schema: { type: 'object', properties: { revenue: { type: 'number' }, costs: { type: 'number' } }, required: ['revenue', 'costs'] },
  },
  {
    name: 'compound_growth',
    description: 'Calculate compound growth of a base value at a rate over a number of periods.',
    input_schema: { type: 'object', properties: { base: { type: 'number' }, rate_pct: { type: 'number', description: 'Growth rate per period as a percentage' }, periods: { type: 'number' } }, required: ['base', 'rate_pct', 'periods'] },
  },
  {
    name: 'days_between',
    description: 'Calculate the exact number of days between two dates (ISO 8601). Positive = date_b is in the future.',
    input_schema: { type: 'object', properties: { date_a: { type: 'string', description: 'Start date (ISO 8601)' }, date_b: { type: 'string', description: 'End date (ISO 8601)' } }, required: ['date_a', 'date_b'] },
  },
  {
    name: 'deadline_risk_score',
    description: 'Score deadline risk (0–100) given deadline, current date, and completion progress.',
    input_schema: { type: 'object', properties: { deadline: { type: 'string', description: 'Deadline date (ISO 8601)' }, today: { type: 'string', description: 'Current date (ISO 8601)' }, progress_pct: { type: 'number', description: '% of work complete (0–100)' } }, required: ['deadline', 'today', 'progress_pct'] },
  },
  {
    name: 'sprint_velocity',
    description: 'Calculate average sprint velocity and completion rate from story point data.',
    input_schema: { type: 'object', properties: { completed_points: { type: 'number' }, planned_points: { type: 'number' }, sprint_count: { type: 'number' } }, required: ['completed_points', 'planned_points', 'sprint_count'] },
  },
  {
    name: 'overdue_aging',
    description: 'Calculate how many days an item is overdue and classify its severity bracket.',
    input_schema: { type: 'object', properties: { due_date: { type: 'string', description: 'Original due date (ISO 8601)' }, today: { type: 'string', description: 'Current date (ISO 8601)' } }, required: ['due_date', 'today'] },
  },
  {
    name: 'client_health_score',
    description: 'Compute a composite client health score (0–100) from task risk, overdue invoices, and project health.',
    input_schema: { type: 'object', properties: { at_risk_tasks: { type: 'number' }, overdue_invoices: { type: 'number' }, project_health_avg: { type: 'number', description: 'Average project health 0–100' } }, required: ['at_risk_tasks', 'overdue_invoices', 'project_health_avg'] },
  },
  {
    name: 'project_health_score',
    description: 'Compute a weighted project health score (RAG status) from delivery, budget, and completion data.',
    input_schema: { type: 'object', properties: { on_time_pct: { type: 'number' }, budget_pct: { type: 'number', description: 'Budget consumed vs. budget allocated (0–100, 100 = exactly on budget)' }, completion_pct: { type: 'number' } }, required: ['on_time_pct', 'budget_pct', 'completion_pct'] },
  },
  {
    name: 'weighted_score',
    description: 'Calculate a weighted average from a list of scored items.',
    input_schema: { type: 'object', properties: { items: { type: 'array', items: { type: 'object', properties: { score: { type: 'number' }, weight: { type: 'number' } }, required: ['score', 'weight'] } } }, required: ['items'] },
  },
  {
    name: 'percentile_rank',
    description: 'Determine what percentile a value falls at within a given dataset.',
    input_schema: { type: 'object', properties: { value: { type: 'number' }, dataset: { type: 'array', items: { type: 'number' } } }, required: ['value', 'dataset'] },
  },
  {
    name: 'capacity_utilization',
    description: 'Calculate team capacity utilization percentage and flag over/under-utilization.',
    input_schema: { type: 'object', properties: { allocated_hours: { type: 'number' }, available_hours: { type: 'number' } }, required: ['allocated_hours', 'available_hours'] },
  },
  {
    name: 'sla_breach_probability',
    description: 'Estimate the probability (0–1) of an SLA breach given remaining time, average resolution time, and current load.',
    input_schema: { type: 'object', properties: { time_remaining_hours: { type: 'number' }, avg_resolution_hours: { type: 'number' }, current_load: { type: 'number', description: 'Current ticket/task load count' } }, required: ['time_remaining_hours', 'avg_resolution_hours', 'current_load'] },
  },
  {
    name: 'invoice_collection_forecast',
    description: 'Forecast expected invoice recovery amount and rate based on aging brackets.',
    input_schema: { type: 'object', properties: { invoices: { type: 'array', items: { type: 'object', properties: { amount: { type: 'number' }, days_overdue: { type: 'number' } }, required: ['amount', 'days_overdue'] } } }, required: ['invoices'] },
  },
  {
    name: 'industry_benchmark_compare',
    description: 'Compare a business metric against industry benchmarks and return position (above/at/below).',
    input_schema: { type: 'object', properties: { metric: { type: 'string', description: 'Metric name (e.g. gross_margin, ltv_cac, nps, arr_growth, churn_pct)' }, value: { type: 'number' }, industry: { type: 'string', description: 'Industry name (tech, consulting, saas, manufacturing, retail, healthcare, financial)' } }, required: ['metric', 'value', 'industry'] },
  },
  {
    name: 'bids_engine_scores',
    description: 'Aggregate 16 BIDS™ pillar scores into 6 engine scores and an overall maturity index.',
    input_schema: { type: 'object', properties: { pillar_scores: { type: 'array', items: { type: 'object', properties: { pillar_id: { type: 'number', description: '1–16' }, score: { type: 'number', description: '0–100' } }, required: ['pillar_id', 'score'] } } }, required: ['pillar_scores'] },
  },
  {
    name: 'engagement_health_index',
    description: 'Compute a composite client engagement health index from NPS, support volume, project health, and payment health.',
    input_schema: { type: 'object', properties: { nps: { type: 'number', description: 'Net Promoter Score (-100 to 100)' }, support_tickets: { type: 'number', description: 'Open support ticket count' }, project_health: { type: 'number', description: 'Project health score 0–100' }, payment_health: { type: 'number', description: 'Payment health score 0–100 (100 = no overdue)' } }, required: ['nps', 'support_tickets', 'project_health', 'payment_health'] },
  },
  {
    name: 'growth_index',
    description: 'Compute a composite growth index from revenue, headcount, and customer count growth rates.',
    input_schema: { type: 'object', properties: { revenue_growth: { type: 'number', description: 'Revenue growth % YoY' }, headcount_growth: { type: 'number', description: 'Headcount growth % YoY' }, customer_count_growth: { type: 'number', description: 'Customer count growth % YoY' } }, required: ['revenue_growth', 'headcount_growth', 'customer_count_growth'] },
  },
  {
    name: 'execute_keos_mission',
    description: 'Execute a goal-oriented enterprise mission through the KEOS Kernel. The Kernel handles planning, capability resolution, execution, and memory storage.',
    input_schema: { 
      type: 'object', 
      properties: { 
        goal: { type: 'string', description: 'The objective of the mission' },
        description: { type: 'string', description: 'Additional context for the mission' },
        requiredCapability: { type: 'string', description: 'Optional capability to force a specific provider' }
      }, 
      required: ['goal'] 
    },
  },
  {
    name: 'explain_keos_decision',
    description: 'Retrieve the Enterprise Provenance trace for a specific mission to understand why a decision was made.',
    input_schema: { type: 'object', properties: { missionId: { type: 'string' } }, required: ['missionId'] },
  },
  {
    name: 'query_enterprise_knowledge',
    description: 'Universal interface to query the enterprise reality, including structural ontology, operational history (what happened), and cognitive lessons (what it means).',
    input_schema: { 
      type: 'object', 
      properties: { 
        queryType: { type: 'string', enum: ['ontology', 'history', 'lessons', 'concept'], description: 'The type of knowledge to query.' },
        param: { type: 'string', description: 'The specific object name, mission ID, context, or concept to look up.' }
      }, 
      required: ['queryType'] 
    },
  }
]

// ─── LogicToolRegistry ────────────────────────────────────────────────────────

export type ToolDomain = 'financial' | 'temporal' | 'scoring' | 'operational' | 'intelligence' | 'all'

const DOMAIN_MAP: Record<string, ToolDomain> = {
  arr_projection:            'financial',
  payback_days:              'financial',
  ltv_cac_ratio:             'financial',
  margin_calculator:         'financial',
  compound_growth:           'financial',
  days_between:              'temporal',
  deadline_risk_score:       'temporal',
  sprint_velocity:           'temporal',
  overdue_aging:             'temporal',
  client_health_score:       'scoring',
  project_health_score:      'scoring',
  weighted_score:            'scoring',
  percentile_rank:           'scoring',
  capacity_utilization:      'operational',
  sla_breach_probability:    'operational',
  invoice_collection_forecast: 'operational',
  industry_benchmark_compare:'intelligence',
  bids_engine_scores:        'intelligence',
  engagement_health_index:   'intelligence',
  growth_index:              'intelligence',
  execute_keos_mission:        'intelligence',
  explain_keos_decision:       'intelligence',
  query_enterprise_knowledge:  'intelligence',
}

export class LogicToolRegistry {
  static getTools(domain: ToolDomain = 'all'): Anthropic.Tool[] {
    if (domain === 'all') return TOOL_DEFINITIONS
    return TOOL_DEFINITIONS.filter(t => DOMAIN_MAP[t.name] === domain)
  }

  static execute(name: string, input: any): ToolResult {
    const fn = TOOL_IMPLS[name]
    if (!fn) throw new Error(`Unknown logic tool: "${name}"`)
    const result = fn(input)
    if (result instanceof Promise) {
      throw new Error(`Tool "${name}" is asynchronous. Use auditedExecutor instead.`);
    }
    // Fire-and-forget HANUMANAS audit log (never blocks the response path)
    LogicToolRegistry._audit(name, input, result).catch(() => {})
    return result
  }

  // Audited executor for use as a toolExecutor callback in routedCall
  // Logs every call to hanumanasAuditLog with inputs + outputs for full provenance
  static async auditedExecutor(name: string, input: any): Promise<ToolResult> {
    const fn = TOOL_IMPLS[name]
    if (!fn) throw new Error(`Unknown logic tool: "${name}"`)
    const result = await fn(input)
    await LogicToolRegistry._audit(name, input, result)
    return result
  }

  private static async _audit(name: string, input: any, result: ToolResult): Promise<void> {
    try {
      const { prisma } = await import('../../../lib/prisma')
      await (prisma as any).hanumanasAuditLog.create({
        data: {
          eventType:    'LOGIC_TOOL_CALL',
          actorId:      'WAANDA',
          resourceId:   name,
          resourceType: 'LOGIC_TOOL',
          outcome:      'SUCCESS',
          metadata:     {
            tool:    name,
            domain:  DOMAIN_MAP[name] ?? 'unknown',
            inputs:  input,
            result:  result.result,
            label:   result.label ?? null,
            unit:    result.unit ?? null,
          },
        },
      })
    } catch { /* audit is non-critical */ }
  }

  static isKnownTool(name: string): boolean {
    return name in TOOL_IMPLS
  }

  static toolNames(): string[] {
    return Object.keys(TOOL_IMPLS)
  }
}
