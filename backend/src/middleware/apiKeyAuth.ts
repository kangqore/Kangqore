import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { prisma } from '../lib/prisma'

function hashKey(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex')
}

export async function apiKeyAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing API key. Use: Authorization: Bearer kq_live_...' })
    return
  }

  const raw = authHeader.slice(7).trim()
  if (!raw.startsWith('kq_live_')) {
    res.status(401).json({ error: 'Invalid API key format. Keys must start with kq_live_' })
    return
  }

  const keyHash = hashKey(raw)

  const apiKey = await (prisma as any).programmaticApiKey.findUnique({
    where:  { keyHash },
    select: { id: true, userId: true, revoked: true, expiresAt: true, prefix: true, scopedObjectTypes: true, scopedActions: true },
  }).catch(() => null)

  if (!apiKey) {
    res.status(401).json({ error: 'API key not found' })
    return
  }

  if (apiKey.revoked) {
    res.status(401).json({ error: 'API key has been revoked' })
    return
  }

  if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
    res.status(401).json({ error: 'API key has expired' })
    return
  }

  const user = await (prisma as any).user.findUnique({
    where:  { id: apiKey.userId },
    select: { id: true, email: true, name: true, role: true },
  }).catch(() => null)

  if (!user) {
    res.status(401).json({ error: 'API key owner not found' })
    return
  }

  // Update lastUsedAt async — don't block the request
  ;(prisma as any).programmaticApiKey.update({
    where: { id: apiKey.id },
    data:  { lastUsedAt: new Date() },
  }).catch(() => {})

  // Attach to req so downstream handlers can use it
  ;(req as any).user    = { ...user, userId: user.id }
  ;(req as any).apiKey  = {
    id: apiKey.id,
    prefix: apiKey.prefix,
    scopedObjectTypes: apiKey.scopedObjectTypes ?? [],
    scopedActions: apiKey.scopedActions ?? [],
  }

  next()
}
