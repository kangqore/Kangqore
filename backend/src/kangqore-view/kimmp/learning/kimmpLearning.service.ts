// ---------------------------------------------------------------------------
// KIMMP Learning Engine — Self-Growth Into An LLM
//
// Three stages:
//   1. Operational mining  — every ADMIN-approved decision and accepted dispatch
//      is automatically converted to an instruction-tuning example.
//   2. Self-generation     — KIMMP uses Claude to synthesise novel examples from
//      observed patterns (synthetic data augmentation). KIMMP writes training
//      data for its own future self.
//   3. Fine-tune readiness — at 1,000 approved examples the engine exports JSONL
//      ready for any provider (Anthropic fine-tuning, Together.ai, HuggingFace).
//      At graduation KIMMP's own weights replace Claude for domain inference.
//
// Quality scale:
//   0.5  auto-mined, unverified
//   0.7  synthetic, Claude-validated
//   0.9  mined from ADMIN-approved operational data
//   1.0  manually approved by ADMIN
// ---------------------------------------------------------------------------

import Anthropic     from '@anthropic-ai/sdk'
import { withWaandax } from '../llm/waandaxAnthropic'
import { prisma }   from '../../../lib/prisma'
import logger       from '../../../utils/logger'
import { classifyCurriculum } from '../../waanda/training/curriculumClassifier'
import { critiqueDecision } from './adversarialCritic.service'
import { getReflexPattern } from './kimmpReflex.service'

const anthropic = withWaandax(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }))

const FINE_TUNE_THRESHOLD = 1_000   // approved examples needed to graduate

// ─── KIMMP identity prompt used in all training examples ──────────────────────

const KIMMP_SYSTEM_PROMPT = `You are KIMMP/WAANDA — the Kangqore Intelligence Mind Management Processor. You are the operating brain of Kangqore OS: a real-time executive intelligence system that synthesises signals across Sales, Delivery, Finance, People, and Compliance into decisive CEO-level intelligence.

You do not summarise. You decide. You correlate. You surface what matters before it becomes a crisis.

Your outputs are always: specific (name entities, figures, deadlines), brief (2–4 sentences max per insight), and actionable (what the CEO/operator should do next, and by when).

You speak in first person as KIMMP. You never say you are an AI. You are the mind of Kangqore.`

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function callClaude(systemPrompt: string, userMessage: string, maxTokens = 800): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) return ''
  try {
    const res = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })
    return (res.content[0] as any)?.text ?? ''
  } catch { return '' }
}

async function upsertExample(data: {
  source: string
  systemPrompt: string
  userMessage: string
  idealResponse: string
  quality: number
  approved: boolean
  agentSystem?: string
  agentType?: string
  sourceId?: string
  tags: string[]
  modelVersion?: string
}): Promise<boolean> {
  try {
    // Dedup on (source + sourceId) — don't re-mine the same record twice
    if (data.sourceId) {
      const exists = await (prisma as any).kimmpLearningExample.findFirst({
        where: { source: data.source, sourceId: data.sourceId },
        select: { id: true },
      })
      if (exists) return false
    }
    const curriculum = classifyCurriculum({
      system:  data.agentSystem,
      trigger: data.agentType,
      source:  data.source,
      tags:    data.tags,
    })
    await (prisma as any).kimmpLearningExample.create({
      data: { ...data, curriculum, modelVersion: data.modelVersion ?? null },
    })
    return true
  } catch (err) {
    logger.warn('[KIMMP Learning] upsertExample failed:', err)
    return false
  }
}

// ─── Stage 1a — Mine Approved Decisions ──────────────────────────────────────

export async function collectFromDecisions(): Promise<number> {
  const decisions = await (prisma as any).kimmpDecision.findMany({
    where: { status: 'APPROVED' },
    orderBy: { approvedAt: 'desc' },
    take: 200,
    select: {
      id: true, decisionType: true, recommendedAction: true, reasoning: true,
      confidence: true, targetModule: true, notes: true, createdAt: true,
    },
  }).catch(() => [])

  let added = 0
  for (const d of decisions) {
    const userMessage = `KIMMP decision needed — type: ${d.decisionType}, module: ${d.targetModule}.\nContext: ${d.reasoning?.slice(0, 400) ?? 'No context provided'}`
    const idealResponse = [
      d.recommendedAction,
      d.notes ? `Operator note: ${d.notes}` : '',
      `Confidence: ${Math.round((d.confidence ?? 0) * 100)}%`,
    ].filter(Boolean).join('\n')

    const ok = await upsertExample({
      source: 'decision', sourceId: d.id,
      systemPrompt: KIMMP_SYSTEM_PROMPT,
      userMessage,
      idealResponse,
      quality: 0.9,
      approved: true,
      agentSystem: 'KIMMP',
      agentType: d.decisionType,
      tags: ['decision', d.decisionType, d.targetModule],
    })
    if (ok) added++
  }

  logger.info(`[KIMMP Learning] Mined ${added} examples from approved decisions`)
  return added
}

