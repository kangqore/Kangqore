import { EventEmitter } from 'events';
import { UrgiEvent, RelationshipStrategyObject, InteractionExecutionPlan, ConfirmedIdentityProfile } from '../models/urgi.types';

class UrgiEventBus extends EventEmitter {
  constructor() {
    super();
    // Increase max listeners if needed
    this.setMaxListeners(20);
  }

  // Strictly typed emit methods
  emitVisitorInteraction(visitorId: string, contextData: any) {
    this.emit(UrgiEvent.VISITOR_INTERACTION_RECEIVED, { visitorId, contextData });
  }

  emitRelationshipStrategyReady(rso: RelationshipStrategyObject) {
    this.emit(UrgiEvent.RELATIONSHIP_STRATEGY_READY, rso);
  }

  emitInteractionPlanReady(iep: InteractionExecutionPlan) {
    this.emit(UrgiEvent.INTERACTION_PLAN_READY, iep);
  }

  emitIdentityVerified(cip: ConfirmedIdentityProfile) {
    this.emit(UrgiEvent.IDENTITY_VERIFIED, cip);
  }

  emitGovernanceCheckPassed(cip: ConfirmedIdentityProfile) {
    this.emit(UrgiEvent.GOVERNANCE_CHECK_PASSED, cip);
  }

  emitRelationshipMemoryUpdated(profileId: string) {
    this.emit(UrgiEvent.RELATIONSHIP_MEMORY_UPDATED, { profileId });
  }
}

export const urgiEventBus = new UrgiEventBus();
