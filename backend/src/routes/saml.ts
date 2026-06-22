import { Router, Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { Strategy as SamlStrategy, type Profile, type VerifiedCallback } from '@node-saml/passport-saml'
import { Role } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { createSession } from '../services/session.service'
import { generateCustomId } from '../utils/idGenerator'
import logger from '../utils/logger'

const router = Router()

// ─── Guard: only register strategy if IdP is configured ──────────────────────

const SAML_ENABLED = !!(
  process.env.SAML_ENTRY_POINT &&
  process.env.SAML_CERT
)

const FRONTEND_URL    = process.env.FRONTEND_URL    || 'https://kangqore.com'
const SAML_ISSUER     = process.env.SAML_ISSUER     || 'https://kangqore.com'
const SAML_CALLBACK_URL =
  process.env.SAML_CALLBACK_URL ||
  `${FRONTEND_URL.replace(/\/$/, '')}/api/auth/saml/callback`

if (SAML_ENABLED) {
  passport.use(
    'saml',
    new SamlStrategy(
      {
        entryPoint:              process.env.SAML_ENTRY_POINT!,
        issuer:                  SAML_ISSUER,
        callbackUrl:             SAML_CALLBACK_URL,
        idpCert:                 process.env.SAML_CERT!,
        wantAuthnResponseSigned: false,
        wantAssertionsSigned:    true,
        signatureAlgorithm:      'sha256',
      },
      // signon verify
      async (profile: Profile | null, done: VerifiedCallback) => {
        if (!profile) return done(new Error('Empty SAML profile'))
        try {
          const email: string =
            (profile.email as string) ||
            (profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] as string) ||
            (profile.nameID as string)

          if (!email) return done(new Error('SAML assertion missing email claim'))

          const name: string =
            (profile.displayName as string) ||
            (profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] as string) ||
            email.split('@')[0]

          // Map SAML group claim → Kangqore role
          const groupClaim =
            ((profile['http://schemas.microsoft.com/ws/2008/06/identity/claims/groups'] ||
              profile.groups || '') as string).toLowerCase()

          const roleMap: Record<string, Role> = {
            kangqore_admins:    Role.ADMIN,
            kangqore_clients:   Role.CLIENT,
            kangqore_partners:  Role.PARTNER,
            kangqore_investors: Role.INVESTOR,
          }
          const role: Role =
            Object.entries(roleMap).find(([k]) => groupClaim.includes(k))?.[1] ??
            ((process.env.SAML_DEFAULT_ROLE as Role) || Role.ADMIN)

          // JIT provisioning
          let user = await prisma.user.findUnique({ where: { email } })

          if (!user) {
            const id = await generateCustomId(role)
            user = await prisma.user.create({
              data: { id, email, name, role, password: null },
            })
            logger.info(`SAML JIT provisioned ${email} as ${role}`)
          }

          await prisma.user.update({
            where: { id: user.id },
            data:  { lastLoginAt: new Date() },
          })

          return done(null, user as unknown as Record<string, unknown>)
        } catch (err) {
          return done(err as Error)
        }
      },
      // logout verify (required by type signature)
      async (_profile: Profile | null, done: VerifiedCallback) => {
        done(null)
      }
    )
  )

  logger.info('SAML SSO strategy registered')
} else {
  logger.warn('SAML SSO disabled — set SAML_ENTRY_POINT + SAML_CERT to enable')
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/auth/saml/login — redirect browser to IdP
router.get('/login', (req: Request, res: Response, next: NextFunction) => {
  if (!SAML_ENABLED) return res.status(503).json({ message: 'SSO not configured on this instance' })
  passport.authenticate('saml')(req, res, next)
})

// POST /api/auth/saml/callback — IdP posts SAML assertion here
router.post('/callback', (req: Request, res: Response, next: NextFunction) => {
  if (!SAML_ENABLED) return next()
  passport.authenticate('saml', { session: false }, async (err: Error | null, user: any) => {
    if (err || !user) {
      logger.error('SAML callback error', err)
      return res.redirect(`${FRONTEND_URL}/login?sso_error=1`)
    }
    try {
      const { tokens } = await createSession({
        userId:    user.id,
        role:      user.role,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      })

      const userPayload = encodeURIComponent(
        JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role })
      )

      res.redirect(
        `${FRONTEND_URL}/sso/callback` +
        `?token=${tokens.accessToken}` +
        `&refreshToken=${tokens.refreshToken}` +
        `&user=${userPayload}`
      )
    } catch (sessionErr) {
      logger.error('SAML session creation error', sessionErr)
      res.redirect(`${FRONTEND_URL}/login?sso_error=1`)
    }
  })(req, res, next)
})

// GET /api/auth/saml/metadata — SP metadata XML (give this URL to your IdP admin)
router.get('/metadata', (_req: Request, res: Response) => {
  if (!SAML_ENABLED) return res.status(503).json({ message: 'SSO not configured' })

  const metadata = `<?xml version="1.0"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${SAML_ISSUER}">
  <SPSSODescriptor
    AuthnRequestsSigned="false"
    WantAssertionsSigned="true"
    protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <AssertionConsumerService
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
      Location="${SAML_CALLBACK_URL}"
      index="1"/>
  </SPSSODescriptor>
</EntityDescriptor>`

  res.set('Content-Type', 'application/xml').send(metadata)
})

export default router
