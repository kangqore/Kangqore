// ---------------------------------------------------------------------------
// HANUMANAS Access Shield — blocks any non-ADMIN role from reaching KIMMP endpoints.
//
// Every denied attempt is logged to the HanumanasAuditLog (ACCESS_DENIED domain).
// Every allowed attempt is also counted so the ADMIN can see access patterns.
// ---------------------------------------------------------------------------

import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../../kernel/auth/TokenService'
import { HanumanasLedger } from './hanumanasLedger.service'
import { HanumanasEventEmitter } from './hanumanasEventEmitter'
import { hanumanasStorage, generateCorrelationId, HanumanasRequestContext } from './HanumanasContext'
import { hanumanasConfig } from './hanumanasConfig'

export function hanumanasShield(req: Request, res: Response, next: NextFunction): void {
  // Build-mode bypass — shield is off, let everything through
  if (!hanumanasConfig.enabled) {
    const token = req.headers.authorization?.substring(7)
    const payload = token ? verifyAccessToken(token) : null
    if (payload) (req as any).user = payload
    return next()
  }
  const correlationId = generateCorrelationId()
  const ctx: HanumanasRequestContext = { correlationId, requesterId: 'anonymous', httpSurface: 'hanumanas' }
  ;(req as any).hanumanasCorrelationId = correlationId
  res.setHeader('X-Hanumanas-Correlation', correlationId)

  // Wrap the entire middleware body in the storage context so every HanumanasLedger
  // and HanumanasShield write in this async chain receives the same correlationId.
  hanumanasStorage.run(ctx, () => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      HanumanasLedger.logAccessDenied({
        endpoint: req.path,
        method:   req.method,
        ip:       req.ip,
      }).catch(() => {})

      res.status(401).json({
        error:         'HANUMANAS: No bearer token. KIMMP endpoints require ADMIN authentication.',
        shield:        'HANUMANAS',
        correlationId,
      })
      return
    }

    const token   = authHeader.substring(7)
    const payload = verifyAccessToken(token)

    if (!payload) {
      HanumanasLedger.logAccessDenied({
        endpoint: req.path,
        method:   req.method,
        ip:       req.ip,
      }).catch(() => {})
      HanumanasEventEmitter.fireAccessDenied({ metadata: { endpoint: req.path, reason: 'invalid-token' } })

      res.status(401).json({
        error:         'HANUMANAS: Invalid or expired token.',
        shield:        'HANUMANAS',
        correlationId,
      })
      return
    }

    if ((payload as any).role !== 'ADMIN') {
      ctx.requesterId = (payload as any).userId ?? 'anonymous'
      HanumanasLedger.logAccessDenied({
        endpoint: req.path,
        method:   req.method,
        userId:   (payload as any).userId,
        userRole: (payload as any).role,
        ip:       req.ip,
      }).catch(() => {})
      HanumanasEventEmitter.fireAccessDenied({
        userId:   (payload as any).userId,
        metadata: { endpoint: req.path, role: (payload as any).role, reason: 'non-admin' },
      })

      res.status(403).json({
        error:         'HANUMANAS: ADMIN sovereignty enforced. Only ADMIN may access KIMMP.',
        shield:        'HANUMANAS',
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
// hanumanasAccessLogger — log-only variant for KIMMP routes.
//
// Logs ACCESS_DENIED to HANUMANAS when a request carries no valid ADMIN token,
// then always calls next() so downstream requireAuth handles the actual block.
// This gives HANUMANAS full visibility into KIMMP auth failures without changing
// KIMMP's own error format or auth flow.
// ---------------------------------------------------------------------------
export function hanumanasAccessLogger(req: Request, res: Response, next: NextFunction): void {
  // Build-mode bypass — skip logging when HANUMANAS is off
  if (!hanumanasConfig.enabled) return next()

  const correlationId = generateCorrelationId()
  const ctx: HanumanasRequestContext = { correlationId, requesterId: 'anonymous', httpSurface: 'kimmp' }
  ;(req as any).hanumanasCorrelationId = correlationId
  res.setHeader('X-Hanumanas-Correlation', correlationId)

  // Wrap so that hanumanasEgressMonitor, the route handler, MissionDispatcher, and
  // KoreRuntimeManager all run in the same AsyncLocalStorage context.
  hanumanasStorage.run(ctx, () => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      HanumanasLedger.logAccessDenied({
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
      HanumanasLedger.logAccessDenied({
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
