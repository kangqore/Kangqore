// Phase 5 — Developer Platform route delegator.
//
// The routes themselves are OS-native and live in the kangqore-view module:
//   index.ts → routes/developer.routes.ts → kangqore-view/developer/developerRoutes.ts
//
// This file exists only so index.ts never reaches into kangqore-view directly,
// matching the automation module's mount chain.

import { Router } from 'express'
import developerRoutes from '../kangqore-view/developer/developerRoutes'

const router = Router()

router.use(developerRoutes)

export default router
