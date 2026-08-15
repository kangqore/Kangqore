import { prisma } from '../../lib/prisma';
import { KeosEventBus } from '../kernel/KeosEventBus';
import crypto from 'crypto';

export interface RawSignal {
  source: string;
  sourceType?: string;
  eventType: string;
  actorId?: string;
  actorType?: string;
  objectId?: string;
  objectType?: string;
  payload: any;
}

export class KorePerceptionEngine {
  /**
   * Initializes Perception by subscribing to the universal Event Bus.
   */
  static initialize() {
    console.log('[KORE Perception] Initializing Sensory Cortex...');
    
    KeosEventBus.subscribe('MISSION_COMPLETED', async (payload: any) => {
      await this.ingestSignal({
        source: 'KEOS_KERNEL',
        sourceType: 'SYSTEM',
        eventType: 'MISSION_COMPLETED',
        actorId: payload.actor,
        actorType: 'AGENT',
        objectId: payload.missionId,
        objectType: 'Mission',
        payload: payload.result
      });
    });

    // We can add more subscriptions here (e.g. WEBSITE_CLICK, KVIS_OPPORTUNITY)
  }

  /**
   * The universal ingestion point.
   * Normalizes a raw signal into an Observation and persists it.
   */
  static async ingestSignal(signal: RawSignal) {
    console.log(`[KORE Perception] Ingesting Signal: ${signal.eventType} from ${signal.source}`);
    
    // 1. Normalization & Observation Creation
    // In a real system, this would extract specific fields based on signal type.
    const observation = signal.payload;
    
    // 2. Provenance Tracking
    const provenanceStr = JSON.stringify({ source: signal.source, timestamp: Date.now(), event: signal.eventType });
    const provenanceHash = crypto.createHash('sha256').update(provenanceStr).digest('hex');

    // 3. Persist to Database (Evidence Creation)
    // At this stage, verificationState is always 'OBSERVATION'.
    // The Evidence Engine (Phase 3.3) will pick this up for deduplication and confidence scoring.
    const evidence = await prisma.koreEvidence.create({
      data: {
        source: signal.source,
        sourceType: signal.sourceType || 'UNKNOWN',
        eventType: signal.eventType,
        actorId: signal.actorId,
        actorType: signal.actorType,
        objectId: signal.objectId,
        objectType: signal.objectType,
        observation: observation,
        confidenceLevel: 'UNKNOWN', // Canonical default for raw observations
        confidenceScore: 1.0,
        provenance: provenanceStr,
        provenanceHash: provenanceHash,
        verificationState: 'OBSERVATION'
      }
    });

    console.log(`[KORE Perception] Generated Evidence Observation ID: ${evidence.id}`);
    
    // 4. Forward to Evidence Engine
    // This completes the decoupling. Perception only creates the observation.
    // The Evidence Engine will subscribe to this event.
    await KeosEventBus.publish('EVIDENCE_OBSERVED', evidence);

    return evidence;
  }
}
