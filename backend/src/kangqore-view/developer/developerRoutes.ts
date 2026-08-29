// Phase 5 — Developer Platform & Marketplace API
//
// Mounted at /api/developer (see index.ts). Two access tiers:
//   • authenticate  — human developers managing their own apps
//   • bearer token  — installed apps calling the platform via the SDKs
//
// The OAuth token endpoint is deliberately public (it *is* the authentication
// step) but every other route requires one of the two tiers.

import { Router, Request, Response, NextFunction } from 'express'
import { authenticate } from '../../middleware/auth'
import { DeveloperPlatformService } from './DeveloperPlatform.service'
import { MarketplaceService } from './MarketplaceService'
import { AppSandboxEngine } from './AppSandboxEngine'
import { AppOAuthService } from './AppOAuthService'
import { AppTestingFramework, AppDeploymentEngine } from './AppTestingFramework'
import { GovernanceKernel } from './GovernanceKernel'
import { AppAgentService } from './AppAgentService'
import { AppWebhookService } from './AppWebhookService'
import { prisma } from '../../lib/prisma'
import { OntologyGateway, type GatewayActor } from '../eof/OntologyGateway'
import type { KangqoreAppManifest } from './AppManifest'

/**
 * The gateway identity a third-party app acts under.
 *
 * Clearances are deliberately empty: an installed app can reach unmarked
 * objects only. Marked data requires an explicit grant that does not exist yet,
 * and defaulting to `['*']` would hand every app the clearance of a system
 * service. Secure by default, widened later if a marking grant is added to the
 * installation record.
 */
const appActor = (auth: { appId: string; userId?: string | null }): GatewayActor => ({
  id: auth.userId ?? `app:${auth.appId}`,
  type: 'API',
  clearances: [],
})

const router = Router()

const userId = (req: Request): string => (req as any).user?.id
const tenantOf = (req: Request): string =>
  (req as any).appAuth?.tenantId || (req as any).user?.tenantId || (req.body?.tenantId as string) || 'default'

/** Resolve a `Bearer kqat_…` app token into req.appAuth. */
async function authenticateApp(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Bearer token' })
  }
  const introspection = await AppOAuthService.introspect(header.slice(7))
  if (!introspection.active) {
    return res.status(401).json({ error: 'invalid_token: expired, revoked, or unknown' })
  }
  ;(req as any).appAuth = introspection
  next()
}

/** The app in the URL must match the app the token was issued to. */
function requireAppMatch(req: Request, res: Response, next: NextFunction) {
  const auth = (req as any).appAuth
  if (auth?.appId !== req.params.appId) {
    return res.status(403).json({ error: 'Token was not issued for this app' })
  }
  next()
}

const fail = (res: Response, err: any, status = 400) =>
  res.status(status).json({ error: err?.message ?? String(err) })

// ═══════════════════════════════════════════════════════════════════════════════
// OAuth 2.0 — public by necessity
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/oauth/token', async (req: Request, res: Response) => {
  const grant = req.body?.grant_type
  try {
    if (grant === 'client_credentials') {
      return res.json(
        await AppOAuthService.clientCredentialsGrant({
          clientId: req.body.client_id,
          clientSecret: req.body.client_secret,
          tenantId: req.body.tenant_id || 'default',
          scopes: req.body.scope ? String(req.body.scope).split(' ') : undefined,
        }),
      )
    }
    if (grant === 'authorization_code') {
      return res.json(
        await AppOAuthService.exchangeAuthorizationCode({
          clientId: req.body.client_id,
          clientSecret: req.body.client_secret,
          code: req.body.code,
          redirectUri: req.body.redirect_uri,
          codeVerifier: req.body.code_verifier,
        }),
      )
    }
    if (grant === 'refresh_token') {
      return res.json(
        await AppOAuthService.refreshTokenGrant({
          clientId: req.body.client_id,
          clientSecret: req.body.client_secret,
          refreshToken: req.body.refresh_token,
        }),
      )
    }
    return res.status(400).json({ error: 'unsupported_grant_type' })
  } catch (err: any) {
    return res.status(401).json({ error: err.message })
  }
})

// User consent step — requires a logged-in human.
router.post('/oauth/authorize', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await AppOAuthService.createAuthorizationCode({
      clientId: req.body.client_id,
      userId: userId(req),
      tenantId: tenantOf(req),
      redirectUri: req.body.redirect_uri,
      scopes: req.body.scope ? String(req.body.scope).split(' ') : [],
      codeChallenge: req.body.code_challenge,
    })
    return res.json(result)
  } catch (err: any) {
    return fail(res, err)
  }
})

