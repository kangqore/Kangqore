// Phase 5.1 — OAuth 2.0 for Kangqore View apps
//
// Supports authorization_code (with PKCE S256), client_credentials, and
// refresh_token. Tokens are stored as SHA-256 hashes; raw values are returned
// to the client once and never persisted in recoverable form.

import crypto from 'crypto'
import { prisma } from '../../lib/prisma'
import { DeveloperPlatformService } from './DeveloperPlatform.service'

const sha256 = (raw: string) => crypto.createHash('sha256').update(raw).digest('hex')

const ACCESS_TOKEN_TTL_S = 3600         // 1 hour
const REFRESH_TOKEN_TTL_S = 60 * 60 * 24 * 30 // 30 days
const AUTH_CODE_TTL_S = 600             // 10 minutes

export interface TokenResponse {
  access_token: string
  refresh_token?: string
  token_type: 'Bearer'
  expires_in: number
  scope: string
}

function verifyPkce(codeChallenge: string | null, codeVerifier?: string): boolean {
  if (!codeChallenge) return true // PKCE not used for this code
  if (!codeVerifier) return false
  const hash = crypto.createHash('sha256').update(codeVerifier).digest('base64url')
  return hash === codeChallenge
}

export const AppOAuthService = {
  /** Step 1 of authorization_code — issue a short-lived code after user consent. */
  async createAuthorizationCode(args: {
    clientId: string
    userId: string
    tenantId: string
    redirectUri: string
    scopes: string[]
    codeChallenge?: string
  }) {
    const app = await prisma.developerApp.findUnique({ where: { clientId: args.clientId } })
    if (!app) throw new Error('Unknown client_id')
    if (app.status === 'SUSPENDED') throw new Error('Client is suspended')

    // Redirect URI must be pre-registered — prevents open-redirect token theft.
    if (!app.redirectUris.includes(args.redirectUri)) {
      throw new Error('redirect_uri is not registered for this client')
    }

    const code = `kqac_${crypto.randomBytes(24).toString('hex')}`
    await prisma.appOAuthCode.create({
      data: {
        code,
        appId: app.appId,
        userId: args.userId,
        tenantId: args.tenantId,
        redirectUri: args.redirectUri,
        scopes: args.scopes,
        codeChallenge: args.codeChallenge ?? null,
        expiresAt: new Date(Date.now() + AUTH_CODE_TTL_S * 1000),
      },
    })

    return { code, expiresIn: AUTH_CODE_TTL_S }
  },

  /** Step 2 of authorization_code — exchange the code for tokens. */
  async exchangeAuthorizationCode(args: {
    clientId: string
    clientSecret: string
    code: string
    redirectUri: string
    codeVerifier?: string
  }): Promise<TokenResponse> {
    const app = await DeveloperPlatformService.verifyClientCredentials(args.clientId, args.clientSecret)
    if (!app) throw new Error('invalid_client')

    const record = await prisma.appOAuthCode.findUnique({ where: { code: args.code } })
    if (!record) throw new Error('invalid_grant: unknown code')
    if (record.appId !== app.appId) throw new Error('invalid_grant: code was issued to a different client')
    if (record.used) throw new Error('invalid_grant: code already redeemed')
    if (record.expiresAt < new Date()) throw new Error('invalid_grant: code expired')
    if (record.redirectUri !== args.redirectUri) throw new Error('invalid_grant: redirect_uri mismatch')
    if (!verifyPkce(record.codeChallenge, args.codeVerifier)) throw new Error('invalid_grant: PKCE verification failed')

    // Single-use.
    await prisma.appOAuthCode.update({ where: { id: record.id }, data: { used: true } })

    return this.issueTokens({
      appId: app.appId,
      tenantId: record.tenantId,
      userId: record.userId,
      scopes: record.scopes,
      grantType: 'authorization_code',
    })
  },

  /** Machine-to-machine grant — no user context. */
  async clientCredentialsGrant(args: {
    clientId: string
    clientSecret: string
    tenantId: string
    scopes?: string[]
  }): Promise<TokenResponse> {
    const app = await DeveloperPlatformService.verifyClientCredentials(args.clientId, args.clientSecret)
    if (!app) throw new Error('invalid_client')

    const installation = await prisma.appInstallation.findUnique({
      where: { appId_tenantId: { appId: app.appId, tenantId: args.tenantId } },
    })
    if (!installation || installation.status !== 'ACTIVE') {
      throw new Error('invalid_grant: app is not installed for this tenant')
    }

    // Never grant beyond what the tenant approved at install time.
    const requested = args.scopes?.length ? args.scopes : installation.grantedScopes
    const granted = requested.filter(s => installation.grantedScopes.includes(s))

    return this.issueTokens({
      appId: app.appId,
      tenantId: args.tenantId,
      userId: null,
      scopes: granted,
      grantType: 'client_credentials',
    })
  },

  async refreshTokenGrant(args: {
    clientId: string
    clientSecret: string
    refreshToken: string
  }): Promise<TokenResponse> {
    const app = await DeveloperPlatformService.verifyClientCredentials(args.clientId, args.clientSecret)
    if (!app) throw new Error('invalid_client')

    const existing = await prisma.appOAuthToken.findUnique({ where: { refreshHash: sha256(args.refreshToken) } })
    if (!existing || existing.revoked) throw new Error('invalid_grant: refresh token revoked or unknown')
    if (existing.appId !== app.appId) throw new Error('invalid_grant: token belongs to a different client')

    // Rotate: the presented refresh token is retired as the new pair is issued.
    await prisma.appOAuthToken.update({
      where: { id: existing.id },
      data: { revoked: true, revokedAt: new Date() },
    })

    return this.issueTokens({
      appId: app.appId,
      tenantId: existing.tenantId,
      userId: existing.userId,
      scopes: existing.scopes,
      grantType: 'refresh_token',
    })
  },

  async issueTokens(args: {
    appId: string
    tenantId: string
    userId: string | null
    scopes: string[]
    grantType: string
  }): Promise<TokenResponse> {
    const accessToken = `kqat_${crypto.randomBytes(32).toString('hex')}`
    const refreshToken = `kqrt_${crypto.randomBytes(32).toString('hex')}`

    await prisma.appOAuthToken.create({
      data: {
        appId: args.appId,
        tenantId: args.tenantId,
        userId: args.userId,
        grantType: args.grantType,
        tokenHash: sha256(accessToken),
        refreshHash: sha256(refreshToken),
        scopes: args.scopes,
        expiresAt: new Date(Date.now() + ACCESS_TOKEN_TTL_S * 1000),
      },
    })

    await prisma.appAuditEvent.create({
      data: {
        appId: args.appId,
        tenantId: args.tenantId,
        actorId: args.userId ?? 'client_credentials',
        actorType: 'DEVELOPER_APP',
        eventType: 'OAUTH_GRANT',
        outcome: 'ALLOWED',
        result: { grantType: args.grantType, scopes: args.scopes } as any,
      },
    })

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: ACCESS_TOKEN_TTL_S,
      scope: args.scopes.join(' '),
    }
  },

  /** Resolve a bearer token to its app/tenant context. Used by app API auth. */
  async introspect(accessToken: string) {
    const record = await prisma.appOAuthToken.findUnique({
      where: { tokenHash: sha256(accessToken) },
      include: { app: { select: { appId: true, name: true, status: true } } },
    })
    if (!record || record.revoked || record.expiresAt < new Date()) {
      return { active: false as const }
    }

    await prisma.appOAuthToken.update({
      where: { id: record.id },
      data: { lastUsedAt: new Date() },
    })

    return {
      active: true as const,
      appId: record.appId,
      appName: record.app.name,
      tenantId: record.tenantId,
      userId: record.userId,
      scopes: record.scopes,
      expiresAt: record.expiresAt,
    }
  },

  async revokeToken(accessToken: string) {
    const result = await prisma.appOAuthToken.updateMany({
      where: { tokenHash: sha256(accessToken), revoked: false },
      data: { revoked: true, revokedAt: new Date() },
    })
    return { revoked: result.count > 0 }
  },
}
