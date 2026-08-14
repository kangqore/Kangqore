import { ExecutiveContextPackage, ContextManifest } from './types';
import { KoreRuntimeManager } from '../kore/KoreRuntimeManager';
import { KoreQuery } from '../kore/types';

export class ContextOrchestrator {
  /**
   * Enterprise Memory assembles context directly from the KORE Runtime.
   * It no longer requests URGI or Awareness to 'build' context; it queries the Canonical Twins.
   */
  static async assembleExecutiveContext(profileId: string): Promise<ExecutiveContextPackage> {
    console.log(`[Enterprise Memory] Initiating Executive Context Assembly for Profile: ${profileId}`);
    const startTime = Date.now();

    // Query Canonical Twins via KQL (KORE Query Language)
    const personQuery: KoreQuery = { type: 'PERSON', where: { profileId } };
    const organizationQuery: KoreQuery = { type: 'ORGANIZATION' };
    const marketQuery: KoreQuery = { type: 'MARKET' };
    const policyQuery: KoreQuery = { type: 'POLICY' };

    // In a real execution, these would run concurrently
    const [people, organizations, markets, policies] = await Promise.all([
      Promise.resolve(KoreRuntimeManager.query(personQuery)),
      Promise.resolve(KoreRuntimeManager.query(organizationQuery)),
      Promise.resolve(KoreRuntimeManager.query(marketQuery)),
      Promise.resolve(KoreRuntimeManager.query(policyQuery))
    ]);

    // Map Twins back to the legacy ExecutiveContextPackage format (for backwards compatibility with WAANDA)
    const relationship: any = people.length > 0 ? { metadata: { confidence: 'HIGH' }, profile: people[0].state } : undefined;
    const organization: any = organizations.length > 0 ? { metadata: { confidence: 'HIGH' }, data: organizations[0].state } : undefined;
    const policy: any = policies.length > 0 ? { metadata: { confidence: 'HIGH' }, data: policies[0].state } : undefined;
    const awareness: any = markets.length > 0 ? { metadata: { confidence: 'HIGH' }, data: markets[0].state } : undefined;

    // Construct the Manifest
    const manifest: ContextManifest = {
      generatedBy: ['ContextOrchestrator'],
      sourceSystems: ['KORE_RUNTIME'],
      builderVersions: {
        KoreRuntime: 'v1.0'
      },
      assemblyTimeMs: Date.now() - startTime,
      packageVersion: 'v1.1'
    };

    let components = 0;
    if (relationship) components++;
    if (organization) components++;
    if (policy) components++;
    if (awareness) components++;
    const completenessScore = components / 4.0;

    const contextPackage: ExecutiveContextPackage = {
      manifest,
      completenessScore,
      overallConfidence: 'HIGH', // Aggregated mock
      relationship,
      organization,
      policy,
      awareness
    };

    console.log(`[Enterprise Memory] Assembly Complete via KORE Runtime. Completeness: ${completenessScore * 100}%, Time: ${manifest.assemblyTimeMs}ms`);
    return contextPackage;
  }
}
