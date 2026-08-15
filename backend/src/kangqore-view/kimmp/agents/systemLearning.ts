// ---------------------------------------------------------------------------
// KIMMP System Learning — reinforcement learning for agent selection.
//
// Every system activation is a learning event. The learning loop:
//
//   1. RECORD   — after every dispatch, store which agents were chosen + confidence
//   2. FEEDBACK — operator rates the briefing (ACCEPTED / DISMISSED / CORRECTED)
//   3. WEIGHT   — compute per-agent, per-trigger success rates from history
//   4. INJECT   — next REASON phase reads weights → smarter agent selection
//
// Learning signal:
//   ACCEPTED   → +2 score for each agent that ran, +1 for confidence
//   DISMISSED  → -1 score for each agent, confidence penalty
//   CORRECTED  → -2 score + store correction text as explicit memory
//   No feedback (pending) → neutral, used for confidence weighting only
//
// The system gets genuinely smarter with each activation — not through
// gradient descent, but through structured memory that the LLM reads.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma'
import logger from '../../../utils/logger'
import { SystemType } from './agentRegistry'
import { AgentType } from '../orchestrator/kimmpOrchestrator.service'
import { WaandaTrainingPipeline } from '../../waanda/training'

// ─── Types ────────────────────────────────────────────────────────────────────

export type FeedbackType = 'ACCEPTED' | 'DISMISSED' | 'CORRECTED'

export interface AgentWeight {
  agentType:   AgentType
  runs:        number
  accepted:    number
  dismissed:   number
  corrected:   number
  avgConfidence: number
  score:       number    // composite: higher = prefer, lower = deprioritise
  strength:    'STRONG' | 'MODERATE' | 'WEAK' | 'UNTESTED'
  calibrationError: number  // |stated_confidence% - acceptance_rate%|; 0 = perfectly calibrated
}

export interface SystemLearningContext {
  triggerPattern:  string
  totalRuns:       number
  agentWeights:    AgentWeight[]
  recentCorrections: string[]
  bestAgents:      AgentType[]    // top agents by score for this trigger
  avoidAgents:     AgentType[]    // consistently poor performers
  avgConfidence:   number
}

// ─── Trigger normalisation ────────────────────────────────────────────────────
// "meeting.completed.healthcare" → "meeting.completed"
// "loop.cascade.eqore"          → "loop.cascade"
// "schedule.daily.9am"          → "schedule.daily"
// "manual"                      → "manual"

export function normaliseTrigger(trigger: string): string {
  if (!trigger || trigger === 'manual') return 'manual'
  const parts = trigger.replace(/_/g, '.').split('.')
  // Keep max 2 segments for the pattern key
  return parts.slice(0, 2).join('.')
}

// ─── Score computation ────────────────────────────────────────────────────────

function computeScore(accepted: number, dismissed: number, corrected: number, avgConf: number): number {
  // +2 per accept, -1 per dismiss, -2 per correction, weighted by confidence
  const feedbackScore = accepted * 2 - dismissed * 1 - corrected * 2
  const confBonus     = (avgConf - 50) / 50  // -1 to +1 range
  return Math.round(feedbackScore * 10 + confBonus * 5)
}

function scoreToStrength(score: number, runs: number): AgentWeight['strength'] {
  if (runs === 0)    return 'UNTESTED'
  if (score >= 15)   return 'STRONG'
  if (score >= 0)    return 'MODERATE'
  return 'WEAK'
}

// ─── Learning Service ─────────────────────────────────────────────────────────

export class SystemLearning {

  // ── Record a new dispatch ────────────────────────────────────────────────────
  // Called immediately after every system activation.

  static async record(params: {
    system:         SystemType
    dispatchId:     string
    trigger:        string
    selectedAgents: AgentType[]
    confidence:     number
    priority:       string
    loopSignalSent: boolean
  }): Promise<void> {
    const pattern = normaliseTrigger(params.trigger)
    try {
      await (prisma as any).kimmpSystemMemory.create({
        data: {
          system:         params.system,
          triggerPattern: pattern,
          dispatchId:     params.dispatchId,
          selectedAgents: params.selectedAgents,
          confidence:     Math.round(params.confidence),
          priority:       params.priority,
          loopSignalSent: params.loopSignalSent,
          // feedback starts null — operator rates it later
        },
      })
    } catch (err: any) {
      logger.warn('[KIMMP:LEARN] record failed:', err.message)
    }
  }