router.post('/oauth/revoke', async (req: Request, res: Response) => {
  const token = req.body?.token
  if (!token) return res.status(400).json({ error: 'token is required' })
  return res.json(await AppOAuthService.revokeToken(token))
})

router.post('/oauth/introspect', async (req: Request, res: Response) => {
  const token = req.body?.token
  if (!token) return res.status(400).json({ error: 'token is required' })
  return res.json(await AppOAuthService.introspect(token))
})

// ═══════════════════════════════════════════════════════════════════════════════
// App lifecycle — authenticated developers
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/apps', authenticate, async (req: Request, res: Response) => {
  try {
    const app = await DeveloperPlatformService.createApp(req.body, userId(req))
    return res.status(201).json({ success: true, app })
  } catch (err: any) {
    return fail(res, err)
  }
})

router.get('/apps', authenticate, async (req: Request, res: Response) => {
  return res.json({ success: true, apps: await DeveloperPlatformService.listApps(userId(req)) })
})

router.get('/apps/:appId', authenticate, async (req: Request, res: Response) => {
  const app = await DeveloperPlatformService.getApp(req.params.appId, userId(req))
  if (!app) return res.status(404).json({ error: 'App not found' })
  return res.json({ success: true, app })
})

router.patch('/apps/:appId/manifest', authenticate, async (req: Request, res: Response) => {
  try {
    return res.json({ success: true, ...(await DeveloperPlatformService.updateManifest(req.params.appId, userId(req), req.body)) })
  } catch (err: any) {
    return fail(res, err)
  }
})

router.post('/apps/:appId/publish', authenticate, async (req: Request, res: Response) => {
  try {
    return res.json({ success: true, ...(await DeveloperPlatformService.publishApp(req.params.appId, userId(req))) })
  } catch (err: any) {
    return fail(res, err)
  }
})

router.post('/manifest/validate', authenticate, (req: Request, res: Response) => {
  const validation = DeveloperPlatformService.validateManifest(req.body)
  const governance = validation.valid ? DeveloperPlatformService.scoreGovernance(req.body) : null
  return res.json({ ...validation, governance })
})

// ── Testing & deployment ─────────────────────────────────────────────────────

router.post('/apps/:appId/test', authenticate, async (req: Request, res: Response) => {
  try {
    return res.json(
      await AppTestingFramework.runSuite({
        appId: req.params.appId,
        tenantId: tenantOf(req),
        triggeredBy: userId(req),
        suiteName: req.body?.suiteName,
        cases: req.body?.cases,
      }),
    )
  } catch (err: any) {
    return fail(res, err)
  }
})

router.get('/apps/:appId/test-runs', authenticate, async (req: Request, res: Response) => {
  return res.json({ runs: await AppTestingFramework.listRuns(req.params.appId) })
})

router.post('/apps/:appId/deploy', authenticate, async (req: Request, res: Response) => {
  try {
    return res.json(
      await AppDeploymentEngine.deploy({
        appId: req.params.appId,
        environment: req.body?.environment ?? 'SANDBOX',
        deployedBy: userId(req),
        releaseNotes: req.body?.releaseNotes,
      }),
    )
  } catch (err: any) {
    return fail(res, err)
  }
})

router.post('/deployments/:id/rollback', authenticate, async (req: Request, res: Response) => {
  try {
    return res.json(await AppDeploymentEngine.rollback(req.params.id, userId(req)))
  } catch (err: any) {
    return fail(res, err)
  }
})

router.get('/apps/:appId/deployments', authenticate, async (req: Request, res: Response) => {
  return res.json({ deployments: await AppDeploymentEngine.listDeployments(req.params.appId) })
})

// ── Observability ────────────────────────────────────────────────────────────

router.get('/apps/:appId/telemetry', authenticate, async (req: Request, res: Response) => {
  const hours = Number(req.query.sinceHours) || 24
  return res.json(await GovernanceKernel.getAppTelemetry(req.params.appId, hours))
})

router.get('/apps/:appId/audit', authenticate, async (req: Request, res: Response) => {
  const events = await prisma.appAuditEvent.findMany({
    where: { appId: req.params.appId },
    orderBy: { createdAt: 'desc' },
    take: Math.min(Number(req.query.limit) || 100, 500),
  })
  return res.json({ events })
})

// ── SDK & CLI artifacts ──────────────────────────────────────────────────────

