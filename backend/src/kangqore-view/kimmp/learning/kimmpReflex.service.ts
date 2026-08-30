import { prisma } from '../../../lib/prisma'
import logger from '../../../utils/logger'

export interface ReflexMatch {
  id: string
  confidence: number
  cachedResponse: string
  sourceSystem: string
}

/**
 * KimmpReflexCache (The Fast-Response Memory Tier)
 * Retrieves highly accurate (Critic-approved) patterns instantly so KIMMP/Krisnam 
 * can reuse proven logic in real-time, bypassing the slow LLM fine-tuning cycle.
 */
export async function getReflexPattern(
  system: string,
  trigger: string,
  contextKeywords: string[]
): Promise<ReflexMatch | null> {
  try {
    // 1. Fetch High-Quality, Approved Examples for this System
    const candidates = await (prisma as any).kimmpLearningExample.findMany({
      where: {
        agentSystem: system,
        quality: { gte: 0.8 }, // Only highly accurate patterns (Critic passed)
      },
      orderBy: { quality: 'desc' },
      take: 20
    })

    if (!candidates.length) return null

    // 2. Perform basic matching (In a full vector DB, this would be a cosine similarity search)
    let bestMatch: any = null
    let highestScore = 0

    for (const c of candidates) {
      let score = 0
      
      // Exact trigger match boosts score
      if (c.agentType === trigger) score += 50
      
      // Keyword matching
      for (const kw of contextKeywords) {
        if (c.userMessage.toLowerCase().includes(kw.toLowerCase())) score += 10
        if (c.tags.includes(kw)) score += 20
      }

      if (score > highestScore) {
        highestScore = score
        bestMatch = c
      }
    }

    // Require a minimum confidence threshold to use the reflex
    if (highestScore >= 60 && bestMatch) {
      logger.info(`[KimmpReflex] Instant pattern matched for ${system}:${trigger} (Score: ${highestScore})`)
      return {
        id: bestMatch.id,
        confidence: Math.min(highestScore, 99),
        cachedResponse: bestMatch.idealResponse,
        sourceSystem: bestMatch.agentSystem || system
      }
    }

    return null
  } catch (err) {
    logger.error(`[KimmpReflex] Failed to fetch reflex pattern:`, err)
    return null
  }
}
