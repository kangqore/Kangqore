// Phase 5.1 & 5.3 — Developer Platform Service & "Build an App in a Day" Engine
//
// Create app → Connect ontology → Create action → Create agent → Build UI → Test → Publish
//
// Every step below persists. App credentials are hashed at rest; the raw client
// secret is returned exactly once, at creation, and is unrecoverable afterwards.

import crypto from 'crypto'
import { prisma } from '../../lib/prisma'
import { validateAppManifest, KangqoreAppManifest, AppCategory } from './AppManifest'
import { generateDeveloperCliScript, generateTypescriptSdkBundle, generatePythonSdkBundle } from './DeveloperCliGenerator'
import { AppSandboxEngine, SandboxExecutionInput } from './AppSandboxEngine'
import { GovernanceKernel } from './GovernanceKernel'
import { AppAgentService } from './AppAgentService'

export interface CreateDeveloperAppInput {
  name: string
  publisherEmail: string
  description: string
  category?: AppCategory
  ontologyObjectTypes?: string[]
  publisherName?: string
  redirectUris?: string[]
}

const sha256 = (raw: string) => crypto.createHash('sha256').update(raw).digest('hex')

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'app'
}

/**
 * Certification scoring. A published app's governance posture is computed from
 * what the manifest actually declares, not from a self-reported field.
 */
export function scoreGovernance(manifest: KangqoreAppManifest): { score: number; notes: string[] } {
  const notes: string[] = []
  let score = 0

  // Least privilege: every permission carries a stated reason.
  const perms = manifest.permissions ?? []
  if (perms.length === 0) {
    notes.push('No permissions declared — app cannot access tenant data (max least-privilege score).')
    score += 30
  } else {
    const withReason = perms.filter(p => p.reason && p.reason.trim().length >= 10).length
    const ratio = withReason / perms.length
    score += Math.round(ratio * 30)
    if (ratio < 1) notes.push(`${perms.length - withReason} of ${perms.length} permissions lack a substantive reason.`)
    const admin = perms.filter(p => p.action === 'ADMIN')
    if (admin.length > 0) {
      score -= 10
      notes.push(`Requests ADMIN on ${admin.map(a => a.resource).join(', ')} — elevated risk.`)
    }
  }

  // Explicit ontology bindings.
  if ((manifest.ontologyBindings ?? []).length > 0) score += 20
  else notes.push('No ontology bindings declared.')

  // Typed action surface.
  const actions = manifest.actions ?? []
  if (actions.length > 0) {
    const documented = actions.filter(a => a.description && a.description.trim().length >= 15).length
    score += Math.round((documented / actions.length) * 25)
    if (documented < actions.length) notes.push(`${actions.length - documented} action(s) lack a meaningful description.`)
  } else {
    notes.push('No actions declared.')
  }

  // Publisher identity.
  if (manifest.publisher?.email && manifest.publisher?.name) score += 15
  if (manifest.publisher?.website) score += 5
  else notes.push('No publisher website — reduces provenance confidence.')

  // Webhook targets must be HTTPS.
  const insecure = (manifest.webhooks ?? []).filter(w => w.targetUrl && !w.targetUrl.startsWith('https://'))
  if (insecure.length > 0) {
    score -= 15
    notes.push(`${insecure.length} webhook target(s) are not HTTPS.`)
  } else if ((manifest.webhooks ?? []).length > 0) {
    score += 5
  }

  return { score: Math.max(0, Math.min(100, score)), notes }
}

