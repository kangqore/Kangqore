// ---------------------------------------------------------------------------
// AEGIS Debate Phase — cross-engine adversarial governance reasoning.
//
// When 3+ agents across different engines return CRITICAL in the same trigger
// batch, AEGIS runs a structured debate before issuing a consolidated verdict:
//
//   Sceptic Agent  → argues the least alarming interpretation (false positives,
//                    transient spikes, monitoring noise)
//   Threat Agent   → argues the most severe interpretation (coordinated attack,
//                    sophisticated adversary, cascading failure)
//   Arbiter        → AEGIS synthesizes a unified verdict and recommended action
//
// This prevents AEGIS from over-reacting to correlated noise and ensures that
// genuinely coordinated threats receive a calibrated, consolidated response
// rather than N independent action pipelines firing simultaneously.
//
// Adapted from KIMMP's debatePhase.ts (kangqore-immp/agents/debatePhase.ts).
// ---------------------------------------------------------------------------

import Anthropic                    from '@anthropic-ai/sdk'
import { withWaandax } from '../kangqore-immp/llm/waandaxAnthropic'
import type { AegisAgentResult }    from './agents/types'
import type { AegisAction }         from './aegisActionProposer'
import { SignalLedger }             from '../kangqore-immp/signals/signalLedger.service'
import { prisma }                   from '../lib/prisma'

const anthropic    = withWaandax(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }))
const TIMEOUT_MS   = 25_000

export interface AegisDebateResult {
  scepticCase:      string
  threatCase:       string
  arbitration:      string
  unifiedVerdict:   'ESCALATE' | 'MONITOR' | 'DEFER'
  recommendedAction: AegisAction | null
  debateRan:        boolean
}

const NULL_RESULT: AegisDebateResult = {
  scepticCase:      '',
  threatCase:       '',
  arbitration:      '',
  unifiedVerdict:   'MONITOR',
  recommendedAction: null,
  debateRan:        false,
}

function callWithTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>(resolve => setTimeout(() => resolve(fallback), ms)),
  ])
}

function buildContext(criticalResults: AegisAgentResult[]): string {
  return criticalResults.map(r =>
    `${r.agentId} [${r.engine}]:\n${r.summary}\nFindings: ${r.findings.join('; ')}`
  ).join('\n\n---\n\n')
}