  // ── Record operator feedback ─────────────────────────────────────────────────
  // Updates the memory record for a given dispatch with the operator's rating.

  static async recordFeedback(params: {
    dispatchId:  string
    feedback:    FeedbackType
    correction?: string
  }): Promise<{ ok: boolean; memoryId?: string }> {
    try {
      const record = await (prisma as any).kimmpSystemMemory.findFirst({
        where: { dispatchId: params.dispatchId },
        select: { id: true },
      })
      if (!record) return { ok: false }

      await Promise.all([
        (prisma as any).kimmpSystemMemory.update({
          where: { id: record.id },
          data:  { feedback: params.feedback, correction: params.correction ?? null },
        }),
        // Stamp the dispatch record so the history API returns feedback without a join
        (prisma as any).kimmpSystemDispatch.updateMany({
          where: { id: params.dispatchId },
          data:  { feedback: params.feedback },
        }),
      ])

      // Propagate feedback to training pipeline as quality label — fire and forget
      WaandaTrainingPipeline.applyFeedback({
        dispatchId: params.dispatchId,
        feedback:   params.feedback,
        correction: params.correction,
      }).catch(() => {})

      logger.info(`[KIMMP:LEARN] Feedback recorded: ${params.dispatchId} → ${params.feedback}`)
      return { ok: true, memoryId: record.id }
    } catch (err: any) {
      logger.warn('[KIMMP:LEARN] feedback failed:', err.message)
      return { ok: false }
    }
  }

  // ── Compute agent weights for a system + trigger pattern ─────────────────────
  // Reads history and computes a performance score per agent.

  static async computeWeights(
    system: SystemType,
    triggerPattern: string,
    availableAgents: AgentType[],
  ): Promise<AgentWeight[]> {
    const records: any[] = await (prisma as any).kimmpSystemMemory.findMany({
      where:   { system, triggerPattern },
      orderBy: { createdAt: 'desc' },
      take:    60,
      select:  { selectedAgents: true, feedback: true, confidence: true, createdAt: true },
    }).catch(() => [])

    const now = Date.now()

    // Weighted aggregation — recent feedback counts more than old feedback.
    // decay = e^(−daysSince / 30): full weight today, ~37% at 30 days, ~5% at 90 days.
    const stats: Record<string, {
      runs:              number   // raw run count (for UNTESTED threshold)
      wAccepted:         number   // decay-weighted accepted score
      wDismissed:        number   // decay-weighted dismissed score
      wCorrected:        number   // decay-weighted corrected score
      wConfTotal:        number   // decay-weighted confidence sum
      wTotal:            number   // sum of decay weights (for avg conf)
    }> = {}

    for (const r of records) {
      const daysSince = (now - new Date(r.createdAt).getTime()) / 86_400_000
      const decay     = Math.exp(-daysSince / 30)

      for (const agent of (r.selectedAgents as string[])) {
        if (!stats[agent]) stats[agent] = { runs: 0, wAccepted: 0, wDismissed: 0, wCorrected: 0, wConfTotal: 0, wTotal: 0 }
        stats[agent].runs++
        stats[agent].wTotal    += decay
        stats[agent].wConfTotal += decay * (r.confidence ?? 0)
        if (r.feedback === 'ACCEPTED')  stats[agent].wAccepted  += decay
        if (r.feedback === 'DISMISSED') stats[agent].wDismissed += decay
        if (r.feedback === 'CORRECTED') stats[agent].wCorrected += decay
      }
    }

    return availableAgents.map(agentType => {
      const s    = stats[agentType]
      const runs = s?.runs ?? 0

      // Decay-weighted equivalents of the raw accepted/dismissed/corrected counts
      const accepted  = s ? Math.round(s.wAccepted  * 10) / 10 : 0
      const dismissed = s ? Math.round(s.wDismissed * 10) / 10 : 0
      const corrected = s ? Math.round(s.wCorrected * 10) / 10 : 0
      const avgConf   = s && s.wTotal > 0 ? Math.round(s.wConfTotal / s.wTotal) : 0

      // Confidence calibration: |stated_conf% − actual_acceptance_%|
      // A perfectly calibrated agent stating 80% confidence gets accepted 80% of the time.
      // Overconfident agents (high stated, low acceptance) carry a score penalty.
      const ratedTotal = accepted + dismissed + corrected
      const acceptanceRate = ratedTotal > 0 ? (accepted / ratedTotal) * 100 : 0
      const calibrationError = ratedTotal >= 3  // only penalise once we have enough signal
        ? Math.round(Math.abs(avgConf - acceptanceRate))
        : 0
      // Penalty: 1 point per 10 points of calibration error above a 20-point grace band
      const calibrationPenalty = Math.max(0, Math.floor((calibrationError - 20) / 10))

      const score = computeScore(accepted, dismissed, corrected, avgConf) - calibrationPenalty

      return {
        agentType,
        runs,
        accepted:         Math.round(accepted),
        dismissed:        Math.round(dismissed),
        corrected:        Math.round(corrected),
        avgConfidence:    avgConf,
        score,
        strength:         scoreToStrength(score, runs),
        calibrationError,
      }
    })
  }

