/**
 * @openapi
 * tags:
 *   - name: Developer
 *     description: Programmatic API key management
 */
import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import crypto from 'crypto'
import { OntologySdkGenerator } from '../services/ontologySdkGenerator.service'

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
    select:  { id: true, name: true, prefix: true, lastUsedAt: true, expiresAt: true, createdAt: true, scopedObjectTypes: true, scopedActions: true },
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

  const { name, expiresInDays, scopedObjectTypes, scopedActions } = req.body
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
    data: {
      userId, name: name.trim(), keyHash, prefix, expiresAt,
      scopedObjectTypes: Array.isArray(scopedObjectTypes) ? scopedObjectTypes : [],
      scopedActions: Array.isArray(scopedActions) ? scopedActions : [],
    },
    select: { id: true, name: true, prefix: true, expiresAt: true, createdAt: true, scopedObjectTypes: true, scopedActions: true },
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
developerRouter.get('/sdk/typescript', async (_req: Request, res: Response) => {
  const platformSdk = `/**
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

  // S306 — the platform SDK above (OIS/Signals/Decisions/Blueprints) stays
  // hand-maintained since those domains have no live-schema source of truth.
  // The Ontology section below is generated live from OntologyObjectType /
  // OntologyAction / ObjectSet definitions — this half of the S91 download
  // now updates itself as the ontology evolves.
  let ontologySdk = ''
  try {
    ontologySdk = await OntologySdkGenerator.typescript()
  } catch {
    ontologySdk = '// Ontology SDK generation failed — see GET /admin/ontology/sdk/typescript for details\n'
  }

  const sdk = `${platformSdk}\n\n// ═══════════════════════════════════════════════════════════════════════════\n// Ontology SDK (generated — S306) — typed access to your live OntologyObjectTypes\n// ═══════════════════════════════════════════════════════════════════════════\n\n${ontologySdk}`

  res.setHeader('Content-Disposition', 'attachment; filename="kangqore-sdk.ts"')
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.send(sdk)
})

// ─── S122: Python SDK v2 ───────────────────────────────────────────────────────

