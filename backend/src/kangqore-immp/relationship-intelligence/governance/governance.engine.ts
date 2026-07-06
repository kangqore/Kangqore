import { urgiEventBus } from '../events/eventBus';
import { ConfirmedIdentityProfile } from '../models/urgi.types';

/**
 * URGI - Governance Engine
 * Acts as middleware before data reaches the Memory Governor.
 * Enforces Consent, Retention, and Policy Rules.
 */
export class GovernanceEngine {
  
  constructor() {
    urgiEventBus.on(
      'URGI:IDENTITY_VERIFIED', 
      this.enforcePolicies.bind(this)
    );
  }

  private enforcePolicies(cip: ConfirmedIdentityProfile) {
    // 1. Consent Check (Stub)
    const userHasConsent = this.checkUserConsent(cip.visitorId);
    
    if (!userHasConsent) {
      console.warn(`[Governance] Data rejected for visitor ${cip.visitorId}: No Consent.`);
      return;
    }

    // 2. Allowed Fields Policy (Stub)
    // E.g., HIPAA compliance, or regional PII restrictions
    const allowedFacts = cip.verifiedFacts.filter(fact => this.isFieldAllowed(fact.factKey));

    if (allowedFacts.length === 0) {
      console.warn(`[Governance] All verified facts rejected by policy for ${cip.visitorId}.`);
      return;
    }

    // 3. Emit Approved Data
    const approvedCip: ConfirmedIdentityProfile = {
      ...cip,
      verifiedFacts: allowedFacts
    };

    urgiEventBus.emitGovernanceCheckPassed(approvedCip);
  }

  private checkUserConsent(visitorId: string): boolean {
    // In reality, this queries the user's explicit opt-in preferences.
    return true; 
  }

  private isFieldAllowed(factKey: string): boolean {
    const BANNED_FIELDS = ['socialSecurityNumber', 'politicalAffiliation', 'healthCondition'];
    return !BANNED_FIELDS.includes(factKey);
  }
}

export const governanceEngine = new GovernanceEngine();
