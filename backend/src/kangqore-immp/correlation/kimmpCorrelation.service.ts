import Anthropic from '@anthropic-ai/sdk'
import { withWaandax } from '../llm/waandaxAnthropic'
import { SignalLedger } from '../signals/signalLedger.service'
import { prisma } from '../../lib/prisma'

export interface CorrelationPattern {
  name: string
  description: string
  signalIds: string[]
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  confidence: number
  detectedAt: string
}

const anthropic = withWaandax(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }))

export class KimmpCorrelationEngine {
  static async analyze(windowHours = 24): Promise<CorrelationPattern[]> {
    // 1. Fetch recent signals
    let signals: any[] = []
    try {
      const since = new Date(Date.now() - windowHours * 3_600_000)
      signals = await (prisma as any).kimmpSignal.findMany({
        where:   { createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take:    150,
      })
    } catch {
      return []
    }

    if (signals.length < 3) return []

    // 2. Rule-based patterns (fast, deterministic)
    const rulePatterns = this.checkRules(signals)

    // 3. AI pattern detection (deeper, slower)
    const aiPatterns = await this.detectWithAI(signals)

    const all = [...rulePatterns, ...aiPatterns]

    // 4. Emit each pattern as a meta-signal so it flows into the HUD
    for (const p of all) {
      await SignalLedger.record({
        sourceModule:   'kimmp',
        signalType:     'CORRELATION_DETECTED',
        signalCategory: 'RISK',
        signalValue:    `[${p.name}] ${p.description}`,
        severity:       p.severity,
        confidence:     p.confidence,
        metadata:       { patternName: p.name, signalIds: p.signalIds },
      }).catch(() => {})
    }

    return all
  }

  private static checkRules(signals: any[]): CorrelationPattern[] {
    const patterns: CorrelationPattern[] = []

    const bySeverity = (sev: string) => signals.filter(s => s.severity === sev)
    const byModule   = (mod: string) => signals.filter(s => s.sourceModule === mod)
    const byCategory = (cat: string) => signals.filter(s => s.signalCategory === cat)

    const highCritical = [...bySeverity('CRITICAL'), ...bySeverity('HIGH')]
    const affectedMods = new Set(highCritical.map(s => s.sourceModule))

    // Rule 1: SYSTEMIC_RISK — 3+ high/critical signals across 2+ modules
    if (highCritical.length >= 3 && affectedMods.size >= 2) {
      patterns.push({
        name:        'SYSTEMIC_RISK',
        description: `${highCritical.length} high-severity signals across ${affectedMods.size} modules — possible systemic issue requiring immediate review`,
        signalIds:   highCritical.slice(0, 5).map(s => s.id),
        severity:    'HIGH',
        confidence:  82,
        detectedAt:  new Date().toISOString(),
      })
    }

    // Rule 2: OPPORTUNITY_GAP — Scout found opportunities but no sales signals in window
    const oppSignals  = byCategory('OPPORTUNITY')
    const salesSignals = [...byModule('eqore'), ...byModule('lead-intelligence')]
    if (oppSignals.length >= 2 && salesSignals.length === 0) {
      patterns.push({
        name:        'OPPORTUNITY_GAP',
        description: `${oppSignals.length} external opportunities detected but no matching sales activity — team may be unaware or under-resourced`,
        signalIds:   oppSignals.slice(0, 3).map(s => s.id),
        severity:    'MODERATE',
        confidence:  72,
        detectedAt:  new Date().toISOString(),
      })
    }

    // Rule 3: MARKET_PRESSURE — Scout COMPETITOR signals + internal RISK signals
    const competitorSignals = byCategory('COMPETITOR')
    const riskSignals = byCategory('RISK').filter(s => s.sourceModule !== 'scout' && s.sourceModule !== 'kimmp')
    if (competitorSignals.length >= 1 && riskSignals.length >= 2) {
      patterns.push({
        name:        'MARKET_PRESSURE',
        description: `External competitor signals (${competitorSignals.length}) correlating with internal risk signals (${riskSignals.length}) — market dynamics may be affecting operations`,
        signalIds:   [...competitorSignals.slice(0, 2), ...riskSignals.slice(0, 2)].map(s => s.id),
        severity:    'MODERATE',
        confidence:  68,
        detectedAt:  new Date().toISOString(),
      })
    }

    // Rule 4: SIGNAL_DROUGHT — No signals in last 6h (monitoring gap)
    const recent6h = signals.filter(s => new Date(s.createdAt) > new Date(Date.now() - 6 * 3_600_000))
    if (signals.length > 10 && recent6h.length === 0) {
      patterns.push({
        name:        'MONITORING_GAP',
        description: 'No signals received in the last 6 hours despite historical activity — check signal producers and system connectivity',
        signalIds:   [],
        severity:    'MODERATE',
        confidence:  90,
        detectedAt:  new Date().toISOString(),
      })
    }

    return patterns
  }

  private static async detectWithAI(signals: any[]): Promise<CorrelationPattern[]> {
    if (!process.env.ANTHROPIC_API_KEY || signals.length < 5) return []

    try {
      const summary = signals.slice(0, 25).map((s, i) =>
        `[${i + 1}] src=${s.sourceModule} type=${s.signalType} cat=${s.signalCategory} sev=${s.severity} conf=${s.confidence}: "${String(s.signalValue ?? '').slice(0, 120)}"`
      ).join('\n')

      const res = await anthropic.messages.create({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: `You are KIMMP's cross-signal correlation engine. Your job is to find non-obvious relationships between business signals that a human analyst would miss when reading them individually.

Look for: causal chains, leading indicators, risk amplification, opportunity signals masked by noise, pattern breaks.

Return a JSON array of 0–2 patterns that are NOT already obvious from single signals:
[{
  "name": "PATTERN_NAME_CAPS",
  "description": "2-3 sentence business insight — what does this combination mean for the company?",
  "signalIndices": [1, 4, 7],
  "severity": "LOW|MODERATE|HIGH|CRITICAL",
  "confidence": 55-90
}]

If no non-obvious cross-signal pattern exists, return [].`,
        messages: [{ role: 'user', content: `Recent signals (last 24h):\n${summary}` }],
      })

      const raw   = res.content[0]?.type === 'text' ? res.content[0].text : '[]'
      const match = raw.match(/\[[\s\S]*\]/)
      if (!match) return []

      return (JSON.parse(match[0]) as any[]).slice(0, 2).map((p: any) => ({
        name:        String(p.name ?? 'AI_PATTERN'),
        description: String(p.description ?? ''),
        signalIds:   (p.signalIndices as number[] ?? [])
                       .map((i: number) => signals[i - 1]?.id)
                       .filter(Boolean),
        severity:    (['LOW','MODERATE','HIGH','CRITICAL'].includes(p.severity) ? p.severity : 'MODERATE') as any,
        confidence:  Number(p.confidence ?? 60),
        detectedAt:  new Date().toISOString(),
      }))
    } catch {
      return []
    }
  }
}
