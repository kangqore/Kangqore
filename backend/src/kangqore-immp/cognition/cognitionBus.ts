// ---------------------------------------------------------------------------
// Enterprise Cognition Bus
// Constitutional Invariant 6: engines communicate through immutable events.
// No engine calls another engine directly. Every transition is recorded.
// ---------------------------------------------------------------------------

import { EventEmitter } from 'events';
import { prisma } from '../../lib/prisma';
import { getIO }   from '../../socket';

export type CognitionEventType =
  | 'evidence_created'
  | 'observation_created'
  | 'lesson_created'
  | 'insight_created'
  | 'pattern_created'
  | 'principle_candidate'
  | 'principle_created'
  | 'playbook_candidate'
  | 'playbook_created'
  | 'policy_created';

export interface CognitionEvent {
  type:        CognitionEventType;
  artifactId:  string;
  artifactType: string;
  domain:      string;
  payload:     unknown;
  emittedAt:   Date;
}

class CognitionEventBus extends EventEmitter {
  publish(data: CognitionEvent): void {
    // Persist to DB asynchronously for replay capability
    void (prisma as any).cognitionEvent.create({
      data: {
        type:         data.type,
        artifactId:   data.artifactId,
        artifactType: data.artifactType,
        domain:       data.domain,
        payload:      data.payload as any,
        emittedAt:    data.emittedAt,
      },
    }).catch(() => null);  // Bus persistence failure must never block the pipeline

    super.emit(data.type, data);

    // Forward GOVERNED candidate events to the frontend via WebSocket
    if (data.type === 'principle_candidate' || data.type === 'playbook_candidate') {
      try {
        getIO().emit('kimmp:candidate-ready', {
          kind:      data.type === 'principle_candidate' ? 'PRINCIPLE' : 'PLAYBOOK',
          id:        data.artifactId,
          domain:    data.domain,
          emittedAt: data.emittedAt,
        });
      } catch { /* socket not ready — non-fatal */ }
    }
  }
}

export const cognitionBus = new CognitionEventBus();
cognitionBus.setMaxListeners(20);
