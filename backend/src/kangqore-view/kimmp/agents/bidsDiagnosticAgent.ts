// ---------------------------------------------------------------------------
// BIDS™ Diagnostic Agent — WAANDA-powered 16-pillar enterprise diagnostic
//
// 3-phase cycle (mirrors KIMMP system dispatcher pattern):
//   Phase 1 — REASON  : Sonnet reads intake + industry context, plans scoring approach
//   Phase 2 — EXECUTE : Sonnet scores all 16 pillars + 6 engines in structured JSON
//   Phase 3 — SPEAK   : Opus synthesises Diagnostic Scorecard™ + Executive Report™ draft
//
// Triggered by: POST /api/client/bids/intake/submit (async, fire-and-forget)
// Output: stored to BidsEngagement.pillarScores, .engineScores, .status = WAANDA_DRAFT
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma'
import logger from '../../../utils/logger'
import { sonnet, opusWithTools, textOf } from '../llm/kimmpLLMRouter'
import { SignalLedger } from '../signals/signalLedger.service'
import { LogicToolRegistry } from '../tools/logicToolRegistry'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BidsDiagnosticInput {
  engagementId: string
  clientName:   string
  industry:     string
  intakeData:   Record<string, any>
}

interface PillarScore {
  pillarId:        number
  pillarName:      string
  engineId:        number
  engineName:      string
  score:           number    // 0–100
  maturity:        'Foundational' | 'Developing' | 'Capable' | 'Advanced' | 'Leading'
  finding:         string    // 2–3 sentences
  recommendations: string[]  // top 3
}

