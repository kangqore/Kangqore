// ---------------------------------------------------------------------------
// KIMMP LLM Router — multi-provider with circuit breakers
//
// Provider chain (in priority order):
//   1. Local (Ollama) — when KIMMP_LOCAL_MODEL is set (post-graduation)
//   2. Claude (Anthropic) — primary cloud provider
//   3. OpenAI (GPT-4o) — when OPENAI_API_KEY is set
//   4. Gemini (Flash) — when GEMINI_API_KEY is set
//   5. Graceful queue — all providers exhausted; request queued for retry
//
// Circuit breaker per provider:
//   closed  → normal operation
//   open    → failed N times; skip until recovery window passes
//   half-open → testing after recovery window; single probe call
//
// Distillation:
//   Every successful Claude call is auto-captured as a training example.
//   Local model routes ALSO captured (quality 0.5) for future fine-tune comparison.
//
// Graduation path:
//   Phase 1 (now):   router captures every Claude call → corpus grows
//   Phase 2:         export JSONL, fine-tune base model (llama3.1/qwen2.5)
//   Phase 3:         set KIMMP_LOCAL_MODEL=<model-name>, router uses Ollama first
//   Phase 4:         local model autonomy ratio climbs toward 100%
//   Phase 5:         KIMMP runs without any external API key
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../../lib/prisma'
import logger from '../../utils/logger'

// ─── Config ───────────────────────────────────────────────────────────────────

const OLLAMA_BASE    = process.env.OLLAMA_BASE_URL    || 'http://localhost:11434'
const LOCAL_MODEL    = process.env.KIMMP_LOCAL_MODEL   || ''
const FALLBACK_MODEL = process.env.OLLAMA_MODEL        || 'llama3.1:8b'
const OPENAI_KEY     = process.env.OPENAI_API_KEY      || ''
const GEMINI_KEY     = process.env.GEMINI_API_KEY      || ''
const ANTHROPIC_KEY  = process.env.ANTHROPIC_API_KEY   || ''

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
const RECOVERY_TIMEOUT_MS = 60_000

const _cb: Record<string, CircuitBreaker> = {
  claude: { state: 'closed', failures: 0, lastFailureAt: 0, lastProbeAt: 0 },
  openai: { state: 'closed', failures: 0, lastFailureAt: 0, lastProbeAt: 0 },
  gemini: { state: 'closed', failures: 0, lastFailureAt: 0, lastProbeAt: 0 },
  ollama: { state: 'closed', failures: 0, lastFailureAt: 0, lastProbeAt: 0 },
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

const _counts: Record<string, number> = { claude: 0, openai: 0, gemini: 0, ollama: 0 }

// ─── Provider: Ollama (local) ─────────────────────────────────────────────────

let _ollamaOk: boolean | null = null
let _ollamaCheckedAt = 0

async function _ollamaAvailable(): Promise<boolean> {
  if (!LOCAL_MODEL) return false
  const now = Date.now()
  if (_ollamaOk !== null && now - _ollamaCheckedAt < 5 * 60_000) return _ollamaOk
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(2000) })
    _ollamaOk = res.ok
  } catch {
    _ollamaOk = false
  }
  _ollamaCheckedAt = Date.now()
  return _ollamaOk
}

async function _callOllama(system: string, user: string, maxTokens: number): Promise<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: LOCAL_MODEL || FALLBACK_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: user },
      ],
      stream: false,
      options: { num_predict: maxTokens, temperature: 0.1 },
    }),
    signal: AbortSignal.timeout(30_000),
  })
  if (!res.ok) throw new Error(`Ollama ${res.status}`)
  const data = await res.json() as any
  return String(data.message?.content ?? '')
}

// ─── Provider: Claude (Anthropic) ────────────────────────────────────────────

