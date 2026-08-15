import { prisma } from '../../../lib/prisma'
import { sonnet, textOf } from '../llm/kimmpLLMRouter'
import { runSimulation, SimulationType } from './kimmpSimulator.service'
import { checkPolicy, PolicyEffect } from '../../esf/PolicyEngine'

export interface DecisionOption {
  label:          string
  recommendation: string
  pros:           string[]
  cons:           string[]
  roi?:           string
  confidence:     number   // 0–100
}

export interface StrategicDecisionResult {
  id:             string
  question:       string
  situation:      string          // what the data says right now
  options:        DecisionOption[]
  recommendation: string          // KIMMP's top pick
  evidence:       Array<{ source: string; type: string; snippet: string }>
  confidence:     number
  agentsMixed:    string[]
  simulation?:    any
  createdAt:      string
  policyEffect?:  PolicyEffect    // ALLOW | NOTIFY | REQUIRE_APPROVAL | DENY
  policyReason?:  string
}

// ── Detect whether a question is a strategic decision ────────────────────────
// Heuristics — if any keyword matches, route to decision engine

const DECISION_KEYWORDS = [
  'should we', 'should i', 'decide', 'decision', 'choose', 'pick', 'go with',
  'option', 'alternative', 'recommendation', 'recommend', 'which is better',
  'what would you do', 'best approach', 'best strategy', 'trade-off', 'tradeoff',
  'worth it', 'invest in', 'hire', 'fire', 'drop', 'expand', 'cut', 'pivot',
  'risk vs', 'risk reward', 'impact of', 'what happens if', 'what if we',
  'compared to', 'pros and cons', 'weigh', 'evaluate',
]

export function isStrategicDecision(question: string): boolean {
  const q = question.toLowerCase()
  return DECISION_KEYWORDS.some(kw => q.includes(kw))
}

// ── Build context snapshot ────────────────────────────────────────────────────

async function buildContext(): Promise<{
  signals:    any[]
  clients:    any[]
  projects:   any[]
  goals:      any[]
  openRisks:  any[]
}> {
  const [signals, clients, projects, goals, risks] = await Promise.allSettled([
    (prisma as any).kimmpSignal.findMany({
      where: { severity: { in: ['HIGH', 'CRITICAL'] }, status: 'NEW' },
      orderBy: { createdAt: 'desc' }, take: 10,
      select: { signalType: true, signalValue: true, severity: true, createdAt: true },
    }),
    prisma.clientCRM.findMany({
      where: { health: { in: ['at-risk', 'critical'] } },
      select: { name: true, arr: true, health: true },
      take: 5,
    }),
    prisma.project.findMany({
      where: { health: { lt: 60 } },
      select: { title: true, health: true, status: true },
      take: 5,
    }),
    (prisma as any).kimmpGoal.findMany({
      where: { status: 'ACTIVE' }, take: 3,
      select: { title: true, progress: true },
    }),
    (prisma as any).risk.findMany({
      where: { status: 'OPEN', severity: { in: ['HIGH', 'CRITICAL'] } },
      select: { title: true, severity: true }, take: 5,
    }),
  ])

  return {
    signals:   signals.status  === 'fulfilled' ? signals.value  : [],
    clients:   clients.status  === 'fulfilled' ? clients.value  : [],
    projects:  projects.status === 'fulfilled' ? projects.value : [],
    goals:     goals.status    === 'fulfilled' ? goals.value    : [],
    openRisks: risks.status    === 'fulfilled' ? risks.value    : [],
  }
}

// ── LLM-powered decision structuring ──────────────────────────────────────────

