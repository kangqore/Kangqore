// ---------------------------------------------------------------------------
// Evolution Engine — Policies, governance, rules, enterprise adaptation
// Derives PolicyEvolution from lessons and principles.
// Versioned: supersession creates a new row, never mutates the old one.
// ---------------------------------------------------------------------------

import { prisma }       from '../../lib/prisma';
import { cognitionBus } from './cognitionBus';
import { getIO }        from '../../socket';

// Thresholds WAANDA must clear before self-promoting to GOVERNED review mode.
const GOVERNED_THRESHOLDS = {
  etiScore:       75,   // trust calibration score
  principles:     3,    // active enterprise principles
  playbooks:      2,    // active enterprise playbooks
  lessonsAllTime: 10,   // total lessons ever created
} as const;

export class EvolutionEngine {
  static async evolveFromLesson(lessonId: string): Promise<any | null> {
    const lesson = await (prisma as any).enterpriseLesson.findUnique({ where: { id: lessonId } });
    if (!lesson?.policyChange) return null;

    // Check if a similar policy already exists
    const existing = await (prisma as any).policyEvolution.findFirst({
      where:   { domain: lesson.domain, status: 'ACTIVE', statement: { contains: lesson.domain, mode: 'insensitive' } },
      orderBy: { version: 'desc' },
    });

    const policy = await (prisma as any).policyEvolution.create({
      data: {
        lessonId:     lesson.id,
        principleId:  null,
        domain:       lesson.domain,
        statement:    lesson.policyChange,
        rationale:    lesson.lesson,
        evidence:     `Derived from enterprise lesson in ${lesson.domain} domain.`,
        confidence:   lesson.confidence,
        evidenceCount: lesson.evidenceCount,
        version:      existing ? existing.version + 1 : 1,
        status:       'ACTIVE',
        supersedes:   existing?.id ?? null,
      },
    });

    if (existing) {
      await (prisma as any).policyEvolution.update({
        where: { id: existing.id },
        data:  { status: 'SUPERSEDED', supersededBy: policy.id },
      });
    }

    cognitionBus.publish({
      type:        'policy_created',
      artifactId:  policy.id,
      artifactType: 'PolicyEvolution',
      domain:      policy.domain,
      payload:     policy,
      emittedAt:   new Date(),
    });

    return policy;
  }

  static async evolveFromPrinciple(principleId: string): Promise<any> {
    const principle = await (prisma as any).enterprisePrinciple.findUnique({ where: { id: principleId } });
    if (!principle) throw new Error(`Principle ${principleId} not found`);

    const existing = await (prisma as any).policyEvolution.findFirst({
      where:   { principleId, status: 'ACTIVE' },
      orderBy: { version: 'desc' },
    });

    const policy = await (prisma as any).policyEvolution.create({
      data: {
        lessonId:     null,
        principleId,
        domain:       principle.domain,
        statement:    principle.statement,
        rationale:    principle.rationale,
        evidence:     `Derived from enterprise principle: ${principle.statement}`,
        confidence:   principle.confidence,
        evidenceCount: principle.evidenceCount,
        version:      existing ? existing.version + 1 : 1,
        status:       'ACTIVE',
        supersedes:   existing?.id ?? null,
      },
    });

    if (existing) {
      await (prisma as any).policyEvolution.update({
        where: { id: existing.id },
        data:  { status: 'SUPERSEDED', supersededBy: policy.id },
      });
    }

    cognitionBus.publish({
      type:        'policy_created',
      artifactId:  policy.id,
      artifactType: 'PolicyEvolution',
      domain:      policy.domain,
      payload:     policy,
      emittedAt:   new Date(),
    });

    return policy;
  }

  static async queryByDomain(domain: string, status = 'ACTIVE'): Promise<any[]> {
    return (prisma as any).policyEvolution.findMany({
      where:   { domain, status },
      orderBy: [{ version: 'desc' }, { createdAt: 'desc' }],
      take:    20,
    });
  }

  static async latestForDecisionType(decisionType: string): Promise<any[]> {
    return (prisma as any).policyEvolution.findMany({
      where:   {
        status:    'ACTIVE',
        statement: { contains: decisionType, mode: 'insensitive' },
      },
      orderBy: { createdAt: 'desc' },
      take:    5,
    });
  }

