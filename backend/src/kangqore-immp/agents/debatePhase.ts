// ---------------------------------------------------------------------------
// KIMMP Debate Phase — adversarial reasoning for CRITICAL briefings
//
// When a system produces a CRITICAL priority briefing, KIMMP runs a structured
// debate before issuing its final synthesis:
//
//   Bull Agent  → argues the most optimistic interpretation of the evidence
//   Bear Agent  → argues the most cautious/risk-focused interpretation
//   Arbiter     → KIMMP weighs both sides and produces a calibrated conclusion
//
// This prevents KIMMP from echoing the first plausible narrative it receives
// and surfaces blind spots, hidden risks, and premature optimism.
//
// The debate result is appended to the KIMMP synthesis context so the final
// SPEAK phase is informed by the full adversarial reasoning process.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk'
import { SystemBriefing } from './systemDispatcher'
import { SignalLedger } from '../signals/signalLedger.service'
import { prisma } from '../../lib/prisma'
import logger from '../../utils/logger'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface DebateResult {
  bullCase:         string   // optimistic interpretation
  bearCase:         string   // cautious/risk interpretation
  arbitration:      string   // KIMMP's calibrated conclusion
  finalVerdict:     'BULLISH' | 'BEARISH' | 'NEUTRAL'
  confidenceShift:  number   // how much the debate shifted confidence (+/-)
  debateRan:        boolean
}

const DEBATE_TIMEOUT_MS = 25_000  // give up if either side takes > 25s

async function callWithTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>(resolve => setTimeout(() => resolve(fallback), timeoutMs)),
  ])
}

