/**
 * @kangqore/view-sdk — Kangqore View Developer SDK
 *
 * Four SDKs over one governed transport:
 *   client.actions  — invoke governed actions
 *   client.ontology — query and mutate ontology objects
 *   client.agents   — run and inspect agents
 *   client.ui       — register UI widgets
 *
 * Every call carries the app's OAuth token and is evaluated by the platform's
 * governance kernel. A call that the kernel refuses throws GovernanceError
 * carrying the audit id, so a refusal is always traceable to a record.
 */

export interface KangqoreClientOptions {
  /** Base URL of the Kangqore View instance. */
  baseUrl?: string
  /** OAuth access token (kqat_…). Mutually exclusive with clientId/clientSecret. */
  accessToken?: string
  /** OAuth client credentials — the SDK will fetch and refresh tokens itself. */
  clientId?: string
  clientSecret?: string
  /** Tenant to act against. Required for client_credentials. */
  tenantId?: string
  /** Request timeout in ms. Default 30000. */
  timeoutMs?: number
  fetch?: typeof globalThis.fetch
}

export interface GovernanceDetails {
  outcome: 'ALLOWED' | 'DENIED' | 'PENDING_APPROVAL' | 'ERROR'
  policyName?: string | null
  policyEffect?: string
  creditsCharged: number
  creditsRemaining: number
  inherited: Record<string, boolean>
}

/** Thrown when the governance kernel refuses a call. */
export class GovernanceError extends Error {
  readonly outcome: string
  readonly auditId?: string
  readonly governance?: GovernanceDetails

  constructor(message: string, outcome: string, auditId?: string, governance?: GovernanceDetails) {
    super(message)
    this.name = 'GovernanceError'
    this.outcome = outcome
    this.auditId = auditId
    this.governance = governance
  }
}

export class KangqoreApiError extends Error {
  readonly status: number
  readonly body: unknown
  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'KangqoreApiError'
    this.status = status
    this.body = body
  }
}

interface TokenState {
  accessToken: string
  expiresAt: number
}

class Transport {
  private token: TokenState | null = null

  constructor(private readonly opts: Required<Pick<KangqoreClientOptions, 'baseUrl' | 'timeoutMs'>> & KangqoreClientOptions) {
    if (opts.accessToken) {
      this.token = { accessToken: opts.accessToken, expiresAt: Number.MAX_SAFE_INTEGER }
    }
  }

  private get fetchImpl(): typeof globalThis.fetch {
    const f = this.opts.fetch ?? globalThis.fetch
    if (!f) throw new Error('No fetch implementation available. Pass one via options.fetch.')
    return f
  }

  private async ensureToken(): Promise<string> {
    // Refresh 60s before expiry to avoid racing the boundary.
    if (this.token && this.token.expiresAt > Date.now() + 60_000) {
      return this.token.accessToken
    }
    const { clientId, clientSecret, tenantId } = this.opts
    if (!clientId || !clientSecret) {
      if (this.token) return this.token.accessToken
      throw new Error('No accessToken and no clientId/clientSecret provided.')
    }

    const res = await this.fetchImpl(`${this.opts.baseUrl}/api/developer/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        tenant_id: tenantId,
      }),
    })
    if (!res.ok) {
      throw new KangqoreApiError(`OAuth token request failed (${res.status})`, res.status, await res.text())
    }
    const body = (await res.json()) as { access_token: string; expires_in: number }
    this.token = {
      accessToken: body.access_token,
      expiresAt: Date.now() + body.expires_in * 1000,
    }
    return this.token.accessToken
  }

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = await this.ensureToken()
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.opts.timeoutMs)

    try {
      const res = await this.fetchImpl(`${this.opts.baseUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      })

      const text = await res.text()
      const parsed = text ? safeJson(text) : null

      if (!res.ok) {
        const g = (parsed as any)?.governanceDetails
        if (g && (g.outcome === 'DENIED' || g.outcome === 'PENDING_APPROVAL')) {
          throw new GovernanceError(
            (parsed as any)?.error ?? 'Refused by governance kernel',
            g.outcome,
            (parsed as any)?.auditId,
            g,
          )
        }
        throw new KangqoreApiError(
          (parsed as any)?.error ?? `Request failed (${res.status})`,
          res.status,
          parsed ?? text,
        )
      }
      return parsed as T
    } finally {
      clearTimeout(timer)
    }
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

// ── Action SDK ────────────────────────────────────────────────────────────────

export interface ActionInvokeResult<T = unknown> {
  success: boolean
  executionId: string
  auditId: string
  result?: T
  error?: string
  governanceDetails: GovernanceDetails
}

export class ActionSDK {
  constructor(private readonly t: Transport, private readonly appId: string) {}

