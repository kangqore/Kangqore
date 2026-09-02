// ---------------------------------------------------------------------------
// KIMMP LLM Router — multi-provider with circuit breakers
//
// Provider chain (Mainstream Foundation LLM Providers):
//   1. Krisnam — Mainstream Enterprise Foundation LLM Engine (Krisnam-3B / Gen5)
//   2. Claude (Anthropic) — Cloud Foundation LLM Provider (Opus, Sonnet, Haiku)
//   3. OpenAI (GPT-4o) — Cloud Foundation LLM Provider
//   4. Gemini (Google) — Cloud Foundation LLM Provider (Flash)
//   5. Graceful queue — all providers exhausted; request queued for retry
//
// Circuit breaker per provider:
//   closed  → normal operation
//   open    → failed N times; skip until recovery window passes
//   half-open → testing after recovery window; single probe call
//
// Autonomy & Independence:
//   Krisnam operates as a standalone mainstream foundation model.
//   It handles reasoning, classification, summarization, and action proposals
//   interchangeably with Claude, GPT-4o, and Gemini.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../../../lib/prisma'
import logger from '../../../utils/logger'
import { krisnamSlot, isKrisnamBusyError } from './krisnamAnthropic'
import { logCall, scanPii } from '../gateway/KimmpGatewayCore'
import { PromptRegistry } from '../wir/promptRegistry.service'

// ─── Config ───────────────────────────────────────────────────────────────────

const KRISNAM_URL   = process.env.KRISNAM_URL         || 'http://127.0.0.1:11435'
const KRISNAM_MODEL = process.env.KRISNAM_MODEL        || 'krisnam-3b'
const KRISNAM_PRIMARY = process.env.KRISNAM_PRIMARY !== 'false' // Krisnam as primary LLM engine
const OPENAI_KEY    = process.env.OPENAI_API_KEY       || ''
const GEMINI_KEY    = process.env.GEMINI_API_KEY       || ''
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY    || ''

const _anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY })

// ─── Circuit Breaker ──────────────────────────────────────────────────────────

// Internal circuit-breaker mechanical states
type CBMechState = 'closed' | 'open' | 'half-open'

// External 5-state model exposed to Mission Control / WAANDA Runtime
export type ProviderHealth = 'healthy' | 'degraded' | 'recovering' | 'offline' | 'maintenance' | 'warming'

interface CircuitBreaker {
  state:          CBMechState
  failures:       number
  lastFailureAt:  number
  lastProbeAt:    number
}

const FAILURE_THRESHOLD   = 3
// How long a provider stays "open" (blocked) after tripping the breaker before
// one real probe call is allowed through. 3s, not the old 60s: each probe is a
// single HTTP call that fails fast (auth/network errors return in well under
// a second), and cbAllow's half-open gate means at most ONE real attempt fires
// platform-wide per cycle regardless of traffic — so a short window costs
// nothing when the provider is still down, and gets it back online almost
// immediately once it's not (e.g. Claude credits topped up).
const RECOVERY_TIMEOUT_MS = 3_000

const _cb: Record<string, CircuitBreaker> = {
  claude:   { state: 'closed', failures: 0, lastFailureAt: 0, lastProbeAt: 0 },
  openai:   { state: 'closed', failures: 0, lastFailureAt: 0, lastProbeAt: 0 },
  gemini:   { state: 'closed', failures: 0, lastFailureAt: 0, lastProbeAt: 0 },
  krisnam:  { state: 'closed', failures: 0, lastFailureAt: 0, lastProbeAt: 0 },
  gen2:     { state: 'closed', failures: 0, lastFailureAt: 0, lastProbeAt: 0 },
}

// Providers in manual maintenance mode (skip entirely)
const _maintenance = new Set<string>()

// Providers in warming mode — receive only low traffic + health probes.
// Transition: offline → warming → healthy
// Warming ends when the provider passes WARMING_PROBES_REQUIRED consecutive probes.
const _warming     = new Map<string, { probesPassed: number; startedAt: number }>()
const WARMING_PROBES_REQUIRED = 3

export function setProviderMaintenance(provider: string, on: boolean) {
  on ? _maintenance.add(provider) : _maintenance.delete(provider)
  logger.info(`[WAANDA Runtime] ${provider} maintenance=${on}`)
}

