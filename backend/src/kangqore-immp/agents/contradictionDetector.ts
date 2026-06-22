// ---------------------------------------------------------------------------
// KIMMP Contradiction Detector
//
// After every LOOPS cycle, compares each system's summary claims for direct
// contradictions (e.g. LEAD_INTEL says "sector growing", VIS says "sector
// contracting"). Surfaces conflicts as RISK signals and indexes them into
// the KIMMP RAG so future cycles reason from resolved knowledge.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk'
import { SystemBriefing } from './systemDispatcher'
import { SignalLedger } from '../signals/signalLedger.service'
import { SystemRAG } from './systemRAG'
import logger from '../../utils/logger'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CONTRADICTION_SYSTEM = `You are a contradiction analyst reviewing briefings from multiple intelligence systems.
Your job is to find direct factual contradictions between their outputs — cases where System A asserts X and System B asserts NOT-X.
Be precise. Only flag genuine contradictions, not differences in emphasis or perspective.
Respond in JSON only. No markdown.`

interface Contradiction {
  systemA:    string
  systemB:    string
  claimA:     string
  claimB:     string
  severity:   'LOW' | 'MODERATE' | 'HIGH'
  resolution: string   // KIMMP's suggested reconciliation
}

interface ContradictionReport {
  contradictions: Contradiction[]
  clean:          boolean
}

export async function detectContradictions(
  briefings: SystemBriefing[],
): Promise<ContradictionReport> {
  if (!process.env.ANTHROPIC_API_KEY || briefings.length < 2) {
    return { contradictions: [], clean: true }
  }

  const summaries = briefings.map(b =>
    `${b.system} [${b.priority}]:\n${b.summary}\nKey findings: ${b.keyFindings.join('; ')}`
  ).join('\n\n---\n\n')

  try {
    const raw = await anthropic.messages.create({
      model:       'claude-opus-4-8',
      max_tokens:  600,
      temperature: 0.05,
      system:      CONTRADICTION_SYSTEM,
      messages:    [{
        role:    'user',
        content: `Review these ${briefings.length} system briefings for direct contradictions:\n\n${summaries}\n\nReturn JSON: { "contradictions": [{ "systemA": "...", "systemB": "...", "claimA": "...", "claimB": "...", "severity": "LOW|MODERATE|HIGH", "resolution": "..." }] }. Return empty array if none found.`,
      }],
    })

    const text = raw.content[0]?.type === 'text' ? raw.content[0].text.trim() : '{}'
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
    const contradictions: Contradiction[] = Array.isArray(parsed.contradictions)
      ? parsed.contradictions.slice(0, 5)
      : []

    if (contradictions.length === 0) {
      logger.debug('[KIMMP:CONTRADICT] No contradictions found in this LOOPS cycle')
      return { contradictions: [], clean: true }
    }

    logger.info(`[KIMMP:CONTRADICT] ${contradictions.length} contradiction(s) detected`)

    // Emit each as a RISK signal
    await Promise.allSettled(
      contradictions.map(c =>
        SignalLedger.record({
          sourceModule:   'kimmp',
          signalType:     'contradiction.detected',
          signalCategory: 'RISK',
          signalValue:    `${c.systemA} vs ${c.systemB}: "${c.claimA}" contradicts "${c.claimB}"`,
          severity:       c.severity,
          confidence:     0.8,
          metadata:       { resolution: c.resolution },
        })
      )
    )

    // Index the full contradiction report into KIMMP RAG
    const body = contradictions.map(c =>
      `${c.systemA} vs ${c.systemB} [${c.severity}]\n` +
      `  ${c.systemA} claims: ${c.claimA}\n` +
      `  ${c.systemB} claims: ${c.claimB}\n` +
      `  Suggested resolution: ${c.resolution}`
    ).join('\n\n')

    SystemRAG.ingest({
      system:  'KIMMP',
      docType: 'cross_system_pattern',
      title:   `Contradiction Report — ${new Date().toISOString().slice(0, 10)} (${contradictions.length} conflicts)`,
      body:    `INTER-SYSTEM CONTRADICTIONS DETECTED:\n\n${body}`,
      source:  'contradiction-detector',
      tags:    ['contradiction', 'risk', 'cross-system'],
    }).catch(() => {})

    return { contradictions, clean: false }
  } catch (err: any) {
    logger.warn(`[KIMMP:CONTRADICT] Detection failed: ${err.message}`)
    return { contradictions: [], clean: true }
  }
}
