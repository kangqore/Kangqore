// ---------------------------------------------------------------------------
// AEGIS Access Shield — blocks any non-ADMIN role from reaching KIMMP endpoints.
//
// Every denied attempt is logged to the AegisAuditLog (ACCESS_DENIED domain).
// Every allowed attempt is also counted so the ADMIN can see access patterns.
// ---------------------------------------------------------------------------

import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../../../services/token.service'
import { AegisLedger } from './aegisLedger.service'
import { AegisEventEmitter } from './aegisEventEmitter'
import { aegisStorage, generateCorrelationId, AegisRequestContext } from './AegisContext'
import { aegisConfig } from './aegisConfig'

export function aegisShield(req: Request, res: Response, next: NextFunction): void {
  // Build-mode bypass — shield is off, let everything through
  if (!aegisConfig.enabled) {
    const token = req.headers.authorization?.substring(7)
    const payload = token ? verifyAccessToken(token) : null
    if (payload) (req as any).user = payload
    return next()
  }
  const correlationId = generateCorrelationId()
  const ctx: AegisRequestContext = { correlationId, requesterId: 'anonymous', httpSurface: 'aegis' }
  ;(req as any).aegisCorrelationId = correlationId
  res.setHeader('X-Aegis-Correlation', correlationId)

  // Wrap the entire middleware body in the storage context so every AegisLedger
  // and AegisShield write in this async chain receives the same correlationId.
  aegisStorage.run(ctx, () => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      AegisLedger.logAccessDenied({
        endpoint: req.path,
        method:   req.method,
        ip:       req.ip,
      }).catch(() => {})

      res.status(401).json({
        error:         'AEGIS: No bearer token. KIMMP endpoints require ADMIN authentication.',
        shield:        'AEGIS',
        correlationId,
      })
      return
    }

    const token   = authHeader.substring(7)
    const payload = verifyAccessToken(token)

    if (!payload) {
      AegisLedger.logAccessDenied({
        endpoint: req.path,
        method:   req.method,
        ip:       req.ip,
      }).catch(() => {})
      AegisEventEmitter.fireAccessDenied({ metadata: { endpoint: req.path, reason: 'invalid-token' } })

      res.status(401).json({
        error:         'AEGIS: Invalid or expired token.',
        shield:        'AEGIS',
        correlationId,
      })
      return
    }

    if ((payload as any).role !== 'ADMIN') {
      ctx.requesterId = (payload as any).userId ?? 'anonymous'
      AegisLedger.logAccessDenied({
        endpoint: req.path,
        method:   req.method,
        userId:   (payload as any).userId,
        userRole: (payload as any).role,
        ip:       req.ip,
      }).catch(() => {})
      AegisEventEmitter.fireAccessDenied({
        userId:   (payload as any).userId,
        metadata: { endpoint: req.path, role: (payload as any).role, reason: 'non-admin' },
      })

      res.status(403).json({
        error:         'AEGIS: ADMIN sovereignty enforced. Only ADMIN may access KIMMP.',
        shield:        'AEGIS',
        role:          (payload as any).role,
        correlationId,
      })
      return
    }

    // Propagate requester identity into context for downstream ledger writes
    ctx.requesterId = (payload as any).userId ?? 'anonymous'
    ;(req as any).user = payload
    next()
  })
}

// ---------------------------------------------------------------------------
// aegisAccessLogger — log-only variant for KIMMP routes.
//
// Logs ACCESS_DENIED to AEGIS when a request carries no valid ADMIN token,
// then always calls next() so downstream requireAuth handles the actual block.
// This gives AEGIS full visibility into KIMMP auth failures without changing
// KIMMP's own error format or auth flow.
// ---------------------------------------------------------------------------
export function aegisAccessLogger(req: Request, res: Response, next: NextFunction): void {
  // Build-mode bypass — skip logging when AEGIS is off
  if (!aegisConfig.enabled) return next()

  const correlationId = generateCorrelationId()
  const ctx: AegisRequestContext = { correlationId, requesterId: 'anonymous', httpSurface: 'kimmp' }
  ;(req as any).aegisCorrelationId = correlationId
  res.setHeader('X-Aegis-Correlation', correlationId)

  // Wrap so that aegisEgressMonitor, the route handler, MissionDispatcher, and
  // KoreRuntimeManager all run in the same AsyncLocalStorage context.
  aegisStorage.run(ctx, () => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      AegisLedger.logAccessDenied({
        endpoint: req.path,
        method:   req.method,
        ip:       req.ip,
      }).catch(() => {})
      next()
      return
    }

    const token   = authHeader.substring(7)
    const payload = verifyAccessToken(token)

    if (!payload || (payload as any).role !== 'ADMIN') {
      AegisLedger.logAccessDenied({
        endpoint: req.path,
        method:   req.method,
        userId:   (payload as any)?.userId,
        userRole: (payload as any)?.role,
        ip:       req.ip,
      }).catch(() => {})
    } else {
      ctx.requesterId = (payload as any).userId ?? 'anonymous'
    }

    next()
  })
}
