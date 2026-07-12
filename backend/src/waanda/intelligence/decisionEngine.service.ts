import { PrismaClient } from '@prisma/client'
import Anthropic from '@anthropic-ai/sdk'

const prisma = new PrismaClient()

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DecisionOption {
  label:          string
  recommendation: string
  pros:           string[]
  cons:           string[]
  roi:            string
  confidence:     number
}

export interface DecisionEvidence {
  source:  string
  type:    string
  weight:  number   // 0.0–1.0
  snippet: string
}

export interface EnterpriseDecisionResult {
  id:          string
  question:    string
  reasoning:   string
  evidence:    DecisionEvidence[]
  options:     DecisionOption[]
  selected:    string | null
  selectedBy:  string | null
  outcome:     string | null
  confidence:  number
  agentsMixed: string[]
  status:      string
  createdAt:   string
  resolvedAt:  string | null
}

// ─── Context assembler ────────────────────────────────────────────────────────

async function gatherContext(question: string): Promise<{
  text:     string
  evidence: DecisionEvidence[]
  agents:   string[]
}> {
  const evidence: DecisionEvidence[] = []
  const agents:   string[]           = []
  const parts:    string[]           = []

  const q = question.toLowerCase()

  // Portfolio health
  const ops = await prisma.projectOperationalState.findMany({
    include: { project: { select: { title: true, status: true } } },
    take: 10,
  }).catch(() => [])

  if (ops.length > 0) {
    const avg = Math.round(ops.reduce((s, o) => s + o.health, 0) / ops.length)
    const atRisk = ops.filter(o => o.health < 60)
    parts.push(`DELIVERY: ${ops.length} active projects. Portfolio health avg ${avg}/100. At-risk: ${atRisk.map(o => o.project.title).join(', ') || 'none'}.`)
    evidence.push({ source: 'ProjectOperationalState', type: 'delivery', weight: 0.8, snippet: `Avg health ${avg}/100, ${atRisk.length} at-risk` })
    agents.push('PROJECT_HEALTH')
  }

  // Finance — invoices
  const invoices = await prisma.invoice.findMany({
    select: { status: true, dueDate: true, amount: true },
    take: 50,
  }).catch(() => [])

  if (invoices.length > 0) {
    const overdue = invoices.filter(i => !['PAID', 'CANCELLED'].includes(i.status) && new Date(i.dueDate) < new Date())
    const overdueVal = overdue.reduce((s, i) => s + Number(i.amount), 0)
    parts.push(`FINANCE: ${invoices.length} invoices. ${overdue.length} overdue (₹${overdueVal.toLocaleString()} at risk).`)
    evidence.push({ source: 'Invoice', type: 'finance', weight: 0.7, snippet: `${overdue.length} overdue, ₹${overdueVal.toLocaleString()} at risk` })
    agents.push('INVOICE_INTELLIGENCE')
  }

  // Pipeline — leads
  const leads = await prisma.eqoreLead.findMany({
    select: { status: true, leadScore: true, updatedAt: true },
    take: 100,
  }).catch(() => [])

  if (leads.length > 0) {
    const active  = leads.filter(l => !['WON', 'LOST', 'CHURNED'].includes(l.status))
    const won     = leads.filter(l => l.status === 'WON').length
    const lost    = leads.filter(l => l.status === 'LOST').length
    const winRate = (won + lost) > 0 ? Math.round((won / (won + lost)) * 100) : null
    parts.push(`PIPELINE: ${leads.length} total leads. ${active.length} active. Win rate: ${winRate !== null ? `${winRate}%` : 'N/A'}.`)
    evidence.push({ source: 'EqoreLead', type: 'pipeline', weight: 0.75, snippet: `${active.length} active leads, ${winRate !== null ? `${winRate}% win rate` : 'no win/loss data'}` })
    agents.push('DEAL_COACH')
  }

  // OIS / Gate 8
  const orch = await prisma.kimmpOrchestration.findFirst({
    orderBy: { createdAt: 'desc' },
    select:  { summary: true, recommendation: true, agentsUsed: true, createdAt: true },
  }).catch(() => null)

  if (orch?.summary) {
    parts.push(`INTELLIGENCE: Latest WAANDA orchestration (${new Date(orch.createdAt).toLocaleDateString()}): ${orch.summary}`)
    if (orch.recommendation) parts.push(`WAANDA recommendation: ${orch.recommendation.slice(0, 150)}`)
    evidence.push({ source: 'KimmpOrchestration', type: 'intelligence', weight: 0.6, snippet: orch.summary.slice(0, 120) })
    agents.push('ENTERPRISE_COACH')
  }

  // Coaching insights
  const coaching = await prisma.coachingInsight.findMany({
    where:   { isActed: false },
    orderBy: { generatedAt: 'desc' },
    take:    5,
  }).catch(() => [])

  if (coaching.length > 0) {
    const critical = coaching.filter(c => c.priority === 'CRITICAL' || c.priority === 'HIGH')
    if (critical.length > 0) {
      parts.push(`COACH ALERTS: ${critical.map(c => c.pattern).join('; ')}.`)
      evidence.push({ source: 'CoachingInsight', type: 'cross_dept', weight: 0.65, snippet: critical[0].pattern })
    }
  }

  return {
    text:     parts.join('\n'),
    evidence,
    agents,
  }
}