  // ── Get full learning context ─────────────────────────────────────────────────
  // Returns a structured summary for injection into the REASON phase prompt.

  static async getContext(
    system: SystemType,
    trigger: string,
    availableAgents: AgentType[],
  ): Promise<SystemLearningContext | null> {
    const pattern = normaliseTrigger(trigger)

    // Fetch weights
    const weights = await SystemLearning.computeWeights(system, pattern, availableAgents)

    // Total runs for this trigger
    const totalRuns = weights.reduce((max, w) => Math.max(max, w.runs), 0)
    if (totalRuns === 0) return null  // no history yet — don't inject empty context

    // Average confidence across all recent activations
    const avgConfidence = totalRuns > 0
      ? Math.round(weights.filter(w => w.runs > 0).reduce((s, w) => s + w.avgConfidence, 0)
          / Math.max(1, weights.filter(w => w.runs > 0).length))
      : 0

    // Best agents: STRONG first, then MODERATE, sorted by score
    const bestAgents = weights
      .filter(w => w.strength === 'STRONG' || (w.strength === 'MODERATE' && w.runs >= 3))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(w => w.agentType)

    // Consistently poor: WEAK with enough runs to be confident
    const avoidAgents = weights
      .filter(w => w.strength === 'WEAK' && w.runs >= 3)
      .map(w => w.agentType)

    // Recent corrections (last 5)
    const correctionRecords: any[] = await (prisma as any).kimmpSystemMemory.findMany({
      where: {
        system,
        triggerPattern: pattern,
        feedback:       'CORRECTED',
        correction:     { not: null },
      },
      orderBy: { createdAt: 'desc' },
      take:    5,
      select:  { correction: true, createdAt: true },
    }).catch(() => [])

    const recentCorrections = correctionRecords.map((r: any) => r.correction as string)

    return {
      triggerPattern: pattern,
      totalRuns,
      agentWeights:   weights,
      recentCorrections,
      bestAgents,
      avoidAgents,
      avgConfidence,
    }
  }

  // ── Format context as prompt block ───────────────────────────────────────────
  // Converts learning context into the text injected into the REASON prompt.

  static formatContextBlock(ctx: SystemLearningContext): string {
    const lines: string[] = [
      `LEARNING MEMORY — ${ctx.triggerPattern} (${ctx.totalRuns} past activations, avg confidence ${ctx.avgConfidence}%)`,
      '',
    ]

    for (const w of ctx.agentWeights) {
      if (w.runs === 0) {
        lines.push(`  ${w.agentType.padEnd(22)} UNTESTED`)
        continue
      }
      const accepted  = w.accepted  > 0 ? `${w.accepted} accepted`  : ''
      const dismissed = w.dismissed > 0 ? `${w.dismissed} dismissed` : ''
      const corrected = w.corrected > 0 ? `${w.corrected} corrected` : ''
      const feedback  = [accepted, dismissed, corrected].filter(Boolean).join(' | ') || 'no feedback yet'
      lines.push(`  ${w.agentType.padEnd(22)} ${w.strength.padEnd(10)} ${w.runs}x | conf ${w.avgConfidence}% | ${feedback}`)
    }

    if (ctx.bestAgents.length > 0) {
      lines.push('')
      lines.push(`PROVEN FOR THIS TRIGGER: ${ctx.bestAgents.join(', ')}`)
    }
    if (ctx.avoidAgents.length > 0) {
      lines.push(`CONSISTENTLY WEAK: ${ctx.avoidAgents.join(', ')} — only select if strongly contextually relevant`)
    }
    if (ctx.recentCorrections.length > 0) {
      lines.push('')
      lines.push('RECENT OPERATOR CORRECTIONS:')
      ctx.recentCorrections.forEach(c => lines.push(`  • "${c}"`))
    }

    return lines.join('\n')
  }

