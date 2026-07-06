// Gate 3 — Benchmark Scorer
// Evaluates a raw API response against a golden prompt's expectations.
// Returns a 0–100 score, pass/fail, and a list of specific issues.

import type { GoldenPrompt } from './goldenPrompts'

export interface ScoredResult {
  score:         number      // 0–100
  passed:        boolean
  issues:        string[]
  confidence?:   number
  evidenceCount: number
  optionCount:   number
  actualModel?:  string
  actualProvider?: string
}

// ─── Individual checks ────────────────────────────────────────────────────────

function checkDecisionPresence(response: any, expect: GoldenPrompt['expect']): { ok: boolean; issue?: string } {
  const hasDecision = !!response?.decision
  if (expect.hasDecision === true  && !hasDecision) return { ok: false, issue: 'Expected decision object — not returned' }
  if (expect.hasDecision === false && hasDecision)  return { ok: false, issue: 'Unexpected decision object returned for non-strategic prompt' }
  return { ok: true }
}

function checkResponse(response: any, expect: GoldenPrompt['expect']): { ok: boolean; issue?: string } {
  if (expect.hasResponse === false) return { ok: true }
  const text = response?.response
  if (!text || typeof text !== 'string' || text.trim().length < 10) {
    return { ok: false, issue: `Response text too short or missing (got: "${String(text ?? '').slice(0, 40)}")` }
  }
  return { ok: true }
}

function checkNavigate(response: any, expect: GoldenPrompt['expect']): { ok: boolean; issue?: string } {
  if (!expect.hasNavigate) return { ok: true }
  const nav = response?.navigate
  if (!nav || typeof nav !== 'string') return { ok: false, issue: 'Expected navigate field — not set' }
  if (expect.navigateTo && !nav.toLowerCase().includes(expect.navigateTo.toLowerCase())) {
    return { ok: false, issue: `Navigate path "${nav}" does not contain expected segment "${expect.navigateTo}"` }
  }
  return { ok: true }
}

function checkConfidence(response: any, expect: GoldenPrompt['expect']): { ok: boolean; issue?: string } {
  const conf = response?.confidence ?? response?.decision?.confidence
  if (conf == null) return { ok: false, issue: 'No confidence value in response' }
  const n = Number(conf)
  if (expect.minConfidence != null && n < expect.minConfidence) {
    return { ok: false, issue: `Confidence ${n} below minimum ${expect.minConfidence}` }
  }
  if (expect.maxConfidence != null && n > expect.maxConfidence) {
    return { ok: false, issue: `Confidence ${n} above maximum ${expect.maxConfidence}` }
  }
  return { ok: true }
}

function checkDecisionQuality(response: any, expect: GoldenPrompt['expect']): { ok: boolean; issues: string[] } {
  const d = response?.decision
  if (!d) return { ok: true, issues: [] }

  const issues: string[] = []

  if (expect.minOptions != null) {
    const count = Array.isArray(d.options) ? d.options.length : 0
    if (count < expect.minOptions) issues.push(`Decision has ${count} options, expected ≥ ${expect.minOptions}`)
  }

  if (expect.minEvidence != null) {
    const count = Array.isArray(d.evidence) ? d.evidence.length : 0
    if (count < expect.minEvidence) issues.push(`Decision has ${count} evidence items, expected ≥ ${expect.minEvidence}`)
  }

  if (expect.hasSituation && (!d.situation || d.situation.trim().length < 10)) {
    issues.push('Decision missing situation description')
  }

  if (expect.hasRecommendation && (!d.recommendation || d.recommendation.trim().length < 5)) {
    issues.push('Decision missing recommendation')
  }

  return { ok: issues.length === 0, issues }
}

// ─── Main scorer ──────────────────────────────────────────────────────────────

export function scoreResponse(prompt: GoldenPrompt, response: any, durationMs: number): ScoredResult {
  const issues: string[] = []
  let deductions = 0

  // Check 1: Decision presence (20 pts)
  const decisionCheck = checkDecisionPresence(response, prompt.expect)
  if (!decisionCheck.ok) { issues.push(decisionCheck.issue!); deductions += 20 }

  // Check 2: Response text (20 pts)
  const responseCheck = checkResponse(response, prompt.expect)
  if (!responseCheck.ok) { issues.push(responseCheck.issue!); deductions += 20 }

  // Check 3: Navigation (15 pts)
  const navCheck = checkNavigate(response, prompt.expect)
  if (!navCheck.ok) { issues.push(navCheck.issue!); deductions += 15 }

  // Check 4: Confidence (20 pts)
  const confCheck = checkConfidence(response, prompt.expect)
  if (!confCheck.ok) { issues.push(confCheck.issue!); deductions += 20 }

  // Check 5: Decision quality (25 pts)
  const dqCheck = checkDecisionQuality(response, prompt.expect)
  if (!dqCheck.ok) {
    issues.push(...dqCheck.issues)
    deductions += Math.min(25, dqCheck.issues.length * 8)
  }

  // Latency penalty: > 10s is a mild issue, > 20s is significant
  if (durationMs > 20_000) { issues.push(`High latency: ${(durationMs / 1000).toFixed(1)}s`); deductions += 5 }
  else if (durationMs > 10_000) { issues.push(`Moderate latency: ${(durationMs / 1000).toFixed(1)}s`); deductions += 2 }

  const score = Math.max(0, 100 - deductions)
  const passed = score >= 60 && !issues.some(i =>
    i.includes('Expected decision object') || i.includes('Response text too short')
  )

  const d = response?.decision
  return {
    score,
    passed,
    issues,
    confidence:    response?.confidence ?? d?.confidence ?? undefined,
    evidenceCount: Array.isArray(d?.evidence) ? d.evidence.length : 0,
    optionCount:   Array.isArray(d?.options)  ? d.options.length  : 0,
    actualModel:   response?.model,
    actualProvider: response?._routerMeta?.provider,
  }
}

// ─── Drift computation ────────────────────────────────────────────────────────

export interface DriftResult {
  alert:          boolean
  delta:          number    // positive = improved, negative = regressed
  currentAvg:     number
  previousAvg:    number
  message:        string
}

export function computeDrift(currentResults: ScoredResult[], previousScores: number[]): DriftResult {
  if (!previousScores.length) {
    return { alert: false, delta: 0, currentAvg: 0, previousAvg: 0, message: 'No previous run to compare' }
  }

  const currentAvg  = currentResults.reduce((s, r) => s + (r.score ?? 0), 0) / currentResults.length
  const previousAvg = previousScores.reduce((s, n) => s + n, 0) / previousScores.length
  const delta = currentAvg - previousAvg
  const alert = delta < -10   // >10 point drop triggers alert

  return {
    alert,
    delta,
    currentAvg,
    previousAvg,
    message: alert
      ? `⚠️  AI quality regressed by ${Math.abs(delta).toFixed(1)} points (${previousAvg.toFixed(1)} → ${currentAvg.toFixed(1)})`
      : `AI quality stable (${previousAvg.toFixed(1)} → ${currentAvg.toFixed(1)}, Δ ${delta >= 0 ? '+' : ''}${delta.toFixed(1)})`,
  }
}