router.get('/sdk/:lang', (req: Request, res: Response) => {
  const lang = req.params.lang === 'python' ? 'python' : 'typescript'
  return res.json(DeveloperPlatformService.getSdkBundle(lang))
})

router.get('/cli', (_req: Request, res: Response) => {
  return res.type('text/javascript').send(DeveloperPlatformService.getDeveloperCliScript())
})

// ═══════════════════════════════════════════════════════════════════════════════
// App-facing runtime — Bearer token, every call through the governance kernel
// ═══════════════════════════════════════════════════════════════════════════════

router.post('/apps/:appId/actions/invoke', authenticateApp, requireAppMatch, async (req: Request, res: Response) => {
  const auth = (req as any).appAuth
  try {
    const result = await AppSandboxEngine.execute({
      appId: req.params.appId,
      actionName: req.body?.actionName,
      params: req.body?.params ?? {},
      actorId: auth.userId ?? `app:${auth.appId}`,
      tenantId: auth.tenantId,
      dryRun: !!req.body?.dryRun,
    })
    // A refusal is a 403 carrying the audit id, so SDK callers can trace it.
    return res.status(result.success ? 200 : 403).json(result)
  } catch (err: any) {
    return fail(res, err, 500)
  }
})

router.get('/apps/:appId/actions', authenticateApp, requireAppMatch, async (req: Request, res: Response) => {
  const auth = (req as any).appAuth
  const installation = await prisma.appInstallation.findUnique({
    where: { appId_tenantId: { appId: req.params.appId, tenantId: auth.tenantId } },
  })
  if (!installation) return res.status(404).json({ error: 'App is not installed for this tenant' })

  const actions = await prisma.ontologyAction.findMany({
    where: { name: { in: installation.allowedActions } },
    select: { name: true, displayName: true, description: true },
  })
  return res.json(actions)
})

router.get('/apps/:appId/ontology/types', authenticateApp, requireAppMatch, async (req: Request, res: Response) => {
  const auth = (req as any).appAuth
  const installation = await prisma.appInstallation.findUnique({
    where: { appId_tenantId: { appId: req.params.appId, tenantId: auth.tenantId } },
  })
  return res.json(installation?.allowedObjectTypes ?? [])
})

router.post('/apps/:appId/ontology/query', authenticateApp, requireAppMatch, async (req: Request, res: Response) => {
  const auth = (req as any).appAuth
  const objectType = req.body?.objectType
  if (!objectType) return res.status(400).json({ error: 'objectType is required' })

  // Reads are governed too — the kernel enforces the object-type allowlist.
  const decision = await GovernanceKernel.authorize({
    appId: req.params.appId,
    tenantId: auth.tenantId,
    actorId: auth.userId ?? `app:${auth.appId}`,
    objectType,
    params: req.body,
    creditCost: 1,
  })
  if (!decision.allowed) {
    return res.status(403).json({ error: decision.reason, auditId: decision.auditId, governanceDetails: { outcome: decision.outcome, ...decision.policy } })
  }

  const type = await prisma.ontologyObjectType.findFirst({ where: { name: objectType }, select: { id: true } })
  if (!type) return res.json({ objects: [], total: 0 })

  const rows = await prisma.ontologyObject.findMany({
    where: { typeId: type.id },
    take: Math.min(Number(req.body?.limit) || 50, 200),
    skip: Number(req.body?.offset) || 0,
    orderBy: { updatedAt: 'desc' },
  })

  // Marking filter. Apps hold no clearances, so anything classified is invisible
  // to them — without this the endpoint returned marked objects to third-party
  // code that was never granted them.
  const objects = OntologyGateway.filterObjects(rows, appActor(auth))
  return res.json({
    objects,
    total: objects.length,
    withheldByClearance: rows.length - objects.length,
    auditId: decision.auditId,
  })
})

// ── Ontology writes (governed per object type) ───────────────────────────────

/** Resolve the object, then authorise against *its* type. */
router.get('/apps/:appId/ontology/objects/:objectId', authenticateApp, requireAppMatch, async (req: Request, res: Response) => {
  const auth = (req as any).appAuth
  const object = await prisma.ontologyObject.findUnique({
    where: { id: req.params.objectId },
    include: { type: { select: { name: true } } },
  })
  if (!object) return res.status(404).json({ error: 'Object not found' })

  const decision = await GovernanceKernel.authorize({
    appId: req.params.appId,
    tenantId: auth.tenantId,
    actorId: auth.userId ?? `app:${auth.appId}`,
    objectType: object.type.name,
    creditCost: 1,
  })
  if (!decision.allowed) {
    return res.status(403).json({ error: decision.reason, auditId: decision.auditId, governanceDetails: { outcome: decision.outcome } })
  }

  // A marked object is not merely filtered from lists — it is not readable by id.
  if (!OntologyGateway.canRead(object.markings, appActor(auth))) {
    return res.status(403).json({
      error: 'Insufficient clearance for this object\'s markings',
      auditId: decision.auditId,
    })
  }
  return res.json({ ...object, auditId: decision.auditId })
})

