import { prisma } from '../../../lib/prisma';
import { MissionRequest } from '../../kernel/KeosKernel';
import { getCorrelationId } from './HanumanasContext';

export interface HanumanasEvaluationResult {
  action: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';
  riskScore: number;
  policiesEvaluated: any[];
  reason: string;
}

export class HanumanasShield {
  /**
   * Evaluates the mission against all active policies.
   */
  static async evaluatePolicy(mission: MissionRequest, capabilityId?: string): Promise<HanumanasEvaluationResult> {
    const policies = await prisma.aegisPolicy.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' }
    });

    let finalAction: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL' = 'ALLOW';
    let finalReason = 'All policies passed.';
    const policiesEvaluated = [];

    // Simple policy engine for Phase 3.1
    for (const policy of policies) {
      const conditions = policy.conditions as any;
      let matched = false;

      // E.g., Condition matches mission keyword
      if (conditions.keyword && mission.goal.toLowerCase().includes(conditions.keyword)) {
        matched = true;
      }
      
      // E.g., Condition matches capability
      if (conditions.capabilityId && capabilityId === conditions.capabilityId) {
        matched = true;
      }

      if (matched) {
        policiesEvaluated.push(policy);
        
        if (policy.effect === 'DENY') {
          return { action: 'DENY', riskScore: 100, policiesEvaluated, reason: `Blocked by policy: ${policy.name}` };
        } else if (policy.effect === 'REQUIRE_APPROVAL') {
          finalAction = 'REQUIRE_APPROVAL';
          finalReason = `Approval required by policy: ${policy.name}`;
        }
      }
    }

    // Combine with Risk Evaluation
    const riskScore = await this.evaluateRisk(mission);
    if (riskScore > 80 && finalAction === 'ALLOW') {
      finalAction = 'REQUIRE_APPROVAL';
      finalReason = 'High risk score triggers mandatory human approval.';
    }

    return {
      action: finalAction,
      riskScore,
      policiesEvaluated,
      reason: finalReason
    };
  }

  /**
   * Evaluates the inherent risk of the mission based on context.
   */
  static async evaluateRisk(mission: MissionRequest): Promise<number> {
    // Mock risk engine
    let risk = 10;
    if (mission.goal.toLowerCase().includes('delete') || mission.goal.toLowerCase().includes('remove')) {
      risk += 75;
    }
    if (mission.goal.toLowerCase().includes('budget') || mission.goal.toLowerCase().includes('financial')) {
      risk += 50;
    }
    return Math.min(risk, 100);
  }

  /**
   * Immutable ledger log for audit purposes.
   */
  static async writeToLedger(
    missionId: string,
    actor: string,
    action: string,
    status: string,
    details?: {
      capabilityId?: string;
      policyEvaluated?: any;
      riskScore?: number;
      executionDetails?: any;
    }
  ) {
    // Merge the HTTP-layer correlationId into executionDetails so all three surfaces
    // (HTTP middleware, MissionDispatcher, KoreRuntimeManager) are linked in the ledger.
    const correlationId = getCorrelationId();
    const executionDetails = correlationId
      ? { ...(details?.executionDetails ?? {}), correlationId }
      : details?.executionDetails;

    return (prisma as any).aegisLedgerEntry.create({
      data: {
        missionId,
        actor,
        action,
        status,
        capabilityId: details?.capabilityId,
        policyEvaluated: details?.policyEvaluated,
        riskScore: details?.riskScore,
        executionDetails,
      }
    });
  }
}
