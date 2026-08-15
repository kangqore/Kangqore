// Intelligence OS routes — Layers 1–4
//
// All endpoints require ADMIN JWT (enforced by authenticate + authorize middleware).
// Layer 4 trigger is async: the AutonomousOrchestrator runs in the background;
// the client receives the initial AutonomousExecution row to poll or stream.

import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { IntelligenceSignalEngine } from '../kangqore-view/awareness'
import { PredictiveEngine, PrescriptiveEngine } from '../kangqore-view/perception'
import { AutonomousOrchestrator }   from '../kangqore-view/automation/AutonomousOrchestrator'

const router = Router()
const adminGuard = [authenticate, authorize(['ADMIN'])]

// ── Layer 1 — Descriptive ──────────────────────────────────────────────────

router.get('/descriptive', ...adminGuard, async (req, res) => {
  try {
    const snapshot = await IntelligenceSignalEngine.computeDescriptive()
    res.json(snapshot)
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Descriptive intelligence failed' })
  }
})

// ── Layer 2 — Predictive ───────────────────────────────────────────────────

router.get('/predictive', ...adminGuard, async (req, res) => {
  try {
    const snapshot = await PredictiveEngine.computePredictions()
    res.json(snapshot)
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Predictive intelligence failed' })
  }
})

// ── Layer 3 — Prescriptive ────────────────────────────────────────────────

// List current recommendations
router.get('/prescriptive', ...adminGuard, async (req, res) => {
  try {
    const { status, impact, limit } = req.query as any
    const recs = await PrescriptiveEngine.listRecommendations({
      status: status ?? 'PENDING',
      impact,
      limit: limit ? parseInt(limit) : 20,
    })
    res.json(recs)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// Regenerate recommendations from live signals
router.post('/prescriptive/generate', ...adminGuard, async (req, res) => {
  try {
    const result = await PrescriptiveEngine.generateRecommendations()
    res.json(result)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// Expire stale recommendations
router.post('/prescriptive/expire', ...adminGuard, async (_req, res) => {
  try {
    await PrescriptiveEngine.expire()
    res.json({ ok: true })
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// Accept a recommendation
router.post('/prescriptive/:id/accept', ...adminGuard, async (req, res) => {
  try {
    const rec = await PrescriptiveEngine.accept(req.params.id, (req as any).user?.id)
    res.json(rec)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// Dismiss a recommendation
router.post('/prescriptive/:id/dismiss', ...adminGuard, async (req, res) => {
  try {
    const { reason } = req.body
    const rec = await PrescriptiveEngine.dismiss(req.params.id, (req as any).user?.id, reason)
    res.json(rec)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// ── Layer 4 — Autonomous ──────────────────────────────────────────────────

// List autonomous execution records
router.get('/autonomous', ...adminGuard, async (req, res) => {
  try {
    const { status, limit } = req.query as any
    const rows = await AutonomousOrchestrator.list({
      status,
      limit: limit ? parseInt(limit) : 20,
    })
    res.json(rows)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// Get single autonomous execution
router.get('/autonomous/:id', ...adminGuard, async (req, res) => {
  try {
    const ae = await AutonomousOrchestrator.get(req.params.id)
    if (!ae) return res.status(404).json({ error: 'Not found' })
    res.json(ae)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// Trigger a new autonomous cycle
router.post('/autonomous/trigger', ...adminGuard, async (req, res) => {
  try {
    const { context, triggerId, triggerType } = req.body
    if (!context || typeof context !== 'object') {
      return res.status(400).json({ error: 'context (object) is required' })
    }
    // Kick off async — return the initial AE row immediately
    const ae = await AutonomousOrchestrator.trigger({ context, triggerId, triggerType })
    res.json(ae)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// Resume an execution after human approval
router.post('/autonomous/:id/resume', ...adminGuard, async (req, res) => {
  try {
    await AutonomousOrchestrator.resumeAfterApproval(req.params.id)
    const ae = await AutonomousOrchestrator.get(req.params.id)
    res.json(ae)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

export default router
