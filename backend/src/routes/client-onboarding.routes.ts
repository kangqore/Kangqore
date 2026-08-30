// Client Onboarding route delegator.
//   index.ts → routes/client-onboarding.routes.ts → kangqore-view/clients/clientOnboardingRoutes.ts

import { Router } from 'express'
import clientOnboardingRoutes from '../kangqore-view/clients/clientOnboardingRoutes'

const router = Router()
router.use(clientOnboardingRoutes)
export default router
