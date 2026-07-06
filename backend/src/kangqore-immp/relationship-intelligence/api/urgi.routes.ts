import { Router } from 'express';
import {
  getLiveSessions,
  getEvidenceLedger,
  initializeReplayQueue,
  updateGovernancePolicies,
  getDigitalTwin
} from './urgi.controller';

const router = Router();

// Dashboard Endpoints
router.get('/sessions/live', getLiveSessions);
router.get('/evidence', getEvidenceLedger);
router.get('/twin/:id', getDigitalTwin);

// Action Endpoints
router.post('/replay/initialize', initializeReplayQueue);
router.post('/governance/update', updateGovernancePolicies);

export const urgiRoutes = router;
