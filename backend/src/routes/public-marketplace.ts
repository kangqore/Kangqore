// ---------------------------------------------------------------------------
// Public Marketplace routes — /api/public/marketplace/*
// No auth. Overshadow Roadmap P3.2: a public agent/template marketplace so a
// prospect can see what Agent Studio actually ships with, not just be told
// it has templates. Read-only, PUBLISHED listings only — no admin fields
// (authorEmail, platformFee) exposed.
// ---------------------------------------------------------------------------

import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import logger from '../utils/logger'
import { ensureAgentTemplatesSeeded, ensureToolCallableExpanded } from '../services/agentStudioGrowth.service'

export const publicMarketplaceRouter = Router()

publicMarketplaceRouter.get('/agents', async (_req: Request, res: Response) => {
  try {
    await Promise.all([ensureAgentTemplatesSeeded(), ensureToolCallableExpanded()])
    const [listings, toolCallableActions] = await Promise.all([
      (prisma as any).marketplaceListing.findMany({
        where: { type: 'AGENT', status: 'PUBLISHED' },
        select: { id: true, name: true, slug: true, category: true, description: true, iconEmoji: true, tags: true, installCount: true, manifest: true, publishedAt: true },
        orderBy: { installCount: 'desc' },
      }),
      (prisma as any).ontologyAction.findMany({
        where: { toolCallable: true },
        select: { name: true, displayName: true, description: true, executions: true },
        orderBy: { executions: 'desc' },
      }),
    ])
    res.json({ agentTemplates: listings, governedActions: toolCallableActions, computedAt: new Date().toISOString() })
  } catch (err: any) {
    logger.warn('[public-marketplace] agents failed: ' + err.message)
    res.status(500).json({ error: 'Unable to list agent templates' })
  }
})