  static async changelog(window: 'week' | 'month' | 'quarter'): Promise<any[]> {
    const from = new Date();
    if (window === 'week')    from.setDate(from.getDate() - 7);
    else if (window === 'month') from.setMonth(from.getMonth() - 1);
    else                     from.setMonth(from.getMonth() - 3);

    return (prisma as any).policyEvolution.findMany({
      where:   { createdAt: { gte: from } },
      orderBy: { createdAt: 'desc' },
      take:    50,
    });
  }

  // ── WAANDA Self-Governance ─────────────────────────────────────────────────
  //
  // Called after every CognitionOrchestrator cycle. Checks readiness against
  // GOVERNED_THRESHOLDS and flips the promotion mode flag autonomously when
  // all thresholds are cleared. Emits kimmp:governance-upgrade so the CEO sees
  // a live notification. Idempotent — once GOVERNED, never reverts.

  static async assessGovernanceReadiness(): Promise<{
    mode: 'BOOTSTRAP' | 'GOVERNED';
    upgraded: boolean;
    readiness: Record<string, { value: number; threshold: number; met: boolean }>;
    reason: string | null;
  }> {
    // Check current flag
    const existing = await prisma.kimmpFlag.findFirst({
      where: { key: 'COGNITION_PROMOTION_MODE' },
    });
    if (existing?.value === 'GOVERNED') {
      return { mode: 'GOVERNED', upgraded: false, readiness: {}, reason: null };
    }

    // Measure current state in parallel
    const [etiRows, principles, playbooks, lessons] = await Promise.all([
      (prisma as any).eTISnapshot.findFirst({ orderBy: { createdAt: 'desc' } }),
      (prisma as any).enterprisePrinciple.count({ where: { promotionStatus: 'ACTIVE' } }),
      (prisma as any).enterprisePlaybook.count({ where: { status: 'ACTIVE' } }),
      (prisma as any).enterpriseLesson.count({}),
    ]);

    const etiScore = (etiRows as any)?.overall ?? 0;

    const readiness = {
      etiScore:       { value: etiScore,   threshold: GOVERNED_THRESHOLDS.etiScore,       met: etiScore   >= GOVERNED_THRESHOLDS.etiScore       },
      principles:     { value: principles,  threshold: GOVERNED_THRESHOLDS.principles,     met: principles >= GOVERNED_THRESHOLDS.principles     },
      playbooks:      { value: playbooks,   threshold: GOVERNED_THRESHOLDS.playbooks,      met: playbooks  >= GOVERNED_THRESHOLDS.playbooks      },
      lessonsAllTime: { value: lessons,     threshold: GOVERNED_THRESHOLDS.lessonsAllTime, met: lessons    >= GOVERNED_THRESHOLDS.lessonsAllTime },
    };

    const allMet = Object.values(readiness).every(r => r.met);
    if (!allMet) {
      return { mode: 'BOOTSTRAP', upgraded: false, readiness, reason: null };
    }

    // All thresholds cleared — WAANDA promotes itself to GOVERNED
    const reason =
      `ETI ${etiScore}/100 · ${principles} active principles · ${playbooks} playbooks · ${lessons} lessons. ` +
      `Knowledge base is mature enough for CEO review before further auto-promotion.`;

    await prisma.kimmpFlag.upsert({
      where:  { key: 'COGNITION_PROMOTION_MODE' },
      update: { value: 'GOVERNED', setBy: 'WAANDA', reason, updatedAt: new Date() },
      create: { key: 'COGNITION_PROMOTION_MODE', value: 'GOVERNED', setBy: 'WAANDA', reason },
    });

    // Notify CEO via WebSocket
    try {
      getIO().emit('kimmp:governance-upgrade', {
        mode:     'GOVERNED',
        reason,
        readiness,
        upgradedAt: new Date().toISOString(),
      });
    } catch { /* socket not ready */ }

    // WAANDA broadcasts GOVERNED mode to all subsystems — federated governance alignment
    try {
      const { WaandaAuthority } = await import('../../waanda/WaandaAuthority');
      await WaandaAuthority.broadcastDirective('ALIGN', {
        mode:             'GOVERNED',
        governancePolicy: { requireApproval: true },
        reason,
      }, 'WAANDA self-promoted to GOVERNED — all subsystems align').catch(() => {});
    } catch { /* non-fatal */ }

    console.log('[EvolutionEngine] GOVERNED mode activated:', reason);
    return { mode: 'GOVERNED', upgraded: true, readiness, reason };
  }