router.post('/apps/:appId/ontology/objects', authenticateApp, requireAppMatch, async (req: Request, res: Response) => {
  const auth = (req as any).appAuth
  const { objectType, properties } = req.body ?? {}
  if (!objectType) return res.status(400).json({ error: 'objectType is required' })

  const decision = await GovernanceKernel.authorize({
    appId: req.params.appId,
    tenantId: auth.tenantId,
    actorId: auth.userId ?? `app:${auth.appId}`,
    objectType,
    params: { objectType },
    creditCost: 2,
  })
  if (!decision.allowed) {
    return res.status(403).json({ error: decision.reason, auditId: decision.auditId, governanceDetails: { outcome: decision.outcome } })
  }

  const type = await prisma.ontologyObjectType.findFirst({ where: { name: objectType }, select: { id: true } })
  if (!type) {
    const msg = `Object type "${objectType}" does not exist in the ontology`
    await GovernanceKernel.recordResult(decision.auditId, null, msg)
    return res.status(400).json({ error: msg, auditId: decision.auditId })
  }

  // Through the gateway, not around it: this applies the policy gate and emits
  // CDC, neither of which a direct prisma write would have done.
  const result = await OntologyGateway.createObject(appActor(auth), {
    typeId: type.id,
    properties: (properties ?? {}) as any,
  })
  if (result.status !== 'OK') {
    await GovernanceKernel.recordResult(decision.auditId, null, result.reason)
    return res.status(result.status === 'PENDING_APPROVAL' ? 202 : 403).json({
      error: result.reason, status: result.status, pendingId: result.pendingId, auditId: decision.auditId,
    })
  }
  await GovernanceKernel.recordResult(decision.auditId, { objectId: result.data.id })
  return res.status(201).json({ ...result.data, auditId: decision.auditId })
})

router.patch('/apps/:appId/ontology/objects/:objectId', authenticateApp, requireAppMatch, async (req: Request, res: Response) => {
  const auth = (req as any).appAuth
  const object = await prisma.ontologyObject.findUnique({
    where: { id: req.params.objectId },
    include: { type: { select: { name: true } } },
  })
  if (!object) return res.status(404).json({ error: 'Object not found' })

  const decision = await GovernanceKernel.authorize({
    appId: req.params.appId,
    tenantId: auth.tenantId,
    actorId: auth.userId ?? `app:${auth.appId}`,
    objectType: object.type.name,
    params: req.body,
    creditCost: 2,
  })
  if (!decision.allowed) {
    return res.status(403).json({ error: decision.reason, auditId: decision.auditId, governanceDetails: { outcome: decision.outcome } })
  }

  // Merge rather than replace, so a partial patch cannot silently drop fields.
  const merged = { ...(object.properties as any), ...(req.body?.properties ?? {}) }
  const result = await OntologyGateway.updateObject(appActor(auth), object.id, { properties: merged as any })
  if (result.status !== 'OK') {
    await GovernanceKernel.recordResult(decision.auditId, null, result.reason)
    return res.status(result.status === 'PENDING_APPROVAL' ? 202 : 403).json({
      error: result.reason, status: result.status, pendingId: result.pendingId, auditId: decision.auditId,
    })
  }
  await GovernanceKernel.recordResult(decision.auditId, { objectId: result.data.id })
  return res.json({ ...result.data, auditId: decision.auditId })
})

// ── Agent SDK ────────────────────────────────────────────────────────────────

router.get('/apps/:appId/agents', authenticateApp, requireAppMatch, async (req: Request, res: Response) => {
  return res.json(await AppAgentService.listAgents(req.params.appId))
})