developerRouter.get('/sdk/python', async (_req: Request, res: Response) => {
  const platformSdk = `"""
Kangqore OS — Python SDK v2.0
Auto-generated — https://kangqore.com/docs/sdk/python

Install:
    pip install requests

Usage:
    from kangqore import KangqoreClient
    kq = KangqoreClient(api_key="kq_live_...", base_url="https://yourdomain.com")
    ois = kq.get_ois()
    print(ois["data"][0]["oisScore"])
"""
from __future__ import annotations
import hashlib, hmac, json, time
from typing import Any, Dict, List, Optional
import requests


class KangqoreError(Exception):
    def __init__(self, status: int, message: str):
        super().__init__(f"[{status}] {message}")
        self.status = status


class KangqoreClient:
    def __init__(self, api_key: str, base_url: str = "https://yourdomain.com"):
        self._key = api_key
        self._base = base_url.rstrip("/") + "/api/v1"
        self._headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    def _get(self, path: str, params: Optional[Dict] = None) -> Any:
        r = requests.get(self._base + path, headers=self._headers, params=params or {})
        if not r.ok:
            raise KangqoreError(r.status_code, r.text)
        return r.json()

    def _post(self, path: str, body: Dict) -> Any:
        r = requests.post(self._base + path, headers=self._headers, json=body)
        if not r.ok:
            raise KangqoreError(r.status_code, r.text)
        return r.json()

    def _patch(self, path: str, body: Dict) -> Any:
        r = requests.patch(self._base + path, headers=self._headers, json=body)
        if not r.ok:
            raise KangqoreError(r.status_code, r.text)
        return r.json()

    # ── OIS ──────────────────────────────────────────────────────────────────

    def get_ois(self, limit: int = 10, label: Optional[str] = None) -> Dict:
        params: Dict = {"limit": limit}
        if label:
            params["label"] = label
        return self._get("/ois", params)

    def create_ois_snapshot(self, scores: Dict) -> Dict:
        return self._post("/ois/snapshot", scores)

    # ── Signals ───────────────────────────────────────────────────────────────

    def get_signals(self, page: int = 1, limit: int = 20,
                    category: Optional[str] = None, severity: Optional[str] = None) -> Dict:
        params: Dict = {"page": page, "limit": limit}
        if category: params["category"] = category
        if severity: params["severity"] = severity
        return self._get("/signals", params)

    def create_signal(self, source_module: str, signal_type: str,
                      signal_category: str, signal_value: str,
                      confidence: float = 0.9, severity: str = "LOW",
                      metadata: Optional[Dict] = None) -> Dict:
        return self._post("/signals", {
            "sourceModule": source_module, "signalType": signal_type,
            "signalCategory": signal_category, "signalValue": signal_value,
            "confidence": confidence, "severity": severity,
            "metadata": metadata or {},
        })

    # ── Decisions ─────────────────────────────────────────────────────────────

    def get_decisions(self, page: int = 1, limit: int = 20) -> Dict:
        return self._get("/decisions", {"page": page, "limit": limit})

    def create_decision(self, question: str, workflow_name: Optional[str] = None,
                        step_name: Optional[str] = None) -> Dict:
        body: Dict = {"question": question}
        if workflow_name: body["workflowName"] = workflow_name
        if step_name:     body["stepName"]     = step_name
        return self._post("/decisions", body)

    def select_decision(self, decision_id: str, selected: str,
                        outcome: Optional[str] = None) -> Dict:
        return self._patch(f"/decisions/{decision_id}/select", {"selected": selected, "outcome": outcome})

    # ── Blueprints ────────────────────────────────────────────────────────────

    def get_blueprints(self, page: int = 1, limit: int = 20,
                       status: Optional[str] = None) -> Dict:
        params: Dict = {"page": page, "limit": limit}
        if status: params["status"] = status
        return self._get("/blueprints", params)

    def create_blueprint(self, name: str, spec: Dict, version: str = "1.0",
                         industry: Optional[str] = None, enabled_modules: Optional[List[str]] = None) -> Dict:
        return self._post("/blueprints", {
            "name": name, "spec": spec, "version": version,
            "industry": industry, "enabledModules": enabled_modules or [],
        })

    # ── Webhooks ─────────────────────────────────────────────────────────────

    @staticmethod
    def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
        """Verify an inbound Kangqore webhook signature (HMAC-SHA256)."""
        expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature)


# ── Quick-start ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    kq = KangqoreClient(api_key="kq_live_YOUR_KEY_HERE", base_url="https://yourdomain.com")

    ois = kq.get_ois(limit=1)
    print("Latest OIS:", ois["data"][0]["oisScore"] if ois.get("data") else "no data")

    kq.create_signal(
        source_module="crm", signal_type="deal_won",
        signal_category="INTENT", signal_value="Q3 enterprise deal closed — £250k ACV",
        confidence=0.95, severity="HIGH",
    )
    print("Signal created")
`

  let ontologySdk = ''
  try {
    ontologySdk = await OntologySdkGenerator.python()
  } catch {
    ontologySdk = '# Ontology SDK generation failed — see GET /admin/ontology/sdk/python for details\n'
  }

  const sdk = `${platformSdk}\n\n# ═══════════════════════════════════════════════════════════════════════════\n# Ontology SDK (generated — S306) — typed access to your live OntologyObjectTypes\n# ═══════════════════════════════════════════════════════════════════════════\n\n${ontologySdk}`

  res.setHeader('Content-Disposition', 'attachment; filename="kangqore_client.py"')
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.send(sdk)
})

// ─── S122: OpenAPI 3.1 spec ───────────────────────────────────────────────────

