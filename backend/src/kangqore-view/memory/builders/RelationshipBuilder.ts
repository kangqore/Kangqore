import { prisma } from '../../../lib/prisma';
import { RelationshipContext } from '../types';

export class RelationshipBuilder {
  /**
   * PURE FUNCTION: Reads only, never mutates.
   * Assembles the RelationshipContext for a given profileId.
   */
  static async build(profileId: string): Promise<RelationshipContext | undefined> {
    const profile = await prisma.unifiedRelationshipProfile.findUnique({
      where: { id: profileId }
    });

    if (!profile) return undefined;

    return {
      metadata: {
        confidence: 'HIGH', // URGI data is built on Trusted Knowledge
        freshness: 'LIVE',
        sourceReference: `urgi_unified_relationship_profiles#${profile.id}`
      },
      profileId: profile.id,
      trustScore: profile.trustScore,
      relationshipScore: profile.relationshipScore,
      stages: ['DISCOVERED', 'IDENTIFIED'] // Example static mapping for now
    };
  }
}
