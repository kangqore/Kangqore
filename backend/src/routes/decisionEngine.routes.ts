// Phase 7 REST API Router — Next-Gen Decision Engine Endpoints
// Exposes `/api/decision-engine/evaluate-matrix` and `/api/decision-engine/approve`.

import { Router, Request, Response } from 'express'
import { DecisionEngine } from '../kangqore-view/kimmp/decision/decisionEngine.service'

const router = Router()

// POST /api/decision-engine/evaluate-matrix — Evaluate decision context and return 7-part Decision Matrix
router.post('/evaluate-matrix', async (req: Request, res: Response) => {
  try {
    const { decisionContext, targetEntityId, entityType } = req.body
    const actorId = (req as any).user?.id || 'exec-actor-1'

    const result = await DecisionEngine.evaluateMatrix({
      decisionContext: decisionContext || 'Reassign project resources to address critical path SLA delay.',
      targetEntityId,
      entityType,
      actorId,
    })

    return res.json({ success: true, decisionMatrix: result })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

// POST /api/decision-engine/approve — Executive approval & governed action commit
router.post('/approve', async (req: Request, res: Response) => {
  try {
    const { decisionId, approvalToken } = req.body
    if (!decisionId || !approvalToken) {
      return res.status(400).json({ error: 'decisionId and approvalToken are required' })
    }

    const actorId = (req as any).user?.id || 'exec-approver-1'
    const result = await DecisionEngine.approveAndExecute(decisionId, approvalToken, actorId)
    return res.json({ success: true, approval: result })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

export default router
