// ---------------------------------------------------------------------------
// withWaandax — drop-in WAANDAx resilience layer for any Anthropic SDK client.
//
// Platform policy (2026-07-25): Claude-first whenever it is usable, WAANDAx
// (local MLX server, WAANDAX_URL / WAANDAX_MODEL) otherwise. Wrapped clients
// try the real Claude API first; on failure the call is served locally and
// Claude is skipped for a short cooloff so a dead key/credit balance doesn't
// tax every request. Requests the local model cannot honour — streaming,
// tools, non-text content blocks — are Claude-only and never touch WAANDAx,
// as is everything else on the client (`messages.stream`, `beta`, …).
//
// Usage:   const anthropic = withWaandax(new Anthropic({ apiKey }))
// Opt-out: WAANDAX_DIRECT=off   (env kill switch, no redeploy needed)
//
// Self-contained on purpose: no imports from kimmpLLMRouter, so it can be
// used from any module without risking import cycles.
// ---------------------------------------------------------------------------

import type Anthropic from '@anthropic-ai/sdk'
import crypto from 'crypto'
import logger from '../../utils/logger'
import { logCall, scanPii, inferCallerModule } from '../../services/kimmpGatewayCore'
import { PromptRegistry } from '../wir/promptRegistry.service'

const WAANDAX_URL   = process.env.WAANDAX_URL   || 'http://127.0.0.1:11435'
const WAANDAX_MODEL = process.env.WAANDAX_MODEL || ''
const DISABLED      = process.env.WAANDAX_DIRECT === 'off'
const TIMEOUT_MS    = 30_000
// After a local WAANDAx failure, skip it for a while — kept long (60s) on
// purpose: a real local failure usually means the MLX server crashed (GPU
// OOM) and needs time to actually recover, unlike a fast-failing HTTP error.
const COOLOFF_MS    = 60_000
// After a Claude failure, serve locally instead for a short window, then
// retry Claude — matches RECOVERY_TIMEOUT_MS in kimmpLLMRouter.ts. Kept short
// (3s) because a Claude failure is one fast HTTP error, not a crashed process,
// so there's no reason to make credits-restored recovery wait a full minute.
const CLAUDE_COOLOFF_MS = 3_000
const MAX_PROMPT    = 24_000          // chars — long contexts OOM the 3B model's GPU budget

let _failedAt = 0        // last WAANDAx hard failure
let _claudeFailedAt = 0  // last Claude API failure (shared across all wrapped clients)

// The MLX server generates serially; letting the whole platform queue on it
// causes timeouts and GPU OOM crashes. Cap in-flight requests — extra callers
// wait briefly for a slot, then give up so their Claude fallback takes over.
// Busy rejections are transient, NOT engine failures: callers must not trip
// circuit breakers or cooloffs on them (check with isWaandaxBusyError).
const MAX_INFLIGHT  = 2
const SLOT_WAIT_MS  = 4_000
const BUSY_MESSAGE  = 'WAANDAx busy (concurrency guard)'
let _inflight = 0

export const isWaandaxBusyError = (err: unknown) =>
  err instanceof Error && err.message === BUSY_MESSAGE

export async function waandaxSlot<T>(fn: () => Promise<T>): Promise<T> {
  const deadline = Date.now() + SLOT_WAIT_MS
  while (_inflight >= MAX_INFLIGHT) {
    if (Date.now() > deadline) throw new Error(BUSY_MESSAGE)
    await new Promise(r => setTimeout(r, 150))
  }
  _inflight++
  try { return await fn() } finally { _inflight-- }
}

// ── request shapes the local model can honour ────────────────────────────────

function flattenContent(content: unknown): string | null {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    const parts: string[] = []
    for (const block of content) {
      if (block && typeof block === 'object' && (block as any).type === 'text') {
        parts.push(String((block as any).text ?? ''))
      } else {
        return null   // images / tool_use / tool_result → Claude only
      }
    }
    return parts.join('\n')
  }
  return null
}

