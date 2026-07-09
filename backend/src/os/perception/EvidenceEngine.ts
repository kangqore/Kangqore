import { prisma } from '../../lib/prisma';
import { KeosEventBus } from '../kernel/KeosEventBus';

export class EvidenceEngine {
  /**
   * Subscribes the Evidence Engine to the universal Event Bus.
   * Enforces the Input Contract: It only listens to Perception's output.
   */
  static initialize() {
    console.log('[Evidence Engine] Initializing Deterministic Engine...');
    
    KeosEventBus.subscribe('EVIDENCE_OBSERVED', async (evidence: any) => {
      await this.processObservation(evidence.id);
    });
  }

  /**
   * The core deterministic pipeline for upgrading Observations to Trusted Knowledge.
   */
  static async processObservation(evidenceId: string) {
    console.log(`[Evidence Engine] Processing Observation: ${evidenceId}`);
    
    const observation = await prisma.koreEvidence.findUnique({ where: { id: evidenceId } });
    if (!observation) return;

    // --- STAGE 1: Deduplication ---
    // Look for recent evidence (last 60 seconds) with the exact same actor, object, and eventType
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const duplicates = await prisma.koreEvidence.findMany({
      where: {
        id: { not: evidenceId }, // Exclude self
        actorId: observation.actorId,
        eventType: observation.eventType,
        objectId: observation.objectId,
        createdAt: { gte: oneMinuteAgo },
        verificationState: { not: 'CONFLICTING' }
      }
    });

    if (duplicates.length > 0) {
      console.log(`[Evidence Engine] ⚠️ Duplicate detected. Merging into existing Evidence ID: ${duplicates[0].id}`);
      
      // Merge into the oldest duplicate and destroy this new observation
      const target = duplicates[0];
      const mergedProvenance = JSON.stringify([target.provenance, observation.provenance]);
      
      await prisma.koreEvidence.update({
        where: { id: target.id },
        data: {
          confidenceScore: { increment: 0.1 }, // Arbitrary deterministic boost
          supportingEvidence: mergedProvenance
        }
      });

      await prisma.koreEvidence.delete({ where: { id: evidenceId } });
      return;
    }

    // --- STAGE 2: Conflict Resolution ---
    // For this implementation, we simulate a conflict if the observation contains a "CONFLICT_FLAG"
    // In a real system, this would evaluate opposing facts (e.g., Status=Active vs Status=Inactive)
    const payloadStr = JSON.stringify(observation.observation);
    if (payloadStr.includes('CONFLICT_FLAG')) {
      console.log(`[Evidence Engine] ❌ Conflict detected for Observation: ${evidenceId}`);
      await prisma.koreEvidence.update({
        where: { id: evidenceId },
        data: { verificationState: 'CONFLICTING', confidenceLevel: 'CONFLICTING' }
      });
      return;
    }

    // --- STAGE 3: Confidence Aggregation & Upgrade ---
    // Deterministic rules based on Source and Actor
    let newLevel = 'LOW';
    let newScore = observation.confidenceScore;
    let state = 'HYPOTHESIS';

    if (observation.sourceType === 'SYSTEM' || observation.actorType === 'AGENT') {
      newLevel = 'HIGH';
      newScore = 0.9;
      state = 'VERIFIED'; // High confidence allows instant upgrade to Trusted Knowledge
    } else if (observation.sourceType === 'HUMAN') {
      newLevel = 'MEDIUM';
      newScore = 0.7;
      state = 'VERIFIED';
    }

    console.log(`[Evidence Engine] Upgrading Observation to ${state} (${newLevel})`);
    
    const trustedKnowledge = await prisma.koreEvidence.update({
      where: { id: evidenceId },
      data: {
        verificationState: state,
        confidenceLevel: newLevel,
        confidenceScore: newScore
      }
    });

    // --- STAGE 4: Publication ---
    // If it reached VERIFIED, it is now Trusted Knowledge and can be broadcast to Memory/URGI
    if (state === 'VERIFIED') {
      console.log(`[Evidence Engine] Publishing KNOWLEDGE_VERIFIED for ${trustedKnowledge.id}`);
      await KeosEventBus.publish('KNOWLEDGE_VERIFIED', trustedKnowledge);
    }
  }
}
