// ---------------------------------------------------------------------------
// KIMMP System Dispatcher — each system is an autonomous LLM agent.
//
// All 5 systems (EQORE, LEAD_INTEL, ALIS, VIS, SENTINEL) are governed by
// KIMMP/WAANDA. Each activation runs 3 phases:
//
//   Phase 1 — REASON   : System LLM reads context, selects which agents to call
//   Phase 2 — EXECUTE  : Selected agents run (each is already LLM-powered)
//   Phase 3 — SPEAK    : System LLM synthesises in its own identity and voice
//
// LOOPS cascade: LEAD_INTEL → ALIS → EQORE → VIS
// SENTINEL runs in background on every loop (immune system).
// KIMMP synthesises all 5 systems at the end.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk'
import { withKrisnam } from '../llm/krisnamAnthropic'
import { prisma } from '../../../lib/prisma'
import logger from '../../../utils/logger'
import {
  SystemType,
  SYSTEM_AGENTS,
  SYSTEM_LABELS,
  SYSTEM_TRIGGERS,
  LOOP_CASCADE_ORDER,
  agentsForSystem,
} from './agentRegistry'
import {
  SYSTEM_PERSONAE,
  KIMMP_GOVERN_PROMPT,
  ModelId,
  buildReasonPrompt,
  buildSpeakPrompt,
} from './systemPersonae'
import { SystemLearning } from './systemLearning'
import { SystemRAG } from './systemRAG'
import { AgentType, AgentResult } from '../orchestrator/kimmpOrchestrator.service'
import { KimmpOrchestrator } from '../orchestrator/kimmpOrchestrator.service'
import { SignalLedger } from '../signals/signalLedger.service'
import { detectContradictions } from './contradictionDetector'
import { crossIndexBriefings } from './crossSystemFlow'
import { runDebatePhase } from './debatePhase'
import { HanumanasLedger } from '../../esf/hanumanas/hanumanasLedger.service'
import { WaandaTrainingPipeline, LocalReasonService } from '../../waanda/training'
import { sonnetWithTools, textOf } from '../llm/kimmpLLMRouter'
import { SemanticMapper, ExternalRef } from '../../eof/SemanticMapper'

const anthropic = withKrisnam(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }))

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SystemContext {
  trigger?:     string
  input?:       string
  params?:      Record<string, any>
  triggeredBy?: SystemType
  userId?:      string
}

export interface SystemBriefing {
  system:          SystemType
  label:           string
  trigger:         string
  governedBy:      'KIMMP/WAANDA'
  persona:         string         // system's full name
  model:           ModelId        // LLM tier used by this system
  // Phase 1 outputs
  reasonedAgents:  AgentType[]    // agents the system chose to activate
  reasoningSummary: string        // why it chose those agents
  priority:        'CRITICAL' | 'HIGH' | 'NORMAL'
  // Phase 2 outputs
  agentResults:    AgentResult[]
  // Phase 3 outputs (system speaks in its own voice)
  summary:         string
  keyFindings:     string[]
  recommendations: string[]
  alerts:          string[]
  loopSignal:      string | null
  confidence:      number
  durationMs:      number
  id:              string
  createdAt:       string
}

export interface LoopResult {
  cascadeOrder:   SystemType[]
  results:        SystemBriefing[]
  kimmSynthesis:  string
  activeLoops:    number
  durationMs:     number
}

// ─── LLM call helper ─────────────────────────────────────────────────────────

async function llmCall(
  model: ModelId,
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 800,
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) return ''
  try {
    const res = await anthropic.messages.create({
      model,
      max_tokens:  maxTokens,
      temperature: 0.1,
      system:      systemPrompt,
      messages:    [{ role: 'user', content: userPrompt }],
    })
    return res.content[0]?.type === 'text' ? res.content[0].text : ''
  } catch (err: any) {
    logger.warn(`[KIMMP:DISPATCH] LLM call failed (${model}):`, err.message)
    return ''
  }
}

function parseJson<T>(raw: string, fallback: T): T {
  try {
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return fallback
    return JSON.parse(match[0]) as T
  } catch {
    return fallback
  }
}

