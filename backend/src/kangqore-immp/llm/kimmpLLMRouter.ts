// ---------------------------------------------------------------------------
// KIMMP LLM Router — the abstraction that eliminates Claude dependency over time.
//
// Every inference call flows through here. Two things happen simultaneously:
//
//   1. DISTILLATION — every Claude response is auto-captured as a training
//      example (quality 0.6). Claude is the teacher; KIMMP's local model is
//      the student. Over time the corpus grows without any human effort.
//
//   2. LOCAL ROUTING — once KIMMP_LOCAL_MODEL is set in env (after a fine-tune),
//      the router tries the local Ollama model first. Claude is fallback only.
//      Set OLLAMA_BASE_URL to override the default (http://localhost:11434).
//
// Graduation path:
//   - Phase 1 (now):   router captures every Claude call → corpus grows
//   - Phase 2:         export JSONL, fine-tune base model (llama3.1/qwen2.5)
//   - Phase 3:         set KIMMP_LOCAL_MODEL=<model-name>, router uses Ollama
//   - Phase 4:         local model autonomy ratio climbs toward 100%
//   - Phase 5:         KIMMP runs without ANTHROPIC_API_KEY
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../../lib/prisma'
import logger from '../../utils/logger'

const _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

const OLLAMA_BASE   = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const LOCAL_MODEL   = process.env.KIMMP_LOCAL_MODEL || ''   // e.g. "kimmp-v1:latest"
const FALLBACK_MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b'

// ─── In-memory call counters (reset on restart — fine for autonomy ratio) ────
const _counts = { claude: 0, local: 0 }

// ─── Ollama availability cache (5 min TTL) ───────────────────────────────────
let _ollamaOk: boolean | null = null
let _ollamaCheckedAt = 0

async function _ollamaAvailable(): Promise<boolean> {
  if (!LOCAL_MODEL) return false          // local routing only when model is set
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

// ─── Distillation capture (fire-and-forget) ───────────────────────────────────
// Every real Claude call becomes a training example automatically.
// This is the fastest path to an independent corpus — Claude trains its replacement.

const DISTILLATION_CAP = 10_000   // stop capturing new examples after this count

async function _capture(
  system: string,
  user: string,
  response: string,
  claudeModel: string,
  provider: 'claude' | 'ollama',
  meta: { agentType?: string; agentSystem?: string; tags?: string[] },
): Promise<void> {
  try {
    // Only capture when both prompt and response have enough signal
    if (system.length < 40 || user.length < 20 || response.length < 20) return

    // Check cap
    const cap = await (prisma as any).kimmpLearningExample
      .count({ where: { source: 'distillation' } })
      .catch(() => DISTILLATION_CAP + 1)
    if (cap >= DISTILLATION_CAP) return

    // Deduplicate: hash first 200 chars of system+user
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
}

export interface RouterResult {
  content: Array<{ type: 'text'; text: string }>
  model: string
  _routerMeta: { durationMs: number; provider: 'claude' | 'ollama' }
}

export async function routedCall(
  claudeModel: string,
  system: string,
  user: string,
  maxTokens: number,
  meta: RouterMeta = {},
): Promise<RouterResult> {
  const start = Date.now()

  // ── Local model path (post-graduation) ──────────────────────────────────────
  if (await _ollamaAvailable()) {
    try {
      const text = await _callOllama(system, user, maxTokens)
      _counts.local++
      _capture(system, user, text, claudeModel, 'ollama', meta).catch(() => {})
      return {
        content: [{ type: 'text', text }],
        model: LOCAL_MODEL,
        _routerMeta: { durationMs: Date.now() - start, provider: 'ollama' },
      }
    } catch (err) {
      logger.warn('[KIMMP Router] Ollama call failed, falling back to Claude:', (err as Error).message)
    }
  }

  // ── Claude path (default — also distills into training corpus) ──────────────
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      content: [{ type: 'text', text: '' }],
      model: claudeModel,
      _routerMeta: { durationMs: 0, provider: 'claude' },
    }
  }

  const res = await _anthropic.messages.create({
    model:       claudeModel,
    max_tokens:  maxTokens,
    temperature: 0.1,
    system,
    messages: [{ role: 'user', content: user }],
  })

  const text = res.content[0]?.type === 'text' ? (res.content[0] as any).text : ''
  _counts.claude++
  _capture(system, user, text, claudeModel, 'claude', meta).catch(() => {})

  return {
    content: [{ type: 'text', text }],
    model: res.model,
    _routerMeta: { durationMs: Date.now() - start, provider: 'claude' },
  }
}

// ─── Convenience wrappers matching the orchestrator's existing API ────────────

export function haiku(system: string, user: string, maxTokens = 500, meta: RouterMeta = {}) {
  return routedCall('claude-haiku-4-5-20251001', system, user, maxTokens, meta)
}

export function sonnet(system: string, user: string, maxTokens = 900, meta: RouterMeta = {}) {
  return routedCall('claude-sonnet-4-6', system, user, maxTokens, meta)
}

export function opus(system: string, user: string, maxTokens = 1200, meta: RouterMeta = {}) {
  return routedCall('claude-opus-4-8', system, user, maxTokens, meta)
}

export const textOf = (res: RouterResult | { content: Array<{ type: string; text?: string }> }) =>
  res.content[0]?.type === 'text' ? (res.content[0] as any).text ?? '' : ''

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getRouterStats() {
  const total = _counts.claude + _counts.local
  const [distillationCount, totalCorpus] = await Promise.all([
    (prisma as any).kimmpLearningExample.count({ where: { source: 'distillation' } }).catch(() => 0),
    (prisma as any).kimmpLearningExample.count().catch(() => 0),
  ])

  return {
    callsClaude:       _counts.claude,
    callsLocal:        _counts.local,
    callsTotal:        total,
    autonomyRatio:     total > 0 ? _counts.local / total : 0,
    ollamaAvailable:   _ollamaOk ?? false,
    localModel:        LOCAL_MODEL || null,
    distillationCount,
    totalCorpus,
    distillationCap:   DISTILLATION_CAP,
    phase: LOCAL_MODEL ? 'routing' : distillationCount > 500 ? 'pre-graduation' : 'distilling',
  }
}
