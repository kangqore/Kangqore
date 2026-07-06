/**
 * @openapi
 * tags:
 *   - name: Developer
 *     description: Programmatic API key management
 */
import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import crypto from 'crypto'

export const developerRouter = Router()

function hashKey(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex')
}

/**
 * @openapi
 * /admin/developer/keys:
 *   get:
 *     tags: [Developer]
 *     summary: List API keys for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of API keys (token masked)
 */
developerRouter.get('/keys', async (req: Request, res: Response) => {
  const userId = (req.user as any)?.userId
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return }

  const keys = await prisma.programmaticApiKey.findMany({
    where:   { userId, revoked: false },
    select:  { id: true, name: true, prefix: true, lastUsedAt: true, expiresAt: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  res.json({ keys })
})

/**
 * @openapi
 * /admin/developer/keys:
 *   post:
 *     tags: [Developer]
 *     summary: Create a new API key
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Integration Key"
 *               expiresInDays:
 *                 type: number
 *                 example: 365
 *     responses:
 *       201:
 *         description: Created key — raw token returned ONCE, store it now
 */
developerRouter.post('/keys', async (req: Request, res: Response) => {
  const userId = (req.user as any)?.userId
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return }

  const { name, expiresInDays } = req.body
  if (!name?.trim()) { res.status(400).json({ error: 'name is required' }); return }

  const existing = await prisma.programmaticApiKey.count({ where: { userId, revoked: false } })
  if (existing >= 10) { res.status(400).json({ error: 'Maximum 10 active keys per user' }); return }

  const rawKey  = `kq_live_${crypto.randomBytes(24).toString('base64url')}`
  const prefix  = rawKey.slice(0, 12)
  const keyHash = hashKey(rawKey)

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 86_400_000)
    : null

  const key = await prisma.programmaticApiKey.create({
    data: { userId, name: name.trim(), keyHash, prefix, expiresAt },
    select: { id: true, name: true, prefix: true, expiresAt: true, createdAt: true },
  })

  res.status(201).json({ key, token: rawKey, warning: 'Store this token now — it will not be shown again.' })
})

/**
 * @openapi
 * /admin/developer/keys/{id}:
 *   delete:
 *     tags: [Developer]
 *     summary: Revoke an API key
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Key revoked
 */
developerRouter.delete('/keys/:id', async (req: Request, res: Response) => {
  const userId = (req.user as any)?.userId
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return }

  await prisma.programmaticApiKey.updateMany({
    where: { id: req.params.id, userId },
    data:  { revoked: true },
  })

  res.json({ ok: true })
})