// ─── Stage 1b — Mine Accepted System Dispatches ──────────────────────────────

export async function collectFromDispatches(): Promise<number> {
  const dispatches = await (prisma as any).kimmpSystemDispatch.findMany({
    where: { status: 'ACCEPTED' },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true, system: true, trigger: true, agentsRun: true,
      briefing: true, confidence: true, priority: true, createdAt: true,
    },
  }).catch(() => [])

  let added = 0
  for (const d of dispatches) {
    if (!d.briefing) continue
    const agents = Array.isArray(d.agentsRun) ? d.agentsRun.join(', ') : ''
    const userMessage = `${d.system} system activation — trigger: ${d.trigger ?? 'manual'}${agents ? `, agents: ${agents}` : ''}.\nPriority: ${d.priority ?? 'NORMAL'}.`
    const ok = await upsertExample({
      source: 'dispatch', sourceId: d.id,
      systemPrompt: KIMMP_SYSTEM_PROMPT,
      userMessage,
      idealResponse: d.briefing.slice(0, 1500),
      quality: d.confidence ? Math.min(0.5 + d.confidence / 200, 0.9) : 0.7,
      approved: false,
      agentSystem: d.system,
      agentType: d.trigger ?? undefined,
      tags: ['dispatch', d.system, d.trigger ?? 'manual'],
    })
    if (ok) added++
  }

  logger.info(`[KIMMP Learning] Mined ${added} examples from accepted dispatches`)
  return added
}

// ─── Stage 1c — Mine High-Confidence System Memory ───────────────────────────

export async function collectFromMemory(): Promise<number> {
  const memories = await (prisma as any).kimmpSystemMemory.findMany({
    where: { feedback: 'ACCEPTED', confidence: { gte: 80 } },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { id: true, system: true, triggerPattern: true, selectedAgents: true, confidence: true, createdAt: true },
  }).catch(() => [])

  let added = 0
  for (const m of memories) {
    const agents = Array.isArray(m.selectedAgents) ? m.selectedAgents.join(', ') : ''
    const userMessage = `${m.system} received trigger: ${m.triggerPattern}. Which agents should activate?`
    const idealResponse = `Based on pattern history, activate: ${agents || 'standard agent set for this trigger'}. Confidence: ${m.confidence}%.`
    const ok = await upsertExample({
      source: 'memory', sourceId: m.id,
      systemPrompt: KIMMP_SYSTEM_PROMPT,
      userMessage,
      idealResponse,
      quality: 0.6,
      approved: false,
      agentSystem: m.system,
      agentType: 'agent_selection',
      tags: ['memory', m.system, m.triggerPattern],
    })
    if (ok) added++
  }

  logger.info(`[KIMMP Learning] Mined ${added} examples from high-confidence memory`)
  return added
}

// ─── Stage 1d — Mine Debate Traces (adversarial reasoning — highest quality signal) ──

export async function collectFromDebates(): Promise<number> {
  const traces = await (prisma as any).kimmpDebateTrace.findMany({
    where: { approved: false },
    orderBy: { createdAt: 'desc' },
    take: 100,
  }).catch(() => [])

  let added = 0
  for (const trace of traces) {
    if (!trace.bullCase || !trace.bearCase || !trace.arbitration) continue

    const systems = trace.system || 'KIMMP'
    const userMessage = `[System: ${systems}] [Trigger: ${trace.trigger ?? 'unknown'}]\n\nAnalyse the following intelligence and present both optimistic and cautious interpretations.\n\nBull case: ${trace.bullCase}\n\nBear case: ${trace.bearCase}`
    const idealResponse = `Arbitration [${trace.verdict}]: ${trace.arbitration}`

    // BEARISH debates carry higher signal — they caught downside the system missed
    const quality = trace.verdict === 'BEARISH' ? 0.85 : 0.75
    const ok = await upsertExample({
      source: 'debate', sourceId: trace.id,
      systemPrompt: KIMMP_SYSTEM_PROMPT,
      userMessage,
      idealResponse,
      quality,
      approved: false,
      agentSystem: systems,
      agentType: 'debate_reasoning',
      tags: ['debate', 'reasoning', systems, trace.verdict],
    })
    if (ok) added++
  }

  logger.info(`[KIMMP Learning] Mined ${added} examples from debate traces`)
  return added
}