// OAG: extract platform entity refs from a query string so SemanticMapper can resolve them
function extractEntityRefs(query: string): ExternalRef[] {
  const refs: ExternalRef[] = []
  const sfMatch = query.match(/\bSF-[A-Z0-9]+\b/gi)
  if (sfMatch) sfMatch.forEach(id => refs.push({ platform: 'salesforce', externalType: 'Account', externalId: id }))
  const jiraMatch = query.match(/\b[A-Z]{2,6}-\d+\b/g)
  if (jiraMatch) jiraMatch.forEach(id => refs.push({ platform: 'jira', externalType: 'Issue', externalId: id }))
  const hsMatch = query.match(/\bHS-[A-Z0-9]+\b/gi)
  if (hsMatch) hsMatch.forEach(id => refs.push({ platform: 'hubspot', externalType: 'Contact', externalId: id }))
  return refs
}

// ─── Phase 1: REASON — system selects its agents ─────────────────────────────

async function reasonPhase(
  system: SystemType,
  ctx: SystemContext,
): Promise<{ selectedAgents: AgentType[]; reasoning: string; priority: 'CRITICAL' | 'HIGH' | 'NORMAL'; _train?: { systemPrompt: string; userPrompt: string; rawCompletion: string } }> {
  const persona    = SYSTEM_PERSONAE[system]
  const agentList  = SYSTEM_AGENTS[system]

  if (!process.env.ANTHROPIC_API_KEY) {
    return { selectedAgents: agentList, reasoning: 'No API key — running all agents', priority: 'NORMAL' }
  }

  // Fetch learning context + RAG chunks in parallel
  const ragQuery = ctx.input ?? ctx.trigger ?? 'system activation'
  const [learnCtx, ragChunks] = await Promise.allSettled([
    SystemLearning.getContext(system, ctx.trigger ?? 'manual', agentList),
    SystemRAG.retrieve(system, ragQuery, 5),
  ])

  const learningBlock = learnCtx.status === 'fulfilled' && learnCtx.value
    ? SystemLearning.formatContextBlock(learnCtx.value) : undefined
  const ragBlock = ragChunks.status === 'fulfilled' && ragChunks.value.length > 0
    ? SystemRAG.formatRAGBlock(system, ragChunks.value) : undefined

  // OAG: resolve entity refs from the query and append to the RAG block
  let enrichedRagBlock = ragBlock
  const entityRefs = extractEntityRefs(ragQuery)
  if (entityRefs.length > 0) {
    const resolved = await SemanticMapper.resolveMany(entityRefs).catch(() => new Map<string, any>())
    if (resolved.size > 0) {
      const entityLines = Array.from(resolved.entries())
        .map(([k, e]: [string, any]) => `• ${k} → ${e.objectType}: ${e.displayName} (conf: ${Math.round(e.confidence * 100)}%)`)
        .join('\n')
      enrichedRagBlock = (enrichedRagBlock ?? '') + `\n\n## Resolved Entities (OAG)\n${entityLines}`
    }
  }

  const reasonSystemPrompt = 'You are an intelligent system making agent selection decisions. Return only valid JSON.'
  const prompt = buildReasonPrompt(persona, ctx, agentList, learningBlock, enrichedRagBlock)

  // Gen 2: try local fine-tuned model first; fall back to Claude if unavailable
  const localResult = await LocalReasonService.reason(reasonSystemPrompt, prompt)
  const raw = localResult?.completion ?? await llmCall(persona.model, reasonSystemPrompt, prompt, 500)

  const parsed = parseJson(raw, {
    selectedAgents: agentList,
    reasoning:      'Defaulting to full agent roster',
    priority:       'NORMAL' as const,
  })

  // Validate — only allow agents that actually belong to this system
  const validAgents = (parsed.selectedAgents as string[])
    .filter(a => agentList.includes(a as AgentType)) as AgentType[]

  return {
    selectedAgents: validAgents.length >= 2 ? validAgents : agentList,
    reasoning:      parsed.reasoning ?? 'Agent selection complete',
    priority:       (['CRITICAL','HIGH','NORMAL'].includes(parsed.priority) ? parsed.priority : 'NORMAL') as 'CRITICAL' | 'HIGH' | 'NORMAL',
    _train: raw ? { systemPrompt: reasonSystemPrompt, userPrompt: prompt, rawCompletion: raw } : undefined,
  }
}

// ─── Phase 2: EXECUTE — run selected agents ───────────────────────────────────