export function setProviderWarming(provider: string, on: boolean) {
  if (on) {
    _warming.set(provider, { probesPassed: 0, startedAt: Date.now() })
    logger.info(`[WAANDA Runtime] ${provider} entering warming mode`)
  } else {
    _warming.delete(provider)
    logger.info(`[WAANDA Runtime] ${provider} exited warming mode`)
  }
}

export function recordWarmingProbe(provider: string, passed: boolean) {
  const w = _warming.get(provider)
  if (!w) return
  if (passed) {
    w.probesPassed++
    if (w.probesPassed >= WARMING_PROBES_REQUIRED) {
      _warming.delete(provider)
      logger.info(`[WAANDA Runtime] ${provider} warming complete — now healthy`)
    }
  } else {
    w.probesPassed = Math.max(0, w.probesPassed - 1)
  }
}

// Map internal CB state + failures to the 6-state health model
export function providerHealth(provider: string): ProviderHealth {
  if (_maintenance.has(provider)) return 'maintenance'
  if (_warming.has(provider))     return 'warming'
  const cb = _cb[provider]
  if (!cb) return 'offline'
  if (cb.state === 'open')      return 'offline'
  if (cb.state === 'half-open') return 'recovering'
  // closed — healthy vs degraded depends on recent failures
  return cb.failures > 0 ? 'degraded' : 'healthy'
}

function cbAllow(provider: string): boolean {
  if (_maintenance.has(provider)) return false
  const cb = _cb[provider]
  if (!cb || cb.state === 'closed') return true
  if (cb.state === 'half-open') return false
  if (Date.now() - cb.lastFailureAt >= RECOVERY_TIMEOUT_MS) {
    cb.state = 'half-open'
    cb.lastProbeAt = Date.now()
    logger.info(`[WAANDA Runtime] ${provider} → recovering (probing)`)
    return true
  }
  return false
}

function cbSuccess(provider: string) {
  const cb = _cb[provider]
  if (!cb) return
  if (cb.state !== 'closed') logger.info(`[WAANDA Runtime] ${provider} → healthy`)
  cb.state    = 'closed'
  cb.failures = 0
}

function cbFailure(provider: string) {
  const cb = _cb[provider]
  if (!cb) return
  cb.failures++
  cb.lastFailureAt = Date.now()
  if (cb.failures >= FAILURE_THRESHOLD || cb.state === 'half-open') {
    if (cb.state !== 'open') logger.warn(`[WAANDA Runtime] ${provider} → offline (${cb.failures} failures)`)
    cb.state = 'open'
  } else {
    logger.warn(`[WAANDA Runtime] ${provider} → degraded (${cb.failures}/${FAILURE_THRESHOLD} failures)`)
  }
}

// ─── In-memory call counters ──────────────────────────────────────────────────

const _counts: Record<string, number> = { claude: 0, openai: 0, gemini: 0, krisnam: 0, gen2: 0 }

// Ground truth for "who answered the last call" — the HUD's LLM ENGINE panel
// must show this, NOT a guess derived from circuit-breaker health. Breaker
// state includes a transient 'half-open' probe (reported as 'recovering')
// that looks "not offline" while the probe call is still in flight and may
// yet fail — guessing from health alone mislabels that window as serving.
let _lastServedBy: string | null = null
let _lastServedAt = 0
function markServed(provider: string) { _lastServedBy = provider; _lastServedAt = Date.now() }

// Cached deployed Gen2 model — refreshed every 5 minutes
let _gen2ModelId: string | null = null
let _gen2CheckedAt = 0

async function _getDeployedGen2(): Promise<string | null> {
  const now = Date.now()
  if (_gen2ModelId !== null && now - _gen2CheckedAt < 5 * 60_000) return _gen2ModelId
  try {
    const m = await (prisma as any).gen2Model.findFirst({ where: { isDeployed: true }, select: { providerModelId: true } })
    _gen2ModelId = m?.providerModelId ?? null
  } catch {
    _gen2ModelId = null
  }
  _gen2CheckedAt = now
  return _gen2ModelId
}

// Cached A/B traffic split — refreshed every 2 minutes
let _gen2TrafficPct = 0
let _trafficPctCheckedAt = 0

async function _getGen2TrafficPct(): Promise<number> {
  const now = Date.now()
  if (now - _trafficPctCheckedAt < 2 * 60_000) return _gen2TrafficPct
  try {
    const cfg = await (prisma as any).autonomyConfig.findFirst({ orderBy: { createdAt: 'desc' }, select: { gen2TrafficPct: true } })
    _gen2TrafficPct = cfg?.gen2TrafficPct ?? 0
  } catch {
    _gen2TrafficPct = 0
  }
  _trafficPctCheckedAt = now
  return _gen2TrafficPct
}

