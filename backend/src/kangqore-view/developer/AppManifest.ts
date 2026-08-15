// Phase 5.1 — App Manifest Standard & Validator (`kangqore.manifest.json`)
// Defines the schema, permissions, capabilities, ontology bindings, actions, agents, and UI widgets
// for apps built on Kangqore View Developer Platform.

export type AppCategory = 'CERTIFIED' | 'GOVERNED' | 'AI_NATIVE' | 'ENTERPRISE_READY' | 'COMMUNITY' | 'PARTNER'

export interface AppPermission {
  resource: string
  action: 'READ' | 'WRITE' | 'EXECUTE' | 'ADMIN'
  reason: string
}

export interface OntologyBindingDef {
  objectType: string
  relationshipTypes?: string[]
  cardinalityRules?: string[]
}

export interface ManifestActionDef {
  name: string
  displayName: string
  description: string
  parameters: Array<{
    name: string
    type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'object-ref'
    required?: boolean
    enum?: string[]
    description?: string
  }>
  handlerEndpoint?: string
}

export interface ManifestAgentDef {
  name: string
  role: string
  goal: string
  capabilities: string[]
}

export interface ManifestUiWidgetDef {
  name: string
  title: string
  type: 'BOARD_WIDGET' | 'DASHBOARD_PANEL' | 'NAV_TAB' | 'MODAL'
  entryUrl: string
}

export interface KangqoreAppManifest {
  manifestVersion: '1.0'
  appId: string
  name: string
  version: string
  category: AppCategory
  publisher: {
    name: string
    email: string
    website?: string
  }
  description: string
  iconUrl?: string
  permissions: AppPermission[]
  ontologyBindings: OntologyBindingDef[]
  actions: ManifestActionDef[]
  agents?: ManifestAgentDef[]
  uiWidgets?: ManifestUiWidgetDef[]
  webhooks?: Array<{ event: string; targetUrl: string }>
}

export function validateAppManifest(manifest: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!manifest) return { valid: false, errors: ['Manifest content is null or empty'] }
  if (manifest.manifestVersion !== '1.0') errors.push('Unsupported manifestVersion (must be "1.0")')
  if (!manifest.appId || typeof manifest.appId !== 'string') errors.push('appId is required')
  if (!manifest.name || typeof manifest.name !== 'string') errors.push('name is required')
  if (!manifest.version || typeof manifest.version !== 'string') errors.push('version is required')
  if (!manifest.publisher?.name || !manifest.publisher?.email) errors.push('publisher.name and publisher.email are required')
  if (!Array.isArray(manifest.permissions)) errors.push('permissions must be an array')
  if (!Array.isArray(manifest.ontologyBindings)) errors.push('ontologyBindings must be an array')
  if (!Array.isArray(manifest.actions)) errors.push('actions must be an array')

  return { valid: errors.length === 0, errors }
}