async function executePhase(
  system: SystemType,
  selectedAgents: AgentType[],
  ctx: SystemContext,
): Promise<AgentResult[]> {
  const agentNames = selectedAgents.join(', ')
  const question   = ctx.input
    ? `${ctx.input} [agents: ${agentNames}]`
    : `Run a ${system} system activation. Agents required: ${agentNames}. Context: ${ctx.trigger ?? 'manual activation'}`

  try {
    const result = await KimmpOrchestrator.run(question, ctx.userId)
    const selectedSet = new Set(selectedAgents)
    const matched = (result.agentResults ?? []).filter(r => selectedSet.has(r.agentType as AgentType))
    if (matched.length >= 2) return matched
    return result.agentResults ?? []
  } catch (err: any) {
    logger.error(`[KIMMP:DISPATCH] Execute phase failed for ${system}:`, err)
    const defs = agentsForSystem(system).filter(d => selectedAgents.includes(d.type))
    return defs.map(def => ({
      agentType:  def.type,
      role:       def.role,
      output:     `Agent unavailable: ${err.message?.slice(0, 80)}`,
      durationMs: 0,
      success:    false,
    }))
  }
}

// ─── Phase 3: SPEAK — system synthesises in its own voice ────────────────────

async function speakPhase(
  system: SystemType,
  ctx: SystemContext,
  agentResults: AgentResult[],
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL',
): Promise<{
  summary: string; keyFindings: string[]; recommendations: string[];
  alerts: string[]; loopSignal: string | null; confidence: number;
  _train?: { systemPrompt: string; userPrompt: string; rawCompletion: string }
}> {
  const persona = SYSTEM_PERSONAE[system]

  const fallback = {
    summary:         agentResults.map(r => r.output.slice(0, 100)).join(' | '),
    keyFindings:     agentResults.slice(0, 3).map(r => `${r.agentType}: ${r.output.slice(0, 80)}`),
    recommendations: ['Review agent outputs above'],
    alerts:          priority === 'CRITICAL' ? ['ALERT: Critical priority activation — review immediately'] : [],
    loopSignal:      null as string | null,
    confidence:      priority === 'CRITICAL' ? 90 : 50,
  }

  if (!process.env.ANTHROPIC_API_KEY) return fallback

  const prompt    = buildSpeakPrompt(persona, ctx, agentResults)
  const rawRes    = await sonnetWithTools(persona.systemPrompt, prompt, 900, 'all', { agentType: 'KIMMP_SPEAK', agentSystem: 'KIMMP' })
  const raw       = textOf(rawRes)
  const parsed    = parseJson(raw, fallback)

  return {
    summary:         String(parsed.summary         ?? fallback.summary),
    keyFindings:     Array.isArray(parsed.keyFindings)     ? parsed.keyFindings     : fallback.keyFindings,
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : fallback.recommendations,
    alerts:          Array.isArray(parsed.alerts)          ? parsed.alerts          : fallback.alerts,
    loopSignal:      parsed.loopSignal ? String(parsed.loopSignal) : null,
    confidence:      Number(parsed.confidence ?? 70),
    _train: raw ? { systemPrompt: persona.systemPrompt, userPrompt: prompt, rawCompletion: raw } : undefined,
  }
}

// ─── Persist dispatch ─────────────────────────────────────────────────────────

async function persist(b: Omit<SystemBriefing, 'id' | 'createdAt'>): Promise<string> {
  try {
    const record = await (prisma as any).kimmpSystemDispatch.create({
      data: {
        system:          b.system,
        trigger:         b.trigger,
        agentsRun:       b.agentResults.map(r => r.agentType),
        summary:         b.summary,
        keyFindings:     b.keyFindings,
        recommendations: b.recommendations,
        alerts:          b.alerts,
        loopSignal:      b.loopSignal ?? null,
        confidence:      b.confidence,
        durationMs:      b.durationMs,
        agentResults:    b.agentResults as any,
      },
    })
    return record.id
  } catch {
    return `local-${Date.now()}`
  }
}

// ─── Main System Dispatcher ───────────────────────────────────────────────────

export class KimmpSystemDispatcher {