// ─── Provider: Krisnam (local MLX-LM — OpenAI-compatible) ────────────────────

let _krisnamOk: boolean | null = null
let _krisnamCheckedAt = 0

async function _krisnamAvailable(): Promise<boolean> {
  if (!KRISNAM_MODEL) return false
  const now = Date.now()
  if (_krisnamOk !== null && now - _krisnamCheckedAt < 5 * 60_000) return _krisnamOk
  try {
    const res = await fetch(`${KRISNAM_URL}/v1/models`, { signal: AbortSignal.timeout(2000) })
    _krisnamOk = res.ok
  } catch {
    _krisnamOk = false
  }
  _krisnamCheckedAt = Date.now()
  return _krisnamOk
}

async function _callKrisnam(system: string, user: string, maxTokens: number): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  return krisnamSlot(async () => {
  const res = await fetch(`${KRISNAM_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:       KRISNAM_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: user },
      ],
      max_tokens:  maxTokens,
      temperature: 0.1,
    }),
    signal: AbortSignal.timeout(30_000),
  })
  if (!res.ok) throw new Error(`Krisnam ${res.status}`)
  const data = await res.json() as any
  return {
    text: String(data.choices?.[0]?.message?.content ?? ''),
    inputTokens: data.usage?.prompt_tokens ?? 0,
    outputTokens: data.usage?.completion_tokens ?? 0,
  }
  })
}

// ─── Provider: Claude (Anthropic) ────────────────────────────────────────────

function sanitizeSystemPrompt(prompt: string): string {
  if (!prompt || typeof prompt !== 'string') return ''
  return String(prompt).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim()
}

async function _callClaude(
  claudeModel: string,
  system: string,
  user: string,
  maxTokens: number,
  options: RouterOptions = {},
): Promise<{ text: string; toolCallCount: number; inputTokens: number; outputTokens: number; toolCalls: ToolCallRecord[] }> {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: user }]
  const cleanSystem = sanitizeSystemPrompt(system)
  const createParams: Anthropic.MessageCreateParamsNonStreaming = {
    model:       claudeModel,
    max_tokens:  maxTokens,
    temperature: 0.1,
    system:      cleanSystem,
    messages,
  }
  if (options.tools && options.tools.length > 0) {
    createParams.tools = options.tools
  }

  let toolCallCount = 0
  let inputTokens = 0
  let outputTokens = 0
  // S315 — every tool call's name/input/result, regardless of which registry
  // served it. The router doesn't know or care whether a tool is a Logic
  // Tool calculator or an OntologyAction — the caller's combined toolExecutor
  // (see commandService.ts) handles that. routedCall()'s logging wrapper
  // reads this back to populate LlmCallLog.referencedObjectIds/toolExecutionIds.
  const toolCalls: ToolCallRecord[] = []
  const MAX_TOOL_ITERATIONS = 5

  // Tool-use loop — Claude may call tools multiple times before producing final text
  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const res = await _anthropic.messages.create(createParams)
    inputTokens += res.usage?.input_tokens ?? 0
    outputTokens += res.usage?.output_tokens ?? 0

    // If stop_reason is 'end_turn' or there are no tool_use blocks, extract text and return
    const toolUseBlocks = res.content.filter(b => b.type === 'tool_use') as Anthropic.ToolUseBlock[]

    if (toolUseBlocks.length === 0 || res.stop_reason === 'end_turn') {
      const textBlock = res.content.find(b => b.type === 'text') as Anthropic.TextBlock | undefined
      return { text: textBlock?.text ?? '', toolCallCount, inputTokens, outputTokens, toolCalls }
    }

    // Execute each tool call
    toolCallCount += toolUseBlocks.length
    const toolResults: Anthropic.ToolResultBlockParam[] = []

    for (const block of toolUseBlocks) {
      let resultContent: string
      if (options.toolExecutor) {
        try {
          const result = await options.toolExecutor(block.name, block.input)
          resultContent = typeof result === 'string' ? result : JSON.stringify(result)
        } catch (err) {
          resultContent = JSON.stringify({ error: (err as Error).message })
        }
      } else {
        resultContent = JSON.stringify({ error: 'No tool executor provided' })
      }
      toolCalls.push({ name: block.name, input: block.input, result: resultContent })
      toolResults.push({
        type:        'tool_result',
        tool_use_id: block.id,
        content:     resultContent,
      })
    }

    // Append assistant turn + tool results and continue the loop
    messages.push({ role: 'assistant', content: res.content })
    messages.push({ role: 'user',      content: toolResults })
    createParams.messages = messages
  }

  // Max iterations reached — return whatever text we have
  let lastMsg: Anthropic.MessageParam | undefined
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'assistant') { lastMsg = messages[i]; break }
  }
  const textBlock = Array.isArray(lastMsg?.content)
    ? (lastMsg!.content as Anthropic.ContentBlock[]).find(b => b.type === 'text') as Anthropic.TextBlock | undefined
    : undefined
  return { text: textBlock?.text ?? '', toolCallCount, inputTokens, outputTokens, toolCalls }
}

// ─── Provider: OpenAI (GPT-4o) ───────────────────────────────────────────────

async function _callOpenAI(system: string, user: string, maxTokens: number): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: user },
      ],
      max_tokens: maxTokens,
      temperature: 0.1,
    }),
    signal: AbortSignal.timeout(30_000),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`OpenAI ${res.status}: ${body.slice(0, 200)}`)
  }
  const data = await res.json() as any
  return String(data.choices?.[0]?.message?.content ?? '')
}

// ─── Provider: Gemini (Flash) ─────────────────────────────────────────────────

async function _callGemini(system: string, user: string, maxTokens: number): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.1 },
    }),
    signal: AbortSignal.timeout(30_000),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Gemini ${res.status}: ${body.slice(0, 200)}`)
  }
  const data = await res.json() as any
  return String(data.candidates?.[0]?.content?.parts?.[0]?.text ?? '')
}

