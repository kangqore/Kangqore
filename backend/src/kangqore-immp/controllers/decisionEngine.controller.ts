// ---------------------------------------------------------------------------
// KIMMP Decision Engine — controller (admin)
// ---------------------------------------------------------------------------

import { Request, Response } from 'express';
import { KimmpFlags } from '../core/flags';
import { DecisionEngine } from '../decision/decisionEngine.service';

const DECISION_STATUSES = ['PROPOSED', 'APPROVED', 'EXECUTED', 'DISMISSED'];

export class DecisionEngineController {
  /** POST /decisions/evaluate — run the engine over NEW signals. */
  static async evaluate(req: Request, res: Response) {
    if (!KimmpFlags.enabled()) {
      return res.status(503).json({ error: 'KIMMP is disabled (KIMMP_ENABLED=false)' });
    }
    const raw = Number(req.query.limit);
    const limit = Number.isFinite(raw) ? raw : undefined;
    const result = await DecisionEngine.evaluate(limit);
    return res.json({ result });
  }

  /** GET /decisions?status= — list proposed/decided actions. */
  static async list(req: Request, res: Response) {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const decisions = await DecisionEngine.list(status);
    if (decisions === null) {
      return res.status(503).json({
        error: 'Decision store unavailable — the kimmp_decisions table may be missing.',
      });
    }
    return res.json({ decisions, count: decisions.length });
  }

  /** PATCH /decisions/:id — approve / dismiss / mark executed. */
  static async updateStatus(req: Request, res: Response) {
    const status = (req.body || {}).status;
    if (!DECISION_STATUSES.includes(status)) {
      return res.status(422).json({ error: `status must be one of: ${DECISION_STATUSES.join(', ')}` });
    }
    const ok = await DecisionEngine.setStatus(req.params.id, status);
    if (!ok) {
      return res.status(404).json({ error: 'Decision not found' });
    }
    return res.json({ ok: true, id: req.params.id, status });
  }
}
