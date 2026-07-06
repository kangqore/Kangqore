import { urgiEventBus } from '../events/eventBus';
import { 
  RelationshipStrategyObject, 
  InteractionExecutionPlan 
} from '../models/urgi.types';

/**
 * WAANDA - Interaction Execution Plan (IEP) Builder
 * Consumes the Relationship Strategy Object (RSO) and determines HOW the AI should act.
 */
export class WaandaIepBuilder {
  
  constructor() {
    // Subscribe to RSO events
    urgiEventBus.on(
      'URGI:RELATIONSHIP_STRATEGY_READY', 
      this.handleRelationshipStrategy.bind(this)
    );
  }

  private handleRelationshipStrategy(rso: RelationshipStrategyObject) {
    const iep = this.buildExecutionPlan(rso);
    // Emit the IEP for eQORE to consume
    urgiEventBus.emitInteractionPlanReady(iep);
  }

  private buildExecutionPlan(rso: RelationshipStrategyObject): InteractionExecutionPlan {
    
    // Determine Adaptive Personality
    // Example: If a founder -> Visionary. If Architect -> Technical.
    const hasTechnicalIntent = rso.intent.some(i => i.toLowerCase().includes('architect') || i.toLowerCase().includes('technical'));
    const isFrustrated = rso.emotion === 'FRUSTRATED';

    const adaptivePersonality = {
      tone: isFrustrated ? 'EMPATHETIC' : (hasTechnicalIntent ? 'TECHNICAL' : 'VISIONARY'),
      formality: 'PROFESSIONAL',
      verbosity: isFrustrated ? 'SHORT' : 'LONG'
    } as const;

    // Determine verification targets (Invisible Verification)
    const verificationTargets = rso.activeHypotheses
      .filter(h => h.confidenceScore < 1.0)
      .map(h => h.factKey);

    return {
      visitorId: rso.visitorId,
      runtimeMode: 'SHADOW', // Defaulting to Shadow mode for safety rollout
      primaryGoal: 'Deepen Relationship via Natural Discovery',
      participatingSystems: ['KVIS', 'ALIS'], // Example selection
      adaptivePersonality,
      verificationTargets,
      memoryRules: [
        'NEVER_STORE_HYPOTHESIS',
        'ONLY_STORE_USER_VERIFIED'
      ]
    };
  }
}

// Initialize the singleton to wire up the listeners
export const waandaIepBuilder = new WaandaIepBuilder();
