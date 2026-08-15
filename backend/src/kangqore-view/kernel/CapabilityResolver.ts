import { CapabilityRegistry } from './CapabilityRegistry';

export class CapabilityResolver {
  /**
   * Resolves the best available provider for a given capability name.
   * Providers are ordered by priority (lower number = higher priority).
   */
  static async resolveBestProvider(capabilityName: string) {
    const capability = await CapabilityRegistry.getCapabilityByName(capabilityName);
    
    if (!capability || !capability.isEnabled) {
      throw new Error(`Capability "${capabilityName}" not found or disabled in registry.`);
    }

    // Filter to healthy providers and sort by priority (already sorted by repository)
    const healthyProviders = capability.providers.filter(p => p.healthStatus === 'healthy');

    if (healthyProviders.length === 0) {
      throw new Error(`No healthy providers found for capability "${capabilityName}".`);
    }

    return healthyProviders[0];
  }
}
