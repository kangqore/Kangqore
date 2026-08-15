// Phase 6 REST API Router — Agent Primary UX Endpoints
// Exposes `/api/agent-ux/intent` for submitting natural language intents and retrieving 11-step pipeline telemetry.

import { Router, Request, Response } from 'express'
import { AgentPrimaryUxService } from '../kangqore-view/kimmp/agents/AgentPrimaryUx.service'

const router = Router()

// POST /api/agent-ux/intent — Execute natural language agent intent
router.post('/intent', async (req: Request, res: Response) => {
  try {
    const { intentText } = req.body
    if (!intentText || typeof intentText !== 'string') {
      return res.status(400).json({ error: 'intentText is required as a string' })
    }

    const actorId = (req as any).user?.id || 'agent-primary-actor'
    const result = await AgentPrimaryUxService.executeIntent({ intentText, actorId })
    return res.json({ success: true, execution: result })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

// GET /api/agent-ux/sample-intents — Get canonical executive sample intents
router.get('/sample-intents', (req: Request, res: Response) => {
  return res.json({
    success: true,
    intents: [
      { id: '1', text: 'Fix the projects that are going to miss their deadlines.', category: 'PROJECT_RECOVERY', icon: 'AlertTriangle' },
      { id: '2', text: 'Optimize team allocation across Q3 deliverables to eliminate bottlenecks.', category: 'CAPACITY_OPTIMIZATION', icon: 'Users' },
      { id: '3', text: 'Resolve all high-priority customer escalations with pending SLA breaches.', category: 'CUSTOMER_HEALTH', icon: 'ShieldCheck' },
      { id: '4', text: 'Simulate financial impact of shifting Milestone 3 by 14 days.', category: 'FINANCIAL_SIMULATION', icon: 'BarChart' },
    ]
  })
})

export default router