async function structureDecision(
  question: string,
  ctx: Awaited<ReturnType<typeof buildContext>>,
  explicitOptions?: string[],
): Promise<{ situation: string; options: DecisionOption[]; recommendation: string; confidence: number }> {
  const ctxText = [
    ctx.signals.length  ? `ACTIVE SIGNALS (HIGH/CRITICAL): ${ctx.signals.map(s => `${s.signalType}: ${s.signalValue}`).join('; ')}` : '',
    ctx.clients.length  ? `AT-RISK CLIENTS: ${ctx.clients.map(c => `${c.name} (ARR £${c.arr}, health: ${c.health})`).join(', ')}` : '',
    ctx.projects.length ? `UNHEALTHY PROJECTS: ${ctx.projects.map(p => `${p.title} (${p.health}%)`).join(', ')}` : '',
    ctx.goals.length    ? `ACTIVE GOALS: ${ctx.goals.map(g => `${g.title} (${g.progress}%)`).join(', ')}` : '',
    ctx.openRisks.length ? `OPEN RISKS: ${ctx.openRisks.map(r => `${r.title} (${r.severity})`).join(', ')}` : '',
  ].filter(Boolean).join('\n')

  const optionsHint = explicitOptions?.length
    ? `\nThe human is considering these specific options: ${explicitOptions.join(' | ')}`
    : ''

  const prompt = `You are KIMMP — the strategic intelligence brain of Kangqore OS.

Business question: "${question}"${optionsHint}

Current business context:
${ctxText || 'No critical signals active.'}

Return ONLY valid JSON with this exact shape:
{
  "situation": "2-3 sentence summary of what the data shows right now",
  "options": [
    {
      "label": "Option A name",
      "recommendation": "One-sentence description",
      "pros": ["pro 1", "pro 2"],
      "cons": ["con 1", "con 2"],
      "roi": "estimated ROI or impact",
      "confidence": 75
    }
  ],
  "recommendation": "Which option KIMMP recommends and the single most important reason",
  "confidence": 80
}

Rules:
- 2–4 options minimum. Never fewer than 2.
- Be specific to the business context above, not generic.
- confidence = 0–100 (how confident KIMMP is given the evidence).
- If data is thin, lower confidence and say so in the situation.`

  try {
    const res  = await sonnet('You are KIMMP, a strategic enterprise AI. Return only valid JSON.', prompt, 1500, { agentType: 'DECISION_ENGINE', tags: ['strategic_decision'], promptName: 'decision_system' })
    const raw  = textOf(res)
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
  } catch {}

  // Fallback: structured default
  return {
    situation:      'Unable to fully analyse context. Using available signals.',
    options:        [
      { label: 'Proceed', recommendation: 'Move forward with the proposal', pros: ['Action-oriented'], cons: ['Risk unclear'], confidence: 40 },
      { label: 'Wait',    recommendation: 'Gather more data before deciding', pros: ['Lower risk'], cons: ['Opportunity cost'], confidence: 40 },
    ],
    recommendation: 'Insufficient context for a strong recommendation. Suggest reviewing active signals first.',
    confidence:     30,
  }
}

// ── Save to DB + create memory ────────────────────────────────────────────────

async function persist(
  question: string,
  ctx: any,
  structured: ReturnType<typeof structureDecision> extends Promise<infer T> ? T : never,
  agentsMixed: string[],
  workflowName?: string,
  stepName?: string,
): Promise<string> {
  const evidence = [
    ...((ctx.signals  ?? []).map((s: any) => ({ source: 'KIMMP Signal', type: s.signalType, snippet: s.signalValue }))),
    ...((ctx.clients  ?? []).map((c: any) => ({ source: 'Client CRM', type: 'AT_RISK_CLIENT', snippet: `${c.name} ARR £${c.arr}` }))),
    ...((ctx.projects ?? []).map((p: any) => ({ source: 'Project', type: 'UNHEALTHY_PROJECT', snippet: `${p.title} health ${p.health}%` }))),
  ]

  const record = await (prisma as any).kimmpStrategicDecision.create({
    data: {
      question,
      context:    ctx,
      reasoning:  structured.situation,
      evidence,
      options:    structured.options,
      confidence: structured.confidence,
      agentsMixed,
      workflowName,
      stepName,
    },
  }).catch(() => null)

  // Create memory entry
  if (record) {
    await (prisma as any).kimmpMemory.create({
      data: {
        type:      'DECISION',
        content:   `Question: "${question}" — KIMMP recommended: ${structured.recommendation}`,
        decisionId: record.id,
        tags:      ['strategic', 'decision'],
      },
    }).catch(() => {})
  }

  return record?.id ?? ''
}

// ── Select an option (admin chooses) ─────────────────────────────────────────