// ─── Distillation capture (fire-and-forget) ───────────────────────────────────

const DISTILLATION_CAP = 10_000

async function _capture(
  system: string,
  user: string,
  response: string,
  claudeModel: string,
  provider: string,
  meta: { agentType?: string; agentSystem?: string; tags?: string[] },
): Promise<void> {
  try {
    if (system.length < 40 || user.length < 20 || response.length < 20) return
    const cap = await (prisma as any).kimmpLearningExample
      .count({ where: { source: 'distillation' } })
      .catch(() => DISTILLATION_CAP + 1)
    if (cap >= DISTILLATION_CAP) return
    const key = system.slice(0, 150) + '||' + user.slice(0, 150)
    const sourceId = `dist-${Buffer.from(key).toString('hex').slice(0, 40)}`
    const exists = await (prisma as any).kimmpLearningExample
      .findFirst({ where: { source: 'distillation', sourceId }, select: { id: true } })
      .catch(() => null)
    if (exists) return
    await (prisma as any).kimmpLearningExample.create({
      data: {
        source:        'distillation',
        sourceId,
        systemPrompt:  system.slice(0, 5000),
        userMessage:   user.slice(0, 3000),
        idealResponse: response.slice(0, 5000),
        quality:       provider === 'claude' ? 0.6 : 0.5,
        approved:      false,
        agentSystem:   meta.agentSystem,
        agentType:     meta.agentType,
        tags:          [...(meta.tags ?? []), `model:${claudeModel}`, `provider:${provider}`],
      },
    })
  } catch {
    // Never break inference for a capture failure
  }
}

// ─── The Router ───────────────────────────────────────────────────────────────

export interface RouterMeta {
  agentType?:   string
  agentSystem?: string
  tags?:        string[]
  hint?:        string   // callerHint for Runtime Intelligence telemetry
  // S311 — when set, the passive routedCall() wrapper resolves this via
  // PromptRegistry and uses the registry content as the system prompt
  // instead of the caller-supplied `system` string. If the registry lookup
  // misses (no active version yet), the caller-supplied `system` is used as
  // the fallback, so passing promptName is always safe to add incrementally.
  promptName?:  string
}

export interface RouterOptions {
  // Logic Tool support — pass tool definitions and an executor for the tool_use loop
  tools?:        Anthropic.Tool[]
  toolExecutor?: (name: string, input: any) => any
  // Persona-critical calls: skip the Gen2/Krisnam local slots and go straight to Claude
  preferClaude?: boolean
  // S308 — set by kimmpGateway.complete(), which already logs this call itself
  // with richer explicit metadata; prevents the passive routedCall() wrapper
  // below from double-logging the same call.
  skipGatewayLog?: boolean
}