interface EngineScore {
  engineId:   number
  engineName: string
  score:      number
  pillarIds:  number[]
  summary:    string
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const PILLARS = [
  { id: 1,  name: 'Business Strategy Intelligence™',    engineId: 3 },
  { id: 2,  name: 'Leadership Intelligence™',           engineId: 6 },
  { id: 3,  name: 'Financial Intelligence™',            engineId: 6 },
  { id: 4,  name: 'Operational Intelligence™',          engineId: 3 },
  { id: 5,  name: 'Workforce Intelligence™',            engineId: 6 },
  { id: 6,  name: 'Customer Intelligence™',             engineId: 6 },
  { id: 7,  name: 'Sales Intelligence™',                engineId: 6 },
  { id: 8,  name: 'Growth Intelligence™',               engineId: 6 },
  { id: 9,  name: 'Technology Intelligence™',           engineId: 2 },
  { id: 10, name: 'Cloud & Infrastructure Intelligence™', engineId: 2 },
  { id: 11, name: 'Data Intelligence™',                 engineId: 1 },
  { id: 12, name: 'AI Intelligence™',                   engineId: 1 },
  { id: 13, name: 'Automation Intelligence™',           engineId: 1 },
  { id: 14, name: 'Cybersecurity Intelligence™',        engineId: 4 },
  { id: 15, name: 'Governance & Risk Intelligence™',    engineId: 4 },
  { id: 16, name: 'Transformation Intelligence™',       engineId: 3 },
]

const ENGINES = [
  { id: 1, name: 'Cognition Intelligence Engine™',  pillarIds: [11, 12, 13] },
  { id: 2, name: 'Foundry Intelligence Engine™',    pillarIds: [9, 10] },
  { id: 3, name: 'Reimagine Intelligence Engine™',  pillarIds: [1, 4, 16] },
  { id: 4, name: 'Shield Intelligence Engine™',     pillarIds: [14, 15] },
  { id: 5, name: 'Platforms Intelligence Engine™',  pillarIds: [9, 10] },
  { id: 6, name: 'Growth Intelligence Engine™',     pillarIds: [2, 3, 5, 6, 7, 8] },
]

function maturityFromScore(score: number): PillarScore['maturity'] {
  if (score >= 80) return 'Leading'
  if (score >= 65) return 'Advanced'
  if (score >= 45) return 'Capable'
  if (score >= 25) return 'Developing'
  return 'Foundational'
}

// ─── Phase 1: REASON ─────────────────────────────────────────────────────────

async function reason(input: BidsDiagnosticInput): Promise<string> {
  const system = `You are WAANDA — Kangqore's enterprise intelligence system. You are about to perform a BIDS™ (Business Diagnostic Intelligence System™) assessment for a paying client. Your role is to reason about the client's intake data and identify the key diagnostic lenses to apply across the 16 BIDS™ pillars.`

  const user = `CLIENT: ${input.clientName}
INDUSTRY: ${input.industry}

INTAKE DATA:
${JSON.stringify(input.intakeData, null, 2)}

Based on this intake, identify:
1. Which pillars are likely to show the highest risk/lowest maturity based on the answers
2. Which industry-specific patterns should influence scoring
3. Which answers carry the most diagnostic weight

Respond in 3–5 sentences summarising your diagnostic approach before scoring begins.`

  const res = await sonnet(system, user, 400, { agentType: 'BIDS_DIAGNOSTIC', agentSystem: 'BIDS' })
  return textOf(res)
}

// ─── Phase 2: EXECUTE — score all 16 pillars ─────────────────────────────────

async function execute(input: BidsDiagnosticInput, reasoningSummary: string): Promise<PillarScore[]> {
  const system = `You are WAANDA performing a BIDS™ enterprise diagnostic assessment. You must score an organisation across all 16 BIDS™ Diagnostic Intelligence Pillars™ based on their intake questionnaire answers.

SCORING RULES:
- Score each pillar 0–100 (0 = critical failure, 100 = world-class)
- Be objective and calibrated — most organisations score 30–65
- A "Leading" score (80+) requires clear evidence of advanced capability
- If intake data for a pillar is sparse, score conservatively (lower)
- Each finding must be specific to THIS client's answers, not generic
- Each recommendation must be actionable within 90 days

PILLAR DEFINITIONS:
1. Business Strategy Intelligence™ — clarity, cohesion, and adaptability of strategic direction
2. Leadership Intelligence™ — leadership effectiveness, alignment, and decision quality
3. Financial Intelligence™ — financial health, planning maturity, and capital allocation
4. Operational Intelligence™ — operational efficiency, process maturity, friction elimination
5. Workforce Intelligence™ — skills readiness, talent pipeline, workforce planning
6. Customer Intelligence™ — customer understanding, experience quality, loyalty systems
7. Sales Intelligence™ — revenue engine health, sales process, pipeline conversion
8. Growth Intelligence™ — digital growth maturity, market expansion, growth strategy
9. Technology Intelligence™ — technology maturity, engineering quality, platform health
10. Cloud & Infrastructure Intelligence™ — cloud adoption, infrastructure resilience, scalability
11. Data Intelligence™ — data quality, accessibility, governance, and maturity
12. AI Intelligence™ — AI readiness, deployment maturity, GenAI adoption
13. Automation Intelligence™ — automation coverage, process automation potential
14. Cybersecurity Intelligence™ — security posture, incident readiness, compliance
15. Governance & Risk Intelligence™ — risk management maturity, governance frameworks
16. Transformation Intelligence™ — transformation readiness, change management, modernisation capability

OUTPUT FORMAT: Respond ONLY with valid JSON matching this exact structure (no markdown, no explanation):
{
  "pillarScores": [
    {
      "pillarId": 1,
      "pillarName": "Business Strategy Intelligence™",
      "engineId": 3,
      "engineName": "Reimagine Intelligence Engine™",
      "score": 72,
      "maturity": "Capable",
      "finding": "2–3 sentences specific to this client.",
      "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
    }
    // ... all 16 pillars
  ]
}`

  const user = `CLIENT: ${input.clientName}
INDUSTRY: ${input.industry}

DIAGNOSTIC REASONING (your own pre-assessment):
${reasoningSummary}

CLIENT INTAKE ANSWERS:
${JSON.stringify(input.intakeData, null, 2)}

Score all 16 pillars now. Return ONLY the JSON object.`

  const res = await sonnet(system, user, 3000, { agentType: 'BIDS_DIAGNOSTIC', agentSystem: 'BIDS' })
  const raw = textOf(res).trim()

  // Strip markdown code fences if present
  const json = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()

  try {
    const parsed = JSON.parse(json)
    const scores: PillarScore[] = (parsed.pillarScores ?? []).map((p: any) => ({
      pillarId:        p.pillarId,
      pillarName:      p.pillarName,
      engineId:        p.engineId,
      engineName:      p.engineName,
      score:           typeof p.score === 'number' ? Math.max(0, Math.min(100, p.score)) : 50,
      maturity:        p.maturity ?? maturityFromScore(p.score ?? 50),
      finding:         p.finding ?? '',
      recommendations: Array.isArray(p.recommendations) ? p.recommendations.slice(0, 3) : [],
    }))
    return scores
  } catch (err) {
    logger.error('[BIDS:DIAGNOSTIC] Failed to parse pillar scores JSON', raw.slice(0, 300))
    // Fallback: return neutral scores for all pillars so status can still advance
    return PILLARS.map(p => ({
      pillarId:        p.id,
      pillarName:      p.name,
      engineId:        p.engineId,
      engineName:      ENGINES.find(e => e.id === p.engineId)?.name ?? '',
      score:           50,
      maturity:        'Developing' as const,
      finding:         'Insufficient intake data to score this pillar accurately. Consultant review required.',
      recommendations: ['Gather additional data for this pillar during the consultant workshop.'],
    }))
  }
}

// ─── Aggregate engine scores — deterministic via LogicToolRegistry ───────────

function aggregateEngineScores(pillarScores: PillarScore[]): EngineScore[] {
  // Delegate to the Logic Tool Registry so engine scores are provably computed
  const toolResult = LogicToolRegistry.execute('bids_engine_scores', {
    pillar_scores: pillarScores.map(p => ({ pillar_id: p.pillarId, score: p.score })),
  })
  const engineData = (toolResult.result as any).engines ?? []

  return ENGINES.map((engine, i) => {
    const toolEngine = engineData[i] ?? {}
    return {
      engineId:   engine.id,
      engineName: engine.name,
      score:      typeof toolEngine.score === 'number' ? toolEngine.score : 50,
      pillarIds:  engine.pillarIds,
      summary:    '',
    }
  })
}

// ─── Phase 3: SPEAK — synthesise Executive Intelligence Report™ draft ─────────

async function speak(
  input: BidsDiagnosticInput,
  pillarScores: PillarScore[],
  engineScores: EngineScore[],
): Promise<string> {
  const overallScore = Math.round(pillarScores.reduce((sum, p) => sum + p.score, 0) / pillarScores.length)
  const weakest = [...pillarScores].sort((a, b) => a.score - b.score).slice(0, 3)
  const strongest = [...pillarScores].sort((a, b) => b.score - a.score).slice(0, 3)

  const system = `You are WAANDA — Kangqore's Workforce-Aware Autonomous Navigation, Decision & Advisory system. You are producing the preliminary Executive Intelligence Report™ for a BIDS™ diagnostic engagement. Your voice is authoritative, precise, and commercially intelligent. Write like a senior strategy consultant who also understands technology deeply. No fluff, no filler.`

  const user = `CLIENT: ${input.clientName}
INDUSTRY: ${input.industry}
OVERALL DIAGNOSTIC SCORE: ${overallScore}/100

ENGINE SCORES:
${engineScores.map(e => `• ${e.engineName}: ${e.score}/100`).join('\n')}

TOP 3 STRONGEST PILLARS:
${strongest.map(p => `• ${p.pillarName}: ${p.score}/100 — ${p.maturity}`).join('\n')}

TOP 3 WEAKEST PILLARS (priority diagnostic areas):
${weakest.map(p => `• ${p.pillarName}: ${p.score}/100 — ${p.maturity}\n  Finding: ${p.finding}`).join('\n')}

ALL 16 PILLAR SCORES:
${pillarScores.map(p => `• [${p.score}] ${p.pillarName} (${p.maturity})`).join('\n')}

Write a preliminary Executive Intelligence Report™ draft (approximately 600–800 words) with the following sections:
1. Executive Summary (3–4 sentences: what we found, overall maturity, key implication)
2. Diagnostic Overview (what the scores tell us about this organisation's current state)
3. Priority Diagnostic Areas (the 3 weakest pillars: what's happening, why it matters, urgency)
4. Strengths to Build From (the strongest areas and how they can be leveraged)
5. WAANDA's Diagnostic Verdict (1 paragraph: direct, board-ready conclusion)

This is a PRELIMINARY draft. The consultant will refine it. Write with confidence but note where additional information may sharpen the analysis.`

  // Use opusWithTools so the report can call industry_benchmark_compare for exact benchmark data
  const res = await opusWithTools(system, user, 1800, 'intelligence', { agentType: 'BIDS_DIAGNOSTIC', agentSystem: 'BIDS' })
  return textOf(res)
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export class BidsDiagnosticAgent {
  static async run(input: BidsDiagnosticInput): Promise<void> {
    const start = Date.now()
    logger.info(`[BIDS:DIAGNOSTIC] Starting for engagement ${input.engagementId} — ${input.clientName}`)

    try {
      // Phase 1: REASON
      const reasoningSummary = await reason(input)
      logger.info(`[BIDS:DIAGNOSTIC] Phase 1 complete — reasoning: ${reasoningSummary.slice(0, 80)}...`)

      // Phase 2: EXECUTE
      const pillarScores = await execute(input, reasoningSummary)
      const engineScores = aggregateEngineScores(pillarScores)
      logger.info(`[BIDS:DIAGNOSTIC] Phase 2 complete — ${pillarScores.length} pillars scored`)

      // Phase 3: SPEAK
      const executiveReport = await speak(input, pillarScores, engineScores)
      logger.info(`[BIDS:DIAGNOSTIC] Phase 3 complete — report ${executiveReport.length} chars`)

      // Persist to BidsEngagement
      const overallScore = Math.round(pillarScores.reduce((s, p) => s + p.score, 0) / pillarScores.length)

      await prisma.bidsEngagement.update({
        where: { id: input.engagementId },
        data: {
          pillarScores:  pillarScores as any,
          engineScores:  engineScores.map(e => ({ ...e, summary: '' })) as any,
          // Store executive report draft in notes field (consultant can promote it)
          notes: executiveReport,
          status: 'WAANDA_DRAFT',
          waandaDraftAt: new Date(),
        },
      })

      // Emit signal to KIMMP
      await SignalLedger.record({
        sourceModule:    'bids',
        signalType:      'bids.diagnostic.complete',
        signalCategory:  'OPPORTUNITY',
        signalValue:     `BIDS™ diagnostic complete for ${input.clientName} — overall score ${overallScore}/100`,
        severity:        overallScore >= 65 ? 'LOW' : overallScore >= 40 ? 'MODERATE' : 'HIGH',
        confidence:      0.85,
        metadata:        { engagementId: input.engagementId, overallScore, industry: input.industry },
      })

      logger.info(`[BIDS:DIAGNOSTIC] Done in ${Date.now() - start}ms — overall ${overallScore}/100`)
    } catch (err: any) {
      logger.error(`[BIDS:DIAGNOSTIC] Agent failed: ${err.message}`)
      // Revert status to allow retry
      await prisma.bidsEngagement.update({
        where: { id: input.engagementId },
        data: { status: 'INTAKE_IN_PROGRESS' },
      }).catch(() => {})
    }
  }
}
