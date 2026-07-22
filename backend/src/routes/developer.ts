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

/**
 * GET /admin/developer/sdk/typescript
 * Serves the Kangqore TypeScript SDK as a downloadable .ts file
 */
developerRouter.get('/sdk/typescript', (_req: Request, res: Response) => {
  const sdk = `/**
 * Kangqore OS — TypeScript SDK v1.0
 * Auto-generated — https://kangqore.com/docs/sdk
 *
 * Usage:
 *   import { KangqoreClient } from './kangqore-sdk'
 *   const kq = new KangqoreClient({ apiKey: 'kq_live_...' })
 *   const ois = await kq.getOIS()
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface OISSnapshot {
  id:              string
  oisScore:        number
  decisionScore:   number
  workflowScore:   number
  aiScore:         number
  enterpriseScore: number
  goalScore:       number
  learningScore:   number
  businessScore:   number
  trustScore:      number
  adoptionScore:   number
  label:           'AUTO' | 'BASELINE' | 'CHECKPOINT'
  triggeredBy:     string
  createdAt:       string
}

export interface Signal {
  id:             string
  sourceModule:   string
  signalType:     string
  signalCategory: 'BEHAVIOR' | 'INTENT' | 'MARKET' | 'CONTENT' | 'RISK' | 'SYSTEM'
  signalValue:    string
  confidence:     number
  severity:       'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  status:         string
  createdAt:      string
}

export interface CreateSignalInput {
  sourceModule:   string
  signalType:     string
  signalCategory: 'BEHAVIOR' | 'INTENT' | 'MARKET' | 'CONTENT' | 'RISK' | 'SYSTEM'
  signalValue:    string
  confidence?:    number
  severity?:      'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  metadata?:      Record<string, unknown>
}

export interface Decision {
  id:           string
  question:     string
  reasoning:    string
  evidence:     Array<{ source: string; type: string; snippet: string }>
  options:      Array<{ label: string; recommendation: string; pros: string[]; cons: string[]; roi?: string; confidence: number }>
  confidence:   number
  selected?:    string
  outcome?:     string
  agentsMixed:  string[]
  workflowName?: string
  stepName?:    string
  createdAt:    string
  resolvedAt?:  string
}

export interface CreateDecisionInput {
  question:      string
  context?:      Record<string, unknown>
  workflowName?: string
  stepName?:     string
}

export interface Blueprint {
  id:          string
  name:        string
  version:     string
  pack?:       string
  industry?:   string
  description?: string
  status:      'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  checksum:    string
  deployedAt?: string
  importedAt?: string
  createdAt:   string
}

export interface CreateBlueprintInput {
  name:         string
  version?:     string
  pack?:        string
  industry?:    string
  description?: string
  spec:         Record<string, unknown>
  status?:      'DRAFT' | 'ACTIVE'
}

export interface PaginatedResponse<T> {
  data:  T[]
  total: number
  page:  number
  limit: number
}

export interface KangqoreClientOptions {
  apiKey:   string
  baseUrl?: string
}

// ── Client ─────────────────────────────────────────────────────────────────────

export class KangqoreClient {
  private readonly headers: Record<string, string>
  private readonly base:    string

  constructor({ apiKey, baseUrl = 'https://yourdomain.com' }: KangqoreClientOptions) {
    this.base    = baseUrl.replace(/\\/$/, '') + '/api/v1'
    this.headers = {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type':  'application/json',
    }
  }

  private async get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
    const url = new URL(this.base + path)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
    const res = await fetch(url.toString(), { headers: this.headers })
    if (!res.ok) throw new Error(\`Kangqore API error \${res.status}: \${await res.text()}\`)
    return res.json() as Promise<T>
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(this.base + path, {
      method:  'POST',
      headers: this.headers,
      body:    JSON.stringify(body),
    })
    if (!res.ok) throw new Error(\`Kangqore API error \${res.status}: \${await res.text()}\`)
    return res.json() as Promise<T>
  }

  private async patch<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(this.base + path, {
      method:  'PATCH',
      headers: this.headers,
      body:    JSON.stringify(body),
    })
    if (!res.ok) throw new Error(\`Kangqore API error \${res.status}: \${await res.text()}\`)
    return res.json() as Promise<T>
  }

  // ── OIS ───────────────────────────────────────────────────────────────────

  async getOIS(opts: { limit?: number; label?: 'AUTO' | 'BASELINE' | 'CHECKPOINT' } = {}): Promise<{ data: OISSnapshot[]; count: number }> {
    return this.get('/ois', opts as Record<string, string | number>)
  }

  async createOISSnapshot(scores: Omit<OISSnapshot, 'id' | 'triggeredBy' | 'createdAt'> & { label?: string }): Promise<{ data: OISSnapshot }> {
    return this.post('/ois/snapshot', scores)
  }

  // ── Signals ───────────────────────────────────────────────────────────────

  async getSignals(opts: { page?: number; limit?: number; category?: string; severity?: string; status?: string } = {}): Promise<PaginatedResponse<Signal>> {
    return this.get('/signals', opts as Record<string, string | number>)
  }

  async createSignal(input: CreateSignalInput): Promise<{ data: Signal }> {
    return this.post('/signals', input)
  }

  // ── Decisions ─────────────────────────────────────────────────────────────

  async getDecisions(opts: { page?: number; limit?: number; resolved?: boolean } = {}): Promise<PaginatedResponse<Decision>> {
    return this.get('/decisions', opts as Record<string, string | number>)
  }

  async createDecision(input: CreateDecisionInput): Promise<{ data: Decision }> {
    return this.post('/decisions', input)
  }

  async selectDecision(id: string, selected: string, outcome?: string): Promise<{ data: Decision }> {
    return this.patch(\`/decisions/\${id}/select\`, { selected, outcome })
  }

  // ── Blueprints ────────────────────────────────────────────────────────────

  async getBlueprints(opts: { page?: number; limit?: number; status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' } = {}): Promise<PaginatedResponse<Blueprint>> {
    return this.get('/blueprints', opts as Record<string, string | number>)
  }

  async createBlueprint(input: CreateBlueprintInput): Promise<{ data: Blueprint }> {
    return this.post('/blueprints', input)
  }
}

// ── Quick-start example ────────────────────────────────────────────────────────

/*
import { KangqoreClient } from './kangqore-sdk'

const kq = new KangqoreClient({
  apiKey:  'kq_live_YOUR_KEY_HERE',
  baseUrl: 'https://yourdomain.com',
})

// Get latest OIS score
const { data: [latest] } = await kq.getOIS({ limit: 1 })
console.log('OIS:', latest.oisScore)

// Ingest a signal from your CRM
await kq.createSignal({
  sourceModule:   'crm',
  signalType:     'deal_won',
  signalCategory: 'INTENT',
  signalValue:    'Q3 enterprise deal closed — £250k ACV',
  confidence:     0.95,
  severity:       'HIGH',
})

// Ask KIMMP a strategic question
const { data: decision } = await kq.createDecision({
  question: 'Should we expand into the BFSI vertical in Q4?',
})
console.log('Decision ID:', decision.id)
*/
`

  res.setHeader('Content-Disposition', 'attachment; filename="kangqore-sdk.ts"')
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.send(sdk)
})
