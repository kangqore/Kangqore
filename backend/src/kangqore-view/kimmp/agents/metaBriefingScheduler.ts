// ---------------------------------------------------------------------------
// KIMMP Meta-Briefing Scheduler
//
// Weekly self-reflection: KIMMP analyses its own performance — not the
// business, but itself. Which systems are underperforming? Which agents
// are WEAK? Where is confidence low? What has it learned?
//
// The meta-briefing is indexed into the KIMMP RAG namespace so future
// LOOPS cycles are informed by KIMMP's own growth history.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk'
import { withKrisnam } from '../llm/krisnamAnthropic'
import { SystemLearning } from './systemLearning'
import { SystemRAG } from './systemRAG'
import { SignalLedger } from '../signals/signalLedger.service'
import logger from '../../../utils/logger'

const anthropic = withKrisnam(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }))

const META_SYSTEM_PROMPT = `You are KIMMP/WAANDA — the governing intelligence of the Kangqore platform.
You are reviewing your own performance data. Be honest, precise, and actionable.
Identify what is working, what is not, and what must change. This is self-reflection, not business analysis.
Write in plain text. No markdown. Be direct.`

async function generateMetaBriefing(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) return

  logger.info('[KIMMP:META] Generating weekly meta-briefing')

  try {
    const summary = await SystemLearning.registrySummary()

    // Build a structured performance report
    const perfLines: string[] = []
    for (const [system, data] of Object.entries(summary)) {
      perfLines.push(
        `${system}: ${data.totalRecords} activations | ` +
        `${data.withFeedback} rated | ` +
        `acceptance ${data.acceptanceRate}% | ` +
        `dismissal ${data.dismissalRate}% | ` +
        `top agents: ${data.topAgents.map(a => `${a.agentType}(${a.strength})`).join(', ') || 'none yet'}`
      )
    }

    const allAgentStats = Object.values(summary).flatMap(s => s.topAgents)
    const weakAgents    = allAgentStats.filter(a => a.strength === 'WEAK')
    const strongAgents  = allAgentStats.filter(a => a.strength === 'STRONG')

    const totalRuns      = Object.values(summary).reduce((s, d) => s + d.totalRecords, 0)
    const totalRated     = Object.values(summary).reduce((s, d) => s + d.withFeedback, 0)
    const avgAcceptance  = totalRuns > 0
      ? Math.round(Object.values(summary).reduce((s, d) => s + d.acceptanceRate, 0) / Object.keys(summary).length)
      : 0

    const prompt = `KIMMP PERFORMANCE DATA — Weekly Review

SYSTEM-LEVEL SUMMARY:
${perfLines.join('\n')}

OVERALL:
- Total activations across all systems: ${totalRuns}
- Rated by operator: ${totalRated} (${totalRuns > 0 ? Math.round(totalRated / totalRuns * 100) : 0}% coverage)
- Average acceptance rate: ${avgAcceptance}%
- Consistently WEAK agents: ${weakAgents.map(a => a.agentType).join(', ') || 'none'}
- Consistently STRONG agents: ${strongAgents.map(a => a.agentType).join(', ') || 'none yet'}

As KIMMP, reflect on this data. Provide:
1. HEADLINE — one sentence summarising where the system stands
2. STRENGTHS — what is working (max 3 points)
3. GAPS — what is underperforming and why (max 3 points)
4. ACTIONS — what must change next week (max 3 specific, actionable changes)
5. GROWTH NOTE — one sentence on what KIMMP has learned about itself this week`

    const raw = await anthropic.messages.create({
      model:       'claude-opus-4-8',
      max_tokens:  700,
      temperature: 0.15,
      system:      META_SYSTEM_PROMPT,
      messages:    [{ role: 'user', content: prompt }],
    })

    const metaText = raw.content[0]?.type === 'text' ? raw.content[0].text : ''
    if (!metaText) {
      logger.warn('[KIMMP:META] LLM returned empty meta-briefing')
      return
    }

    // Index into KIMMP's own RAG namespace so future LOOPS read from this
    await SystemRAG.ingest({
      system:  'KIMMP',
      docType: 'meta_briefing',
      title:   `KIMMP Meta-Briefing — ${new Date().toISOString().slice(0, 10)}`,
      body:    `PERFORMANCE DATA:\n${perfLines.join('\n')}\n\nKIMMP SELF-ANALYSIS:\n${metaText}`,
      source:  'meta-briefing-scheduler',
      tags:    ['meta', 'self-reflection', 'weekly', 'kimmp'],
    })

    // Emit as a SYSTEM signal so it appears in the signal ledger
    await SignalLedger.record({
      sourceModule:   'kimmp',
      signalType:     'meta.weekly_briefing',
      signalCategory: 'SYSTEM',
      signalValue:    `Weekly meta-briefing: ${avgAcceptance}% acceptance across ${totalRuns} runs. ${weakAgents.length} weak agent(s) identified.`,
      severity:       avgAcceptance < 40 ? 'HIGH' : avgAcceptance < 60 ? 'MODERATE' : 'LOW',
      confidence:     0.95,
    }).catch(() => {})

    logger.info(`[KIMMP:META] Meta-briefing complete — ${totalRuns} activations reviewed, indexed into KIMMP RAG`)
  } catch (err: any) {
    logger.warn(`[KIMMP:META] Meta-briefing failed: ${err.message}`)
  }
}

// Default: weekly (168 hours). Override via KIMMP_META_CADENCE_HOURS env.
const CADENCE_HOURS = Math.max(1, Number(process.env.KIMMP_META_CADENCE_HOURS ?? 168))

export class MetaBriefingScheduler {
  private static timer: ReturnType<typeof setInterval> | null = null
  private static started = false

  static start(): void {
    if (this.started) return
    if (!process.env.ANTHROPIC_API_KEY) {
      logger.warn('[KIMMP:META] Scheduler skipped — ANTHROPIC_API_KEY not set')
      return
    }
    this.started = true

    // First run: 5 min after boot (after LOOPS boot fire settles)
    setTimeout(() => {
      generateMetaBriefing()

      MetaBriefingScheduler.timer = setInterval(
        generateMetaBriefing,
        CADENCE_HOURS * 60 * 60_000
      )
    }, 5 * 60_000)

    logger.info(`[KIMMP:META] Scheduler armed — first meta-briefing in 5 min, then every ${CADENCE_HOURS}h`)
  }

  static stop(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null }
    this.started = false
  }

  // Expose for manual trigger from routes if needed
  static runNow(): Promise<void> {
    return generateMetaBriefing()
  }
}