  /** Invoke a governed action by name. */
  async invoke<T = unknown>(actionName: string, params: Record<string, unknown> = {}): Promise<ActionInvokeResult<T>> {
    return this.t.request('POST', `/api/developer/apps/${this.appId}/actions/invoke`, { actionName, params })
  }

  /** Authorise and audit without mutating — useful in CI. */
  async dryRun<T = unknown>(actionName: string, params: Record<string, unknown> = {}): Promise<ActionInvokeResult<T>> {
    return this.t.request('POST', `/api/developer/apps/${this.appId}/actions/invoke`, {
      actionName,
      params,
      dryRun: true,
    })
  }

  /** List the actions this app is permitted to invoke in the current tenant. */
  async list(): Promise<Array<{ name: string; displayName: string; description: string }>> {
    return this.t.request('GET', `/api/developer/apps/${this.appId}/actions`)
  }
}

// ── Ontology SDK ──────────────────────────────────────────────────────────────

export interface OntologyObject {
  id: string
  objectType: string
  properties: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface ObjectQuery {
  objectType: string
  where?: Record<string, unknown>
  limit?: number
  offset?: number
}

export class OntologySDK {
  constructor(private readonly t: Transport, private readonly appId: string) {}

  async query(q: ObjectQuery): Promise<{ objects: OntologyObject[]; total: number }> {
    return this.t.request('POST', `/api/developer/apps/${this.appId}/ontology/query`, q)
  }

  async get(objectId: string): Promise<OntologyObject> {
    return this.t.request('GET', `/api/developer/apps/${this.appId}/ontology/objects/${objectId}`)
  }

  async create(objectType: string, properties: Record<string, unknown>): Promise<OntologyObject> {
    return this.t.request('POST', `/api/developer/apps/${this.appId}/ontology/objects`, { objectType, properties })
  }

  async update(objectId: string, properties: Record<string, unknown>): Promise<OntologyObject> {
    return this.t.request('PATCH', `/api/developer/apps/${this.appId}/ontology/objects/${objectId}`, { properties })
  }

  /** Object types this app was granted at install time. */
  async listTypes(): Promise<string[]> {
    return this.t.request('GET', `/api/developer/apps/${this.appId}/ontology/types`)
  }
}

// ── Agent SDK ─────────────────────────────────────────────────────────────────

export interface AgentRunResult {
  runId: string
  agentName: string
  status: 'COMPLETED' | 'FAILED' | 'PENDING_APPROVAL'
  output?: unknown
  auditId: string
}

export class AgentSDK {
  constructor(private readonly t: Transport, private readonly appId: string) {}

  async run(agentName: string, input: { prompt: string; context?: Record<string, unknown> }): Promise<AgentRunResult> {
    return this.t.request('POST', `/api/developer/apps/${this.appId}/agents/${agentName}/run`, input)
  }

  async list(): Promise<Array<{ name: string; role: string; goal: string }>> {
    return this.t.request('GET', `/api/developer/apps/${this.appId}/agents`)
  }
}

// ── UI SDK ────────────────────────────────────────────────────────────────────

export type WidgetType = 'BOARD_WIDGET' | 'DASHBOARD_PANEL' | 'NAV_TAB' | 'MODAL'

export interface UiWidget {
  name: string
  title: string
  type: WidgetType
  entryUrl: string
}

export class UiSDK {
  constructor(private readonly t: Transport, private readonly appId: string) {}

  async register(widget: UiWidget): Promise<{ registered: true; widget: UiWidget }> {
    return this.t.request('POST', `/api/developer/apps/${this.appId}/ui/widgets`, widget)
  }

  async list(): Promise<UiWidget[]> {
    return this.t.request('GET', `/api/developer/apps/${this.appId}/ui/widgets`)
  }
}

// ── Client ────────────────────────────────────────────────────────────────────

export class KangqoreClient {
  readonly actions: ActionSDK
  readonly ontology: OntologySDK
  readonly agents: AgentSDK
  readonly ui: UiSDK

  private readonly transport: Transport

  constructor(appId: string, options: KangqoreClientOptions = {}) {
    if (!appId) throw new Error('appId is required')
    this.transport = new Transport({
      baseUrl: (options.baseUrl ?? 'https://app.kangqoreview.com').replace(/\/$/, ''),
      timeoutMs: options.timeoutMs ?? 30_000,
      ...options,
    })
    this.actions = new ActionSDK(this.transport, appId)
    this.ontology = new OntologySDK(this.transport, appId)
    this.agents = new AgentSDK(this.transport, appId)
    this.ui = new UiSDK(this.transport, appId)
  }

  /** Telemetry for this app — call counts, denials, p95 latency. */
  async telemetry(appId: string, sinceHours = 24) {
    return this.transport.request('GET', `/api/developer/apps/${appId}/telemetry?sinceHours=${sinceHours}`)
  }
}

export default KangqoreClient
