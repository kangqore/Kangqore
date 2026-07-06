import { PrismaClient } from '@prisma/client'
import Anthropic from '@anthropic-ai/sdk'
import { computeGate8 } from './gate8Service'

const prisma  = new PrismaClient()
const claude  = new Anthropic()

export interface PillarDeltas {
  decision:   number
  workflow:   number
  ai:         number
  enterprise: number
  goal:       number
  business:   number
  trust:      number
  adoption:   number
}

export interface TwinSimulationResult {
  id:             string
  scenario:       string
  horizon:        number
  currentOis:     number
  simulatedOis:   number
  delta:          number
  pillarDeltas:   PillarDeltas
  confidence:     number
  reasoning:      string
  recommendation: string
  createdAt:      string
}

const OIS_WEIGHTS: Record<keyof PillarDeltas, number> = {
  decision:   0.20,
  enterprise: 0.18,
  workflow:   0.15,
  goal:       0.14,
  ai:         0.10,
  business:   0.10,
  trust:      0.08,
  adoption:   0.05,
}

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n))
}

function computeOisFromDeltas(current: Record<string, number>, deltas: PillarDeltas): number {
  let sim = 0
  for (const [pillar, weight] of Object.entries(OIS_WEIGHTS)) {
    const cur   = current[`${pillar}Score`] ?? 50
    const delta = deltas[pillar as keyof PillarDeltas] ?? 0
    sim += clamp(cur + delta) * weight
  }
  return Math.round(sim * 10) / 10
}

export async function simulateEnterpriseTwin(
  scenario: string,
  horizon: 30 | 60 | 90 = 30,
): Promise<TwinSimulationResult> {
  const gate8 = await computeGate8()

  const currentPillars = {
    decisionScore:   gate8.decisionScore,
    workflowScore:   gate8.workflowScore,
    aiScore:         gate8.aiScore,
    enterpriseScore: gate8.enterpriseScore,
    goalScore:       gate8.goalScore,
    businessScore:   gate8.businessScore,
    trustScore:      gate8.trustScore,
    adoptionScore:   gate8.adoptionScore,
  }

  const systemPrompt = `You are the Kangqore Enterprise Digital Twin engine.
Given a proposed enterprise change and a simulation horizon, estimate the per-pillar OIS impact.

Current enterprise pillar scores (0–100):
${JSON.stringify(currentPillars, null, 2)}

OIS pillar weights: decision 20%, enterprise 18%, workflow 15%, goal 14%, ai 10%, business 10%, trust 8%, adoption 5%.

Rules:
- Respond with ONLY valid JSON. No markdown, no prose.
- pillarDeltas values must be realistic float deltas (–20 to +20). Small, credible numbers.
- confidence is a float 0.0–1.0 based on how specific the scenario is.
- reasoning is 2–3 sentences explaining the logic.
- recommendation is a single actionable sentence.`

  const userPrompt = `Scenario: "${scenario}"
Horizon: ${horizon} days

Return JSON:
{
  "pillarDeltas": {
    "decision": <float>,
    "workflow": <float>,
    "ai": <float>,
    "enterprise": <float>,
    "goal": <float>,
    "business": <float>,
    "trust": <float>,
    "adoption": <float>
  },
  "confidence": <float 0-1>,
  "reasoning": "<2-3 sentence explanation>",
  "recommendation": "<single actionable sentence>"
}`

  let pillarDeltas: PillarDeltas = {
    decision: 0, workflow: 0, ai: 0, enterprise: 0,
    goal: 0, business: 0, trust: 0, adoption: 0,
  }
  let confidence     = 0.6
  let reasoning      = 'Unable to generate reasoning.'
  let recommendation = 'Collect more data and re-simulate.'

  try {
    const msg = await claude.messages.create({
      model:       'claude-haiku-4-5-20251001',
      max_tokens:  512,
      temperature: 0.3,
      system:      systemPrompt,
      messages:    [{ role: 'user', content: userPrompt }],
    })
    const raw = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
    const json = JSON.parse(raw)
    if (json.pillarDeltas) pillarDeltas  = json.pillarDeltas
    if (json.confidence)   confidence    = json.confidence
    if (json.reasoning)    reasoning     = json.reasoning
    if (json.recommendation) recommendation = json.recommendation
  } catch {
    // fallback — neutral simulation
  }

  const currentOis   = gate8.oisScore
  const simulatedOis = computeOisFromDeltas(currentPillars, pillarDeltas)
  const delta        = Math.round((simulatedOis - currentOis) * 10) / 10

  const record = await (prisma as any).enterpriseTwinScenario.create({
    data: {
      scenario,
      horizon,
      currentOis,
      simulatedOis,
      delta,
      pillarDeltas,
      confidence,
      reasoning,
      recommendation,
    },
  })

  return {
    id:             record.id,
    scenario:       record.scenario,
    horizon:        record.horizon,
    currentOis:     record.currentOis,
    simulatedOis:   record.simulatedOis,
    delta:          record.delta,
    pillarDeltas:   record.pillarDeltas as PillarDeltas,
    confidence:     record.confidence,
    reasoning:      record.reasoning,
    recommendation: record.recommendation,
    createdAt:      record.createdAt.toISOString(),
  }
}

export async function listTwinScenarios(limit = 10): Promise<TwinSimulationResult[]> {
  const rows = await (prisma as any).enterpriseTwinScenario.findMany({
    orderBy: { createdAt: 'desc' },
    take:    limit,
  })
  return rows.map((r: any) => ({
    id:             r.id,
    scenario:       r.scenario,
    horizon:        r.horizon,
    currentOis:     r.currentOis,
    simulatedOis:   r.simulatedOis,
    delta:          r.delta,
    pillarDeltas:   r.pillarDeltas,
    confidence:     r.confidence,
    reasoning:      r.reasoning,
    recommendation: r.recommendation,
    createdAt:      r.createdAt.toISOString(),
  }))
}