  static async run(system: SystemType, ctx: SystemContext = {}): Promise<SystemBriefing> {
    const start   = Date.now()
    const persona = SYSTEM_PERSONAE[system]
    logger.info(`[KIMMP:DISPATCH] ${system} (${persona.model}) activating — trigger: ${ctx.trigger ?? 'manual'}`)

    // Phase 1: REASON — system decides which agents to call
    const { selectedAgents, reasoning, priority, _train: reasonTrain } = await reasonPhase(system, ctx)
    logger.info(`[KIMMP:DISPATCH] ${system} selected ${selectedAgents.length} agents: ${selectedAgents.join(', ')} [${priority}]`)

    // Phase 2: EXECUTE — selected agents run
    const agentResults = await executePhase(system, selectedAgents, ctx)

    // Phase 3: SPEAK — system synthesises in its own voice
    const { _train: speakTrain, ...speech } = await speakPhase(system, ctx, agentResults, priority)

    // Emit signal
    await SignalLedger.record({
      sourceModule:   'kimmp' as const,
      signalType:     'SYSTEM_DISPATCH',
      signalCategory: 'SYSTEM',
      signalValue:    `${persona.name} [${persona.model}]: ${speech.summary.slice(0, 120)}`,
      severity:       priority === 'CRITICAL' ? 'CRITICAL' : priority === 'HIGH' ? 'HIGH' : 'LOW',
      confidence:     speech.confidence,
      metadata:       { system, trigger: ctx.trigger, selectedAgents, priority },
    }).catch(() => {})

    const briefing: Omit<SystemBriefing, 'id' | 'createdAt'> = {
      system,
      label:            SYSTEM_LABELS[system],
      trigger:          ctx.trigger ?? 'manual',
      governedBy:       'KIMMP/WAANDA',
      persona:          persona.fullName,
      model:            persona.model,
      reasonedAgents:   selectedAgents,
      reasoningSummary: reasoning,
      priority,
      agentResults,
      summary:          speech.summary,
      keyFindings:      speech.keyFindings,
      recommendations:  speech.recommendations,
      alerts:           speech.alerts,
      loopSignal:       speech.loopSignal,
      confidence:       speech.confidence,
      durationMs:       Date.now() - start,
    }

    const id = await persist(briefing)

    // WAANDA training data capture — fire and forget
    if (reasonTrain) {
      WaandaTrainingPipeline.captureReason({
        system, trigger: ctx.trigger, dispatchId: id, priority,
        selectedAgents: selectedAgents as string[],
        systemPrompt:   reasonTrain.systemPrompt,
        userPrompt:     reasonTrain.userPrompt,
        completion:     reasonTrain.rawCompletion,
      })
    }
    if (speakTrain) {
      WaandaTrainingPipeline.captureSpeak({
        system, trigger: ctx.trigger, dispatchId: id, priority,
        confidence:   speech.confidence,
        systemPrompt: speakTrain.systemPrompt,
        userPrompt:   speakTrain.userPrompt,
        completion:   speakTrain.rawCompletion,
      })
    }

    // Record to learning system — fire and forget
    SystemLearning.record({
      system:         system,
      dispatchId:     id,
      trigger:        ctx.trigger ?? 'manual',
      selectedAgents: selectedAgents,
      confidence:     speech.confidence,
      priority:       priority,
      loopSignalSent: !!speech.loopSignal,
    }).catch(() => {})

    // Auto-index briefing into system's RAG knowledge base — fire and forget
    SystemRAG.autoIndexBriefing({
      system,
      dispatchId:      id,
      trigger:         ctx.trigger ?? 'manual',
      summary:         speech.summary,
      keyFindings:     speech.keyFindings,
      recommendations: speech.recommendations,
    }).catch(() => {})

    // AEGIS: record every activation — fire and forget
    HanumanasLedger.logActivation({
      system:     system,
      trigger:    ctx.trigger ?? 'manual',
      actor:      ctx.userId ?? 'ADMIN',
      autonomous: false,
      dispatchId: id,
      agentsRun:  agentResults.map(r => r.agentType),
      priority:   priority,
      confidence: speech.confidence,
      durationMs: Date.now() - start,
      userId:     ctx.userId,
    }).catch(() => {})

    return { ...briefing, id, createdAt: new Date().toISOString() }
  }

  // ─── LOOPS — Cross-system cascade ──────────────────────────────────────────
  // LEAD_INTEL → ALIS → EQORE → VIS
  // Each system's loopSignal becomes the input for the next.
  // SENTINEL runs in background. KIMMP synthesises all.

