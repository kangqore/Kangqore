import { Router } from 'express';
import { DomainRegistry } from './core/DomainRegistry';

const router = Router();

// GET /api/os/edf/domains — Enterprise Domain Fabric snapshot
// Returns all registered domains with their metadata, capability counts, KPIs and readiness.
// WaandaCognitiveMirror polls this to satisfy WEE Law 3 (workspace consumes Enterprise Platform).
router.get('/domains', (_req, res) => {
  try {
    const domains = DomainRegistry.getAll();
    res.json({
      domains: domains.map(d => ({
        id:           d.metadata.id,
        name:         d.metadata.name,
        version:      d.metadata.version,
        purpose:      d.metadata.purpose,
        ready:        DomainRegistry.isDomainReady(d.metadata.id),
        capabilities: d.capabilities.length,
        goals:        d.goals.length,
        objects:      d.objects.length,
        kpis:         d.kpis.map(k => ({
          id:      k.kpiId,
          name:    k.name,
          target:  k.targetValue,
          current: k.currentValue,
        })),
      })),
      registeredAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'EDF registry unavailable' });
  }
});

export default router;