export async function selectDecisionOption(id: string, selectedLabel: string, adminId: string): Promise<void> {
  await (prisma as any).kimmpStrategicDecision.update({
    where: { id },
    data:  { selected: selectedLabel, selectedBy: adminId, resolvedAt: new Date() },
  })

  // Record outcome memory
  await (prisma as any).kimmpMemory.create({
    data: {
      type:       'OUTCOME',
      content:    `Decision "${id}" — admin selected: "${selectedLabel}"`,
      decisionId: id,
      tags:       ['outcome', 'selected'],
    },
  }).catch(() => {})
}

// ── Record outcome (what actually happened) ───────────────────────────────────

export async function recordDecisionOutcome(id: string, outcome: string): Promise<void> {
  await (prisma as any).kimmpStrategicDecision.update({
    where: { id }, data: { outcome },
  })

  await (prisma as any).kimmpMemory.create({
    data: {
      type:       'LESSON',
      content:    `Decision "${id}" outcome: ${outcome}`,
      decisionId: id,
      tags:       ['lesson', 'outcome'],
    },
  }).catch(() => {})
}

// ── Main entry point ──────────────────────────────────────────────────────────

export async function runStrategicDecision(
  question:          string,
  userId:            string,
  options?:          string[],
  simulationType?:   SimulationType,
  simulationParams?: Record<string, any>,
  workflowName?:     string,
  stepName?:         string,
): Promise<StrategicDecisionResult> {
  const ctx        = await buildContext()
  const structured = await structureDecision(question, ctx, options)
  const agentsMixed = ['DECISION_ENGINE', 'SIGNAL_READ', 'GOAL_CHECK', 'RISK_ANALYSIS']

  // Build evidence list (same as persist does) to supply evidenceCount to policy engine
  const evidence = [
    ...(ctx.signals.map((s: any)  => ({ source: 'KIMMP Signal',   type: s.signalType,        snippet: s.signalValue }))),
    ...(ctx.clients.map((c: any)  => ({ source: 'Client CRM',     type: 'AT_RISK_CLIENT',    snippet: `${c.name} ARR £${c.arr}` }))),
    ...(ctx.projects.map((p: any) => ({ source: 'Project Health', type: 'UNHEALTHY_PROJECT', snippet: `${p.title} ${p.health}%` }))),
  ]

  // ── Policy gate ──────────────────────────────────────────────────────────────
  const policy = await checkPolicy({
    trigger:  'STRATEGIC_DECISION',
    params:   { question, confidence: structured.confidence, evidenceCount: evidence.length },
    actorId:  userId,
  }).catch(() => ({ effect: 'ALLOW' as PolicyEffect, policyId: null, policyName: null, reason: '' }))

  if (policy.effect === 'DENY') {
    throw Object.assign(new Error(`Decision blocked by policy: ${policy.reason}`), { policyEffect: 'DENY', policyReason: policy.reason })
  }

  let simulation: any | undefined
  if (simulationType && simulationParams) {
    simulation = await runSimulation(simulationType, { ...simulationParams, scenario: question }).catch(() => undefined)
  }

  const id = await persist(question, ctx, structured, agentsMixed, workflowName, stepName)

  return {
    id,
    question,
    situation:      structured.situation,
    options:        structured.options,
    recommendation: structured.recommendation,
    evidence,
    confidence:     structured.confidence,
    agentsMixed,
    simulation,
    createdAt:      new Date().toISOString(),
    policyEffect:   policy.effect !== 'ALLOW' ? policy.effect : undefined,
    policyReason:   policy.effect !== 'ALLOW' ? policy.reason : undefined,
  }
}

// ── List / get decisions ──────────────────────────────────────────────────────

export async function listStrategicDecisions(limit = 20): Promise<any[]> {
  return (prisma as any).kimmpStrategicDecision.findMany({
    orderBy: { createdAt: 'desc' }, take: limit,
    select: { id: true, question: true, selected: true, selectedBy: true, outcome: true, confidence: true, createdAt: true, resolvedAt: true, agentsMixed: true },
  }).catch(() => [])
}

export async function getStrategicDecision(id: string): Promise<any> {
  return (prisma as any).kimmpStrategicDecision.findUnique({ where: { id } }).catch(() => null)
}

export async function getStrategicDecisionByStep(workflowName: string, stepName: string): Promise<any> {
  return (prisma as any).kimmpStrategicDecision.findFirst({
    where: { workflowName, stepName },
    orderBy: { createdAt: 'desc' },
  }).catch(() => null)
}
