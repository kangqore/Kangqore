import { api } from '@lib/api'

export interface SdkField {
  name: string
  type: 'string' | 'number' | 'boolean' | 'geopoint' | 'date' | 'unknown'
  required: boolean
  enumValues?: string[]
  inferred: boolean
}

export interface SdkTypeShape {
  id: string
  name: string
  displayName: string
  fields: SdkField[]
}

export interface SdkActionShape {
  id: string
  name: string
  displayName: string
  typeName: string
  parameters: Array<{ name: string; type: string; required?: boolean; enum?: string[]; description?: string }>
}

export interface SdkObjectSetShape {
  id: string
  name: string
  rootTypeName: string | null
}

export interface SdkSchema {
  types: SdkTypeShape[]
  actions: SdkActionShape[]
  objectSets: SdkObjectSetShape[]
}

export interface SdkVersion {
  id: string
  schemaHash: string
  typesCount: number
  actionsCount: number
  objectSetsCount: number
  diffFromPrevious: {
    typesAdded: string[]
    typesRemoved: string[]
    actionsAdded: string[]
    actionsRemoved: string[]
  } | null
  createdAt: string
}

export const sdkService = {
  schema(): Promise<SdkSchema> {
    return api.get('/admin/ontology/sdk/schema').then(r => r.data)
  },
  typescript(): Promise<string> {
    return api.get('/admin/ontology/sdk/typescript', { responseType: 'text' }).then(r => r.data)
  },
  python(): Promise<string> {
    return api.get('/admin/ontology/sdk/python', { responseType: 'text' }).then(r => r.data)
  },
  changelog(): Promise<SdkVersion[]> {
    return api.get('/admin/ontology/sdk/changelog').then(r => r.data?.versions ?? [])
  },
}

export interface OntologySubscription {
  id: string
  name: string
  url: string
  secret: string
  objectTypeId: string | null
  objectType?: { name: string; displayName: string } | null
  eventTypes: string[]
  enabled: boolean
  lastTriggeredAt: string | null
  lastStatus: string | null
  createdAt: string
}

export const subscriptionService = {
  list(): Promise<OntologySubscription[]> {
    return api.get('/admin/ontology/subscriptions').then(r => r.data?.subscriptions ?? [])
  },
  create(input: { name: string; url: string; objectTypeId?: string | null; eventTypes?: string[] }): Promise<OntologySubscription> {
    return api.post('/admin/ontology/subscriptions', input).then(r => r.data.subscription)
  },
  update(id: string, patch: Partial<{ name: string; url: string; eventTypes: string[]; enabled: boolean }>): Promise<OntologySubscription> {
    return api.patch(`/admin/ontology/subscriptions/${id}`, patch).then(r => r.data.subscription)
  },
  remove(id: string): Promise<void> {
    return api.delete(`/admin/ontology/subscriptions/${id}`).then(() => undefined)
  },
  test(id: string): Promise<OntologySubscription> {
    return api.post(`/admin/ontology/subscriptions/${id}/test`, {}).then(r => r.data.subscription)
  },
}

// S326 — operational-surface counterpart to OntologySubscription: same
// HMAC-signed webhook shape, scoped to KIMMP operational events (eval drift,
// budget breach) rather than ontology object mutations.
export interface KimmpOperationalSubscription {
  id: string
  name: string
  url: string
  secret: string
  eventTypes: string[]
  enabled: boolean
  lastTriggeredAt: string | null
  lastStatus: string | null
  createdAt: string
}

export const operationalSubscriptionService = {
  list(): Promise<KimmpOperationalSubscription[]> {
    return api.get('/admin/kimmp-gateway/subscriptions').then(r => r.data?.subscriptions ?? [])
  },
  create(input: { name: string; url: string; eventTypes?: string[] }): Promise<KimmpOperationalSubscription> {
    return api.post('/admin/kimmp-gateway/subscriptions', input).then(r => r.data.subscription)
  },
  update(id: string, patch: Partial<{ name: string; url: string; eventTypes: string[]; enabled: boolean }>): Promise<KimmpOperationalSubscription> {
    return api.patch(`/admin/kimmp-gateway/subscriptions/${id}`, patch).then(r => r.data.subscription)
  },
  remove(id: string): Promise<void> {
    return api.delete(`/admin/kimmp-gateway/subscriptions/${id}`).then(() => undefined)
  },
  test(id: string): Promise<KimmpOperationalSubscription> {
    return api.post(`/admin/kimmp-gateway/subscriptions/${id}/test`, {}).then(r => r.data.subscription)
  },
}

export interface DeveloperApiKey {
  id: string
  name: string
  prefix: string
  lastUsedAt: string | null
  expiresAt: string | null
  createdAt: string
  scopedObjectTypes: string[]
  scopedActions: string[]
}

export const developerKeyService = {
  list(): Promise<DeveloperApiKey[]> {
    return api.get('/admin/developer/keys').then(r => r.data?.keys ?? [])
  },
  create(input: { name: string; expiresInDays?: number; scopedObjectTypes?: string[]; scopedActions?: string[] }): Promise<{ key: DeveloperApiKey; token: string }> {
    return api.post('/admin/developer/keys', input).then(r => r.data)
  },
  revoke(id: string): Promise<void> {
    return api.delete(`/admin/developer/keys/${id}`).then(() => undefined)
  },
}
