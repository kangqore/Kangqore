import { Response, NextFunction } from 'express'
import { AuthRequest } from './rbac'

/**
 * Attaches req.currentOrgId from the JWT claim.
 * Call after `authenticate` / `requireAuth` — JWT is already decoded by then.
 *
 * Routes that are org-scoped should use:
 *   router.use(orgScope)
 * then read `req.currentOrgId` in their handlers to scope Prisma queries.
 *
 * Routes that don't require an active org context can skip this middleware
 * and call req.user.currentOrgId directly if they just want to inspect it.
 */
export function orgScope(req: AuthRequest, res: Response, next: NextFunction) {
  const orgId = (req.user as any)?.currentOrgId
  if (!orgId) {
    return res.status(400).json({ message: 'No active organisation — call /api/auth/switch-org first' })
  }
  req.currentOrgId = orgId
  next()
}

/**
 * Soft version — attaches req.currentOrgId if present but does NOT block
 * the request when absent. Use on routes where org context is optional.
 */
export function orgScopeSoft(req: AuthRequest, _res: Response, next: NextFunction) {
  req.currentOrgId = (req.user as any)?.currentOrgId ?? undefined
  next()
}
