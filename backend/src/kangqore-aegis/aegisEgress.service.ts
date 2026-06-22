// ---------------------------------------------------------------------------
// AEGIS Intelligence Egress Control
//
// Tracks every time KIMMP intelligence leaves the system — a briefing read,
// an API response containing sensitive intelligence, a report downloaded.
//
// Egress is not blocked — the ADMIN has full access to their own intelligence.
// But every egress event is logged so the ADMIN can audit exactly what was
// accessed, when, and from where.
// ---------------------------------------------------------------------------

import { Request, Response, NextFunction } from 'express'
import { AegisLedger } from './aegisLedger.service'

// Routes that constitute intelligence egress (KIMMP intelligence leaving the system)
const EGRESS_PATTERNS: RegExp[] = [
  /\/kangqore-immp\/briefings/,
  /\/kangqore-immp\/dispatch/,
  /\/kangqore-immp\/signals/,
  /\/kangqore-immp\/history/,
  /\/kangqore-immp\/synthesis/,
  /\/kangqore-immp\/memory/,
  /\/aegis\/audit/,
  /\/aegis\/autonomy/,
  /\/aegis\/assets/,
]

function classifyRoute(path: string): string | undefined {
  if (/briefings|dispatch|history|synthesis/.test(path)) return 'briefing'
  if (/signals/.test(path))                              return 'signal'
  if (/memory/.test(path))                               return 'learning_record'
  if (/autonomy/.test(path))                             return 'autonomy_log'
  if (/assets/.test(path))                               return 'asset_registry'
  if (/audit/.test(path))                                return 'audit_log'
  return undefined
}

// Express middleware — intercepts KIMMP intelligence responses and logs egress
export function aegisEgressMonitor(req: Request, res: Response, next: NextFunction): void {
  const isEgress = EGRESS_PATTERNS.some(p => p.test(req.path))
  if (!isEgress) { next(); return }

  const originalJson = res.json.bind(res)

  // Override res.json to capture the outbound payload size
  ;(res as any).json = function (body: unknown): Response {
    const user      = (req as any).user
    const assetType = classifyRoute(req.path)

    AegisLedger.logEgress({
      endpoint:        req.path,
      method:          req.method,
      userId:          user?.userId,
      userRole:        user?.role,
      ip:              req.ip,
      assetType,
      payloadSize:     body ? JSON.stringify(body).length : 0,
      responseStatus:  res.statusCode,
    }).catch(() => {})

    return originalJson(body)
  }

  next()
}
