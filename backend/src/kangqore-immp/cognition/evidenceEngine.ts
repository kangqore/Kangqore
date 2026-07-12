// ---------------------------------------------------------------------------
// Evidence Engine — Level 0 of the Enterprise Cognition Layer
// Captures immutable facts. No LLM. No interpretation. Ever.
// Constitutional Invariant 6: this engine is the only writer of EnterpriseEvidence.
// ---------------------------------------------------------------------------

import { prisma }        from '../../lib/prisma';
import { cognitionBus }  from './cognitionBus';

export interface EvidenceInput {
  source:      'decision' | 'mission' | 'simulation' | 'feedback' | 'signal';
  sourceId?:   string;
  decisionId?: string;
  missionId?:  string;
  objectiveId?: string;
  domain:      string;
  tier:        string;
  rawData:     unknown;
}

export class EvidenceEngine {
  static async capture(input: EvidenceInput): Promise<any> {
    const evidence = await (prisma as any).enterpriseEvidence.create({
      data: {
        source:      input.source,
        sourceId:    input.sourceId ?? null,
        decisionId:  input.decisionId ?? null,
        missionId:   input.missionId ?? null,
        objectiveId: input.objectiveId ?? null,
        domain:      input.domain,
        tier:        input.tier,
        rawData:     input.rawData as any,
      },
    });

    cognitionBus.publish({
      type:        'evidence_created',
      artifactId:  evidence.id,
      artifactType: 'EnterpriseEvidence',
      domain:      evidence.domain,
      payload:     evidence,
      emittedAt:   new Date(),
    });

    return evidence;
  }

  static async getById(id: string): Promise<any> {
    return (prisma as any).enterpriseEvidence.findUnique({ where: { id } });
  }

  static async listByDomain(domain: string, limit = 20): Promise<any[]> {
    return (prisma as any).enterpriseEvidence.findMany({
      where:   { domain },
      orderBy: { createdAt: 'desc' },
      take:    limit,
    });
  }
}
