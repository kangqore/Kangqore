// Phase 5.4 — App Marketplace Catalog, Certification & Governed Installation
//
// One catalog, backed by the database. Published DeveloperApps and the existing
// MarketplaceListing rows are projected into a single listing shape so the
// storefront has exactly one source of truth.
//
// Installing derives the app's governance envelope from its manifest and writes
// it onto the installation. That envelope is what GovernanceKernel enforces on
// every subsequent call — the inheritance is data, not a claim in a response.

import { prisma } from '../../lib/prisma'
import { AppCategory, KangqoreAppManifest } from './AppManifest'
import { GovernanceKernel } from './GovernanceKernel'

export const MARKETPLACE_CATEGORIES: AppCategory[] = [
  'CERTIFIED',
  'GOVERNED',
  'AI_NATIVE',
  'ENTERPRISE_READY',
  'COMMUNITY',
  'PARTNER',
]

export interface MarketplaceAppListing {
  appId: string
  name: string
  version: string
  category: string
  publisher: string
  description: string
  icon: string
  rating: number
  reviewCount: number
  downloads: number
  governanceScore: number
  certifiedBadge: boolean
  price: number
  features: string[]
  permissionsRequired: string[]
  source: 'DEVELOPER_APP' | 'MARKETPLACE_LISTING'
  manifest?: KangqoreAppManifest
}

/** Map a legacy MarketplaceListing.category onto a Phase 5 marketplace category. */
function mapLegacyCategory(row: { category: string; price: number }): AppCategory {
  const c = (row.category || '').toLowerCase()
  if (c === 'intelligence') return 'AI_NATIVE'
  if (c === 'finance' || c === 'hr' || c === 'crm') return 'ENTERPRISE_READY'
  if (c === 'ops') return 'GOVERNED'
  return row.price > 0 ? 'PARTNER' : 'COMMUNITY'
}

