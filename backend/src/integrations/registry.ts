// F6 — Connector Registry
// Replaces the hardcoded Platform union with an open-ended registry.
// Any connector that implements ConnectorManifest + IntegrationAdapter can register.
// KIMMP asks "who can createIssue?" — registry answers, not hardcoded conditionals.

import type { IntegrationAdapter, IntegrationConfig, IntegrationResult, IntegrationTestResult } from './types'

export type ConnectorCategory =
  | 'COMMUNICATION'
  | 'PROJECT_MANAGEMENT'
  | 'CRM'
  | 'VERSION_CONTROL'
  | 'HELPDESK'
  | 'ERP'
  | 'ANALYTICS'
  | 'CLOUD'
  | 'HR'
  | 'FINANCE'

export interface ConnectorManifest {
  platform:     string            // unique slug — 'slack' | 'jira' | 'hubspot' | ...
  displayName:  string
  icon:         string            // emoji or URL
  category:     ConnectorCategory
  description:  string
  docsUrl?:     string
  version:      string
  authFields:   Array<{ key: string; label: string; secret: boolean; placeholder?: string; description?: string }>
  capabilities: string[]          // ['sendMessage', 'createIssue', ...] — action names
  // What semantic entity types this connector can provide
  entityTypes?: Array<{
    externalType:   string        // 'Account' | 'Contact' | ...
    suggestedOntologyType: string // 'CLIENT' | 'PERSON' | ...
    description:    string
  }>
}

export interface RegisteredConnector {
  manifest: ConnectorManifest
  adapter:  IntegrationAdapter
}

// ── Registry singleton ────────────────────────────────────────────────────────

class ConnectorRegistrySingleton {
  private readonly connectors = new Map<string, RegisteredConnector>()

  register(manifest: ConnectorManifest, adapter: IntegrationAdapter): void {
    this.connectors.set(manifest.platform, { manifest, adapter })
  }

  get(platform: string): RegisteredConnector | undefined {
    return this.connectors.get(platform)
  }

  list(): ConnectorManifest[] {
    return [...this.connectors.values()].map(c => c.manifest)
  }

  listByCategory(category: ConnectorCategory): ConnectorManifest[] {
    return this.list().filter(m => m.category === category)
  }

  // KIMMP capability query: "who can createIssue?"
  whoCanDo(capability: string): string[] {
    return [...this.connectors.values()]
      .filter(c => c.manifest.capabilities.includes(capability))
      .map(c => c.manifest.platform)
  }

  // All unique capabilities across all connectors
  allCapabilities(): Array<{ capability: string; platforms: string[] }> {
    const caps = new Map<string, string[]>()
    for (const { manifest } of this.connectors.values()) {
      for (const cap of manifest.capabilities) {
        if (!caps.has(cap)) caps.set(cap, [])
        caps.get(cap)!.push(manifest.platform)
      }
    }
    return [...caps.entries()].sort().map(([capability, platforms]) => ({ capability, platforms }))
  }

  // All connectors that know about a given external entity type
  whoMapsEntityType(externalType: string): string[] {
    return [...this.connectors.values()]
      .filter(c => c.manifest.entityTypes?.some(e => e.externalType === externalType))
      .map(c => c.manifest.platform)
  }

  // Test a connector
  async test(platform: string, config: IntegrationConfig, userId: string): Promise<IntegrationTestResult> {
    const conn = this.connectors.get(platform)
    if (!conn) return { ok: false, message: `Connector '${platform}' not registered` }
    try {
      return await conn.adapter.test(config)
    } catch (e: any) {
      return { ok: false, message: e.message ?? 'Unknown error' }
    }
  }

  // Execute an action
  async execute(platform: string, action: string, params: Record<string, any>, config: IntegrationConfig): Promise<IntegrationResult> {
    const conn = this.connectors.get(platform)
    if (!conn) return { ok: false, summary: `Connector '${platform}' not registered`, error: 'UNKNOWN_PLATFORM' }
    try {
      return await conn.adapter.execute(action, params, config)
    } catch (e: any) {
      return { ok: false, summary: `Exception: ${e.message}`, error: 'EXCEPTION' }
    }
  }

  get size(): number { return this.connectors.size }
}

export const ConnectorRegistry = new ConnectorRegistrySingleton()
