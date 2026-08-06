// ---------------------------------------------------------------------------
// Public Trust routes — /api/public/trust/*
// No auth. Overshadow Roadmap P1 ("Publish the Proof"): makes AEGIS's
// governance-native posture, the AIP-parity capability scorecard, and the
// eval/drift pipeline independently verifiable by a prospect, analyst, or
// journalist — not just claims in an internal memory file. Every handler
// here delegates to services/publicTrust.service.ts, which returns
// aggregate-only data; this file must never proxy an admin-gated route.
// ---------------------------------------------------------------------------

import { Router, Request, Response } from 'express'
import logger from '../utils/logger'
import { computeCapabilityScorecard, computeGovernanceSummary, computeEvalHealth } from '../services/publicTrust.service'

export const publicTrustRouter = Router()

publicTrustRouter.get('/scorecard', async (_req: Request, res: Response) => {
  try {
    const data = await computeCapabilityScorecard()
    res.json(data)
  } catch (err: any) {
    logger.warn('[public-trust] scorecard failed: ' + err.message)
    res.status(500).json({ error: 'Unable to compute scorecard' })
  }
})

publicTrustRouter.get('/governance-summary', async (_req: Request, res: Response) => {
  try {
    const data = await computeGovernanceSummary()
    res.json(data)
  } catch (err: any) {
    logger.warn('[public-trust] governance-summary failed: ' + err.message)
    res.status(500).json({ error: 'Unable to compute governance summary' })
  }
})

publicTrustRouter.get('/eval-health', async (_req: Request, res: Response) => {
  try {
    const data = await computeEvalHealth()
    res.json(data)
  } catch (err: any) {
    logger.warn('[public-trust] eval-health failed: ' + err.message)
    res.status(500).json({ error: 'Unable to compute eval health' })
  }
})
