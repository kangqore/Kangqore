// Phase 6 — Agent Primary UX API.
//
// Mounted via routes/agentUx.routes.ts so index.ts never reaches into
// kangqore-view directly. Every route authenticates: the previous version of
// this surface was mounted with no auth at all.

import { Router, Request, Response } from 'express'
import { authenticate } from '../../../middleware/auth'
import { AgentMissionEngine } from './AgentMissionEngine'
import { ProjectDelayAnalyzer } from './ProjectDelayAnalyzer'

const router = Router()

const actorOf = (req: Request): string => (req as any).user?.id
const fail = (res: Response, err: any, status = 400) =>
  res.status(status).json({ error: err?.message ?? String(err) })

/** Submit an intent. Plans up to the approval gate; changes nothing. */
router.post('/intent', authenticate, async (req: Request, res: Response) => {
  const { intentText } = req.body ?? {}
  if (!intentText || typeof intentText !== 'string') {
    return res.status(400).json({ error: 'intentText is required as a string' })
  }
  try {
    const mission = await AgentMissionEngine.plan({
      intentText,
      actorId: actorOf(req),
      tenantId: (req as any).user?.tenantId,
    })
    return res.status(201).json({ success: true, mission })
  } catch (err: any) {
    return fail(res, err, 500)
  }
})

router.get('/missions', authenticate, async (req: Request, res: Response) => {
  const mine = req.query.all === 'true' ? undefined : actorOf(req)
  return res.json({ missions: await AgentMissionEngine.list(mine, Number(req.query.limit) || 25) })
})

router.get('/missions/:id', authenticate, async (req: Request, res: Response) => {
  const mission = await AgentMissionEngine.get(req.params.id)
  if (!mission) return res.status(404).json({ error: 'Mission not found' })
  return res.json({ mission })
})

/** Record the human decision at the approval gate. */
router.post('/missions/:id/approve', authenticate, async (req: Request, res: Response) => {
  try {
    return res.json({ success: true, mission: await AgentMissionEngine.decide(req.params.id, true, actorOf(req)) })
  } catch (err: any) {
    return fail(res, err)
  }
})

router.post('/missions/:id/reject', authenticate, async (req: Request, res: Response) => {
  try {
    return res.json({ success: true, mission: await AgentMissionEngine.decide(req.params.id, false, actorOf(req)) })
  } catch (err: any) {
    return fail(res, err)
  }
})

/** Resume after approval: execute, then verify. Refuses unless APPROVED. */
router.post('/missions/:id/execute', authenticate, async (req: Request, res: Response) => {
  try {
    return res.json({ success: true, mission: await AgentMissionEngine.execute(req.params.id, actorOf(req)) })
  } catch (err: any) {
    return fail(res, err)
  }
})

/** The forecast on its own, for dashboards that want it without a mission. */
router.get('/forecast', authenticate, async (_req: Request, res: Response) => {
  const forecasts = await ProjectDelayAnalyzer.forecastAll()
  return res.json({
    total: forecasts.length,
    atRisk: forecasts.filter(f => ['OVERDUE', 'CRITICAL', 'AT_RISK'].includes(f.riskBand)).length,
    forecasts,
  })
})

router.get('/sample-intents', authenticate, (_req: Request, res: Response) => {
  return res.json({
    intents: [
      'Fix the projects that are going to miss their deadlines.',
      'Which projects are at risk of slipping?',
      'Show me the delivery status across all active projects.',
    ],
  })
})

export default router
