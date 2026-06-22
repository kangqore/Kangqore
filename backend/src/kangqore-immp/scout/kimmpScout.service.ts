import Anthropic from '@anthropic-ai/sdk'
import crypto   from 'crypto'
import logger from '../../utils/logger'
import { SignalLedger } from '../signals/signalLedger.service'
import { WebSearchService, SearchResult } from './webSearch.service'
import { prisma } from '../../lib/prisma'
import { KimmpSystemDispatcher } from '../agents/systemDispatcher'

// ─── Signal deduplication ─────────────────────────────────────────────────────
// Prevents the same insight flooding the ledger when Scout runs every 10-15 min.
// Key: hash(signalType + first-200-chars-of-value)
// Value: timestamp last seen
// TTL: 2 hours — after 2h the same signal is considered fresh again.

const DEDUP_TTL_MS = 2 * 60 * 60 * 1000 // 2 hours
const seen = new Map<string, number>()

function dedup(signalType: string, value: string): boolean {
  const key = crypto
    .createHash('sha1')
    .update(`${signalType}:${value.slice(0, 200).toLowerCase().replace(/\s+/g, ' ').trim()}`)
    .digest('hex')
  const now  = Date.now()
  const last = seen.get(key)
  if (last && now - last < DEDUP_TTL_MS) return true   // duplicate — skip
  seen.set(key, now)
  // Prune stale entries every ~500 inserts to keep memory bounded
  if (seen.size % 500 === 0) {
    for (const [k, t] of seen) if (now - t > DEDUP_TTL_MS) seen.delete(k)
  }
  return false
}

export interface ScoutSource {
  name: string
  queries: string[]
  signalType: string
  signalCategory: 'COMPETITOR' | 'OPPORTUNITY' | 'MARKET' | 'RISK'
  cadenceMinutes: number
}

// Cadences are intentionally short — dedup (2h window) prevents signal floods.
// Override any cadence via env: KIMMP_SCOUT_CADENCE_<SOURCE_KEY>=<minutes>
// e.g. KIMMP_SCOUT_CADENCE_TENDERS=5
function cadence(key: string, defaultMinutes: number): number {
  const env = process.env[`KIMMP_SCOUT_CADENCE_${key}`]
  const n   = env ? parseInt(env, 10) : NaN
  return Number.isFinite(n) && n > 0 ? n : defaultMinutes
}

export const SCOUT_SOURCES: ScoutSource[] = [
  {
    name: 'Competitor Monitor',
    queries: [
      'India B2B consulting technology platform competitors 2026',
      'digital transformation enterprise platform India new funding 2026',
      'business intelligence SaaS India startup latest news',
    ],
    signalType: 'COMPETITOR_MOVE',
    signalCategory: 'COMPETITOR',
    cadenceMinutes: cadence('COMPETITORS', 10),
  },
  {
    name: 'Government Tenders',
    queries: [
      'India government digital transformation tender GeM portal 2026',
      'school education technology tender Jharkhand India 2026',
      'MSME digital program government contract India 2026',
    ],
    signalType: 'TENDER_FOUND',
    signalCategory: 'OPPORTUNITY',
    cadenceMinutes: cadence('TENDERS', 10),
  },
  {
    name: 'Market Intelligence',
    queries: [
      'India B2B SaaS enterprise market trends 2026',
      'AI adoption enterprise India latest news 2026',
      'digital transformation SME India market shift',
    ],
    signalType: 'MARKET_SHIFT',
    signalCategory: 'MARKET',
    cadenceMinutes: cadence('MARKET', 15),
  },
  {
    name: 'Partnership Radar',
    queries: [
      'school technology partnership program India 2026',
      'MSME digital collaboration opportunity India',
      'education technology CSR partnership India new',
    ],
    signalType: 'PARTNERSHIP_OPPORTUNITY',
    signalCategory: 'OPPORTUNITY',
    cadenceMinutes: cadence('PARTNERSHIPS', 12),
  },
  {
    name: 'Regulatory Watch',
    queries: [
      'India data protection DPDP Act technology compliance 2026',
      'AI regulation India policy update 2026',
      'cybersecurity regulation India enterprise 2026',
    ],
    signalType: 'REGULATION_CHANGE',
    signalCategory: 'RISK',
    cadenceMinutes: cadence('REGULATORY', 15),
  },
  {
    name: 'Tech Radar',
    queries: [
      'AI agent framework enterprise breakthrough 2026',
      'large language model new capability enterprise India',
      'AI tool business intelligence 2026 release',
    ],
    signalType: 'TECH_BREAKTHROUGH',
    signalCategory: 'MARKET',
    cadenceMinutes: cadence('TECH', 12),
  },
]

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