export const MarketplaceService = {
  /** Unified catalog across published developer apps and existing listings. */
  async listApps(category?: string, search?: string): Promise<MarketplaceAppListing[]> {
    const [apps, listings] = await Promise.all([
      prisma.developerApp.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: [{ certifiedBadge: 'desc' }, { installCount: 'desc' }],
      }),
      prisma.marketplaceListing.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { installCount: 'desc' },
      }),
    ])

    const listingIds = listings.map(l => l.id)
    const reviewAgg = listingIds.length
      ? await prisma.marketplaceReview.groupBy({
          by: ['listingId'],
          where: { listingId: { in: listingIds } },
          _avg: { rating: true },
          _count: { rating: true },
        })
      : []
    const reviewByListing = new Map(reviewAgg.map(r => [r.listingId, r]))

    const fromApps: MarketplaceAppListing[] = apps.map(a => {
      const manifest = a.manifest as unknown as KangqoreAppManifest
      return {
        appId: a.appId,
        name: a.name,
        version: a.version,
        category: a.category,
        publisher: a.publisherName,
        description: a.description,
        icon: a.iconEmoji || '🧩',
        rating: 0,
        reviewCount: 0,
        downloads: a.installCount,
        governanceScore: a.governanceScore,
        certifiedBadge: a.certifiedBadge,
        price: a.price,
        features: (manifest?.actions ?? []).slice(0, 5).map(x => x.displayName || x.name),
        permissionsRequired: (manifest?.permissions ?? []).map(p => `${p.action}:${p.resource}`),
        source: 'DEVELOPER_APP',
        manifest,
      }
    })

    const fromListings: MarketplaceAppListing[] = listings.map(l => {
      const agg = reviewByListing.get(l.id)
      const manifest = l.manifest as any
      return {
        appId: l.slug,
        name: l.name,
        version: manifest?.version ?? '1.0.0',
        category: mapLegacyCategory(l),
        publisher: l.author,
        description: l.description,
        icon: l.iconEmoji || '🔌',
        rating: agg?._avg.rating ? Number(agg._avg.rating.toFixed(2)) : 0,
        reviewCount: agg?._count.rating ?? 0,
        downloads: l.installCount,
        // Legacy listings predate certification scoring; surfaced as uncertified
        // rather than given a fabricated score.
        governanceScore: 0,
        certifiedBadge: false,
        price: l.price,
        features: Array.isArray(manifest?.capabilities) ? manifest.capabilities.slice(0, 5) : l.tags.slice(0, 5),
        permissionsRequired: [],
        source: 'MARKETPLACE_LISTING',
      }
    })

    let result = [...fromApps, ...fromListings]

    if (category && category !== 'ALL') {
      result = result.filter(a => a.category === category)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
    }
    return result
  },

  async getApp(appId: string): Promise<MarketplaceAppListing | null> {
    const all = await this.listApps()
    return all.find(a => a.appId === appId) ?? null
  },

  async getCategoryStats(): Promise<Record<string, number>> {
    const all = await this.listApps()
    const stats: Record<string, number> = { ALL: all.length }
    for (const c of MARKETPLACE_CATEGORIES) stats[c] = 0
    for (const a of all) {
      if (stats[a.category] !== undefined) stats[a.category]++
    }
    return stats
  },

  /**
   * Install a published app into a tenant, deriving and persisting its
   * governance envelope. Idempotent per (appId, tenantId).
   */
  async installApp(args: {
    appId: string
    tenantId: string
    installedBy: string
    budgetCredits?: number
  }) {
    const app = await prisma.developerApp.findUnique({ where: { appId: args.appId } })
    if (!app) throw new Error(`App "${args.appId}" not found in marketplace`)
    if (app.status !== 'PUBLISHED') throw new Error(`App "${args.appId}" is ${app.status}, not PUBLISHED`)

    const manifest = app.manifest as unknown as KangqoreAppManifest
    const envelope = GovernanceKernel.deriveEnvelopeFromManifest(manifest)

    const installation = await prisma.appInstallation.upsert({
      where: { appId_tenantId: { appId: args.appId, tenantId: args.tenantId } },
      create: {
        appId: args.appId,
        tenantId: args.tenantId,
        installedBy: args.installedBy,
        status: 'ACTIVE',
        grantedPermissions: (manifest.permissions ?? []) as any,
        grantedScopes: envelope.grantedScopes,
        allowedActions: envelope.allowedActions,
        allowedObjectTypes: envelope.allowedObjectTypes,
        budgetCredits: args.budgetCredits ?? 1000,
      },
      update: {
        status: 'ACTIVE',
        uninstalledAt: null,
        grantedPermissions: (manifest.permissions ?? []) as any,
        grantedScopes: envelope.grantedScopes,
        allowedActions: envelope.allowedActions,
        allowedObjectTypes: envelope.allowedObjectTypes,
      },
    })

    await prisma.developerApp.update({
      where: { appId: args.appId },
      data: { installCount: { increment: 1 } },
    })

    await prisma.appAuditEvent.create({
      data: {
        appId: args.appId,
        installationId: installation.id,
        tenantId: args.tenantId,
        actorId: args.installedBy,
        actorType: 'USER',
        eventType: 'INSTALL',
        outcome: 'ALLOWED',
        result: {
          grantedScopes: envelope.grantedScopes,
          allowedActions: envelope.allowedActions,
          allowedObjectTypes: envelope.allowedObjectTypes,
          budgetCredits: installation.budgetCredits,
        } as any,
      },
    })

    // Billing: charge only when the app is priced.
    let charge = null
    if (app.price > 0) {
      charge = await prisma.marketplaceCharge.create({
        data: {
          listingId: app.appId,
          partnerId: app.ownerUserId,
          amount: app.price,
          platformFee: app.price * app.platformFee,
          status: 'PENDING',
          installId: installation.id,
        },
      })
    }

    return {
      installationId: installation.id,
      appId: app.appId,
      status: installation.status,
      /** What the tenant actually granted — enforced on every later call. */
      inheritedEnvelope: {
        identity: { clientId: app.clientId, installationId: installation.id },
        permissions: {
          scopes: envelope.grantedScopes,
          allowedActions: envelope.allowedActions,
          allowedObjectTypes: envelope.allowedObjectTypes,
        },
        governance: { policyEvaluatedPerCall: true, certifiedBadge: app.certifiedBadge, governanceScore: app.governanceScore },
        billing: { budgetCredits: installation.budgetCredits, chargeId: charge?.id ?? null, price: app.price },
        audit: { every: 'AppAuditEvent', installEventWritten: true },
        observability: { telemetryEndpoint: `/api/developer/apps/${app.appId}/telemetry` },
      },
    }
  },

  async uninstallApp(appId: string, tenantId: string, actorId: string) {
    const installation = await prisma.appInstallation.findUnique({
      where: { appId_tenantId: { appId, tenantId } },
    })
    if (!installation) throw new Error('Installation not found')

    await prisma.appInstallation.update({
      where: { id: installation.id },
      data: { status: 'UNINSTALLED', uninstalledAt: new Date() },
    })

    await prisma.appOAuthToken.updateMany({
      where: { appId, tenantId, revoked: false },
      data: { revoked: true, revokedAt: new Date() },
    })

    await prisma.appAuditEvent.create({
      data: {
        appId,
        installationId: installation.id,
        tenantId,
        actorId,
        actorType: 'USER',
        eventType: 'UNINSTALL',
        outcome: 'ALLOWED',
      },
    })

    return { appId, tenantId, status: 'UNINSTALLED', tokensRevoked: true }
  },

  async listInstallations(tenantId: string) {
    return prisma.appInstallation.findMany({
      where: { tenantId, status: 'ACTIVE' },
      include: {
        app: {
          select: {
            appId: true, name: true, version: true, category: true,
            iconEmoji: true, certifiedBadge: true, governanceScore: true, publisherName: true,
          },
        },
      },
      orderBy: { installedAt: 'desc' },
    })
  },

  async submitReview(args: { appId: string; authorId: string; rating: number; comment?: string }) {
    if (args.rating < 1 || args.rating > 5) throw new Error('rating must be between 1 and 5')

    const installed = await prisma.appInstallation.findFirst({
      where: { appId: args.appId, installedBy: args.authorId },
    })

    return prisma.marketplaceReview.upsert({
      where: { listingId_authorId: { listingId: args.appId, authorId: args.authorId } },
      create: {
        listingId: args.appId,
        authorId: args.authorId,
        rating: args.rating,
        comment: args.comment ?? null,
        verifiedBadge: !!installed,
      },
      update: { rating: args.rating, comment: args.comment ?? null },
    })
  },
}