function toOpenAIMessages(params: any): Array<{ role: string; content: string }> | null {
  const out: Array<{ role: string; content: string }> = []
  if (params.system !== undefined) {
    const sys = flattenContent(params.system)
    if (sys === null) return null
    out.push({ role: 'system', content: sys })
  }
  for (const m of params.messages ?? []) {
    if (m.role !== 'user' && m.role !== 'assistant') return null
    const content = flattenContent(m.content)
    if (content === null) return null
    out.push({ role: m.role, content })
  }
  return out.length ? out : null
}

// Shapes the local model can honour at all — cooloffs are handled in the flow
function localCapable(params: any): boolean {
  if (!WAANDAX_MODEL || DISABLED) return false
  if (params?.stream) return false
  if (params?.tools?.length || params?.tool_choice) return false
  return true
}

// ── local call, answered in the Anthropic Message shape ─────────────────────

async function createViaWaandax(params: any): Promise<Anthropic.Message> {
  const messages = toOpenAIMessages(params)
  if (!messages) throw new Error('request not convertible')
  const promptSize = messages.reduce((n, m) => n + m.content.length, 0)
  if (promptSize > MAX_PROMPT) throw new Error(`prompt too large for local model (${promptSize} chars)`)

  return waandaxSlot(async () => {
  const res = await fetch(`${WAANDAX_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:       WAANDAX_MODEL,
      messages,
      max_tokens:  Math.min(params.max_tokens ?? 1024, 4096),
      temperature: params.temperature ?? 0.3,
      ...(params.stop_sequences?.length ? { stop: params.stop_sequences } : {}),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`WAANDAx ${res.status}`)
  const data = await res.json() as any
  const text = String(data.choices?.[0]?.message?.content ?? '').trim()
  if (!text) throw new Error('WAANDAx empty completion')

  return {
    id:            `waandax_${crypto.randomBytes(8).toString('hex')}`,
    type:          'message',
    role:          'assistant',
    model:         WAANDAX_MODEL,
    content:       [{ type: 'text', text, citations: null }],
    stop_reason:   'end_turn',
    stop_sequence: null,
    usage: {
      input_tokens:                data.usage?.prompt_tokens ?? 0,
      output_tokens:               data.usage?.completion_tokens ?? 0,
      cache_creation_input_tokens: null,
      cache_read_input_tokens:     null,
      cache_creation:              null,
      server_tool_use:             null,
      service_tier:                null,
    },
  } as unknown as Anthropic.Message
  })
}

// ── S308 passive gateway logging ─────────────────────────────────────────────
// Covers every one of the 29 files that call withWaandax(new Anthropic(...))
// directly, PLUS AEGIS's shared callLLM() helper (kangqore-aegis/agents/llm.ts)
// which itself wraps its client the same way — ~70 files logged from this one
// instrumentation point, no per-file changes needed. AEGIS calls are skipped
// here (see actorType check below) because callLLM() logs them itself with
// accurate actorType:'AEGIS' attribution — this avoids double-counting.
// Caller module must be captured SYNCHRONOUSLY, before any await/.then() —
// once inside a promise continuation the call stack no longer reaches back
// to the original synchronous caller.
function logGatewayCall(
  params: any,
  callerInfo: { sourceModule: string; actorType: string },
  latencyMs: number,
  res: Anthropic.Message | null,
  err?: Error,
  promptMeta?: { promptName?: string; promptVersion: number | null },
) {
  if (callerInfo.actorType === 'AEGIS') return
  const systemText = flattenContent(params.system) ?? ''
  const userText = (params.messages ?? []).map((m: any) => flattenContent(m.content) ?? '').join('\n')
  const provider = res?.id?.toString().startsWith('waandax_') ? 'waandax' : 'claude'
  const model = res?.model ?? params.model ?? 'unknown'
  const textBlock = res?.content?.find((b: any) => b.type === 'text') as { text?: string } | undefined

  scanPii(systemText + '\n' + userText).then(scan => logCall({
    actorType: callerInfo.actorType,
    model, provider,
    promptTokens: (res as any)?.usage?.input_tokens ?? 0,
    completionTokens: (res as any)?.usage?.output_tokens ?? 0,
    latencyMs,
    prompt: systemText + '\n' + userText,
    response: textBlock?.text ?? '',
    sourceModule: callerInfo.sourceModule,
    promptName: promptMeta?.promptName ?? null,
    promptVersion: promptMeta?.promptVersion ?? null,
    status: err ? 'ERROR' : 'SUCCESS',
    errorMessage: err?.message ?? null,
    piiDetected: scan.detected,
    piiPatterns: scan.patterns,
  })).catch(() => {})
}

// ── the wrapper ──────────────────────────────────────────────────────────────

export function withWaandax(client: Anthropic): Anthropic {
  const hasKey = !!(client as any).apiKey

  const messagesProxy = new Proxy(client.messages, {
    get(target, prop, receiver) {
      if (prop === 'create') {
        return async (params: any, options?: any) => {
          const callerInfo = inferCallerModule()
          const start = Date.now()

          // S311 — options.promptName is a side-channel this Proxy defines
          // (not part of the Anthropic SDK's real RequestOptions); when set,
          // resolve it via PromptRegistry and use the registry content as
          // `system`, falling back to the caller-supplied `system` on a miss.
          let promptVersion: number | null = null
          if (options?.promptName) {
            const resolved = await PromptRegistry.getWithVersion(options.promptName).catch(() => null)
            if (resolved) { params = { ...params, system: resolved.content }; promptVersion = resolved.version }
          }
          const promptMeta = options?.promptName ? { promptName: options.promptName as string, promptVersion } : undefined

          const resultPromise: Promise<Anthropic.Message> = (() => {
            // Claude-only shapes (stream/tools/non-text) or local layer disabled
            if (!localCapable(params)) return target.create(params, options)

            const claudeUsable = hasKey && Date.now() - _claudeFailedAt > CLAUDE_COOLOFF_MS
            if (claudeUsable) {
              // Claude-first; WAANDAx picks the call up if Claude fails
              return target.create(params, options).catch((claudeErr: Error) => {
                _claudeFailedAt = Date.now()
                const label = (claudeErr as any)?.status ?? claudeErr.message
                logger.warn(`[WAANDAx direct] Claude failed (${label}) — serving locally for ${CLAUDE_COOLOFF_MS / 1000}s`)
                return createViaWaandax(params).catch(() => { throw claudeErr })
              })
            }

            // Claude keyless or cooling — serve locally, Claude as backup
            if (Date.now() - _failedAt < COOLOFF_MS) return target.create(params, options)
            return createViaWaandax(params).catch((err: Error) => {
              if (!isWaandaxBusyError(err)) {
                _failedAt = Date.now()
                logger.warn(`[WAANDAx direct] local serve failed (${err.message}) — falling back to Claude for ${COOLOFF_MS / 1000}s`)
              }
              return target.create(params, options)
            })
          })()

          return resultPromise.then(
            res => { logGatewayCall(params, callerInfo, Date.now() - start, res, undefined, promptMeta); return res },
            err => { logGatewayCall(params, callerInfo, Date.now() - start, null, err, promptMeta); throw err },
          )
        }
      }
      const v = Reflect.get(target, prop, receiver)
      return typeof v === 'function' ? v.bind(target) : v
    },
  })

  return new Proxy(client, {
    get(target, prop, receiver) {
      if (prop === 'messages') return messagesProxy
      const v = Reflect.get(target, prop, receiver)
      return typeof v === 'function' ? v.bind(target) : v
    },
  }) as Anthropic
}