  static async triggerLoop(ctx: SystemContext = {}): Promise<LoopResult> {
    const start   = Date.now()
    const results: SystemBriefing[] = []
    let   loopCtx = { ...ctx }

    logger.info('[KIMMP:LOOPS] Cross-system cascade initiated')

    for (const system of LOOP_CASCADE_ORDER) {
      const prev = results.at(-1)
      const briefing = await KimmpSystemDispatcher.run(system, {
        ...loopCtx,
        trigger:      `loop.cascade.${system.toLowerCase()}`,
        triggeredBy:  prev?.system,
        input:        prev?.loopSignal
          ? `${loopCtx.input ? loopCtx.input + ' | ' : ''}${prev.system} signal: ${prev.loopSignal}`
          : loopCtx.input,
      })
      results.push(briefing)
      if (briefing.loopSignal) loopCtx = { ...loopCtx, input: briefing.loopSignal }
    }

    // SENTINEL runs in background — immune system always checks after a loop
    KimmpSystemDispatcher.run('SENTINEL', {
      trigger: 'loop.post-cascade-audit',
      input:   `Full LOOPS cascade completed across ${LOOP_CASCADE_ORDER.join('→')}. Verify all systems are clean and no threats emerged.`,
      userId:  ctx.userId,
    }).then(s => {
      SignalLedger.record({
        sourceModule:   'kimmp.sentinel',
        signalType:     'SENTINEL_LOOP_AUDIT',
        signalCategory: 'SYSTEM',
        signalValue:    `SENTINEL post-loop: conf ${s.confidence}% | alerts: ${s.alerts.length} | ${s.summary.slice(0, 100)}`,
        severity:       s.alerts.length > 0 ? 'HIGH' : 'LOW',
        confidence:     s.confidence,
      }).catch(() => {})
    }).catch(() => {})

    // KIMMP synthesises all system briefings
    const allContext = results.map(r =>
      `=== ${r.persona} [${r.model}] ===\nPriority: ${r.priority}\nSummary: ${r.summary}\nFindings: ${r.keyFindings.join('; ')}\nRecommendations: ${r.recommendations.join('; ')}\nAlerts: ${r.alerts.join('; ') || 'none'}\nLoop signal passed: ${r.loopSignal ?? 'none'}`
    ).join('\n\n')

    // Sprint 6B — KIMMP → AEGIS: read current AEGIS governance state so the
    // synthesis is aware of active threats before it governs.
    let hanumanasStateBlock = ''
    try {
      const hanumanasCriticals = await (await import('../../../lib/prisma')).prisma.$queryRaw<any[]>`
        SELECT agent_id, summary, raised_at
        FROM hanumanas_agent_runs
        WHERE verdict = 'CRITICAL'
        AND raised_at > NOW() - INTERVAL '2 hours'
        ORDER BY raised_at DESC
        LIMIT 5
      `.catch(() => [])
      if (hanumanasCriticals.length > 0) {
        hanumanasStateBlock = `\n\n━━ AEGIS GOVERNANCE STATE (last 2h) ━━\n` +
          hanumanasCriticals.map((r: any) => `• ${r.agent_id}: ${(r.summary ?? '').slice(0, 100)}`).join('\n')
      }
    } catch { /* never block synthesis */ }

    const synthesisUserPrompt = `A full LOOPS cascade has completed. All 4 systems have spoken.\n\n${allContext}${hanumanasStateBlock}\n\nAs KIMMP, provide your governing synthesis: HEADLINE, CROSS-SYSTEM PATTERN, TOP 3 ACTIONS for the operator. Be specific. Plain text.`
    let kimmSynthesis = allContext
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const raw = await llmCall('claude-opus-4-8', KIMMP_GOVERN_PROMPT, synthesisUserPrompt, 900)
        if (raw) {
          kimmSynthesis = raw
          // Capture KIMMP synthesis as training example (dispatchId links to this loop)
          WaandaTrainingPipeline.captureSynthesis({
            systemPrompt: KIMMP_GOVERN_PROMPT,
            userPrompt:   synthesisUserPrompt,
            completion:   raw,
            dispatchId:   `loop-${start}`,
          })
        }
      } catch {}
    }

    const activeLoops = results.filter(r => r.loopSignal).length

    // ── DEBATE PHASE — adversarial reasoning for CRITICAL briefings ──────────
    const criticalBriefings = results.filter(r => r.priority === 'CRITICAL')
    if (criticalBriefings.length > 0) {
      try {
        const debate = await runDebatePhase(criticalBriefings, kimmSynthesis)
        if (debate.debateRan && debate.arbitration) {
          kimmSynthesis = [
            kimmSynthesis,
            `\n\n━━ DEBATE PHASE ━━`,
            `BULL CASE: ${debate.bullCase}`,
            `BEAR CASE: ${debate.bearCase}`,
            `KIMMP ARBITRATION [${debate.finalVerdict}]: ${debate.arbitration}`,
          ].join('\n')
          logger.info(`[KIMMP:DEBATE] ${debate.finalVerdict} verdict incorporated (shift ${debate.confidenceShift > 0 ? '+' : ''}${debate.confidenceShift})`)
        }
      } catch { /* debate failure never blocks the loop */ }
    }

    // Auto-index KIMMP synthesis into KIMMP's own knowledge base
    SystemRAG.autoIndexBriefing({
      system:          'KIMMP',
      dispatchId:      `loop-${Date.now()}`,
      trigger:         ctx.trigger ?? 'loops.manual',
      summary:         kimmSynthesis.slice(0, 1200),
      keyFindings:     results.map(r => `${r.system}: ${r.summary.slice(0, 120)}`),
      recommendations: results.flatMap(r => r.recommendations).slice(0, 5),
    }).catch(() => {})

    await SignalLedger.record({
      sourceModule:   'kimmp.loops',
      signalType:     'LOOP_CASCADE_COMPLETED',
      signalCategory: 'SYSTEM',
      signalValue:    `LOOPS: ${LOOP_CASCADE_ORDER.join('→')} — ${activeLoops} active chains | KIMMP governing`,
      severity:       results.some(r => r.priority === 'CRITICAL') ? 'CRITICAL' : 'LOW',
      confidence:     Math.round(results.reduce((s, r) => s + r.confidence, 0) / results.length),
    }).catch(() => {})

    // Fire-and-forget: contradiction detection + cross-system RAG flow
    Promise.allSettled([
      detectContradictions(results).catch(() => {}),
      crossIndexBriefings(results, kimmSynthesis).catch(() => {}),
    ]).catch(() => {})

    logger.info(`[KIMMP:LOOPS] Complete — ${results.length} systems, ${activeLoops} loops, ${Date.now() - start}ms`)

    // AEGIS: mark this loop activation as AUTONOMOUS if scheduler-triggered
    const isAutonomous = (ctx.trigger ?? '').startsWith('schedule.')
    HanumanasLedger.logActivation({
      system:     'KIMMP',
      trigger:    ctx.trigger ?? 'loops.manual',
      actor:      ctx.userId ?? 'SCHEDULER',
      autonomous: isAutonomous,
      agentsRun:  results.flatMap(r => r.agentResults.map(a => a.agentType)),
      durationMs: Date.now() - start,
      userId:     ctx.userId,
      metadata:   {
        cascade:     LOOP_CASCADE_ORDER,
        activeLoops,
        systems:     results.map(r => ({ system: r.system, priority: r.priority, confidence: r.confidence })),
      },
    }).catch(() => {})

    return { cascadeOrder: LOOP_CASCADE_ORDER, results, kimmSynthesis, activeLoops, durationMs: Date.now() - start }
  }

  // ─── Registry status ────────────────────────────────────────────────────────

  static registryStatus() {
    return {
      totalAgents: 35,
      governedBy:  'KIMMP/WAANDA',
      systems: (['EQORE','LEAD_INTEL','ALIS','VIS','SENTINEL'] as SystemType[]).map(s => {
        const p = SYSTEM_PERSONAE[s]
        return {
          system:    s,
          name:      p.name,
          fullName:  p.fullName,
          model:     p.model,
          color:     p.color,
          purpose:   p.purpose,
          trigger:   SYSTEM_TRIGGERS[s],
          agents:    SYSTEM_AGENTS[s].length,
          agentList: SYSTEM_AGENTS[s],
        }
      }),
      layers: { intelligence: 17, operations: 6, sentinel: 12 },
      loopCascade: LOOP_CASCADE_ORDER,
      kimmModel:   'claude-opus-4-8',
    }
  }

  static async history(limit = 20): Promise<any[]> {
    return (prisma as any).kimmpSystemDispatch.findMany({
      orderBy: { createdAt: 'desc' },
      take:    limit,
      select: {
        id: true, system: true, trigger: true, summary: true,
        keyFindings: true, alerts: true, confidence: true,
        agentsRun: true, durationMs: true, createdAt: true,
        priority: true, feedback: true,
      },
    }).catch(() => [])
  }

  static async get(id: string): Promise<any | null> {
    return (prisma as any).kimmpSystemDispatch.findUnique({ where: { id } }).catch(() => null)
  }
}
