// S308-S310 — KIMMP Intelligence Gateway core primitives: call logging, PII
// scanning, budget checks, cost estimation. Deliberately zero-dependency on
// kimmpLLMRouter.ts so the router can import this file directly (mirrors
// waandaxAnthropic.ts's own "no imports from kimmpLLMRouter" rule, to avoid
// a circular import between the router and the higher-level gateway service
// that itself calls into the router — see kimmpGateway.service.ts).

import { prisma } from '../lib/prisma'
import { emitToAdmins } from '../socket'

const TRUNCATE = 2000

// ── Cost estimation — approximate public list pricing (USD per million tokens).
// Not tied to actual billing reconciliation; good enough for cost-visibility UI.
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'opus':   { input: 15,    output: 75 },
  'sonnet': { input: 3,     output: 15 },
  'haiku':  { input: 0.8,   output: 4 },
  'gpt-4o': { input: 2.5,   output: 10 },
  'gemini': { input: 0.075, output: 0.3 },
}

function pricingFor(model: string): { input: number; output: number } {
  const lower = model.toLowerCase()
  const key = Object.keys(MODEL_PRICING).find(k => lower.includes(k))
  return key ? MODEL_PRICING[key] : { input: 0, output: 0 } // local/gen2/waandax/none = no marginal $ cost
}

export function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const p = pricingFor(model)
  return (inputTokens / 1_000_000) * p.input + (outputTokens / 1_000_000) * p.output
}

// ── Task-type → preferred model. New callers can consult this; existing
// callers keep whatever model they already pass — not retrofitted.
export const GATEWAY_MODEL_MAP: Record<string, string> = {
  STRATEGIC_DECISION: 'claude-sonnet-4-5-20250929',
  CLASSIFY:            'claude-haiku-4-5-20251001',
  GENERATE_INSIGHT:    'claude-sonnet-4-5-20250929',
  SUMMARIZE:           'claude-haiku-4-5-20251001',
  DEBATE:              'claude-sonnet-4-5-20250929',
}

// ── PII scanning ─────────────────────────────────────────────────────────────

const PII_PATTERNS: Record<string, RegExp> = {
  email:      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone:      /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g,
  ni_number:  /\b[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]\b/gi, // UK National Insurance
  ssn:        /\b\d{3}-\d{2}-\d{4}\b/g,                 // US SSN
  nhs_number: /\b\d{3}\s?\d{3}\s?\d{4}\b/g,              // UK NHS number
  iban:       /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/g,
  // Passport numbers have no universal format — this requires a mix of
  // letters AND digits to cut down on false positives (model IDs, hex
  // fragments, acronyms), but is still the noisiest pattern here by far,
  // which is why it's excluded from the default enabled set below.
  passport:   /\b(?=[A-Z0-9]{6,9}\b)(?=[A-Z0-9]*[A-Z])(?=[A-Z0-9]*\d)[A-Z0-9]{6,9}\b/g,
}

const DEFAULT_ENABLED_PATTERNS = ['email', 'phone', 'ni_number', 'ssn', 'nhs_number', 'iban']

let _piiConfigCache: { config: { mode: string; enabledPatterns: string[] }; fetchedAt: number } | null = null
const PII_CONFIG_CACHE_MS = 30_000

async function getActivePiiConfig(): Promise<{ mode: string; enabledPatterns: string[] }> {
  if (_piiConfigCache && Date.now() - _piiConfigCache.fetchedAt < PII_CONFIG_CACHE_MS) return _piiConfigCache.config
  const row = await prisma.piiScanConfig.findFirst({ where: { active: true } }).catch(() => null)
  const config = row
    ? { mode: row.mode, enabledPatterns: row.enabledPatterns }
    : { mode: 'AUDIT', enabledPatterns: DEFAULT_ENABLED_PATTERNS }
  _piiConfigCache = { config, fetchedAt: Date.now() }
  return config
}

export interface PiiScanResult {
  text: string       // possibly redacted
  detected: boolean
  patterns: string[]
}

// Subclassing Error alone does NOT set .name — it stays 'Error' unless set
// explicitly, which would break callers (e.g. admin-kimmp-gateway.ts's
// test-complete route) that branch HTTP status codes on err.name.
export class GatewayBlockedError extends Error {
  constructor(message: string) { super(message); this.name = 'GatewayBlockedError' }
}
export class GatewayBudgetExceededError extends Error {
  constructor(message: string) { super(message); this.name = 'GatewayBudgetExceededError' }
}