export async function runDebatePhase(
  criticalBriefings: SystemBriefing[],
  kimmSynthesis:     string,
): Promise<DebateResult> {
  if (!process.env.ANTHROPIC_API_KEY || criticalBriefings.length === 0) {
    return { bullCase: '', bearCase: '', arbitration: '', finalVerdict: 'NEUTRAL', confidenceShift: 0, debateRan: false }
  }

  const context = criticalBriefings.map(b =>
    `${b.system} [CRITICAL — ${b.confidence}% confidence]:\n${b.summary}\nKey findings: ${b.keyFindings.join('; ')}\nAlerts: ${b.alerts.join('; ')}`
  ).join('\n\n---\n\n')

  logger.info(`[KIMMP:DEBATE] Initiating adversarial debate for ${criticalBriefings.length} CRITICAL briefing(s)`)

  try {
    // Both sides run in parallel to minimise latency
    const [bullRaw, bearRaw] = await Promise.all([
      callWithTimeout(
        anthropic.messages.create({
          model:       'claude-haiku-4-5-20251001',  // cheaper model for advocate roles
          max_tokens:  400,
          temperature: 0.7,  // slightly creative for advocate role
          system:      'You are the Bull Advocate in a strategic intelligence debate. Your role is to argue the most optimistic, opportunity-focused interpretation of the evidence presented. Find the strongest positive signals, underweighted growth vectors, and reasons for confident action. Be persuasive but grounded — no fabrication. Respond in 3-4 sentences.',
          messages:    [{ role: 'user', content: `Argue the bull case for this intelligence:\n\n${context}\n\nCurrent KIMMP synthesis: ${kimmSynthesis.slice(0, 600)}` }],
        }),
        DEBATE_TIMEOUT_MS,
        null,
      ),
      callWithTimeout(
        anthropic.messages.create({
          model:       'claude-haiku-4-5-20251001',
          max_tokens:  400,
          temperature: 0.7,
          system:      'You are the Bear Advocate in a strategic intelligence debate. Your role is to argue the most cautious, risk-aware interpretation of the evidence presented. Surface hidden risks, overconfident assumptions, downside scenarios, and reasons for restraint. Be persuasive but honest — no fabrication. Respond in 3-4 sentences.',
          messages:    [{ role: 'user', content: `Argue the bear case for this intelligence:\n\n${context}\n\nCurrent KIMMP synthesis: ${kimmSynthesis.slice(0, 600)}` }],
        }),
        DEBATE_TIMEOUT_MS,
        null,
      ),
    ])

    const bullCase = bullRaw?.content[0]?.type === 'text' ? bullRaw.content[0].text.trim() : ''
    const bearCase = bearRaw?.content[0]?.type === 'text' ? bearRaw.content[0].text.trim() : ''

    if (!bullCase || !bearCase) {
      logger.warn('[KIMMP:DEBATE] One or both advocates timed out — skipping debate')
      return { bullCase, bearCase, arbitration: '', finalVerdict: 'NEUTRAL', confidenceShift: 0, debateRan: false }
    }

    // Arbiter: KIMMP weighs both sides
    const arbiterRaw = await callWithTimeout(
      anthropic.messages.create({
        model:       'claude-opus-4-8',  // governing model for arbitration
        max_tokens:  500,
        system:      'You are KIMMP (Kangqore Intelligent Machine Mind Protocol), the governing AI for Kangqore. You have just received adversarial analysis of CRITICAL intelligence. Weigh both the bull and bear cases, identify which is better supported by the evidence, and produce a calibrated verdict. Respond with JSON only: { "arbitration": "...", "finalVerdict": "BULLISH|BEARISH|NEUTRAL", "confidenceShift": <-20 to +20 integer> }',
        messages:    [{
          role:    'user',
          content: `Original KIMMP synthesis:\n${kimmSynthesis.slice(0, 800)}\n\nBull case:\n${bullCase}\n\nBear case:\n${bearCase}\n\nArbitrate and return JSON.`,
        }],
      }),
      DEBATE_TIMEOUT_MS,
      null,
    )

    const arbiterText = arbiterRaw?.content[0]?.type === 'text'
      ? arbiterRaw.content[0].text.trim().replace(/```json|```/g, '').trim()
      : null

    let arbitration    = ''
    let finalVerdict: DebateResult['finalVerdict'] = 'NEUTRAL'
    let confidenceShift = 0

    if (arbiterText) {
      try {
        const parsed     = JSON.parse(arbiterText)
        arbitration      = parsed.arbitration      ?? ''
        finalVerdict     = (['BULLISH','BEARISH','NEUTRAL'].includes(parsed.finalVerdict) ? parsed.finalVerdict : 'NEUTRAL') as DebateResult['finalVerdict']
        confidenceShift  = Math.max(-20, Math.min(20, Number(parsed.confidenceShift ?? 0)))
      } catch {
        arbitration = arbiterText.slice(0, 300)
      }
    }

    logger.info(`[KIMMP:DEBATE] Verdict: ${finalVerdict} (shift: ${confidenceShift > 0 ? '+' : ''}${confidenceShift})`)

    // Emit debate outcome as a SYSTEM signal
    if (arbitration) {
      SignalLedger.record({
        sourceModule:   'kimmp',
        signalType:     'debate.verdict',
        signalCategory: finalVerdict === 'BULLISH' ? 'OPPORTUNITY' : finalVerdict === 'BEARISH' ? 'RISK' : 'SYSTEM',
        signalValue:    `Debate verdict: ${finalVerdict}. ${arbitration.slice(0, 250)}`,
        severity:       finalVerdict === 'BEARISH' ? 'HIGH' : 'MODERATE',
        confidence:     0.85,
        metadata:       { confidenceShift, systemsDebated: criticalBriefings.map(b => b.system) },
      }).catch(() => {})
    }

    // Persist debate trace for Gen 2 training data (non-blocking — never fails the debate)
    if (bullCase && bearCase && arbitration) {
      const primaryDispatchId = criticalBriefings[0]?.id
      if (primaryDispatchId) {
        ;(prisma as any).kimmpDebateTrace.create({
          data: {
            dispatchId:  primaryDispatchId,
            system:      criticalBriefings.map(b => b.system).join(','),
            trigger:     criticalBriefings[0]?.trigger ?? null,
            bullCase,
            bearCase,
            arbitration,
            verdict:     finalVerdict,
            confShift:   confidenceShift,
          },
        }).catch(() => {})
      }
    }

    return { bullCase, bearCase, arbitration, finalVerdict, confidenceShift, debateRan: true }

  } catch (err: any) {
    logger.warn(`[KIMMP:DEBATE] Debate phase failed: ${err.message}`)
    return { bullCase: '', bearCase: '', arbitration: '', finalVerdict: 'NEUTRAL', confidenceShift: 0, debateRan: false }
  }
}
