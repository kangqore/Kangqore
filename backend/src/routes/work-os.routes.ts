// Work OS route delegator.
//   index.ts → routes/work-os.routes.ts → kangqore-view/eof/workOsRoutes.ts

import { Router } from 'express'
import workOsRoutes from '../kangqore-view/eof/workOsRoutes'

const router = Router()
router.use(workOsRoutes)
export default router