  // ── System learning summary ───────────────────────────────────────────────────
  // Returns an overview of how much a system has learned, for the status API.

  static async systemSummary(system: SystemType): Promise<{
    totalRecords:    number
    withFeedback:    number
    acceptanceRate:  number
    dismissalRate:   number
    triggerPatterns: string[]
    topAgents:       { agentType: string; score: number; strength: string }[]
  }> {
    try {
      const [total, withFeedback, accepted, dismissed, patterns, allRecords] = await Promise.all([
        (prisma as any).kimmpSystemMemory.count({ where: { system } }),
        (prisma as any).kimmpSystemMemory.count({ where: { system, feedback: { not: null } } }),
        (prisma as any).kimmpSystemMemory.count({ where: { system, feedback: 'ACCEPTED' } }),
        (prisma as any).kimmpSystemMemory.count({ where: { system, feedback: 'DISMISSED' } }),
        (prisma as any).kimmpSystemMemory.groupBy({
          by: ['triggerPattern'],
          where: { system },
          _count: { _all: true },
          orderBy: { _count: { triggerPattern: 'desc' } },
          take: 10,
        }),
        (prisma as any).kimmpSystemMemory.findMany({
          where: { system },
          select: { selectedAgents: true, feedback: true, confidence: true },
        }),
      ])

      // Compute top agents across all triggers
      const agentStats: Record<string, { runs: number; accepted: number; dismissed: number; corrected: number; totalConf: number }> = {}
      for (const r of (allRecords as any[])) {
        for (const agent of (r.selectedAgents as string[])) {
          if (!agentStats[agent]) agentStats[agent] = { runs: 0, accepted: 0, dismissed: 0, corrected: 0, totalConf: 0 }
          agentStats[agent].runs++
          agentStats[agent].totalConf += r.confidence ?? 0
          if (r.feedback === 'ACCEPTED')  agentStats[agent].accepted++
          if (r.feedback === 'DISMISSED') agentStats[agent].dismissed++
          if (r.feedback === 'CORRECTED') agentStats[agent].corrected++
        }
      }

      const topAgents = Object.entries(agentStats)
        .map(([agentType, s]) => {
          const avgConf = s.runs > 0 ? Math.round(s.totalConf / s.runs) : 0
          const ratedTotal = s.accepted + s.dismissed + s.corrected
          const acceptanceRate = ratedTotal > 0 ? (s.accepted / ratedTotal) * 100 : 0
          const calibrationError = ratedTotal >= 3
            ? Math.round(Math.abs(avgConf - acceptanceRate)) : 0
          const calibrationPenalty = Math.max(0, Math.floor((calibrationError - 20) / 10))
          const score = computeScore(s.accepted, s.dismissed, s.corrected, avgConf) - calibrationPenalty
          return { agentType, score, calibrationError, strength: scoreToStrength(score, s.runs) as string }
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)

      return {
        totalRecords:    total   as number,
        withFeedback:    withFeedback as number,
        acceptanceRate:  total > 0 ? Math.round((accepted as number / (total as number)) * 100) : 0,
        dismissalRate:   total > 0 ? Math.round((dismissed as number / (total as number)) * 100) : 0,
        triggerPatterns: (patterns as any[]).map((p: any) => `${p.triggerPattern} (${p._count._all}x)`),
        topAgents,
      }
    } catch {
      return { totalRecords: 0, withFeedback: 0, acceptanceRate: 0, dismissalRate: 0, triggerPatterns: [], topAgents: [] }
    }
  }

  // ── Full registry learning summary ────────────────────────────────────────────

  static async registrySummary(): Promise<Record<SystemType, Awaited<ReturnType<typeof SystemLearning.systemSummary>>>> {
    const systems: SystemType[] = ['EQORE', 'LEAD_INTEL', 'ALIS', 'VIS', 'SENTINEL']
    const results = await Promise.all(systems.map(s => SystemLearning.systemSummary(s)))
    return Object.fromEntries(systems.map((s, i) => [s, results[i]])) as any
  }
}
