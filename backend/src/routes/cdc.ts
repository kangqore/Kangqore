// F-Infra Sprint +4 — CDC Routes
// /api/admin/cdc/*

import { Router }               from 'express'
import { authenticate }         from '../middleware/auth'
import { requireRole }          from '../middleware/rbac'
import { CdcService }           from '../lib/cdc/cdcService'
import { BROKER_COMPARISON, SPIKE_VERDICT, currentBusName } from '../lib/eventBus'
import type { CDCOperation }    from '../lib/eventBus'

const router = Router()
const guard  = [authenticate, requireRole(['ADMIN'])]

router.get('/events', ...guard, (req, res) => {
  const { table, op, limit } = req.query
  const events = CdcService.getRecentEvents({
    table: table as string | undefined,
    op:    op    as CDCOperation | undefined,
    limit: limit ? Number(limit) : 100,
  })
  res.json({ events })
})

router.get('/stats', ...guard, (_req, res) => {
  res.json({ stats: CdcService.getStats(), bus: currentBusName() })
})

router.get('/config', ...guard, (_req, res) => {
  res.json({ config: CdcService.getConfig(), bus: currentBusName() })
})

router.get('/broker-comparison', ...guard, (_req, res) => {
  res.json({
    comparison: BROKER_COMPARISON,
    verdict:    SPIKE_VERDICT,
    activeBus:  currentBusName(),
  })
})

export default router
