import { prisma } from '../../../lib/prisma'
import Anthropic from '@anthropic-ai/sdk'
import { withWaandax } from '../llm/waandaxAnthropic'

export type MemoryType = 'USER_PREFERENCE' | 'ORG_KNOWLEDGE' | 'WORKFLOW_INSIGHT'

export interface MemoryEntry {
  memoryType: MemoryType
  key: string
  value: string
  confidence: number
  source: string
  userId?: string
}

export class KimmpMemoryService {
  /** Build a compact memory context block to prepend to Claude's system prompt */
  static async getContext(userId?: string): Promise<string> {
    try {
      const rows = await (prisma as any).kimmpMemory.findMany({
        where: userId ? { OR: [{ userId }, { userId: null }] } : {},
        orderBy: { confidence: 'desc' },
        take: 20,
      })
      if (!rows.length) return ''
      const lines = rows.map((r: any) =>
        `[${r.memoryType}] ${r.key}: ${r.value} (${Math.round(r.confidence * 100)}% conf)`
      )
      return `\n=== KIMMP LEARNED MEMORY ===\n${lines.join('\n')}\n`
    } catch {
      return ''
    }
  }

  /** Upsert a memory entry */
  static async store(entry: MemoryEntry): Promise<void> {
    try {
      await (prisma as any).kimmpMemory.upsert({
        where: { key_memoryType: { key: entry.key, memoryType: entry.memoryType } },
        create: { ...entry, updatedAt: new Date() },
        update: { value: entry.value, confidence: entry.confidence, source: entry.source, updatedAt: new Date() },
      })
    } catch {}
  }

  /** Log an interaction, returns its ID for feedback linkage */
  static async logInteraction(data: {
    query: string; response: string; confidence: number; model: string; navigate: string | null; userId?: string
  }): Promise<string | null> {
    try {
      const row = await (prisma as any).kimmpInteraction.create({
        data: {
          query: data.query.slice(0, 500),
          response: data.response.slice(0, 2000),
          confidence: data.confidence,
          model: data.model,
          navigate: data.navigate,
          userId: data.userId ?? null,
        },
      })
      return row.id as string
    } catch {
      return null
    }
  }

  /** Record operator feedback on an interaction */
  static async recordFeedback(interactionId: string, feedback: 'ACCEPTED' | 'DISMISSED' | 'CORRECTED', correction?: string): Promise<void> {
    try {
      await (prisma as any).kimmpInteraction.update({
        where: { id: interactionId },
        data: { feedback, correction: correction ?? null },
      })
    } catch {}
  }

  /** Asynchronously extract and store key facts from an accepted interaction (fire-and-forget) */
  static extractAndStore(query: string, response: string, userId?: string): void {
    // Only for non-trivial responses that likely contain organizational knowledge
    if (response.length < 100) return
    setImmediate(async () => {
      try {
        const client = withWaandax(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }))
        const r = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: `Extract factual organizational knowledge from this Q&A pair worth remembering. Return a JSON array of 0-3 facts. Each fact: {"key": "short_key", "value": "concise fact", "memoryType": "ORG_KNOWLEDGE|USER_PREFERENCE|WORKFLOW_INSIGHT"}. If nothing memorable, return [].`,
          messages: [{ role: 'user', content: `Q: ${query}\nA: ${response}` }],
        })
        const raw = r.content[0]?.type === 'text' ? r.content[0].text : '[]'
        const match = raw.match(/\[[\s\S]*\]/)
        if (!match) return
        const facts = JSON.parse(match[0])
        for (const f of facts) {
          if (f.key && f.value) {
            await KimmpMemoryService.store({
              memoryType: f.memoryType ?? 'ORG_KNOWLEDGE',
              key: f.key,
              value: f.value,
              confidence: 0.6,
              source: 'inference',
              userId,
            })
          }
        }
      } catch {}
    })
  }

  /** Return all stored memories */
  static async getAll(): Promise<any[]> {
    try {
      return await (prisma as any).kimmpMemory.findMany({ orderBy: { updatedAt: 'desc' }, take: 100 })
    } catch {
      return []
    }
  }
}