// ─── LLM reasoning call ───────────────────────────────────────────────────────

function anthropic() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY not set')
  return new Anthropic({ apiKey: key })
}

interface LLMOutput {
  reasoning:  string
  options:    DecisionOption[]
  confidence: number
}

async function callDecisionLLM(question: string, contextText: string): Promise<LLMOutput> {
  const client = anthropic()

  const system = `You are WAANDA — Kangqore's enterprise reasoning engine. You receive business questions from leadership and produce structured enterprise decisions.

Your output MUST follow this exact format:
REASONING: <2-3 sentences explaining what the data says and the core tension to resolve>
OPTION_1_LABEL: <short label (5 words max)>
OPTION_1_REC: <one sentence action>
OPTION_1_PROS: <comma-separated list>
OPTION_1_CONS: <comma-separated list>
OPTION_1_ROI: <expected business outcome>
OPTION_1_CONFIDENCE: <0-100>
OPTION_2_LABEL: <short label>
OPTION_2_REC: <one sentence action>
OPTION_2_PROS: <comma-separated list>
OPTION_2_CONS: <comma-separated list>
OPTION_2_ROI: <expected business outcome>
OPTION_2_CONFIDENCE: <0-100>
OPTION_3_LABEL: <short label>
OPTION_3_REC: <one sentence action>
OPTION_3_PROS: <comma-separated list>
OPTION_3_CONS: <comma-separated list>
OPTION_3_ROI: <expected business outcome>
OPTION_3_CONFIDENCE: <0-100>
OVERALL_CONFIDENCE: <0-100>

Be direct and commercially specific. Reference actual numbers from the context. Recommend one option as the primary.`

  const user = `Business question: ${question}

Current operational context:
${contextText}

Generate a structured enterprise decision with 3 options.`

  const res = await client.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 800,
    messages:   [{ role: 'user', content: user }],
    system,
  })

  const text = (res.content[0] as { type: string; text: string }).text ?? ''
  return parseDecisionOutput(text)
}

