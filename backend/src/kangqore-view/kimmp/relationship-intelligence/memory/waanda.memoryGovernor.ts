import { urgiEventBus } from '../events/eventBus';
import { ConfirmedIdentityProfile } from '../models/urgi.types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * WAANDA - Memory Governance
 * Subscribes to verified identity events from eQORE.
 * Enforces the strict rule: Only verified information becomes permanent memory.
 */
export class WaandaMemoryGovernor {
  
  constructor() {
    urgiEventBus.on(
      'URGI:GOVERNANCE_CHECK_PASSED', 
      this.handleGovernancePassed.bind(this)
    );
  }

  private async handleGovernancePassed(cip: ConfirmedIdentityProfile) {
    // 1. Find or create the Unified Relationship Profile
    const profile = await prisma.unifiedRelationshipProfile.upsert({
      where: { visitorId: cip.visitorId },
      update: {},
      create: { visitorId: cip.visitorId }
    });

    // 2. Persist mutable Memory and immutable Evidence Ledger
    for (const fact of cip.verifiedFacts) {
      // Create Evidence Ledger Entry (Immutable Audit Trail)
      await prisma.evidenceLedger.create({
        data: {
          profileId: profile.id,
          factKey: fact.factKey,
          factValue: fact.factValue,
          source: fact.source,
          confidenceScore: 1.0, // Confirmed = 100%
          evidenceType: 'VERIFIED'
        }
      });

      // Update Mutable Memory State
      if (fact.factKey === 'company') {
        await prisma.unifiedRelationshipProfile.update({
          where: { id: profile.id },
          data: { currentCompany: fact.factValue }
        });
      } else if (fact.factKey === 'role') {
        await prisma.unifiedRelationshipProfile.update({
          where: { id: profile.id },
          data: { currentRole: fact.factValue }
        });
      }
    }

    // 3. Create immutable Timeline Event
    await prisma.relationshipTimelineEvent.create({
      data: {
        profileId: profile.id,
        eventType: 'IDENTITY_VERIFIED',
        description: `Verified ${cip.verifiedFacts.length} facts via Invisible Verification.`,
        metadata: JSON.parse(JSON.stringify(cip.verifiedFacts))
      }
    });

    // 4. Broadcast Memory Updated Event for external consumers (CRM, KVIS, Notifications)
    urgiEventBus.emitRelationshipMemoryUpdated(profile.id);
  }
}

export const waandaMemoryGovernor = new WaandaMemoryGovernor();