// S315 — one entry per tool call made during the request, whichever registry
// (Logic Tools, OntologyActionToolRegistry, or any future one) served it.
export interface ToolCallRecord {
  name:   string
  input:  any
  result: string
}

export interface RouterResult {
  content: Array<{ type: 'text'; text: string }>
  model:   string
  _routerMeta: {
    durationMs:    number
    provider:      string
    usedProvider:  string   // alias of provider (used by Runtime Intelligence)
    usedModel:     string   // exact model ID that responded
    fallback:      boolean  // true if primary (claude) was bypassed
    cbStates:      Record<string, ProviderHealth>
    inputTokens?:  number
    outputTokens?: number
    toolCallCount?: number  // number of logic tool calls made in this request
    toolCalls?:    ToolCallRecord[]
  }
}

async function _routedCallImpl(
  claudeModel: string,
  system: string,
  user: string,
  maxTokens: number,
  meta: RouterMeta = {},
  options: RouterOptions = {},
): Promise<RouterResult> {
  const start = Date.now()
  let _toolCallCount = 0
  let _toolCalls: ToolCallRecord[] = []
  const makeMeta = (provider: string, model: string, fallback: boolean, inputTokens?: number, outputTokens?: number) => ({
    durationMs:    Date.now() - start,
    provider,
    usedProvider:  provider,
    usedModel:     model,
    fallback,
    cbStates:      Object.fromEntries(Object.keys(_cb).map(k => [k, providerHealth(k)])),
    inputTokens,
    outputTokens,
    toolCallCount: _toolCallCount,
    toolCalls:     _toolCalls,
  })

  // ── 0. Gen2 fine-tuned model — A/B traffic split (AutonomyConfig.gen2TrafficPct) ─
  // Gen2 is LOCAL_MLX — always call _callKrisnam() (port 11435), never _callClaude().
  // No ANTHROPIC_KEY dependency: Gen2 must route even when Claude credits are exhausted.
  const gen2ModelId   = options.preferClaude ? null : await _getDeployedGen2()
  const gen2TrafficPct = await _getGen2TrafficPct()
  const routeToGen2   = gen2ModelId && !options.tools?.length && await _krisnamAvailable() && cbAllow('gen2') && (Math.random() * 100 < gen2TrafficPct)
  if (routeToGen2 && gen2ModelId) {
    try {
      const { text, inputTokens, outputTokens } = await _callKrisnam(system, user, maxTokens)
      _counts.gen2++
      markServed('gen2')
      cbSuccess('gen2')
      _capture(system, user, text, gen2ModelId, 'gen2', meta).catch(() => {})
      return {
        content: [{ type: 'text', text }],
        model: gen2ModelId,
        _routerMeta: makeMeta('gen2', gen2ModelId, false, inputTokens, outputTokens),
      }
    } catch (err) {
      cbFailure('gen2')
      logger.warn('[KIMMP Router] Gen2 failed, falling back to Claude:', (err as Error).message)
    }
  }

  // ── 1. Krisnam (Local Enterprise LLM Engine) — Primary Provider
  // Krisnam acts as the native system LLM, replacing Claude, ChatGPT, and Gemini.
  // When KRISNAM_PRIMARY is enabled or external keys are absent, Krisnam responds first.
  const krisnamIsPrimary = KRISNAM_PRIMARY || !ANTHROPIC_KEY
  const claudeUsable = !!ANTHROPIC_KEY && cbAllow('claude') && !krisnamIsPrimary

  if (krisnamIsPrimary && !options.tools?.length && await _krisnamAvailable() && cbAllow('krisnam')) {
    try {
      const { text, inputTokens, outputTokens } = await _callKrisnam(system, user, maxTokens)
      _counts.krisnam++
      markServed('krisnam')
      cbSuccess('krisnam')
      _capture(system, user, text, KRISNAM_MODEL, 'krisnam', meta).catch(() => {})
      return {
        content: [{ type: 'text', text }],
        model: KRISNAM_MODEL,
        _routerMeta: makeMeta('krisnam', KRISNAM_MODEL, false, inputTokens, outputTokens),
      }
    } catch (err) {
      if (isKrisnamBusyError(err)) {
        logger.debug('[KIMMP Router] Krisnam slots full — passing to fallback provider (no CB penalty)')
      } else {
        cbFailure('krisnam')
        logger.warn('[KIMMP Router] Krisnam failed, trying cloud fallback:', (err as Error).message)
      }
    }
  }

  // ── 2. Claude (Anthropic) — primary cloud ───────────────────────────────────
  // Reuses the SAME cbAllow('claude') result cached in claudeUsable above —
  // do not call cbAllow('claude') again here (see note above).
  if (claudeUsable) {
    try {
      const { text, toolCallCount, inputTokens, outputTokens, toolCalls } = await _callClaude(claudeModel, system, user, maxTokens, options)
      _toolCallCount = toolCallCount
      _toolCalls = toolCalls
      _counts.claude++
      markServed('claude')
      cbSuccess('claude')
      _capture(system, user, text, claudeModel, 'claude', meta).catch(() => {})
      return {
        content: [{ type: 'text', text }],
        model: claudeModel,
        _routerMeta: makeMeta('claude', claudeModel, false, inputTokens, outputTokens),
      }
    } catch (err) {
      cbFailure('claude')
      logger.warn('[KIMMP Router] Claude failed, trying OpenAI:', (err as Error).message)
    }
  }

  // ── 3. OpenAI (GPT-4o) — first fallback ─────────────────────────────────────
  if (OPENAI_KEY && cbAllow('openai')) {
    try {
      const text = await _callOpenAI(system, user, maxTokens)
      _counts.openai++
      markServed('openai')
      cbSuccess('openai')
      _capture(system, user, text, claudeModel, 'openai', meta).catch(() => {})
      logger.info('[KIMMP Router] Routed to OpenAI (fallback)')
      return {
        content: [{ type: 'text', text }],
        model: 'gpt-4o',
        _routerMeta: makeMeta('openai', 'gpt-4o', true),
      }
    } catch (err) {
      cbFailure('openai')
      logger.warn('[KIMMP Router] OpenAI failed, trying Gemini:', (err as Error).message)
    }
  }

  // ── 4. Gemini (Flash) — second fallback ─────────────────────────────────────
  if (GEMINI_KEY && cbAllow('gemini')) {
    try {
      const text = await _callGemini(system, user, maxTokens)
      _counts.gemini++
      markServed('gemini')
      cbSuccess('gemini')
      _capture(system, user, text, claudeModel, 'gemini', meta).catch(() => {})
      logger.info('[KIMMP Router] Routed to Gemini (fallback)')
      return {
        content: [{ type: 'text', text }],
        model: 'gemini-1.5-flash',
        _routerMeta: makeMeta('gemini', 'gemini-1.5-flash', true),
      }
    } catch (err) {
      cbFailure('gemini')
      logger.warn('[KIMMP Router] Gemini failed:', (err as Error).message)
    }
  }

  // ── 4.5 cloud providers exhausted — Krisnam as the universal last resort.
  // preferClaude and tool-carrying calls both skipped the local slot up front;
  // they land here when the cloud chain fails. Tool calls are served WITHOUT
  // their Logic Tools (the local model has no tool_use) — a degraded answer
  // beats returning empty. Callers can detect this via _routerMeta.fallback.
  if (await _krisnamAvailable() && cbAllow('krisnam')) {
    try {
      const { text, inputTokens, outputTokens } = await _callKrisnam(system, user, maxTokens)
      _counts.krisnam++
      markServed('krisnam')
      cbSuccess('krisnam')
      _capture(system, user, text, claudeModel, 'krisnam', meta).catch(() => {})
      if (options.tools?.length) {
        logger.warn('[KIMMP Router] cloud exhausted — Krisnam served WITHOUT Logic Tools (tool execution unavailable)')
      } else {
        logger.info('[KIMMP Router] cloud exhausted — served by Krisnam last resort')
      }
      return {
        content: [{ type: 'text', text }],
        model: KRISNAM_MODEL,
        _routerMeta: makeMeta('krisnam', KRISNAM_MODEL, true, inputTokens, outputTokens),
      }
    } catch (err) {
      if (isKrisnamBusyError(err)) {
        logger.debug('[KIMMP Router] Krisnam last-resort slots full (no CB penalty)')
      } else {
        cbFailure('krisnam')
        logger.warn('[KIMMP Router] Krisnam last-resort failed:', (err as Error).message)
      }
    }
  }

  // ── 5. All providers exhausted — return empty so callers fall back to cache/queue
  logger.error('[KIMMP Router] All providers failed or circuit-open — returning empty')
  return {
    content: [{ type: 'text', text: '' }],
    model: 'none',
    _routerMeta: makeMeta('none', 'none', true),
  }
}