export const DeveloperPlatformService = {
  /** Step 1 — Create app. Persists the app and returns the client secret once. */
  async createApp(input: CreateDeveloperAppInput, userId: string) {
    if (!input.name?.trim()) throw new Error('name is required')
    if (!input.publisherEmail?.trim()) throw new Error('publisherEmail is required')

    const slug = slugify(input.name)
    const existing = await prisma.developerApp.findUnique({ where: { slug } })
    const uniqueSlug = existing ? `${slug}-${crypto.randomBytes(3).toString('hex')}` : slug

    const appId = `app-${uniqueSlug}`
    const clientId = `kqc_${crypto.randomBytes(12).toString('hex')}`
    const clientSecret = `kqs_${crypto.randomBytes(24).toString('hex')}`

    const objectTypes = input.ontologyObjectTypes?.length ? input.ontologyObjectTypes : ['WorkItem', 'Project']

    const manifest: KangqoreAppManifest = {
      manifestVersion: '1.0',
      appId,
      name: input.name,
      version: '1.0.0',
      category: input.category || 'COMMUNITY',
      publisher: {
        name: input.publisherName || input.publisherEmail.split('@')[0],
        email: input.publisherEmail,
      },
      description: input.description || `${input.name} — built on Kangqore View`,
      permissions: objectTypes.map(t => ({
        resource: t,
        action: 'READ' as const,
        reason: `Read ${t} records to render app views`,
      })),
      ontologyBindings: objectTypes.map(t => ({ objectType: t, relationshipTypes: ['belongsTo', 'dependsOn'] })),
      actions: [],
      agents: [],
      uiWidgets: [],
    }

    const app = await prisma.developerApp.create({
      data: {
        appId,
        name: input.name,
        slug: uniqueSlug,
        version: '1.0.0',
        category: input.category || 'COMMUNITY',
        description: manifest.description,
        publisherName: manifest.publisher.name,
        publisherEmail: input.publisherEmail,
        ownerUserId: userId,
        clientId,
        clientSecretHash: sha256(clientSecret),
        secretPrefix: clientSecret.slice(0, 12),
        manifest: manifest as any,
        status: 'DRAFT',
        redirectUris: input.redirectUris ?? [],
      },
    })

    return {
      appId: app.appId,
      name: app.name,
      version: app.version,
      status: app.status,
      clientId: app.clientId,
      // Shown once. Never retrievable again.
      clientSecret,
      manifest,
      createdAt: app.createdAt.toISOString(),
      developerDocsUrl: `https://developers.kangqoreview.com/docs/apps/${app.appId}`,
      warning: 'Store clientSecret now — it is hashed at rest and cannot be retrieved again.',
    }
  },

  async getApp(appId: string, ownerUserId?: string) {
    const app = await prisma.developerApp.findUnique({ where: { appId } })
    if (!app) return null
    if (ownerUserId && app.ownerUserId !== ownerUserId) return null
    const { clientSecretHash, ...safe } = app
    return safe
  },

  async listApps(ownerUserId: string) {
    const apps = await prisma.developerApp.findMany({
      where: { ownerUserId },
      orderBy: { createdAt: 'desc' },
    })
    return apps.map(({ clientSecretHash, ...safe }) => safe)
  },

  /** Steps 2–5 — bind ontology, actions, agents, and UI widgets into the manifest. */
  async updateManifest(appId: string, ownerUserId: string, patch: Partial<KangqoreAppManifest>) {
    const app = await prisma.developerApp.findUnique({ where: { appId } })
    if (!app) throw new Error(`App "${appId}" not found`)
    if (app.ownerUserId !== ownerUserId) throw new Error('Not authorised to modify this app')
    if (app.status === 'SUSPENDED') throw new Error('Suspended apps cannot be modified')

    const current = app.manifest as unknown as KangqoreAppManifest
    const merged: KangqoreAppManifest = {
      ...current,
      ...patch,
      appId: current.appId,          // immutable
      manifestVersion: '1.0',
      publisher: { ...current.publisher, ...(patch.publisher ?? {}) },
    }

    const validation = validateAppManifest(merged)
    if (!validation.valid) {
      throw new Error(`Manifest invalid: ${validation.errors.join('; ')}`)
    }

    const updated = await prisma.developerApp.update({
      where: { appId },
      data: {
        manifest: merged as any,
        version: merged.version ?? app.version,
        category: merged.category ?? app.category,
        description: merged.description ?? app.description,
      },
    })

    const { clientSecretHash, ...safe } = updated
    return { app: safe, manifest: merged, validation }
  },

  /** Step 7 — Publish. Runs certification and moves the app into the marketplace. */
  async publishApp(appId: string, ownerUserId: string) {
    const app = await prisma.developerApp.findUnique({ where: { appId } })
    if (!app) throw new Error(`App "${appId}" not found`)
    if (app.ownerUserId !== ownerUserId) throw new Error('Not authorised to publish this app')

    const manifest = app.manifest as unknown as KangqoreAppManifest
    const validation = validateAppManifest(manifest)
    if (!validation.valid) {
      throw new Error(`Cannot publish — manifest invalid: ${validation.errors.join('; ')}`)
    }
    if ((manifest.actions ?? []).length === 0) {
      throw new Error('Cannot publish — app declares no actions.')
    }

    const { score, notes } = scoreGovernance(manifest)
    const certified = score >= 80

    const published = await prisma.developerApp.update({
      where: { appId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        governanceScore: score,
        certifiedBadge: certified,
        certifiedAt: certified ? new Date() : null,
        certificationNotes: notes.join('\n') || null,
      },
    })

    await prisma.appAuditEvent.create({
      data: {
        appId,
        tenantId: 'platform',
        actorId: ownerUserId,
        actorType: 'DEVELOPER',
        eventType: 'PUBLISH',
        outcome: 'ALLOWED',
        result: { governanceScore: score, certifiedBadge: certified } as any,
      },
    })

    // Materialise manifest-declared agents so they are immediately runnable.
    const agents = await AppAgentService.syncAgentsFromManifest(appId, manifest)

    const { clientSecretHash, ...safe } = published
    return { app: safe, governanceScore: score, certifiedBadge: certified, certificationNotes: notes, agents }
  },

  /** Verify a client_id / client_secret pair for OAuth and CLI auth. */
  async verifyClientCredentials(clientId: string, clientSecret: string) {
    const app = await prisma.developerApp.findUnique({ where: { clientId } })
    if (!app) return null
    const provided = Buffer.from(sha256(clientSecret))
    const stored = Buffer.from(app.clientSecretHash)
    if (provided.length !== stored.length) return null
    if (!crypto.timingSafeEqual(provided, stored)) return null
    if (app.status === 'SUSPENDED') return null
    return app
  },

  validateManifest(manifest: any) {
    return validateAppManifest(manifest)
  },

  scoreGovernance,

  async runSandboxTest(input: SandboxExecutionInput) {
    return AppSandboxEngine.execute(input)
  },

  async getTelemetry(appId: string, sinceHours = 24) {
    return GovernanceKernel.getAppTelemetry(appId, sinceHours)
  },

  getDeveloperCliScript() {
    return generateDeveloperCliScript()
  },

  getSdkBundle(language: 'typescript' | 'python') {
    if (language === 'python') {
      return { filename: 'kangqore_view_sdk.py', code: generatePythonSdkBundle() }
    }
    return { filename: 'index.ts', code: generateTypescriptSdkBundle() }
  },
}