developerRouter.get('/openapi.json', (_req: Request, res: Response) => {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Kangqore OS API',
      version: '2.0.0',
      description: 'Public API for the Kangqore Operating System — signals, decisions, blueprints, OIS.',
      contact: { name: 'Kangqore Developer Support', email: 'dev@kangqore.com' },
      license: { name: 'Commercial', url: 'https://kangqore.com/terms' },
    },
    servers: [{ url: '/api/v1', description: 'Kangqore OS REST API v1' }],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Programmatic API key prefixed kq_live_' },
      },
      schemas: {
        Signal: {
          type: 'object',
          properties: {
            id: { type: 'string' }, sourceModule: { type: 'string' }, signalType: { type: 'string' },
            signalCategory: { type: 'string', enum: ['BEHAVIOR','INTENT','MARKET','CONTENT','RISK','SYSTEM'] },
            signalValue: { type: 'string' }, confidence: { type: 'number', minimum: 0, maximum: 100 },
            severity: { type: 'string', enum: ['LOW','MODERATE','HIGH','CRITICAL'] },
            status: { type: 'string' }, createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Decision: {
          type: 'object',
          properties: {
            id: { type: 'string' }, question: { type: 'string' }, reasoning: { type: 'string' },
            confidence: { type: 'number' }, selected: { type: 'string' }, outcome: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Blueprint: {
          type: 'object',
          properties: {
            id: { type: 'string' }, name: { type: 'string' }, version: { type: 'string' },
            industry: { type: 'string' }, status: { type: 'string', enum: ['DRAFT','ACTIVE','ARCHIVED'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        OISSnapshot: {
          type: 'object',
          properties: {
            id: { type: 'string' }, oisScore: { type: 'number', minimum: 0, maximum: 100 },
            label: { type: 'string', enum: ['AUTO','BASELINE','CHECKPOINT'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: { error: { type: 'string' } },
        },
      },
    },
    paths: {
      '/ois': {
        get: {
          tags: ['OIS'], summary: 'List OIS snapshots',
          parameters: [
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'label', in: 'query', schema: { type: 'string', enum: ['AUTO','BASELINE','CHECKPOINT'] } },
          ],
          responses: { '200': { description: 'OIS snapshots', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { '$ref': '#/components/schemas/OISSnapshot' } } } } } } } },
        },
      },
      '/signals': {
        get: { tags: ['Signals'], summary: 'List intelligence signals',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'severity', in: 'query', schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'Signals list', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { '$ref': '#/components/schemas/Signal' } } } } } } } },
        },
        post: { tags: ['Signals'], summary: 'Ingest a new signal',
          requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/Signal' } } } },
          responses: { '201': { description: 'Signal created' }, '400': { description: 'Validation error', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Error' } } } } },
        },
      },
      '/decisions': {
        get: { tags: ['Decisions'], summary: 'List strategic decisions',
          responses: { '200': { description: 'Decisions list', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { '$ref': '#/components/schemas/Decision' } } } } } } } },
        },
        post: { tags: ['Decisions'], summary: 'Create a KIMMP strategic decision',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { question: { type: 'string' }, workflowName: { type: 'string' }, stepName: { type: 'string' } }, required: ['question'] } } } },
          responses: { '201': { description: 'Decision created', content: { 'application/json': { schema: { '$ref': '#/components/schemas/Decision' } } } } },
        },
      },
      '/blueprints': {
        get: { tags: ['Blueprints'], summary: 'List deployment blueprints',
          responses: { '200': { description: 'Blueprints', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { '$ref': '#/components/schemas/Blueprint' } } } } } } } },
        },
        post: { tags: ['Blueprints'], summary: 'Create a new Blueprint',
          requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/Blueprint' } } } },
          responses: { '201': { description: 'Blueprint created' } },
        },
      },
    },
    tags: [
      { name: 'OIS', description: 'Operational Intelligence Score' },
      { name: 'Signals', description: 'KIMMP intelligence signals' },
      { name: 'Decisions', description: 'KIMMP strategic decisions' },
      { name: 'Blueprints', description: 'Customer deployment blueprints' },
    ],
  }
  res.json(spec)
})

// ─── S122: Webhook HMAC verification ─────────────────────────────────────────

developerRouter.post('/webhook/verify', (_req: Request, res: Response) => {
  const { payload, signature, secret } = _req.body ?? {}
  if (!payload || !signature || !secret) {
    res.status(400).json({ error: 'payload, signature, secret required' }); return
  }
  const expected = crypto
    .createHmac('sha256', secret)
    .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
    .digest('hex')
  const valid = crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex').slice(0, expected.length / 2 * 2))
  res.json({ valid, expected: `sha256=${expected}` })
})

developerRouter.post('/webhook/sign', (_req: Request, res: Response) => {
  const { payload, secret } = _req.body ?? {}
  if (!payload || !secret) { res.status(400).json({ error: 'payload and secret required' }); return }
  const sig = crypto
    .createHmac('sha256', secret)
    .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
    .digest('hex')
  res.json({ signature: `sha256=${sig}`, timestamp: Date.now() })
})

// Overshadow Roadmap P6.3 — this previously listed 11 event types
// (ois.updated, signal.created, partner.commission, etc.) that grep confirms
// are never emitted anywhere in the codebase — pure aspirational
// documentation disconnected from the two real webhook subsystems. Fixed to
// the 4 event types that are actually deliverable today, matching the
// defaults on OntologySubscription and KimmpOperationalSubscription.
developerRouter.get('/webhook/event-types', (_req: Request, res: Response) => {
  res.json({
    eventTypes: [
      { type: 'object.created', system: 'Ontology Subscriptions', description: 'A new OntologyObject was created, optionally scoped to one object type', example: { objectId: 'abc', typeId: 'def', properties: {} } },
      { type: 'object.updated', system: 'Ontology Subscriptions', description: 'An existing OntologyObject was updated', example: { objectId: 'abc', typeId: 'def', properties: {} } },
      { type: 'eval.drift_alert', system: 'KIMMP Operational Subscriptions', description: 'A golden-prompt benchmark run scored a significant regression against the prior run', example: { id: 'run_abc', totalScore: 71.2, driftAlert: true, driftDelta: -6.4 } },
      { type: 'budget.exceeded', system: 'KIMMP Operational Subscriptions', description: 'A per-user token budget was exceeded with hard-stop enforcement', example: { userId: 'user_abc', usedTokens: 120000, limitTokens: 100000 } },
    ],
    disclaimer: 'These are the only event types either webhook subsystem actually emits — verified against the emitting code, not aspirational.',
  })
})