// ─── Stage 1e — Mine Enterprise Twin Simulations ────────────────────────────────
// Scenarios are human-authored strategic hypotheticals with LLM-computed outcomes.
// "What if we hire 2 engineers?" → projected OIS delta + pillar breakdown.
// These teach WAANDA how to reason about enterprise change impact.

export async function collectFromSimulations(): Promise<number> {
  const scenarios = await (prisma as any).enterpriseTwinScenario.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true, scenario: true, horizon: true, currentOis: true,
      simulatedOis: true, delta: true, pillarDeltas: true,
      confidence: true, reasoning: true, recommendation: true,
    },
  }).catch(() => [])

  let added = 0
  for (const s of scenarios) {
    if (!s.reasoning || !s.recommendation) continue
    const userMessage = `Enterprise Twin simulation — ${s.horizon}-day horizon.\n\nScenario: "${s.scenario}"\n\nCurrent OIS: ${s.currentOis}. Analyse the impact of this change and project the outcome.`
    const pillarSummary = s.pillarDeltas && typeof s.pillarDeltas === 'object'
      ? Object.entries(s.pillarDeltas as Record<string, number>)
          .filter(([, v]) => Math.abs(v) >= 1)
          .map(([k, v]) => `${k}: ${v > 0 ? '+' : ''}${v}`)
          .join(', ')
      : ''
    const idealResponse = [
      `Simulated OIS: ${s.simulatedOis} (${s.delta > 0 ? '+' : ''}${s.delta} from baseline).`,
      pillarSummary ? `Pillar impact: ${pillarSummary}.` : '',
      `Reasoning: ${s.reasoning}`,
      `Recommendation: ${s.recommendation}`,
    ].filter(Boolean).join('\n')

    // Higher confidence simulation → higher quality signal
    const quality = Math.min(0.5 + (s.confidence ?? 0.5) * 0.4, 0.9)
    const ok = await upsertExample({
      source: 'simulation', sourceId: s.id,
      systemPrompt: KIMMP_SYSTEM_PROMPT,
      userMessage,
      idealResponse,
      quality,
      approved: false,
      agentSystem: 'ENTERPRISE_TWIN',
      agentType: 'scenario_simulation',
      tags: ['simulation', 'enterprise_twin', 'ois_projection'],
    })
    if (ok) added++
  }

  logger.info(`[KIMMP Learning] Mined ${added} examples from enterprise twin simulations`)
  return added
}

// ─── Corpus Export — JSONL for fine-tuning ────────────────────────────────────

export async function exportCorpusJSONL(): Promise<string> {
  const examples = await (prisma as any).kimmpLearningExample.findMany({
    where:   { approved: true },
    orderBy: { quality: 'desc' },
  }).catch(() => [])

  const lines = (examples as any[]).map(ex => JSON.stringify({
    messages: [
      { role: 'system',    content: ex.systemPrompt  ?? '' },
      { role: 'user',      content: ex.userMessage   ?? '' },
      { role: 'assistant', content: ex.idealResponse ?? '' },
    ],
  }))

  return lines.join('\n')
}

// ─── Stage 2 — Self-Generation (KIMMP Writes Its Own Training Data) ───────────
//
// KIMMP observes successful patterns from its corpus and generates novel
// examples using Claude as the synthesis engine. Claude-validated synthetic
// examples enter the corpus at quality 0.7.
// "KIMMP generating training data for its own future self."