async function extractSignals(
  query: string,
  results: SearchResult[],
  source: ScoutSource,
): Promise<Array<{ value: string; severity: string; confidence: number; url?: string }>> {
  if (!results.length || !process.env.ANTHROPIC_API_KEY) return []

  const context = results
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.snippet}\n${r.url}`)
    .join('\n\n')

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: `You are KIMMP Scout — the external intelligence radar for Kangqore, a B2B consulting and technology firm in India focused on digital transformation, AI, and enterprise services.

Extract ONLY signals that are genuinely relevant to Kangqore's business operations, competitive landscape, or growth opportunities. Be specific — name companies, amounts, dates, locations when available.

Return a JSON array of 0–3 signals:
[{"value": "Concise actionable insight — 1-2 sentences. Name specifics.", "severity": "LOW|MODERATE|HIGH|CRITICAL", "confidence": 40-95, "url": "most relevant URL or null"}]

If nothing is genuinely relevant to a B2B tech firm in India, return [].`,
      messages: [{
        role: 'user',
        content: `Query: "${query}"\nSignal type: ${source.signalType}\n\nSearch results:\n${context}`,
      }],
    })

    const raw = response.content[0]?.type === 'text' ? response.content[0].text : '[]'
    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) return []
    return (JSON.parse(match[0]) as any[]).slice(0, 3)
  } catch {
    // If Claude unavailable, emit top result as raw signal
    const top = results[0]
    if (top) {
      return [{ value: `${top.title}: ${top.snippet.slice(0, 200)}`, severity: 'LOW', confidence: 35, url: top.url }]
    }
    return []
  }
}

export class KimmpScoutService {
  static async runSource(source: ScoutSource): Promise<{ signals: number; queries: number }> {
    let totalSignals = 0
    let totalQueries = 0

    for (const query of source.queries) {
      try {
        const results = await WebSearchService.search(query, 5)
        totalQueries++

        const signals = await extractSignals(query, results, source)

        for (const sig of signals) {
          const value = String(sig.value ?? '').slice(0, 500)
          if (dedup(source.signalType, value)) {
            logger.debug(`[KIMMP:SCOUT] Dedup skip — ${source.signalType}: ${value.slice(0, 60)}…`)
            continue
          }
          await SignalLedger.record({
            sourceModule:   'scout',
            signalType:     source.signalType,
            signalCategory: source.signalCategory,
            signalValue:    value,
            severity:       (['LOW','MODERATE','HIGH','CRITICAL'].includes(sig.severity) ? sig.severity : 'LOW') as any,
            confidence:     Math.min(100, Math.max(0, Number(sig.confidence ?? 40))),
            metadata:       { query, url: sig.url ?? null, source: source.name },
          })
          totalSignals++

          // High-severity competitor signals → wake ALIS immediately
          if (
            source.signalCategory === 'COMPETITOR' &&
            (sig.severity === 'HIGH' || sig.severity === 'CRITICAL')
          ) {
            KimmpSystemDispatcher.run('ALIS', {
              trigger: 'event.scout.competitor.high',
              input:   `Urgent competitor intelligence from Scout: ${value}. Analyse competitive implications and update our positioning strategy accordingly.`,
            }).catch(() => {})
          }
        }

        // Log job record
        await (prisma as any).kimmpScoutJob.create({
          data: {
            sourceName:     source.name,
            query,
            resultsFound:   results.length,
            signalsEmitted: signals.length,
            status:         'COMPLETED',
          },
        }).catch(() => {})

      } catch (err: any) {
        logger.warn(`[KIMMP:SCOUT] ${source.name} — "${query}": ${err.message}`)
        await (prisma as any).kimmpScoutJob.create({
          data: { sourceName: source.name, query, resultsFound: 0, signalsEmitted: 0, status: 'FAILED' },
        }).catch(() => {})
      }

      // Rate limit between queries
      await new Promise(r => setTimeout(r, 1200))
    }

    return { signals: totalSignals, queries: totalQueries }
  }

  static async runAll(): Promise<{ source: string; signals: number }[]> {
    const results: { source: string; signals: number }[] = []
    for (const source of SCOUT_SOURCES) {
      const { signals } = await this.runSource(source)
      results.push({ source: source.name, signals })
    }
    return results
  }

  static async getRecentJobs(limit = 20): Promise<any[]> {
    try {
      return await (prisma as any).kimmpScoutJob.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    } catch {
      return []
    }
  }
}
