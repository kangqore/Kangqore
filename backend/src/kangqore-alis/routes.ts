import { Router } from 'express';
import { AlisAdminController } from './controllers/alisAdmin.controller';

// ---------------------------------------------------------------------------
// Kangqore ALIS — Route Registry
// All routes are admin-protected (auth guard applied at mount point)
// ---------------------------------------------------------------------------

const alisRouter = Router();

alisRouter.get('/overview', AlisAdminController.getOverview);
alisRouter.get('/revenue', AlisAdminController.getRevenue);
alisRouter.get('/departments', AlisAdminController.getDepartments);
alisRouter.get('/services', AlisAdminController.getServices);
alisRouter.get('/sales-performance', AlisAdminController.getSalesPerformance);
alisRouter.get('/buyer-intent', AlisAdminController.getBuyerIntent);
alisRouter.get('/content-gaps', AlisAdminController.getContentGaps);
alisRouter.get('/alerts', AlisAdminController.getAlerts);
alisRouter.get('/growth-recs', AlisAdminController.getGrowthRecs);
// Phase 2 — trigger ALIS → Signal Ledger market signal scan.
alisRouter.post('/signals/emit', AlisAdminController.emitMarketSignals);

export { alisRouter };