router.post('/apps/:appId/agents/:agentName/run', authenticateApp, requireAppMatch, async (req: Request, res: Response) => {
  const auth = (req as any).appAuth
  if (!req.body?.prompt) return res.status(400).json({ error: 'prompt is required' })
  try {
    const result = await AppAgentService.runAgent({
      appId: req.params.appId,
      agentName: req.params.agentName,
      tenantId: auth.tenantId,
      actorId: auth.userId ?? `app:${auth.appId}`,
      prompt: req.body.prompt,
      context: req.body.context,
    })
    if (!result.allowed) {
      return res.status(403).json({
        error: result.reason,
        auditId: result.auditId,
        governanceDetails: { outcome: result.outcome },
      })
    }
    return res.json(result)
  } catch (err: any) {
    return fail(res, err, 500)
  }
})

// ── UI SDK ───────────────────────────────────────────────────────────────────
// Widgets live in the manifest, which stays the single source of truth for what
// surfaces an app contributes.

router.get('/apps/:appId/ui/widgets', authenticateApp, requireAppMatch, async (req: Request, res: Response) => {
  const app = await prisma.developerApp.findUnique({ where: { appId: req.params.appId } })
  if (!app) return res.status(404).json({ error: 'App not found' })
  const manifest = app.manifest as unknown as KangqoreAppManifest
  return res.json(manifest?.uiWidgets ?? [])
})

router.post('/apps/:appId/ui/widgets', authenticateApp, requireAppMatch, async (req: Request, res: Response) => {
  const { name, title, type, entryUrl } = req.body ?? {}
  if (!name || !title || !type || !entryUrl) {
    return res.status(400).json({ error: 'name, title, type and entryUrl are all required' })
  }
  const VALID = ['BOARD_WIDGET', 'DASHBOARD_PANEL', 'NAV_TAB', 'MODAL']
  if (!VALID.includes(type)) {
    return res.status(400).json({ error: `type must be one of ${VALID.join(', ')}` })
  }

  const app = await prisma.developerApp.findUnique({ where: { appId: req.params.appId } })
  if (!app) return res.status(404).json({ error: 'App not found' })

  const manifest = app.manifest as unknown as KangqoreAppManifest
  const widgets = [...(manifest.uiWidgets ?? [])]
  const idx = widgets.findIndex(w => w.name === name)
  const widget = { name, title, type, entryUrl }
  if (idx >= 0) widgets[idx] = widget
  else widgets.push(widget)

  await prisma.developerApp.update({
    where: { appId: req.params.appId },
    data: { manifest: { ...manifest, uiWidgets: widgets } as any },
  })
  return res.status(idx >= 0 ? 200 : 201).json({ registered: true, widget })
})

// ── Webhook deliveries ───────────────────────────────────────────────────────

router.get('/apps/:appId/webhooks/deliveries', authenticate, async (req: Request, res: Response) => {
  return res.json({ deliveries: await AppWebhookService.listDeliveries(req.params.appId, Number(req.query.limit) || 50) })
})

// ═══════════════════════════════════════════════════════════════════════════════
// Marketplace
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/marketplace/apps', async (req: Request, res: Response) => {
  const apps = await MarketplaceService.listApps(req.query.category as string, req.query.search as string)
  const stats = await MarketplaceService.getCategoryStats()
  return res.json({ success: true, count: apps.length, categories: stats, apps })
})

router.get('/marketplace/apps/:appId', async (req: Request, res: Response) => {
  const app = await MarketplaceService.getApp(req.params.appId)
  if (!app) return res.status(404).json({ error: 'App not found in marketplace' })
  return res.json({ success: true, app })
})

router.post('/marketplace/apps/:appId/install', authenticate, async (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      ...(await MarketplaceService.installApp({
        appId: req.params.appId,
        tenantId: tenantOf(req),
        installedBy: userId(req),
        budgetCredits: req.body?.budgetCredits,
      })),
    })
  } catch (err: any) {
    return fail(res, err)
  }
})

router.post('/marketplace/apps/:appId/uninstall', authenticate, async (req: Request, res: Response) => {
  try {
    return res.json({ success: true, ...(await MarketplaceService.uninstallApp(req.params.appId, tenantOf(req), userId(req))) })
  } catch (err: any) {
    return fail(res, err)
  }
})

router.get('/marketplace/installations', authenticate, async (req: Request, res: Response) => {
  return res.json({ installations: await MarketplaceService.listInstallations(tenantOf(req)) })
})

router.post('/marketplace/apps/:appId/reviews', authenticate, async (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      review: await MarketplaceService.submitReview({
        appId: req.params.appId,
        authorId: userId(req),
        rating: Number(req.body?.rating),
        comment: req.body?.comment,
      }),
    })
  } catch (err: any) {
    return fail(res, err)
  }
})

export default router
