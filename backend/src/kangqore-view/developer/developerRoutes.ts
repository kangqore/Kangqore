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
import { prisma } from '../../lib/prisma'

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

  const [objects, total] = await Promise.all([
    prisma.ontologyObject.findMany({
      where: { typeId: type.id },
      take: Math.min(Number(req.body?.limit) || 50, 200),
      skip: Number(req.body?.offset) || 0,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.ontologyObject.count({ where: { typeId: type.id } }),
  ])
  return res.json({ objects, total, auditId: decision.auditId })
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
