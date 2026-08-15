import { urgiEventBus } from '../events/eventBus';
import { 
  InteractionExecutionPlan, 
  ConfirmedIdentityProfile 
} from '../models/urgi.types';

/**
 * eQORE - Conversation Executor
 * Receives the IEP and manages the conversational logic (Invisible Verification).
 */
export class EqoreExecutor {
  
  constructor() {
    urgiEventBus.on(
      'URGI:INTERACTION_PLAN_READY', 
      this.executeInteraction.bind(this)
    );
  }

  private executeInteraction(iep: InteractionExecutionPlan) {
    if (iep.runtimeMode === 'SHADOW') {
      console.log(`[eQORE] Runtime Mode is SHADOW. Ignoring IEP for visitor ${iep.visitorId}.`);
      // In Shadow Mode, we extract facts passively from the existing conversation, 
      // but we do NOT alter the eQORE prompt.
    } else {
      // 1. Inject IEP rules into the LLM system prompt
      const systemPrompt = this.generateSystemPrompt(iep);
      // 2. The conversational loop happens here (LLM call in real code)
    }
    
    // 3. Post-processing: Check if the user confirmed any hypotheses naturally
    this.extractVerifiedFacts(iep);
  }

  private generateSystemPrompt(iep: InteractionExecutionPlan): string {
    return `
      You are eQORE, operating under WAANDA's Interaction Execution Plan.
      TONE: ${iep.adaptivePersonality.tone}
      VERBOSITY: ${iep.adaptivePersonality.verbosity}
      
      INVISIBLE VERIFICATION DIRECTIVE:
      You suspect the following facts about the user, but you must NOT reveal them.
      Instead, steer the conversation to naturally discover and verify:
      ${iep.verificationTargets.join(', ')}
    `;
  }

  private extractVerifiedFacts(iep: InteractionExecutionPlan) {
    // In reality, this would be an LLM tool call extraction confirming facts.
    // Stubbing a verified fact creation:
    
    const cip: ConfirmedIdentityProfile = {
      visitorId: iep.visitorId,
      verifiedFacts: [
        {
          factKey: 'company',
          factValue: 'TCS', // Extracted from chat
          source: 'USER_CONFIRMED'
        }
      ]
    };

    // Emit the verified identity back to WAANDA/KIMMP for memory storage
    urgiEventBus.emitIdentityVerified(cip);
  }
}

export const eqoreExecutor = new EqoreExecutor();