// S308 — passive gateway instrumentation. Every one of the ~31 files that
// call haiku/sonnet/opus/routedCall gets logged here automatically, with
// whatever RouterMeta they already pass (agentType/agentSystem/tags) used
// for attribution — no changes needed in any of those 31 files. PII scanning
// here always runs in AUDIT mode only (see kimmpGatewayCore.scanPii) since
// this wrapper can't assume every existing caller tolerates a newly-thrown
// error. Skipped entirely when kimmpGateway.complete() already logged the
// call itself with richer, explicit metadata (options.skipGatewayLog).
export async function routedCall(
  claudeModel: string,
  system: string,
  user: string,
  maxTokens: number,
  meta: RouterMeta = {},
  options: RouterOptions = {},
): Promise<RouterResult> {
  // S311 — resolve a registry-backed system prompt when the caller opted in
  // via meta.promptName. Falls back to the caller-supplied `system` string
  // on any miss (no active version seeded yet, DB unavailable, etc.) — safe
  // to add to a call site without a coordinated registry-seeding step first.
  let resolvedSystem = system
  let promptVersion: number | null = null
  if (meta.promptName) {
    const resolved = await PromptRegistry.getWithVersion(meta.promptName).catch(() => null)
    if (resolved) { resolvedSystem = resolved.content; promptVersion = resolved.version }
  }

  if (options.skipGatewayLog) return _routedCallImpl(claudeModel, resolvedSystem, user, maxTokens, meta, options)

  try {
    const result = await _routedCallImpl(claudeModel, resolvedSystem, user, maxTokens, meta, options)
    // S315 — surface any tool-invoked OntologyAction on the log row. A tool
    // call's result is only ever the JSON OntologyActionToolRegistry.executor
    // returns ({executionId,...}) — Logic Tools return plain calculator
    // output, so JSON.parse failing/missing executionId just means "not an
    // ontology action," not an error.
    const toolCalls = result._routerMeta.toolCalls ?? []
    const referencedObjectIds = toolCalls.map(tc => tc.input?.objectId).filter((v): v is string => !!v)
    const toolExecutionIds = toolCalls
      .map(tc => { try { return JSON.parse(tc.result)?.executionId as string | undefined } catch { return undefined } })
      .filter((v): v is string => !!v)
    scanPii(resolvedSystem + '\n' + user).then((scan: any) => logCall({
      actorType:     'KIMMP',
      model:         result._routerMeta.usedModel,
      provider:      result._routerMeta.provider,
      promptTokens:  result._routerMeta.inputTokens,
      completionTokens: result._routerMeta.outputTokens,
      latencyMs:     result._routerMeta.durationMs,
      prompt:        resolvedSystem + '\n' + user,
      response:      result.content[0]?.text ?? '',
      referencedObjectIds,
      toolExecutionIds,
      taskType:      meta.tags?.[0],
      agentRole:     meta.agentType,
      sourceModule:  meta.agentSystem ?? meta.agentType ?? 'kimmpLLMRouter',
      promptName:    meta.promptName,
      promptVersion,
      status:        'SUCCESS',
      piiDetected:   scan.detected,
      piiPatterns:   scan.patterns,
    })).catch(() => {})
    return result
  } catch (err) {
    logCall({
      actorType: 'KIMMP', model: claudeModel, provider: 'none',
      prompt: resolvedSystem + '\n' + user, response: '',
      taskType: meta.tags?.[0], agentRole: meta.agentType,
      sourceModule: meta.agentSystem ?? meta.agentType ?? 'kimmpLLMRouter',
      promptName: meta.promptName, promptVersion,
      status: 'ERROR', errorMessage: (err as Error).message,
    }).catch(() => {})
    throw err
  }
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

export function haiku(system: string, user: string, maxTokens = 500, meta: RouterMeta = {}, options: RouterOptions = {}) {
  return routedCall('claude-haiku-4-5-20251001', system, user, maxTokens, meta, options)
}

export function sonnet(system: string, user: string, maxTokens = 900, meta: RouterMeta = {}, options: RouterOptions = {}) {
  return routedCall('claude-sonnet-4-6', system, user, maxTokens, meta, options)
}

export function opus(system: string, user: string, maxTokens = 1200, meta: RouterMeta = {}, options: RouterOptions = {}) {
  return routedCall('claude-opus-4-8', system, user, maxTokens, meta, options)
}

// Convenience: call with the full Logic Tool Registry pre-loaded + HANUMANAS auditing
export function sonnetWithTools(
  system: string,
  user: string,
  maxTokens = 1200,
  domain: import('../tools/logicToolRegistry').ToolDomain = 'all',
  meta: RouterMeta = {},
) {
  const { LogicToolRegistry } = require('../tools/logicToolRegistry')
  return routedCall('claude-sonnet-4-6', system, user, maxTokens, meta, {
    tools:        LogicToolRegistry.getTools(domain),
    toolExecutor: (name: string, input: any) => LogicToolRegistry.auditedExecutor(name, input),
  })
}

export function opusWithTools(
  system: string,
  user: string,
  maxTokens = 2000,
  domain: import('../tools/logicToolRegistry').ToolDomain = 'all',
  meta: RouterMeta = {},
) {
  const { LogicToolRegistry } = require('../tools/logicToolRegistry')
  return routedCall('claude-opus-4-8', system, user, maxTokens, meta, {
    tools:        LogicToolRegistry.getTools(domain),
    toolExecutor: (name: string, input: any) => LogicToolRegistry.auditedExecutor(name, input),
  })
}

export const textOf = (res: RouterResult | { content: Array<{ type: string; text?: string }> }) =>
  res.content[0]?.type === 'text' ? (res.content[0] as any).text ?? '' : ''

// ─── Circuit breaker status ───────────────────────────────────────────────────

export function getCircuitBreakerStatus() {
  return Object.fromEntries(
    Object.entries(_cb).map(([provider, cb]) => [
      provider,
      {
        health:        providerHealth(provider),
        failures:      cb.failures,
        maintenance:   _maintenance.has(provider),
        recoveryInMs:  cb.state === 'open'
          ? Math.max(0, RECOVERY_TIMEOUT_MS - (Date.now() - cb.lastFailureAt))
          : 0,
      },
    ])
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getRouterStats() {
  const total = Object.values(_counts).reduce((a, b) => a + b, 0)
  const [distillationCount, totalCorpus] = await Promise.all([
    (prisma as any).kimmpLearningExample.count({ where: { source: 'distillation' } }).catch(() => 0),
    (prisma as any).kimmpLearningExample.count().catch(() => 0),
  ])

  const providers = Object.entries(_counts).map(([name, calls]) => ({
    name,
    calls,
    ratio:     total > 0 ? calls / total : 0,
    health:    providerHealth(name),
    available: [
      name === 'gen2'    && !!_gen2ModelId,
      name === 'claude'  && !!ANTHROPIC_KEY,
      name === 'openai'  && !!OPENAI_KEY,
      name === 'gemini'  && !!GEMINI_KEY,
      name === 'krisnam' && !!KRISNAM_MODEL,
    ].some(Boolean),
  }))

  return {
    callsTotal:        total,
    callsClaude:       _counts.claude,
    callsOpenAI:       _counts.openai,
    callsGemini:       _counts.gemini,
    callsKrisnam:      _counts.krisnam,
    callsGen2:         _counts.gen2,
    lastServedBy:      _lastServedBy,
    lastServedAgoMs:   _lastServedBy ? Date.now() - _lastServedAt : null,
    autonomyRatio:     total > 0 ? (_counts.krisnam + _counts.gen2) / total : 0,
    gen2Ratio:         total > 0 ? _counts.gen2 / total : 0,
    providers,
    krisnamAvailable:  _krisnamOk ?? false,
    krisnamModel:      KRISNAM_MODEL || null,
    krisnamUrl:        KRISNAM_URL,
    deployedGen2Model: _gen2ModelId,
    distillationCount,
    totalCorpus,
    distillationCap:   DISTILLATION_CAP,
    circuitBreakers:   getCircuitBreakerStatus(),
    phase: KRISNAM_MODEL ? 'routing' : distillationCount > 500 ? 'pre-graduation' : 'distilling',
    activeProviders: [
      _gen2ModelId   && 'gen2',
      ANTHROPIC_KEY  && 'claude',
      OPENAI_KEY     && 'openai',
      GEMINI_KEY     && 'gemini',
      KRISNAM_MODEL  && 'krisnam',
    ].filter(Boolean),
  }
}
