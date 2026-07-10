import { Router } from 'express';
import { ScenarioRegistry } from './core/ScenarioRegistry';
import { SimulationEngine } from './core/SimulationEngine';
import { ScenarioBuilder } from './core/ScenarioBuilder';
import { SimulationScenario } from './contracts/types';

const router = Router();
const engine = new SimulationEngine();

// GET /api/v1/os/esf/templates — all simulation templates
router.get('/templates', (_req, res) => {
  try {
    const templates = ScenarioRegistry.getInstance().getAll();
    res.json({ templates, count: templates.length });
  } catch {
    res.status(500).json({ error: 'ESF template registry unavailable' });
  }
});

// GET /api/v1/os/esf/templates/:templateId — single template
router.get('/templates/:templateId', (req, res) => {
  try {
    const tpl = ScenarioRegistry.getInstance().get(req.params.templateId);
    if (!tpl) return res.status(404).json({ error: 'Template not found' });
    res.json(tpl);
  } catch {
    res.status(500).json({ error: 'ESF registry error' });
  }
});

// GET /api/v1/os/esf/templates/domain/:domainId — templates for a domain
router.get('/templates/domain/:domainId', (req, res) => {
  try {
    const templates = ScenarioRegistry.getInstance().getByDomain(req.params.domainId);
    res.json({ templates, domainId: req.params.domainId });
  } catch {
    res.status(500).json({ error: 'ESF domain query error' });
  }
});

// POST /api/v1/os/esf/simulations/run — run a simulation scenario
router.post('/simulations/run', async (req, res) => {
  try {
    const scenario: SimulationScenario = req.body;
    if (!scenario?.scenarioId || !scenario?.variables?.length) {
      return res.status(400).json({ error: 'scenarioId and variables[] required' });
    }
    const result = await engine.run(scenario);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Simulation failed', detail: err?.message });
  }
});

// POST /api/v1/os/esf/simulations/build — build a scenario from a template
router.post('/simulations/build', (req, res) => {
  try {
    const { templateId, name, overrides } = req.body;
    if (!templateId) return res.status(400).json({ error: 'templateId required' });
    const tpl = ScenarioRegistry.getInstance().get(templateId);
    if (!tpl) return res.status(404).json({ error: 'Template not found' });

    const builder = new ScenarioBuilder();
    const scenario = builder
      .id(`scen_${Date.now()}`)
      .name(name ?? tpl.name)
      .description(tpl.description)
      .type(tpl.type)
      .horizon(overrides?.horizon ?? tpl.defaultHorizon)
      .iterations(overrides?.iterations ?? tpl.defaultIterations)
      .domains(tpl.applicableDomains);

    for (const v of (overrides?.variables ?? tpl.defaultVariables)) {
      scenario.variable(v);
    }

    res.json(scenario.build());
  } catch (err: any) {
    res.status(500).json({ error: 'Scenario build failed', detail: err?.message });
  }
});

export default router;
