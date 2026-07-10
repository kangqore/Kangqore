import { urgiEventBus } from '../events/eventBus';
import { ConfirmedIdentityProfile } from '../models/urgi.types';
import { prisma } from '../../../lib/prisma';

// PII fields that must never be stored regardless of consent
const BANNED_FIELDS = [
  'socialSecurityNumber', 'nationalIdNumber', 'passportNumber',
  'politicalAffiliation', 'healthCondition', 'medicalHistory',
  'biometricData', 'geneticData', 'religiousBelief', 'sexualOrientation',
]

export class GovernanceEngine {
  constructor() {
    urgiEventBus.on('URGI:IDENTITY_VERIFIED', this.enforcePolicies.bind(this));
  }

  private async enforcePolicies(cip: ConfirmedIdentityProfile) {
    // 1. Consent check — reject if visitor has an explicit opt-out evidence record
    const hasConsent = await this.checkUserConsent(cip.visitorId);
    if (!hasConsent) {
      console.warn(`[Governance] Rejected ${cip.visitorId}: explicit opt-out on record`);
      return;
    }

    // 2. PII field policy — strip banned fields regardless of consent
    const allowedFacts = cip.verifiedFacts.filter(fact => this.isFieldAllowed(fact.factKey));
    if (allowedFacts.length === 0) {
      console.warn(`[Governance] All facts rejected by field policy for ${cip.visitorId}`);
      return;
    }

    // 3. Emit approved data with banned fields removed
    urgiEventBus.emitGovernanceCheckPassed({ ...cip, verifiedFacts: allowedFacts });
  }

  private async checkUserConsent(visitorId: string): Promise<boolean> {
    try {
      const profile = await prisma.unifiedRelationshipProfile.findFirst({
        where: { visitorId },
        select: { id: true },
      });
      if (!profile) return true; // No profile = no opt-out on record

      const optOut = await prisma.evidenceLedger.findFirst({
        where: { profileId: profile.id, factKey: 'privacy_opt_out', factValue: 'true' },
        select: { id: true },
      });
      return !optOut;
    } catch {
      // If the query fails, default to allowing (fail-open for B2B analytics)
      return true;
    }
  }

  private isFieldAllowed(factKey: string): boolean {
    return !BANNED_FIELDS.includes(factKey);
  }
}

export const governanceEngine = new GovernanceEngine();
