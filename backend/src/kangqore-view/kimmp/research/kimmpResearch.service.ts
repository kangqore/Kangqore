// ---------------------------------------------------------------------------
// KIMMP Research Agent — active competitive intelligence
//
// Accepts a natural-language research question, generates sub-queries via
// Claude Haiku, runs parallel web searches, and synthesises a structured
// competitive-intelligence report via Claude Sonnet.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk'
import { withWaandax } from '../llm/waandaxAnthropic'
import { WebSearchService } from '../scout/webSearch.service'
import { SignalLedger } from '../signals/signalLedger.service'
import { prisma } from '../../../lib/prisma'
import logger from '../../../utils/logger'

export interface ResearchResult {
  id: string
  question: string
  domain?: string
  summary: string
  competitors: { name: string; strengths: string[]; weaknesses: string[]; url?: string }[]
  marketGaps: string[]
  opportunities: string[]
  threats: string[]
  recommendation: string
  sources: string[]
  confidence: number
  signalId: string | null
  generatedAt: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fallbackResult(question: string, domain?: string): ResearchResult {
  return {
    id: `fallback-${Date.now()}`,
    question,
    domain,
    summary: 'Research unavailable — AI engines busy or offline; retry shortly. (Deep research needs Anthropic credits; web search needs SERPER/TAVILY keys.)',
    competitors: [],
    marketGaps: [],
    opportunities: [],
    threats: [],
    recommendation: '',
    sources: [],
    confidence: 0,
    signalId: null,
    generatedAt: new Date().toISOString(),
  }
}

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null
  return withWaandax(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }))
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class KimmpResearchService {
  // ── query ────────────────────────────────────────────────────────────────────
  static async query(question: string, domain?: string): Promise<ResearchResult> {
    const client = getClient()
    if (!client) {
      logger.warn('[KIMMP:RESEARCH] ANTHROPIC_API_KEY not set — returning fallback')
      return fallbackResult(question, domain)
    }

    try {
      // ── Step 1: Generate sub-queries via Claude Haiku ─────────────────────
      let subQueries: string[] = [
        question,
        `${question} India 2026`,
        `${question} market analysis`,
        `${question} competitors`,
      ]

      try {
        const haikuResp = await client.messages.create({
          model: 'claude-haiku-4-5',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: `Research question: "${question}"${domain ? ` Domain: ${domain}` : ''}`,
            },
          ],
          system:
            'You are a research query generator for KIMMP, the intelligence system of Kangqore — a B2B tech firm in India. ' +
            'Generate exactly 4 web search queries to answer the research question. ' +
            'Focus on: Indian market, specific geographies if mentioned, business context. ' +
            'Return JSON array: ["query 1", "query 2", "query 3", "query 4"]',
        })
        const raw = (haikuResp.content[0] as any)?.text ?? ''
        const match = raw.match(/\[[\s\S]*?\]/)
        if (match) {
          const parsed = JSON.parse(match[0])
          if (Array.isArray(parsed) && parsed.length > 0) {
            subQueries = parsed.slice(0, 4).map(String)
          }
        }
      } catch (e) {
        logger.warn('[KIMMP:RESEARCH] Haiku query generation failed, using fallback queries:', (e as Error).message)
      }

      // ── Step 2: Parallel web searches ────────────────────────────────────
      const searchSettled = await Promise.allSettled(
        subQueries.map(q => WebSearchService.search(q, 5))
      )

      // Flatten + deduplicate by URL
      const seen = new Set<string>()
      const allResults: { title: string; url: string; snippet: string }[] = []
      for (const settled of searchSettled) {
        if (settled.status !== 'fulfilled') continue
        for (const r of settled.value) {
          if (r.url && !seen.has(r.url)) {
            seen.add(r.url)
            allResults.push(r)
          }
        }
      }

      // ── Step 3: Deep analysis via Claude Sonnet ───────────────────────────
      const formattedSources = allResults
        .map((r, i) => `[${i + 1}] ${r.title}\n    URL: ${r.url}\n    ${r.snippet}`)
        .join('\n\n')

      const sonnetResp = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content:
              `Research question: "${question}"\n\n` +
              `Search results (${allResults.length} sources):\n${formattedSources}\n\n` +
              `Return ONLY valid JSON:\n` +
              `{\n` +
              `  "summary": "3-4 sentence executive brief — most important finding first",\n` +
              `  "competitors": [\n` +
              `    { "name": "...", "strengths": ["..."], "weaknesses": ["..."], "url": "..." }\n` +
              `  ],\n` +
              `  "marketGaps": ["specific gap 1", "specific gap 2"],\n` +
              `  "opportunities": ["opportunity 1 for Kangqore"],\n` +
              `  "threats": ["threat 1"],\n` +
              `  "recommendation": "1-2 sentences: specific positioning recommendation for Kangqore",\n` +
              `  "confidence": 75\n` +
              `}\n\n` +
              `If no competitors found, return empty array. If no market gaps identified, return empty array. Always include at least one recommendation.`,
          },
        ],
        system:
          'You are KIMMP — the strategic intelligence engine of Kangqore, an Indian B2B tech firm. ' +
          'The ADMIN has requested a competitive research report. ' +
          'Be specific, cite company names, pricing, geographies. ' +
          'Think like a McKinsey analyst but writing for a startup CEO.',
      })

      const rawText = (sonnetResp.content[0] as any)?.text ?? '{}'
      let parsedResult: any = {}
      try {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/)
        if (jsonMatch) parsedResult = JSON.parse(jsonMatch[0])
      } catch (e) {
        logger.warn('[KIMMP:RESEARCH] Failed to parse Sonnet JSON response:', (e as Error).message)
        parsedResult = {
          summary: rawText.slice(0, 500),
          competitors: [],
          marketGaps: [],
          opportunities: [],
          threats: [],
          recommendation: '',
          confidence: 50,
        }
      }

      // ── Step 4: Emit signal ───────────────────────────────────────────────
      const signalId = await SignalLedger.record({
        sourceModule: 'kimmp',
        signalType: 'RESEARCH_COMPLETED',
        signalCategory: 'MARKET',
        signalValue: `Research: ${question.slice(0, 200)}`,
        severity: 'MODERATE',
        confidence: parsedResult.confidence ?? 70,
        metadata: {
          question,
          domain,
          competitorCount: parsedResult.competitors?.length ?? 0,
        },
      }).catch(() => null)

      // ── Step 5: Persist ───────────────────────────────────────────────────
      const sources = allResults.map(r => r.url).filter(Boolean).slice(0, 10)

      const saved = await (prisma as any).kimmpResearchResult.create({
        data: {
          question,
          domain: domain ?? null,
          summary: parsedResult.summary ?? '',
          content: parsedResult,
          sources,
          confidence: parsedResult.confidence ?? 70,
          signalId,
        },
      })

      // ── Step 6: Return ────────────────────────────────────────────────────
      return {
        id: saved.id,
        question,
        domain,
        summary: parsedResult.summary ?? '',
        competitors: parsedResult.competitors ?? [],
        marketGaps: parsedResult.marketGaps ?? [],
        opportunities: parsedResult.opportunities ?? [],
        threats: parsedResult.threats ?? [],
        recommendation: parsedResult.recommendation ?? '',
        sources,
        confidence: parsedResult.confidence ?? 70,
        signalId,
        generatedAt: saved.generatedAt.toISOString(),
      }
    } catch (err: any) {
      logger.error('[KIMMP:RESEARCH] Research failed:', err.message)
      return fallbackResult(question, domain)
    }
  }

  // ── list ─────────────────────────────────────────────────────────────────────
  static async list(limit = 10): Promise<ResearchResult[]> {
    try {
      const rows = await (prisma as any).kimmpResearchResult.findMany({
        orderBy: { generatedAt: 'desc' },
        take: limit,
      })
      return rows.map((r: any) => ({
        id: r.id,
        question: r.question,
        domain: r.domain ?? undefined,
        summary: r.summary,
        competitors: (r.content as any)?.competitors ?? [],
        marketGaps: (r.content as any)?.marketGaps ?? [],
        opportunities: (r.content as any)?.opportunities ?? [],
        threats: (r.content as any)?.threats ?? [],
        recommendation: (r.content as any)?.recommendation ?? '',
        sources: r.sources ?? [],
        confidence: r.confidence,
        signalId: r.signalId ?? null,
        generatedAt: r.generatedAt.toISOString(),
      }))
    } catch {
      return []
    }
  }

  // ── getById ──────────────────────────────────────────────────────────────────
  static async getById(id: string): Promise<ResearchResult | null> {
    try {
      const r = await (prisma as any).kimmpResearchResult.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        question: r.question,
        domain: r.domain ?? undefined,
        summary: r.summary,
        competitors: (r.content as any)?.competitors ?? [],
        marketGaps: (r.content as any)?.marketGaps ?? [],
        opportunities: (r.content as any)?.opportunities ?? [],
        threats: (r.content as any)?.threats ?? [],
        recommendation: (r.content as any)?.recommendation ?? '',
        sources: r.sources ?? [],
        confidence: r.confidence,
        signalId: r.signalId ?? null,
        generatedAt: r.generatedAt.toISOString(),
      }
    } catch {
      return null
    }
  }
}
