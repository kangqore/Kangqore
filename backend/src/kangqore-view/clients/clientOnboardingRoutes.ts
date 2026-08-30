// Client Onboarding board API.
//
// Mounted via routes/client-onboarding.routes.ts so index.ts never reaches into
// kangqore-view directly.

import { Router, Request, Response } from 'express'
import { authenticate, authorize } from '../../middleware/auth'
import { ClientOnboardingService, OnboardingStage } from './ClientOnboardingService'

const router = Router()
const guard = [authenticate, authorize(['ADMIN'])]
const actorOf = (req: Request): string => (req as any).user?.id

/** The board itself: clients grouped by onboarding stage. */
router.get('/board', ...guard, async (_req: Request, res: Response) => {
  try {
    return res.json(await ClientOnboardingService.board())
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

/** Stage definitions, so the UI does not hardcode them. */
router.get('/stages', ...guard, (_req: Request, res: Response) => {
  return res.json({
    stages: ClientOnboardingService.ONBOARDING_STAGES.map(id => ({
      id, ...ClientOnboardingService.STAGE_META[id],
    })),
  })
})

/** The "New client" button. */
router.post('/clients', ...guard, async (req: Request, res: Response) => {
  try {
    const card = await ClientOnboardingService.createClient({ ...req.body, actorId: actorOf(req) })
    return res.status(201).json({ client: card })
  } catch (err: any) {
    return res.status(400).json({ error: err.message })
  }
})

/** Dragging a card between groups. This is where provisioning happens. */
router.post('/clients/:id/stage', ...guard, async (req: Request, res: Response) => {
  const to = req.body?.stage as OnboardingStage
  if (!to) return res.status(400).json({ error: 'stage is required' })
  try {
    return res.json(await ClientOnboardingService.moveToStage(req.params.id, to, actorOf(req)))
  } catch (err: any) {
    return res.status(400).json({ error: err.message })
  }
})

export default router
