import { prisma } from '../../lib/prisma';
import { KeosEventBus } from '../kernel/KeosEventBus';

export interface EvidenceBundle {
  actorId: string;
  timeWindow: string;
  evidence: any[]; // KoreEvidence[]
  aggregateConfidence: number;
}

export class UrgiEngine {
  /**
   * Initializes URGI by subscribing to Trusted Knowledge.
   * URGI MUST NOT consume raw signals or unverified observations.
   */
  static initialize() {
    console.log('[URGI] Initializing Relationship Intelligence Engine...');
    
    KeosEventBus.subscribe('KNOWLEDGE_VERIFIED', async (trustedKnowledge: any) => {
      await this.processTrustedKnowledge(trustedKnowledge);
    });
  }

  /**
   * Processes a piece of Trusted Knowledge, assembles an Evidence Bundle,
   * and evolves the Relationship Twin.
   */
  static async processTrustedKnowledge(trustedKnowledge: any) {
    console.log(`[URGI] Received Trusted Knowledge for Actor: ${trustedKnowledge.actorId}`);

    // --- STAGE 1: Evidence Bundling ---
    // Fetch all VERIFIED knowledge for this actor in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const bundleEvidence = await prisma.koreEvidence.findMany({
      where: {
        actorId: trustedKnowledge.actorId,
        verificationState: 'VERIFIED',
        createdAt: { gte: oneDayAgo }
      }
    });

    const aggregateConfidence = bundleEvidence.reduce((acc, ev) => acc + (ev.confidenceScore || 0), 0) / (bundleEvidence.length || 1);
    
    const bundle: EvidenceBundle = {
      actorId: trustedKnowledge.actorId,
      timeWindow: 'Last 24 Hours',
      evidence: bundleEvidence,
      aggregateConfidence
    };

    console.log(`[URGI] Assembled Evidence Bundle of size ${bundle.evidence.length} with aggregate confidence ${aggregateConfidence.toFixed(2)}`);

    // --- STAGE 2: Twin Resolution ---
    let profile = await prisma.unifiedRelationshipProfile.findUnique({
      where: { visitorId: trustedKnowledge.actorId }
    });

    if (!profile) {
      console.log(`[URGI] No Twin found. Creating new Relationship Twin for ${trustedKnowledge.actorId}...`);
      profile = await prisma.unifiedRelationshipProfile.create({
        data: {
          visitorId: trustedKnowledge.actorId,
          relationshipScore: 0.1,
          trustScore: 0.1,
          engagementScore: 0.1
        }
      });
    }

    // --- STAGE 3: Relationship Evolution ---
    // Record the specific fact into the Evidence Ledger
    const factValue = typeof trustedKnowledge.observation === 'object' ? JSON.stringify(trustedKnowledge.observation) : String(trustedKnowledge.observation);
    
    await prisma.evidenceLedger.create({
      data: {
        profileId: profile.id,
        factKey: trustedKnowledge.eventType,
        factValue: factValue,
        source: trustedKnowledge.source,
        confidenceScore: trustedKnowledge.confidenceScore,
        evidenceType: 'VERIFIED'
      }
    });

    // Evolve the relationship scores based on the bundle
    const newTrustScore = Math.min(1.0, profile.trustScore + (bundle.evidence.length * 0.05));
    const newRelationshipScore = Math.min(1.0, profile.relationshipScore + (aggregateConfidence * 0.1));

    const evolvedProfile = await prisma.unifiedRelationshipProfile.update({
      where: { id: profile.id },
      data: {
        trustScore: newTrustScore,
        relationshipScore: newRelationshipScore,
        engagementScore: Math.min(1.0, profile.engagementScore + 0.1)
      }
    });

    console.log(`[URGI] Relationship Twin Evolved. Trust: ${evolvedProfile.trustScore.toFixed(2)}, RelScore: ${evolvedProfile.relationshipScore.toFixed(2)}`);

    // --- STAGE 4: Context Publication ---
    console.log(`[URGI] Publishing RELATIONSHIP_CONTEXT_UPDATED for Twin ${evolvedProfile.id}`);
    await KeosEventBus.publish('RELATIONSHIP_CONTEXT_UPDATED', {
      profile: evolvedProfile,
      triggeringEvidence: trustedKnowledge.id
    });
  }
}