function parseDecisionOutput(text: string): LLMOutput {
  const get = (key: string) => {
    const m = text.match(new RegExp(`${key}:\\s*(.+?)(?=\\n[A-Z_]+:|$)`, 's'))
    return m ? m[1].trim() : ''
  }

  const parseOption = (n: number): DecisionOption | null => {
    const label = get(`OPTION_${n}_LABEL`)
    if (!label) return null
    return {
      label,
      recommendation: get(`OPTION_${n}_REC`),
      pros:           get(`OPTION_${n}_PROS`).split(',').map(s => s.trim()).filter(Boolean),
      cons:           get(`OPTION_${n}_CONS`).split(',').map(s => s.trim()).filter(Boolean),
      roi:            get(`OPTION_${n}_ROI`),
      confidence:     parseInt(get(`OPTION_${n}_CONFIDENCE`) || '70', 10),
    }
  }

  const options = [1, 2, 3].map(parseOption).filter((o): o is DecisionOption => o !== null)
  const reasoning       = get('REASONING') || text.slice(0, 300).trim()
  const overallConf     = parseInt(get('OVERALL_CONFIDENCE') || '70', 10)

  return {
    reasoning,
    options:    options.length > 0 ? options : [{
      label:          'Review and decide',
      recommendation: 'Bring this question to the leadership team for manual review.',
      pros:           ['Human judgement applied'],
      cons:           ['Time required'],
      roi:            'Prevents misaligned execution',
      confidence:     50,
    }],
    confidence: overallConf,
  }
}

function fallbackDecision(question: string, contextText: string): LLMOutput {
  return {
    reasoning:  `Based on current operational data, this question requires attention. Key context: ${contextText.slice(0, 200)}`,
    options: [
      {
        label:          'Act immediately',
        recommendation: 'Prioritise resolution of the most critical operational signal identified.',
        pros:           ['Fast resolution', 'Prevents compounding'],
        cons:           ['Resource intensive', 'Reactive approach'],
        roi:            'Stops the highest-risk item from worsening',
        confidence:     65,
      },
      {
        label:          'Structured review',
        recommendation: 'Convene a cross-department review of all signals before deciding.',
        pros:           ['Better alignment', 'Informed decision'],
        cons:           ['Slower', 'Risk of delay'],
        roi:            'Higher-quality decision with team buy-in',
        confidence:     70,
      },
      {
        label:          'Monitor and wait',
        recommendation: 'Set a 48-hour monitoring window and re-assess if signals worsen.',
        pros:           ['Conservative', 'Low disruption'],
        cons:           ['Delayed action', 'Risk accumulates'],
        roi:            'Preserves optionality if situation resolves',
        confidence:     45,
      },
    ],
    confidence: 60,
  }
}

// ─── Policy Engine ────────────────────────────────────────────────────────────

type PolicyEffect = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL' | 'NOTIFY'

interface PolicyCheckResult {
  allowed:  boolean
  effect:   PolicyEffect | null
  policy:   string | null
  reason:   string | null
}

export async function checkPolicy(
  trigger:  string,
  params:   Record<string, unknown>,
): Promise<PolicyCheckResult> {
  const policies = await prisma.enterprisePolicy.findMany({
    where:   { trigger: { in: [trigger, '*'] }, enabled: true },
    orderBy: { priority: 'desc' },
  }).catch(() => [])

  for (const policy of policies) {
    const cond = policy.condition as { field?: string; operator?: string; value?: unknown }
    if (!cond.field) {
      // bare effect — no condition required
      return {
        allowed: policy.effect !== 'DENY',
        effect:  policy.effect as PolicyEffect,
        policy:  policy.name,
        reason:  policy.description ?? null,
      }
    }

    const actual = params[cond.field]
    let match = false

    switch (cond.operator) {
      case 'eq':  match = actual === cond.value; break
      case 'gt':  match = Number(actual) > Number(cond.value); break
      case 'lt':  match = Number(actual) < Number(cond.value); break
      case 'gte': match = Number(actual) >= Number(cond.value); break
      case 'lte': match = Number(actual) <= Number(cond.value); break
      case 'contains': match = String(actual).includes(String(cond.value)); break
    }

    if (match) {
      return {
        allowed: policy.effect !== 'DENY',
        effect:  policy.effect as PolicyEffect,
        policy:  policy.name,
        reason:  policy.description ?? null,
      }
    }
  }

  return { allowed: true, effect: null, policy: null, reason: null }
}

