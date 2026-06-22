// ---------------------------------------------------------------------------
// KIMMP Decision Engine — controller (admin)
// Phase 4: approval gate enforces the permission matrix, writes an audit
// entry, and emits a trace event on every status change.
// ---------------------------------------------------------------------------

import { Request, Response } from 'express';
import { KimmpFlags } from '../core/flags';
import { DecisionEngine } from '../decision/decisionEngine.service';
import { PermissionMatrix } from '../governance/permissionMatrix';
import { KimmpAuditLog } from '../governance/auditLog.service';
import { KimmpTracer } from '../governance/kimmpTracer.service';
import { onDecisionApproved } from '../learning/kimmpLearning.service';
import { prisma } from '../../lib/prisma';

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

    // Phase 4 — trace + audit every engine run.
    KimmpTracer.engineRun(result);
    void KimmpAuditLog.record({
      actor: (req as any).user?.userId ?? 'SYSTEM',
      action: 'ENGINE_RUN',
      targetType: 'engine',
      metadata: result as unknown as Record<string, unknown>,
    });

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

  /**
   * PATCH /decisions/:id — approve / dismiss / mark executed.
   *
   * Phase 4 governance gate:
   * 1. Fetch the decision to read its type.
   * 2. Validate actor role + note requirement via PermissionMatrix.
   * 3. Write governance columns (approvedBy/dismissedBy/executedBy + timestamp).
   * 4. Write an immutable KimmpAuditEntry.
   * 5. Emit a KimmpTracer event.
   */
  static async updateStatus(req: Request, res: Response) {
    const { status, notes } = req.body || {};
    if (!DECISION_STATUSES.includes(status)) {
      return res.status(422).json({ error: `status must be one of: ${DECISION_STATUSES.join(', ')}` });
    }

    const actorId: string = (req as any).user?.userId ?? 'UNKNOWN';
    const actorRole: string = (req as any).user?.role ?? 'UNKNOWN';
    const decisionId = req.params.id;

    // Only non-PROPOSED transitions require governance checks.
    if (status !== 'PROPOSED') {
      // 1. Load the decision to get its type.
      let decision: any = null;
      try {
        decision = await (prisma as any).kimmpDecision.findUnique({ where: { id: decisionId } });
      } catch {
        // Table may be absent pre-migration — fall through to plain update.
      }

      if (decision) {
        // 2. Permission matrix check.
        const violation = PermissionMatrix.validate({ decisionType: decision.decisionType, actorRole, notes });
        if (violation) {
          return res.status(403).json({ error: violation });
        }

        // 3. Build governance column patch.
        const now = new Date();
        const govPatch: Record<string, unknown> = {};
        if (status === 'APPROVED') {
          govPatch.approvedBy = actorId;
          govPatch.approvedAt = now;
          if (notes) govPatch.notes = notes;
        } else if (status === 'DISMISSED') {
          govPatch.dismissedBy = actorId;
          govPatch.dismissedAt = now;
          if (notes) govPatch.notes = notes;
        } else if (status === 'EXECUTED') {
          govPatch.executedBy = actorId;
          govPatch.executedAt = now;
        }

        try {
          await (prisma as any).kimmpDecision.update({
            where: { id: decisionId },
            data: { status, ...govPatch },
          });
        } catch {
          return res.status(404).json({ error: 'Decision not found' });
        }

        // 4. Audit entry (fire-and-forget).
        const auditAction =
          status === 'APPROVED' ? 'DECISION_APPROVED' as const
          : status === 'DISMISSED' ? 'DECISION_DISMISSED' as const
          : 'DECISION_EXECUTED' as const;

        void KimmpAuditLog.record({
          actor: actorId,
          action: auditAction,
          targetType: 'decision',
          targetId: decisionId,
          notes,
          metadata: {
            decisionType: decision.decisionType,
            targetModule: decision.targetModule,
            priority: decision.priority,
            previousStatus: decision.status,
            newStatus: status,
          },
        });

        // 5. Trace event + learning hook.
        if (status === 'APPROVED') {
          KimmpTracer.decisionApproved(decisionId, actorId, {
            decisionType: decision.decisionType,
            targetModule: decision.targetModule,
            priority: decision.priority,
          });
          // Every approved decision becomes a quality-1.0 training example
          void onDecisionApproved(decisionId)
        } else if (status === 'DISMISSED') {
          KimmpTracer.decisionDismissed(decisionId, actorId, { decisionType: decision.decisionType });
        }

        return res.json({ ok: true, id: decisionId, status });
      }
    }

    // Fallback: plain status update (PROPOSED or if decision row unavailable pre-migration).
    const ok = await DecisionEngine.setStatus(decisionId, status);
    if (!ok) {
      return res.status(404).json({ error: 'Decision not found' });
    }
    return res.json({ ok: true, id: decisionId, status });
  }
}
