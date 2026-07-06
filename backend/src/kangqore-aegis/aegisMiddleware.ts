// ---------------------------------------------------------------------------
// AEGIS Access Shield — blocks any non-ADMIN role from reaching KIMMP endpoints.
//
// Every denied attempt is logged to the AegisAuditLog (ACCESS_DENIED domain).
// Every allowed attempt is also counted so the ADMIN can see access patterns.
// ---------------------------------------------------------------------------

import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../services/token.service'
import { AegisLedger } from './aegisLedger.service'
import { AegisEventEmitter } from './aegisEventEmitter'

export function aegisShield(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    AegisLedger.logAccessDenied({
      endpoint: req.path,
      method:   req.method,
      ip:       req.ip,
    }).catch(() => {})

    res.status(401).json({
      error: 'AEGIS: No bearer token. KIMMP endpoints require ADMIN authentication.',
      shield: 'AEGIS',
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
      error: 'AEGIS: Invalid or expired token.',
      shield: 'AEGIS',
    })
    return
  }

  if ((payload as any).role !== 'ADMIN') {
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
      error:   'AEGIS: ADMIN sovereignty enforced. Only ADMIN may access KIMMP.',
      shield:  'AEGIS',
      role:    (payload as any).role,
    })
    return
  }

  // Attach user for downstream handlers
  ;(req as any).user = payload
  next()
}

// ---------------------------------------------------------------------------
// aegisAccessLogger — log-only variant for KIMMP routes.
//
// Logs ACCESS_DENIED to AEGIS when a request carries no valid ADMIN token,
// then always calls next() so downstream requireAuth handles the actual block.
// This gives AEGIS full visibility into KIMMP auth failures without changing
// KIMMP's own error format or auth flow.
// ---------------------------------------------------------------------------
export function aegisAccessLogger(req: Request, _res: Response, next: NextFunction): void {
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
  }

  next()
}
