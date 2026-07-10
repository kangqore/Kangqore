import { Router } from 'express';
import { AgentRegistry } from './core/AgentRegistry';
import { AgentOrchestrator } from './core/AgentOrchestrator';
import { AgentOrchestrationPlan } from './contracts/types';

const router = Router();
const orchestrator = new AgentOrchestrator();

// GET /api/v1/os/eaf/agents — list all registered enterprise agents
router.get('/agents', (_req, res) => {
  try {
    const agents = AgentRegistry.getInstance().getAllMetadata();
    res.json({ agents, count: agents.length });
  } catch {
    res.status(500).json({ error: 'EAF agent registry unavailable' });
  }
});

// GET /api/v1/os/eaf/agents/:agentId — get a single agent's metadata
router.get('/agents/:agentId', (req, res) => {
  try {
    const agent = AgentRegistry.getInstance().get(req.params.agentId);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    res.json(agent.getMetadata());
  } catch {
    res.status(500).json({ error: 'EAF registry error' });
  }
});

// GET /api/v1/os/eaf/agents/domain/:domainId — agents scoped to a domain
router.get('/agents/domain/:domainId', (req, res) => {
  try {
    const agents = AgentRegistry.getInstance().getByDomain(req.params.domainId);
    res.json({ agents: agents.map(a => a.getMetadata()), domainId: req.params.domainId });
  } catch {
    res.status(500).json({ error: 'EAF domain query error' });
  }
});

// POST /api/v1/os/eaf/orchestrate — execute an agent orchestration plan
router.post('/orchestrate', async (req, res) => {
  try {
    const plan: AgentOrchestrationPlan = req.body;
    if (!plan?.planId || !plan?.agents?.length) {
      return res.status(400).json({ error: 'planId and agents[] required' });
    }
    const result = await orchestrator.execute(plan);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Orchestration failed', detail: err?.message });
  }
});

export default router;
