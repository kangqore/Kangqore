import { Router } from 'express';
import { EqoreAdminController } from './controllers/eqoreAdmin.controller';
import { EqoreGraphController } from './controllers/eqoreGraph.controller';
import { EqoreSalesAdminController } from './controllers/salesAdmin.controller';
import logger from '../utils/logger';

const adminRouter = Router();

// Admin Auth Guard (RBAC Verification)
const adminAuthGuard = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid Authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  const adminSecret = process.env.ADMIN_SECRET_TOKEN || 'eqore-local-dev-admin-secret';

  if (token !== adminSecret) {
    logger.warn(`RBAC violation attempt from IP: ${req.ip}`);
    return res.status(403).json({ error: 'Forbidden', message: 'Invalid admin credentials' });
  }

  req.user = { id: 'admin', role: 'ADMIN' };
  next();
};

adminRouter.use('/', adminAuthGuard);

// Admin Routes (Leads)
adminRouter.get('/leads', EqoreAdminController.listLeads);
adminRouter.get('/leads/:id', EqoreAdminController.getLeadDetail);
adminRouter.patch('/leads/:id/status', EqoreAdminController.updateLeadStatus);

// Admin Graph Intelligence Routes (Phase 5)
adminRouter.get('/graph/nodes', EqoreGraphController.listNodes);
adminRouter.get('/graph/nodes/:id/edges', EqoreGraphController.getNodeEdges);
adminRouter.get('/graph/leads/:leadId/context', EqoreGraphController.getLeadContext);
adminRouter.post('/graph/leads/:leadId/enrich', EqoreGraphController.enrichLead);
adminRouter.get('/graph/stats', EqoreGraphController.getStats);
adminRouter.post('/graph/sync', EqoreGraphController.syncGraph);

// Admin Agent Timeline Routes (Phase 7)
adminRouter.get('/leads/:leadId/timeline', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { prisma: db } = await import('../lib/prisma');
    const logs = await db.eqoreAgentLog.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json({ timeline: logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent timeline' });
  }
});

// Admin Assurance Intelligence Routes (Phase 8B)
adminRouter.get('/leads/:leadId/assurance', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { prisma: db } = await import('../lib/prisma');
    const logs = await db.eqoreAgentLog.findMany({
      where: { leadId, detectedIntent: 'CLIENT_ASSURANCE_QUERY' },
      orderBy: { createdAt: 'desc' }
    });
    
    const assuranceEvents = logs.map((log: any) => {
      const results = (log.resultsJson as any[]) || [];
      const assuranceResult = results.find(r => r.agentName === 'AssuranceEngine');
      return {
        messageId: log.messageId,
        timestamp: log.createdAt,
        metadata: assuranceResult?.metadata || {},
        response: assuranceResult?.userVisibleMessage || '',
        latency: log.totalLatencyMs,
        intentConfidence: log.routingConfidence
      };
    });
    
    res.json({ assuranceEvents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assurance intelligence' });
  }
});

// Admin Sales Pipeline Routes (Phase 9)
adminRouter.get('/sales/opportunities', EqoreSalesAdminController.listOpportunities);
adminRouter.get('/sales/opportunities/:id', EqoreSalesAdminController.getOpportunityDetail);
adminRouter.patch('/sales/opportunities/:id/stage', EqoreSalesAdminController.updateOpportunityStage);
adminRouter.patch('/sales/opportunities/:id/owner', EqoreSalesAdminController.updateOpportunityOwner);
adminRouter.post('/sales/opportunities/:id/sync-crm', EqoreSalesAdminController.syncCrm);

adminRouter.get('/sales/tasks', EqoreSalesAdminController.listTasks);
adminRouter.post('/sales/tasks', EqoreSalesAdminController.createTask);
adminRouter.patch('/sales/tasks/:id', EqoreSalesAdminController.updateTask);

adminRouter.get('/sales/notes/:leadId', EqoreSalesAdminController.getNotes);
adminRouter.post('/sales/notes', EqoreSalesAdminController.createNote);

export { adminRouter as eqoreLeadIntelligenceRoutes };