// ─── Decision CRUD ────────────────────────────────────────────────────────────

export async function createDecision(question: string): Promise<EnterpriseDecisionResult> {
  const { text, evidence, agents } = await gatherContext(question)

  let llmOut: LLMOutput
  try {
    llmOut = await callDecisionLLM(question, text)
  } catch {
    llmOut = fallbackDecision(question, text)
  }

  const decision = await prisma.enterpriseDecision.create({
    data: {
      question,
      context:     text,
      reasoning:   llmOut.reasoning,
      evidence:    evidence as any,
      options:     llmOut.options as any,
      confidence:  llmOut.confidence,
      agentsMixed: agents,
      status:      'OPEN',
    },
  })

  // Record in memory
  await prisma.enterpriseMemory.create({
    data: {
      type:       'DECISION',
      content:    `Question: ${question}. Reasoning: ${llmOut.reasoning.slice(0, 300)}`,
      tags:       agents,
      decisionId: decision.id,
    },
  }).catch(() => null)

  return formatDecision(decision)
}

export async function resolveDecision(
  id:         string,
  selected:   string,
  selectedBy: string,
): Promise<EnterpriseDecisionResult> {
  const decision = await prisma.enterpriseDecision.update({
    where: { id },
    data:  {
      selected,
      selectedBy,
      status:     'DECIDED',
      resolvedAt: new Date(),
    },
  })

  await prisma.enterpriseMemory.create({
    data: {
      type:       'OUTCOME',
      content:    `Decision resolved: "${selected}" chosen by ${selectedBy} for question: ${decision.question.slice(0, 200)}`,
      tags:       ['DECIDED', selectedBy],
      decisionId: id,
    },
  }).catch(() => null)

  return formatDecision(decision)
}

export async function listDecisions(status?: string): Promise<EnterpriseDecisionResult[]> {
  const decisions = await prisma.enterpriseDecision.findMany({
    where:   status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    take:    50,
  })
  return decisions.map(formatDecision)
}

export async function getDecision(id: string): Promise<EnterpriseDecisionResult | null> {
  const d = await prisma.enterpriseDecision.findUnique({ where: { id } })
  return d ? formatDecision(d) : null
}

function formatDecision(d: {
  id:          string
  question:    string
  reasoning:   string
  evidence:    unknown
  options:     unknown
  selected:    string | null
  selectedBy:  string | null
  outcome:     string | null
  confidence:  number
  agentsMixed: string[]
  status:      string
  createdAt:   Date
  resolvedAt:  Date | null
}): EnterpriseDecisionResult {
  return {
    id:          d.id,
    question:    d.question,
    reasoning:   d.reasoning,
    evidence:    (d.evidence as DecisionEvidence[]) ?? [],
    options:     (d.options  as DecisionOption[])   ?? [],
    selected:    d.selected,
    selectedBy:  d.selectedBy,
    outcome:     d.outcome,
    confidence:  d.confidence,
    agentsMixed: d.agentsMixed,
    status:      d.status,
    createdAt:   d.createdAt.toISOString(),
    resolvedAt:  d.resolvedAt?.toISOString() ?? null,
  }
}

// ─── Policy CRUD ──────────────────────────────────────────────────────────────

export async function listPolicies() {
  return prisma.enterprisePolicy.findMany({ orderBy: { priority: 'desc' } })
}

export async function createPolicy(data: {
  name:        string
  description: string
  trigger:     string
  condition:   Record<string, unknown>
  effect:      string
  priority:    number
}) {
  return prisma.enterprisePolicy.create({ data: { ...data, condition: data.condition as any } })
}

export async function togglePolicy(id: string, enabled: boolean) {
  return prisma.enterprisePolicy.update({ where: { id }, data: { enabled } })
}

export async function deletePolicy(id: string) {
  return prisma.enterprisePolicy.delete({ where: { id } })
}