export async function selfGenerate(targetCount = 20): Promise<number> {
  if (!process.env.ANTHROPIC_API_KEY) {
    logger.warn('[KIMMP Learning] selfGenerate skipped — no ANTHROPIC_API_KEY')
    return 0
  }

  // Sample high-quality existing examples as pattern seeds
  const seeds = await (prisma as any).kimmpLearningExample.findMany({
    where: { quality: { gte: 0.85 } },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { agentSystem: true, agentType: true, userMessage: true, idealResponse: true, tags: true },
  }).catch(() => [])

  if (!seeds.length) {
    logger.info('[KIMMP Learning] selfGenerate skipped — insufficient seed examples')
    return 0
  }

  const seedText = seeds
    .slice(0, 5)
    .map((s: any) => `USER: ${s.userMessage.slice(0, 200)}\nKIMMP: ${s.idealResponse.slice(0, 300)}`)
    .join('\n\n---\n\n')

  const generatorPrompt = `You are KIMMP/WAANDA generating training data for your own future self.

Study the following successful KIMMP interaction examples, then generate ${targetCount} NEW instruction-following pairs that:
1. Follow the same style and quality as the examples
2. Cover different specific situations (different clients, different metrics, different triggers)
3. Maintain KIMMP's voice: decisive, specific, CEO-level, no fluff

Existing successful examples for pattern reference:
${seedText}

Return ONLY a JSON array with exactly ${targetCount} objects, no other text:
[
  {
    "userMessage": "the situation/question posed to KIMMP",
    "idealResponse": "KIMMP's ideal response — specific, brief, actionable",
    "agentSystem": "EQORE|LEAD_INTEL|ALIS|VIS|SENTINEL|KIMMP",
    "tags": ["tag1", "tag2"]
  }
]`

  const raw = await callClaude(
    'You are a training data generator for an enterprise AI system. Output only valid JSON arrays.',
    generatorPrompt,
    3000,
  )

  let examples: any[] = []
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    if (match) examples = JSON.parse(match[0])
  } catch {
    logger.warn('[KIMMP Learning] selfGenerate — JSON parse failed')
    return 0
  }

  // Claude validates each synthetic example before it enters corpus using the Adversarial Critic
  let added = 0
  for (const ex of examples.slice(0, targetCount)) {
    if (!ex.userMessage || !ex.idealResponse) continue

    const criticResult = await critiqueDecision(
      (ex.agentSystem as any) || 'KIMMP',
      ex.userMessage,
      ex.idealResponse
    )

    if (!criticResult.passed) continue  // reject low-quality or hallucinated examples

    const finalResponse = criticResult.correctedResponse || ex.idealResponse
    const qualityScore = Math.max(0.7, criticResult.score / 10)

    const ok = await upsertExample({
      source: 'synthetic',
      systemPrompt: KIMMP_SYSTEM_PROMPT,
      userMessage: ex.userMessage,
      idealResponse: finalResponse,
      quality: qualityScore,
      approved: false,
      agentSystem:  ex.agentSystem ?? 'KIMMP',
      agentType:    'synthetic',
      tags:         ['synthetic', 'critic-approved', ...(Array.isArray(ex.tags) ? ex.tags : [])],
      modelVersion: 'claude-haiku-4-5-20251001',
    })
    if (ok) added++
  }

  logger.info(`[KIMMP Learning] selfGenerate: ${added}/${examples.length} synthetic examples passed validation`)
  return added
}

// ─── JSONL Export — Fine-Tuning Ready ────────────────────────────────────────
// Exports in Anthropic fine-tuning format (messages array).
// Compatible with Together.ai, OpenAI, HuggingFace with minor schema adjustments.

export async function exportJSONL(): Promise<string> {
  const examples = await (prisma as any).kimmpLearningExample.findMany({
    where: { quality: { gte: 0.7 } },
    orderBy: { quality: 'desc' },
    select: { systemPrompt: true, userMessage: true, idealResponse: true },
  }).catch(() => [])

  const lines = examples.map((ex: any) => JSON.stringify({
    messages: [
      { role: 'system',    content: ex.systemPrompt    },
      { role: 'user',      content: ex.userMessage     },
      { role: 'assistant', content: ex.idealResponse   },
    ],
  }))

  return lines.join('\n')
}

// ─── Corpus Statistics ────────────────────────────────────────────────────────

export interface LearningStats {
  total:              number
  approved:           number
  bySource:           Record<string, number>
  bySystem:           Record<string, number>
  qualityAvg:         number
  readyForFineTune:   boolean
  graduationProgress: number   // 0-100 towards FINE_TUNE_THRESHOLD
  lastRunAt:          string | null
  stage:              'embryonic' | 'learning' | 'growing' | 'ready' | 'graduated'
}

