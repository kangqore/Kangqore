// Phase 6 — Agent Primary UX route delegator.
//
// The routes are OS-native and live in the kangqore-view module:
//   index.ts → routes/agentUx.routes.ts → kangqore-view/kimmp/agents/agentMissionRoutes.ts
//
// This file exists only so index.ts never reaches into kangqore-view directly.

import { Router } from 'express'
import agentMissionRoutes from '../kangqore-view/kimmp/agents/agentMissionRoutes'

const router = Router()

router.use(agentMissionRoutes)

export default router