// mode='AUDIT' never modifies text or blocks — only flags. mode='REDACT'
// replaces matches. mode='BLOCK' only throws when allowBlock=true — the
// passive router/withWaandax instrumentation always calls this with
// allowBlock=false since it can't assume every existing caller tolerates a
// newly-thrown error; only kimmpGateway.complete() (an opt-in explicit
// entrypoint) passes allowBlock=true.
export async function scanPii(text: string, allowBlock = false): Promise<PiiScanResult> {
  const { mode, enabledPatterns } = await getActivePiiConfig()
  const patterns: string[] = []
  let redacted = text

  for (const name of enabledPatterns) {
    const re = PII_PATTERNS[name]
    if (!re) continue
    re.lastIndex = 0
    if (re.test(text)) {
      patterns.push(name)
      if (mode === 'REDACT') {
        re.lastIndex = 0
        redacted = redacted.replace(re, '[PII_REDACTED]')
      }
    }
  }

  const detected = patterns.length > 0
  if (detected && mode === 'BLOCK' && allowBlock) {
    throw new GatewayBlockedError(`PII detected (${patterns.join(', ')}) — call blocked by active PII policy`)
  }

  return { text: mode === 'REDACT' ? redacted : text, detected, patterns }
}

// ── Budget enforcement ───────────────────────────────────────────────────────

export async function checkBudget(userId: string): Promise<{ allowed: boolean; usedTokens: number; limitTokens: number | null; reason?: string }> {
  const budget = await prisma.tokenBudget.findFirst({ where: { userId } })
  if (!budget) return { allowed: true, usedTokens: 0, limitTokens: null }

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const agg = await prisma.llmCallLog.aggregate({
    where: { userId, createdAt: { gte: startOfMonth } },
    _sum: { promptTokens: true, completionTokens: true },
  })
  const usedTokens = (agg._sum.promptTokens ?? 0) + (agg._sum.completionTokens ?? 0)
  const overLimit = usedTokens >= budget.monthlyTokenLimit

  if (overLimit && budget.hardStop) {
    return { allowed: false, usedTokens, limitTokens: budget.monthlyTokenLimit, reason: 'Monthly token budget exceeded' }
  }
  return { allowed: true, usedTokens, limitTokens: budget.monthlyTokenLimit }
}

// ── Call logging ─────────────────────────────────────────────────────────────

export interface LogCallInput {
  userId?: string | null
  actorType: string
  model: string
  provider: string
  promptTokens?: number
  completionTokens?: number
  latencyMs?: number
  prompt: string
  response: string
  referencedObjectIds?: string[]
  taskType?: string | null
  agentRole?: string | null
  sourceModule?: string | null
  promptName?: string | null
  promptVersion?: number | null
  status: 'SUCCESS' | 'ERROR' | 'BLOCKED'
  errorMessage?: string | null
  piiDetected?: boolean
  piiPatterns?: string[]
}

export async function logCall(input: LogCallInput): Promise<void> {
  try {
    const promptTokens = input.promptTokens ?? 0
    const completionTokens = input.completionTokens ?? 0
    const totalCost = estimateCost(input.model, promptTokens, completionTokens)

    const row = await prisma.llmCallLog.create({
      data: {
        userId: input.userId ?? null,
        actorType: input.actorType,
        model: input.model,
        provider: input.provider,
        promptTokens,
        completionTokens,
        totalCost,
        latencyMs: input.latencyMs ?? 0,
        prompt: input.prompt.slice(0, TRUNCATE),
        response: input.response.slice(0, TRUNCATE),
        referencedObjectIds: input.referencedObjectIds ?? [],
        taskType: input.taskType ?? null,
        agentRole: input.agentRole ?? null,
        sourceModule: input.sourceModule ?? null,
        promptName: input.promptName ?? null,
        promptVersion: input.promptVersion ?? null,
        status: input.status,
        errorMessage: input.errorMessage ?? null,
        piiDetected: input.piiDetected ?? false,
        piiPatterns: input.piiPatterns ?? [],
      },
    })
    emitToAdmins('gateway:call', row)
  } catch {
    // Never let logging break the actual LLM call
  }
}

// ── Best-effort caller-module attribution for passively-instrumented call
// sites (withWaandax) that carry no explicit metadata. Parses the stack for
// the first frame outside this file and waandaxAnthropic.ts.
export function inferCallerModule(): { sourceModule: string; actorType: string } {
  try {
    const stack = new Error().stack ?? ''
    const lines = stack.split('\n').slice(1)
    for (const line of lines) {
      const match = line.match(/backend\/(?:src|dist)\/(.+?):\d+:\d+/)
      if (!match) continue
      const path = match[1]
      if (path.includes('kimmpGatewayCore') || path.includes('waandaxAnthropic')) continue
      const actorType = path.includes('kangqore-aegis') ? 'AEGIS'
        : path.includes('eqore') ? 'EQORE'
        : path.includes('kangqore-immp') ? 'KIMMP'
        : 'SYSTEM'
      return { sourceModule: path, actorType }
    }
  } catch {
    // fall through to default
  }
  return { sourceModule: 'unknown', actorType: 'SYSTEM' }
}