export async function runAegisDebatePhase(
  criticalResults: AegisAgentResult[],
): Promise<AegisDebateResult> {
  if (!process.env.ANTHROPIC_API_KEY || criticalResults.length < 3) return NULL_RESULT

  const engines = new Set(criticalResults.map(r => r.engine))
  if (engines.size < 2) return NULL_RESULT  // All from same engine — not cross-engine

  const context = buildContext(criticalResults)
  console.log(`[AEGIS:DEBATE] ${criticalResults.length} CRITICALs across ${engines.size} engines — initiating debate`)

  try {
    const [scepticRaw, threatRaw] = await Promise.all([
      callWithTimeout(
        anthropic.messages.create({
          model:       'claude-haiku-4-5-20251001',
          max_tokens:  350,
          temperature: 0.7,
          system:      'You are the Sceptic in an AEGIS security governance debate. Your role is to argue the LEAST alarming interpretation of concurrent agent findings. Identify false positives, monitoring noise, correlated but unrelated events, or transient spikes that do not represent a genuine coordinated threat. Be persuasive but honest — do not fabricate. Respond in 3-4 sentences.',
          messages:    [{ role: 'user', content: `Argue the least alarming interpretation of these concurrent CRITICAL findings:\n\n${context}` }],
        }),
        TIMEOUT_MS,
        null,
      ),
      callWithTimeout(
        anthropic.messages.create({
          model:       'claude-haiku-4-5-20251001',
          max_tokens:  350,
          temperature: 0.7,
          system:      'You are the Threat Analyst in an AEGIS security governance debate. Your role is to argue the MOST severe interpretation of concurrent agent findings. Surface coordinated attack patterns, sophisticated adversary behaviour, cascading failures, or evidence of intent. Be persuasive but grounded — do not fabricate. Respond in 3-4 sentences.',
          messages:    [{ role: 'user', content: `Argue the most severe interpretation of these concurrent CRITICAL findings:\n\n${context}` }],
        }),
        TIMEOUT_MS,
        null,
      ),
    ])

    const scepticCase = scepticRaw?.content[0]?.type === 'text' ? scepticRaw.content[0].text.trim() : ''
    const threatCase  = threatRaw?.content[0]?.type === 'text'  ? threatRaw.content[0].text.trim()  : ''

    if (!scepticCase || !threatCase) {
      console.warn('[AEGIS:DEBATE] One or both advocates timed out — aborting debate')
      return NULL_RESULT
    }

    const arbiterRaw = await callWithTimeout(
      anthropic.messages.create({
        model:       'claude-sonnet-5',
        max_tokens:  500,
        system:      `You are AEGIS (Autonomous Executive Governance Intelligence Shield). You have received a Sceptic and a Threat Analyst interpretation of concurrent CRITICAL security findings from ${criticalResults.length} agents across ${engines.size} engines. Weigh both arguments against the raw evidence and produce a calibrated governance verdict.

Return JSON only (no prose, no markdown):
{
  "arbitration": "2-3 sentence governance synthesis",
  "unifiedVerdict": "ESCALATE|MONITOR|DEFER",
  "recommendedActionType": "CREATE_NOTIFICATION|RUN_INVESTIGATION|SEND_ALERT_EMAIL|BLOCK_ACTOR|null",
  "recommendedLevel": 0|1|2|3
}

ESCALATE = confirmed coordinated threat requiring immediate L2/L3 action.
MONITOR  = ambiguous — continue observation, L1 notification is sufficient.
DEFER    = likely noise — log only, no action required.`,
        messages: [{
          role:    'user',
          content: `Raw CRITICAL findings:\n${context}\n\nSceptic:\n${scepticCase}\n\nThreat Analyst:\n${threatCase}\n\nReturn governance verdict as JSON.`,
        }],
      }),
      TIMEOUT_MS,
      null,
    )

    const arbiterText = arbiterRaw?.content[0]?.type === 'text'
      ? arbiterRaw.content[0].text.trim().replace(/```json|```/g, '').trim()
      : null

    let arbitration      = ''
    let unifiedVerdict: AegisDebateResult['unifiedVerdict'] = 'MONITOR'
    let recommendedAction: AegisAction | null = null

    if (arbiterText) {
      try {
        const parsed       = JSON.parse(arbiterText)
        arbitration        = parsed.arbitration ?? ''
        const rawVerdict   = parsed.unifiedVerdict
        if (['ESCALATE', 'MONITOR', 'DEFER'].includes(rawVerdict)) {
          unifiedVerdict = rawVerdict as AegisDebateResult['unifiedVerdict']
        }
        if (parsed.recommendedActionType && parsed.recommendedActionType !== 'null') {
          recommendedAction = {
            type:        parsed.recommendedActionType,
            level:       Number(parsed.recommendedLevel ?? 1) as AegisAction['level'],
            params:      { source: 'aegis.debate', agentCount: criticalResults.length, engines: [...engines] },
            description: `AEGIS debate verdict: ${unifiedVerdict} — ${arbitration.slice(0, 100)}`,
          }
        }
      } catch {
        arbitration = arbiterText.slice(0, 300)
      }
    }

    console.log(`[AEGIS:DEBATE] Verdict: ${unifiedVerdict} | engines: ${[...engines].join(', ')}`)

    // Emit debate outcome as a governance signal to KIMMP
    if (arbitration) {
      SignalLedger.record({
        sourceModule:   'kimmp.sentinel',
        signalType:     'aegis.debate.verdict',
        signalCategory: unifiedVerdict === 'ESCALATE' ? 'RISK' : 'SYSTEM',
        signalValue:    `AEGIS debate [${unifiedVerdict}]: ${arbitration.slice(0, 250)}`,
        severity:       unifiedVerdict === 'ESCALATE' ? 'CRITICAL' : 'MODERATE',
        confidence:     0.9,
        metadata:       {
          agentCount:    criticalResults.length,
          engines:       [...engines],
          agentIds:      criticalResults.map(r => r.agentId),
          unifiedVerdict,
        },
      }).catch(() => {})
    }

    // Persist debate trace for Gen 2 training data
    if (scepticCase && threatCase && arbitration) {
      ;(prisma as any).aegisDebateTrace?.create({
        data: {
          agentIds:      criticalResults.map(r => r.agentId),
          engines:       [...engines],
          scepticCase,
          threatCase,
          arbitration,
          verdict:       unifiedVerdict,
          agentCount:    criticalResults.length,
        },
      }).catch(() => {})
    }

    return { scepticCase, threatCase, arbitration, unifiedVerdict, recommendedAction, debateRan: true }

  } catch (err: any) {
    console.warn(`[AEGIS:DEBATE] Debate phase failed: ${err.message}`)
    return NULL_RESULT
  }
}