async function _callClaude(
  claudeModel: string,
  system: string,
  user: string,
  maxTokens: number,
  options: RouterOptions = {},
): Promise<{ text: string; toolCallCount: number }> {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: user }]
  const createParams: Anthropic.MessageCreateParamsNonStreaming = {
    model:       claudeModel,
    max_tokens:  maxTokens,
    temperature: 0.1,
    system,
    messages,
  }
  if (options.tools && options.tools.length > 0) {
    createParams.tools = options.tools
  }

  let toolCallCount = 0
  const MAX_TOOL_ITERATIONS = 5

  // Tool-use loop — Claude may call tools multiple times before producing final text
  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const res = await _anthropic.messages.create(createParams)

    // If stop_reason is 'end_turn' or there are no tool_use blocks, extract text and return
    const toolUseBlocks = res.content.filter(b => b.type === 'tool_use') as Anthropic.ToolUseBlock[]

    if (toolUseBlocks.length === 0 || res.stop_reason === 'end_turn') {
      const textBlock = res.content.find(b => b.type === 'text') as Anthropic.TextBlock | undefined
      return { text: textBlock?.text ?? '', toolCallCount }
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
  return { text: textBlock?.text ?? '', toolCallCount }
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
}

export interface RouterOptions {
  // Logic Tool support — pass tool definitions and an executor for the tool_use loop
  tools?:        Anthropic.Tool[]
  toolExecutor?: (name: string, input: any) => any
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
  }
}

export async function routedCall(
  claudeModel: string,
  system: string,
  user: string,
  maxTokens: number,
  meta: RouterMeta = {},
  options: RouterOptions = {},
): Promise<RouterResult> {
  const start = Date.now()
  let _toolCallCount = 0
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
  })

  // ── 1. Local model (Ollama) — post-graduation priority ──────────────────────
  if (await _ollamaAvailable() && cbAllow('ollama')) {
    try {
      const text = await _callOllama(system, user, maxTokens)
      _counts.ollama++
      cbSuccess('ollama')
      _capture(system, user, text, claudeModel, 'ollama', meta).catch(() => {})
      return {
        content: [{ type: 'text', text }],
        model: LOCAL_MODEL,
        _routerMeta: makeMeta('ollama', LOCAL_MODEL, false),
      }
    } catch (err) {
      cbFailure('ollama')
      logger.warn('[KIMMP Router] Ollama failed, trying next provider:', (err as Error).message)
    }
  }

  // ── 2. Claude (Anthropic) — primary cloud ───────────────────────────────────
  if (ANTHROPIC_KEY && cbAllow('claude')) {
    try {
      const { text, toolCallCount } = await _callClaude(claudeModel, system, user, maxTokens, options)
      _toolCallCount = toolCallCount
      _counts.claude++
      cbSuccess('claude')
      _capture(system, user, text, claudeModel, 'claude', meta).catch(() => {})
      return {
        content: [{ type: 'text', text }],
        model: claudeModel,
        _routerMeta: makeMeta('claude', claudeModel, false),
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

  // ── 5. All providers exhausted — return empty so callers fall back to cache/queue
  logger.error('[KIMMP Router] All providers failed or circuit-open — returning empty')
  return {
    content: [{ type: 'text', text: '' }],
    model: 'none',
    _routerMeta: makeMeta('none', 'none', true),
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

// Convenience: call with the full Logic Tool Registry pre-loaded + AEGIS auditing
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
      name === 'claude'  && !!ANTHROPIC_KEY,
      name === 'openai'  && !!OPENAI_KEY,
      name === 'gemini'  && !!GEMINI_KEY,
      name === 'ollama'  && !!LOCAL_MODEL,
    ].some(Boolean),
  }))

  return {
    callsTotal:        total,
    callsClaude:       _counts.claude,
    callsOpenAI:       _counts.openai,
    callsGemini:       _counts.gemini,
    callsLocal:        _counts.ollama,
    autonomyRatio:     total > 0 ? _counts.ollama / total : 0,
    providers,
    ollamaAvailable:   _ollamaOk ?? false,
    localModel:        LOCAL_MODEL || null,
    distillationCount,
    totalCorpus,
    distillationCap:   DISTILLATION_CAP,
    circuitBreakers:   getCircuitBreakerStatus(),
    phase: LOCAL_MODEL ? 'routing' : distillationCount > 500 ? 'pre-graduation' : 'distilling',
    activeProviders: [
      ANTHROPIC_KEY && 'claude',
      OPENAI_KEY    && 'openai',
      GEMINI_KEY    && 'gemini',
      LOCAL_MODEL   && 'ollama',
    ].filter(Boolean),
  }
}