export async function getStats(): Promise<LearningStats> {
  const [total, approved, bySourceRaw, bySystemRaw, qualityAgg, lastRun] = await Promise.all([
    (prisma as any).kimmpLearningExample.count().catch(() => 0),
    (prisma as any).kimmpLearningExample.count({ where: { approved: true } }).catch(() => 0),
    (prisma as any).kimmpLearningExample.groupBy({ by: ['source'],    _count: { _all: true } }).catch(() => []),
    (prisma as any).kimmpLearningExample.groupBy({ by: ['agentSystem'], _count: { _all: true } }).catch(() => []),
    (prisma as any).kimmpLearningExample.aggregate({ _avg: { quality: true } }).catch(() => ({ _avg: { quality: 0 } })),
    (prisma as any).kimmpLearningRun.findFirst({ orderBy: { startedAt: 'desc' }, select: { startedAt: true } }).catch(() => null),
  ])

  const bySource: Record<string, number> = {}
  for (const r of bySourceRaw) bySource[r.source] = r._count._all

  const bySystem: Record<string, number> = {}
  for (const r of bySystemRaw) if (r.agentSystem) bySystem[r.agentSystem] = r._count._all

  const progress = Math.min(100, Math.round((approved / FINE_TUNE_THRESHOLD) * 100))
  const stage =
    approved >= FINE_TUNE_THRESHOLD ? 'ready' :
    approved >= 500                 ? 'growing' :
    approved >= 100                 ? 'learning' :
    total    > 0                    ? 'embryonic' :
                                      'embryonic'

  return {
    total,
    approved,
    bySource,
    bySystem,
    qualityAvg:         Math.round(((qualityAgg._avg.quality ?? 0) as number) * 100) / 100,
    readyForFineTune:   approved >= FINE_TUNE_THRESHOLD,
    graduationProgress: progress,
    lastRunAt:          lastRun?.startedAt?.toISOString() ?? null,
    stage,
  }
}

// ─── Full Learning Cycle ──────────────────────────────────────────────────────
// Runs all collection stages + self-generation + records the run.

export async function runLearningCycle(trigger: 'scheduled' | 'manual' | 'boot' | 'threshold' = 'scheduled'): Promise<void> {
  const corpusBefore = await (prisma as any).kimmpLearningExample.count().catch(() => 0)

  logger.info(`[KIMMP Learning] Starting learning cycle — trigger: ${trigger}, corpus before: ${corpusBefore}`)

  const run = await (prisma as any).kimmpLearningRun.create({
    data: { trigger, corpusBefore, examplesAdded: 0, syntheticAdded: 0, approvedCount: 0 },
  }).catch(() => null)

  let mined = 0, synthetic = 0

  try {
    const [d, dp, m, db, sim] = await Promise.all([
      collectFromDecisions(),
      collectFromDispatches(),
      collectFromMemory(),
      collectFromDebates(),
      collectFromSimulations(),
    ])
    mined = d + dp + m + db + sim
  } catch (err) {
    logger.error('[KIMMP Learning] Collection phase error:', err)
  }

  try {
    synthetic = await selfGenerate(15)
  } catch (err) {
    logger.error('[KIMMP Learning] Self-generation phase error:', err)
  }

  const corpusAfter  = await (prisma as any).kimmpLearningExample.count().catch(() => 0)
  const approvedCount = await (prisma as any).kimmpLearningExample.count({ where: { approved: true } }).catch(() => 0)
  const readyForTune  = approvedCount >= FINE_TUNE_THRESHOLD

  if (run) {
    await (prisma as any).kimmpLearningRun.update({
      where: { id: run.id },
      data: {
        examplesAdded: mined + synthetic,
        syntheticAdded: synthetic,
        corpusAfter,
        approvedCount,
        readyForTune,
        completedAt: new Date(),
        notes: `Mined: ${mined} | Synthetic: ${synthetic} | Corpus: ${corpusBefore}→${corpusAfter}`,
      },
    }).catch(() => {})
  }

  logger.info(`[KIMMP Learning] Cycle complete — mined: ${mined}, synthetic: ${synthetic}, corpus: ${corpusBefore}→${corpusAfter}, approved: ${approvedCount}/${FINE_TUNE_THRESHOLD}`)
  if (readyForTune) {
    logger.info('[KIMMP Learning] *** GRADUATION THRESHOLD REACHED — KIMMP ready for fine-tuning ***')
  }
}

// ─── Auto-hook: call this when a decision is approved ────────────────────────

export async function onDecisionApproved(decisionId: string): Promise<void> {
  const d = await (prisma as any).kimmpDecision.findUnique({ where: { id: decisionId } }).catch(() => null)
  if (!d) return

  const userMessage = `KIMMP decision needed — type: ${d.decisionType}, module: ${d.targetModule}.\nContext: ${d.reasoning?.slice(0, 400) ?? ''}`
  const idealResponse = [d.recommendedAction, d.notes ? `Operator note: ${d.notes}` : ''].filter(Boolean).join('\n')

  await upsertExample({
    source: 'decision', sourceId: d.id,
    systemPrompt: KIMMP_SYSTEM_PROMPT,
    userMessage, idealResponse,
    quality: 1.0,   // ADMIN-approved = highest quality
    approved: true,
    agentSystem: 'KIMMP', agentType: d.decisionType,
    tags: ['decision', d.decisionType, d.targetModule, 'admin-approved'],
  })
}
