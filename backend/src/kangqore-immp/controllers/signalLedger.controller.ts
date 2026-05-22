// ---------------------------------------------------------------------------
// KIMMP Signal Ledger — controller (admin)
// ---------------------------------------------------------------------------

import { Request, Response } from 'express';
import { KimmpFlags } from '../core/flags';
import { signalIngestSchema } from '../signals/signalSchema';
import { SignalLedger } from '../signals/signalLedger.service';

export class SignalLedgerController {
  /** POST /signals — ingest a signal into the ledger. */
  static async ingest(req: Request, res: Response) {
    if (!KimmpFlags.enabled()) {
      return res.status(503).json({ error: 'KIMMP is disabled (KIMMP_ENABLED=false)' });
    }
    const parsed = signalIngestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        error: 'Invalid signal payload',
        details: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
    }
    const signalId = await SignalLedger.record(parsed.data);
    if (!signalId) {
      return res.status(503).json({
        error: 'Signal not recorded — the kimmp_signals table may be missing. Run `prisma migrate deploy`.',
      });
    }
    return res.status(201).json({ signalId });
  }

  /** GET /signals — query the ledger (filter by module / category / severity / status). */
  static async query(req: Request, res: Response) {
    const str = (v: unknown) => (typeof v === 'string' && v ? v : undefined);
    const rawLimit = Number(req.query.limit);
    const signals = await SignalLedger.query({
      sourceModule: str(req.query.sourceModule),
      signalCategory: str(req.query.signalCategory),
      severity: str(req.query.severity),
      status: str(req.query.status),
      limit: Number.isFinite(rawLimit) ? rawLimit : undefined,
    });
    if (signals === null) {
      return res.status(503).json({
        error: 'Signal ledger unavailable — the kimmp_signals table may be missing.',
      });
    }
    return res.json({ signals, count: signals.length });
  }
}