  // CEO override — force a specific mode, bypassing thresholds
  static async setGovernanceMode(
    mode: 'BOOTSTRAP' | 'GOVERNED',
    setBy: 'CEO' | 'SYSTEM',
    reason?: string
  ): Promise<void> {
    await prisma.kimmpFlag.upsert({
      where:  { key: 'COGNITION_PROMOTION_MODE' },
      update: { value: mode, setBy, reason: reason ?? null, updatedAt: new Date() },
      create: { key: 'COGNITION_PROMOTION_MODE', value: mode, setBy, reason: reason ?? null },
    });
    try {
      getIO().emit('kimmp:governance-upgrade', { mode, setBy, reason: reason ?? null, upgradedAt: new Date().toISOString() });
    } catch { /* socket not ready */ }
  }

  static async getGovernanceMode(): Promise<{ mode: 'BOOTSTRAP' | 'GOVERNED'; setBy: string; reason: string | null; since: string | null }> {
    const flag = await prisma.kimmpFlag.findFirst({ where: { key: 'COGNITION_PROMOTION_MODE' } });
    return {
      mode:   (flag?.value === 'GOVERNED' ? 'GOVERNED' : 'BOOTSTRAP') as 'BOOTSTRAP' | 'GOVERNED',
      setBy:  flag?.setBy ?? 'SYSTEM',
      reason: flag?.reason ?? null,
      since:  flag?.updatedAt?.toISOString() ?? null,
    };
  }

  static async supersede(oldPolicyId: string, newStatement: string, rationale: string): Promise<any> {
    const old = await (prisma as any).policyEvolution.findUnique({ where: { id: oldPolicyId } });
    if (!old) throw new Error(`Policy ${oldPolicyId} not found`);

    const next = await (prisma as any).policyEvolution.create({
      data: {
        domain:       old.domain,
        statement:    newStatement,
        rationale,
        evidence:     `Manually superseded version ${old.version}.`,
        confidence:   old.confidence,
        evidenceCount: old.evidenceCount,
        version:      old.version + 1,
        status:       'ACTIVE',
        supersedes:   old.id,
      },
    });

    await (prisma as any).policyEvolution.update({
      where: { id: old.id },
      data:  { status: 'SUPERSEDED', supersededBy: next.id },
    });

    return next;
  }

  // Phase 6.9f — Playbook hygiene
  static async playbookRetirementCandidates(): Promise<any[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    return (prisma as any).enterprisePlaybook.findMany({
      where: {
        status: 'ACTIVE',
        createdAt: { lt: cutoff },
        lastValidated: null,
      },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });
  }

  static async retirePlaybook(id: string, reason: string): Promise<any> {
    return (prisma as any).enterprisePlaybook.update({
      where: { id },
      data:  { status: 'DEPRECATED', reviewNote: reason, reviewedAt: new Date() },
    });
  }

  static async playbookMergeCandidates(): Promise<{ a: any; b: any; sharedDomain: string }[]> {
    const playbooks = await (prisma as any).enterprisePlaybook.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { domain: 'asc' },
    });

    // Group by domain — if same domain has 2+ active playbooks, suggest merge
    const byDomain = new Map<string, any[]>();
    for (const pb of playbooks) {
      const arr = byDomain.get(pb.domain) ?? [];
      arr.push(pb);
      byDomain.set(pb.domain, arr);
    }

    const candidates: { a: any; b: any; sharedDomain: string }[] = [];
    for (const [domain, pbs] of byDomain.entries()) {
      if (pbs.length >= 2) {
        candidates.push({ a: pbs[0], b: pbs[1], sharedDomain: domain });
      }
    }
    return candidates;
  }
}
